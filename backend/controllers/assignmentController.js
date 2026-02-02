const { query, execute } = require('../config/database');
const { uploadFile, deleteFile } = require('../config/cloudinary');
const emailService = require('../utils/emailService');
const { USER_ROLES, ASSIGNMENT_STATUS, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const createAssignment = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { title, description, grade, section, subject, due_date, max_points, instructions } = req.body;

        const [teacher] = await query(
            'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ? AND section = ?',
            [teacherId, grade, section]
        );

        if (!teacher && req.user.role !== USER_ROLES.SUPER_ADMIN) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'You are not assigned to teach this grade and section'
            });
        }

        let fileUrl = null;
        let filePublicId = null;

        if (req.file) {
            const uploadResult = await uploadFile(req.file.path, 'falcon_academy/assignments');
            if (uploadResult.success) {
                fileUrl = uploadResult.url;
                filePublicId = uploadResult.public_id;
            } else {
                return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
                    success: false,
                    message: 'Failed to upload assignment file'
                });
            }
        }

        const result = await execute(
            `INSERT INTO assignments 
            (title, description, grade, section, subject, due_date, max_points, 
             instructions, file_url, file_public_id, teacher_id, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, grade, section, subject, due_date, max_points, 
             instructions, fileUrl, filePublicId, teacherId, teacherId]
        );

        const assignmentId = result.insertId;

        const [students] = await query(
            'SELECT s.user_id, u.full_name, u.email FROM students s JOIN users u ON s.user_id = u.id WHERE s.grade = ? AND s.section = ? AND u.is_active = 1',
            [grade, section]
        );

        for (const student of students) {
            await emailService.sendAssignmentNotification(
                student.email,
                student.full_name,
                title,
                subject,
                due_date,
                req.user.language || 'en'
            );
        }

        const [newAssignment] = await query(
            `SELECT a.*, u.full_name as teacher_name, t.teacher_id 
             FROM assignments a 
             JOIN users u ON a.teacher_id = u.id 
             LEFT JOIN teachers t ON u.id = t.user_id 
             WHERE a.id = ?`,
            [assignmentId]
        );

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Assignment created successfully',
            data: newAssignment
        });

    } catch (error) {
        console.error('Create assignment error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to create assignment'
        });
    }
};

const getAssignments = async (req, res) => {
    try {
        const user = req.user;
        const { grade, section, subject, status, teacher_id, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT a.*, 
                   u.full_name as teacher_name, 
                   t.teacher_id,
                   COUNT(DISTINCT asub.id) as submission_count,
                   AVG(asub.score) as avg_score,
                   CASE 
                       WHEN a.due_date < NOW() THEN 'overdue'
                       ELSE 'active'
                   END as overall_status
            FROM assignments a
            JOIN users u ON a.teacher_id = u.id
            LEFT JOIN teachers t ON u.id = t.user_id
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (grade) {
            baseQuery += ' AND a.grade = ?';
            queryParams.push(grade);
        }

        if (section) {
            baseQuery += ' AND a.section = ?';
            queryParams.push(section);
        }

        if (subject) {
            baseQuery += ' AND a.subject = ?';
            queryParams.push(subject);
        }

        if (teacher_id) {
            baseQuery += ' AND a.teacher_id = ?';
            queryParams.push(teacher_id);
        }

        if (status === 'active') {
            baseQuery += ' AND a.due_date >= NOW()';
        } else if (status === 'overdue') {
            baseQuery += ' AND a.due_date < NOW()';
        } else if (status === 'completed') {
            baseQuery += ' AND a.due_date < NOW()';
        }

        if (user.role === USER_ROLES.TEACHER) {
            baseQuery += ' AND a.teacher_id = ?';
            queryParams.push(user.id);
        } else if (user.role === USER_ROLES.STUDENT) {
            baseQuery += ' AND a.grade = ? AND a.section = ?';
            queryParams.push(user.grade, user.section);
        } else if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            baseQuery += ' AND a.grade BETWEEN ? AND ?';
            queryParams.push(gradeRange.min, gradeRange.max);
        }

        baseQuery += ' GROUP BY a.id ORDER BY a.due_date ASC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const assignments = await query(baseQuery, queryParams);

        assignments.forEach(assignment => {
            if (assignment.file_url) {
                assignment.file_url = getSignedURL(assignment.file_public_id);
            }
        });

        const countQuery = `
            SELECT COUNT(*) as total
            FROM assignments a
            WHERE 1=1
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: assignments,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get assignments error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch assignments'
        });
    }
};

const getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const [assignment] = await query(`
            SELECT a.*, 
                   u.full_name as teacher_name, 
                   t.teacher_id,
                   COUNT(DISTINCT asub.id) as submission_count,
                   AVG(asub.score) as avg_score,
                   COUNT(DISTINCT CASE WHEN asub.status = 'graded' THEN asub.id END) as graded_count
            FROM assignments a
            JOIN users u ON a.teacher_id = u.id
            LEFT JOIN teachers t ON u.id = t.user_id
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            WHERE a.id = ?
            GROUP BY a.id
        `, [id]);

        if (!assignment) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (user.role === USER_ROLES.STUDENT && (user.grade !== assignment.grade || user.section !== assignment.section)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to this assignment'
            });
        }

        if (user.role === USER_ROLES.TEACHER && user.id !== assignment.teacher_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other teachers\' assignments'
            });
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            if (assignment.grade < gradeRange.min || assignment.grade > gradeRange.max) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this assignment'
                });
            }
        }

        if (assignment.file_url) {
            assignment.file_url = getSignedURL(assignment.file_public_id);
        }

        const [submissions] = await query(`
            SELECT asub.*, 
                   u.full_name as student_name, 
                   s.fav_id,
                   s.grade,
                   s.section
            FROM assignment_submissions asub
            JOIN users u ON asub.student_id = u.id
            JOIN students s ON u.id = s.user_id
            WHERE asub.assignment_id = ?
            ORDER BY asub.submitted_at DESC
        `, [id]);

        assignment.submissions = submissions;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: assignment
        });

    } catch (error) {
        console.error('Get assignment by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch assignment details'
        });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;
        const updates = req.body;

        const [assignment] = await query('SELECT * FROM assignments WHERE id = ?', [id]);
        if (!assignment) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (req.user.role === USER_ROLES.TEACHER && assignment.teacher_id !== teacherId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot update other teachers\' assignments'
            });
        }

        const allowedFields = ['title', 'description', 'subject', 'due_date', 'max_points', 'instructions'];
        const filteredUpdates = {};

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        });

        let fileUrl = assignment.file_url;
        let filePublicId = assignment.file_public_id;

        if (req.file) {
            if (assignment.file_public_id) {
                await deleteFile(assignment.file_public_id);
            }

            const uploadResult = await uploadFile(req.file.path, 'falcon_academy/assignments');
            if (uploadResult.success) {
                fileUrl = uploadResult.url;
                filePublicId = uploadResult.public_id;
            }
        }

        if (Object.keys(filteredUpdates).length > 0 || req.file) {
            const setClause = Object.keys(filteredUpdates).map(field => `${field} = ?`).join(', ');
            const values = Object.values(filteredUpdates);
            
            if (req.file) {
                if (setClause) {
                    setClause += ', file_url = ?, file_public_id = ?';
                } else {
                    setClause = 'file_url = ?, file_public_id = ?';
                }
                values.push(fileUrl, filePublicId);
            }

            values.push(id);

            await execute(
                `UPDATE assignments SET ${setClause}, updated_at = NOW() WHERE id = ?`,
                values
            );
        }

        const [updatedAssignment] = await query(`
            SELECT a.*, u.full_name as teacher_name, t.teacher_id 
            FROM assignments a 
            JOIN users u ON a.teacher_id = u.id 
            LEFT JOIN teachers t ON u.id = t.user_id 
            WHERE a.id = ?
        `, [id]);

        if (updatedAssignment.file_url) {
            updatedAssignment.file_url = getSignedURL(updatedAssignment.file_public_id);
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Assignment updated successfully',
            data: updatedAssignment
        });

    } catch (error) {
        console.error('Update assignment error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update assignment'
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;

        const [assignment] = await query('SELECT * FROM assignments WHERE id = ?', [id]);
        if (!assignment) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (req.user.role === USER_ROLES.TEACHER && assignment.teacher_id !== teacherId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot delete other teachers\' assignments'
            });
        }

        if (assignment.file_public_id) {
            await deleteFile(assignment.file_public_id);
        }

        await execute('DELETE FROM assignments WHERE id = ?', [id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Assignment deleted successfully'
        });

    } catch (error) {
        console.error('Delete assignment error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete assignment'
        });
    }
};

const submitAssignment = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { assignment_id } = req.params;
        const { comments } = req.body;

        const [assignment] = await query('SELECT * FROM assignments WHERE id = ?', [assignment_id]);
        if (!assignment) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const [student] = await query('SELECT grade, section FROM students WHERE user_id = ?', [studentId]);
        if (!student || student.grade !== assignment.grade || student.section !== assignment.section) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'You are not enrolled in this assignment\'s class'
            });
        }

        const [existingSubmission] = await query(
            'SELECT * FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?',
            [assignment_id, studentId]
        );

        if (existingSubmission) {
            return res.status(API_RESPONSE_CODES.CONFLICT).json({
                success: false,
                message: 'Assignment already submitted'
            });
        }

        if (new Date() > new Date(assignment.due_date)) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Assignment submission is overdue'
            });
        }

        let fileUrl = null;
        let filePublicId = null;

        if (req.file) {
            const uploadResult = await uploadFile(req.file.path, 'falcon_academy/submissions');
            if (uploadResult.success) {
                fileUrl = uploadResult.url;
                filePublicId = uploadResult.public_id;
            } else {
                return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
                    success: false,
                    message: 'Failed to upload submission file'
                });
            }
        } else {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Submission file is required'
            });
        }

        const result = await execute(
            `INSERT INTO assignment_submissions 
            (assignment_id, student_id, file_url, file_public_id, comments, status) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [assignment_id, studentId, fileUrl, filePublicId, comments, ASSIGNMENT_STATUS.SUBMITTED]
        );

        const submissionId = result.insertId;

        const [teacher] = await query('SELECT u.email, u.full_name FROM users u WHERE u.id = ?', [assignment.teacher_id]);

        await emailService.sendSubmissionNotification(
            teacher.email,
            teacher.full_name,
            assignment.title,
            req.user.full_name,
            req.user.language || 'en'
        );

        const [submission] = await query(`
            SELECT asub.*, u.full_name as student_name, s.fav_id
            FROM assignment_submissions asub
            JOIN users u ON asub.student_id = u.id
            JOIN students s ON u.id = s.user_id
            WHERE asub.id = ?
        `, [submissionId]);

        if (submission.file_url) {
            submission.file_url = getSignedURL(submission.file_public_id);
        }

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Assignment submitted successfully',
            data: submission
        });

    } catch (error) {
        console.error('Submit assignment error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to submit assignment'
        });
    }
};

const gradeAssignment = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { submission_id } = req.params;
        const { score, feedback } = req.body;

        if (!score || score < 0) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Valid score is required'
            });
        }

        const [submission] = await query(`
            SELECT asub.*, a.*, a.teacher_id as assignment_teacher_id
            FROM assignment_submissions asub
            JOIN assignments a ON asub.assignment_id = a.id
            WHERE asub.id = ?
        `, [submission_id]);

        if (!submission) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Submission not found'
            });
        }

        if (req.user.role === USER_ROLES.TEACHER && submission.assignment_teacher_id !== teacherId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot grade other teachers\' assignments'
            });
        }

        if (submission.status === ASSIGNMENT_STATUS.GRADED) {
            return res.status(API_RESPONSE_CODES.CONFLICT).json({
                success: false,
                message: 'Submission already graded'
            });
        }

        if (score > submission.max_points) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: `Score cannot exceed maximum points (${submission.max_points})`
            });
        }

        await execute(
            'UPDATE assignment_submissions SET score = ?, feedback = ?, status = ?, graded_at = NOW() WHERE id = ?',
            [score, feedback, ASSIGNMENT_STATUS.GRADED, submission_id]
        );

        await execute(
            `INSERT INTO grades (student_id, assignment_id, subject, score, max_score, semester, teacher_id)
             VALUES (?, ?, ?, ?, ?, 'first_semester', ?)
             ON DUPLICATE KEY UPDATE score = ?, max_score = ?, updated_at = NOW()`,
            [submission.student_id, submission.assignment_id, submission.subject, score, submission.max_points, teacherId, score, submission.max_points]
        );

        const [student] = await query('SELECT u.email, u.full_name FROM users u WHERE u.id = ?', [submission.student_id]);
        const [parents] = await query(`
            SELECT u.email, u.full_name 
            FROM parent_child_links pcl
            JOIN parents p ON pcl.parent_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE pcl.student_id = ? AND pcl.status = 'approved'
        `, [submission.student_id]);

        await emailService.sendGradeNotification(
            student.email,
            student.full_name,
            submission.title,
            score,
            submission.max_points,
            feedback,
            req.user.language || 'en'
        );

        for (const parent of parents) {
            await emailService.sendParentGradeNotification(
                parent.email,
                parent.full_name,
                student.full_name,
                submission.title,
                score,
                submission.max_points,
                feedback,
                req.user.language || 'en'
            );
        }

        const [gradedSubmission] = await query(`
            SELECT asub.*, u.full_name as student_name, s.fav_id, s.grade, s.section
            FROM assignment_submissions asub
            JOIN users u ON asub.student_id = u.id
            JOIN students s ON u.id = s.user_id
            WHERE asub.id = ?
        `, [submission_id]);

        if (gradedSubmission.file_url) {
            gradedSubmission.file_url = getSignedURL(gradedSubmission.file_public_id);
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Assignment graded successfully',
            data: gradedSubmission
        });

    } catch (error) {
        console.error('Grade assignment error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to grade assignment'
        });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const user = req.user;
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const [assignment] = await query('SELECT * FROM assignments WHERE id = ?', [assignment_id]);
        if (!assignment) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (user.role === USER_ROLES.TEACHER && assignment.teacher_id !== user.id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other teachers\' assignments'
            });
        }

        if (user.role === USER_ROLES.STUDENT && (user.grade !== assignment.grade || user.section !== assignment.section)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other classes\' assignments'
            });
        }

        let baseQuery = `
            SELECT asub.*, 
                   u.full_name as student_name, 
                   s.fav_id,
                   s.grade,
                   s.section,
                   s.stream
            FROM assignment_submissions asub
            JOIN users u ON asub.student_id = u.id
            JOIN students s ON u.id = s.user_id
            WHERE asub.assignment_id = ?
        `;
        const queryParams = [assignment_id];

        if (status) {
            baseQuery += ' AND asub.status = ?';
            queryParams.push(status);
        }

        baseQuery += ' ORDER BY asub.submitted_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const submissions = await query(baseQuery, queryParams);

        submissions.forEach(submission => {
            if (submission.file_url) {
                submission.file_url = getSignedURL(submission.file_public_id);
            }
        });

        const countQuery = `
            SELECT COUNT(*) as total
            FROM assignment_submissions
            WHERE assignment_id = ?
        `;
        const countParams = [assignment_id];

        if (status) {
            countQuery += ' AND status = ?';
            countParams.push(status);
        }

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: submissions,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get submissions error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch submissions'
        });
    }
};

const getStudentSubmission = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const studentId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.student_id;

        const [submission] = await query(`
            SELECT asub.*, 
                   u.full_name as student_name, 
                   s.fav_id,
                   s.grade,
                   s.section,
                   a.title as assignment_title,
                   a.max_points
            FROM assignment_submissions asub
            JOIN users u ON asub.student_id = u.id
            JOIN students s ON u.id = s.user_id
            JOIN assignments a ON asub.assignment_id = a.id
            WHERE asub.assignment_id = ? AND asub.student_id = ?
        `, [assignment_id, studentId]);

        if (!submission) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Submission not found'
            });
        }

        if (req.user.role === USER_ROLES.STUDENT && req.user.id !== studentId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot view other students\' submissions'
            });
        }

        if (submission.file_url) {
            submission.file_url = getSignedURL(submission.file_public_id);
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: submission
        });

    } catch (error) {
        console.error('Get student submission error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch submission'
        });
    }
};

const getAssignmentAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const [assignment] = await query('SELECT * FROM assignments WHERE id = ?', [id]);
        if (!assignment) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        if (user.role === USER_ROLES.TEACHER && assignment.teacher_id !== user.id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other teachers\' assignments'
            });
        }

        const [students] = await query(
            'SELECT COUNT(*) as total_students FROM students WHERE grade = ? AND section = ?',
            [assignment.grade, assignment.section]
        );

        const [submissionStats] = await query(`
            SELECT 
                COUNT(*) as total_submissions,
                SUM(CASE WHEN status = 'graded' THEN 1 ELSE 0 END) as graded_count,
                AVG(score) as average_score,
                MAX(score) as highest_score,
                MIN(score) as lowest_score,
                STDDEV(score) as score_stddev
            FROM assignment_submissions
            WHERE assignment_id = ?
        `, [id]);

        const [scoreDistribution] = await query(`
            SELECT 
                CASE 
                    WHEN score >= 90 THEN 'A (90-100)'
                    WHEN score >= 80 THEN 'B (80-89)'
                    WHEN score >= 70 THEN 'C (70-79)'
                    WHEN score >= 60 THEN 'D (60-69)'
                    ELSE 'F (0-59)'
                END as grade_range,
                COUNT(*) as student_count
            FROM assignment_submissions
            WHERE assignment_id = ? AND score IS NOT NULL
            GROUP BY grade_range
            ORDER BY grade_range
        `, [id]);

        const [submissionTimeline] = await query(`
            SELECT 
                DATE(submitted_at) as submission_date,
                COUNT(*) as submissions_count
            FROM assignment_submissions
            WHERE assignment_id = ?
            GROUP BY DATE(submitted_at)
            ORDER BY submission_date
        `, [id]);

        const analytics = {
            assignment_info: {
                title: assignment.title,
                subject: assignment.subject,
                grade: assignment.grade,
                section: assignment.section,
                due_date: assignment.due_date,
                max_points: assignment.max_points
            },
            student_stats: {
                total_students: students.total_students,
                submission_rate: students.total_students > 0 ? 
                    (submissionStats.total_submissions / students.total_students * 100).toFixed(2) : 0,
                grading_completion: submissionStats.total_submissions > 0 ? 
                    (submissionStats.graded_count / submissionStats.total_submissions * 100).toFixed(2) : 0
            },
            performance_stats: submissionStats,
            score_distribution: scoreDistribution,
            submission_timeline: submissionTimeline,
            overdue_students: students.total_students - submissionStats.total_submissions
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get assignment analytics error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch assignment analytics'
        });
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeAssignment,
    getSubmissions,
    getStudentSubmission,
    getAssignmentAnalytics
};