const { query, execute } = require('../config/database');
const { USER_ROLES, ETHIOPIAN_SUBJECTS, DIRECTOR_GRADE_ACCESS, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const getTeachers = async (req, res) => {
    try {
        const user = req.user;
        const { grade, section, subject, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT t.id, t.teacher_id, t.created_at,
                   u.full_name, u.email, u.phone, u.profile_image, u.is_active,
                   GROUP_CONCAT(DISTINCT ts.subject) as subjects,
                   GROUP_CONCAT(DISTINCT CONCAT(ta.grade, '-', ta.section)) as assigned_classes,
                   COUNT(DISTINCT a.id) as assignment_count,
                   COUNT(DISTINCT q.id) as quiz_count
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN teacher_subjects ts ON t.user_id = ts.teacher_id
            LEFT JOIN teacher_assignments ta ON t.user_id = ta.teacher_id
            LEFT JOIN assignments a ON t.user_id = a.teacher_id
            LEFT JOIN quizzes q ON t.user_id = q.created_by
            WHERE u.role = 'teacher'
        `;
        const queryParams = [];

        if (grade) {
            baseQuery += ' AND ta.grade = ?';
            queryParams.push(grade);
        }

        if (section) {
            baseQuery += ' AND ta.section = ?';
            queryParams.push(section);
        }

        if (subject) {
            baseQuery += ' AND ts.subject = ?';
            queryParams.push(subject);
        }

        if (search) {
            baseQuery += ' AND (u.full_name LIKE ? OR t.teacher_id LIKE ? OR u.email LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            baseQuery += ' AND ta.grade BETWEEN ? AND ?';
            queryParams.push(gradeRange.min, gradeRange.max);
        }

        baseQuery += ' GROUP BY t.id, u.id ORDER BY u.full_name LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const teachers = await query(baseQuery, queryParams);

        teachers.forEach(teacher => {
            teacher.subjects = teacher.subjects ? teacher.subjects.split(',') : [];
            teacher.assigned_classes = teacher.assigned_classes ? teacher.assigned_classes.split(',') : [];
        });

        const countQuery = `
            SELECT COUNT(DISTINCT t.id) as total
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN teacher_assignments ta ON t.user_id = ta.teacher_id
            WHERE u.role = 'teacher'
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: teachers,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get teachers error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teachers'
        });
    }
};

const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const queryStr = `
            SELECT t.*, 
                   u.full_name, u.email, u.phone, u.profile_image, u.language, u.is_active, u.created_at as user_created,
                   GROUP_CONCAT(DISTINCT ts.subject) as subjects,
                   GROUP_CONCAT(DISTINCT CONCAT(ta.grade, '-', ta.section)) as assigned_classes
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN teacher_subjects ts ON t.user_id = ts.teacher_id
            LEFT JOIN teacher_assignments ta ON t.user_id = ta.teacher_id
            WHERE t.id = ?
            GROUP BY t.id, u.id
        `;

        const [teacher] = await query(queryStr, [id]);

        if (!teacher) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        if (user.role === USER_ROLES.TEACHER && user.id !== teacher.user_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied'
            });
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const assignments = teacher.assigned_classes ? teacher.assigned_classes.split(',') : [];
            const hasAccess = assignments.some(cls => {
                const [grade] = cls.split('-');
                const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
                return parseInt(grade) >= gradeRange.min && parseInt(grade) <= gradeRange.max;
            });
            
            if (!hasAccess && assignments.length > 0) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this teacher'
                });
            }
        }

        teacher.subjects = teacher.subjects ? teacher.subjects.split(',') : [];
        teacher.assigned_classes = teacher.assigned_classes ? teacher.assigned_classes.split(',').map(cls => {
            const [grade, section] = cls.split('-');
            return { grade: parseInt(grade), section };
        }) : [];

        const [assignmentStats] = await query(`
            SELECT 
                COUNT(DISTINCT a.id) as total_assignments,
                COUNT(DISTINCT asub.id) as total_submissions,
                AVG(asub.score) as avg_score,
                SUM(CASE WHEN asub.status = 'graded' THEN 1 ELSE 0 END) as graded_count
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            WHERE a.teacher_id = ?
        `, [teacher.user_id]);

        const [quizStats] = await query(`
            SELECT 
                COUNT(DISTINCT q.id) as total_quizzes,
                COUNT(DISTINCT qa.id) as total_attempts,
                AVG(qa.score) as avg_score
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE q.created_by = ?
        `, [teacher.user_id]);

        const [recentActivity] = await query(`
            (SELECT 'assignment' as type, a.title, a.created_at as date, COUNT(asub.id) as submissions
             FROM assignments a
             LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
             WHERE a.teacher_id = ?
             GROUP BY a.id
             ORDER BY a.created_at DESC LIMIT 5)
            UNION
            (SELECT 'quiz' as type, q.title, q.created_at as date, COUNT(qa.id) as attempts
             FROM quizzes q
             LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
             WHERE q.created_by = ?
             GROUP BY q.id
             ORDER BY q.created_at DESC LIMIT 5)
            ORDER BY date DESC LIMIT 10
        `, [teacher.user_id, teacher.user_id]);

        teacher.stats = {
            assignments: assignmentStats,
            quizzes: quizStats,
            recent_activity: recentActivity
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: teacher
        });

    } catch (error) {
        console.error('Get teacher by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teacher details'
        });
    }
};

const getTeacherByTeacherId = async (req, res) => {
    try {
        const { teacher_id } = req.params;

        const [teacher] = await query(`
            SELECT t.*, u.full_name, u.email, u.phone, u.profile_image, u.is_active
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            WHERE t.teacher_id = ? AND u.is_active = 1
        `, [teacher_id]);

        if (!teacher) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Teacher not found with this ID'
            });
        }

        const [subjects] = await query(
            'SELECT subject FROM teacher_subjects WHERE teacher_id = ?',
            [teacher.user_id]
        );

        const [assignments] = await query(`
            SELECT DISTINCT grade, section 
            FROM teacher_assignments 
            WHERE teacher_id = ?
        `, [teacher.user_id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                id: teacher.id,
                teacher_id: teacher.teacher_id,
                full_name: teacher.full_name,
                email: teacher.email,
                subjects: subjects.map(s => s.subject),
                assigned_classes: assignments.map(a => ({ grade: a.grade, section: a.section }))
            }
        });

    } catch (error) {
        console.error('Get teacher by teacher ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teacher'
        });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = req.user;

        const [teacher] = await query('SELECT t.*, u.role FROM teachers t JOIN users u ON t.user_id = u.id WHERE t.id = ?', [id]);
        if (!teacher) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        if (user.role === USER_ROLES.TEACHER && user.id !== teacher.user_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot update other teachers'
            });
        }

        const allowedFields = ['teacher_id'];
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
                userValues.push(teacher.user_id);

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
                `UPDATE teachers SET ${setClause} WHERE id = ?`,
                values
            );
        }

        if (updates.subjects && Array.isArray(updates.subjects)) {
            await execute('DELETE FROM teacher_subjects WHERE teacher_id = ?', [teacher.user_id]);
            for (const subject of updates.subjects) {
                await execute(
                    'INSERT INTO teacher_subjects (teacher_id, subject) VALUES (?, ?)',
                    [teacher.user_id, subject]
                );
            }
        }

        if (updates.grades && updates.sections && Array.isArray(updates.grades) && Array.isArray(updates.sections)) {
            await execute('DELETE FROM teacher_assignments WHERE teacher_id = ?', [teacher.user_id]);
            for (const grade of updates.grades) {
                for (const section of updates.sections) {
                    await execute(
                        'INSERT INTO teacher_assignments (teacher_id, grade, section) VALUES (?, ?, ?)',
                        [teacher.user_id, grade, section]
                    );
                }
            }
        }

        const [updatedTeacher] = await query(`
            SELECT t.*, 
                   u.full_name, u.email, u.phone, u.language, u.profile_image,
                   GROUP_CONCAT(DISTINCT ts.subject) as subjects,
                   GROUP_CONCAT(DISTINCT CONCAT(ta.grade, '-', ta.section)) as assigned_classes
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN teacher_subjects ts ON t.user_id = ts.teacher_id
            LEFT JOIN teacher_assignments ta ON t.user_id = ta.teacher_id
            WHERE t.id = ?
            GROUP BY t.id, u.id
        `, [id]);

        updatedTeacher.subjects = updatedTeacher.subjects ? updatedTeacher.subjects.split(',') : [];
        updatedTeacher.assigned_classes = updatedTeacher.assigned_classes ? updatedTeacher.assigned_classes.split(',') : [];

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Teacher updated successfully',
            data: updatedTeacher
        });

    } catch (error) {
        console.error('Update teacher error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update teacher'
        });
    }
};

const getTeacherAssignments = async (req, res) => {
    try {
        const teacherId = req.user.role === USER_ROLES.TEACHER ? req.user.id : req.params.id;
        const { grade, section, subject, status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT a.*,
                   COUNT(DISTINCT asub.id) as submission_count,
                   COUNT(DISTINCT CASE WHEN asub.status = 'graded' THEN asub.id END) as graded_count,
                   AVG(asub.score) as avg_score,
                   CASE 
                       WHEN a.due_date < NOW() AND COUNT(DISTINCT asub.id) < (SELECT COUNT(*) FROM students s WHERE s.grade = a.grade AND s.section = a.section) THEN 'overdue'
                       ELSE 'active'
                   END as overall_status
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            WHERE a.teacher_id = ?
        `;
        const queryParams = [teacherId];

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

        if (status === 'active') {
            baseQuery += ' AND a.due_date >= NOW()';
        } else if (status === 'overdue') {
            baseQuery += ' AND a.due_date < NOW()';
        } else if (status === 'completed') {
            baseQuery += ' AND a.due_date < NOW()';
        }

        baseQuery += ' GROUP BY a.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const assignments = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM assignments
            WHERE teacher_id = ?
        `;
        const countParams = [teacherId];

        if (grade) {
            countQuery += ' AND grade = ?';
            countParams.push(grade);
        }

        if (section) {
            countQuery += ' AND section = ?';
            countParams.push(section);
        }

        if (subject) {
            countQuery += ' AND subject = ?';
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
        console.error('Get teacher assignments error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teacher assignments'
        });
    }
};

const getTeacherQuizzes = async (req, res) => {
    try {
        const teacherId = req.user.role === USER_ROLES.TEACHER ? req.user.id : req.params.id;
        const { grade, section, subject, status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT q.*,
                   COUNT(DISTINCT qa.id) as attempt_count,
                   AVG(qa.score) as avg_score,
                   CASE 
                       WHEN q.end_time < NOW() THEN 'completed'
                       WHEN q.start_time <= NOW() AND q.end_time >= NOW() THEN 'active'
                       ELSE 'upcoming'
                   END as overall_status
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE q.created_by = ?
        `;
        const queryParams = [teacherId];

        if (grade) {
            baseQuery += ' AND q.grade = ?';
            queryParams.push(grade);
        }

        if (section) {
            baseQuery += ' AND q.section = ?';
            queryParams.push(section);
        }

        if (subject) {
            baseQuery += ' AND q.subject = ?';
            queryParams.push(subject);
        }

        if (status) {
            if (status === 'upcoming') {
                baseQuery += ' AND q.start_time > NOW()';
            } else if (status === 'active') {
                baseQuery += ' AND q.start_time <= NOW() AND q.end_time >= NOW()';
            } else if (status === 'completed') {
                baseQuery += ' AND q.end_time < NOW()';
            }
        }

        baseQuery += ' GROUP BY q.id ORDER BY q.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const quizzes = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM quizzes
            WHERE created_by = ?
        `;
        const countParams = [teacherId];

        if (grade) {
            countQuery += ' AND grade = ?';
            countParams.push(grade);
        }

        if (section) {
            countQuery += ' AND section = ?';
            countParams.push(section);
        }

        if (subject) {
            countQuery += ' AND subject = ?';
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
        console.error('Get teacher quizzes error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teacher quizzes'
        });
    }
};

const getTeacherStudents = async (req, res) => {
    try {
        const teacherId = req.user.role === USER_ROLES.TEACHER ? req.user.id : req.params.id;
        const { grade, section, subject, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT DISTINCT s.id, s.fav_id, s.grade, s.section, s.stream,
                   u.full_name, u.email, u.profile_image, u.is_active,
                   AVG(asub.score) as avg_score,
                   COUNT(DISTINCT asub.id) as assignment_count,
                   COUNT(DISTINCT qa.id) as quiz_count
            FROM teacher_assignments ta
            JOIN students s ON ta.grade = s.grade AND ta.section = s.section
            JOIN users u ON s.user_id = u.id
            LEFT JOIN assignments a ON ta.grade = a.grade AND ta.section = a.section AND a.subject = ?
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = s.user_id
            LEFT JOIN quizzes q ON ta.grade = q.grade AND ta.section = q.section AND q.subject = ?
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = s.user_id
            WHERE ta.teacher_id = ?
        `;
        const queryParams = [subject || 'Mathematics', subject || 'Mathematics', teacherId];

        if (grade) {
            baseQuery += ' AND s.grade = ?';
            queryParams.push(grade);
        }

        if (section) {
            baseQuery += ' AND s.section = ?';
            queryParams.push(section);
        }

        baseQuery += ' GROUP BY s.id, u.id ORDER BY s.grade, s.section, u.full_name LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const students = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(DISTINCT s.id) as total
            FROM teacher_assignments ta
            JOIN students s ON ta.grade = s.grade AND ta.section = s.section
            WHERE ta.teacher_id = ?
        `;
        const countParams = [teacherId];

        if (grade) {
            countQuery += ' AND s.grade = ?';
            countParams.push(grade);
        }

        if (section) {
            countQuery += ' AND s.section = ?';
            countParams.push(section);
        }

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
        console.error('Get teacher students error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teacher students'
        });
    }
};

const getTeacherAnalytics = async (req, res) => {
    try {
        const teacherId = req.user.role === USER_ROLES.TEACHER ? req.user.id : req.params.id;

        const [assignmentStats] = await query(`
            SELECT 
                COUNT(DISTINCT a.id) as total_assignments,
                SUM(CASE WHEN a.due_date < NOW() THEN 1 ELSE 0 END) as completed_assignments,
                AVG(a.max_points) as avg_max_points,
                COUNT(DISTINCT asub.id) as total_submissions,
                AVG(asub.score) as avg_score,
                SUM(CASE WHEN asub.status = 'graded' THEN 1 ELSE 0 END) as graded_submissions
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            WHERE a.teacher_id = ?
        `, [teacherId]);

        const [quizStats] = await query(`
            SELECT 
                COUNT(DISTINCT q.id) as total_quizzes,
                SUM(CASE WHEN q.end_time < NOW() THEN 1 ELSE 0 END) as completed_quizzes,
                AVG(q.duration_minutes) as avg_duration,
                COUNT(DISTINCT qa.id) as total_attempts,
                AVG(qa.score) as avg_score
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE q.created_by = ?
        `, [teacherId]);

        const [subjectPerformance] = await query(`
            SELECT 
                a.subject,
                COUNT(DISTINCT a.id) as assignment_count,
                COUNT(DISTINCT q.id) as quiz_count,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT asub.student_id) as unique_students
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            LEFT JOIN quizzes q ON a.subject = q.subject AND q.created_by = ?
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE a.teacher_id = ?
            GROUP BY a.subject
            ORDER BY assignment_count DESC
        `, [teacherId, teacherId]);

        const [classPerformance] = await query(`
            SELECT 
                CONCAT(a.grade, '-', a.section) as class,
                COUNT(DISTINCT a.id) as assignment_count,
                COUNT(DISTINCT q.id) as quiz_count,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT s.id) as student_count
            FROM teacher_assignments ta
            JOIN assignments a ON ta.grade = a.grade AND ta.section = a.section AND a.teacher_id = ?
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            LEFT JOIN quizzes q ON ta.grade = q.grade AND ta.section = q.section AND q.created_by = ?
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            LEFT JOIN students s ON ta.grade = s.grade AND ta.section = s.section
            WHERE ta.teacher_id = ?
            GROUP BY a.grade, a.section
        `, [teacherId, teacherId, teacherId]);

        const [recentActivity] = await query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as activities,
                GROUP_CONCAT(DISTINCT action) as action_types
            FROM user_activity
            WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `, [teacherId]);

        const analytics = {
            assignments: assignmentStats,
            quizzes: quizStats,
            subject_performance: subjectPerformance,
            class_performance: classPerformance,
            recent_activity: recentActivity,
            overall_metrics: {
                total_students: classPerformance.reduce((sum, cls) => sum + (cls.student_count || 0), 0),
                total_classes: classPerformance.length,
                total_subjects: subjectPerformance.length,
                avg_student_score: assignmentStats.avg_score && quizStats.avg_score ? 
                    ((assignmentStats.avg_score + quizStats.avg_score) / 2).toFixed(2) : null
            }
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get teacher analytics error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teacher analytics'
        });
    }
};

const getTeacherSchedule = async (req, res) => {
    try {
        const teacherId = req.user.role === USER_ROLES.TEACHER ? req.user.id : req.params.id;
        const { startDate, endDate } = req.query;

        let queryStr = `
            SELECT 
                ts.*,
                CONCAT(ts.grade, '-', ts.section) as class_name,
                ts.subject,
                ts.day_of_week,
                ts.start_time,
                ts.end_time,
                ts.room_number
            FROM teacher_schedule ts
            WHERE ts.teacher_id = ?
        `;
        const params = [teacherId];

        if (startDate && endDate) {
            queryStr += ' AND ts.schedule_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        queryStr += ' ORDER BY ts.day_of_week, ts.start_time';

        const schedule = await query(queryStr, params);

        const groupedSchedule = schedule.reduce((acc, item) => {
            const day = item.day_of_week;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(item);
            return acc;
        }, {});

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                schedule: schedule,
                grouped_schedule: groupedSchedule,
                total_classes: schedule.length,
                unique_subjects: [...new Set(schedule.map(item => item.subject))],
                unique_classes: [...new Set(schedule.map(item => item.class_name))]
            }
        });

    } catch (error) {
        console.error('Get teacher schedule error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch teacher schedule'
        });
    }
};

module.exports = {
    getTeachers,
    getTeacherById,
    getTeacherByTeacherId,
    updateTeacher,
    getTeacherAssignments,
    getTeacherQuizzes,
    getTeacherStudents,
    getTeacherAnalytics,
    getTeacherSchedule
};