const { query, execute } = require('../config/database');
const emailService = require('../utils/emailService');
const { USER_ROLES, ETHIOPIAN_SUBJECTS, DIRECTOR_GRADE_ACCESS, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const getStudents = async (req, res) => {
    try {
        const user = req.user;
        const { grade, section, stream, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT s.id, s.fav_id, s.grade, s.section, s.stream, s.created_at,
                   u.full_name, u.email, u.phone, u.profile_image, u.is_active,
                   COUNT(DISTINCT a.id) as assignment_count,
                   COUNT(DISTINCT q.id) as quiz_count,
                   COALESCE(AVG(asub.score), 0) as avg_score
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN assignments a ON s.grade = a.grade AND s.section = a.section
            LEFT JOIN quizzes q ON s.grade = q.grade AND s.section = q.section
            LEFT JOIN assignment_submissions asub ON s.user_id = asub.student_id
            WHERE u.role = 'student'
        `;
        const queryParams = [];

        if (grade) {
            baseQuery += ' AND s.grade = ?';
            queryParams.push(grade);
        }

        if (section) {
            baseQuery += ' AND s.section = ?';
            queryParams.push(section);
        }

        if (stream) {
            baseQuery += ' AND s.stream = ?';
            queryParams.push(stream);
        }

        if (search) {
            baseQuery += ' AND (u.full_name LIKE ? OR s.fav_id LIKE ? OR u.email LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            baseQuery += ' AND s.grade BETWEEN ? AND ?';
            queryParams.push(gradeRange.min, gradeRange.max);
        } else if (user.role === USER_ROLES.TEACHER) {
            const [assignments] = await query(
                'SELECT DISTINCT grade, section FROM teacher_assignments WHERE teacher_id = ?',
                [user.id]
            );
            
            if (assignments.length > 0) {
                const gradeConditions = assignments.map(a => '(s.grade = ? AND s.section = ?)').join(' OR ');
                baseQuery += ` AND (${gradeConditions})`;
                
                assignments.forEach(a => {
                    queryParams.push(a.grade, a.section);
                });
            } else {
                baseQuery += ' AND 1=0';
            }
        } else if (user.role === USER_ROLES.STUDENT) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied'
            });
        }

        baseQuery += ' GROUP BY s.id, u.id ORDER BY s.grade, s.section, u.full_name LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const students = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE u.role = 'student'
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: students,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get students error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch students'
        });
    }
};

const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const queryStr = `
            SELECT s.*, 
                   u.full_name, u.email, u.phone, u.profile_image, u.language, u.is_active, u.created_at as user_created,
                   GROUP_CONCAT(DISTINCT pcl.parent_id) as linked_parents
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN parent_child_links pcl ON s.user_id = pcl.student_id AND pcl.status = 'approved'
            WHERE s.id = ?
            GROUP BY s.id, u.id
        `;

        const [student] = await query(queryStr, [id]);

        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (user.role === USER_ROLES.STUDENT && user.id !== student.user_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied'
            });
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            if (student.grade < gradeRange.min || student.grade > gradeRange.max) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this student'
                });
            }
        } else if (user.role === USER_ROLES.TEACHER) {
            const [access] = await query(
                'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ? AND section = ?',
                [user.id, student.grade, student.section]
            );
            
            if (!access) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this student'
                });
            }
        }

        const [grades] = await query(`
            SELECT 
                a.subject,
                AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as avg_assignment_score,
                AVG(CASE WHEN qa.score IS NOT NULL THEN qa.score END) as avg_quiz_score,
                COUNT(DISTINCT asub.id) as assignments_submitted,
                COUNT(DISTINCT qa.id) as quizzes_taken
            FROM students s
            LEFT JOIN assignments a ON s.grade = a.grade AND s.section = a.section
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = s.user_id
            LEFT JOIN quizzes q ON s.grade = q.grade AND s.section = q.section
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = s.user_id
            WHERE s.id = ?
            GROUP BY a.subject
        `, [id]);

        const [recentActivity] = await query(`
            (SELECT 'assignment' as type, a.title, asub.submitted_at as date, asub.score
             FROM assignment_submissions asub
             JOIN assignments a ON asub.assignment_id = a.id
             WHERE asub.student_id = ? AND asub.submitted_at IS NOT NULL
             ORDER BY asub.submitted_at DESC LIMIT 5)
            UNION
            (SELECT 'quiz' as type, q.title, qa.submitted_at as date, qa.score
             FROM quiz_attempts qa
             JOIN quizzes q ON qa.quiz_id = q.id
             WHERE qa.student_id = ?
             ORDER BY qa.submitted_at DESC LIMIT 5)
            ORDER BY date DESC LIMIT 10
        `, [student.user_id, student.user_id]);

        student.grades_summary = grades;
        student.recent_activity = recentActivity;
        student.linked_parents = student.linked_parents ? student.linked_parents.split(',').map(Number) : [];

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: student
        });

    } catch (error) {
        console.error('Get student by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student details'
        });
    }
};

const getStudentByFavId = async (req, res) => {
    try {
        const { fav_id } = req.params;

        const [student] = await query(`
            SELECT s.*, u.full_name, u.email, u.phone, u.profile_image
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.fav_id = ? AND u.is_active = 1
        `, [fav_id.toUpperCase()]);

        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found with this FAV/ID'
            });
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                id: student.id,
                fav_id: student.fav_id,
                full_name: student.full_name,
                grade: student.grade,
                section: student.section,
                stream: student.stream,
                email: student.email
            }
        });

    } catch (error) {
        console.error('Get student by FAV ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student'
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = req.user;

        const [student] = await query('SELECT s.*, u.role FROM students s JOIN users u ON s.user_id = u.id WHERE s.id = ?', [id]);
        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (user.role === USER_ROLES.STUDENT && user.id !== student.user_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot update other students'
            });
        }

        const allowedFields = ['fav_id', 'grade', 'section', 'stream'];
        const filteredUpdates = {};

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        });

        if (updates.full_name || updates.phone || updates.email || updates.language) {
            const userUpdates = {};
            if (updates.full_name) userUpdates.full_name = updates.full_name;
            if (updates.phone) userUpdates.phone = updates.phone;
            if (updates.email) userUpdates.email = updates.email;
            if (updates.language) userUpdates.language = updates.language;

            if (Object.keys(userUpdates).length > 0) {
                const userSetClause = Object.keys(userUpdates).map(field => `${field} = ?`).join(', ');
                const userValues = Object.values(userUpdates);
                userValues.push(student.user_id);

                await execute(
                    `UPDATE users SET ${userSetClause} WHERE id = ?`,
                    userValues
                );
            }
        }

        if (Object.keys(filteredUpdates).length > 0) {
            const setClause = Object.keys(filteredUpdates).map(field => `${field} = ?`).join(', ');
            const values = Object.values(filteredUpdates);
            values.push(id);

            await execute(
                `UPDATE students SET ${setClause} WHERE id = ?`,
                values
            );
        }

        const [updatedStudent] = await query(`
            SELECT s.*, u.full_name, u.email, u.phone, u.language, u.profile_image
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `, [id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });

    } catch (error) {
        console.error('Update student error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update student'
        });
    }
};

const getStudentSubjects = async (req, res) => {
    try {
        const studentId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.id;

        const [student] = await query('SELECT grade, stream FROM students WHERE user_id = ?', [studentId]);
        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        let subjects = [];
        if (student.grade === 9 || student.grade === 10) {
            subjects = ETHIOPIAN_SUBJECTS[student.grade];
        } else if (student.grade === 11 || student.grade === 12) {
            subjects = ETHIOPIAN_SUBJECTS[student.grade][student.stream];
        }

        const [teacherAssignments] = await query(`
            SELECT DISTINCT a.subject, 
                   GROUP_CONCAT(DISTINCT CONCAT(u.full_name, ' (', t.teacher_id, ')')) as teachers
            FROM assignments a
            LEFT JOIN users u ON a.teacher_id = u.id
            LEFT JOIN teachers t ON u.id = t.user_id
            WHERE a.grade = ? AND a.section = (SELECT section FROM students WHERE user_id = ?)
            GROUP BY a.subject
        `, [student.grade, studentId]);

        const subjectDetails = subjects.map(subject => {
            const teacherAssignment = teacherAssignments.find(ta => ta.subject === subject);
            return {
                subject: subject,
                teacher: teacherAssignment ? teacherAssignment.teachers : null,
                is_core: ['Mathematics', 'English', 'Amharic'].includes(subject)
            };
        });

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                grade: student.grade,
                stream: student.stream,
                subjects: subjectDetails
            }
        });

    } catch (error) {
        console.error('Get student subjects error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student subjects'
        });
    }
};

const getStudentAssignments = async (req, res) => {
    try {
        const studentId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.id;
        const { status, subject, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const [student] = await query('SELECT grade, section FROM students WHERE user_id = ?', [studentId]);
        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        let baseQuery = `
            SELECT a.*, 
                   asub.id as submission_id, 
                   asub.submitted_at, 
                   asub.file_url, 
                   asub.score, 
                   asub.feedback,
                   asub.status as submission_status,
                   u.full_name as teacher_name,
                   t.teacher_id,
                   CASE 
                       WHEN asub.id IS NOT NULL THEN 'submitted'
                       WHEN a.due_date < NOW() THEN 'overdue'
                       ELSE 'pending'
                   END as overall_status
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
            LEFT JOIN users u ON a.teacher_id = u.id
            LEFT JOIN teachers t ON u.id = t.user_id
            WHERE a.grade = ? AND a.section = ?
        `;
        const queryParams = [studentId, student.grade, student.section];

        if (status) {
            if (status === 'pending') {
                baseQuery += ' AND asub.id IS NULL AND a.due_date >= NOW()';
            } else if (status === 'submitted') {
                baseQuery += ' AND asub.id IS NOT NULL';
            } else if (status === 'overdue') {
                baseQuery += ' AND asub.id IS NULL AND a.due_date < NOW()';
            }
        }

        if (subject) {
            baseQuery += ' AND a.subject = ?';
            queryParams.push(subject);
        }

        baseQuery += ' ORDER BY a.due_date ASC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const assignments = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM assignments a
            WHERE a.grade = ? AND a.section = ?
        `;
        const countParams = [student.grade, student.section];

        if (subject) {
            countQuery += ' AND a.subject = ?';
            countParams.push(subject);
        }

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
        console.error('Get student assignments error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student assignments'
        });
    }
};

const getStudentQuizzes = async (req, res) => {
    try {
        const studentId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.id;
        const { status, subject, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const [student] = await query('SELECT grade, section FROM students WHERE user_id = ?', [studentId]);
        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        let baseQuery = `
            SELECT q.*, 
                   qa.id as attempt_id, 
                   qa.started_at, 
                   qa.submitted_at, 
                   qa.score, 
                   qa.status as attempt_status,
                   u.full_name as teacher_name,
                   t.teacher_id,
                   CASE 
                       WHEN qa.id IS NOT NULL THEN 'attempted'
                       WHEN q.start_time > NOW() THEN 'upcoming'
                       WHEN q.start_time <= NOW() AND q.end_time >= NOW() THEN 'active'
                       ELSE 'expired'
                   END as overall_status
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
            LEFT JOIN users u ON q.created_by = u.id
            LEFT JOIN teachers t ON u.id = t.user_id
            WHERE q.grade = ? AND q.section = ?
        `;
        const queryParams = [studentId, student.grade, student.section];

        if (status) {
            if (status === 'upcoming') {
                baseQuery += ' AND q.start_time > NOW()';
            } else if (status === 'active') {
                baseQuery += ' AND q.start_time <= NOW() AND q.end_time >= NOW()';
            } else if (status === 'attempted') {
                baseQuery += ' AND qa.id IS NOT NULL';
            } else if (status === 'expired') {
                baseQuery += ' AND q.end_time < NOW() AND qa.id IS NULL';
            }
        }

        if (subject) {
            baseQuery += ' AND q.subject = ?';
            queryParams.push(subject);
        }

        baseQuery += ' ORDER BY q.start_time DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const quizzes = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM quizzes q
            WHERE q.grade = ? AND q.section = ?
        `;
        const countParams = [student.grade, student.section];

        if (subject) {
            countQuery += ' AND q.subject = ?';
            countParams.push(subject);
        }

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: quizzes,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get student quizzes error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student quizzes'
        });
    }
};

const getStudentProgress = async (req, res) => {
    try {
        const studentId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.id;

        const [student] = await query('SELECT grade, section, stream FROM students WHERE user_id = ?', [studentId]);
        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        const [assignmentStats] = await query(`
            SELECT 
                COUNT(DISTINCT a.id) as total_assignments,
                COUNT(DISTINCT asub.id) as submitted_assignments,
                AVG(asub.score) as avg_assignment_score,
                MAX(asub.score) as highest_score,
                MIN(asub.score) as lowest_score
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
            WHERE a.grade = ? AND a.section = ?
        `, [studentId, student.grade, student.section]);

        const [quizStats] = await query(`
            SELECT 
                COUNT(DISTINCT q.id) as total_quizzes,
                COUNT(DISTINCT qa.id) as attempted_quizzes,
                AVG(qa.score) as avg_quiz_score,
                MAX(qa.score) as highest_score,
                MIN(qa.score) as lowest_score
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
            WHERE q.grade = ? AND q.section = ?
        `, [studentId, student.grade, student.section]);

        const [subjectPerformance] = await query(`
            SELECT 
                a.subject,
                AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as avg_assignment_score,
                AVG(CASE WHEN qa.score IS NOT NULL THEN qa.score END) as avg_quiz_score,
                COUNT(DISTINCT asub.id) as assignments_count,
                COUNT(DISTINCT qa.id) as quizzes_count,
                (AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) + 
                 AVG(CASE WHEN qa.score IS NOT NULL THEN qa.score END)) / 2 as overall_score
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
            LEFT JOIN quizzes q ON a.subject = q.subject AND q.grade = ? AND q.section = ?
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
            WHERE a.grade = ? AND a.section = ?
            GROUP BY a.subject
            ORDER BY overall_score DESC
        `, [studentId, student.grade, student.section, studentId, student.grade, student.section]);

        const [attendanceStats] = await query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as sessions,
                SUM(TIMESTAMPDIFF(MINUTE, login_time, logout_time)) as total_minutes
            FROM user_sessions
            WHERE user_id = ? AND DATE(created_at) >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `, [studentId]);

        const [readingProgress] = await query(`
            SELECT 
                COUNT(DISTINCT b.id) as total_books,
                COUNT(DISTINCT rp.book_id) as books_read,
                SUM(rp.progress_percentage) as total_progress,
                AVG(rp.progress_percentage) as avg_progress
            FROM books b
            LEFT JOIN reading_progress rp ON b.id = rp.book_id AND rp.user_id = ?
            WHERE b.category = 'academic' AND (b.grade = ? OR b.grade IS NULL)
        `, [studentId, student.grade]);

        const progressData = {
            student_info: {
                grade: student.grade,
                section: student.section,
                stream: student.stream
            },
            assignments: assignmentStats,
            quizzes: quizStats,
            subject_performance: subjectPerformance,
            attendance: {
                recent_sessions: attendanceStats,
                total_days: attendanceStats.length,
                avg_minutes_per_day: attendanceStats.length > 0 ? 
                    attendanceStats.reduce((sum, day) => sum + (day.total_minutes || 0), 0) / attendanceStats.length : 0
            },
            reading: readingProgress,
            overall_progress: {
                assignment_completion: assignmentStats.total_assignments > 0 ? 
                    (assignmentStats.submitted_assignments / assignmentStats.total_assignments * 100).toFixed(2) : 0,
                quiz_completion: quizStats.total_quizzes > 0 ? 
                    (quizStats.attempted_quizzes / quizStats.total_quizzes * 100).toFixed(2) : 0,
                overall_score: subjectPerformance.length > 0 ? 
                    (subjectPerformance.reduce((sum, subj) => sum + (subj.overall_score || 0), 0) / subjectPerformance.length).toFixed(2) : 0
            }
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: progressData
        });

    } catch (error) {
        console.error('Get student progress error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student progress'
        });
    }
};

const getStudentParents = async (req, res) => {
    try {
        const { id } = req.params;

        const [student] = await query('SELECT user_id FROM students WHERE id = ?', [id]);
        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        const parents = await query(`
            SELECT p.id as parent_id, 
                   u.full_name, u.email, u.phone, u.profile_image,
                   pcl.status, pcl.created_at as linked_at,
                   pcl.student_approved
            FROM parent_child_links pcl
            JOIN parents p ON pcl.parent_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE pcl.student_id = ?
            ORDER BY pcl.created_at DESC
        `, [student.user_id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: parents
        });

    } catch (error) {
        console.error('Get student parents error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student parents'
        });
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const studentId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.id;
        const { startDate, endDate } = req.query;

        let queryStr = `
            SELECT 
                DATE(login_time) as date,
                COUNT(*) as sessions,
                MIN(login_time) as first_login,
                MAX(logout_time) as last_logout,
                SUM(TIMESTAMPDIFF(MINUTE, login_time, logout_time)) as total_minutes
            FROM user_sessions
            WHERE user_id = ?
        `;
        const params = [studentId];

        if (startDate) {
            queryStr += ' AND DATE(login_time) >= ?';
            params.push(startDate);
        }

        if (endDate) {
            queryStr += ' AND DATE(login_time) <= ?';
            params.push(endDate);
        }

        queryStr += ' GROUP BY DATE(login_time) ORDER BY date DESC LIMIT 30';

        const attendance = await query(queryStr, params);

        const summary = {
            total_days: attendance.length,
            total_sessions: attendance.reduce((sum, day) => sum + day.sessions, 0),
            total_minutes: attendance.reduce((sum, day) => sum + (day.total_minutes || 0), 0),
            avg_minutes_per_day: attendance.length > 0 ? 
                attendance.reduce((sum, day) => sum + (day.total_minutes || 0), 0) / attendance.length : 0,
            most_active_day: attendance.length > 0 ? 
                attendance.reduce((max, day) => day.total_minutes > max.total_minutes ? day : max) : null
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                daily_attendance: attendance,
                summary: summary
            }
        });

    } catch (error) {
        console.error('Get student attendance error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student attendance'
        });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    getStudentByFavId,
    updateStudent,
    getStudentSubjects,
    getStudentAssignments,
    getStudentQuizzes,
    getStudentProgress,
    getStudentParents,
    getStudentAttendance
};