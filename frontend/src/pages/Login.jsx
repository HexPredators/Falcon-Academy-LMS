import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, BookOpen, 
  GraduationCap, Users, School, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { values, errors, handleChange, handleBlur, handleSubmit, getInputProps } = useForm(
    {
      email: '',
      password: '',
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
          if (value.length < 6) return t('password_min_length');
          return null;
        }
      }),
      onSubmit: async (values) => {
        const result = await login(values.email, values.password);
        if (result.success) {
          toast.success(t('login_successful'));
        }
      },
      showSuccessToast: false,
      showErrorToast: false
    }
  );

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const roleCards = [
    {
      role: 'student',
      icon: GraduationCap,
      title: t('student_login'),
      description: t('student_login_description'),
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      role: 'teacher',
      icon: Users,
      title: t('teacher_login'),
      description: t('teacher_login_description'),
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      role: 'parent',
      icon: BookOpen,
      title: t('parent_login'),
      description: t('parent_login_description'),
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      role: 'admin',
      icon: School,
      title: t('admin_login'),
      description: t('admin_login_description'),
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto w-full"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Falcon Academy</h1>
                <p className="text-gray-600">{t('digital_learning_platform')}</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('welcome_back')}
            </h2>
            <p className="text-gray-600">
              {t('login_to_access_dlms')}
            </p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                {t('email_address')}
              </label>
              <input
                {...getInputProps('email')}
                type="email"
                placeholder="user@falconacademy.edu.et"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                {t('password')}
              </label>
              <div className="relative">
                <input
                  {...getInputProps('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
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
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{t('remember_me')}</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('forgot_password')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('logging_in')}...
                </>
              ) : (
                <>
                  {t('sign_in')}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t('or_continue_with')}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {roleCards.map((card) => (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => navigate(`/register?role=${card.role}`)}
                  className={`p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 text-left group`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-3 group-hover:${card.hoverColor}`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {card.description}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-600">
              {t('dont_have_account')}{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                {t('create_account')}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full translate-y-48 -translate-x-48 opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('falcon_academy_dlms')}
            </h2>
            <p className="text-blue-100 text-lg">
              {t('transforming_education_ethiopia')}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('comprehensive_curriculum')}
                </h3>
                <p className="text-blue-100">
                  {t('comprehensive_curriculum_description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('ai_powered_learning')}
                </h3>
                <p className="text-blue-100">
                  {t('ai_powered_learning_description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('digital_library')}
                </h3>
                <p className="text-blue-100">
                  {t('digital_library_description')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">
                  {t('supported_by')}
                </p>
                <p className="text-white font-semibold">
                  Ethiopian Ministry of Education
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">
                  {t('available_in')}
                </p>
                <p className="text-white font-semibold">
                  4 Languages
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;