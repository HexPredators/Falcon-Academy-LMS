import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Mail, Lock, BookOpen, Hash, GraduationCap, Calendar, Users, ChevronDown } from 'lucide-react'
import Button from '../../Common/Button'
import Input from '../../Common/Input'
import LanguageSwitcher from '../../Common/LanguageSwitcher'

const StudentRegistration = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')
  const [stream, setStream] = useState('')

  const grades = ['9', '10', '11', '12']
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const streams = ['Natural Science', 'Social Science']

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      
      const studentData = {
        ...data,
        grade,
        section,
        stream: grade >= 11 ? stream : null,
        role: 'student',
      }
      
      console.log('Student registration data:', studentData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate to OTP verification
      navigate('/verify-otp', { state: { email: data.email, type: 'student' } })
    } catch (err) {
      setError(err.message || t('auth.registrationError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-falcon-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Falcon Academy</h1>
              <p className="text-gray-600 text-sm">{t('app.tagline')}</p>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="md:flex">
              {/* Left side - Information */}
              <div className="md:w-2/5 bg-gradient-to-b from-falcon-blue-600 to-falcon-blue-800 text-white p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('auth.studentRegistration')}</h2>
                    <p className="text-blue-200 text-sm">{t('role.student')}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">{t('auth.requirements')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {t('auth.validFavId')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {t('auth.validEmail')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {t('auth.gradeSelection')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {t('auth.otpVerification')}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">{t('features.features')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {t('features.digitalLibrary')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {t('features.aiAssistant')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {t('features.assignments')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        {t('features.progressTracking')}
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <p className="text-blue-200 text-sm">
                      {t('auth.alreadyAccount')}{' '}
                      <Link to="/login" className="text-white font-semibold hover:underline">
                        {t('auth.signInHere')}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Form */}
              <div className="md:w-3/5 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('auth.studentDetails')}
                </h2>
                <p className="text-gray-600 mb-6">{t('auth.studentFormDescription')}</p>

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
                      {t('auth.favId')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Hash className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...register('favId', {
                          required: t('validation.favIdRequired'),
                          pattern: {
                            value: /^[A-Z0-9]{6,12}$/,
                            message: t('validation.favIdInvalid'),
                          },
                        })}
                        type="text"
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                        placeholder="FAV-123456"
                      />
                    </div>
                    {errors.favId && (
                      <p className="mt-1 text-sm text-red-600">{errors.favId.message}</p>
                    )}
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.grade')} *
                      </label>
                      <div className="relative">
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">{t('auth.selectGrade')}</option>
                          {grades.map((g) => (
                            <option key={g} value={g}>
                              {t('auth.grade')} {g}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.section')} *
                      </label>
                      <div className="relative">
                        <select
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">{t('auth.selectSection')}</option>
                          {sections.map((s) => (
                            <option key={s} value={s}>
                              {t('auth.section')} {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {grade >= 11 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.stream')} *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {streams.map((s) => (
                          <label
                            key={s}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                              stream === s
                                ? 'border-falcon-blue-500 bg-falcon-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="stream"
                              value={s}
                              checked={stream === s}
                              onChange={(e) => setStream(e.target.value)}
                              className="h-4 w-4 text-falcon-blue-600 focus:ring-falcon-blue-500"
                              required
                            />
                            <div className="ml-3">
                              <span className="font-medium text-gray-900">{s}</span>
                              <p className="text-gray-500 text-sm mt-1">
                                {s === 'Natural Science'
                                  ? t('auth.naturalScienceDesc')
                                  : t('auth.socialScienceDesc')}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

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
                        })}
                        type="password"
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                        placeholder={t('auth.passwordPlaceholder')}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
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
                      {t('auth.confirmInformation')}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-3 bg-falcon-blue-600 hover:bg-falcon-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    {t('auth.registerAsStudent')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentRegistration