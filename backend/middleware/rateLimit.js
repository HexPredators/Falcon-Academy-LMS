const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const User = require('../models/User');

let redisClient;

if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
} else if (process.env.REDIS_HOST) {
    redisClient = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    });
}

const createRateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000,
        max = 100,
        message = 'Too many requests from this IP, please try again later',
        skipSuccessfulRequests = false,
        keyGenerator = (req) => req.ip,
        skip = () => false
    } = options;

    const store = redisClient ? 
        new RedisStore({
            client: redisClient,
            prefix: 'rl:'
        }) : undefined;

    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        keyGenerator,
        skip,
        store,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: message,
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts, please try again after 15 minutes',
    skipSuccessfulRequests: true,
    keyGenerator: (req) => req.body.email || req.ip
});

const otpLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: 'Too many OTP requests, please try again after 5 minutes',
    keyGenerator: (req) => req.body.email || req.ip
});

const apiLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 60,
    message: 'Too many API requests, please slow down'
});

const uploadLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: 'Too many file uploads, please try again later'
});

const roleBasedLimiter = (req, res, next) => {
    const roleLimits = {
        'student': { windowMs: 60 * 1000, max: 30 },
        'teacher': { windowMs: 60 * 1000, max: 60 },
        'parent': { windowMs: 60 * 1000, max: 30 },
        'school_admin': { windowMs: 60 * 1000, max: 100 },
        'director_kidane': { windowMs: 60 * 1000, max: 150 },
        'director_andargachew': { windowMs: 60 * 1000, max: 150 },
        'director_zerihun': { windowMs: 60 * 1000, max: 150 },
        'super_admin': { windowMs: 60 * 1000, max: 200 },
        'librarian': { windowMs: 60 * 1000, max: 50 },
        'other': { windowMs: 60 * 1000, max: 20 }
    };

    const userRole = req.user?.role || 'anonymous';
    const limitConfig = roleLimits[userRole] || roleLimits['anonymous'] || { windowMs: 60 * 1000, max: 20 };

    const limiter = createRateLimiter({
        ...limitConfig,
        keyGenerator: (req) => `${userRole}:${req.user?._id || req.ip}`,
        skip: (req) => req.user?.role === 'super_admin'
    });

    return limiter(req, res, next);
};

const endpointSpecificLimiter = (endpoint, options = {}) => {
    const endpointLimits = {
        '/api/auth/login': { windowMs: 15 * 60 * 1000, max: 10 },
        '/api/auth/register': { windowMs: 60 * 60 * 1000, max: 5 },
        '/api/auth/forgot-password': { windowMs: 60 * 60 * 1000, max: 3 },
        '/api/ai/generate': { windowMs: 60 * 1000, max: 10 },
        '/api/assignments/submit': { windowMs: 5 * 60 * 1000, max: 5 },
        '/api/quizzes/submit': { windowMs: 5 * 60 * 1000, max: 5 },
        '/api/messages/send': { windowMs: 60 * 1000, max: 20 },
        '/api/news/create': { windowMs: 5 * 60 * 1000, max: 10 },
        '/api/library/upload': { windowMs: 60 * 60 * 1000, max: 10 }
    };

    const defaultLimit = { windowMs: 60 * 1000, max: 30 };
    const limitConfig = endpointLimits[endpoint] || defaultLimit;

    return createRateLimiter({
        ...limitConfig,
        ...options,
        keyGenerator: (req) => `${endpoint}:${req.user?._id || req.ip}`
    });
};

const dynamicRateLimiter = async (req, res, next) => {
    try {
        const user = req.user;
        let maxRequests = 30;
        let windowMs = 60 * 1000;

        if (user) {
            const userDoc = await User.findById(user._id).select('rateLimitTier apiUsage');
            
            const tierLimits = {
                'free': { max: 30, windowMs: 60 * 1000 },
                'basic': { max: 100, windowMs: 60 * 1000 },
                'premium': { max: 500, windowMs: 60 * 1000 },
                'unlimited': { max: 1000, windowMs: 60 * 1000 }
            };

            const userTier = userDoc?.rateLimitTier || 'free';
            const tierConfig = tierLimits[userTier] || tierLimits.free;
            
            maxRequests = tierConfig.max;
            windowMs = tierConfig.windowMs;

            if (userDoc?.apiUsage) {
                const today = new Date().toISOString().split('T')[0];
                const todayUsage = userDoc.apiUsage.find(u => u.date === today);
                
                if (todayUsage && todayUsage.count >= maxRequests * 0.9) {
                    maxRequests = Math.floor(maxRequests * 0.8);
                }
            }
        }

        const limiter = createRateLimiter({
            windowMs,
            max: maxRequests,
            keyGenerator: (req) => user ? `user:${user._id}` : `ip:${req.ip}`,
            skip: (req) => req.user?.role === 'super_admin'
        });

        return limiter(req, res, next);
    } catch (error) {
        console.error('Dynamic rate limit error:', error);
        
        const fallbackLimiter = createRateLimiter({
            windowMs: 60 * 1000,
            max: 30
        });
        
        return fallbackLimiter(req, res, next);
    }
};

const burstProtection = createRateLimiter({
    windowMs: 1 * 1000,
    max: 10,
    message: 'Too many requests too quickly, please slow down',
    skip: (req) => req.user?.role === 'super_admin'
});

const ddosProtection = createRateLimiter({
    windowMs: 10 * 1000,
    max: 100,
    message: 'Possible DDoS attack detected, access temporarily blocked',
    skip: (req) => {
        const whitelistedIPs = process.env.WHITELISTED_IPS?.split(',') || [];
        return whitelistedIPs.includes(req.ip) || req.user?.role === 'super_admin';
    }
});

const trackApiUsage = async (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', async () => {
        try {
            if (req.user) {
                const duration = Date.now() - startTime;
                const today = new Date().toISOString().split('T')[0];
                
                await User.findByIdAndUpdate(req.user._id, {
                    $inc: { 
                        'apiUsage.totalRequests': 1,
                        'apiUsage.totalResponseTime': duration
                    },
                    $push: {
                        'apiUsage.daily': {
                            date: today,
                            count: 1,
                            responseTime: duration,
                            endpoint: req.originalUrl,
                            method: req.method,
                            statusCode: res.statusCode
                        }
                    }
                });

                if (req.user.apiUsage?.daily?.length > 30) {
                    await User.findByIdAndUpdate(req.user._id, {
                        $pop: { 'apiUsage.daily': -1 }
                    });
                }
            }
        } catch (error) {
            console.error('API usage tracking error:', error);
        }
    });
    
    next();
};

const checkRateLimitStatus = async (userId) => {
    try {
        if (!redisClient) return { limited: false, remaining: 100, resetTime: null };

        const key = `rl:user:${userId}`;
        const [current, reset] = await Promise.all([
            redisClient.get(key),
            redisClient.ttl(key)
        ]);

        const currentCount = parseInt(current || '0', 10);
        const maxRequests = 100;
        const remaining = Math.max(0, maxRequests - currentCount);
        
        return {
            limited: currentCount >= maxRequests,
            remaining,
            resetTime: reset > 0 ? new Date(Date.now() + reset * 1000) : null,
            current: currentCount
        };
    } catch (error) {
        console.error('Rate limit status check error:', error);
        return { limited: false, remaining: 100, resetTime: null, error: error.message };
    }
};

const resetRateLimit = async (key) => {
    try {
        if (redisClient) {
            await redisClient.del(`rl:${key}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Rate limit reset error:', error);
        return false;
    }
};

const exemptPaths = [
    '/api/health',
    '/api/status',
    '/favicon.ico',
    '/robots.txt'
];

const shouldSkipRateLimit = (req) => {
    return exemptPaths.some(path => req.path.startsWith(path)) ||
           req.method === 'OPTIONS' ||
           (req.user && req.user.role === 'super_admin');
};

module.exports = {
    createRateLimiter,
    authLimiter,
    otpLimiter,
    apiLimiter,
    uploadLimiter,
    roleBasedLimiter,
    endpointSpecificLimiter,
    dynamicRateLimiter,
    burstProtection,
    ddosProtection,
    trackApiUsage,
    checkRateLimitStatus,
    resetRateLimit,
    shouldSkipRateLimit,
    redisClient
};