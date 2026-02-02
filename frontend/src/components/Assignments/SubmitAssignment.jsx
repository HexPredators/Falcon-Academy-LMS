import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, FileText, Calendar, Clock, AlertCircle, CheckCircle, X, Download, Eye } from 'lucide-react'
import Button from '../../Common/Button'

const SubmitAssignment = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [files, setFiles] = useState([])
  const [assignment, setAssignment] = useState(null)
  const [submissionText, setSubmissionText] = useState('')
  const [draftSaved, setDraftSaved] = useState(false)

  useEffect(() => {
    loadAssignment()
  }, [])

  useEffect(() => {
    const saveDraft = () => {
      const draft = {
        assignmentId: assignment?.id,
        files,
        text: submissionText,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem('assignment_draft_' + assignment?.id, JSON.stringify(draft))
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 3000)
    }

    const timer = setTimeout(saveDraft, 2000)
    return () => clearTimeout(timer)
  }, [files, submissionText, assignment])

  const loadAssignment = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setAssignment({
        id: 1,
        title: 'Algebra Homework',
        description: 'Solve quadratic equations and show your work',
        subject: 'Mathematics',
        teacher: 'Mr. Alemayehu',
        dueDate: '2024-02-20',
        dueTime: '23:59',
        points: 20,
        instructions: 'Complete all problems. Show step-by-step solutions.',
        attachment: 'algebra_homework.pdf',
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'doc', 'docx'],
        allowLateSubmission: false
      })
      setLoading(false)
    }, 1000)
  }

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files)
    const validFiles = uploadedFiles.filter(file => {
      const fileType = file.name.split('.').pop().toLowerCase()
      const maxSize = assignment?.maxFileSize * 1024 * 1024 || 10 * 1024 * 1024
      
      if (file.size > maxSize) {
        alert(`${t('assignments.fileTooLarge')} ${(maxSize / (1024 * 1024)).toFixed(0)}MB`)
        return false
      }
      
      if (assignment?.allowedFileTypes && !assignment.allowedFileTypes.includes(fileType)) {
        alert(`${t('assignments.invalidFileType')} ${assignment.allowedFileTypes.join(', ')}`)
        return false
      }
      
      return true
    })

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.name.split('.').pop().toLowerCase(),
      file: file
    }))

    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const downloadAttachment = () => {
    // Simulate download
    alert(`${t('assignments.downloading')} ${assignment.attachment}`)
  }

  const viewAttachment = () => {
    window.open(`/files/${assignment.attachment}`, '_blank')
  }

  const getTimeRemaining = () => {
    if (!assignment) return ''
    
    const dueDate = new Date(`${assignment.dueDate}T${assignment.dueTime}`)
    const now = new Date()
    const diff = dueDate - now
    
    if (diff < 0) {
      return {
        status: 'overdue',
        message: t('assignments.overdueBy'),
        time: `${Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)))} ${t('assignments.days')}`
      }
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) {
      return {
        status: 'pending',
        message: t('assignments.dueIn'),
        time: `${days} ${t('assignments.days')}`
      }
    }
    
    return {
      status: 'urgent',
      message: t('assignments.dueIn'),
      time: `${hours} ${t('assignments.hours')}`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (files.length === 0 && !submissionText.trim()) {
      alert(t('assignments.uploadOrText'))
      return
    }

    setSubmitting(true)

    const submissionData = {
      assignmentId: assignment.id,
      files: files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      })),
      text: submissionText,
      submittedAt: new Date().toISOString(),
      ipAddress: '127.0.0.1' // In real app, get from server
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Submission:', submissionData)
      setSubmitting(false)
      alert(t('assignments.submittedSuccess'))
      // Clear draft
      localStorage.removeItem('assignment_draft_' + assignment.id)
      // Redirect to assignments list
      window.location.href = '/assignments'
    }, 2000)
  }

  const timeRemaining = getTimeRemaining()

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('assignments.loadingAssignment')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('assignments.submitAssignment')}</h1>
        <p className="text-gray-600">{t('assignments.submitAssignmentDesc')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Assignment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{assignment?.title}</h2>
                <p className="text-gray-600 mt-1">{assignment?.description}</p>
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${
                timeRemaining?.status === 'overdue' 
                  ? 'bg-red-50 text-red-700' 
                  : timeRemaining?.status === 'urgent'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                <div className="flex items-center gap-2">
                  {timeRemaining?.status === 'overdue' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {timeRemaining?.message} {timeRemaining?.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.subject')}</p>
                <p className="font-medium text-gray-900">{assignment?.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('assignments.teacher')}</p>
                <p className="font-medium text-gray-900">{assignment?.teacher}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('assignments.dueDate')}</p>
                <p className="font-medium text-gray-900">
                  {assignment?.dueDate} {assignment?.dueTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('assignments.points')}</p>
                <p className="font-medium text-gray-900">{assignment?.points}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t('assignments.instructions')}</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{assignment?.instructions}</p>
              </div>
            </div>

            {/* Attachments */}
            {assignment?.attachment && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t('assignments.assignmentFiles')}</h3>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{assignment.attachment}</p>
                    <p className="text-sm text-gray-600">{t('assignments.providedByTeacher')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={viewAttachment}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {t('assignments.view')}
                    </button>
                    <button
                      onClick={downloadAttachment}
                      className="px-3 py-1.5 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {t('assignments.download')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('assignments.yourSubmission')}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Submission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('assignments.textSubmission')}
                  <span className="text-gray-500 text-sm ml-2">({t('assignments.optional')})</span>
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('assignments.textSubmissionPlaceholder')}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {t('assignments.markdownSupported')}
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('assignments.fileSubmission')}
                  <span className="text-gray-500 text-sm ml-2">({t('assignments.optional')})</span>
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors mb-4">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    accept={assignment?.allowedFileTypes?.map(type => `.${type}`).join(',') || '.pdf,.doc,.docx'}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">
                      {t('assignments.dragDropFiles')}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="px-6"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {t('assignments.chooseFiles')}
                    </Button>
                    {assignment && (
                      <p className="text-sm text-gray-500 mt-3">
                        {t('assignments.maxSize')}: {assignment.maxFileSize}MB | 
                        {t('assignments.allowedTypes')}: {assignment.allowedFileTypes?.join(', ')}
                      </p>
                    )}
                  </label>
                </div>

                {/* Files List */}
                {files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      {t('assignments.selectedFiles')} ({files.length})
                    </h4>
                    <div className="space-y-2">
                      {files.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-600">{file.size} • {file.type}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
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

              {/* Submission Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">{t('assignments.submissionNotice')}</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• {t('assignments.submitOnce')}</li>
                      <li>• {t('assignments.latePolicy')}</li>
                      <li>• {t('assignments.fileTypes')} {assignment?.allowedFileTypes?.join(', ')}</li>
                      <li>• {t('assignments.maxSize')} {assignment?.maxFileSize}MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {draftSaved && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">{t('assignments.draftSaved')}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {t('assignments.cancel')}
                  </Button>
                  
                  <Button
                    type="submit"
                    loading={submitting}
                    disabled={files.length === 0 && !submissionText.trim()}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {t('assignments.submitAssignmentBtn')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Submission Guidelines */}
        <div className="space-y-6">
          {/* Guidelines */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.submissionGuidelines')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('assignments.guideline1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('assignments.guideline2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('assignments.guideline3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('assignments.guideline4')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('assignments.guideline5')}</span>
              </li>
            </ul>
          </div>

          {/* Late Submission Policy */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">{t('assignments.lateSubmission')}</h3>
            <div className="space-y-2">
              <p className="text-sm text-yellow-700">
                {assignment?.allowLateSubmission 
                  ? t('assignments.lateAllowed')
                  : t('assignments.lateNotAllowed')}
              </p>
              {!assignment?.allowLateSubmission && (
                <p className="text-sm text-yellow-700">
                  {t('assignments.latePenalty')}
                </p>
              )}
            </div>
          </div>

          {/* Submission History */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.submissionHistory')}</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Draft</span>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
                <p className="text-xs text-gray-600">
                  {files.length} {t('assignments.files')}, {submissionText.length} {t('assignments.characters')}
                </p>
              </div>
              
              {/* Previous submissions would appear here */}
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">{t('assignments.noPreviousSubmissions')}</p>
              </div>
            </div>
          </div>

          {/* Technical Support */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">{t('assignments.needHelp')}</h3>
            <p className="text-sm text-blue-700 mb-3">
              {t('assignments.technicalSupport')}
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              {t('assignments.contactSupport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitAssignment