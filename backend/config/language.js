const languages = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        enabled: true,
        default: true
    },
    am: {
        code: 'am',
        name: 'Amharic',
        nativeName: 'አማርኛ',
        direction: 'ltr',
        enabled: true,
        default: false
    },
    om: {
        code: 'om',
        name: 'Afaan Oromoo',
        nativeName: 'Afaan Oromoo',
        direction: 'ltr',
        enabled: true,
        default: false
    },
    ti: {
        code: 'ti',
        name: 'Tigrinya',
        nativeName: 'ትግርኛ',
        direction: 'ltr',
        enabled: true,
        default: false
    }
};

const translations = {
    en: {
        welcome: 'Welcome to Falcon Academy',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        assignments: 'Assignments',
        quizzes: 'Quizzes',
        library: 'Digital Library',
        messages: 'Messages',
        news: 'News',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        grade: 'Grade',
        section: 'Section',
        subject: 'Subject',
        teacher: 'Teacher',
        student: 'Student',
        parent: 'Parent',
        admin: 'Administrator',
        director: 'Director'
    },
    am: {
        welcome: 'ወደ ፍልኮን አካዳሚ እንኳን ደህና መጡ',
        login: 'ግባ',
        register: 'ተመዝገብ',
        dashboard: 'ዳሽቦርድ',
        assignments: 'ስራዎች',
        quizzes: 'ፈተናዎች',
        library: 'ዲጂታል ቤተ መጻሕፍት',
        messages: 'መልዕክቶች',
        news: 'ዜና',
        profile: 'መገለጫ',
        settings: 'ማስተካከያዎች',
        logout: 'ውጣ',
        grade: 'ክፍል',
        section: 'ወረዳ',
        subject: 'መደብ',
        teacher: 'መምህር',
        student: 'ተማሪ',
        parent: 'ወላጅ',
        admin: 'አስተዳዳሪ',
        director: 'ዳይሬክተር'
    },
    om: {
        welcome: 'Falcon Academy tiif baga nagaan dhuftan',
        login: 'Seeni',
        register: 'Galmaa\'i',
        dashboard: 'Daashboordii',
        assignments: 'Hojiiwwan',
        quizzes: 'Qorannoo',
        library: 'Kitaaba Dijitaalaa',
        messages: 'Ergaa',
        news: 'Oduu',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Ba\'i',
        grade: 'Sadaffaa',
        section: 'Qooda',
        subject: 'Madda',
        teacher: 'Barreessaa',
        student: 'Barataa',
        parent: 'Haadha/Abbaa',
        admin: 'Administrator',
        director: 'Director'
    },
    ti: {
        welcome: 'ናብ ፍልኮን ኣካዳሚ ብደሓን መጻእኩም',
        login: 'እቶ',
        register: 'ተመዝገብ',
        dashboard: 'ዳሽቦርድ',
        assignments: 'ስራሕ',
        quizzes: 'ፈተናታት',
        library: 'ዲጂታል ቤተ ክታባት',
        messages: 'መልእኽቲ',
        news: 'ዜና',
        profile: 'መግለጺ',
        settings: 'ምምሕዳር',
        logout: 'ውጻእ',
        grade: 'ክፍሊ',
        section: 'ክፍሊ',
        subject: 'ንጥፈት',
        teacher: 'መምህር',
        student: 'ተማሃራይ',
        parent: 'ወለዲ',
        admin: 'ሰራሕተኛ',
        director: 'ዳይሬክተር'
    }
};

const getLanguage = (code = 'en') => {
    return languages[code] || languages.en;
};

const getTranslation = (key, lang = 'en') => {
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    return translations.en[key] || key;
};

const getAllLanguages = () => {
    return Object.values(languages).filter(lang => lang.enabled);
};

const getDefaultLanguage = () => {
    return Object.values(languages).find(lang => lang.default) || languages.en;
};

const isValidLanguage = (code) => {
    return languages.hasOwnProperty(code) && languages[code].enabled;
};

const getDirection = (langCode) => {
    const lang = getLanguage(langCode);
    return lang.direction;
};

module.exports = {
    languages,
    translations,
    getLanguage,
    getTranslation,
    getAllLanguages,
    getDefaultLanguage,
    isValidLanguage,
    getDirection
};