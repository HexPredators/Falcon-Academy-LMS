import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Mail, Lock, GraduationCap, BookOpen, Briefcase, ChevronDown, Plus, X } from 'lucide-react'
import Button from '../../Common/Button'
import LanguageSwitcher from '../../Common/LanguageSwitcher'

const TeacherRegistration = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [subjects, setSubjects] = useState([])
  const [grades, setGrades] = useState([])
  const [newSubject, setNewSubject] = useState('')
  const [selectedGrades, setSelectedGrades] = useState([])

  const allGrades = ['9', '10', '11', '12']
  const allSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const allStreams = ['Natural Science', 'Social Science']

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()])
      setNewSubject('')
    }
  }

  const removeSubject = (subject) => {
    setSubjects(subjects.filter(s => s !== subject))
  }

  const toggleGrade = (grade) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter(g => g !== grade))
    } else {
      setSelectedGrades([...selectedGrades, grade])
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      
      const teacherData = {
        ...data,
        subjects,
        grades: selectedGrades,
        role: 'teacher',
      }
      
      console.log('Teacher registration data:', teacherData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate to OTP verification
      navigate('/verify-otp', { state: { email: data.email, type: 'teacher' } })
    } catch (err) {
      setError(err.message || t('auth.registrationError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
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

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="md:flex">
              {/* Left side - Information */}
              <div className="md:w-2/5 bg-gradient-to-b from-green-600 to-green-800 text-white p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('auth.teacherRegistration')}</h2>
                    <p className="text-green-200 text-sm">{t('role.teacher')}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">{t('auth.teacherBenefits')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        {t('features.aiLessonPlanner')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        {t('features.assignmentManagement')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        {t('features.studentAnalytics')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        {t('features.communicationTools')}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">{t('auth.requirements')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t('auth.teachingSubjects')}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t('auth.gradeAssignment')}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t('auth.validCredentials')}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t('auth.adminApproval')}
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <p className="text-green-200 text-sm">
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
                  {t('auth.teacherDetails')}
                </h2>
                <p className="text-gray-600 mb-6">{t('auth.teacherFormDescription')}</p>

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

                  <div className="grid md:grid-cols-2 gap-6">
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
                        {t('auth.teacherId')}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          {...register('teacherId', {
                            required: t('validation.teacherIdRequired'),
                          })}
                          type="text"
                          className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                          placeholder="TCH-2023-001"
                        />
                      </div>
                      {errors.teacherId && (
                        <p className="mt-1 text-sm text-red-600">{errors.teacherId.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.subjects')} *
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                          placeholder={t('auth.addSubjectPlaceholder')}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                        />
                        <Button
                          type="button"
                          onClick={addSubject}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      {subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {subjects.map((subject, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>{subject}</span>
                              <button
                                type="button"
                                onClick={() => removeSubject(subject)}
                                className="text-green-700 hover:text-green-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.gradesTeaching')} *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {allGrades.map((grade) => (
                        <label
                          key={grade}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedGrades.includes(grade)
                              ? 'border-falcon-blue-500 bg-falcon-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedGrades.includes(grade)}
                            onChange={() => toggleGrade(grade)}
                            className="h-4 w-4 text-falcon-blue-600 focus:ring-falcon-blue-500"
                          />
                          <div className="ml-2">
                            <span className="font-medium text-gray-900">
                              {t('auth.grade')} {grade}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
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
                      id="teacher-terms"
                      name="teacher-terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-falcon-blue-600 focus:ring-falcon-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="teacher-terms" className="ml-2 block text-sm text-gray-700">
                      {t('auth.confirmTeacherInfo')}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    {t('auth.registerAsTeacher')}
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

// Add missing import
const CheckCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

export default TeacherRegistration