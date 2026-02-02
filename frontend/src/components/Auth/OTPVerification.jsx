import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '../../Common/Button'
import LanguageSwitcher from '../../Common/LanguageSwitcher'

const OTPVerification = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(120)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  const email = location.state?.email || 'user@example.com'
  const userType = location.state?.type || 'user'

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(countdown)
    } else {
      setCanResend(true)
    }
  }, [timer])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp]
      pastedData.split('').forEach((char, index) => {
        if (index < 6) newOtp[index] = char
      })
      setOtp(newOtp)
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    
    if (otpValue.length !== 6) {
      setError(t('validation.otpRequired'))
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(t('auth.verificationSuccess'))
      
      // Redirect based on user type
      setTimeout(() => {
        switch (userType) {
          case 'student':
            navigate('/dashboard')
            break
          case 'teacher':
            navigate('/dashboard')
            break
          case 'parent':
            navigate('/dashboard')
            break
          default:
            navigate('/login')
        }
      }, 2000)
    } catch (err) {
      setError(err.message || t('auth.verificationError'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      // Simulate resend OTP API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTimer(120)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
      
      setSuccess(t('auth.otpResent'))
    } catch (err) {
      setError(err.message || t('auth.resendError'))
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-falcon-blue-50 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-falcon-blue-600 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Falcon Academy</h1>
              <p className="text-gray-600 text-sm">{t('app.tagline')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-falcon-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-falcon-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.verifyEmail')}
              </h2>
              <p className="text-gray-600">
                {t('auth.otpSentTo')}{' '}
                <span className="font-semibold text-falcon-blue-600">{email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  {t('auth.enter6DigitCode')}
                </label>
                <div className="flex justify-center gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      maxLength="1"
                      className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-falcon-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  {t('auth.codeExpiresIn')}{' '}
                  <span className="font-semibold text-falcon-blue-600">
                    {formatTime(timer)}
                  </span>
                </p>
                
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || loading}
                  className={`text-sm font-medium ${
                    canResend
                      ? 'text-falcon-blue-600 hover:text-falcon-blue-700'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    {t('auth.resendCode')}
                  </div>
                </button>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 bg-falcon-blue-600 hover:bg-falcon-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {t('auth.verifyAccount')}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  {t('auth.didntReceiveCode')}{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-falcon-blue-600 font-semibold hover:underline"
                  >
                    {t('auth.tryDifferentEmail')}
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              {t('auth.needHelpVerification')}{' '}
              <a
                href="mailto:support@falconacademy.edu.et"
                className="text-falcon-blue-600 font-semibold hover:underline"
              >
                support@falconacademy.edu.et
              </a>
            </p>
          </div>

          <div className="mt-6 bg-gradient-to-r from-falcon-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t('auth.verificationTips')}
            </h3>
            <ul className="text-gray-600 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {t('auth.checkSpamFolder')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {t('auth.codeValidFor')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {t('auth.enterCodePromptly')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification