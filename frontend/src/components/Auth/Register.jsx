import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, BookOpen } from 'lucide-react'
import Button from '../../Common/Button'
import Input from '../../Common/Input'
import LanguageSwitcher from '../../Common/LanguageSwitcher'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      
      // TODO: API call for registration
      console.log('Registration data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate to OTP verification
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (err) {
      setError(err.message || t('auth.registrationError'))
    } finally {
      setLoading(false)
    }
  }

  const features = [
    t('features.aiAssistant'),
    t('features.digitalLibrary'),
    t('features.parentTracking'),
    t('features.analytics'),
    t('features.assignmentSystem'),
    t('features.quizSystem'),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-falcon-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-falcon-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Falcon Academy</h1>
              <p className="text-gray-600 text-sm">{t('app.tagline')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side - Features */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.joinFalcon')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('auth.registerDescription')}
              </p>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-falcon-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('auth.chooseRole')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('auth.selectRoleDescription')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => navigate('/register/student')}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-falcon-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-falcon-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6 text-falcon-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">{t('role.student')}</h4>
                      <p className="text-gray-500 text-xs mt-1">Grades 9-12</p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/register/teacher')}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-falcon-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">{t('role.teacher')}</h4>
                      <p className="text-gray-500 text-xs mt-1">Subject Experts</p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/register/parent')}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-falcon-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">{t('role.parent')}</h4>
                      <p className="text-gray-500 text-xs mt-1">Track Progress</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm text-center">
                  {t('auth.alreadyAccount')}{' '}
                  <Link to="/login" className="text-falcon-blue-600 font-semibold hover:underline">
                    {t('auth.signInHere')}
                  </Link>
                </p>
              </div>
            </div>

            {/* Right side - Registration Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('auth.createAccount')}
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.firstName')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...register('firstName', {
                          required: t('validation.firstNameRequired'),
                        })}
                        type="text"
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                        placeholder={t('auth.firstNamePlaceholder')}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.lastName')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...register('lastName', {
                          required: t('validation.lastNameRequired'),
                        })}
                        type="text"
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                        placeholder={t('auth.lastNamePlaceholder')}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

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
                    {t('auth.phone')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      {...register('phone', {
                        required: t('validation.phoneRequired'),
                        pattern: {
                          value: /^(\+251|0)[1-9]\d{8}$/,
                          message: t('validation.phoneInvalid'),
                        },
                      })}
                      type="tel"
                      className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                      placeholder="+251 9XXXXXXXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                            value: 8,
                            message: t('validation.passwordMinLength'),
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                            message: t('validation.passwordComplex'),
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.confirmPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...register('confirmPassword', {
                          required: t('validation.confirmPasswordRequired'),
                          validate: value =>
                            value === password || t('validation.passwordsDontMatch'),
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-falcon-blue-600 focus:ring-falcon-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    {t('auth.agreeToTerms')}{' '}
                    <a href="/terms" className="text-falcon-blue-600 hover:underline">
                      {t('auth.termsOfService')}
                    </a>{' '}
                    {t('auth.and')}{' '}
                    <a href="/privacy" className="text-falcon-blue-600 hover:underline">
                      {t('auth.privacyPolicy')}
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-3 bg-falcon-blue-600 hover:bg-falcon-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  {t('auth.createAccount')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register