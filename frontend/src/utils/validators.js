export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!re.test(email)) return 'Please enter a valid email address';
    return '';
  };
  
  export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };
  
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };
  
  export const validateFAVID = (favId) => {
    if (!favId) return 'FAV/ID number is required';
    if (favId.length < 5) return 'FAV/ID number must be at least 5 characters long';
    if (!/^[A-Za-z0-9\-_]+$/.test(favId)) return 'FAV/ID number can only contain letters, numbers, hyphens, and underscores';
    return '';
  };
  
  export const validateName = (name, fieldName = 'Name') => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
    if (!/^[A-Za-z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
    return '';
  };
  
  export const validatePhone = (phone) => {
    if (!phone) return '';
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    if (!re.test(phone)) return 'Please enter a valid phone number';
    return '';
  };
  
  export const validateRequired = (value, fieldName) => {
    if (!value && value !== 0) return `${fieldName} is required`;
    return '';
  };
  
  export const validateNumber = (value, fieldName, min = null, max = null) => {
    if (value === '' || value === null || value === undefined) return `${fieldName} is required`;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (min !== null && num < min) return `${fieldName} must be at least ${min}`;
    if (max !== null && num > max) return `${fieldName} must not exceed ${max}`;
    return '';
  };
  
  export const validateDate = (date, fieldName) => {
    if (!date) return `${fieldName} is required`;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return `Invalid ${fieldName.toLowerCase()}`;
    if (parsedDate > new Date()) return `${fieldName} cannot be in the future`;
    return '';
  };
  
  export const validateFutureDate = (date, fieldName) => {
    if (!date) return `${fieldName} is required`;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return `Invalid ${fieldName.toLowerCase()}`;
    if (parsedDate <= new Date()) return `${fieldName} must be in the future`;
    return '';
  };
  
  export const validateGrade = (grade) => {
    if (!grade) return 'Grade is required';
    const validGrades = [9, 10, 11, 12];
    if (!validGrades.includes(Number(grade))) return 'Grade must be between 9 and 12';
    return '';
  };
  
  export const validateSection = (section) => {
    if (!section) return 'Section is required';
    const validSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (!validSections.includes(section.toUpperCase())) {
      return 'Section must be a letter from A to G';
    }
    return '';
  };
  
  export const validateStream = (grade, stream) => {
    if (grade === 11 || grade === 12) {
      if (!stream) return 'Stream is required for grades 11 and 12';
      const validStreams = ['Natural Science', 'Social Science'];
      if (!validStreams.includes(stream)) return 'Stream must be Natural Science or Social Science';
    }
    return '';
  };
  
  export const validateSubject = (subject, grade, stream = null) => {
    if (!subject) return 'Subject is required';
    
    const subjects = {
      9: ['Mathematics', 'English', 'Amharic', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Civics', 'ICT', 'Physical Education', 'Music', 'Art'],
      10: ['Mathematics', 'English', 'Amharic', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Civics', 'ICT', 'Physical Education', 'Music', 'Art'],
      11: {
        'Natural Science': ['Mathematics', 'English', 'Amharic', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Physical Education', 'Technical Drawing', 'Applied Mathematics'],
        'Social Science': ['Mathematics', 'English', 'Amharic', 'Geography', 'History', 'Economics', 'Business Studies', 'ICT', 'Physical Education', 'Civics']
      },
      12: {
        'Natural Science': ['Mathematics', 'English', 'Amharic', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Physical Education'],
        'Social Science': ['Mathematics', 'English', 'Amharic', 'Geography', 'History', 'Economics', 'Business Studies', 'ICT', 'Physical Education']
      }
    };
  
    let validSubjects = [];
    if (grade <= 10) {
      validSubjects = subjects[grade];
    } else {
      validSubjects = subjects[grade][stream];
    }
  
    if (!validSubjects.includes(subject)) {
      return 'Invalid subject for selected grade and stream';
    }
    return '';
  };
  
  export const validateAssignmentTitle = (title) => {
    if (!title) return 'Assignment title is required';
    if (title.length < 3) return 'Title must be at least 3 characters long';
    if (title.length > 200) return 'Title must not exceed 200 characters';
    return '';
  };
  
  export const validateAssignmentDescription = (description) => {
    if (!description) return 'Description is required';
    if (description.length < 10) return 'Description must be at least 10 characters long';
    if (description.length > 5000) return 'Description must not exceed 5000 characters';
    return '';
  };
  
  export const validatePoints = (points) => {
    if (!points && points !== 0) return 'Points are required';
    const num = Number(points);
    if (isNaN(num)) return 'Points must be a number';
    if (num < 0) return 'Points must be positive';
    if (num > 1000) return 'Points must not exceed 1000';
    return '';
  };
  
  export const validateFile = (file, allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
    if (!file) return 'File is required';
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    
    return '';
  };
  
  export const validatePDF = (file) => {
    return validateFile(file, ['application/pdf'], 10 * 1024 * 1024);
  };
  
  export const validateImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validateFile(file, allowedTypes, 5 * 1024 * 1024);
  };
  
  export const validateQuizTitle = (title) => {
    if (!title) return 'Quiz title is required';
    if (title.length < 3) return 'Title must be at least 3 characters long';
    if (title.length > 100) return 'Title must not exceed 100 characters';
    return '';
  };
  
  export const validateTimeLimit = (minutes) => {
    if (!minutes && minutes !== 0) return 'Time limit is required';
    const num = Number(minutes);
    if (isNaN(num)) return 'Time limit must be a number';
    if (num < 1) return 'Time limit must be at least 1 minute';
    if (num > 180) return 'Time limit must not exceed 3 hours';
    return '';
  };
  
  export const validateQuestionText = (text) => {
    if (!text) return 'Question text is required';
    if (text.length < 5) return 'Question must be at least 5 characters long';
    if (text.length > 1000) return 'Question must not exceed 1000 characters';
    return '';
  };
  
  export const validateOptions = (options, minOptions = 2) => {
    if (!options || !Array.isArray(options)) return 'Options are required';
    if (options.length < minOptions) return `At least ${minOptions} options are required`;
    
    const validOptions = options.filter(opt => opt && opt.trim().length > 0);
    if (validOptions.length !== options.length) {
      return 'All options must have text';
    }
    
    const uniqueOptions = new Set(options.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== options.length) {
      return 'Options must be unique';
    }
    
    return '';
  };
  
  export const validateCorrectAnswer = (correctAnswer, options = []) => {
    if (!correctAnswer && correctAnswer !== 0) return 'Correct answer is required';
    if (options.length > 0 && !options.includes(correctAnswer)) {
      return 'Correct answer must be one of the options';
    }
    return '';
  };
  
  export const validateBookTitle = (title) => {
    if (!title) return 'Book title is required';
    if (title.length < 2) return 'Title must be at least 2 characters long';
    if (title.length > 200) return 'Title must not exceed 200 characters';
    return '';
  };
  
  export const validateAuthor = (author) => {
    if (!author) return 'Author is required';
    if (author.length < 2) return 'Author name must be at least 2 characters long';
    if (author.length > 100) return 'Author name must not exceed 100 characters';
    return '';
  };
  
  export const validateISBN = (isbn) => {
    if (!isbn) return '';
    
    // Remove hyphens and spaces
    const cleaned = isbn.replace(/[-\s]/g, '');
    
    if (cleaned.length === 10) {
      // Validate ISBN-10
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += (10 - i) * parseInt(cleaned[i], 10);
      }
      const checkDigit = cleaned[9];
      if (checkDigit === 'X') {
        sum += 10;
      } else {
        sum += parseInt(checkDigit, 10);
      }
      if (sum % 11 !== 0) return 'Invalid ISBN-10';
    } else if (cleaned.length === 13) {
      // Validate ISBN-13
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += (i % 2 === 0 ? 1 : 3) * parseInt(cleaned[i], 10);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      if (checkDigit !== parseInt(cleaned[12], 10)) return 'Invalid ISBN-13';
    } else {
      return 'ISBN must be 10 or 13 digits';
    }
    
    return '';
  };
  
  export const validateNewsTitle = (title) => {
    if (!title) return 'News title is required';
    if (title.length < 5) return 'Title must be at least 5 characters long';
    if (title.length > 200) return 'Title must not exceed 200 characters';
    return '';
  };
  
  export const validateNewsContent = (content) => {
    if (!content) return 'News content is required';
    if (content.length < 20) return 'Content must be at least 20 characters long';
    if (content.length > 10000) return 'Content must not exceed 10000 characters';
    return '';
  };
  
  export const validateMessage = (message) => {
    if (!message) return 'Message is required';
    if (message.length < 1) return 'Message cannot be empty';
    if (message.length > 5000) return 'Message must not exceed 5000 characters';
    return '';
  };
  
  export const validateStudentInfo = (studentInfo) => {
    const errors = {};
    
    if (!studentInfo.fullName) errors.fullName = 'Full name is required';
    else if (studentInfo.fullName.length < 3) errors.fullName = 'Full name must be at least 3 characters';
    
    if (!studentInfo.favId) errors.favId = 'FAV/ID is required';
    else if (studentInfo.favId.length < 5) errors.favId = 'FAV/ID must be at least 5 characters';
    
    if (!studentInfo.grade) errors.grade = 'Grade is required';
    else if (![9, 10, 11, 12].includes(Number(studentInfo.grade))) {
      errors.grade = 'Invalid grade level';
    }
    
    if (!studentInfo.section) errors.section = 'Section is required';
    else if (!['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(studentInfo.section.toUpperCase())) {
      errors.section = 'Invalid section';
    }
    
    if (studentInfo.grade >= 11 && !studentInfo.stream) {
      errors.stream = 'Stream is required for grades 11 and 12';
    }
    
    return errors;
  };
  
  export const validateTeacherInfo = (teacherInfo) => {
    const errors = {};
    
    if (!teacherInfo.fullName) errors.fullName = 'Full name is required';
    else if (teacherInfo.fullName.length < 3) errors.fullName = 'Full name must be at least 3 characters';
    
    if (!teacherInfo.qualification) errors.qualification = 'Qualification is required';
    
    if (!teacherInfo.subjects || teacherInfo.subjects.length === 0) {
      errors.subjects = 'At least one subject is required';
    }
    
    if (!teacherInfo.grades || teacherInfo.grades.length === 0) {
      errors.grades = 'At least one grade is required';
    }
    
    return errors;
  };
  
  export const validateParentInfo = (parentInfo) => {
    const errors = {};
    
    if (!parentInfo.fullName) errors.fullName = 'Full name is required';
    else if (parentInfo.fullName.length < 3) errors.fullName = 'Full name must be at least 3 characters';
    
    if (!parentInfo.relationship) errors.relationship = 'Relationship is required';
    
    return errors;
  };
  
  export const validateOTP = (otp) => {
    if (!otp) return 'OTP is required';
    if (!/^\d{6}$/.test(otp)) return 'OTP must be 6 digits';
    return '';
  };
  
  export const validateURL = (url) => {
    if (!url) return '';
    try {
      new URL(url);
      return '';
    } catch (_) {
      return 'Please enter a valid URL';
    }
  };
  
  export const validatePositiveInteger = (value, fieldName) => {
    if (!value && value !== 0) return `${fieldName} is required`;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (!Number.isInteger(num)) return `${fieldName} must be an integer`;
    if (num <= 0) return `${fieldName} must be positive`;
    return '';
  };
  
  export const validatePercentage = (value, fieldName) => {
    if (!value && value !== 0) return `${fieldName} is required`;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num < 0) return `${fieldName} cannot be negative`;
    if (num > 100) return `${fieldName} cannot exceed 100`;
    return '';
  };
  
  export const validateArrayNotEmpty = (array, fieldName) => {
    if (!array || !Array.isArray(array)) return `${fieldName} is required`;
    if (array.length === 0) return `${fieldName} must contain at least one item`;
    return '';
  };
  
  export const validateMinLength = (value, minLength, fieldName) => {
    if (!value) return `${fieldName} is required`;
    if (value.length < minLength) return `${fieldName} must be at least ${minLength} characters`;
    return '';
  };
  
  export const validateMaxLength = (value, maxLength, fieldName) => {
    if (!value) return '';
    if (value.length > maxLength) return `${fieldName} must not exceed ${maxLength} characters`;
    return '';
  };
  
  export const validateRange = (value, min, max, fieldName) => {
    if (!value && value !== 0) return `${fieldName} is required`;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num < min) return `${fieldName} must be at least ${min}`;
    if (num > max) return `${fieldName} must not exceed ${max}`;
    return '';
  };
  
  export const validateEthiopianPhone = (phone) => {
    if (!phone) return '';
    const re = /^(?:\+251|0)(9[0-9]{8})$/;
    if (!re.test(phone)) return 'Please enter a valid Ethiopian phone number';
    return '';
  };
  
  export const validateEthiopicName = (name, fieldName = 'Name') => {
    if (!name) return `${fieldName} is required`;
    const ethiopicRegex = /^[\u1200-\u137F\s]+$/;
    if (!ethiopicRegex.test(name)) return `${fieldName} must contain only Ethiopic characters`;
    return '';
  };
  
  export const validateLanguageCode = (code) => {
    if (!code) return 'Language code is required';
    const validCodes = ['en', 'am', 'om', 'ti'];
    if (!validCodes.includes(code)) return 'Invalid language code';
    return '';
  };
  
  export const validateRole = (role) => {
    if (!role) return 'Role is required';
    const validRoles = ['student', 'teacher', 'parent', 'admin', 'director', 'super_admin', 'librarian', 'other'];
    if (!validRoles.includes(role)) return 'Invalid role';
    return '';
  };
  
  export const validateVisibility = (visibility) => {
    if (!visibility) return 'Visibility is required';
    const validVisibilities = ['public', 'school', 'grade', 'section'];
    if (!validVisibilities.includes(visibility)) return 'Invalid visibility level';
    return '';
  };
  
  export const validateCategory = (category) => {
    if (!category) return 'Category is required';
    const validCategories = ['academic', 'fiction', 'reference', 'teacher_resource', 'student_resource', 'parent_guide', 'research', 'magazine', 'newspaper'];
    if (!validCategories.includes(category)) return 'Invalid category';
    return '';
  };