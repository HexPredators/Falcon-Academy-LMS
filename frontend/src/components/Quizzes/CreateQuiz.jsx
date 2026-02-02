import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Clock, Calendar, Award, Users, ChevronDown, Save, Send, Eye, Trash2 } from 'lucide-react'
import Button from '../../Common/Button'

const CreateQuiz = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSections, setSelectedSections] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [activeTab, setActiveTab] = useState('details')

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    instructions: '',
    duration: 30,
    totalPoints: 100,
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '09:30',
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: 'immediate',
    allowRetake: false,
    maxAttempts: 1,
    passingScore: 60,
    visibility: 'scheduled'
  })

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography', 'Civics', 'ICT']
  const grades = ['9', '10', '11', '12']
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const streams = ['Natural Science', 'Social Science']
  const questionTypes = [
    { id: 'multiple-choice', name: t('quizzes.multipleChoice'), icon: '🔘' },
    { id: 'true-false', name: t('quizzes.trueFalse'), icon: '✓✗' },
    { id: 'short-answer', name: t('quizzes.shortAnswer'), icon: '📝' },
    { id: 'matching', name: t('quizzes.matching'), icon: '↔️' },
    { id: 'essay', name: t('quizzes.essay'), icon: '📄' }
  ]

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const formattedDate = tomorrow.toISOString().split('T')[0]
    
    setFormData(prev => ({
      ...prev,
      startDate: formattedDate,
      endDate: formattedDate,
      endTime: '09:30'
    }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type: type,
      question: '',
      points: 1,
      options: type === 'multiple-choice' ? [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false },
        { id: 3, text: '', isCorrect: false },
        { id: 4, text: '', isCorrect: false }
      ] : [],
      correctAnswer: '',
      explanation: ''
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const updateOption = (questionId, optionId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt =>
            opt.id === optionId ? { ...opt, [field]: value } : opt
          )
        }
      }
      return q
    }))
  }

  const removeQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const toggleSection = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(prev => prev.filter(s => s !== section))
    } else {
      setSelectedSections(prev => [...prev, section])
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert(t('quizzes.enterTitle'))
      return false
    }
    if (!formData.subject) {
      alert(t('quizzes.selectSubject'))
      return false
    }
    if (!selectedGrade) {
      alert(t('quizzes.selectGrade'))
      return false
    }
    if (selectedSections.length === 0) {
      alert(t('quizzes.selectSection'))
      return false
    }
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      alert(t('quizzes.setDateTime'))
      return false
    }
    if (questions.length === 0) {
      alert(t('quizzes.addQuestions'))
      return false
    }
    return true
  }

  const calculateTotalPoints = () => {
    return questions.reduce((total, q) => total + (parseInt(q.points) || 0), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    const quizData = {
      ...formData,
      grade: selectedGrade,
      sections: selectedSections,
      stream: selectedGrade >= 11 ? selectedStream : null,
      questions: questions,
      totalPoints: calculateTotalPoints(),
      questionCount: questions.length,
      createdAt: new Date().toISOString(),
      status: 'draft'
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Quiz created:', quizData)
      setLoading(false)
      alert(t('quizzes.createdSuccess'))
      // Redirect to quizzes list
      window.location.href = '/quizzes'
    }, 2000)
  }

  const handleSaveDraft = () => {
    const draftData = {
      ...formData,
      grade: selectedGrade,
      sections: selectedSections,
      stream: selectedStream,
      questions: questions,
      savedAt: new Date().toISOString(),
      status: 'draft'
    }
    
    localStorage.setItem('quiz_draft', JSON.stringify(draftData))
    alert(t('quizzes.draftSaved'))
  }

  const previewQuiz = () => {
    const previewData = {
      title: formData.title,
      description: formData.description,
      questions: questions,
      duration: formData.duration,
      totalPoints: calculateTotalPoints()
    }
    console.log('Preview:', previewData)
    // Open preview in new tab
    window.open(`/quizzes/preview`, '_blank')
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('quizzes.createQuiz')}</h1>
        <p className="text-gray-600">{t('quizzes.createQuizDesc')}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {['details', 'audience', 'questions', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t(`quizzes.${tab}`)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizzes.title')} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('quizzes.titlePlaceholder')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quizzes.subject')} *
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                    >
                      <option value="">{t('quizzes.selectSubject')}</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quizzes.totalPoints')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Award className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="totalPoints"
                      value={formData.totalPoints}
                      onChange={handleInputChange}
                      min="1"
                      className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizzes.description')}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('quizzes.descriptionPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizzes.instructions')}
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('quizzes.instructionsPlaceholder')}
                />
              </div>
            </div>
          )}

          {/* Audience Tab */}
          {activeTab === 'audience' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('quizzes.grade')} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {grades.map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setSelectedGrade(grade)}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        selectedGrade === grade
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('quizzes.grade')} {grade}
                    </button>
                  ))}
                </div>
              </div>

              {selectedGrade >= 11 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('quizzes.stream')} *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {streams.map(stream => (
                      <button
                        key={stream}
                        type="button"
                        onClick={() => setSelectedStream(stream)}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          selectedStream === stream
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {stream}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('quizzes.sections')} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {sections.map(section => (
                    <label
                      key={section}
                      className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedSections.includes(section)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(section)}
                        onChange={() => toggleSection(section)}
                        className="hidden"
                      />
                      <span className="font-medium text-gray-900">
                        {t('quizzes.section')} {section}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Question Type Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('quizzes.addQuestion')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {questionTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => addQuestion(type.id)}
                      className="p-4 border border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center"
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {t('quizzes.questions')} ({questions.length})
                  </h3>
                  <div className="text-sm text-gray-600">
                    {t('quizzes.totalPoints')}: {calculateTotalPoints()}
                  </div>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('quizzes.noQuestions')}
                    </h4>
                    <p className="text-gray-600">
                      {t('quizzes.addQuestionsPrompt')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((q, index) => (
                      <div key={q.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-900">Q{index + 1}</span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {t(`quizzes.${q.type}`)}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                {q.points} {t('quizzes.points')}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                              placeholder={t('quizzes.questionPlaceholder')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <button
                            onClick={() => removeQuestion(q.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Multiple Choice Options */}
                        {q.type === 'multiple-choice' && (
                          <div className="space-y-3 mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                              {t('quizzes.options')}
                            </label>
                            {q.options.map((option, optIndex) => (
                              <div key={option.id} className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name={`correct-${q.id}`}
                                  checked={option.isCorrect}
                                  onChange={() => {
                                    // Set all options to false first
                                    q.options.forEach(opt => {
                                      updateOption(q.id, opt.id, 'isCorrect', false)
                                    })
                                    // Then set this one to true
                                    updateOption(q.id, option.id, 'isCorrect', true)
                                  }}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                />
                                <input
                                  type="text"
                                  value={option.text}
                                  onChange={(e) => updateOption(q.id, option.id, 'text', e.target.value)}
                                  placeholder={`${t('quizzes.option')} ${String.fromCharCode(65 + optIndex)}`}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Points Input */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('quizzes.points')}
                          </label>
                          <input
                            type="number"
                            value={q.points}
                            onChange={(e) => updateQuestion(q.id, 'points', e.target.value)}
                            min="0"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        {/* Explanation */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('quizzes.explanation')}
                          </label>
                          <textarea
                            value={q.explanation}
                            onChange={(e) => updateQuestion(q.id, 'explanation', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder={t('quizzes.explanationPlaceholder')}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quizzes.startDateTime')} *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quizzes.endDateTime')} *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        min={formData.startDate}
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizzes.duration')} (minutes) *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="180"
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="shuffleQuestions"
                    checked={formData.shuffleQuestions}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{t('quizzes.shuffleQuestions')}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="shuffleOptions"
                    checked={formData.shuffleOptions}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{t('quizzes.shuffleOptions')}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowRetake"
                    checked={formData.allowRetake}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{t('quizzes.allowRetake')}</span>
                </label>
              </div>

              {formData.allowRetake && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quizzes.maxAttempts')}
                  </label>
                  <input
                    type="number"
                    name="maxAttempts"
                    value={formData.maxAttempts}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizzes.passingScore')} (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quizzes.showResults')}
                </label>
                <div className="relative">
                  <select
                    name="showResults"
                    value={formData.showResults}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option value="immediate">{t('quizzes.immediate')}</option>
                    <option value="after_submission">{t('quizzes.afterSubmission')}</option>
                    <option value="after_deadline">{t('quizzes.afterDeadline')}</option>
                    <option value="never">{t('quizzes.never')}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{t('quizzes.readyToPublish')}</h3>
            <p className="text-sm text-gray-600">
              {t('quizzes.reviewQuiz')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={previewQuiz}
              variant="outline"
              className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Eye className="w-5 h-5 mr-2" />
              {t('quizzes.preview')}
            </Button>
            
            <Button
              type="button"
              onClick={handleSaveDraft}
              variant="outline"
              className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {t('quizzes.saveDraft')}
            </Button>
            
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={loading}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              {t('quizzes.publishQuiz')}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quizzes.quizPreview')}</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {formData.title || t('quizzes.sampleTitle')}
              </h4>
              <p className="text-gray-600 mt-1">
                {formData.description || t('quizzes.sampleDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.subject')}</p>
                <p className="font-medium text-gray-900">{formData.subject || 'Mathematics'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.duration')}</p>
                <p className="font-medium text-gray-900">{formData.duration || '30'} {t('quizzes.minutes')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.questions')}</p>
                <p className="font-medium text-gray-900">{questions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.totalPoints')}</p>
                <p className="font-medium text-gray-900">{calculateTotalPoints()}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">{t('quizzes.schedule')}</p>
              <p className="font-medium text-gray-900">
                {formData.startDate || '2024-02-25'} {formData.startTime || '09:00'} - {formData.endDate || '2024-02-25'} {formData.endTime || '09:30'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">{t('quizzes.target')}</p>
              <p className="font-medium text-gray-900">
                {selectedGrade ? `${t('quizzes.grade')} ${selectedGrade}` : 'Grade 10'} • 
                {selectedSections.length > 0 ? ` ${selectedSections.join(', ')}` : ' Section A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuiz