const db = require('../config/database');

class NewsController {
    
    static async createNews(req, res) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;
            const {
                title,
                content,
                visibility_level,
                target_grades,
                target_sections,
                published_at
            } = req.body;

            if (!['super_admin', 'director_all', 'director_11_12', 'director_9_10', 'school_admin'].includes(userRole)) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Insufficient permissions to create news' 
                });
            }

            const [result] = await db.promise().query(
                `INSERT INTO news 
                 (title, content, author_id, visibility_level, target_grades, target_sections, published_at, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'published')`,
                [title, content, userId, visibility_level, JSON.stringify(target_grades), JSON.stringify(target_sections), published_at || new Date()]
            );

            res.json({
                success: true,
                message: 'News published successfully',
                news_id: result.insertId
            });

        } catch (error) {
            console.error('Create news error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to publish news' 
            });
        }
    }

    static async getNews(req, res) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;
            
            let query = `
                SELECT n.*, 
                       u.first_name as author_first_name,
                       u.last_name as author_last_name
                FROM news n
                JOIN users u ON n.author_id = u.id
                WHERE n.status = 'published'
            `;
            const params = [];

            if (userRole === 'student') {
                const [student] = await db.promise().query(
                    'SELECT grade, section FROM students WHERE user_id = ?',
                    [userId]
                );

                if (student.length > 0) {
                    const { grade, section } = student[0];
                    query += ` AND (
                        n.visibility_level = 'public' 
                        OR n.visibility_level = 'school'
                        OR (n.visibility_level = 'grade' AND JSON_CONTAINS(n.target_grades, ?))
                        OR (n.visibility_level = 'section' AND JSON_CONTAINS(n.target_grades, ?) AND JSON_CONTAINS(n.target_sections, ?))
                    )`;
                    params.push(JSON.stringify([grade]), JSON.stringify([grade]), JSON.stringify([section]));
                }
            } else if (userRole === 'teacher') {
                query += ` AND (
                    n.visibility_level = 'public' 
                    OR n.visibility_level = 'school'
                )`;
            } else if (userRole === 'parent') {
                query += ` AND (
                    n.visibility_level = 'public' 
                    OR n.visibility_level = 'school'
                )`;
            } else {

            }

            query += ' ORDER BY n.published_at DESC LIMIT 50';

            const [news] = await db.promise().query(query, params);

            res.json({
                success: true,
                data: news
            });

        } catch (error) {
            console.error('Get news error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch news' 
            });
        }
    }
}

module.exports = NewsController;