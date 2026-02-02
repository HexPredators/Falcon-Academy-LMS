import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { toast } from 'react-hot-toast';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      assignments: 'Assignments',
      quizzes: 'Quizzes',
      library: 'Library',
      messages: 'Messages',
      news: 'News',
      analytics: 'Analytics',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      submit: 'Submit',
      grade: 'Grade',
      student: 'Student',
      teacher: 'Teacher',
      parent: 'Parent',
      admin: 'Admin',
      director: 'Director',
      librarian: 'Librarian',
      grade_label: 'Grade',
      section: 'Section',
      subject: 'Subject',
      stream: 'Stream',
      natural_science: 'Natural Science',
      social_science: 'Social Science',
      active: 'Active',
      pending: 'Pending',
      inactive: 'Inactive',
      completed: 'Completed',
      submitted: 'Submitted',
      graded: 'Graded',
      due_date: 'Due Date',
      points: 'Points',
      score: 'Score',
      percentage: 'Percentage',
      status: 'Status',
      actions: 'Actions',
      create: 'Create',
      update: 'Update',
      remove: 'Remove',
      confirm_delete: 'Are you sure you want to delete?',
      no_data: 'No data available',
      loading: 'Loading...',
      success: 'Success!',
      error: 'Error!',
      warning: 'Warning!',
      info: 'Information',
      select_language: 'Select Language',
      english: 'English',
      amharic: 'Amharic',
      oromo: 'Afaan Oromoo',
      tigrinya: 'Tigrinya',
      arabic: 'Arabic',
      french: 'French',
      language_changed: 'Language changed successfully',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      notifications: 'Notifications',
      mark_all_read: 'Mark all as read',
      clear_all: 'Clear all',
      no_notifications: 'No notifications',
      new_notification: 'New notification',
      notification_settings: 'Notification settings',
      email_notifications: 'Email notifications',
      push_notifications: 'Push notifications',
      sms_notifications: 'SMS notifications',
      sound_notifications: 'Sound notifications'
    }
  },
  am: {
    translation: {
      welcome: 'እንኳን ደህና መጡ',
      login: 'ግባ',
      register: 'ተመዝገብ',
      dashboard: 'ዳሽቦርድ',
      assignments: 'ስራዎች',
      quizzes: 'ፈተናዎች',
      library: 'ቤተ-መጻሕፍት',
      messages: 'መልዕክቶች',
      news: 'ዜና',
      analytics: 'ትንተና',
      settings: 'ቅንብሮች',
      profile: 'መገለጫ',
      logout: 'ውጣ',
      search: 'ፈልግ',
      filter: 'አጣራ',
      clear: 'አጽዳ',
      save: 'አስቀምጥ',
      cancel: 'ሰርዝ',
      delete: 'ሰርዝ',
      edit: 'አርትዕ',
      view: 'ተመልከት',
      download: 'አውርድ',
      upload: 'ጫን',
      submit: 'ላክ',
      grade: 'አድል',
      student: 'ተማሪ',
      teacher: '��ምህር',
      parent: 'ወላጅ',
      admin: 'አስተዳዳሪ',
      director: 'ዳይሬክተር',
      librarian: 'ቤተ-መጻሕፍት ባለሙያ',
      grade_label: 'ደረጃ',
      section: 'ክፍል',
      subject: 'መደብ',
      stream: 'ዘርፍ',
      natural_science: 'ተፈጥሯዊ ሳይንስ',
      social_science: 'ማህበራዊ ሳይንስ',
      active: 'ንቁ',
      pending: 'በጥበቃ',
      inactive: 'ንቁ ያልሆነ',
      completed: 'የተጠናቀቀ',
      submitted: 'የቀረበ',
      graded: 'የተደረገበት',
      due_date: 'የመስጠት ቀን',
      points: 'ነጥቦች',
      score: 'ውጤት',
      percentage: 'መቶኛ',
      status: 'ሁኔታ',
      actions: 'ድርጊቶች',
      create: 'ፍጠር',
      update: 'አዘምን',
      remove: 'አስወግድ',
      confirm_delete: 'እርግጠኛ ነህ ማስወገድ ትፈልጋለህ?',
      no_data: 'ውሂብ የለም',
      loading: 'በማቅረብ ላይ...',
      success: 'ተሳክቷል!',
      error: 'ስህተት!',
      warning: 'ማስጠንቀቂያ!',
      info: 'መረጃ',
      select_language: 'ቋንቋ ምረጥ',
      english: 'እንግሊዝኛ',
      amharic: 'አማርኛ',
      oromo: 'ኦሮምኛ',
      tigrinya: 'ትግርኛ',
      arabic: 'ዓረብኛ',
      french: 'ፈረንሳይኛ',
      language_changed: 'ቋንቋ በተሳካ ሁኔታ ተቀይሯል',
      theme: 'ገጽታ',
      light: 'ብርሀን',
      dark: 'ጨለማ',
      system: 'ስርዓት',
      notifications: 'ማስታወቂያዎች',
      mark_all_read: 'ሁሉንም እንደተነበበ ምልክት አድርግ',
      clear_all: 'ሁሉንም አጽዳ',
      no_notifications: 'ምንም ማስታወቂያ የለም',
      new_notification: 'አዲስ ማስታወቂያ',
      notification_settings: 'የማስታወቂያ ቅንብሮች',
      email_notifications: 'ኢሜይል ማስታወቂያዎች',
      push_notifications: 'ፑሽ ማስታወቂያዎች',
      sms_notifications: 'ኤስኤምኤስ ማስታወቂያዎች',
      sound_notifications: 'ድምፅ ማስታወቂያዎች'
    }
  },
  om: {
    translation: {
      welcome: 'Baga nagaan dhuftan',
      login: 'Seeni',
      register: 'Galmee godhaa',
      dashboard: 'Daashboordii',
      assignments: 'Hojiiwwan',
      quizzes: 'Qorannoo',
      library: 'Maktabaa',
      messages: 'Ergaawwan',
      news: 'Oduu',
      analytics: 'Qorannoo',
      settings: 'Daawoomilee',
      profile: 'Faayidaa',
      logout: 'Ba\'i',
      search: 'Barbaadi',
      filter: 'Filter godhi',
      clear: 'Haquuri',
      save: 'Kuusaa',
      cancel: 'Dhiisi',
      delete: 'Haquuri',
      edit: 'Gulaali',
      view: 'Ilaali',
      download: 'Buusii',
      upload: 'Fuudhii',
      submit: 'Ergi',
      grade: 'Sadarkaa',
      student: 'Barataa',
      teacher: 'Barsiisaa',
      parent: 'Maatiin',
      admin: 'Administrator',
      director: 'Direktora',
      librarian: 'Maktabaatti hojjataa',
      grade_label: 'Sadarkaa',
      section: 'Qajeelaa',
      subject: 'Ogummaa',
      stream: 'Karaa',
      natural_science: 'Saayinsii uumamaa',
      social_science: 'Saayinsii hawaasaa',
      active: 'Hojii irra jira',
      pending: 'Eegaa',
      inactive: 'Hojii hin qabne',
      completed: 'Xumuraa',
      submitted: 'Ergamee',
      graded: 'Sadarkaawame',
      due_date: 'Guyyaa dhiyaataa',
      points: 'Pooyintii',
      score: 'Kuusaa',
      percentage: 'Dachaa',
      status: 'Haala',
      actions: 'Hojiiwwan',
      create: 'Uumi',
      update: 'Haala jiruu',
      remove: 'Haquuri',
      confirm_delete: 'Mirkaneessuutti dandeettii qabdaa?',
      no_data: 'Daataa hin jiru',
      loading: 'Kuusaa...',
      success: 'Milkaa\'ina!',
      error: 'Dogoggora!',
      warning: 'Dhimma!',
      info: 'Oduu',
      select_language: 'Afaan filadhu',
      english: 'Ingiliffaa',
      amharic: 'Amhariffaa',
      oromo: 'Oromoo',
      tigrinya: 'Tigrinyaa',
      arabic: 'Arabiffaa',
      french: 'Faransaayii',
      language_changed: 'Afaan milkaa\'inaan jijjiirame',
      theme: 'Mataa',
      light: 'Ifaa',
      dark: 'Dukkana',
      system: 'Sisteemii',
      notifications: 'Beeksisaa',
      mark_all_read: 'Hunda akka dubbifame taasisi',
      clear_all: 'Hunda haquuri',
      no_notifications: 'Beeksisaa hin jiru',
      new_notification: 'Beeksisaa haarawaa',
      notification_settings: 'Daawwii beeksisaa',
      email_notifications: 'Beeksisaa imeelii',
      push_notifications: 'Beeksisaa puushii',
      sms_notifications: 'Beeksisaa SMS',
      sound_notifications: 'Beeksisaa sagalee'
    }
  },
  ti: {
    translation: {
      welcome: 'እንቋዕ ብደሓን መጻእኩም',
      login: 'እቶ',
      register: 'ተመዝገብ',
      dashboard: 'ዳሽቦርድ',
      assignments: 'ስራሕ',
      quizzes: 'ፈተና',
      library: 'ቤተ-መጻሕፍቲ',
      messages: 'መልእኽቲ',
      news: 'ዜና',
      analytics: 'ትንተና',
      settings: 'ቅንብራት',
      profile: 'መገለጺ',
      logout: 'ውጻእ',
      search: 'ድለይ',
      filter: 'ፈልጥ',
      clear: 'ኣጽርይ',
      save: 'ዕቅብ',
      cancel: 'ሰርዝ',
      delete: 'ሰርዝ',
      edit: 'ኣርትዕ',
      view: 'ርእይ',
      download: 'ኣውርድ',
      upload: 'ኣልዕል',
      submit: 'ስደድ',
      grade: 'ዲግሪ',
      student: 'ተማሃራይ',
      teacher: 'መምህር',
      parent: 'ወላዲ',
      admin: 'ኣስተዳደር',
      director: 'ዳይሬክተር',
      librarian: 'ቤተ-መጻሕፍቲ ሰራሕተኛ',
      grade_label: 'ደረጃ',
      section: 'ክፍሊ',
      subject: 'መደብ',
      stream: 'ወሰኽ',
      natural_science: 'ተፈጥሮኣዊ ሳይንስ',
      social_science: 'ማሕበራዊ ሳይንስ',
      active: 'ንቁ',
      pending: 'እተጠቕሰ',
      inactive: 'ንቁ ዘይኮነ',
      completed: 'ዝተወድአ',
      submitted: 'ዝቐረበ',
      graded: 'ዝተዲግሮ',
      due_date: 'ዕለተ ምድራኽ',
      points: 'ነጥቢ',
      score: 'ውጽኢት',
      percentage: 'መቶኛ',
      status: 'ሁኔታ',
      actions: 'ተግባራት',
      create: 'ፍጠር',
      update: 'ኣሕዲር',
      remove: 'ኣልግስ',
      confirm_delete: 'ርግጸኛ ዲኻ ክትሰርዮ ትደሊ?',
      no_data: 'ዳታ የለን',
      loading: 'በምጽዋዕ...',
      success: 'ተሳኪኑ!',
      error: 'ጌጋ!',
      warning: 'መጠንቀቕታ!',
      info: 'ሓበሬታ',
      select_language: 'ቋንቋ ምረጽ',
      english: 'እንግሊዝኛ',
      amharic: 'ኣማርኛ',
      oromo: 'ኦሮምኛ',
      tigrinya: 'ትግርኛ',
      arabic: 'ዓረብኛ',
      french: 'ፈረንሳይኛ',
      language_changed: 'ቋንቋ ብኽብረት ተቐይሩ',
      theme: 'ገጽ',
      light: 'ብርሃን',
      dark: 'ጸልማት',
      system: 'ስርዓት',
      notifications: 'ምልክታት',
      mark_all_read: 'ኩሎም ከም ዝንበቡ ምልክት ግበር',
      clear_all: 'ኩሎም ኣጽርይ',
      no_notifications: 'ምንም ምልክታት የለን',
      new_notification: 'ሓድሽ ምልክት',
      notification_settings: 'ምልክታት ምርጫታት',
      email_notifications: 'ኢመይል ምልክታት',
      push_notifications: 'ፑሽ ምልክታት',
      sms_notifications: 'ኤስኤምኤስ ምልክታት',
      sound_notifications: 'ድምጺ ምልክታት'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );
  const [direction, setDirection] = useState(
    currentLanguage === 'ar' ? 'rtl' : 'ltr'
  );

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = direction;
  }, [currentLanguage, direction]);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    
    const newDirection = lang === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    
    toast.success(i18n.t('language_changed'));
  };

  const getAvailableLanguages = () => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo' },
    { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fr', name: 'French', nativeName: 'Français' }
  ];

  const t = i18n.t;

  const value = {
    currentLanguage,
    direction,
    changeLanguage,
    getAvailableLanguages,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;