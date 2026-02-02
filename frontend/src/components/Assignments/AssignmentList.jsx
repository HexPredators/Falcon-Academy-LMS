import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Calendar, Clock, FileText, ChevronDown, Plus, Download, Eye, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '../../Common/Button'
import AssignmentCard from './AssignmentCard'

const AssignmentList = ({ userRole }) => {
  const { t } = useTranslation()
  const [assignments, setAssignments] = useState([])
  const [filteredAssignments, setFilteredAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    grade: 'all',
    section: 'all'
  })

  const statusOptions = [
    { value: 'all', label: t('assignments.allStatus'), color: 'gray' },
    { value: 'pending', label: t('assignments.pending'), color: 'yellow' },
    { value: 'submitted', label: t('assignments.submitted'), color: 'blue' },
    { value: 'graded', label: t('assignments.graded'), color: 'green' },
    { value: 'overdue', label: t('assignments.overdue'), color: 'red' }
  ]

  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography']
  const gradeOptions = ['9', '10', '11', '12']
  const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  useEffect(() => {
    loadAssignments()
  }, [])

  useEffect(() => {
    filterAssignments()
  }, [assignments, searchQuery, filters])

  const loadAssignments = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockAssignments = [
        {
          id: 1,
          title: 'Algebra Homework',
          description: 'Solve quadratic equations and show your work',
          subject: 'Mathematics',
          grade: '10',
          section: 'A',
          teacher: 'Mr. Alemayehu',
          dueDate: '2024-02-20',
          dueTime: '23:59',
          points: 20,
          status: 'pending',
          submissions: 25,
          totalStudents: 30,
          createdAt: '2024-02-15',
          attachment: 'algebra_homework.pdf',
          instructions: 'Complete all problems. Show step-by-step solutions.'
        },
        {
          id: 2,
          title: 'Physics Lab Report',
          description: 'Experiment on Newton\'s Laws of Motion',
          subject: 'Physics',
          grade: '11',
          section: 'B',
          teacher: 'Mrs. Selam',
          dueDate: '2024-02-18',
          dueTime: '17:00',
          points: 30,
          status: 'submitted',
          submissions: 28,
          totalStudents: 28,
          createdAt: '2024-02-10',
          attachment: 'physics_lab.pdf',
          instructions: 'Include data tables and analysis'
        },
        {
          id: 3,
          title: 'Chemistry Assignment',
          description: 'Chemical bonding exercises',
          subject: 'Chemistry',
          grade: '12',
          section: 'C',
          teacher: 'Dr. Bekele',
          dueDate: '2024-02-25',
          dueTime: '14:00',
          points: 25,
          status: 'graded',
          submissions: 30,
          totalStudents: 30,
          createdAt: '2024-02-12',
          attachment: 'chemistry_bonding.pdf',
          instructions: 'Complete all questions with diagrams'
        },
        {
          id: 4,
          title: 'English Essay',
          description: 'Write about Ethiopian Culture',
          subject: 'English',
          grade: '9',
          section: 'D',
          teacher: 'Ms. Tigist',
          dueDate: '2024-02-16',
          dueTime: '23:59',
          points: 15,
          status: 'overdue',
          submissions: 22,
          totalStudents: 30,
          createdAt: '2024-02-05',
          attachment: 'essay_topics.pdf',
          instructions: '500-700 words, double spaced'
        }
      ]
      setAssignments(mockAssignments)
      setLoading(false)
    }, 1000)
  }

  const filterAssignments = () => {
    let filtered = [...assignments]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === filters.status)
    }

    // Subject filter
    if (filters.subject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === filters.subject)
    }

    // Grade filter
    if (filters.grade !== 'all') {
      filtered = filtered.filter(assignment => assignment.grade === filters.grade)
    }

    // Section filter
    if (filters.section !== 'all') {
      filtered = filtered.filter(assignment => assignment.section === filters.section)
    }

    setFilteredAssignments(filtered)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const exportAssignments = () => {
    const csvContent = [
      ['Title', 'Subject', 'Grade', 'Section', 'Status', 'Due Date', 'Points'],
      ...filteredAssignments.map(a => [
        a.title,
        a.subject,
        a.grade,
        a.section,
        a.status,
        a.dueDate,
        a.points
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assignments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const deleteAssignment = async (id) => {
    if (window.confirm(t('assignments.confirmDelete'))) {
      setAssignments(prev => prev.filter(a => a.id !== id))
    }
  }

  const getStats = () => {
    const total = assignments.length
    const pending = assignments.filter(a => a.status === 'pending').length
    const submitted = assignments.filter(a => a.status === 'submitted').length
    const graded = assignments.filter(a => a.status === 'graded').length
    const overdue = assignments.filter(a => a.status === 'overdue').length

    return { total, pending, submitted, graded, overdue }
  }

  const stats = getStats()

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('assignments.assignments')}</h1>
            <p className="text-gray-600">{t('assignments.manageAssignments')}</p>
          </div>
          <div className="flex gap-3">
            {userRole === 'teacher' && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                <Plus className="w-5 h-5 mr-2" />
                {t('assignments.createAssignment')}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={exportAssignments}
              className="px-6"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('assignments.export')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.total')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.pending')}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.submitted')}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.graded')}</p>
                <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.overdue')}</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
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
              {t('assignments.searchAssignments')}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('assignments.searchPlaceholder')}
                className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignments.filterByStatus')}
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
              {t('assignments.subject')}
            </label>
            <div className="relative">
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">{t('assignments.allSubjects')}</option>
                {subjectOptions.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignments.grade')}
            </label>
            <div className="relative">
              <select
                value={filters.grade}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">{t('assignments.allGrades')}</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{t('assignments.grade')} {grade}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignments.section')}
            </label>
            <div className="relative">
              <select
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">{t('assignments.allSections')}</option>
                {sectionOptions.map(section => (
                  <option key={section} value={section}>{t('assignments.section')} {section}</option>
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
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {t('assignments.clearFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {t('assignments.assignmentsList')} ({filteredAssignments.length})
              </h3>
              <p className="text-sm text-gray-600">
                {searchQuery ? t('assignments.searchResults') : t('assignments.allAssignments')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {t('assignments.sortedBy')}: {t('assignments.dueDate')}
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">{t('assignments.loading')}</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('assignments.noAssignments')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? t('assignments.noSearchResults') : t('assignments.noAssignmentsDesc')}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
              >
                {t('assignments.clearSearch')}
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <AssignmentCard
                  assignment={assignment}
                  userRole={userRole}
                  onDelete={deleteAssignment}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredAssignments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('assignments.showing')} 1-{filteredAssignments.length} {t('assignments.of')} {assignments.length}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
                  {t('assignments.previous')}
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  {t('assignments.next')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentList