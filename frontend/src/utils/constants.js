export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  DIRECTOR: 'director',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  LIBRARIAN: 'librarian',
  OTHER: 'other'
};

export const DIRECTORS = {
  MR_KIDANE: 'Mr. Kidane',
  MR_ANDARGACHEW: 'Mr. Andargachew',
  MR_ZERIHUN: 'Mr. Zerihun'
};

export const GRADE_LEVELS = [9, 10, 11, 12];

export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const STREAMS = {
  NATURAL_SCIENCE: 'Natural Science',
  SOCIAL_SCIENCE: 'Social Science'
};

export const ETHIOPIAN_SUBJECTS = {
  9: [
    'Mathematics',
    'English',
    'Amharic',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'History',
    'Civics',
    'ICT',
    'Physical Education',
    'Music',
    'Art'
  ],
  10: [
    'Mathematics',
    'English',
    'Amharic',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'History',
    'Civics',
    'ICT',
    'Physical Education',
    'Music',
    'Art'
  ],
  G11_NATURAL: [
    'Mathematics',
    'English',
    'Amharic',
    'Physics',
    'Chemistry',
    'Biology',
    'ICT',
    'Physical Education',
    'Technical Drawing',
    'Applied Mathematics'
  ],
  G11_SOCIAL: [
    'Mathematics',
    'English',
    'Amharic',
    'Geography',
    'History',
    'Economics',
    'Business Studies',
    'ICT',
    'Physical Education',
    'Civics'
  ],
  G12_NATURAL: [
    'Mathematics',
    'English',
    'Amharic',
    'Physics',
    'Chemistry',
    'Biology',
    'ICT',
    'Physical Education'
  ],
  G12_SOCIAL: [
    'Mathematics',
    'English',
    'Amharic',
    'Geography',
    'History',
    'Economics',
    'Business Studies',
    'ICT',
    'Physical Education'
  ]
};

export const LANGUAGES = {
  ENGLISH: { code: 'en', name: 'English', nativeName: 'English' },
  AMHARIC: { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  AFAN_OROMO: { code: 'om', name: 'Afan Oromo', nativeName: 'Afaan Oromoo' },
  TIGRIGNA: { code: 'ti', name: 'Tigrigña', nativeName: 'ትግርኛ' }
};

export const NEWS_VISIBILITY = {
  PUBLIC: 'public',
  SCHOOL: 'school',
  GRADE: 'grade',
  SECTION: 'section'
};

export const BOOK_CATEGORIES = {
  ACADEMIC: 'academic',
  FICTION: 'fiction',
  REFERENCE: 'reference',
  TEACHER_RESOURCE: 'teacher_resource',
  STUDENT_RESOURCE: 'student_resource',
  PARENT_GUIDE: 'parent_guide',
  RESEARCH: 'research',
  MAGAZINE: 'magazine',
  NEWSPAPER: 'newspaper'
};

export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  GRADED: 'graded'
};

export const SUBMISSION_STATUS = {
  NOT_SUBMITTED: 'not_submitted',
  SUBMITTED: 'submitted',
  LATE: 'late',
  GRADED: 'graded',
  RETURNED: 'returned'
};

export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
  FILL_BLANK: 'fill_blank',
  MATCHING: 'matching',
  ORDERING: 'ordering'
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const AI_MODULES = {
  HOW_WE_WORK: 'how_we_work',
  LESSON_PLANNER: 'lesson_planner',
  STUDY_PLANNER: 'study_planner',
  INTERACTIVE_SUPPORT: 'interactive_support',
  TUTOR: 'tutor',
  RESOURCE_SUGGESTER: 'resource_suggester'
};

export const GRADE_SCALE = {
  A_PLUS: { min: 90, max: 100, grade: 'A+', gpa: 4.0 },
  A: { min: 85, max: 89, grade: 'A', gpa: 4.0 },
  A_MINUS: { min: 80, max: 84, grade: 'A-', gpa: 3.7 },
  B_PLUS: { min: 75, max: 79, grade: 'B+', gpa: 3.3 },
  B: { min: 70, max: 74, grade: 'B', gpa: 3.0 },
  B_MINUS: { min: 65, max: 69, grade: 'B-', gpa: 2.7 },
  C_PLUS: { min: 60, max: 64, grade: 'C+', gpa: 2.3 },
  C: { min: 55, max: 59, grade: 'C', gpa: 2.0 },
  C_MINUS: { min: 50, max: 54, grade: 'C-', gpa: 1.7 },
  D: { min: 45, max: 49, grade: 'D', gpa: 1.0 },
  F: { min: 0, max: 44, grade: 'F', gpa: 0.0 }
};

export const FILE_TYPES = {
  PDF: ['application/pdf'],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text'
  ],
  SPREADSHEET: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  PRESENTATION: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg']
};

export const MAX_FILE_SIZES = {
  PDF: 10 * 1024 * 1024, // 10MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  AUDIO: 20 * 1024 * 1024 // 20MB
};

export const COLORS = {
  PRIMARY: '#3B82F6',
  PRIMARY_DARK: '#1D4ED8',
  PRIMARY_LIGHT: '#93C5FD',
  SECONDARY: '#10B981',
  SECONDARY_DARK: '#059669',
  SECONDARY_LIGHT: '#A7F3D0',
  ACCENT: '#8B5CF6',
  ACCENT_DARK: '#7C3AED',
  ACCENT_LIGHT: '#C4B5FD',
  DANGER: '#EF4444',
  DANGER_DARK: '#DC2626',
  DANGER_LIGHT: '#FCA5A5',
  WARNING: '#F59E0B',
  WARNING_DARK: '#D97706',
  WARNING_LIGHT: '#FDE68A',
  SUCCESS: '#10B981',
  SUCCESS_DARK: '#059669',
  SUCCESS_LIGHT: '#A7F3D0',
  INFO: '#06B6D4',
  INFO_DARK: '#0891B2',
  INFO_LIGHT: '#67E8F9',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827'
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  RECENT_SEARCHES: 'recent_searches',
  FAVORITES: 'favorites',
  SETTINGS: 'settings'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    ME: '/auth/me',
    PROFILE: '/auth/profile'
  },
  USERS: '/users',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  PARENTS: '/parents',
  ASSIGNMENTS: '/assignments',
  QUIZZES: '/quizzes',
  LIBRARY: '/library',
  NEWS: '/news',
  MESSAGES: '/messages',
  ANALYTICS: '/analytics',
  AI: '/ai'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input values.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'Email already exists.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_TOKEN: 'Invalid or expired token.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  WEAK_PASSWORD: 'Password is too weak.',
  INVALID_FAV_ID: 'Invalid FAV/ID number.',
  STUDENT_NOT_FOUND: 'Student not found.',
  PARENT_LINK_PENDING: 'Parent link request is pending approval.',
  PARENT_LINK_REJECTED: 'Parent link request was rejected.',
  QUIZ_TIME_LIMIT: 'Quiz time limit exceeded.',
  ASSIGNMENT_CLOSED: 'Assignment submission is closed.',
  BOOK_NOT_AVAILABLE: 'Book is not available.',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions.'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  ASSIGNMENT_CREATED: 'Assignment created successfully!',
  ASSIGNMENT_SUBMITTED: 'Assignment submitted successfully!',
  QUIZ_CREATED: 'Quiz created successfully!',
  QUIZ_SUBMITTED: 'Quiz submitted successfully!',
  BOOK_UPLOADED: 'Book uploaded successfully!',
  NEWS_CREATED: 'News created successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  PARENT_LINK_SENT: 'Parent link request sent successfully!',
  PARENT_LINK_ACCEPTED: 'Parent link accepted successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  DATA_IMPORTED: 'Data imported successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  DELETED_SUCCESS: 'Deleted successfully!',
  UPDATED_SUCCESS: 'Updated successfully!'
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ETHIOPIAN_MONTHS = [
  'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

export const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const ETHIOPIAN_DAYS = [
  'እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'
];

export const TIMEZONES = {
  ADDIS_ABABA: 'Africa/Addis_Ababa',
  UTC: 'UTC'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50, 100]
};

export const NOTIFICATION_TYPES = {
  ASSIGNMENT: 'assignment',
  QUIZ: 'quiz',
  GRADE: 'grade',
  MESSAGE: 'message',
  NEWS: 'news',
  SYSTEM: 'system',
  PARENT: 'parent',
  LIBRARY: 'library',
  AI: 'ai'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BLUE: 'blue',
  GREEN: 'green'
};

export const ACCESS_LEVELS = {
  NONE: 0,
  VIEW: 1,
  COMMENT: 2,
  EDIT: 3,
  MANAGE: 4,
  OWNER: 5
};