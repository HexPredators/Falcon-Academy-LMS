const { query, execute } = require('../config/database');
const emailService = require('../utils/emailService');
const { USER_ROLES, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const getParents = async (req, res) => {
    try {
        const user = req.user;
        const { search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT p.id, p.created_at,
                   u.full_name, u.email, u.phone, u.profile_image, u.is_active, u.created_at as user_created,
                   COUNT(DISTINCT pcl.student_id) as linked_children,
                   GROUP_CONCAT(DISTINCT CONCAT(s.fav_id, ' (Grade ', s.grade, s.section, ')')) as children_info
            FROM parents p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN parent_child_links pcl ON p.id = pcl.parent_id AND pcl.status = 'approved'
            LEFT JOIN students s ON pcl.student_id = s.user_id
            WHERE u.role = 'parent'
        `;
        const queryParams = [];

        if (search) {
            baseQuery += ' AND (u.full_name LIKE ? OR u.email LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        if (user.role === USER_ROLES.STUDENT) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied'
            });
        }

        baseQuery += ' GROUP BY p.id, u.id ORDER BY u.full_name LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const parents = await query(baseQuery, queryParams);

        parents.forEach(parent => {
            parent.children_info = parent.children_info ? parent.children_info.split(',') : [];
        });

        const countQuery = `
            SELECT COUNT(*) as total
            FROM parents p
            JOIN users u ON p.user_id = u.id
            WHERE u.role = 'parent'
        `;

        const [{ total }] = await query(countQuery);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: parents,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get parents error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch parents'
        });
    }
};

const getParentById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const queryStr = `
            SELECT p.*, 
                   u.full_name, u.email, u.phone, u.profile_image, u.language, u.is_active, u.created_at as user_created
            FROM parents p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `;

        const [parent] = await query(queryStr, [id]);

        if (!parent) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Parent not found'
            });
        }

        if (user.role === USER_ROLES.PARENT && user.id !== parent.user_id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied'
            });
        }

        const [linkedChildren] = await query(`
            SELECT pcl.*,
                   s.fav_id, s.grade, s.section, s.stream,
                   u.full_name as student_name, u.email as student_email, u.profile_image as student_image
            FROM parent_child_links pcl
            JOIN students s ON pcl.student_id = s.user_id
            JOIN users u ON s.user_id = u.id
            WHERE pcl.parent_id = ?
            ORDER BY pcl.status, pcl.created_at DESC
        `, [id]);

        const [pendingRequests] = await query(`
            SELECT pcl.*,
                   s.fav_id, s.grade, s.section, s.stream,
                   u.full_name as student_name
            FROM parent_child_links pcl
            JOIN students s ON pcl.student_id = s.user_id
            JOIN users u ON s.user_id = u.id
            WHERE pcl.parent_id = ? AND pcl.status = 'pending'
        `, [id]);

        parent.linked_children = linkedChildren.filter(child => child.status === 'approved');
        parent.pending_requests = pendingRequests;

        const [activityStats] = await query(`
            SELECT 
                COUNT(DISTINCT pcl.student_id) as total_children,
                COUNT(DISTINCT CASE WHEN pcl.status = 'approved' THEN pcl.student_id END) as approved_children,
                COUNT(DISTINCT CASE WHEN pcl.status = 'pending' THEN pcl.student_id END) as pending_requests,
                COUNT(DISTINCT CASE WHEN pcl.status = 'rejected' THEN pcl.student_id END) as rejected_requests
            FROM parent_child_links pcl
            WHERE pcl.parent_id = ?
        `, [id]);

        parent.stats = activityStats;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: parent
        });

    } catch (error) {
        console.error('Get parent by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch parent details'
        });
    }
};

const sendLinkRequest = async (req, res) => {
    try {
        const parentId = req.user.role === USER_ROLES.PARENT ? req.user.id : req.body.parent_id;
        const { student_fav_id, student_name, student_grade, student_section } = req.body;

        if (!student_fav_id || !student_name || !student_grade || !student_section) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'All student information is required'
            });
        }

        const [student] = await query(`
            SELECT s.*, u.full_name, u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.fav_id = ? AND u.full_name LIKE ? AND s.grade = ? AND s.section = ?
        `, [student_fav_id.toUpperCase(), `%${student_name}%`, student_grade, student_section.toUpperCase()]);

        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found with provided details'
            });
        }

        const [existingLink] = await query(`
            SELECT * FROM parent_child_links 
            WHERE parent_id = ? AND student_id = ?
        `, [parentId, student.user_id]);

        if (existingLink) {
            if (existingLink.status === 'approved') {
                return res.status(API_RESPONSE_CODES.CONFLICT).json({
                    success: false,
                    message: 'Already linked to this student'
                });
            } else if (existingLink.status === 'pending') {
                return res.status(API_RESPONSE_CODES.CONFLICT).json({
                    success: false,
                    message: 'Link request already pending'
                });
            }
        }

        await execute(
            'INSERT INTO parent_child_links (parent_id, student_id, status) VALUES (?, ?, ?)',
            [parentId, student.user_id, 'pending']
        );

        const [parent] = await query('SELECT u.full_name, u.email FROM parents p JOIN users u ON p.user_id = u.id WHERE p.id = ?', [parentId]);

        await emailService.sendParentLinkRequest(
            student.email,
            student.full_name,
            parent.full_name,
            parent.email,
            req.user.language || 'en'
        );

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Link request sent successfully',
            data: {
                student_id: student.user_id,
                student_name: student.full_name,
                grade: student.grade,
                section: student.section,
                status: 'pending'
            }
        });

    } catch (error) {
        console.error('Send link request error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to send link request'
        });
    }
};

const getLinkRequests = async (req, res) => {
    try {
        const parentId = req.user.role === USER_ROLES.PARENT ? req.user.id : req.params.id;

        const requests = await query(`
            SELECT pcl.*,
                   s.fav_id, s.grade, s.section, s.stream,
                   u.full_name as student_name, u.email as student_email, u.profile_image as student_image,
                   pcl.created_at as request_date
            FROM parent_child_links pcl
            JOIN students s ON pcl.student_id = s.user_id
            JOIN users u ON s.user_id = u.id
            WHERE pcl.parent_id = ?
            ORDER BY pcl.created_at DESC
        `, [parentId]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: requests
        });

    } catch (error) {
        console.error('Get link requests error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch link requests'
        });
    }
};

const updateLinkRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Invalid status. Must be "approved" or "rejected"'
            });
        }

        const [request] = await query(`
            SELECT pcl.*, u.email as student_email, u.full_name as student_name
            FROM parent_child_links pcl
            JOIN users u ON pcl.student_id = u.id
            WHERE pcl.id = ?
        `, [requestId]);

        if (!request) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Link request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Link request is already processed'
            });
        }

        await execute(
            'UPDATE parent_child_links SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, requestId]
        );

        if (status === 'approved') {
            await emailService.sendLinkRequestApproval(
                request.student_email,
                request.student_name,
                req.user.language || 'en'
            );
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: `Link request ${status} successfully`
        });

    } catch (error) {
        console.error('Update link request error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update link request'
        });
    }
};

const removeChildLink = async (req, res) => {
    try {
        const parentId = req.user.role === USER_ROLES.PARENT ? req.user.id : req.body.parent_id;
        const { student_id } = req.body;

        const [link] = await query(`
            SELECT * FROM parent_child_links 
            WHERE parent_id = ? AND student_id = ? AND status = 'approved'
        `, [parentId, student_id]);

        if (!link) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'No active link found with this student'
            });
        }

        await execute(
            'DELETE FROM parent_child_links WHERE id = ?',
            [link.id]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Child link removed successfully'
        });

    } catch (error) {
        console.error('Remove child link error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to remove child link'
        });
    }
};

const getChildProgress = async (req, res) => {
    try {
        const parentId = req.user.role === USER_ROLES.PARENT ? req.user.id : req.params.id;
        const { child_id } = req.params;

        const [link] = await query(`
            SELECT * FROM parent_child_links 
            WHERE parent_id = ? AND student_id = ? AND status = 'approved'
        `, [parentId, child_id]);

        if (!link) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Not authorized to view this child\'s progress'
            });
        }

        const [student] = await query(`
            SELECT s.*, u.full_name, u.email, u.profile_image
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.user_id = ?
        `, [child_id]);

        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Child not found'
            });
        }

        const [assignmentStats] = await query(`
            SELECT 
                COUNT(DISTINCT a.id) as total_assignments,
                COUNT(DISTINCT asub.id) as submitted_assignments,
                AVG(asub.score) as avg_score,
                MAX(asub.score) as highest_score,
                MIN(asub.score) as lowest_score,
                SUM(CASE WHEN a.due_date < NOW() AND asub.id IS NULL THEN 1 ELSE 0 END) as overdue_count
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
            WHERE a.grade = ? AND a.section = ?
        `, [child_id, student.grade, student.section]);

        const [quizStats] = await query(`
            SELECT 
                COUNT(DISTINCT q.id) as total_quizzes,
                COUNT(DISTINCT qa.id) as attempted_quizzes,
                AVG(qa.score) as avg_score,
                MAX(qa.score) as highest_score,
                MIN(qa.score) as lowest_score
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
            WHERE q.grade = ? AND q.section = ?
        `, [child_id, student.grade, student.section]);

        const [recentAssignments] = await query(`
            SELECT a.*, asub.score, asub.feedback, asub.submitted_at
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
            WHERE a.grade = ? AND a.section = ?
            ORDER BY a.due_date DESC
            LIMIT 10
        `, [child_id, student.grade, student.section]);

        const [recentQuizzes] = await query(`
            SELECT q.*, qa.score, qa.submitted_at
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
            WHERE q.grade = ? AND q.section = ?
            ORDER BY q.end_time DESC
            LIMIT 10
        `, [child_id, student.grade, student.section]);

        const [subjectPerformance] = await query(`
            SELECT 
                a.subject,
                AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as avg_assignment_score,
                AVG(CASE WHEN qa.score IS NOT NULL THEN qa.score END) as avg_quiz_score,
                COUNT(DISTINCT asub.id) as assignment_count,
                COUNT(DISTINCT qa.id) as quiz_count,
                (AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) + 
                 AVG(CASE WHEN qa.score IS NOT NULL THEN qa.score END)) / 2 as overall_score
            FROM assignments a
            LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
            LEFT JOIN quizzes q ON a.subject = q.subject AND q.grade = ? AND q.section = ?
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = ?
            WHERE a.grade = ? AND a.section = ?
            GROUP BY a.subject
            ORDER BY overall_score DESC
        `, [child_id, student.grade, student.section, child_id, student.grade, student.section]);

        const [attendance] = await query(`
            SELECT 
                DATE(login_time) as date,
                COUNT(*) as sessions,
                SUM(TIMESTAMPDIFF(MINUTE, login_time, logout_time)) as total_minutes
            FROM user_sessions
            WHERE user_id = ? AND DATE(login_time) >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(login_time)
            ORDER BY date DESC
        `, [child_id]);

        const progressData = {
            student_info: {
                name: student.full_name,
                grade: student.grade,
                section: student.section,
                stream: student.stream,
                fav_id: student.fav_id
            },
            assignments: {
                stats: assignmentStats,
                recent: recentAssignments
            },
            quizzes: {
                stats: quizStats,
                recent: recentQuizzes
            },
            subject_performance: subjectPerformance,
            attendance: {
                recent: attendance,
                total_days: attendance.length,
                avg_minutes_per_day: attendance.length > 0 ? 
                    attendance.reduce((sum, day) => sum + (day.total_minutes || 0), 0) / attendance.length : 0
            },
            overall_summary: {
                assignment_completion_rate: assignmentStats.total_assignments > 0 ? 
                    (assignmentStats.submitted_assignments / assignmentStats.total_assignments * 100).toFixed(2) : 0,
                quiz_completion_rate: quizStats.total_quizzes > 0 ? 
                    (quizStats.attempted_quizzes / quizStats.total_quizzes * 100).toFixed(2) : 0,
                overall_average_score: subjectPerformance.length > 0 ? 
                    (subjectPerformance.reduce((sum, subj) => sum + (subj.overall_score || 0), 0) / subjectPerformance.length).toFixed(2) : 0
            }
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: progressData
        });

    } catch (error) {
        console.error('Get child progress error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch child progress'
        });
    }
};

const getChildAttendance = async (req, res) => {
    try {
        const parentId = req.user.role === USER_ROLES.PARENT ? req.user.id : req.params.id;
        const { child_id } = req.params;
        const { startDate, endDate } = req.query;

        const [link] = await query(`
            SELECT * FROM parent_child_links 
            WHERE parent_id = ? AND student_id = ? AND status = 'approved'
        `, [parentId, child_id]);

        if (!link) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Not authorized to view this child\'s attendance'
            });
        }

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
        const params = [child_id];

        if (startDate) {
            queryStr += ' AND DATE(login_time) >= ?';
            params.push(startDate);
        }

        if (endDate) {
            queryStr += ' AND DATE(login_time) <= ?';
            params.push(endDate);
        }

        queryStr += ' GROUP BY DATE(login_time) ORDER BY date DESC';

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
        console.error('Get child attendance error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch child attendance'
        });
    }
};

const getChildGrades = async (req, res) => {
    try {
        const parentId = req.user.role === USER_ROLES.PARENT ? req.user.id : req.params.id;
        const { child_id } = req.params;
        const { subject, semester } = req.query;

        const [link] = await query(`
            SELECT * FROM parent_child_links 
            WHERE parent_id = ? AND student_id = ? AND status = 'approved'
        `, [parentId, child_id]);

        if (!link) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Not authorized to view this child\'s grades'
            });
        }

        let queryStr = `
            SELECT 
                g.*,
                a.title as assignment_title,
                q.title as quiz_title,
                u.full_name as teacher_name,
                CASE 
                    WHEN g.assignment_id IS NOT NULL THEN 'assignment'
                    WHEN g.quiz_id IS NOT NULL THEN 'quiz'
                END as grade_type
            FROM grades g
            LEFT JOIN assignments a ON g.assignment_id = a.id
            LEFT JOIN quizzes q ON g.quiz_id = q.id
            LEFT JOIN users u ON g.teacher_id = u.id
            WHERE g.student_id = ?
        `;
        const params = [child_id];

        if (subject) {
            queryStr += ' AND g.subject = ?';
            params.push(subject);
        }

        if (semester) {
            queryStr += ' AND g.semester = ?';
            params.push(semester);
        }

        queryStr += ' ORDER BY g.created_at DESC';

        const grades = await query(queryStr, params);

        const [subjectSummary] = await query(`
            SELECT 
                g.subject,
                COUNT(*) as total_grades,
                AVG(g.score) as average_score,
                MAX(g.score) as highest_score,
                MIN(g.score) as lowest_score,
                g.semester
            FROM grades g
            WHERE g.student_id = ?
            GROUP BY g.subject, g.semester
            ORDER BY g.subject, g.semester
        `, [child_id]);

        const [overallStats] = await query(`
            SELECT 
                COUNT(*) as total_grades,
                AVG(score) as overall_average,
                MAX(score) as highest_grade,
                MIN(score) as lowest_grade,
                COUNT(DISTINCT subject) as subjects_count,
                COUNT(DISTINCT semester) as semesters_count
            FROM grades
            WHERE student_id = ?
        `, [child_id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                grades: grades,
                subject_summary: subjectSummary,
                overall_stats: overallStats
            }
        });

    } catch (error) {
        console.error('Get child grades error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch child grades'
        });
    }
};

const getParentNotifications = async (req, res) => {
    try {
        const parentId = req.user.role === USER_ROLES.PARENT ? req.user.id : req.params.id;
        const { unread_only = false, limit = 50 } = req.query;

        let queryStr = `
            SELECT n.*,
                   s.fav_id, s.grade, s.section,
                   u.full_name as student_name
            FROM notifications n
            JOIN students s ON n.student_id = s.user_id
            JOIN users u ON s.user_id = u.id
            WHERE n.parent_id = ?
        `;
        const params = [parentId];

        if (unread_only) {
            queryStr += ' AND n.is_read = 0';
        }

        queryStr += ' ORDER BY n.created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const notifications = await query(queryStr, params);

        const [unreadCount] = await query(
            'SELECT COUNT(*) as count FROM notifications WHERE parent_id = ? AND is_read = 0',
            [parentId]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                notifications: notifications,
                unread_count: unreadCount.count
            }
        });

    } catch (error) {
        console.error('Get parent notifications error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch notifications'
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const parentId = req.user.id;

        const [notification] = await query(
            'SELECT * FROM notifications WHERE id = ? AND parent_id = ?',
            [notificationId, parentId]
        );

        if (!notification) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await execute(
            'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
            [notificationId]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Notification marked as read'
        });

    } catch (error) {
        console.error('Mark notification as read error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to mark notification as read'
        });
    }
};

module.exports = {
    getParents,
    getParentById,
    sendLinkRequest,
    getLinkRequests,
    updateLinkRequest,
    removeChildLink,
    getChildProgress,
    getChildAttendance,
    getChildGrades,
    getParentNotifications,
    markNotificationAsRead
};