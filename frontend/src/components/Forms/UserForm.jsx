import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  User, Mail, Phone, Lock, Camera, Upload, X,
  Briefcase, GraduationCap, BookOpen, Users,
  Calendar, MapPin, Globe, Shield, CheckCircle,
  AlertCircle, Eye, EyeOff
} from 'lucide-react';

const UserForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = 'create',
  roles = [],
  grades = [],
  sections = [],
  streams = [],
  subjects = [],
  allowedRoles = [],
  showPasswordField = true,
  requireEmailVerification = false,
  className = '',
  ...props
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(initialData.profileImage || '');
  const [selectedRole, setSelectedRole] = useState(initialData.role || '');
  const [selectedGrade, setSelectedGrade] = useState(initialData.grade || '');
  const [selectedStream, setSelectedStream] = useState(initialData.stream || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
    trigger
  } = useForm({
    defaultValues: {
      firstName: initialData.firstName || '',
      middleName: initialData.middleName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      password: '',
      confirmPassword: '',
      role: initialData.role || '',
      favId: initialData.favId || '',
      grade: initialData.grade || '',
      section: initialData.section || '',
      stream: initialData.stream || '',
      subjects: initialData.subjects || [],
      address: initialData.address || '',
      city: initialData.city || '',
      emergencyContact: initialData.emergencyContact || '',
      dateOfBirth: initialData.dateOfBirth || '',
      gender: initialData.gender || '',
      isActive: initialData.isActive !== undefined ? initialData.isActive : true
    }
  });

  const watchedRole = watch('role');
  const watchedGrade = watch('grade');
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.profileImage) {
        setProfileImage(initialData.profileImage);
      }
    }
  }, [initialData, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('image_size_error'));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(t('image_type_error'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        setValue('profileImage', event.target.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('');
    setValue('profileImage', '', { shouldDirty: true });
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setValue('role', role, { shouldDirty: true });
    
    if (role === 'student') {
      setValue('subjects', []);
    }
  };

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setValue('grade', grade, { shouldDirty: true });
    
    if (grade < 11) {
      setSelectedStream('');
      setValue('stream', '', { shouldDirty: true });
    }
  };

  const handleSubjectToggle = (subjectId) => {
    const currentSubjects = watch('subjects') || [];
    const newSubjects = currentSubjects.includes(subjectId)
      ? currentSubjects.filter(id => id !== subjectId)
      : [...currentSubjects, subjectId];
    
    setValue('subjects', newSubjects, { shouldDirty: true });
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="inline w-4 h-4 mr-2" />
                  {t('fav_id')} *
                </label>
                <input
                  type="text"
                  {...register('favId', {
                    required: t('fav_id_required'),
                    pattern: {
                      value: /^[A-Z0-9]+$/,
                      message: t('fav_id_invalid')
                    }
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.favId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="FAV123456"
                />
                {errors.favId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.favId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {t('date_of_birth')} *
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth', { required: t('dob_required') })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('grade')} *
                </label>
                <select
                  {...register('grade', { required: t('grade_required') })}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.grade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t('select_grade')}</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>
                      {t('grade')} {grade}
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.grade.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('section')} *
                </label>
                <select
                  {...register('section', { required: t('section_required') })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.section ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t('select_section')}</option>
                  {sections.map(section => (
                    <option key={section} value={section}>
                      {t('section')} {section}
                    </option>
                  ))}
                </select>
                {errors.section && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.section.message}
                  </p>
                )}
              </div>

              {selectedGrade >= 11 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('stream')} *
                  </label>
                  <select
                    {...register('stream', { required: t('stream_required') })}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.stream ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('select_stream')}</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>
                        {t(stream)}
                      </option>
                    ))}
                  </select>
                  {errors.stream && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.stream.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                {t('address')}
              </label>
              <textarea
                {...register('address')}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder={t('address_placeholder')}
              />
            </div>
          </div>
        );

      case 'teacher':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="inline w-4 h-4 mr-2" />
                  {t('teacher_id')} *
                </label>
                <input
                  type="text"
                  {...register('teacherId', {
                    required: t('teacher_id_required'),
                    pattern: {
                      value: /^[A-Z0-9]+$/,
                      message: t('teacher_id_invalid')
                    }
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.teacherId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="TCH123456"
                />
                {errors.teacherId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.teacherId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {t('date_of_birth')}
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline w-4 h-4 mr-2" />
                {t('subjects')} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => handleSubjectToggle(subject.id)}
                    className={`p-3 border rounded-xl flex items-center justify-center transition-all duration-200 ${
                      watch('subjects')?.includes(subject.id)
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{subject.name}</span>
                    {watch('subjects')?.includes(subject.id) && (
                      <CheckCircle className="w-4 h-4 ml-2 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
              {errors.subjects && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.subjects.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('grades')} *
                </label>
                <div className="flex flex-wrap gap-2">
                  {grades.map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        const currentGrades = watch('grades') || [];
                        const newGrades = currentGrades.includes(grade)
                          ? currentGrades.filter(g => g !== grade)
                          : [...currentGrades, grade];
                        setValue('grades', newGrades, { shouldDirty: true });
                      }}
                      className={`px-3 py-2 border rounded-lg text-sm transition-all duration-200 ${
                        watch('grades')?.includes(grade)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {t('grade')} {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sections')} *
                </label>
                <div className="flex flex-wrap gap-2">
                  {sections.map(section => (
                    <button
                      key={section}
                      type="button"
                      onClick={() => {
                        const currentSections = watch('sections') || [];
                        const newSections = currentSections.includes(section)
                          ? currentSections.filter(s => s !== section)
                          : [...currentSections, section];
                        setValue('sections', newSections, { shouldDirty: true });
                      }}
                      className={`px-3 py-2 border rounded-lg text-sm transition-all duration-200 ${
                        watch('sections')?.includes(section)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {t('section')} {section}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'parent':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                {t('phone_number')} *
              </label>
              <input
                type="tel"
                {...register('phone', {
                  required: t('phone_required'),
                  pattern: {
                    value: /^[0-9+\-\s]+$/,
                    message: t('phone_invalid')
                  }
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+251 9XX XXX XXX"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                {t('address')} *
              </label>
              <textarea
                {...register('address', { required: t('address_required') })}
                rows="2"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('address_placeholder')}
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-2" />
                {t('emergency_contact')} *
              </label>
              <input
                type="text"
                {...register('emergencyContact', { required: t('emergency_contact_required') })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('emergency_contact_placeholder')}
              />
              {errors.emergencyContact && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.emergencyContact.message}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmitForm = (data) => {
    const formData = {
      ...data,
      profileImage,
      isActive: data.isActive !== undefined ? data.isActive : true
    };
    
    if (selectedRole === 'student') {
      delete formData.subjects;
      delete formData.teacherId;
    } else if (selectedRole === 'teacher') {
      delete formData.favId;
      delete formData.stream;
    } else if (selectedRole === 'parent') {
      delete formData.favId;
      delete formData.teacherId;
      delete formData.subjects;
      delete formData.grade;
      delete formData.section;
      delete formData.stream;
    }
    
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmitForm)}
      className={`space-y-8 ${className}`}
      {...props}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? t('create_user') : t('edit_user')}
          </h2>
          <p className="mt-2 text-gray-600">
            {mode === 'create' ? t('create_user_description') : t('edit_user_description')}
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-blue-400" />
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 right-0 flex space-x-2">
                <label className="cursor-pointer p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
                  <Upload className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                
                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              {t('profile_image_hint')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                {t('first_name')} *
              </label>
              <input
                type="text"
                {...register('firstName', { required: t('first_name_required') })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('first_name_placeholder')}
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                {t('middle_name')}
              </label>
              <input
                type="text"
                {...register('middleName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder={t('middle_name_placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                {t('last_name')} *
              </label>
              <input
                type="text"
                {...register('lastName', { required: t('last_name_required') })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('last_name_placeholder')}
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                {t('email')} *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: t('email_required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('email_invalid')
                  }
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="user@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                {t('phone')}
              </label>
              <input
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9+\-\s]+$/,
                    message: t('phone_invalid')
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="+251 9XX XXX XXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="inline w-4 h-4 mr-2" />
              {t('role')} *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roles
                .filter(role => allowedRoles.length === 0 || allowedRoles.includes(role.value))
                .map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleRoleChange(role.value)}
                    className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                      selectedRole === role.value
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {role.icon && <role.icon className="w-6 h-6 mb-2" />}
                    <span className="text-sm font-medium">{t(role.label)}</span>
                    <span className="text-xs text-gray-500 mt-1">{t(role.description)}</span>
                  </button>
                ))}
            </div>
            {errors.role && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.role.message}
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selectedRole && (
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {t('role_specific_info')}
                  </h3>
                  {renderRoleSpecificFields()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showPasswordField && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {t('security_settings')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-2" />
                    {mode === 'create' ? t('password') : t('new_password')}
                    {mode === 'create' && ' *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: mode === 'create' && t('password_required'),
                        minLength: {
                          value: 8,
                          message: t('password_min_length')
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: t('password_pattern')
                        }
                      })}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-2" />
                    {t('confirm_password')} *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: t('confirm_password_required'),
                        validate: value => 
                          value === watchedPassword || t('passwords_not_match')
                      })}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    {watchedConfirmPassword === watchedPassword && watchedPassword && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-8">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('isActive')}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                {t('account_active')}
              </span>
            </label>
            <p className="mt-2 text-sm text-gray-500">
              {t('account_active_description')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          {t('cancel')}
        </button>
        
        <button
          type="submit"
          disabled={loading || (!isDirty && mode === 'edit')}
          className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 ${
            (loading || (!isDirty && mode === 'edit')) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('processing')}
            </div>
          ) : (
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {mode === 'create' ? t('create_user') : t('update_user')}
            </div>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default UserForm;