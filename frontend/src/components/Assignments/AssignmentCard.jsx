import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, FileText, User, Award, Eye, Edit, Trash2, Download, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import Button from '../../Common/Button'

const AssignmentCard = ({ assignment, userRole, onDelete }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'submitted': return 'blue'
      case 'graded': return 'green'
      case 'overdue': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock
      case 'submitted': return FileText
      case 'graded': return CheckCircle
      case 'overdue': return AlertCircle
      default: return FileText
    }
  }

  const StatusIcon = getStatusIcon(assignment.status)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeRemaining = () => {
    const dueDate = new Date(`${assignment.dueDate}T${assignment.dueTime}`)
    const now = new Date()
    const diff = dueDate - now
    
    if (diff < 0) return t('assignments.overdue')
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} ${t('assignments.days')}`
    if (hours > 0) return `${hours} ${t('assignments.hours')}`
    return t('assignments.lessThanHour')
  }

  const handleAction = (action, e) => {
    e.stopPropagation()
    switch (action) {
      case 'view':
        window.location.href = `/assignments/${assignment.id}`
        break
      case 'edit':
        window.location.href = `/assignments/${assignment.id}/edit`
        break
      case 'delete':
        onDelete(assignment.id)
        break
      case 'submit':
        window.location.href = `/assignments/${assignment.id}/submit`
        break
      case 'grade':
        window.location.href = `/assignments/${assignment.id}/grade`
        break
      default:
        break
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
      {/* Card Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 bg-${getStatusColor(assignment.status)}-100 rounded-lg flex items-center justify-center`}>
                <StatusIcon className={`w-5 h-5 text-${getStatusColor(assignment.status)}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(assignment.status)}-100 text-${getStatusColor(assignment.status)}-700`}>
                    {t(`assignments.${assignment.status}`)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{assignment.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('assignments.subject')}</p>
                  <p className="font-medium text-gray-900">{assignment.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('assignments.teacher')}</p>
                  <p className="font-medium text-gray-900">{assignment.teacher}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('assignments.dueDate')}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(assignment.dueDate)} {assignment.dueTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('assignments.points')}</p>
                  <p className="font-medium text-gray-900">{assignment.points}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            
            {userRole === 'teacher' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {assignment.submissions}/{assignment.totalStudents} {t('assignments.submitted')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-6">
            {/* Instructions */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{t('assignments.instructions')}</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{assignment.instructions}</p>
            </div>

            {/* Time Remaining & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg ${
                  assignment.status === 'overdue' 
                    ? 'bg-red-50 text-red-700' 
                    : assignment.status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {assignment.status === 'overdue' 
                        ? t('assignments.overdueBy') 
                        : t('assignments.dueIn')} {getTimeRemaining()}
                    </span>
                  </div>
                </div>

                {assignment.attachment && (
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                    <span className="font-medium">{t('assignments.downloadFiles')}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* View Button */}
                <Button
                  onClick={(e) => handleAction('view', e)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {t('assignments.view')}
                </Button>

                {/* Role-specific Actions */}
                {userRole === 'teacher' ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={(e) => handleAction('edit', e)}
                      className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('assignments.edit')}
                    </Button>
                    
                    {assignment.submissions > 0 && (
                      <Button
                        onClick={(e) => handleAction('grade', e)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        {t('assignments.grade')} ({assignment.submissions})
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={(e) => handleAction('delete', e)}
                      className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('assignments.delete')}
                    </Button>
                  </>
                ) : (
                  assignment.status === 'pending' && (
                    <Button
                      onClick={(e) => handleAction('submit', e)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      {t('assignments.submitNow')}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Submission Stats (Teacher only) */}
            {userRole === 'teacher' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">{t('assignments.submissionStats')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">{t('assignments.totalStudents')}</p>
                    <p className="text-2xl font-bold text-blue-900">{assignment.totalStudents}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">{t('assignments.submitted')}</p>
                    <p className="text-2xl font-bold text-green-900">{assignment.submissions}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">{t('assignments.pending')}</p>
                    <p className="text-2xl font-bold text-yellow-900">{assignment.totalStudents - assignment.submissions}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{t('assignments.submissionRate')}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignmentCard