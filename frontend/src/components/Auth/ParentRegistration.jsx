import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Mail, Lock, Users, Phone, UserPlus, ChevronDown, Search } from 'lucide-react'
import Button from '../../Common/Button'
import LanguageSwitcher from '../../Common/LanguageSwitcher'

const ParentRegistration = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [children, setChildren] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const searchChild = () => {
    // Simulate search
    if (searchQuery.trim()) {
      setSearchResults([
        { id: 1, name: 'John Doe', grade: '10', section: 'A', favId: 'FAV-2023-001' },
        { id: 2, name: 'Jane Smith', grade: '11', section: 'B', favId: 'FAV-2023-002' },
      ])
    }
  }

  const addChild = (child) => {
    if (!children.find(c => c.id === child.id)) {
      setChildren([...children, child])
      setSearchResults([])
      setSearchQuery('')
    }
  }

  const removeChild = (childId) => {
    setChildren(children.filter(c => c.id !== childId))
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      
      const parentData = {
        ...data,
        children: children.map(c => ({ id: c.id, favId: c.favId })),
        role: 'parent',
      }
      
      console.log('Parent registration data:', parentData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate to OTP verification
      navigate('/verify-otp', { state: { email: data.email, type: 'parent' } })
    } catch (err) {
      setError(err.message || t('auth.registrationError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
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
              <div className="md:w-2/5 bg-gradient-to-b from-purple-600 to-purple-800 text-white p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('auth.parentRegistration')}</h2>
                    <p className="text-purple-200 text-sm">{t('role.parent')}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">{t('auth.parentBenefits')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        {t('features.realTimeTracking')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        {t('features.gradeMonitoring')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        {t('features.assignmentTracking')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        {t('features.directMessaging')}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">{t('auth.howItWorks')}</h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          1
                        </div>
                        <span>{t('auth.registerParentAccount')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          2
                        </div>
                        <span>{t('auth.searchAddChild')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                        <span>{t('auth.childApproval')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          4
                        </div>
                        <span>{t('auth.startTracking')}</span>
                      </li>
                    </ol>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <p className="text-purple-200 text-sm">
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
                  {t('auth.parentDetails')}
                </h2>
                <p className="text-gray-600 mb-6">{t('auth.parentFormDescription')}</p>

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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.addChildren')}
                    </label>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Search className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                            placeholder={t('auth.searchChildPlaceholder')}
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={searchChild}
                          className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                        >
                          <Search className="w-5 h-5" />
                        </Button>
                      </div>

                      {searchResults.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          {searchResults.map((child) => (
                            <div
                              key={child.id}
                              className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
                            >
                              <div>
                                <h4 className="font-medium text-gray-900">{child.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {t('auth.grade')} {child.grade} - {t('auth.section')} {child.section}
                                </p>
                                <p className="text-xs text-gray-500">ID: {child.favId}</p>
                              </div>
                              <Button
                                type="button"
                                onClick={() => addChild(child)}
                                className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm"
                              >
                                <UserPlus className="w-4 h-4 mr-1" />
                                {t('auth.add')}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {children.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">
                            {t('auth.addedChildren')} ({children.length})
                          </h4>
                          <div className="space-y-2">
                            {children.map((child) => (
                              <div
                                key={child.id}
                                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900">{child.name}</h5>
                                    <p className="text-sm text-gray-600">
                                      {t('auth.grade')} {child.grade} • {t('auth.section')} {child.section}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeChild(child.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                      id="parent-terms"
                      name="parent-terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-falcon-blue-600 focus:ring-falcon-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="parent-terms" className="ml-2 block text-sm text-gray-700">
                      {t('auth.confirmParentInfo')}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    {t('auth.registerAsParent')}
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

// Add missing imports
const BookOpen = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default ParentRegistration