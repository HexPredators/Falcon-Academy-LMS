const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query, execute } = require('../config/database');
const emailService = require('../utils/emailService');
const { USER_ROLES, DIRECTOR_GRADE_ACCESS, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const getUsers = async (req, res) => {
    try {
        const user = req.user;
        const { role, grade, section, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT u.id, u.email, u.full_name, u.phone, u.role, 
                   u.profile_image, u.is_active, u.created_at,
                   s.grade, s.section, s.stream, s.fav_id,
                   t.teacher_id
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN teachers t ON u.id = t.user_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (user.role !== USER_ROLES.SUPER_ADMIN) {
            baseQuery += ' AND u.role != ?';
            queryParams.push(USER_ROLES.SUPER_ADMIN);
        }

        if (role) {
            baseQuery += ' AND u.role = ?';
            queryParams.push(role);
        }

        if (grade) {
            baseQuery += ' AND s.grade = ?';
            queryParams.push(grade);
        }

        if (section) {
            baseQuery += ' AND s.section = ?';
            queryParams.push(section);
        }

        if (search) {
            baseQuery += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR s.fav_id LIKE ? OR t.teacher_id LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            baseQuery += ' AND s.grade BETWEEN ? AND ?';
            queryParams.push(gradeRange.min, gradeRange.max);
        }

        baseQuery += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const users = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            WHERE 1=1
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: users,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        let queryStr = `
            SELECT u.*, 
                   s.fav_id, s.grade, s.section, s.stream,
                   t.teacher_id,
                   p.id as parent_id
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN teachers t ON u.id = t.user_id
            LEFT JOIN parents p ON u.id = p.user_id
            WHERE u.id = ?
        `;
        const params = [id];

        const [userData] = await query(queryStr, params);

        if (!userData) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== USER_ROLES.SUPER_ADMIN && user.id !== parseInt(id)) {
            if (userData.role === USER_ROLES.SUPER_ADMIN) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
                if (userData.grade) {
                    const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
                    if (userData.grade < gradeRange.min || userData.grade > gradeRange.max) {
                        return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                            success: false,
                            message: 'Access denied to this grade'
                        });
                    }
                }
            }
        }

        delete userData.password;
        delete userData.otp;
        delete userData.otp_expiry;
        delete userData.reset_token;
        delete userData.reset_token_expiry;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: userData
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { email, password, full_name, phone, role, language = 'en' } = req.body;

        const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(API_RESPONSE_CODES.CONFLICT).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password || 'Password123', 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const result = await execute(
            'INSERT INTO users (email, password, full_name, phone, role, otp, otp_expiry, language, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, full_name, phone, role, otp, otpExpiry, language, true]
        );

        const userId = result.insertId;

        if (role === USER_ROLES.STUDENT) {
            const { fav_id, grade, section, stream } = req.body;
            
            await execute(
                'INSERT INTO students (user_id, fav_id, grade, section, stream) VALUES (?, ?, ?, ?, ?)',
                [userId, fav_id.toUpperCase(), grade, section.toUpperCase(), stream || null]
            );
        } else if (role === USER_ROLES.TEACHER) {
            const { teacher_id, subjects, grades, sections } = req.body;
            
            await execute(
                'INSERT INTO teachers (user_id, teacher_id) VALUES (?, ?)',
                [userId, teacher_id]
            );

            if (subjects && Array.isArray(subjects)) {
                for (const subject of subjects) {
                    await execute(
                        'INSERT INTO teacher_subjects (teacher_id, subject) VALUES (?, ?)',
                        [userId, subject]
                    );
                }
            }

            if (grades && sections && Array.isArray(grades) && Array.isArray(sections)) {
                for (const grade of grades) {
                    for (const section of sections) {
                        await execute(
                            'INSERT INTO teacher_assignments (teacher_id, grade, section) VALUES (?, ?, ?)',
                            [userId, grade, section]
                        );
                    }
                }
            }
        } else if (role === USER_ROLES.PARENT) {
            await execute(
                'INSERT INTO parents (user_id) VALUES (?)',
                [userId]
            );
        }

        await emailService.sendWelcomeEmail(email, full_name, language);

        const [newUser] = await query(
            'SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at FROM users u WHERE u.id = ?',
            [userId]
        );

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });

    } catch (error) {
        console.error('Create user error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to create user'
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = req.user;

        const [existingUser] = await query('SELECT role FROM users WHERE id = ?', [id]);
        if (!existingUser) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        if (existingUser.role === USER_ROLES.SUPER_ADMIN && user.role !== USER_ROLES.SUPER_ADMIN) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot modify super admin'
            });
        }

        const allowedFields = ['full_name', 'phone', 'role', 'is_active', 'profile_image', 'language'];
        const filteredUpdates = {};

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        });

        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'No valid updates provided'
            });
        }

        if (updates.role && updates.role !== existingUser.role) {
            await handleRoleChange(id, existingUser.role, updates.role, updates);
        }

        if (Object.keys(filteredUpdates).length > 0) {
            const setClause = Object.keys(filteredUpdates).map(field => `${field} = ?`).join(', ');
            const values = Object.values(filteredUpdates);
            values.push(id);

            await execute(
                `UPDATE users SET ${setClause} WHERE id = ?`,
                values
            );
        }

        if (updates.fav_id || updates.grade || updates.section || updates.stream) {
            await updateStudentInfo(id, updates);
        }

        if (updates.teacher_id || updates.subjects || updates.grades || updates.sections) {
            await updateTeacherInfo(id, updates);
        }

        const [updatedUser] = await query(
            'SELECT u.*, s.grade, s.section, s.stream, s.fav_id, t.teacher_id FROM users u LEFT JOIN students s ON u.id = s.user_id LEFT JOIN teachers t ON u.id = t.user_id WHERE u.id = ?',
            [id]
        );

        delete updatedUser.password;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update user error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};

const handleRoleChange = async (userId, oldRole, newRole, updates) => {
    if (oldRole === USER_ROLES.STUDENT) {
        await execute('DELETE FROM students WHERE user_id = ?', [userId]);
    } else if (oldRole === USER_ROLES.TEACHER) {
        await execute('DELETE FROM teachers WHERE user_id = ?', [userId]);
        await execute('DELETE FROM teacher_subjects WHERE teacher_id = ?', [userId]);
        await execute('DELETE FROM teacher_assignments WHERE teacher_id = ?', [userId]);
    } else if (oldRole === USER_ROLES.PARENT) {
        await execute('DELETE FROM parents WHERE user_id = ?', [userId]);
        await execute('DELETE FROM parent_child_links WHERE parent_id = ?', [userId]);
    }

    if (newRole === USER_ROLES.STUDENT) {
        await execute(
            'INSERT INTO students (user_id, fav_id, grade, section, stream) VALUES (?, ?, ?, ?, ?)',
            [userId, updates.fav_id || 'N/A', updates.grade || 9, updates.section || 'A', updates.stream || null]
        );
    } else if (newRole === USER_ROLES.TEACHER) {
        await execute(
            'INSERT INTO teachers (user_id, teacher_id) VALUES (?, ?)',
            [userId, updates.teacher_id || `TCH${Date.now().toString().slice(-4)}`]
        );
    } else if (newRole === USER_ROLES.PARENT) {
        await execute(
            'INSERT INTO parents (user_id) VALUES (?)',
            [userId]
        );
    }
};

const updateStudentInfo = async (userId, updates) => {
    const studentUpdates = {};
    if (updates.fav_id) studentUpdates.fav_id = updates.fav_id;
    if (updates.grade) studentUpdates.grade = updates.grade;
    if (updates.section) studentUpdates.section = updates.section;
    if (updates.stream !== undefined) studentUpdates.stream = updates.stream;

    if (Object.keys(studentUpdates).length > 0) {
        const [existingStudent] = await query('SELECT user_id FROM students WHERE user_id = ?', [userId]);
        
        if (existingStudent) {
            const setClause = Object.keys(studentUpdates).map(field => `${field} = ?`).join(', ');
            const values = Object.values(studentUpdates);
            values.push(userId);

            await execute(
                `UPDATE students SET ${setClause} WHERE user_id = ?`,
                values
            );
        } else {
            await execute(
                'INSERT INTO students (user_id, fav_id, grade, section, stream) VALUES (?, ?, ?, ?, ?)',
                [userId, studentUpdates.fav_id || 'N/A', studentUpdates.grade || 9, studentUpdates.section || 'A', studentUpdates.stream || null]
            );
        }
    }
};

const updateTeacherInfo = async (userId, updates) => {
    if (updates.teacher_id) {
        const [existingTeacher] = await query('SELECT user_id FROM teachers WHERE user_id = ?', [userId]);
        
        if (existingTeacher) {
            await execute(
                'UPDATE teachers SET teacher_id = ? WHERE user_id = ?',
                [updates.teacher_id, userId]
            );
        } else {
            await execute(
                'INSERT INTO teachers (user_id, teacher_id) VALUES (?, ?)',
                [userId, updates.teacher_id]
            );
        }
    }

    if (updates.subjects && Array.isArray(updates.subjects)) {
        await execute('DELETE FROM teacher_subjects WHERE teacher_id = ?', [userId]);
        for (const subject of updates.subjects) {
            await execute(
                'INSERT INTO teacher_subjects (teacher_id, subject) VALUES (?, ?)',
                [userId, subject]
            );
        }
    }

    if (updates.grades && updates.sections && Array.isArray(updates.grades) && Array.isArray(updates.sections)) {
        await execute('DELETE FROM teacher_assignments WHERE teacher_id = ?', [userId]);
        for (const grade of updates.grades) {
            for (const section of updates.sections) {
                await execute(
                    'INSERT INTO teacher_assignments (teacher_id, grade, section) VALUES (?, ?, ?)',
                    [userId, grade, section]
                );
            }
        }
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (user.id === parseInt(id)) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const [existingUser] = await query('SELECT role FROM users WHERE id = ?', [id]);
        if (!existingUser) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        if (existingUser.role === USER_ROLES.SUPER_ADMIN) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot delete super admin'
            });
        }

        await execute('DELETE FROM users WHERE id = ?', [id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};

const bulkImportUsers = async (req, res) => {
    try {
        const users = req.body.users;
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'No users provided for import'
            });
        }

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const userData of users) {
            try {
                const hashedPassword = await bcrypt.hash(userData.password || 'Password123', 10);
                
                const result = await execute(
                    'INSERT INTO users (email, password, full_name, phone, role, language, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userData.email, hashedPassword, userData.full_name, userData.phone, userData.role, userData.language || 'en', true]
                );

                const userId = result.insertId;

                if (userData.role === USER_ROLES.STUDENT) {
                    await execute(
                        'INSERT INTO students (user_id, fav_id, grade, section, stream) VALUES (?, ?, ?, ?, ?)',
                        [userId, userData.fav_id, userData.grade, userData.section, userData.stream || null]
                    );
                } else if (userData.role === USER_ROLES.TEACHER) {
                    await execute(
                        'INSERT INTO teachers (user_id, teacher_id) VALUES (?, ?)',
                        [userId, userData.teacher_id]
                    );

                    if (userData.subjects) {
                        for (const subject of userData.subjects) {
                            await execute(
                                'INSERT INTO teacher_subjects (teacher_id, subject) VALUES (?, ?)',
                                [userId, subject]
                            );
                        }
                    }

                    if (userData.grades && userData.sections) {
                        for (const grade of userData.grades) {
                            for (const section of userData.sections) {
                                await execute(
                                    'INSERT INTO teacher_assignments (teacher_id, grade, section) VALUES (?, ?, ?)',
                                    [userId, grade, section]
                                );
                            }
                        }
                    }
                } else if (userData.role === USER_ROLES.PARENT) {
                    await execute(
                        'INSERT INTO parents (user_id) VALUES (?)',
                        [userId]
                    );
                }

                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    email: userData.email,
                    error: error.message
                });
            }
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: `Bulk import completed: ${results.success} successful, ${results.failed} failed`,
            data: results
        });

    } catch (error) {
        console.error('Bulk import error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Bulk import failed'
        });
    }
};

const bulkExportUsers = async (req, res) => {
    try {
        const { role, format = 'json' } = req.query;
        const user = req.user;

        let queryStr = `
            SELECT u.email, u.full_name, u.phone, u.role, u.language, u.is_active,
                   s.fav_id, s.grade, s.section, s.stream,
                   t.teacher_id
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN teachers t ON u.id = t.user_id
            WHERE u.role != ?
        `;
        const params = [USER_ROLES.SUPER_ADMIN];

        if (role) {
            queryStr += ' AND u.role = ?';
            params.push(role);
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            queryStr += ' AND s.grade BETWEEN ? AND ?';
            params.push(gradeRange.min, gradeRange.max);
        }

        const users = await query(queryStr, params);

        if (format === 'csv') {
            const csv = convertToCSV(users);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
            return res.send(csv);
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Bulk export error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to export users'
        });
    }
};

const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
};

const getUserActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        let queryStr = `
            SELECT id, action, details, ip_address, user_agent, created_at
            FROM user_activity
            WHERE user_id = ?
        `;
        const params = [id];

        if (startDate) {
            queryStr += ' AND DATE(created_at) >= ?';
            params.push(startDate);
        }

        if (endDate) {
            queryStr += ' AND DATE(created_at) <= ?';
            params.push(endDate);
        }

        queryStr += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const activities = await query(queryStr, params);

        const [{ total }] = await query(
            'SELECT COUNT(*) as total FROM user_activity WHERE user_id = ?',
            [id]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: activities,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get user activity error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch user activity'
        });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const [user] = await query('SELECT role FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === USER_ROLES.SUPER_ADMIN) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot change super admin status'
            });
        }

        await execute(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [is_active, id]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
        });

    } catch (error) {
        console.error('Toggle user status error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update user status'
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkImportUsers,
    bulkExportUsers,
    getUserActivity,
    toggleUserStatus
};