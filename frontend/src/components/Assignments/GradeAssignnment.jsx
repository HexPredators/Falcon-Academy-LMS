import React, { useState, useEffect } from 'react'
import { useTranslation } from 'reacti18next'
import { Search, Filter, User, FileText, Award, CheckCircle, X, Download, Send, ChevronDown, Star, MessageSquare, Clock } from 'lucide-react'
import Button from '../../Common/Button'

const GradeAssignment = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    grade: 'all'
  })
  const [grading, setGrading] = useState({})
  const [bulkAction, setBulkAction] = useState('')

  useEffect(() => {
    loadSubmissions()
  }, [])

  useEffect(() => {
    filterSubmissions()
  }, [submissions, searchQuery, filters])

  const loadSubmissions = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockSubmissions = [
        {
          id: 1,
          studentId: 'S2023001',
          studentName: 'ደመሰሰ ታደሰ',
          grade: '10',
          section: 'A',
          submittedAt: '2024-02-18 14:30:00',
          files: ['solution.pdf'],
          text: 'I have solved all problems as requested.',
          status: 'submitted', // submitted, graded, returned
          score: null,
          maxScore: 20,
          teacherComment: '',
          studentComment: '',
          plagiarismScore: 2,
          lateSubmission: false
        },
        {
          id: 2,
          studentId: 'S2023002',
          studentName: 'ሙሉጌታ አባይ',
          grade: '10',
          section: 'A',
          submittedAt: '2024-02-18 16:45:00',
          files: ['assignment.pdf', 'calculations.xlsx'],
          text: 'Attached my work. Please review.',
          status: 'submitted',
          score: null,
          maxScore: 20,
          teacherComment: '',
          studentComment: '',
          plagiarismScore: 5,
          lateSubmission: false
        },
        {
          id: 3,
          studentId: 'S2023003',
          studentName: 'ትንሳኤ መኮንን',
          grade: '10',
          section: 'A',
          submittedAt: '2024-02-17 22:15:00',
          files: ['math_homework.pdf'],
          text: '',
          status: 'graded',
          score: 18,
          maxScore: 20,
          teacherComment: 'Good work! Minor calculation errors.',
          studentComment: 'Thank you!',
          plagiarismScore: 1,
          lateSubmission: false
        },
        {
          id: 4,
          studentId: 'S2023004',
          studentName: 'ሰላም አለማየሁ',
          grade: '10',
          section: 'A',
          submittedAt: '2024-02-19 09:15:00',
          files: ['submission.pdf'],
          text: 'Submitted after deadline due to technical issues.',
          status: 'submitted',
          score: null,
          maxScore: 20,
          teacherComment: '',
          studentComment: '',
          plagiarismScore: 8,
          lateSubmission: true
        }
      ]
      setSubmissions(mockSubmissions)
      setLoading(false)
    }, 1500)
  }

  const filterSubmissions = () => {
    let filtered = [...submissions]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(submission =>
        submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(submission => submission.status === filters.status)
    }

    // Grade filter
    if (filters.grade !== 'all') {
      filtered = filtered.filter(submission => submission.grade === filters.grade)
    }

    setFilteredSubmissions(filtered)
  }

  const handleGradeChange = (submissionId, value) => {
    setGrading(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        score: Math.min(Math.max(parseInt(value) || 0, 0), submissions.find(s => s.id === submissionId)?.maxScore || 100)
      }
    }))
  }

  const handleCommentChange = (submissionId, comment) => {
    setGrading(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        comment
      }
    }))
  }

  const submitGrade = async (submissionId) => {
    const gradeData = grading[submissionId]
    if (!gradeData?.score && gradeData?.score !== 0) {
      alert(t('assignments.enterScore'))
      return
    }

    // Update submission
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: 'graded', 
            score: gradeData.score,
            teacherComment: gradeData.comment || ''
          }
        : sub
    ))

    // Clear grading state
    setGrading(prev => {
      const newGrading = { ...prev }
      delete newGrading[submissionId]
      return newGrading
    })

    alert(t('assignments.gradeSubmitted'))
  }

  const bulkGrade = () => {
    if (!bulkAction) return

    const selectedIds = filteredSubmissions
      .filter(sub => sub.status === 'submitted')
      .map(sub => sub.id)

    if (selectedIds.length === 0) {
      alert(t('assignments.noSubmissionsToGrade'))
      return
    }

    if (bulkAction === 'return') {
      if (confirm(t('assignments.confirmReturnMultiple', { count: selectedIds.length }))) {
        setSubmissions(prev => prev.map(sub => 
          selectedIds.includes(sub.id) 
            ? { ...sub, status: 'returned' }
            : sub
        ))
      }
    }
  }

  const downloadSubmissions = () => {
    const csvContent = [
      ['Student ID', 'Name', 'Grade', 'Section', 'Score', 'Max Score', 'Status', 'Submitted At'],
      ...filteredSubmissions.map(s => [
        s.studentId,
        s.studentName,
        s.grade,
        s.section,
        s.score || '',
        s.maxScore,
        s.status,
        s.submittedAt
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const viewSubmission = (submission) => {
    setSelectedSubmission(submission)
  }

  const closeViewer = () => {
    setSelectedSubmission(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'blue'
      case 'graded': return 'green'
      case 'returned': return 'yellow'
      default: return 'gray'
    }
  }

  const getPlagiarismColor = (score) => {
    if (score < 5) return 'green'
    if (score < 15) return 'yellow'
    return 'red'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('assignments.gradeAssignments')}</h1>
            <p className="text-gray-600">{t('assignments.gradeAssignmentsDesc')}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={downloadSubmissions}
              variant="outline"
              className="px-6"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('assignments.export')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.totalSubmissions')}</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.toGrade')}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {submissions.filter(s => s.status === 'submitted').length}
                </p>
              </div>
              <Award className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.graded')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.status === 'graded').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.lateSubmissions')}</p>
                <p className="text-2xl font-bold text-red-600">
                  {submissions.filter(s => s.lateSubmission).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignments.searchStudents')}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignments.filterByStatus')}
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">{t('assignments.allStatus')}</option>
                <option value="submitted">{t('assignments.toGrade')}</option>
                <option value="graded">{t('assignments.graded')}</option>
                <option value="returned">{t('assignments.returned')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('assignments.bulkActions')}
            </label>
            <div className="flex gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('assignments.selectAction')}</option>
                <option value="return">{t('assignments.returnForRevision')}</option>
                <option value="download">{t('assignments.downloadAll')}</option>
              </select>
              <Button
                onClick={bulkGrade}
                disabled={!bulkAction}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {t('assignments.apply')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {t('assignments.submissions')} ({filteredSubmissions.length})
            </h3>
            <div className="text-sm text-gray-600">
              {t('assignments.sortedBy')}: {t('assignments.submissionDate')}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">{t('assignments.loadingSubmissions')}</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('assignments.noSubmissions')}
            </h3>
            <p className="text-gray-600">
              {searchQuery ? t('assignments.noSearchResults') : t('assignments.allGraded')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Student Info */}
                  <div className="md:w-1/3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{submission.studentName}</h4>
                        <p className="text-sm text-gray-600">ID: {submission.studentId}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {t('assignments.grade')} {submission.grade} - {t('assignments.section')} {submission.section}
                          </span>
                          {submission.lateSubmission && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                              {t('assignments.late')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submission Info */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('assignments.submitted')}</span>
                        <span className="font-medium">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('assignments.plagiarism')}</span>
                        <span className={`font-medium text-${getPlagiarismColor(submission.plagiarismScore)}-600`}>
                          {submission.plagiarismScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('assignments.files')}</span>
                        <span className="font-medium">{submission.files.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Grading Area */}
                  <div className="md:w-2/3">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Submission Preview */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">{t('assignments.submission')}</h5>
                          {submission.text && (
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-2">
                              {submission.text}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {submission.files.map((file, idx) => (
                              <button
                                key={idx}
                                onClick={() => viewSubmission(submission)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                {file}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Teacher Comment (if graded) */}
                        {submission.status === 'graded' && submission.teacherComment && (
                          <div className="mb-4 p-3 bg-green-50 rounded-lg">
                            <h6 className="font-medium text-green-900 mb-1">{t('assignments.yourFeedback')}</h6>
                            <p className="text-sm text-green-700">{submission.teacherComment}</p>
                          </div>
                        )}

                        {/* Student Comment (if any) */}
                        {submission.studentComment && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h6 className="font-medium text-blue-900 mb-1">{t('assignments.studentComment')}</h6>
                            <p className="text-sm text-blue-700">{submission.studentComment}</p>
                          </div>
                        )}
                      </div>

                      {/* Grading Controls */}
                      <div className="md:w-48">
                        <div className="space-y-4">
                          {/* Status Badge */}
                          <div className={`px-3 py-1.5 rounded-lg text-center font-medium bg-${getStatusColor(submission.status)}-100 text-${getStatusColor(submission.status)}-700`}>
                            {t(`assignments.${submission.status}`)}
                          </div>

                          {/* Score Display/Input */}
                          {submission.status === 'graded' ? (
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900">
                                {submission.score}/{submission.maxScore}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {t('assignments.gradedOn')} {new Date().toLocaleDateString()}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('assignments.score')}
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={grading[submission.id]?.score || ''}
                                  onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                                  min="0"
                                  max={submission.maxScore}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="0"
                                />
                                <span className="text-gray-600">/ {submission.maxScore}</span>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            {submission.status !== 'graded' ? (
                              <>
                                <Button
                                  onClick={() => viewSubmission(submission)}
                                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  {t('assignments.review')}
                                </Button>
                                
                                <Button
                                  onClick={() => submitGrade(submission.id)}
                                  disabled={!grading[submission.id]?.score && grading[submission.id]?.score !== 0}
                                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {t('assignments.submitGrade')}
                                </Button>
                                
                                <button
                                  onClick={() => handleCommentChange(submission.id, 
                                    grading[submission.id]?.comment || '')}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  {t('assignments.addComment')}
                                </button>
                              </>
                            ) : (
                              <Button
                                onClick={() => viewSubmission(submission)}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {t('assignments.viewDetails')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comment Input */}
                    {grading[submission.id]?.comment !== undefined && (
                      <div className="mt-4">
                        <textarea
                          value={grading[submission.id]?.comment || ''}
                          onChange={(e) => handleCommentChange(submission.id, e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={t('assignments.addFeedback')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredSubmissions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('assignments.showing')} 1-{filteredSubmissions.length} {t('assignments.of')} {submissions.length}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
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

      {/* Submission Viewer Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedSubmission.studentName}'s {t('assignments.submission')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('assignments.submittedOn')} {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={closeViewer}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Student Text */}
                {selectedSubmission.text && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('assignments.studentResponse')}</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedSubmission.text}</p>
                    </div>
                  </div>
                )}

                {/* Files */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t('assignments.attachedFiles')}</h4>
                  <div className="space-y-3">
                    {selectedSubmission.files.map((file, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-gray-400" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{file}</p>
                            <p className="text-sm text-gray-600">PDF Document</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                              {t('assignments.view')}
                            </button>
                            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                              {t('assignments.download')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plagiarism Check */}
                <div className={`p-4 rounded-lg ${
                  selectedSubmission.plagiarismScore < 5 ? 'bg-green-50' :
                  selectedSubmission.plagiarismScore < 15 ? 'bg-yellow-50' :
                  'bg-red-50'
                }`}>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('assignments.plagiarismCheck')}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-lg font-bold ${
                        selectedSubmission.plagiarismScore < 5 ? 'text-green-700' :
                        selectedSubmission.plagiarismScore < 15 ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {selectedSubmission.plagiarismScore}% {t('assignments.similarity')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedSubmission.plagiarismScore < 5 
                          ? t('assignments.lowSimilarity')
                          : selectedSubmission.plagiarismScore < 15
                          ? t('assignments.moderateSimilarity')
                          : t('assignments.highSimilarity')}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
                      {t('assignments.viewReport')}
                    </button>
                  </div>
                </div>

                {/* Grading History */}
                {selectedSubmission.status === 'graded' && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('assignments.gradingHistory')}</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{t('assignments.finalGrade')}</span>
                          <span className="text-2xl font-bold text-gray-900">
                            {selectedSubmission.score}/{selectedSubmission.maxScore}
                          </span>
                        </div>
                        {selectedSubmission.teacherComment && (
                          <p className="text-gray-700">{selectedSubmission.teacherComment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <Button
                  onClick={closeViewer}
                  variant="outline"
                  className="px-6"
                >
                  {t('assignments.close')}
                </Button>
                {selectedSubmission.status !== 'graded' && (
                  <Button
                    onClick={() => {
                      submitGrade(selectedSubmission.id)
                      closeViewer()
                    }}
                    className="px-6 bg-green-600 hover:bg-green-700"
                  >
                    {t('assignments.submitGrade')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GradeAssignment