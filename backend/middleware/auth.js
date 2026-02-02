const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        try {
            const user = await User.findById(decoded.userId)
                .select('-password')
                .populate('roleDetails');

            if (!user || !user.isActive) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'User not found or inactive' 
                });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Authentication error' 
            });
        }
    });
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Insufficient permissions' 
            });
        }

        next();
    };
};

const require2FA = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required' 
        });
    }

    if (req.user.requires2FA && !req.user.twoFactorVerified) {
        return res.status(403).json({ 
            success: false, 
            message: 'Two-factor authentication required' 
        });
    }

    next();
};

const verifyOTP = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required' 
        });
    }

    const { otp } = req.body;
    
    if (!otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'OTP is required' 
        });
    }

    if (req.user.twoFactorCode !== otp || req.user.twoFactorExpires < new Date()) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid or expired OTP' 
        });
    }

    req.user.twoFactorVerified = true;
    req.user.twoFactorCode = null;
    req.user.twoFactorExpires = null;
    req.user.save();

    next();
};

const checkSession = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Session expired' 
        });
    }

    if (req.user.lastActivity) {
        const inactivityLimit = 30 * 60 * 1000;
        const timeSinceLastActivity = Date.now() - new Date(req.user.lastActivity).getTime();
        
        if (timeSinceLastActivity > inactivityLimit) {
            return res.status(401).json({ 
                success: false, 
                message: 'Session timeout due to inactivity' 
            });
        }
    }

    req.user.lastActivity = new Date();
    req.user.save();

    next();
};

module.exports = {
    authenticateToken,
    requireRole,
    require2FA,
    verifyOTP,
    checkSession
};