const { query, execute } = require('../config/database');
const emailService = require('../utils/emailService');
const { USER_ROLES, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { 
            recipient_id, 
            recipient_grade, 
            recipient_section,
            subject, 
            content, 
            message_type,
            parent_message_id 
        } = req.body;

        if (!subject || !content || !message_type) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Subject, content, and message type are required'
            });
        }

        let recipients = [];

        if (message_type === 'individual' && recipient_id) {
            const [recipient] = await query(
                'SELECT id FROM users WHERE id = ? AND is_active = 1',
                [recipient_id]
            );
            
            if (!recipient) {
                return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                    success: false,
                    message: 'Recipient not found'
                });
            }

            if (req.user.role === USER_ROLES.STUDENT) {
                const [student] = await query('SELECT grade, section FROM students WHERE user_id = ?', [senderId]);
                const [recipientStudent] = await query('SELECT grade, section FROM students WHERE user_id = ?', [recipient_id]);
                
                if (recipientStudent && (student.grade !== recipientStudent.grade || student.section !== recipientStudent.section)) {
                    return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                        success: false,
                        message: 'Students can only message classmates'
                    });
                }
            }

            recipients.push(recipient_id);
        } 
        else if (message_type === 'grade' && recipient_grade) {
            if (req.user.role === USER_ROLES.TEACHER) {
                const [teacherAccess] = await query(
                    'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ?',
                    [senderId, recipient_grade]
                );

                if (!teacherAccess) {
                    return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                        success: false,
                        message: 'You are not assigned to teach this grade'
                    });
                }

                const [gradeStudents] = await query(`
                    SELECT u.id 
                    FROM users u 
                    JOIN students s ON u.id = s.user_id 
                    WHERE u.is_active = 1 AND s.grade = ?
                `, [recipient_grade]);

                recipients = gradeStudents.map(s => s.id);
            }
        }
        else if (message_type === 'section' && recipient_grade && recipient_section) {
            if (req.user.role === USER_ROLES.TEACHER) {
                const [teacherAccess] = await query(
                    'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ? AND section = ?',
                    [senderId, recipient_grade, recipient_section]
                );

                if (!teacherAccess) {
                    return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                        success: false,
                        message: 'You are not assigned to teach this section'
                    });
                }

                const [sectionStudents] = await query(`
                    SELECT u.id 
                    FROM users u 
                    JOIN students s ON u.id = s.user_id 
                    WHERE u.is_active = 1 AND s.grade = ? AND s.section = ?
                `, [recipient_grade, recipient_section]);

                recipients = sectionStudents.map(s => s.id);
            }
        } else {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Invalid message type or missing recipient information'
            });
        }

        const messageResults = [];

        for (const recipientId of recipients) {
            const result = await execute(
                `INSERT INTO messages 
                (sender_id, recipient_id, subject, content, message_type, 
                 recipient_grade, recipient_section, parent_message_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [senderId, recipientId, subject, content, message_type, 
                 recipient_grade, recipient_section, parent_message_id]
            );

            const messageId = result.insertId;

            const [newMessage] = await query(`
                SELECT m.*, 
                       su.full_name as sender_name, su.profile_image as sender_image,
                       ru.full_name as recipient_name, ru.profile_image as recipient_image
                FROM messages m
                JOIN users su ON m.sender_id = su.id
                JOIN users ru ON m.recipient_id = ru.id
                WHERE m.id = ?
            `, [messageId]);

            messageResults.push(newMessage);

            const [recipient] = await query(
                'SELECT email, full_name FROM users WHERE id = ?',
                [recipientId]
            );

            if (recipient) {
                await emailService.sendMessageNotification(
                    recipient.email,
                    recipient.full_name,
                    req.user.full_name,
                    subject,
                    content.substring(0, 200) + '...',
                    req.user.language || 'en'
                );
            }
        }

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: `Message sent to ${recipients.length} recipient(s)`,
            data: messageResults
        });

    } catch (error) {
        console.error('Send message error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            type = 'inbox', 
            unread_only = false, 
            sender_id,
            search,
            page = 1, 
            limit = 20 
        } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = '';
        let queryParams = [userId];

        if (type === 'inbox') {
            baseQuery = `
                SELECT m.*, 
                       su.full_name as sender_name, su.profile_image as sender_image,
                       su.email as sender_email,
                       CASE 
                           WHEN m.parent_message_id IS NOT NULL THEN pm.subject
                           ELSE m.subject
                       END as thread_subject,
                       COUNT(DISTINCT rm.id) as reply_count
                FROM messages m
                JOIN users su ON m.sender_id = su.id
                LEFT JOIN messages pm ON m.parent_message_id = pm.id
                LEFT JOIN messages rm ON m.id = rm.parent_message_id
                WHERE m.recipient_id = ?
            `;
        } else if (type === 'sent') {
            baseQuery = `
                SELECT m.*, 
                       ru.full_name as recipient_name, ru.profile_image as recipient_image,
                       ru.email as recipient_email,
                       COUNT(DISTINCT rm.id) as reply_count
                FROM messages m
                JOIN users ru ON m.recipient_id = ru.id
                LEFT JOIN messages rm ON m.id = rm.parent_message_id
                WHERE m.sender_id = ?
            `;
        } else {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Invalid type. Must be "inbox" or "sent"'
            });
        }

        if (unread_only && type === 'inbox') {
            baseQuery += ' AND m.is_read = 0';
        }

        if (sender_id) {
            if (type === 'inbox') {
                baseQuery += ' AND m.sender_id = ?';
            } else {
                baseQuery += ' AND m.recipient_id = ?';
            }
            queryParams.push(sender_id);
        }

        if (search) {
            baseQuery += ' AND (m.subject LIKE ? OR m.content LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        baseQuery += ' GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const messages = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM messages m
            WHERE ${type === 'inbox' ? 'm.recipient_id = ?' : 'm.sender_id = ?'}
        `;
        const countParams = [userId];

        if (unread_only && type === 'inbox') {
            countQuery += ' AND m.is_read = 0';
            countParams.push(unread_only);
        }

        if (sender_id) {
            if (type === 'inbox') {
                countQuery += ' AND m.sender_id = ?';
            } else {
                countQuery += ' AND m.recipient_id = ?';
            }
            countParams.push(sender_id);
        }

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: messages,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get messages error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
};

const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [message] = await query(`
            SELECT m.*, 
                   su.full_name as sender_name, su.profile_image as sender_image,
                   su.email as sender_email, su.role as sender_role,
                   ru.full_name as recipient_name, ru.profile_image as recipient_image,
                   ru.email as recipient_email, ru.role as recipient_role
            FROM messages m
            JOIN users su ON m.sender_id = su.id
            JOIN users ru ON m.recipient_id = ru.id
            WHERE m.id = ?
        `, [id]);

        if (!message) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (message.sender_id !== userId && message.recipient_id !== userId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to this message'
            });
        }

        if (message.recipient_id === userId && !message.is_read) {
            await execute(
                'UPDATE messages SET is_read = 1, read_at = NOW() WHERE id = ?',
                [id]
            );
            message.is_read = 1;
        }

        const [replies] = await query(`
            SELECT m.*, 
                   su.full_name as sender_name, su.profile_image as sender_image,
                   ru.full_name as recipient_name, ru.profile_image as recipient_image
            FROM messages m
            JOIN users su ON m.sender_id = su.id
            JOIN users ru ON m.recipient_id = ru.id
            WHERE m.parent_message_id = ?
            ORDER BY m.created_at ASC
        `, [id]);

        message.replies = replies;

        const [thread] = message.parent_message_id ? await query(`
            SELECT m.*, 
                   su.full_name as sender_name, su.profile_image as sender_image,
                   ru.full_name as recipient_name, ru.profile_image as recipient_image
            FROM messages m
            JOIN users su ON m.sender_id = su.id
            JOIN users ru ON m.recipient_id = ru.id
            WHERE m.id = ?
        `, [message.parent_message_id]) : [null];

        message.thread = thread;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: message
        });

    } catch (error) {
        console.error('Get message by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch message details'
        });
    }
};

const replyToMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Content is required'
            });
        }

        const [originalMessage] = await query('SELECT * FROM messages WHERE id = ?', [id]);
        if (!originalMessage) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Original message not found'
            });
        }

        if (originalMessage.sender_id !== senderId && originalMessage.recipient_id !== senderId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot reply to this message'
            });
        }

        const recipientId = originalMessage.sender_id === senderId ? originalMessage.recipient_id : originalMessage.sender_id;
        const subject = originalMessage.parent_message_id ? originalMessage.subject : `Re: ${originalMessage.subject}`;

        const result = await execute(
            `INSERT INTO messages 
            (sender_id, recipient_id, subject, content, message_type, 
             recipient_grade, recipient_section, parent_message_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [senderId, recipientId, subject, content, originalMessage.message_type, 
             originalMessage.recipient_grade, originalMessage.recipient_section, 
             originalMessage.parent_message_id || originalMessage.id]
        );

        const replyId = result.insertId;

        const [newReply] = await query(`
            SELECT m.*, 
                   su.full_name as sender_name, su.profile_image as sender_image,
                   ru.full_name as recipient_name, ru.profile_image as recipient_image
            FROM messages m
            JOIN users su ON m.sender_id = su.id
            JOIN users ru ON m.recipient_id = ru.id
            WHERE m.id = ?
        `, [replyId]);

        const [recipient] = await query(
            'SELECT email, full_name FROM users WHERE id = ?',
            [recipientId]
        );

        if (recipient) {
            await emailService.sendMessageNotification(
                recipient.email,
                recipient.full_name,
                req.user.full_name,
                subject,
                content.substring(0, 200) + '...',
                req.user.language || 'en'
            );
        }

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Reply sent successfully',
            data: newReply
        });

    } catch (error) {
        console.error('Reply to message error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to send reply'
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [message] = await query('SELECT * FROM messages WHERE id = ?', [id]);
        if (!message) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (message.sender_id !== userId && message.recipient_id !== userId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot delete this message'
            });
        }

        if (message.sender_id === userId) {
            await execute(
                'UPDATE messages SET sender_deleted = 1 WHERE id = ?',
                [id]
            );
        }

        if (message.recipient_id === userId) {
            await execute(
                'UPDATE messages SET recipient_deleted = 1 WHERE id = ?',
                [id]
            );
        }

        const [checkDelete] = await query(
            'SELECT sender_deleted, recipient_deleted FROM messages WHERE id = ?',
            [id]
        );

        if (checkDelete.sender_deleted && checkDelete.recipient_deleted) {
            await execute('DELETE FROM messages WHERE id = ?', [id]);
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Message deleted successfully'
        });

    } catch (error) {
        console.error('Delete message error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete message'
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [message] = await query(
            'SELECT * FROM messages WHERE id = ? AND recipient_id = ?',
            [id, userId]
        );

        if (!message) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (message.is_read) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Message already read'
            });
        }

        await execute(
            'UPDATE messages SET is_read = 1, read_at = NOW() WHERE id = ?',
            [id]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Message marked as read'
        });

    } catch (error) {
        console.error('Mark as read error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to mark message as read'
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sender_id } = req.body;

        let updateQuery = 'UPDATE messages SET is_read = 1, read_at = NOW() WHERE recipient_id = ? AND is_read = 0';
        const params = [userId];

        if (sender_id) {
            updateQuery += ' AND sender_id = ?';
            params.push(sender_id);
        }

        const result = await execute(updateQuery, params);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: `${result.affectedRows} message(s) marked as read`
        });

    } catch (error) {
        console.error('Mark all as read error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to mark messages as read'
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const [count] = await query(
            'SELECT COUNT(*) as unread_count FROM messages WHERE recipient_id = ? AND is_read = 0',
            [userId]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                unread_count: count.unread_count
            }
        });

    } catch (error) {
        console.error('Get unread count error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to get unread count'
        });
    }
};

const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const conversations = await query(`
            SELECT 
                CASE 
                    WHEN m.sender_id = ? THEN m.recipient_id
                    ELSE m.sender_id
                END as other_user_id,
                u.full_name as other_user_name,
                u.profile_image as other_user_image,
                u.role as other_user_role,
                MAX(m.created_at) as last_message_time,
                SUM(CASE WHEN m.recipient_id = ? AND m.is_read = 0 THEN 1 ELSE 0 END) as unread_count,
                MAX(m.id) as last_message_id,
                MAX(CASE 
                    WHEN m.sender_id = ? THEN 'sent'
                    ELSE 'received'
                END) as last_message_type,
                MAX(CASE 
                    WHEN m.sender_id = ? THEN m.content
                    ELSE m.content
                END) as last_message_preview
            FROM messages m
            JOIN users u ON (
                CASE 
                    WHEN m.sender_id = ? THEN m.recipient_id
                    ELSE m.sender_id
                END = u.id
            )
            WHERE (m.sender_id = ? OR m.recipient_id = ?)
                AND (m.sender_id = ? AND m.sender_deleted = 0 
                     OR m.recipient_id = ? AND m.recipient_deleted = 0)
            GROUP BY other_user_id, u.full_name, u.profile_image, u.role
            ORDER BY last_message_time DESC
            LIMIT ? OFFSET ?
        `, [userId, userId, userId, userId, userId, userId, userId, userId, userId, parseInt(limit), offset]);

        const [{ total }] = await query(`
            SELECT COUNT(DISTINCT 
                CASE 
                    WHEN m.sender_id = ? THEN m.recipient_id
                    ELSE m.sender_id
                END
            ) as total_conversations
            FROM messages m
            WHERE (m.sender_id = ? OR m.recipient_id = ?)
                AND (m.sender_id = ? AND m.sender_deleted = 0 
                     OR m.recipient_id = ? AND m.recipient_deleted = 0)
        `, [userId, userId, userId, userId, userId]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: conversations,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get conversations error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch conversations'
        });
    }
};

const getConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { other_user_id } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const [otherUser] = await query(
            'SELECT id, full_name, profile_image, role, email FROM users WHERE id = ?',
            [other_user_id]
        );

        if (!otherUser) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        const messages = await query(`
            SELECT m.*, 
                   su.full_name as sender_name, su.profile_image as sender_image,
                   ru.full_name as recipient_name, ru.profile_image as recipient_image
            FROM messages m
            JOIN users su ON m.sender_id = su.id
            JOIN users ru ON m.recipient_id = ru.id
            WHERE ((m.sender_id = ? AND m.recipient_id = ?) 
                   OR (m.sender_id = ? AND m.recipient_id = ?))
                AND (m.sender_id = ? AND m.sender_deleted = 0 
                     OR m.recipient_id = ? AND m.recipient_deleted = 0)
            ORDER BY m.created_at DESC
            LIMIT ? OFFSET ?
        `, [userId, other_user_id, other_user_id, userId, userId, userId, parseInt(limit), offset]);

        await execute(
            'UPDATE messages SET is_read = 1, read_at = NOW() WHERE recipient_id = ? AND sender_id = ? AND is_read = 0',
            [userId, other_user_id]
        );

        const [{ total }] = await query(`
            SELECT COUNT(*) as total
            FROM messages m
            WHERE ((m.sender_id = ? AND m.recipient_id = ?) 
                   OR (m.sender_id = ? AND m.recipient_id = ?))
                AND (m.sender_id = ? AND m.sender_deleted = 0 
                     OR m.recipient_id = ? AND m.recipient_deleted = 0)
        `, [userId, other_user_id, other_user_id, userId, userId, userId]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                other_user: otherUser,
                messages: messages,
                pagination: {
                    total: total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get conversation error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch conversation'
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getMessageById,
    replyToMessage,
    deleteMessage,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getConversations,
    getConversation
};