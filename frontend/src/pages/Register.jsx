import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Eye, EyeOff, Phone, Hash,
  GraduationCap, BookOpen, Users, School, ChevronRight,
  ChevronLeft, Calendar, MapPin, Shield, CheckCircle,
  AlertCircle, Upload, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, loading } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  const roleOptions = [
    {
      value: 'student',
      label: t('student'),
      description: t('student_registration_description'),
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'teacher',
      label: t('teacher'),
      description: t('teacher_registration_description'),
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      value: 'parent',
      label: t('parent'),
      description: t('parent_registration_description'),
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'librarian',
      label: t('librarian'),
      description: t('librarian_registration_description'),
      icon: School,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const { values, errors, handleChange, handleBlur, handleSubmit, getInputProps, setFieldValue } = useForm(
    {
      role: selectedRole,
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      favId: '',
      teacherId: '',
      grade: '',
      section: '',
      stream: '',
      subjects: [],
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
      agreeToTerms: false
    },
    {
      validationSchema: (t) => ({
        email: (value) => {
          if (!value) return t('email_required');
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return t('invalid_email');
          }
          return null;
        },
        password: (value) => {
          if (!value) return t('password_required');
          if (value.length < 8) return t('password_min_length');
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
            return t('password_complexity');
          }
          return null;
        },
        confirmPassword: (value, allValues) => {
          if (!value) return t('confirm_password_required');
          if (value !== allValues.password) return t('passwords_not_match');
          return null;
        },
        firstName: (value) => {
          if (!value) return t('first_name_required');
          return null;
        },
        lastName: (value) => {
          if (!value) return t('last_name_required');
          return null;
        },
        agreeToTerms: (value) => {
          if (!value) return t('agree_to_terms_required');
          return null;
        }
      }),
      onSubmit: async (values) => {
        const result = await register(values);
        if (result.success) {
          toast.success(t('registration_successful'));
        }
      }
    }
  );

  useEffect(() => {
    if (selectedRole) {
      setFieldValue('role', selectedRole);
    }
  }, [selectedRole, setFieldValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('image_too_large'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('');
  };

  const nextStep = () => {
    if (step === 1 && !selectedRole) {
      toast.error(t('select_role_required'));
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: t('select_role') },
      { number: 2, label: t('personal_info') },
      { number: 3, label: t('account_info') },
      { number: 4, label: t('complete') }
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, index) => (
          <React.Fragment key={s.number}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s.number
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {s.number}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step >= s.number ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                step > s.number ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderRoleSelection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('select_your_role')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('select_role_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleOptions.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setSelectedRole(role.value)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                selectedRole === role.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center`}>
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {role.label}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {role.description}
                  </p>
                  {selectedRole === role.value && (
                    <div className="mt-3 flex items-center text-blue-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">{t('selected')}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t">
          <p className="text-gray-600 text-sm mb-4">
            {t('already_have_account')}{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              {t('sign_in_here')}
            </Link>
          </p>
        </div>
      </motion.div>
    );
  };

  const renderPersonalInfo = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('personal_information')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('personal_info_description')}
          </p>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-400" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 flex space-x-2">
              <label className="cursor-pointer p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4" />
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
                  className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {t('profile_image_optional')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('first_name')} *
            </label>
            <input
              {...getInputProps('firstName')}
              type="text"
              placeholder={t('enter_first_name')}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('middle_name')}
            </label>
            <input
              {...getInputProps('middleName')}
              type="text"
              placeholder={t('enter_middle_name')}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('last_name')} *
            </label>
            <input
              {...getInputProps('lastName')}
              type="text"
              placeholder={t('enter_last_name')}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              {t('email')} *
            </label>
            <input
              {...getInputProps('email')}
              type="email"
              placeholder="user@example.com"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              {t('phone_number')}
            </label>
            <input
              {...getInputProps('phone')}
              type="tel"
              placeholder="+251 9XX XXX XXX"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {selectedRole === 'student' && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {t('student_information')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="inline w-4 h-4 mr-2" />
                  {t('fav_id')} *
                </label>
                <input
                  {...getInputProps('favId')}
                  type="text"
                  placeholder="FAV123456"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {t('date_of_birth')}
                </label>
                <input
                  {...getInputProps('dateOfBirth')}
                  type="date"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('grade')}
                </label>
                <select
                  {...getInputProps('grade')}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('select_grade')}</option>
                  {[9, 10, 11, 12].map(g => (
                    <option key={g} value={g}>{t('grade')} {g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {selectedRole === 'teacher' && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {t('teacher_information')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="inline w-4 h-4 mr-2" />
                  {t('teacher_id')}
                </label>
                <input
                  {...getInputProps('teacherId')}
                  type="text"
                  placeholder="TCH123456"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {t('date_of_birth')}
                </label>
                <input
                  {...getInputProps('dateOfBirth')}
                  type="date"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderAccountInfo = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('account_information')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('account_info_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-2" />
              {t('password')} *
            </label>
            <div className="relative">
              <input
                {...getInputProps('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>{t('password_requirements')}:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li className={values.password.length >= 8 ? 'text-green-600' : ''}>
                  {t('minimum_8_characters')}
                </li>
                <li className={/[a-z]/.test(values.password) ? 'text-green-600' : ''}>
                  {t('one_lowercase')}
                </li>
                <li className={/[A-Z]/.test(values.password) ? 'text-green-600' : ''}>
                  {t('one_uppercase')}
                </li>
                <li className={/\d/.test(values.password) ? 'text-green-600' : ''}>
                  {t('one_number')}
                </li>
                <li className={/[@$!%*?&]/.test(values.password) ? 'text-green-600' : ''}>
                  {t('one_special')}
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-2" />
              {t('confirm_password')} *
            </label>
            <div className="relative">
              <input
                {...getInputProps('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
              />
              {values.confirmPassword === values.password && values.password && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-4">
            <label className="flex items-start space-x-3">
              <input
                {...getInputProps('agreeToTerms')}
                type="checkbox"
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {t('agree_to_terms')} *
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {t('agree_to_terms_description')}{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                    {t('terms_of_service')}
                  </Link>{' '}
                  {t('and')}{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                    {t('privacy_policy')}
                  </Link>
                </p>
              </div>
            </label>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.agreeToTerms}
              </p>
            )}

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">
                {t('receive_updates')}
              </span>
            </label>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderConfirmation = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {t('registration_complete')}
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t('registration_complete_description')}
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 mb-3">
            {t('registration_summary')}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('name')}:</span>
              <span className="font-medium">
                {values.firstName} {values.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('email')}:</span>
              <span className="font-medium">{values.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('role')}:</span>
              <span className="font-medium">
                {roleOptions.find(r => r.value === values.role)?.label}
              </span>
            </div>
            {values.favId && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('fav_id')}:</span>
                <span className="font-medium">{values.favId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full max-w-md py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('creating_account')}...
              </>
            ) : (
              <>
                {t('complete_registration')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={prevStep}
            className="w-full max-w-md py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            {t('go_back')}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ChevronLeft className="w-5 h-5" />
            <span>{t('back_to_home')}</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            {t('create_account')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('join_falcon_academy')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {step === 1 && renderRoleSelection()}
            {step === 2 && renderPersonalInfo()}
            {step === 3 && renderAccountInfo()}
            {step === 4 && renderConfirmation()}
          </AnimatePresence>

          {(step < 4) && (
            <div className="flex justify-between pt-8 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center ${
                  step === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                {t('previous')}
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center"
              >
                {step === 3 ? t('review') : t('next_step')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            {t('already_have_account')}{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;