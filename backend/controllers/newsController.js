const { query, execute } = require('../config/database');
const emailService = require('../utils/emailService');
const { USER_ROLES, NEWS_VISIBILITY, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const createNews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            title, 
            content, 
            visibility, 
            target_grade, 
            target_section,
            publish_date,
            priority,
            attachments
        } = req.body;

        if (![USER_ROLES.SUPER_ADMIN, USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(req.user.role)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Only admins and directors can create news'
            });
        }

        if (visibility === NEWS_VISIBILITY.GRADE && !target_grade) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Target grade is required for grade visibility'
            });
        }

        if (visibility === NEWS_VISIBILITY.SECTION && (!target_grade || !target_section)) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Target grade and section are required for section visibility'
            });
        }

        const result = await execute(
            `INSERT INTO news 
            (title, content, visibility, target_grade, target_section, 
             publish_date, priority, created_by, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, content, visibility, target_grade, target_section, 
             publish_date || new Date(), priority || 3, userId, 'published']
        );

        const newsId = result.insertId;

        if (attachments && Array.isArray(attachments)) {
            for (const attachment of attachments) {
                await execute(
                    'INSERT INTO news_attachments (news_id, file_url, file_name, file_type) VALUES (?, ?, ?, ?)',
                    [newsId, attachment.url, attachment.name, attachment.type]
                );
            }
        }

        const [newNews] = await query(`
            SELECT n.*, u.full_name as author_name, u.profile_image as author_image
            FROM news n
            JOIN users u ON n.created_by = u.id
            WHERE n.id = ?
        `, [newsId]);

        await sendNewsNotifications(newNews);

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'News created successfully',
            data: newNews
        });

    } catch (error) {
        console.error('Create news error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to create news'
        });
    }
};

const getNews = async (req, res) => {
    try {
        const user = req.user;
        const { 
            visibility, 
            target_grade, 
            target_section, 
            status = 'published',
            priority,
            author,
            start_date,
            end_date,
            search,
            page = 1, 
            limit = 20 
        } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT n.*, 
                   u.full_name as author_name, 
                   u.profile_image as author_image,
                   COUNT(DISTINCT na.id) as attachment_count,
                   COUNT(DISTINCT v.id) as view_count
            FROM news n
            JOIN users u ON n.created_by = u.id
            LEFT JOIN news_attachments na ON n.id = na.news_id
            LEFT JOIN news_views v ON n.id = v.news_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (status) {
            baseQuery += ' AND n.status = ?';
            queryParams.push(status);
        }

        if (visibility) {
            baseQuery += ' AND n.visibility = ?';
            queryParams.push(visibility);
        }

        if (target_grade) {
            baseQuery += ' AND n.target_grade = ?';
            queryParams.push(target_grade);
        }

        if (target_section) {
            baseQuery += ' AND n.target_section = ?';
            queryParams.push(target_section);
        }

        if (priority) {
            baseQuery += ' AND n.priority = ?';
            queryParams.push(priority);
        }

        if (author) {
            baseQuery += ' AND n.created_by = ?';
            queryParams.push(author);
        }

        if (start_date) {
            baseQuery += ' AND DATE(n.publish_date) >= ?';
            queryParams.push(start_date);
        }

        if (end_date) {
            baseQuery += ' AND DATE(n.publish_date) <= ?';
            queryParams.push(end_date);
        }

        if (search) {
            baseQuery += ' AND (n.title LIKE ? OR n.content LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        if (user.role === USER_ROLES.STUDENT) {
            baseQuery += ` AND (
                n.visibility = 'public' 
                OR (n.visibility = 'school' AND n.status = 'published')
                OR (n.visibility = 'grade' AND n.target_grade = ?)
                OR (n.visibility = 'section' AND n.target_grade = ? AND n.target_section = ?)
            )`;
            queryParams.push(user.grade, user.grade, user.section);
        } else if (user.role === USER_ROLES.TEACHER) {
            baseQuery += ` AND (
                n.visibility = 'public' 
                OR (n.visibility = 'school' AND n.status = 'published')
                OR (n.visibility = 'grade' AND n.target_grade IN (SELECT grade FROM teacher_assignments WHERE teacher_id = ?))
                OR (n.visibility = 'section' AND n.target_grade IN (SELECT grade FROM teacher_assignments WHERE teacher_id = ?) 
                    AND n.target_section IN (SELECT section FROM teacher_assignments WHERE teacher_id = ?))
            )`;
            queryParams.push(user.id, user.id, user.id);
        } else if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            baseQuery += ` AND (
                n.visibility = 'public' 
                OR (n.visibility = 'school' AND n.status = 'published')
                OR (n.visibility = 'grade' AND n.target_grade BETWEEN ? AND ?)
                OR (n.visibility = 'section' AND n.target_grade BETWEEN ? AND ?)
            )`;
            queryParams.push(gradeRange.min, gradeRange.max, gradeRange.min, gradeRange.max);
        }

        baseQuery += ' GROUP BY n.id ORDER BY n.priority ASC, n.publish_date DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const news = await query(baseQuery, queryParams);

        for (const newsItem of news) {
            const [attachments] = await query(
                'SELECT * FROM news_attachments WHERE news_id = ?',
                [newsItem.id]
            );
            newsItem.attachments = attachments;

            const [views] = await query(
                'SELECT COUNT(*) as count FROM news_views WHERE news_id = ? AND user_id = ?',
                [newsItem.id, user.id]
            );
            newsItem.viewed = views.count > 0;
        }

        const countQuery = `
            SELECT COUNT(DISTINCT n.id) as total
            FROM news n
            WHERE 1=1
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: news,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get news error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch news'
        });
    }
};

const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const [news] = await query(`
            SELECT n.*, u.full_name as author_name, u.profile_image as author_image
            FROM news n
            JOIN users u ON n.created_by = u.id
            WHERE n.id = ?
        `, [id]);

        if (!news) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'News not found'
            });
        }

        if (user.role === USER_ROLES.STUDENT) {
            if (news.visibility === NEWS_VISIBILITY.GRADE && news.target_grade !== user.grade) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this news'
                });
            }

            if (news.visibility === NEWS_VISIBILITY.SECTION && 
                (news.target_grade !== user.grade || news.target_section !== user.section)) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this news'
                });
            }
        }

        if (user.role === USER_ROLES.TEACHER && 
            (news.visibility === NEWS_VISIBILITY.GRADE || news.visibility === NEWS_VISIBILITY.SECTION)) {
            const [access] = await query(
                'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ?',
                [user.id, news.target_grade]
            );

            if (!access && news.visibility === NEWS_VISIBILITY.GRADE) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this news'
                });
            }

            if (news.visibility === NEWS_VISIBILITY.SECTION) {
                const [sectionAccess] = await query(
                    'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ? AND section = ?',
                    [user.id, news.target_grade, news.target_section]
                );

                if (!sectionAccess) {
                    return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                        success: false,
                        message: 'Access denied to this news'
                    });
                }
            }
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            if (news.visibility === NEWS_VISIBILITY.GRADE && 
                (news.target_grade < gradeRange.min || news.target_grade > gradeRange.max)) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this news'
                });
            }

            if (news.visibility === NEWS_VISIBILITY.SECTION && 
                (news.target_grade < gradeRange.min || news.target_grade > gradeRange.max)) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this news'
                });
            }
        }

        const [attachments] = await query(
            'SELECT * FROM news_attachments WHERE news_id = ?',
            [id]
        );

        const [views] = await query(
            'SELECT COUNT(*) as total_views FROM news_views WHERE news_id = ?',
            [id]
        );

        const [userView] = await query(
            'SELECT * FROM news_views WHERE news_id = ? AND user_id = ?',
            [id, user.id]
        );

        if (!userView) {
            await execute(
                'INSERT INTO news_views (news_id, user_id) VALUES (?, ?)',
                [id, user.id]
            );
        }

        news.attachments = attachments;
        news.total_views = views.total_views;
        news.viewed = true;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: news
        });

    } catch (error) {
        console.error('Get news by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch news details'
        });
    }
};

const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updates = req.body;

        const [news] = await query('SELECT * FROM news WHERE id = ?', [id]);
        if (!news) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'News not found'
            });
        }

        if (news.created_by !== userId && 
            ![USER_ROLES.SUPER_ADMIN, USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(req.user.role)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot update other users\' news'
            });
        }

        const allowedFields = [
            'title', 'content', 'visibility', 'target_grade', 'target_section',
            'publish_date', 'priority', 'status'
        ];
        const filteredUpdates = {};

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        });

        if (Object.keys(filteredUpdates).length > 0) {
            const setClause = Object.keys(filteredUpdates).map(field => `${field} = ?`).join(', ');
            const values = Object.values(filteredUpdates);
            values.push(id);

            await execute(
                `UPDATE news SET ${setClause}, updated_at = NOW() WHERE id = ?`,
                values
            );
        }

        if (updates.attachments && Array.isArray(updates.attachments)) {
            await execute('DELETE FROM news_attachments WHERE news_id = ?', [id]);
            
            for (const attachment of updates.attachments) {
                await execute(
                    'INSERT INTO news_attachments (news_id, file_url, file_name, file_type) VALUES (?, ?, ?, ?)',
                    [id, attachment.url, attachment.name, attachment.type]
                );
            }
        }

        const [updatedNews] = await query(`
            SELECT n.*, u.full_name as author_name, u.profile_image as author_image
            FROM news n
            JOIN users u ON n.created_by = u.id
            WHERE n.id = ?
        `, [id]);

        const [attachments] = await query(
            'SELECT * FROM news_attachments WHERE news_id = ?',
            [id]
        );

        updatedNews.attachments = attachments;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'News updated successfully',
            data: updatedNews
        });

    } catch (error) {
        console.error('Update news error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update news'
        });
    }
};

const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [news] = await query('SELECT * FROM news WHERE id = ?', [id]);
        if (!news) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'News not found'
            });
        }

        if (news.created_by !== userId && 
            ![USER_ROLES.SUPER_ADMIN, USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(req.user.role)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot delete other users\' news'
            });
        }

        await execute('DELETE FROM news WHERE id = ?', [id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'News deleted successfully'
        });

    } catch (error) {
        console.error('Delete news error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete news'
        });
    }
};

const getNewsAnalytics = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let baseQuery = `
            SELECT 
                n.visibility,
                COUNT(*) as total_news,
                SUM(CASE WHEN n.status = 'published' THEN 1 ELSE 0 END) as published_count,
                AVG(v.view_count) as avg_views,
                MAX(v.view_count) as max_views,
                MIN(v.view_count) as min_views
            FROM news n
            LEFT JOIN (
                SELECT news_id, COUNT(*) as view_count
                FROM news_views
                GROUP BY news_id
            ) v ON n.id = v.news_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (start_date) {
            baseQuery += ' AND DATE(n.created_at) >= ?';
            queryParams.push(start_date);
        }

        if (end_date) {
            baseQuery += ' AND DATE(n.created_at) <= ?';
            queryParams.push(end_date);
        }

        baseQuery += ' GROUP BY n.visibility ORDER BY total_news DESC';

        const visibilityStats = await query(baseQuery, queryParams);

        const [authorStats] = await query(`
            SELECT 
                u.full_name as author,
                COUNT(n.id) as news_count,
                AVG(v.view_count) as avg_views,
                SUM(v.view_count) as total_views
            FROM news n
            JOIN users u ON n.created_by = u.id
            LEFT JOIN (
                SELECT news_id, COUNT(*) as view_count
                FROM news_views
                GROUP BY news_id
            ) v ON n.id = v.news_id
            WHERE 1=1
            ${start_date ? ' AND DATE(n.created_at) >= ?' : ''}
            ${end_date ? ' AND DATE(n.created_at) <= ?' : ''}
            GROUP BY n.created_by, u.full_name
            ORDER BY news_count DESC
            LIMIT 10
        `, queryParams);

        const [timeStats] = await query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as news_count,
                SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count
            FROM news
            WHERE 1=1
            ${start_date ? ' AND DATE(created_at) >= ?' : ''}
            ${end_date ? ' AND DATE(created_at) <= ?' : ''}
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 30
        `, queryParams);

        const [priorityStats] = await query(`
            SELECT 
                priority,
                COUNT(*) as news_count,
                AVG(TIMESTAMPDIFF(HOUR, created_at, NOW())) as avg_age_hours
            FROM news
            WHERE 1=1
            ${start_date ? ' AND DATE(created_at) >= ?' : ''}
            ${end_date ? ' AND DATE(created_at) <= ?' : ''}
            GROUP BY priority
            ORDER BY priority
        `, queryParams);

        const analytics = {
            visibility_stats: visibilityStats,
            author_stats: authorStats,
            time_stats: timeStats,
            priority_stats: priorityStats,
            summary: {
                total_news: visibilityStats.reduce((sum, stat) => sum + stat.total_news, 0),
                published_news: visibilityStats.reduce((sum, stat) => sum + stat.published_count, 0),
                total_authors: authorStats.length,
                date_range: {
                    start: start_date || 'all',
                    end: end_date || 'all'
                }
            }
        };

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Get news analytics error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch news analytics'
        });
    }
};

const sendNewsNotifications = async (news) => {
    try {
        let recipients = [];

        switch (news.visibility) {
            case NEWS_VISIBILITY.PUBLIC:
                const [allUsers] = await query(
                    'SELECT u.email, u.full_name FROM users u WHERE u.is_active = 1'
                );
                recipients = allUsers;
                break;

            case NEWS_VISIBILITY.SCHOOL:
                const [schoolUsers] = await query(
                    'SELECT u.email, u.full_name FROM users u WHERE u.is_active = 1 AND u.role IN ("student", "teacher", "parent")'
                );
                recipients = schoolUsers;
                break;

            case NEWS_VISIBILITY.GRADE:
                const [gradeUsers] = await query(`
                    SELECT u.email, u.full_name 
                    FROM users u 
                    JOIN students s ON u.id = s.user_id 
                    WHERE u.is_active = 1 AND s.grade = ?
                    UNION
                    SELECT u.email, u.full_name 
                    FROM users u 
                    JOIN teacher_assignments ta ON u.id = ta.teacher_id 
                    WHERE u.is_active = 1 AND ta.grade = ?
                    UNION
                    SELECT u.email, u.full_name 
                    FROM users u 
                    JOIN parents p ON u.id = p.user_id 
                    JOIN parent_child_links pcl ON p.id = pcl.parent_id 
                    JOIN students s ON pcl.student_id = s.user_id 
                    WHERE u.is_active = 1 AND s.grade = ? AND pcl.status = 'approved'
                `, [news.target_grade, news.target_grade, news.target_grade]);
                recipients = gradeUsers;
                break;

            case NEWS_VISIBILITY.SECTION:
                const [sectionUsers] = await query(`
                    SELECT u.email, u.full_name 
                    FROM users u 
                    JOIN students s ON u.id = s.user_id 
                    WHERE u.is_active = 1 AND s.grade = ? AND s.section = ?
                    UNION
                    SELECT u.email, u.full_name 
                    FROM users u 
                    JOIN teacher_assignments ta ON u.id = ta.teacher_id 
                    WHERE u.is_active = 1 AND ta.grade = ? AND ta.section = ?
                    UNION
                    SELECT u.email, u.full_name 
                    FROM users u 
                    JOIN parents p ON u.id = p.user_id 
                    JOIN parent_child_links pcl ON p.id = pcl.parent_id 
                    JOIN students s ON pcl.student_id = s.user_id 
                    WHERE u.is_active = 1 AND s.grade = ? AND s.section = ? AND pcl.status = 'approved'
                `, [news.target_grade, news.target_section, news.target_grade, news.target_section, news.target_grade, news.target_section]);
                recipients = sectionUsers;
                break;
        }

        for (const recipient of recipients) {
            await emailService.sendNewsNotification(
                recipient.email,
                recipient.full_name,
                news.title,
                news.content.substring(0, 200) + '...',
                'en'
            );
        }

    } catch (error) {
        console.error('Send news notifications error:', error);
    }
};

module.exports = {
    createNews,
    getNews,
    getNewsById,
    updateNews,
    deleteNews,
    getNewsAnalytics
};