const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query, execute } = require('../config/database');
const { generateToken } = require('../middleware/auth');
const emailService = require('../utils/emailService');
const { USER_ROLES, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const register = async (req, res) => {
    try {
        const { email, password, full_name, phone, role, language = 'en' } = req.body;

        const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(API_RESPONSE_CODES.CONFLICT).json({
                success: false,
                message: getTranslation('email_exists', language)
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const result = await execute(
            'INSERT INTO users (email, password, full_name, phone, role, otp, otp_expiry, language, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, full_name, phone, role, otp, otpExpiry, language, false]
        );

        const userId = result.insertId;

        if (role === USER_ROLES.STUDENT) {
            const { fav_id, grade, section, stream } = req.body;
            
            if (!fav_id || !grade || !section) {
                await execute('DELETE FROM users WHERE id = ?', [userId]);
                return res.status(400).json({
                    success: false,
                    message: getTranslation('student_info_required', language)
                });
            }

            await execute(
                'INSERT INTO students (user_id, fav_id, grade, section, stream) VALUES (?, ?, ?, ?, ?)',
                [userId, fav_id.toUpperCase(), grade, section.toUpperCase(), stream || null]
            );
        } else if (role === USER_ROLES.TEACHER) {
            const { teacher_id, subjects, grades, sections } = req.body;
            
            if (!teacher_id || !subjects || !grades || !sections) {
                await execute('DELETE FROM users WHERE id = ?', [userId]);
                return res.status(400).json({
                    success: false,
                    message: getTranslation('teacher_info_required', language)
                });
            }

            await execute(
                'INSERT INTO teachers (user_id, teacher_id) VALUES (?, ?)',
                [userId, teacher_id]
            );

            for (const subject of subjects) {
                await execute(
                    'INSERT INTO teacher_subjects (teacher_id, subject) VALUES (?, ?)',
                    [userId, subject]
                );
            }

            for (const grade of grades) {
                for (const section of sections) {
                    await execute(
                        'INSERT INTO teacher_assignments (teacher_id, grade, section) VALUES (?, ?, ?)',
                        [userId, grade, section]
                    );
                }
            }
        } else if (role === USER_ROLES.PARENT) {
            await execute(
                'INSERT INTO parents (user_id) VALUES (?)',
                [userId]
            );
        }

        await emailService.sendOTP(email, otp, full_name, language);

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: getTranslation('registration_success', language),
            data: {
                userId: userId,
                email: email,
                requiresVerification: true
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('registration_failed', req.body.language || 'en')
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const [user] = await query(
            'SELECT id, otp, otp_expiry, full_name, language FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: getTranslation('user_not_found', 'en')
            });
        }

        if (user.otp !== otp) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: getTranslation('invalid_otp', user.language || 'en')
            });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: getTranslation('otp_expired', user.language || 'en')
            });
        }

        await execute(
            'UPDATE users SET is_active = 1, otp = NULL, otp_expiry = NULL WHERE id = ?',
            [user.id]
        );

        const [updatedUser] = await query(
            'SELECT u.*, s.grade, s.section, s.stream, t.teacher_id FROM users u LEFT JOIN students s ON u.id = s.user_id LEFT JOIN teachers t ON u.id = t.user_id WHERE u.id = ?',
            [user.id]
        );

        const token = generateToken(updatedUser);

        await emailService.sendWelcomeEmail(updatedUser.email, updatedUser.full_name, updatedUser.language || 'en');

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('verification_success', updatedUser.language || 'en'),
            data: {
                token: token,
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    full_name: updatedUser.full_name,
                    role: updatedUser.role,
                    grade: updatedUser.grade,
                    section: updatedUser.section,
                    stream: updatedUser.stream,
                    teacher_id: updatedUser.teacher_id,
                    language: updatedUser.language
                }
            }
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('verification_failed', 'en')
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user] = await query(
            'SELECT u.*, s.grade, s.section, s.stream, t.teacher_id FROM users u LEFT JOIN students s ON u.id = s.user_id LEFT JOIN teachers t ON u.id = t.user_id WHERE u.email = ?',
            [email]
        );

        if (!user) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: getTranslation('invalid_credentials', 'en')
            });
        }

        if (!user.is_active) {
            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

            await execute(
                'UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?',
                [otp, otpExpiry, user.id]
            );

            await emailService.sendOTP(email, otp, user.full_name, user.language || 'en');

            return res.status(API_RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: getTranslation('account_not_verified', user.language || 'en'),
                requiresVerification: true
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(API_RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: getTranslation('invalid_credentials', user.language || 'en')
            });
        }

        const token = generateToken(user);

        await execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('login_success', user.language || 'en'),
            data: {
                token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                    grade: user.grade,
                    section: user.section,
                    stream: user.stream,
                    teacher_id: user.teacher_id,
                    language: user.language,
                    profile_image: user.profile_image
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('login_failed', 'en')
        });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const [user] = await query(
            'SELECT id, full_name, language FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: getTranslation('user_not_found', 'en')
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await execute(
            'UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?',
            [otp, otpExpiry, user.id]
        );

        await emailService.sendOTP(email, otp, user.full_name, user.language || 'en');

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('otp_resent', user.language || 'en')
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('resend_failed', 'en')
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const [user] = await query(
            'SELECT id, full_name, language FROM users WHERE email = ? AND is_active = 1',
            [email]
        );

        if (!user) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: getTranslation('user_not_found', 'en')
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

        await execute(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, user.id]
        );

        await emailService.sendPasswordReset(email, resetToken, user.full_name, user.language || 'en');

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('reset_email_sent', user.language || 'en')
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('reset_failed', 'en')
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const [user] = await query(
            'SELECT id, language FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );

        if (!user) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: getTranslation('invalid_reset_token', 'en')
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await execute(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('password_reset_success', user.language || 'en')
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('password_reset_failed', 'en')
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const [user] = await query(
            'SELECT password, language FROM users WHERE id = ?',
            [userId]
        );

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(API_RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: getTranslation('incorrect_current_password', user.language || 'en')
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('password_changed_success', user.language || 'en')
        });

    } catch (error) {
        console.error('Change password error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('password_change_failed', req.user?.language || 'en')
        });
    }
};

const logout = async (req, res) => {
    try {
        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('logout_success', req.user?.language || 'en')
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('logout_failed', 'en')
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [user] = await query(
            `SELECT u.*, 
                    s.fav_id, s.grade, s.section, s.stream,
                    t.teacher_id,
                    p.id as parent_id
             FROM users u
             LEFT JOIN students s ON u.id = s.user_id
             LEFT JOIN teachers t ON u.id = t.user_id
             LEFT JOIN parents p ON u.id = p.user_id
             WHERE u.id = ?`,
            [userId]
        );

        if (!user) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: getTranslation('user_not_found', 'en')
            });
        }

        delete user.password;
        delete user.otp;
        delete user.otp_expiry;
        delete user.reset_token;
        delete user.reset_token_expiry;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('profile_fetch_failed', req.user?.language || 'en')
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const allowedFields = ['full_name', 'phone', 'profile_image', 'language'];
        const filteredUpdates = {};

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        });

        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: getTranslation('no_valid_updates', req.user?.language || 'en')
            });
        }

        const setClause = Object.keys(filteredUpdates).map(field => `${field} = ?`).join(', ');
        const values = Object.values(filteredUpdates);
        values.push(userId);

        await execute(
            `UPDATE users SET ${setClause} WHERE id = ?`,
            values
        );

        const [updatedUser] = await query(
            'SELECT id, email, full_name, phone, profile_image, role, language FROM users WHERE id = ?',
            [userId]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: getTranslation('profile_updated', updatedUser.language || 'en'),
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: getTranslation('profile_update_failed', req.user?.language || 'en')
        });
    }
};

module.exports = {
    register,
    verifyOTP,
    login,
    resendOTP,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    getProfile,
    updateProfile
};