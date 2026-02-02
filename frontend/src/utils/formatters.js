export const formatDate = (date, format = 'standard', language = 'en') => {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) return '';
    
    const formats = {
      standard: () => {
        return d.toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
      full: () => {
        return d.toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      },
      short: () => {
        return d.toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET', {
          month: 'short',
          day: 'numeric'
        });
      },
      time: () => {
        return d.toLocaleTimeString(language === 'en' ? 'en-US' : 'am-ET', {
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      datetime: () => {
        return `${formatDate(date, 'standard', language)} ${formatDate(date, 'time', language)}`;
      },
      ethiopian: () => {
        const ethDate = convertToEthiopianDate(d);
        return `${ethDate.day}/${ethDate.month}/${ethDate.year}`;
      },
      relative: () => {
        const now = new Date();
        const diffMs = now - d;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 30) {
          return formatDate(date, 'standard', language);
        } else if (diffDay > 0) {
          return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else if (diffHour > 0) {
          return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffMin > 0) {
          return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else {
          return 'Just now';
        }
      }
    };
    
    return formats[format] ? formats[format]() : formats.standard();
  };
  
  export const convertToEthiopianDate = (gregorianDate) => {
    const date = new Date(gregorianDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const ethiopianYear = year - 8;
    let ethiopianMonth, ethiopianDay;
    
    if (month >= 9) {
      ethiopianMonth = month - 8;
      ethiopianDay = day;
    } else {
      ethiopianMonth = month + 4;
      ethiopianDay = day;
    }
    
    if (month === 9 && day >= 11) {
      ethiopianYear++;
    }
    
    return {
      year: ethiopianYear,
      month: ethiopianMonth,
      day: ethiopianDay,
      formatted: `${ethiopianDay}/${ethiopianMonth}/${ethiopianYear}`
    };
  };
  
  export const formatCurrency = (amount, currency = 'ETB', language = 'en') => {
    if (amount === null || amount === undefined) return '';
    
    const formatter = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'am-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };
  
  export const formatNumber = (number, decimals = 0) => {
    if (number === null || number === undefined) return '';
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  };
  
  export const formatPercentage = (value, decimals = 2) => {
    if (value === null || value === undefined) return '';
    
    return `${value.toFixed(decimals)}%`;
  };
  
  export const formatGrade = (score, total) => {
    if (score === null || score === undefined || total === null || total === undefined) return 'N/A';
    
    const percentage = (score / total) * 100;
    let grade = 'F';
    let gpa = 0.0;
    
    if (percentage >= 90) {
      grade = 'A+';
      gpa = 4.0;
    } else if (percentage >= 85) {
      grade = 'A';
      gpa = 4.0;
    } else if (percentage >= 80) {
      grade = 'A-';
      gpa = 3.7;
    } else if (percentage >= 75) {
      grade = 'B+';
      gpa = 3.3;
    } else if (percentage >= 70) {
      grade = 'B';
      gpa = 3.0;
    } else if (percentage >= 65) {
      grade = 'B-';
      gpa = 2.7;
    } else if (percentage >= 60) {
      grade = 'C+';
      gpa = 2.3;
    } else if (percentage >= 55) {
      grade = 'C';
      gpa = 2.0;
    } else if (percentage >= 50) {
      grade = 'C-';
      gpa = 1.7;
    } else if (percentage >= 45) {
      grade = 'D';
      gpa = 1.0;
    }
    
    return {
      percentage: percentage.toFixed(2),
      grade,
      gpa: gpa.toFixed(2),
      formatted: `${grade} (${percentage.toFixed(2)}%)`
    };
  };
  
  export const formatDuration = (seconds, format = 'short') => {
    if (seconds === null || seconds === undefined) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const formats = {
      short: () => {
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
          return `${minutes}m ${secs}s`;
        } else {
          return `${secs}s`;
        }
      },
      long: () => {
        const parts = [];
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs} second${secs > 1 ? 's' : ''}`);
        return parts.join(' ');
      },
      compact: () => {
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
          return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
      }
    };
    
    return formats[format] ? formats[format]() : formats.short();
  };
  
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  export const formatPhoneNumber = (phoneNumber, countryCode = 'ET') => {
    if (!phoneNumber) return '';
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (countryCode === 'ET') {
      if (cleaned.length === 9) {
        return `+251 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
      } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return `+251 ${cleaned.substring(1, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
      } else if (cleaned.length === 12 && cleaned.startsWith('251')) {
        return `+251 ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
      }
    }
    
    return phoneNumber;
  };
  
  export const formatName = (name, format = 'full') => {
    if (!name) return '';
    
    const parts = name.trim().split(/\s+/);
    
    const formats = {
      full: () => name,
      initials: () => {
        return parts.map(part => part[0]).join('').toUpperCase();
      },
      firstLast: () => {
        if (parts.length === 1) return parts[0];
        return `${parts[0]} ${parts[parts.length - 1]}`;
      },
      firstInitial: () => {
        if (parts.length === 1) return parts[0];
        return `${parts[0]} ${parts[parts.length - 1][0]}.`;
      },
      titleCase: () => {
        return parts.map(part => 
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join(' ');
      }
    };
    
    return formats[format] ? formats[format]() : formats.full();
  };
  
  export const formatRole = (role, language = 'en') => {
    const translations = {
      en: {
        super_admin: 'Super Admin',
        director: 'Director',
        admin: 'Administrator',
        teacher: 'Teacher',
        student: 'Student',
        parent: 'Parent',
        librarian: 'Librarian',
        other: 'Other'
      },
      am: {
        super_admin: 'ሱፐር አስተዳዳሪ',
        director: 'ዳይሬክተር',
        admin: 'አስተዳዳሪ',
        teacher: '��ምህር',
        student: 'ተማሪ',
        parent: 'ወላጅ',
        librarian: 'ቤተ መጽሐፍት አስተዳዳሪ',
        other: 'ሌላ'
      },
      om: {
        super_admin: 'Admin Guddicha',
        director: 'Darektara',
        admin: 'Administrator',
        teacher: 'Barreessaa',
        student: 'Barataa',
        parent: 'Haadha',
        librarian: 'Administrator Kitaaba',
        other: 'Kan Biroo'
      },
      ti: {
        super_admin: 'ላዕለዋይ ኣስተዳደሪ',
        director: 'ዳይረክተር',
        admin: 'ኣስተዳደሪ',
        teacher: 'መምህር',
        student: 'ተማሃራይ',
        parent: 'ወለዲ',
        librarian: 'ኣስተዳደሪ ቤተ መጻሕፍቲ',
        other: 'ካልእ'
      }
    };
    
    return translations[language]?.[role] || role;
  };
  
  export const formatStream = (stream, language = 'en') => {
    const translations = {
      en: {
        'Natural Science': 'Natural Science',
        'Social Science': 'Social Science'
      },
      am: {
        'Natural Science': 'ተፈጥሯዊ ሳይንስ',
        'Social Science': 'ማህበራዊ ሳይንስ'
      },
      om: {
        'Natural Science': 'Saayinsii Uumamaa',
        'Social Science': 'Saayinsii Hawaasaa'
      },
      ti: {
        'Natural Science': 'ስነ-ፍልጠት ተፈጥሮ',
        'Social Science': 'ስነ-ፍልጠት ሕብረተሰብ'
      }
    };
    
    return translations[language]?.[stream] || stream;
  };
  
  export const formatSubject = (subject, language = 'en') => {
    const translations = {
      en: {},
      am: {
        'Mathematics': 'ሂሳብ',
        'English': 'እንግሊዝኛ',
        'Amharic': 'አማርኛ',
        'Physics': 'ፊዚክስ',
        'Chemistry': 'ኬሚስትሪ',
        'Biology': 'ባዮሎጂ',
        'Geography': 'ጂኦግራፊ',
        'History': 'ታሪክ',
        'Civics': 'ዜጋዊ ትምህርት',
        'ICT': 'መረጃ ቴክኖሎጂ',
        'Physical Education': 'አካላዊ ትምህርት',
        'Music': 'ሙዚቃ',
        'Art': 'ኪነ-ጥበብ',
        'Technical Drawing': 'ቴክኒካል ስዕል',
        'Applied Mathematics': 'ተግባራዊ ሂሳብ',
        'Economics': 'ኢኮኖሚክስ',
        'Business Studies': 'የቢዝነስ ጥናት',
        'Islamic Education': 'እስላማዊ ትምህርት'
      },
      om: {
        'Mathematics': 'Herrega',
        'English': 'Ingiliffa',
        'Amharic': 'Afaan Amaaraa',
        'Physics': 'Fiiziksii',
        'Chemistry': 'Kemistrii',
        'Biology': 'Baayoolojii',
        'Geography': 'Jiyoograafii',
        'History': 'Seenaa',
        'Civics': 'Barumsa Ilmaanamaa',
        'ICT': 'Teknooloojii Odeeffannoo',
        'Physical Education': 'Barsiisa Qaama Lafa',
        'Music': 'Muuziqaa',
        'Art': 'Aartii',
        'Technical Drawing': 'Fakkii Teeknikalaa',
        'Applied Mathematics': 'Herrega Hojiirra Oolmaa',
        'Economics': 'Ikoonomiksii',
        'Business Studies': 'Qorannoo Daldalaa',
        'Islamic Education': 'Barsiisa Islaamaa'
      },
      ti: {
        'Mathematics': 'መስመርሒ',
        'English': 'እንግሊዝኛ',
        'Amharic': 'ኣማርኛ',
        'Physics': 'ፊዚክስ',
        'Chemistry': 'ኬሚስትሪ',
        'Biology': 'ባዮሎጂ',
        'Geography': 'ጂኦግራፊ',
        'History': 'ታሪኽ',
        'Civics': 'ትምህርቲ ዜጋ',
        'ICT': 'ተክኖሎጂ ሓበሬታ',
        'Physical Education': 'ትምህርቲ ኣካላት',
        'Music': 'ሙዚቃ',
        'Art': 'ጥበብ',
        'Technical Drawing': 'ስእሊ ተክኒክ',
        'Applied Mathematics': 'መስመርሒ ተግባራዊ',
        'Economics': 'ኢኮኖሚ',
        'Business Studies': 'መጽናዕቲ ዕዮ',
        'Islamic Education': 'ትምህርቲ እስላም'
      }
    };
    
    return translations[language]?.[subject] || subject;
  };
  
  export const formatStatus = (status, language = 'en') => {
    const translations = {
      en: {
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        draft: 'Draft',
        published: 'Published',
        closed: 'Closed',
        submitted: 'Submitted',
        graded: 'Graded',
        late: 'Late',
        not_submitted: 'Not Submitted',
        returned: 'Returned'
      },
      am: {
        active: 'ንቁ',
        inactive: 'ንቁ ያልሆነ',
        pending: 'በጥበቃ ላይ',
        approved: 'ተፅዕኖ ያለው',
        rejected: 'ውድቅ የተደረገ',
        draft: 'ደረሰኝ',
        published: 'የተለጠፈ',
        closed: 'ዝጋ',
        submitted: 'ቀርቧል',
        graded: 'ደረጃ ተሰጥቷል',
        late: 'ዘግይቷል',
        not_submitted: 'አልቀረበም',
        returned: 'ተመልሷል'
      },
      om: {
        active: 'Hojii keessa jira',
        inactive: 'Hojii keessa hin jiru',
        pending: 'Eegaa jira',
        approved: 'Mirkaneeffama',
        rejected: 'Dhiifame',
        draft: 'Qormaata',
        published: 'Maxxanfame',
        closed: 'Cufame',
        submitted: 'Kenne',
        graded: 'Sadarkaan kenname',
        late: 'Duubatti dhufe',
        not_submitted: 'Hin kenne',
        returned: 'Deebi\'e'
      },
      ti: {
        active: 'ንጡፍ',
        inactive: 'ዘይንጡፍ',
        pending: 'ተጠባብቂ',
        approved: 'ተፅዕኖ ዝበለ',
        rejected: 'ዝተነጽገ',
        draft: 'ደረሰኝ',
        published: 'ዝተለጠፈ',
        closed: 'ዝተዓጽወ',
        submitted: 'ዝቐረበ',
        graded: 'ደረጃ ዝተዋህበ',
        late: 'ዘግይቱ',
        not_submitted: 'ዘይተቐርበ',
        returned: 'ዝተመለሰ'
      }
    };
    
    return translations[language]?.[status] || status;
  };
  
  export const formatCategory = (category, language = 'en') => {
    const translations = {
      en: {
        academic: 'Academic',
        fiction: 'Fiction',
        reference: 'Reference',
        teacher_resource: 'Teacher Resource',
        student_resource: 'Student Resource',
        parent_guide: 'Parent Guide',
        research: 'Research',
        magazine: 'Magazine',
        newspaper: 'Newspaper'
      },
      am: {
        academic: 'አካዳሚክ',
        fiction: 'ልቦለድ',
        reference: 'ማጣቀሻ',
        teacher_resource: 'የመምህር ሀብት',
        student_resource: 'የተማሪ ሀብት',
        parent_guide: 'የወላጅ መመሪያ',
        research: 'ምርምር',
        magazine: 'ማግዚን',
        newspaper: 'ጋዜጣ'
      },
      om: {
        academic: 'Akadeemikii',
        fiction: 'Seenaa Uumamaa',
        reference: 'Faayidaa',
        teacher_resource: 'Qabeenya Barreessaa',
        student_resource: 'Qabeenya Barataa',
        parent_guide: 'Qajeelfama Haadha',
        research: 'Qorannoo',
        magazine: 'Maagaziinii',
        newspaper: 'Gaazexaa'
      },
      ti: {
        academic: 'ኣካዳሚክ',
        fiction: 'ውልቀ-ሰብ',
        reference: 'ምንጪ',
        teacher_resource: 'ሃብቲ መምህር',
        student_resource: 'ሃብቲ ተማሃራይ',
        parent_guide: 'መምሪዕ ወለዲ',
        research: 'ምርምር',
        magazine: 'ማጋዚን',
        newspaper: 'ጋዜጣ'
      }
    };
    
    return translations[language]?.[category] || category;
  };
  
  export const formatVisibility = (visibility, language = 'en') => {
    const translations = {
      en: {
        public: 'Public',
        school: 'School',
        grade: 'Grade',
        section: 'Section'
      },
      am: {
        public: 'የህዝብ',
        school: 'ትምህርት ቤት',
        grade: 'ደረጃ',
        section: 'ክፍል'
      },
      om: {
        public: 'Ummataa',
        school: 'Mana Barumsaa',
        grade: 'Sadarkaa',
        section: 'Qoodaa'
      },
      ti: {
        public: 'ህዝቢ',
        school: 'ቤት ትምህርቲ',
        grade: 'ደረጃ',
        section: 'ክፍሊ'
      }
    };
    
    return translations[language]?.[visibility] || visibility;
  };
  
  export const formatBoolean = (value, language = 'en') => {
    const translations = {
      en: { true: 'Yes', false: 'No' },
      am: { true: 'አዎ', false: 'አይ' },
      om: { true: 'Eeyyee', false: 'Lakki' },
      ti: { true: 'ወይ', false: 'ኣይፋል' }
    };
    
    return translations[language]?.[value] || (value ? 'Yes' : 'No');
  };
  
  export const formatList = (items, conjunction = 'and', language = 'en') => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    
    const conjunctions = {
      en: { and: 'and', or: 'or' },
      am: { and: 'እና', or: 'ወይም' },
      om: { and: 'fi', or: 'yookiin' },
      ti: { and: 'ከ', or: 'ወይ' }
    };
    
    const conj = conjunctions[language]?.[conjunction] || conjunction;
    
    if (items.length === 2) {
      return `${items[0]} ${conj} ${items[1]}`;
    }
    
    const last = items.pop();
    return `${items.join(', ')} ${conj} ${last}`;
  };
  
  export const formatOrdinal = (number, language = 'en') => {
    if (language === 'en') {
      const j = number % 10;
      const k = number % 100;
      if (j === 1 && k !== 11) return number + 'st';
      if (j === 2 && k !== 12) return number + 'nd';
      if (j === 3 && k !== 13) return number + 'rd';
      return number + 'th';
    }
    
    return number.toString();
  };
  
  export const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m remaining`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m remaining`;
    } else {
      return 'Less than a minute';
    }
  };
  
  export const formatProgress = (current, total) => {
    if (total === 0) return '0%';
    const percentage = Math.round((current / total) * 100);
    return `${percentage}% (${current}/${total})`;
  };
  
  export const formatGPA = (gpa) => {
    if (gpa === null || gpa === undefined) return 'N/A';
    return gpa.toFixed(2);
  };
  
  export const formatScore = (score, total) => {
    if (score === null || score === undefined || total === null || total === undefined) {
      return 'N/A';
    }
    return `${score}/${total}`;
  };
  
  export const formatReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };
  
  export const truncateWithEllipsis = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  export const camelCaseToTitle = (camelCase) => {
    return camelCase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };
  
  export const snakeCaseToTitle = (snakeCase) => {
    return snakeCase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };