const Joi = require('joi');
const { isValidObjectId } = require('mongoose');

const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        next();
    };
};

const schemas = {
    register: Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
        role: Joi.string().valid(
            'student', 
            'teacher', 
            'parent', 
            'school_admin',
            'librarian',
            'other'
        ).required()
    }),

    studentRegister: Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        favId: Joi.string().pattern(/^FAV\/\d{4}\/\d{2}$/).required(),
        grade: Joi.number().valid(9, 10, 11, 12).required(),
        section: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G').required(),
        stream: Joi.string().valid('natural', 'social').when('grade', {
            is: Joi.number().valid(11, 12),
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        birthDate: Joi.date().max(new Date()),
        address: Joi.string().max(200)
    }),

    teacherRegister: Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
        teacherId: Joi.string().pattern(/^TCH\/\d{4}\/\d{3}$/).required(),
        subjects: Joi.array().items(Joi.string()).min(1).required(),
        assignedGrades: Joi.array().items(Joi.number().valid(9, 10, 11, 12)).min(1).required(),
        assignedSections: Joi.array().items(Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G')).min(1).required(),
        assignedStreams: Joi.array().items(Joi.string().valid('natural', 'social')).optional(),
        qualification: Joi.string().max(200),
        experience: Joi.number().min(0)
    }),

    parentRegister: Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
        occupation: Joi.string().max(100),
        address: Joi.string().max(200)
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        rememberMe: Joi.boolean().default(false)
    }),

    assignment: Joi.object({
        title: Joi.string().min(3).max(200).required(),
        description: Joi.string().max(1000),
        subject: Joi.string().required(),
        grade: Joi.number().valid(9, 10, 11, 12).required(),
        section: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G').required(),
        dueDate: Joi.date().greater('now').required(),
        totalPoints: Joi.number().min(1).max(100).required(),
        instructions: Joi.string().max(500),
        allowLateSubmission: Joi.boolean().default(false),
        submissionFormat: Joi.array().items(Joi.string().valid('pdf', 'doc', 'docx')).default(['pdf'])
    }),

    quiz: Joi.object({
        title: Joi.string().min(3).max(200).required(),
        description: Joi.string().max(500),
        subject: Joi.string().required(),
        grade: Joi.number().valid(9, 10, 11, 12).required(),
        section: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G').required(),
        duration: Joi.number().min(1).max(180).required(),
        totalQuestions: Joi.number().min(1).max(100).required(),
        passingScore: Joi.number().min(0).max(100).default(50),
        questions: Joi.array().items(Joi.object({
            questionText: Joi.string().required(),
            questionType: Joi.string().valid('multiple_choice', 'true_false', 'short_answer', 'essay').required(),
            options: Joi.when('questionType', {
                is: 'multiple_choice',
                then: Joi.array().items(Joi.string()).min(2).required()
            }),
            correctAnswer: Joi.alternatives().try(
                Joi.string(),
                Joi.number(),
                Joi.boolean(),
                Joi.array().items(Joi.string())
            ).required(),
            points: Joi.number().min(1).default(1)
        })).min(1).required(),
        scheduledFor: Joi.date().greater('now'),
        isPublished: Joi.boolean().default(false)
    }),

    book: Joi.object({
        title: Joi.string().min(3).max(200).required(),
        author: Joi.string().max(100).required(),
        isbn: Joi.string().pattern(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/),
        category: Joi.string().valid('academic', 'fiction', 'reference', 'teacher_resource', 'student_resource').required(),
        subject: Joi.string().when('category', {
            is: 'academic',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        grade: Joi.number().valid(9, 10, 11, 12).when('category', {
            is: 'academic',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        stream: Joi.string().valid('natural', 'social').when('grade', {
            is: Joi.number().valid(11, 12),
            then: Joi.optional(),
            otherwise: Joi.forbidden()
        }),
        language: Joi.string().valid('am', 'en', 'or', 'ti').default('en'),
        publicationYear: Joi.number().min(1900).max(new Date().getFullYear()),
        publisher: Joi.string().max(100),
        pages: Joi.number().min(1),
        description: Joi.string().max(1000)
    }),

    news: Joi.object({
        title: Joi.string().min(3).max(200).required(),
        content: Joi.string().min(10).required(),
        visibility: Joi.string().valid('public', 'school', 'grade', 'section').required(),
        targetGrades: Joi.array().items(Joi.number().valid(9, 10, 11, 12)).when('visibility', {
            is: 'grade',
            then: Joi.required().min(1),
            otherwise: Joi.optional()
        }),
        targetSections: Joi.array().items(Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G')).when('visibility', {
            is: 'section',
            then: Joi.required().min(1),
            otherwise: Joi.optional()
        }),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
        scheduledPublish: Joi.date().greater('now'),
        expireDate: Joi.date().greater(Joi.ref('scheduledPublish')).greater('now')
    }),

    message: Joi.object({
        recipientType: Joi.string().valid('student', 'teacher', 'parent', 'grade', 'section', 'all').required(),
        recipientIds: Joi.when('recipientType', {
            is: Joi.string().valid('student', 'teacher', 'parent'),
            then: Joi.array().items(Joi.string().custom(objectIdValidator)).min(1).required()
        }),
        grade: Joi.when('recipientType', {
            is: 'grade',
            then: Joi.number().valid(9, 10, 11, 12).required()
        }),
        section: Joi.when('recipientType', {
            is: 'section',
            then: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G').required()
        }),
        subject: Joi.string().max(100).required(),
        message: Joi.string().min(1).max(5000).required(),
        attachments: Joi.array().items(Joi.string()).max(5)
    }),

    parentLink: Joi.object({
        studentName: Joi.string().min(3).max(100).required(),
        studentFavId: Joi.string().pattern(/^FAV\/\d{4}\/\d{2}$/).required(),
        studentGrade: Joi.number().valid(9, 10, 11, 12).required(),
        studentSection: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G').required(),
        relationship: Joi.string().valid('father', 'mother', 'guardian', 'other').required()
    }),

    aiRequest: Joi.object({
        module: Joi.string().valid('how_we_work', 'lesson_planner', 'study_planner', 'learning_support').required(),
        subject: Joi.string(),
        grade: Joi.number().valid(9, 10, 11, 12),
        section: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G'),
        stream: Joi.string().valid('natural', 'social'),
        topic: Joi.string().max(200),
        duration: Joi.string(),
        learningObjectives: Joi.array().items(Joi.string()),
        preferences: Joi.object()
    }),

    profileUpdate: Joi.object({
        fullName: Joi.string().min(3).max(100),
        phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
        profilePicture: Joi.string().uri(),
        language: Joi.string().valid('am', 'en', 'or', 'ti'),
        notificationPreferences: Joi.object({
            email: Joi.boolean(),
            push: Joi.boolean(),
            sms: Joi.boolean()
        }),
        twoFactorEnabled: Joi.boolean()
    }),

    passwordChange: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required().disallow(Joi.ref('currentPassword')),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    }),

    objectId: Joi.string().custom(objectIdValidator, 'ObjectId validation')
};

function objectIdValidator(value, helpers) {
    if (!isValidObjectId(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}

const validateFile = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const allowedTypes = {
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif'
    };

    if (!allowedTypes[req.file.mimetype]) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type'
        });
    }

    const maxSize = 10 * 1024 * 1024;
    if (req.file.size > maxSize) {
        return res.status(400).json({
            success: false,
            message: 'File size exceeds 10MB limit'
        });
    }

    req.file.extension = allowedTypes[req.file.mimetype];
    next();
};

const validateQueryParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Query parameter validation failed',
                errors
            });
        }

        next();
    };
};

const querySchemas = {
    pagination: Joi.object({
        page: Joi.number().min(1).default(1),
        limit: Joi.number().min(1).max(100).default(20),
        sortBy: Joi.string(),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc')
    }),

    filter: Joi.object({
        grade: Joi.number().valid(9, 10, 11, 12),
        section: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G'),
        subject: Joi.string(),
        stream: Joi.string().valid('natural', 'social'),
        status: Joi.string(),
        category: Joi.string(),
        dateFrom: Joi.date(),
        dateTo: Joi.date(),
        search: Joi.string().max(100)
    }),

    analytics: Joi.object({
        period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
        startDate: Joi.date(),
        endDate: Joi.date(),
        grade: Joi.number().valid(9, 10, 11, 12),
        section: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G'),
        subject: Joi.string()
    })
};

const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+="[^"]*"/gi, '')
                    .replace(/on\w+='[^']*'/gi, '')
                    .replace(/on\w+=\w+/gi, '')
                    .trim();
            } else if (typeof obj[key] === 'object') {
                sanitize(obj[key]);
            }
        });
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    
    next();
};

module.exports = {
    validateRequest,
    validateFile,
    validateQueryParams,
    sanitizeInput,
    schemas,
    querySchemas,
    objectIdValidator
};