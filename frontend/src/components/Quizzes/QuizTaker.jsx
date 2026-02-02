import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Flag, Calculator, Save, Send, Eye } from 'lucide-react'
import Button from '../../Common/Button'

const QuizTaker = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [timer, setTimer] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState([])

  const timerRef = useRef()

  useEffect(() => {
    loadQuiz()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (quiz && quiz.duration > 0) {
      startTimer()
    }
  }, [quiz])

  const loadQuiz = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockQuiz = {
        id: parseInt(id),
        title: 'Algebra Basics Quiz',
        description: 'Test your understanding of algebraic expressions',
        subject: 'Mathematics',
        teacher: 'Mr. Alemayehu',
        duration: 30,
        totalPoints: 100,
        startDate: '2024-02-25',
        startTime: '10:00',
        endDate: '2024-02-25',
        endTime: '10:30',
        instructions: `1. Read each question carefully before answering.
2. You have 30 minutes to complete the quiz.
3. Once you submit, you cannot change your answers.
4. Use the flag button to mark questions for review.
5. The timer will show in the top right corner.`,
        shuffleQuestions: true,
        shuffleOptions: true,
        allowCalculator: true,
        showProgress: true
      }

      const mockQuestions = [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the solution to 2x + 5 = 15?',
          points: 5,
          options: [
            { id: 1, text: 'x = 5', isCorrect: true },
            { id: 2, text: 'x = 10', isCorrect: false },
            { id: 3, text: 'x = 7.5', isCorrect: false },
            { id: 4, text: 'x = 20', isCorrect: false }
          ],
          explanation: 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5'
        },
        {
          id: 2,
          type: 'true-false',
          question: 'The equation x² = 4 has only one solution.',
          points: 3,
          options: [
            { id: 1, text: 'True', isCorrect: false },
            { id: 2, text: 'False', isCorrect: true }
          ],
          explanation: 'x² = 4 has two solutions: x = 2 and x = -2'
        },
        {
          id: 3,
          type: 'multiple-choice',
          question: 'Which of the following is a quadratic equation?',
          points: 4,
          options: [
            { id: 1, text: 'x + 2 = 5', isCorrect: false },
            { id: 2, text: 'x² + 3x - 4 = 0', isCorrect: true },
            { id: 3, text: '2x + 3y = 6', isCorrect: false },
            { id: 4, text: 'x³ - 2x + 1 = 0', isCorrect: false }
          ],
          explanation: 'A quadratic equation has the form ax² + bx + c = 0'
        },
        {
          id: 4,
          type: 'short-answer',
          question: 'Solve for y: 3y - 7 = 8',
          points: 6,
          correctAnswer: '5',
          explanation: 'Add 7 to both sides: 3y = 15, then divide by 3: y = 5'
        }
      ]

      setQuiz(mockQuiz)
      setQuestions(mockQuestions)
      setTimeLeft(mockQuiz.duration * 60) // Convert minutes to seconds
      setLoading(false)
    }, 1500)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleOptionSelect = (questionId, optionId) => {
    const question = questions.find(q => q.id === questionId)
    if (question.type === 'multiple-choice') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }))
    } else if (question.type === 'true-false') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId === 1 ? 'true' : 'false'
      }))
    }
  }

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const goToQuestion = (index) => {
    setCurrentQuestion(index)
  }

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const goToPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const saveProgress = () => {
    const progress = {
      quizId: quiz.id,
      answers: answers,
      flagged: flaggedQuestions,
      timeLeft: timeLeft,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(`quiz_progress_${quiz.id}`, JSON.stringify(progress))
    alert(t('quizzes.progressSaved'))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    
    const submission = {
      quizId: quiz.id,
      answers: answers,
      flaggedQuestions: flaggedQuestions,
      timeSpent: quiz.duration * 60 - timeLeft,
      submittedAt: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Submission:', submission)
      setSubmitting(false)
      // Clear progress
      localStorage.removeItem(`quiz_progress_${quiz.id}`)
      // Navigate to results
      navigate(`/quizzes/${quiz.id}/results`)
    }, 2000)
  }

  const handleAutoSubmit = () => {
    alert(t('quizzes.timeUp'))
    handleSubmit()
  }

  const getProgress = () => {
    const answered = Object.keys(answers).length
    return Math.round((answered / questions.length) * 100)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600">{t('quizzes.loadingQuiz')}</p>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = getProgress()

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/quizzes')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
          </div>
          
          {/* Timer */}
          <div className={`px-6 py-3 rounded-lg ${
            timeLeft < 300 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
              <span className="text-sm">{t('quizzes.remaining')}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t('quizzes.progress')}</span>
            <span className="text-sm font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">{t('quizzes.instructions')}</h3>
              <p className="text-sm text-blue-700 whitespace-pre-line">{quiz.instructions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content - Question */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-purple-600">Q{currentQuestion + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('quizzes.question')} {currentQuestion + 1} {t('quizzes.of')} {questions.length}</h3>
                  <p className="text-sm text-gray-600">{currentQ.points} {t('quizzes.points')}</p>
                </div>
              </div>
              
              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`p-2 rounded-lg ${
                  flaggedQuestions.includes(currentQ.id)
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <p className="text-lg text-gray-900 mb-6">{currentQ.question}</p>
              
              {/* Multiple Choice Options */}
              {currentQ.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                        answers[currentQ.id] === option.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        checked={answers[currentQ.id] === option.id}
                        onChange={() => handleOptionSelect(currentQ.id, option.id)}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="text-gray-700">{option.text}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* True/False Options */}
              {currentQ.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-center gap-3 p-6 border rounded-lg cursor-pointer transition-all ${
                        answers[currentQ.id] === (option.id === 1 ? 'true' : 'false')
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        checked={answers[currentQ.id] === (option.id === 1 ? 'true' : 'false')}
                        onChange={() => handleOptionSelect(currentQ.id, option.id)}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-lg font-medium text-gray-900">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Short Answer */}
              {currentQ.type === 'short-answer' && (
                <div>
                  <textarea
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('quizzes.typeAnswer')}
                  />
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                onClick={goToPrev}
                disabled={currentQuestion === 0}
                variant="outline"
                className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                {t('quizzes.previous')}
              </Button>
              
              <div className="flex gap-3">
                <Button
                  onClick={saveProgress}
                  variant="outline"
                  className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {t('quizzes.save')}
                </Button>
                
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={() => setShowConfirm(true)}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {t('quizzes.submitQuiz')}
                  </Button>
                ) : (
                  <Button
                    onClick={goToNext}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    {t('quizzes.next')}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Question Navigator */}
        <div className="space-y-6">
          {/* Question Grid */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.questions')}</h3>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(index)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                    currentQuestion === index
                      ? 'bg-purple-600 text-white'
                      : answers[q.id]
                      ? flaggedQuestions.includes(q.id)
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                      : flaggedQuestions.includes(q.id)
                      ? 'bg-yellow-50 text-yellow-600 border-2 border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="font-bold">Q{index + 1}</span>
                  {flaggedQuestions.includes(q.id) && (
                    <Flag className="w-3 h-3 mt-1" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                  <span className="text-gray-600">{t('quizzes.answered')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-50 border-2 border-yellow-300"></div>
                  <span className="text-gray-600">{t('quizzes.flagged')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-100"></div>
                  <span className="text-gray-600">{t('quizzes.unanswered')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.quizSummary')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quizzes.totalQuestions')}</span>
                <span className="font-medium text-gray-900">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quizzes.answered')}</span>
                <span className="font-medium text-green-600">{Object.keys(answers).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quizzes.flagged')}</span>
                <span className="font-medium text-yellow-600">{flaggedQuestions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quizzes.timeLeft')}</span>
                <span className="font-medium text-gray-900">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quizzes.progress')}</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Calculator (if allowed) */}
          {quiz.allowCalculator && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">{t('quizzes.calculator')}</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {['7', '8', '9', '÷'].map((btn) => (
                    <button key={btn} className="p-3 bg-white border border-gray-300 rounded hover:bg-gray-50">
                      {btn}
                    </button>
                  ))}
                  {['4', '5', '6', '×'].map((btn) => (
                    <button key={btn} className="p-3 bg-white border border-gray-300 rounded hover:bg-gray-50">
                      {btn}
                    </button>
                  ))}
                  {['1', '2', '3', '-'].map((btn) => (
                    <button key={btn} className="p-3 bg-white border border-gray-300 rounded hover:bg-gray-50">
                      {btn}
                    </button>
                  ))}
                  {['0', '.', '=', '+'].map((btn) => (
                    <button key={btn} className="p-3 bg-white border border-gray-300 rounded hover:bg-gray-50">
                      {btn}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  placeholder="0"
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{t('quizzes.submitConfirm')}</h3>
                  <p className="text-gray-600 text-sm">{t('quizzes.submitConfirmDesc')}</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-yellow-700">{t('quizzes.answered')}</span>
                    <span className="font-medium">{Object.keys(answers).length}/{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-yellow-700">{t('quizzes.flagged')}</span>
                    <span className="font-medium">{flaggedQuestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-yellow-700">{t('quizzes.timeLeft')}</span>
                    <span className="font-medium">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowConfirm(false)}
                  variant="outline"
                  className="px-6"
                >
                  {t('quizzes.review')}
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {t('quizzes.submitNow')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizTaker