import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Mail, Eye, EyeOff, LogIn, BookOpen } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import Input from '../../Common/Input'
import Button from '../../Common/Button'
import LanguageSwitcher from '../../Common/LanguageSwitcher'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setError('')
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || t('auth.loginError'))
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-falcon-blue-600 to-falcon-blue-900 text-white p-8 md:p-12 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Falcon Academy</h1>
            <p className="text-falcon-blue-200 text-sm">{t('app.tagline')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            {t('auth.welcomeBack')}
          </h2>
          <p className="text-falcon-blue-200 text-lg">
            {t('auth.loginDescription')}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t('features.aiAssistant')}</h3>
                <p className="text-sm text-white/70">{t('features.aiDescription')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t('features.securePlatform')}</h3>
                <p className="text-sm text-white/70">{t('features.secureDescription')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-falcon-blue-200 text-sm">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">
              {t('auth.registerNow')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t('auth.signIn')}</h2>
            <LanguageSwitcher />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: t('validation.emailRequired'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('validation.emailInvalid'),
                    },
                  })}
                  type="email"
                  className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: t('validation.passwordRequired'),
                    minLength: {
                      value: 6,
                      message: t('validation.passwordMinLength'),
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-falcon-blue-600 focus:ring-falcon-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  {t('auth.rememberMe')}
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-falcon-blue-600 hover:text-falcon-blue-500"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 bg-falcon-blue-600 hover:bg-falcon-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {t('auth.signIn')}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              {t('auth.needHelp')}{' '}
              <a href="mailto:support@falconacademy.edu.et" className="text-falcon-blue-600 font-medium hover:underline">
                support@falconacademy.edu.et
              </a>
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 py-2.5"
              onClick={() => navigate('/register/student')}
            >
              <User className="w-4 h-4" />
              {t('role.student')}
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 py-2.5"
              onClick={() => navigate('/register/teacher')}
            >
              <GraduationCap className="w-4 h-4" />
              {t('role.teacher')}
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 py-2.5"
              onClick={() => navigate('/register/parent')}
            >
              <Users className="w-4 h-4" />
              {t('role.parent')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login