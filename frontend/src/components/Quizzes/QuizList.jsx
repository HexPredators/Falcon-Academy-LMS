import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Calendar, Clock, Award, Users, ChevronDown, Plus, Download, Eye, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '../../Common/Button'
import QuizCard from './QuizCard'

const QuizList = ({ userRole }) => {
  const { t } = useTranslation()
  const [quizzes, setQuizzes] = useState([])
  const [filteredQuizzes, setFilteredQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    grade: 'all',
    section: 'all'
  })

  const statusOptions = [
    { value: 'all', label: t('quizzes.allStatus'), color: 'gray' },
    { value: 'upcoming', label: t('quizzes.upcoming'), color: 'blue' },
    { value: 'active', label: t('quizzes.active'), color: 'green' },
    { value: 'completed', label: t('quizzes.completed'), color: 'purple' },
    { value: 'expired', label: t('quizzes.expired'), color: 'red' }
  ]

  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography', 'Civics', 'ICT']
  const gradeOptions = ['9', '10', '11', '12']
  const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  useEffect(() => {
    loadQuizzes()
  }, [])

  useEffect(() => {
    filterQuizzes()
  }, [quizzes, searchQuery, filters])

  const loadQuizzes = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockQuizzes = [
        {
          id: 1,
          title: 'Algebra Basics Quiz',
          description: 'Test your understanding of algebraic expressions',
          subject: 'Mathematics',
          grade: '10',
          section: 'A',
          teacher: 'Mr. Alemayehu',
          duration: 30,
          questions: 20,
          totalPoints: 100,
          status: 'upcoming',
          startDate: '2024-02-25',
          startTime: '10:00',
          endDate: '2024-02-25',
          endTime: '10:30',
          participants: 25,
          averageScore: null,
          createdAt: '2024-02-20',
          tags: ['Algebra', 'Basics']
        },
        {
          id: 2,
          title: 'Physics Motion Quiz',
          description: 'Newton\'s Laws and motion concepts',
          subject: 'Physics',
          grade: '11',
          section: 'B',
          teacher: 'Mrs. Selam',
          duration: 45,
          questions: 25,
          totalPoints: 100,
          status: 'active',
          startDate: '2024-02-22',
          startTime: '14:00',
          endDate: '2024-02-22',
          endTime: '14:45',
          participants: 28,
          averageScore: 78.5,
          createdAt: '2024-02-18',
          tags: ['Motion', 'Newton']
        },
        {
          id: 3,
          title: 'Chemistry Periodic Table',
          description: 'Elements and periodic trends',
          subject: 'Chemistry',
          grade: '12',
          section: 'C',
          teacher: 'Dr. Bekele',
          duration: 60,
          questions: 30,
          totalPoints: 150,
          status: 'completed',
          startDate: '2024-02-20',
          startTime: '09:00',
          endDate: '2024-02-20',
          endTime: '10:00',
          participants: 30,
          averageScore: 85.2,
          createdAt: '2024-02-15',
          tags: ['Periodic Table', 'Elements']
        },
        {
          id: 4,
          title: 'English Grammar Quiz',
          description: 'Tenses and sentence structure',
          subject: 'English',
          grade: '9',
          section: 'D',
          teacher: 'Ms. Tigist',
          duration: 20,
          questions: 15,
          totalPoints: 75,
          status: 'expired',
          startDate: '2024-02-18',
          startTime: '11:00',
          endDate: '2024-02-18',
          endTime: '11:20',
          participants: 22,
          averageScore: 72.3,
          createdAt: '2024-02-12',
          tags: ['Grammar', 'Tenses']
        }
      ]
      setQuizzes(mockQuizzes)
      setLoading(false)
    }, 1000)
  }

  const filterQuizzes = () => {
    let filtered = [...quizzes]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(quiz => quiz.status === filters.status)
    }

    // Subject filter
    if (filters.subject !== 'all') {
      filtered = filtered.filter(quiz => quiz.subject === filters.subject)
    }

    // Grade filter
    if (filters.grade !== 'all') {
      filtered = filtered.filter(quiz => quiz.grade === filters.grade)
    }

    // Section filter
    if (filters.section !== 'all') {
      filtered = filtered.filter(quiz => quiz.section === filters.section)
    }

    setFilteredQuizzes(filtered)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const exportQuizzes = () => {
    const csvContent = [
      ['Title', 'Subject', 'Grade', 'Section', 'Status', 'Duration', 'Questions', 'Points'],
      ...filteredQuizzes.map(q => [
        q.title,
        q.subject,
        q.grade,
        q.section,
        q.status,
        `${q.duration} min`,
        q.questions,
        q.totalPoints
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quizzes-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const deleteQuiz = async (id) => {
    if (window.confirm(t('quizzes.confirmDelete'))) {
      setQuizzes(prev => prev.filter(q => q.id !== id))
    }
  }

  const getStats = () => {
    const total = quizzes.length
    const upcoming = quizzes.filter(q => q.status === 'upcoming').length
    const active = quizzes.filter(q => q.status === 'active').length
    const completed = quizzes.filter(q => q.status === 'completed').length
    const expired = quizzes.filter(q => q.status === 'expired').length

    return { total, upcoming, active, completed, expired }
  }

  const stats = getStats()

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('quizzes.quizzes')}</h1>
            <p className="text-gray-600">{t('quizzes.manageQuizzes')}</p>
          </div>
          <div className="flex gap-3">
            {userRole === 'teacher' && (
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                <Plus className="w-5 h-5 mr-2" />
                {t('quizzes.createQuiz')}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={exportQuizzes}
              className="px-6"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('quizzes.export')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.total')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Award className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.upcoming')}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.active')}</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.completed')}</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.expired')}</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quizzes.searchQuizzes')}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('quizzes.searchPlaceholder')}
                className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quizzes.filterByStatus')}
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('status', option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.status === option.value
                      ? `bg-${option.color}-600 text-white`
                      : `bg-${option.color}-100 text-${option.color}-700 hover:bg-${option.color}-200`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quizzes.subject')}
            </label>
            <div className="relative">
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">{t('quizzes.allSubjects')}</option>
                {subjectOptions.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quizzes.grade')}
            </label>
            <div className="relative">
              <select
                value={filters.grade}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">{t('quizzes.allGrades')}</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{t('quizzes.grade')} {grade}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quizzes.section')}
            </label>
            <div className="relative">
              <select
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">{t('quizzes.allSections')}</option>
                {sectionOptions.map(section => (
                  <option key={section} value={section}>{t('quizzes.section')} {section}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.status !== 'all' || filters.subject !== 'all' || filters.grade !== 'all' || filters.section !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setFilters({
                status: 'all',
                subject: 'all',
                grade: 'all',
                section: 'all'
              })}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {t('quizzes.clearFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Quizzes List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {t('quizzes.quizzesList')} ({filteredQuizzes.length})
              </h3>
              <p className="text-sm text-gray-600">
                {searchQuery ? t('quizzes.searchResults') : t('quizzes.allQuizzes')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {t('quizzes.sortedBy')}: {t('quizzes.startDate')}
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600"></div>
            <p className="mt-4 text-gray-600">{t('quizzes.loading')}</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('quizzes.noQuizzes')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? t('quizzes.noSearchResults') : t('quizzes.noQuizzesDesc')}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
              >
                {t('quizzes.clearSearch')}
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="p-6 hover:bg-gray-50 transition-colors">
                <QuizCard
                  quiz={quiz}
                  userRole={userRole}
                  onDelete={deleteQuiz}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredQuizzes.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('quizzes.showing')} 1-{filteredQuizzes.length} {t('quizzes.of')} {quizzes.length}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
                  {t('quizzes.previous')}
                </button>
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  1
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  {t('quizzes.next')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizList