import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, BookOpen, Video, FileText, HelpCircle, ChevronRight, Play, Download, Star, Clock, Users, Target, Award } from 'lucide-react'
import Button from '../../Common/Button'

const LearningSupport = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('concepts')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState(null)

  const subjects = [
    { id: 'all', name: t('ai.allSubjects'), color: 'gray' },
    { id: 'mathematics', name: 'Mathematics', color: 'blue' },
    { id: 'physics', name: 'Physics', color: 'purple' },
    { id: 'chemistry', name: 'Chemistry', color: 'green' },
    { id: 'biology', name: 'Biology', color: 'teal' },
    { id: 'english', name: 'English', color: 'red' },
    { id: 'amharic', name: 'Amharic', color: 'orange' }
  ]

  const concepts = [
    { id: 1, title: 'Quadratic Equations', subject: 'mathematics', grade: '10', difficulty: 'medium', time: '15 min', rating: 4.5 },
    { id: 2, title: 'Newton\'s Laws of Motion', subject: 'physics', grade: '11', difficulty: 'hard', time: '25 min', rating: 4.7 },
    { id: 3, title: 'Chemical Bonding', subject: 'chemistry', grade: '12', difficulty: 'medium', time: '20 min', rating: 4.3 },
    { id: 4, title: 'Photosynthesis', subject: 'biology', grade: '9', difficulty: 'easy', time: '12 min', rating: 4.8 },
    { id: 5, title: 'Grammar Rules', subject: 'english', grade: '10', difficulty: 'easy', time: '10 min', rating: 4.2 },
    { id: 6, title: 'Algebra Basics', subject: 'mathematics', grade: '9', difficulty: 'easy', time: '18 min', rating: 4.6 }
  ]

  const resources = [
    { id: 1, type: 'video', title: 'Introduction to Calculus', subject: 'mathematics', duration: '25:30', views: '1.2K' },
    { id: 2, type: 'pdf', title: 'Physics Formulas Handbook', subject: 'physics', pages: '45', downloads: '850' },
    { id: 3, type: 'interactive', title: 'Chemistry Lab Simulation', subject: 'chemistry', duration: 'Interactive', users: '2.3K' },
    { id: 4, type: 'quiz', title: 'Biology Practice Test', subject: 'biology', questions: '20', attempts: '3.1K' }
  ]

  const practiceQuestions = [
    { id: 1, question: 'Solve: 2x² - 5x + 3 = 0', subject: 'mathematics', type: 'multiple-choice', difficulty: 'medium' },
    { id: 2, question: 'Define Newton\'s First Law', subject: 'physics', type: 'short-answer', difficulty: 'easy' },
    { id: 3, question: 'Balance the chemical equation: H₂ + O₂ → H₂O', subject: 'chemistry', type: 'fill-blank', difficulty: 'medium' },
    { id: 4, question: 'Explain photosynthesis process', subject: 'biology', type: 'essay', difficulty: 'hard' }
  ]

  const explainConcept = async (concept) => {
    setLoading(true)
    setSearchQuery(concept.title)
    
    // Simulate AI explanation
    setTimeout(() => {
      setExplanation({
        concept: concept.title,
        subject: concept.subject,
        explanation: t('ai.sampleExplanation', { concept: concept.title }),
        keyPoints: [
          t('ai.keyPoint1'),
          t('ai.keyPoint2'),
          t('ai.keyPoint3'),
          t('ai.keyPoint4')
        ],
        examples: [
          t('ai.example1'),
          t('ai.example2')
        ],
        relatedConcepts: ['Related Concept 1', 'Related Concept 2', 'Related Concept 3']
      })
      setLoading(false)
    }, 1500)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const foundConcept = concepts.find(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (foundConcept) {
        explainConcept(foundConcept)
      }
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'green'
      case 'medium': return 'yellow'
      case 'hard': return 'red'
      default: return 'gray'
    }
  }

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <Play className="w-5 h-5" />
      case 'pdf': return <FileText className="w-5 h-5" />
      case 'interactive': return <Users className="w-5 h-5" />
      case 'quiz': return <HelpCircle className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('ai.learningSupport')}</h1>
            <p className="text-gray-600">{t('ai.learningSupportSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
              {t('ai.askLearningQuestion')}
            </h2>
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ai.searchPlaceholder')}
                className="w-full pl-14 pr-32 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                type="submit"
                loading={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
              >
                {t('ai.explain')}
              </Button>
            </form>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['Algebra', 'Physics Laws', 'Chemistry Basics', 'Grammar Rules'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSearchQuery(topic)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Subjects & Concepts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Filter */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ai.browseBySubject')}</h3>
            <div className="flex flex-wrap gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedSubject === subject.id
                      ? `bg-${subject.color}-600 text-white`
                      : `bg-${subject.color}-100 text-${subject.color}-700 hover:bg-${subject.color}-200`
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                {['concepts', 'resources', 'practice'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {t(`ai.${tab}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Concepts Tab */}
              {activeTab === 'concepts' && (
                <div className="space-y-4">
                  {concepts
                    .filter(c => selectedSubject === 'all' || c.subject === selectedSubject)
                    .map((concept) => (
                      <div
                        key={concept.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => explainConcept(concept)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${getDifficultyColor(concept.difficulty)}-100`}>
                              <BookOpen className={`w-6 h-6 text-${getDifficultyColor(concept.difficulty)}-600`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{concept.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getDifficultyColor(concept.difficulty)}-100 text-${getDifficultyColor(concept.difficulty)}-700`}>
                                  {t(`ai.${concept.difficulty}`)}
                                </span>
                                <span className="text-sm text-gray-600">Grade {concept.grade}</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {concept.time}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  {concept.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Resources Tab */}
              {activeTab === 'resources' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                            <p className="text-sm text-gray-600">{resource.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            {resource.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {resource.duration}
                              </span>
                            )}
                            {resource.pages && (
                              <span>{resource.pages} pages</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{resource.views || resource.downloads || resource.users}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <button className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                          <Download className="w-4 h-4" />
                          {resource.type === 'video' ? t('ai.watch') : t('ai.download')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Practice Tab */}
              {activeTab === 'practice' && (
                <div className="space-y-4">
                  {practiceQuestions.map((q) => (
                    <div key={q.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getDifficultyColor(q.difficulty)}-100 text-${getDifficultyColor(q.difficulty)}-700`}>
                              {t(`ai.${q.difficulty}`)}
                            </span>
                            <span className="text-sm text-gray-600">{q.subject}</span>
                            <span className="text-sm text-gray-600">• {t(`ai.${q.type}`)}</span>
                          </div>
                          <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                          <Button
                            variant="outline"
                            className="px-4 py-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                          >
                            {t('ai.viewSolution')}
                          </Button>
                        </div>
                        <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg">
                          <Star className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Explanation & Stats */}
        <div className="space-y-6">
          {/* Explanation Panel */}
          {explanation ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{t('ai.explanation')}</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Star className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">{explanation.concept}</h4>
                  <p className="text-purple-700">{explanation.subject}</p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.understanding')}</h5>
                  <p className="text-gray-700 leading-relaxed">{explanation.explanation}</p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.keyPoints')}</h5>
                  <ul className="space-y-2">
                    {explanation.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Target className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.examples')}</h5>
                  <div className="space-y-3">
                    {explanation.examples.map((example, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.relatedConcepts')}</h5>
                  <div className="flex flex-wrap gap-2">
                    {explanation.relatedConcepts.map((concept, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        onClick={() => setSearchQuery(concept)}
                      >
                        {concept}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('ai.getStarted')}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('ai.searchOrSelect')}
                </p>
                <Button
                  onClick={() => setSearchQuery('Mathematics Basics')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {t('ai.tryExample')}
                </Button>
              </div>
            </div>
          )}

          {/* Learning Progress */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ai.learningProgress')}</h3>
            <div className="space-y-4">
              {['Mathematics', 'Physics', 'Chemistry', 'English'].map((subject) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{subject}</span>
                    <span className="text-gray-600">65%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.random() * 60 + 40}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ai.quickActions')}</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-left transition-colors flex items-center gap-3">
                <Video className="w-5 h-5" />
                <div>
                  <p className="font-medium">{t('ai.watchTutorial')}</p>
                  <p className="text-sm opacity-75">5 new videos added</p>
                </div>
              </button>
              <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left transition-colors flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="font-medium">{t('ai.downloadNotes')}</p>
                  <p className="text-sm opacity-75">Subject-wise PDFs</p>
                </div>
              </button>
              <button className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-left transition-colors flex items-center gap-3">
                <HelpCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">{t('ai.takeQuiz')}</p>
                  <p className="text-sm opacity-75">Test your knowledge</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningSupport