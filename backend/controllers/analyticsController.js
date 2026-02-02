const { query, execute } = require('../config/database');
const { USER_ROLES, DIRECTOR_GRADE_ACCESS, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const getSystemAnalytics = async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== USER_ROLES.SUPER_ADMIN && 
            ![USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to system analytics'
            });
        }

        const [userStats] = await query(`
            SELECT 
                COUNT(*) as total_users,
                SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
                SUM(CASE WHEN role = 'teacher' THEN 1 ELSE 0 END) as teachers,
                SUM(CASE WHEN role = 'parent' THEN 1 ELSE 0 END) as parents,
                SUM(CASE WHEN role IN ('director_kidane', 'director_andargachew', 'director_zerihun') THEN 1 ELSE 0 END) as directors,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
                SUM(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as recent_users
            FROM users
            WHERE role != 'super_admin'
        `);

        const [gradeStats] = await query(`
            SELECT 
                grade,
                COUNT(*) as student_count,
                AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as avg_score,
                COUNT(DISTINCT s.user_id) as active_students
            FROM students s
            LEFT JOIN assignment_submissions asub ON s.user_id = asub.student_id
            GROUP BY grade
            ORDER BY grade
        `);

        const [activityStats] = await query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as activities,
                COUNT(DISTINCT user_id) as active_users
            FROM user_activity
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);

        const [assignmentStats] = await query(`
            SELECT 
                COUNT(*) as total_assignments,
                SUM(CASE WHEN due_date < NOW() THEN 1 ELSE 0 END) as completed_assignments,
                AVG(max_points) as avg_max_points,
                COUNT(DISTINCT teacher_id) as active_teachers
            FROM assignments
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        const [quizStats] = await query(`
            SELECT 
                COUNT(*) as total_quizzes,
                SUM(CASE WHEN end_time < NOW() THEN 1 ELSE 0 END) as completed_quizzes,
                AVG(duration_minutes) as avg_duration,
                COUNT(DISTINCT created_by) as active_quiz_creators
            FROM quizzes
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        const [libraryStats] = await query(`
            SELECT 
                COUNT(*) as total_books,
                SUM(CASE WHEN category = 'academic' THEN 1 ELSE 0 END) as academic_books,
                SUM(CASE WHEN category = 'fiction' THEN 1 ELSE 0 END) as fiction_books,
                AVG(page_count) as avg_pages,
                COUNT(DISTINCT uploaded_by) as active_uploaders
            FROM books
            WHERE approved = 1
        `);

        const analytics = {
            user_statistics: userStats,
            grade_statistics: gradeStats,
            activity_statistics: activityStats,
            assignment_statistics: assignmentStats,
            quiz_statistics: quizStats,
            library_statistics: libraryStats,
            system_health: {
                uptime: process.uptime(),
                memory_usage: process.memoryUsage(),
                active_connections: 0
            }
        };

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            analytics.filtered_grade_range = gradeRange;
            
            const [filteredGradeStats] = await query(`
                SELECT 
                    grade,
                    COUNT(*) as student_count,
                    AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as avg_score
                FROM students s
                LEFT JOIN assignment_submissions asub ON s.user_id = asub.student_id
                WHERE grade BETWEEN ? AND ?
                GROUP BY grade
                ORDER BY grade
            `, [gradeRange.min, gradeRange.max]);
            
            analytics.filtered_grade_statistics = filteredGradeStats;
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get system analytics error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch system analytics'
        });
    }
};

const getGradeAnalytics = async (req, res) => {
    try {
        const { grade } = req.params;
        const user = req.user;

        if (!grade || grade < 9 || grade > 12) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Valid grade (9-12) is required'
            });
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            if (grade < gradeRange.min || grade > gradeRange.max) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: `Access denied to grade ${grade}`
                });
            }
        }

        const [gradeInfo] = await query(`
            SELECT 
                COUNT(DISTINCT s.id) as total_students,
                COUNT(DISTINCT s.section) as sections_count,
                COUNT(DISTINCT ta.teacher_id) as teachers_count,
                AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as overall_avg_score
            FROM students s
            LEFT JOIN teacher_assignments ta ON s.grade = ta.grade AND s.section = ta.section
            LEFT JOIN assignment_submissions asub ON s.user_id = asub.student_id
            WHERE s.grade = ?
            GROUP BY s.grade
        `, [grade]);

        const [sectionStats] = await query(`
            SELECT 
                section,
                COUNT(DISTINCT s.id) as student_count,
                AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as avg_score,
                COUNT(DISTINCT a.id) as assignment_count,
                COUNT(DISTINCT q.id) as quiz_count
            FROM students s
            LEFT JOIN assignments a ON s.grade = a.grade AND s.section = a.section
            LEFT JOIN quizzes q ON s.grade = q.grade AND s.section = q.section
            LEFT JOIN assignment_submissions asub ON s.user_id = asub.student_id
            WHERE s.grade = ?
            GROUP BY s.section
            ORDER BY s.section
        `, [grade]);

        const [subjectPerformance] = await query(`
            SELECT 
                a.subject,
                COUNT(DISTINCT a.id) as assignment_count,
                COUNT(DISTINCT q.id) as quiz_count,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT s.id) as student_count
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            LEFT JOIN quizzes q ON a.subject = q.subject AND a.grade = q.grade
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            LEFT JOIN students s ON a.grade = s.grade AND a.section = s.section
            WHERE a.grade = ?
            GROUP BY a.subject
            ORDER BY avg_assignment_score DESC
        `, [grade]);

        const [teacherPerformance] = await query(`
            SELECT 
                u.full_name as teacher_name,
                t.teacher_id,
                COUNT(DISTINCT a.id) as assignment_count,
                COUNT(DISTINCT q.id) as quiz_count,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT ta.section) as sections_count
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            JOIN teacher_assignments ta ON t.user_id = ta.teacher_id
            LEFT JOIN assignments a ON t.user_id = a.teacher_id AND a.grade = ?
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            LEFT JOIN quizzes q ON t.user_id = q.created_by AND q.grade = ?
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE ta.grade = ?
            GROUP BY t.id, u.full_name, t.teacher_id
            ORDER BY avg_assignment_score DESC
        `, [grade, grade, grade]);

        const [attendanceStats] = await query(`
            SELECT 
                DATE(us.login_time) as date,
                COUNT(DISTINCT us.user_id) as active_students,
                AVG(TIMESTAMPDIFF(MINUTE, us.login_time, us.logout_time)) as avg_session_minutes
            FROM user_sessions us
            JOIN students s ON us.user_id = s.user_id
            WHERE s.grade = ? AND DATE(us.login_time) >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(us.login_time)
            ORDER BY date DESC
        `, [grade]);

        const analytics = {
            grade_info: {
                grade: grade,
                ...gradeInfo
            },
            section_statistics: sectionStats,
            subject_performance: subjectPerformance,
            teacher_performance: teacherPerformance,
            attendance_statistics: attendanceStats,
            summary: {
                total_sections: sectionStats.length,
                total_subjects: subjectPerformance.length,
                total_teachers: teacherPerformance.length,
                overall_performance: gradeInfo.overall_avg_score || 0
            }
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get grade analytics error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch grade analytics'
        });
    }
};

const getSectionAnalytics = async (req, res) => {
    try {
        const { grade, section } = req.params;
        const user = req.user;

        if (!grade || !section) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Grade and section are required'
            });
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            if (grade < gradeRange.min || grade > gradeRange.max) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: `Access denied to grade ${grade}`
                });
            }
        }

        if (user.role === USER_ROLES.TEACHER) {
            const [access] = await query(
                'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ? AND section = ?',
                [user.id, grade, section]
            );
            
            if (!access) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this section'
                });
            }
        }

        const [sectionInfo] = await query(`
            SELECT 
                COUNT(DISTINCT s.id) as total_students,
                COUNT(DISTINCT CASE WHEN s.stream IS NOT NULL THEN s.stream END) as streams_count,
                AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as overall_avg_score,
                COUNT(DISTINCT a.id) as total_assignments,
                COUNT(DISTINCT q.id) as total_quizzes
            FROM students s
            LEFT JOIN assignments a ON s.grade = a.grade AND s.section = a.section
            LEFT JOIN quizzes q ON s.grade = q.grade AND s.section = q.section
            LEFT JOIN assignment_submissions asub ON s.user_id = asub.student_id
            WHERE s.grade = ? AND s.section = ?
        `, [grade, section]);

        const [studentPerformance] = await query(`
            SELECT 
                s.id,
                u.full_name as student_name,
                s.fav_id,
                s.stream,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT asub.id) as assignments_submitted,
                COUNT(DISTINCT qa.id) as quizzes_attempted,
                RANK() OVER (ORDER BY (AVG(asub.score) + AVG(qa.score)) / 2 DESC) as rank
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN assignment_submissions asub ON s.user_id = asub.student_id
            LEFT JOIN quiz_attempts qa ON s.user_id = qa.student_id
            WHERE s.grade = ? AND s.section = ?
            GROUP BY s.id, u.full_name, s.fav_id, s.stream
            ORDER BY rank
        `, [grade, section]);

        const [subjectBreakdown] = await query(`
            SELECT 
                a.subject,
                COUNT(DISTINCT a.id) as assignment_count,
                COUNT(DISTINCT q.id) as quiz_count,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT s.id) as student_count,
                (AVG(asub.score) + AVG(qa.score)) / 2 as overall_score
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            LEFT JOIN quizzes q ON a.subject = q.subject AND a.grade = q.grade AND a.section = q.section
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            LEFT JOIN students s ON a.grade = s.grade AND a.section = s.section
            WHERE a.grade = ? AND a.section = ?
            GROUP BY a.subject
            ORDER BY overall_score DESC
        `, [grade, section]);

        const [assignmentTrends] = await query(`
            SELECT 
                DATE(a.created_at) as date,
                COUNT(DISTINCT a.id) as assignments_created,
                COUNT(DISTINCT asub.id) as submissions_received,
                AVG(asub.score) as avg_score,
                COUNT(DISTINCT CASE WHEN asub.status = 'graded' THEN asub.id END) as graded_count
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            WHERE a.grade = ? AND a.section = ? AND a.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(a.created_at)
            ORDER BY date DESC
        `, [grade, section]);

        const [attendanceTrends] = await query(`
            SELECT 
                DATE(us.login_time) as date,
                COUNT(DISTINCT us.user_id) as active_students,
                AVG(TIMESTAMPDIFF(MINUTE, us.login_time, us.logout_time)) as avg_session_minutes,
                MAX(TIMESTAMPDIFF(MINUTE, us.login_time, us.logout_time)) as max_session_minutes
            FROM user_sessions us
            JOIN students s ON us.user_id = s.user_id
            WHERE s.grade = ? AND s.section = ? AND DATE(us.login_time) >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(us.login_time)
            ORDER BY date DESC
        `, [grade, section]);

        const analytics = {
            section_info: {
                grade: grade,
                section: section,
                ...sectionInfo
            },
            student_performance: studentPerformance,
            subject_breakdown: subjectBreakdown,
            assignment_trends: assignmentTrends,
            attendance_trends: attendanceTrends,
            summary: {
                top_student: studentPerformance[0] || null,
                weakest_subject: subjectBreakdown[subjectBreakdown.length - 1] || null,
                strongest_subject: subjectBreakdown[0] || null,
                average_attendance: attendanceTrends.length > 0 ? 
                    (attendanceTrends.reduce((sum, day) => sum + day.active_students, 0) / attendanceTrends.length).toFixed(2) : 0
            }
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get section analytics error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch section analytics'
        });
    }
};

const getStudentAnalytics = async (req, res) => {
    try {
        const { student_id } = req.params;
        const user = req.user;

        const [student] = await query(`
            SELECT s.*, u.full_name, u.email, u.profile_image
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.user_id = ?
        `, [student_id]);

        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (user.role === USER_ROLES.STUDENT && user.id !== student_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot view other students\' analytics'
            });
        }

        if (user.role === USER_ROLES.TEACHER) {
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

        const [performanceSummary] = await query(`
            SELECT 
                COUNT(DISTINCT a.id) as total_assignments,
                COUNT(DISTINCT asub.id) as submitted_assignments,
                AVG(asub.score) as avg_assignment_score,
                MAX(asub.score) as highest_assignment_score,
                MIN(asub.score) as lowest_assignment_score,
                COUNT(DISTINCT q.id) as total_quizzes,
                COUNT(DISTINCT qa.id) as attempted_quizzes,
                AVG(qa.score) as avg_quiz_score,
                MAX(qa.score) as highest_quiz_score,
                MIN(qa.score) as lowest_quiz_score,
                (AVG(asub.score) + AVG(qa.score)) / 2 as overall_score
            FROM students s
            LEFT JOIN assignments a ON s.grade = a.grade AND s.section = a.section
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = s.user_id
            LEFT JOIN quizzes q ON s.grade = q.grade AND s.section = q.section
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = s.user_id
            WHERE s.user_id = ?
        `, [student_id]);

        const [subjectPerformance] = await query(`
            SELECT 
                a.subject,
                COUNT(DISTINCT a.id) as assignment_count,
                COUNT(DISTINCT asub.id) as submitted_count,
                AVG(asub.score) as avg_assignment_score,
                COUNT(DISTINCT q.id) as quiz_count,
                COUNT(DISTINCT qa.id) as attempted_count,
                AVG(qa.score) as avg_quiz_score,
                (AVG(asub.score) + AVG(qa.score)) / 2 as overall_score,
                RANK() OVER (ORDER BY (AVG(asub.score) + AVG(qa.score)) / 2 DESC) as subject_rank
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
            LEFT JOIN quizzes q ON a.subject = q.subject AND a.grade = q.grade AND a.section = q.section
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
            WHERE a.grade = ? AND a.section = ?
            GROUP BY a.subject
            ORDER BY overall_score DESC
        `, [student_id, student_id, student.grade, student.section]);

        const [progressTimeline] = await query(`
            SELECT 
                DATE(asub.submitted_at) as date,
                COUNT(DISTINCT asub.id) as assignments_submitted,
                AVG(asub.score) as avg_score,
                COUNT(DISTINCT qa.id) as quizzes_attempted,
                AVG(qa.score) as avg_quiz_score
            FROM assignment_submissions asub
            LEFT JOIN quiz_attempts qa ON DATE(qa.submitted_at) = DATE(asub.submitted_at) AND qa.student_id = ?
            WHERE asub.student_id = ? AND asub.submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(asub.submitted_at)
            ORDER BY date DESC
        `, [student_id, student_id]);

        const [attendanceStats] = await query(`
            SELECT 
                DATE(us.login_time) as date,
                COUNT(*) as sessions_count,
                SUM(TIMESTAMPDIFF(MINUTE, us.login_time, us.logout_time)) as total_minutes,
                MIN(us.login_time) as first_login,
                MAX(us.logout_time) as last_logout
            FROM user_sessions us
            WHERE us.user_id = ? AND us.login_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(us.login_time)
            ORDER BY date DESC
        `, [student_id]);

        const [readingStats] = await query(`
            SELECT 
                COUNT(DISTINCT rp.book_id) as books_read,
                AVG(rp.progress_percentage) as avg_progress,
                SUM(rp.time_spent) as total_reading_time,
                COUNT(DISTINCT br.book_id) as books_reviewed,
                AVG(br.rating) as avg_rating
            FROM reading_progress rp
            LEFT JOIN book_reviews br ON rp.user_id = br.user_id AND rp.book_id = br.book_id
            WHERE rp.user_id = ?
        `, [student_id]);

        const [comparisonStats] = await query(`
            SELECT 
                s2.id,
                u2.full_name as student_name,
                AVG(asub2.score) as avg_assignment_score,
                AVG(qa2.score) as avg_quiz_score,
                (AVG(asub2.score) + AVG(qa2.score)) / 2 as overall_score,
                RANK() OVER (ORDER BY (AVG(asub2.score) + AVG(qa2.score)) / 2 DESC) as class_rank
            FROM students s2
            JOIN users u2 ON s2.user_id = u2.id
            LEFT JOIN assignment_submissions asub2 ON s2.user_id = asub2.student_id
            LEFT JOIN quiz_attempts qa2 ON s2.user_id = qa2.student_id
            WHERE s2.grade = ? AND s2.section = ?
            GROUP BY s2.id, u2.full_name
            ORDER BY overall_score DESC
        `, [student.grade, student.section]);

        const studentRank = comparisonStats.findIndex(s => s.id === student.id) + 1;
        const classSize = comparisonStats.length;

        const analytics = {
            student_info: student,
            performance_summary: performanceSummary,
            subject_performance: subjectPerformance,
            progress_timeline: progressTimeline,
            attendance_statistics: attendanceStats,
            reading_statistics: readingStats,
            class_comparison: {
                class_rank: studentRank,
                class_size: classSize,
                percentile: ((classSize - studentRank) / classSize * 100).toFixed(2),
                top_performer: comparisonStats[0] || null,
                class_average: comparisonStats.length > 0 ? 
                    (comparisonStats.reduce((sum, s) => sum + (s.overall_score || 0), 0) / comparisonStats.length).toFixed(2) : 0
            },
            recommendations: generateRecommendations(performanceSummary, subjectPerformance)
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get student analytics error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student analytics'
        });
    }
};

const getTeacherAnalytics = async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const user = req.user;

        if (user.role === USER_ROLES.TEACHER && user.id !== teacher_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot view other teachers\' analytics'
            });
        }

        const [teacher] = await query(`
            SELECT t.*, u.full_name, u.email, u.profile_image
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            WHERE t.user_id = ?
        `, [teacher_id]);

        if (!teacher) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        const [teachingStats] = await query(`
            SELECT 
                ta.grade,
                ta.section,
                COUNT(DISTINCT a.id) as assignments_created,
                COUNT(DISTINCT q.id) as quizzes_created,
                COUNT(DISTINCT s.id) as students_count,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score
            FROM teacher_assignments ta
            LEFT JOIN assignments a ON ta.teacher_id = a.teacher_id AND ta.grade = a.grade AND ta.section = a.section
            LEFT JOIN quizzes q ON ta.teacher_id = q.created_by AND ta.grade = q.grade AND ta.section = q.section
            LEFT JOIN students s ON ta.grade = s.grade AND ta.section = s.section
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE ta.teacher_id = ?
            GROUP BY ta.grade, ta.section
            ORDER BY ta.grade, ta.section
        `, [teacher_id]);

        const [subjectStats] = await query(`
            SELECT 
                ts.subject,
                COUNT(DISTINCT a.id) as assignments_created,
                COUNT(DISTINCT q.id) as quizzes_created,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT s.id) as students_taught
            FROM teacher_subjects ts
            LEFT JOIN assignments a ON ts.teacher_id = a.teacher_id AND ts.subject = a.subject
            LEFT JOIN quizzes q ON ts.teacher_id = q.created_by AND ts.subject = q.subject
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            LEFT JOIN teacher_assignments ta ON ts.teacher_id = ta.teacher_id
            LEFT JOIN students s ON ta.grade = s.grade AND ta.section = s.section
            WHERE ts.teacher_id = ?
            GROUP BY ts.subject
            ORDER BY avg_assignment_score DESC
        `, [teacher_id]);

        const [studentPerformance] = await query(`
            SELECT 
                s.id,
                u.full_name as student_name,
                s.grade,
                s.section,
                s.fav_id,
                AVG(asub.score) as avg_assignment_score,
                AVG(qa.score) as avg_quiz_score,
                COUNT(DISTINCT asub.id) as assignments_submitted,
                COUNT(DISTINCT qa.id) as quizzes_attempted,
                (AVG(asub.score) + AVG(qa.score)) / 2 as overall_score
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN assignments a ON s.grade = a.grade AND s.section = a.section AND a.teacher_id = ?
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = s.user_id
            LEFT JOIN quizzes q ON s.grade = q.grade AND s.section = q.section AND q.created_by = ?
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = s.user_id
            WHERE EXISTS (
                SELECT 1 FROM teacher_assignments ta 
                WHERE ta.teacher_id = ? AND ta.grade = s.grade AND ta.section = s.section
            )
            GROUP BY s.id, u.full_name, s.grade, s.section, s.fav_id
            ORDER BY overall_score DESC
            LIMIT 20
        `, [teacher_id, teacher_id, teacher_id]);

        const [activityStats] = await query(`
            SELECT 
                DATE(ua.created_at) as date,
                COUNT(*) as activities_count,
                GROUP_CONCAT(DISTINCT ua.action) as actions
            FROM user_activity ua
            WHERE ua.user_id = ? AND ua.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(ua.created_at)
            ORDER BY date DESC
        `, [teacher_id]);

        const [gradingStats] = await query(`
            SELECT 
                COUNT(DISTINCT asub.id) as total_submissions_graded,
                AVG(asub.score) as avg_graded_score,
                COUNT(DISTINCT CASE WHEN asub.status = 'graded' THEN asub.id END) as timely_graded,
                AVG(TIMESTAMPDIFF(HOUR, asub.submitted_at, asub.graded_at)) as avg_grading_time_hours
            FROM assignment_submissions asub
            JOIN assignments a ON asub.assignment_id = a.id
            WHERE a.teacher_id = ? AND asub.graded_at IS NOT NULL
        `, [teacher_id]);

        const analytics = {
            teacher_info: teacher,
            teaching_statistics: teachingStats,
            subject_statistics: subjectStats,
            student_performance: studentPerformance,
            activity_statistics: activityStats,
            grading_statistics: gradingStats,
            summary: {
                total_classes: teachingStats.length,
                total_subjects: subjectStats.length,
                total_students: teachingStats.reduce((sum, cls) => sum + (cls.students_count || 0), 0),
                overall_effectiveness: subjectStats.length > 0 ? 
                    (subjectStats.reduce((sum, subj) => sum + (subj.avg_assignment_score || 0), 0) / subjectStats.length).toFixed(2) : 0
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

const generateRecommendations = (performanceSummary, subjectPerformance) => {
    const recommendations = [];

    if (performanceSummary.avg_assignment_score < 70) {
        recommendations.push({
            type: 'improvement',
            message: 'Consider focusing on assignment submissions and seeking help from teachers for difficult topics.',
            priority: 'high'
        });
    }

    if (performanceSummary.avg_quiz_score < 70) {
        recommendations.push({
            type: 'improvement',
            message: 'Regular quiz practice and revision of study materials could improve quiz performance.',
            priority: 'high'
        });
    }

    if (subjectPerformance && subjectPerformance.length > 0) {
        const weakestSubject = subjectPerformance[subjectPerformance.length - 1];
        if (weakestSubject.overall_score < 60) {
            recommendations.push({
                type: 'subject_focus',
                message: `Focus on improving ${weakestSubject.subject} performance through extra practice and teacher guidance.`,
                priority: 'medium',
                subject: weakestSubject.subject
            });
        }

        const strongSubjects = subjectPerformance.filter(subj => subj.overall_score >= 80);
        if (strongSubjects.length > 0) {
            recommendations.push({
                type: 'strength',
                message: `Excellent performance in ${strongSubjects.map(s => s.subject).join(', ')}. Consider mentoring classmates.`,
                priority: 'low'
            });
        }
    }

    if (performanceSummary.submitted_assignments < performanceSummary.total_assignments * 0.8) {
        recommendations.push({
            type: 'submission',
            message: 'Increase assignment submission rate to improve overall performance.',
            priority: 'medium'
        });
    }

    return recommendations;
};

module.exports = {
    getSystemAnalytics,
    getGradeAnalytics,
    getSectionAnalytics,
    getStudentAnalytics,
    getTeacherAnalytics
};