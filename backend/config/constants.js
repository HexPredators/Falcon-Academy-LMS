const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    DIRECTOR_KIDANE: 'director_kidane',
    DIRECTOR_ALEME: 'director_aleme',
    DIRECTOR_ZERIHUN: 'director_zerihun',
    SCHOOL_ADMIN: 'school_admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent',
    LIBRARIAN: 'librarian',
    OTHER: 'other'
};

const GRADE_LEVELS = {
    9: 'Grade 9',
    10: 'Grade 10',
    11: 'Grade 11',
    12: 'Grade 12'
};

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const STREAMS = {
    NATURAL_SCIENCE: 'natural_science',
    SOCIAL_SCIENCE: 'social_science'
};

const GRADE_STREAMS = {
    9: [],
    10: [],
    11: [STREAMS.NATURAL_SCIENCE, STREAMS.SOCIAL_SCIENCE],
    12: [STREAMS.NATURAL_SCIENCE, STREAMS.SOCIAL_SCIENCE]
};

const ETHIOPIAN_SUBJECTS = {
    9: [
        'Mathematics',
        'English',
        'Amharic',
        'Physics',
        'Chemistry',
        'Biology',
        'History',
        'Geography',
        'Civics',
        'ICT'
    ],
    10: [
        'Mathematics',
        'English',
        'Amharic',
        'Physics',
        'Chemistry',
        'Biology',
        'History',
        'Geography',
        'Civics',
        'ICT'
    ],
    11: {
        natural_science: [
            'Mathematics',
            'English',
            'Amharic',
            'Physics',
            'Chemistry',
            'Biology',
            'ICT'
        ],
        social_science: [
            'Mathematics',
            'English',
            'Amharic',
            'History',
            'Geography',
            'Economics',
            'Civics',
            'ICT'
        ]
    },
    12: {
        natural_science: [
            'Mathematics',
            'English',
            'Amharic',
            'Physics',
            'Chemistry',
            'Biology',
            'ICT'
        ],
        social_science: [
            'Mathematics',
            'English',
            'Amharic',
            'History',
            'Geography',
            'Economics',
            'Civics',
            'ICT'
        ]
    }
};

const ASSIGNMENT_STATUS = {
    PENDING: 'pending',
    SUBMITTED: 'submitted',
    GRADED: 'graded',
    OVERDUE: 'overdue'
};

const QUIZ_TYPES = {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    SHORT_ANSWER: 'short_answer',
    ESSAY: 'essay'
};

const BOOK_CATEGORIES = {
    ACADEMIC: 'academic',
    FICTION: 'fiction',
    REFERENCE: 'reference',
    TEACHER_RESOURCE: 'teacher_resource',
    STUDENT_GUIDE: 'student_guide'
};

const NEWS_VISIBILITY = {
    PUBLIC: 'public',
    SCHOOL: 'school',
    GRADE: 'grade',
    SECTION: 'section'
};

const FILE_TYPES = {
    PDF: 'pdf',
    DOCUMENT: 'document',
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio'
};

const MAX_FILE_SIZES = {
    PDF: 10 * 1024 * 1024,
    IMAGE: 5 * 1024 * 1024,
    VIDEO: 100 * 1024 * 1024,
    AUDIO: 20 * 1024 * 1024
};

const DIRECTOR_GRADE_ACCESS = {
    [USER_ROLES.DIRECTOR_KIDANE]: { min: 9, max: 12 },
    [USER_ROLES.DIRECTOR_ANDARGACHEW]: { min: 11, max: 12 },
    [USER_ROLES.DIRECTOR_ZERIHUN]: { min: 9, max: 10 }
};

const ACADEMIC_TERMS = {
    FIRST_SEMESTER: 'first_semester',
    SECOND_SEMESTER: 'second_semester'
};

const PERMISSIONS = {
    USER_MANAGEMENT: 'user_management',
    CONTENT_CREATION: 'content_creation',
    GRADE_MANAGEMENT: 'grade_management',
    SYSTEM_CONFIG: 'system_config',
    ANALYTICS_VIEW: 'analytics_view',
    COMMUNICATION: 'communication'
};

const ROLE_PERMISSIONS = {
    [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
    [USER_ROLES.DIRECTOR_KIDANE]: [
        PERMISSIONS.USER_MANAGEMENT,
        PERMISSIONS.CONTENT_CREATION,
        PERMISSIONS.GRADE_MANAGEMENT,
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.COMMUNICATION
    ],
    [USER_ROLES.DIRECTOR_ANDARGACHEW]: [
        PERMISSIONS.CONTENT_CREATION,
        PERMISSIONS.GRADE_MANAGEMENT,
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.COMMUNICATION
    ],
    [USER_ROLES.DIRECTOR_ZERIHUN]: [
        PERMISSIONS.CONTENT_CREATION,
        PERMISSIONS.GRADE_MANAGEMENT,
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.COMMUNICATION
    ],
    [USER_ROLES.SCHOOL_ADMIN]: [
        PERMISSIONS.USER_MANAGEMENT,
        PERMISSIONS.CONTENT_CREATION,
        PERMISSIONS.COMMUNICATION
    ],
    [USER_ROLES.TEACHER]: [
        PERMISSIONS.CONTENT_CREATION,
        PERMISSIONS.COMMUNICATION
    ],
    [USER_ROLES.STUDENT]: [],
    [USER_ROLES.PARENT]: [],
    [USER_ROLES.LIBRARIAN]: [PERMISSIONS.CONTENT_CREATION]
};

const EMAIL_TEMPLATES = {
    WELCOME: 'welcome',
    OTP_VERIFICATION: 'otp_verification',
    ASSIGNMENT_NOTIFICATION: 'assignment_notification',
    QUIZ_RESULT: 'quiz_result',
    PARENT_LINK_REQUEST: 'parent_link_request',
    GRADE_UPDATE: 'grade_update'
};

const AI_MODULES = {
    HOW_WE_WORK: 'how_we_work',
    LESSON_PLANNER: 'lesson_planner',
    STUDY_PLANNER: 'study_planner',
    LEARNING_SUPPORT: 'learning_support'
};

const API_RESPONSE_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500
};

const DATE_FORMATS = {
    DATABASE: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY: 'DD/MM/YYYY HH:mm',
    ETHIOPIAN: 'DD/MM/YYYY'
};

module.exports = {
    USER_ROLES,
    GRADE_LEVELS,
    SECTIONS,
    STREAMS,
    GRADE_STREAMS,
    ETHIOPIAN_SUBJECTS,
    ASSIGNMENT_STATUS,
    QUIZ_TYPES,
    BOOK_CATEGORIES,
    NEWS_VISIBILITY,
    FILE_TYPES,
    MAX_FILE_SIZES,
    DIRECTOR_GRADE_ACCESS,
    ACADEMIC_TERMS,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    EMAIL_TEMPLATES,
    AI_MODULES,
    API_RESPONSE_CODES,
    DATE_FORMATS
};