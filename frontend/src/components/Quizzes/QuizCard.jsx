import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, Award, Users, Eye, Edit, Trash2, Play, ChevronRight, CheckCircle, AlertCircle, BarChart } from 'lucide-react'
import Button from '../../Common/Button'

const QuizCard = ({ quiz, userRole, onDelete }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'blue'
      case 'active': return 'green'
      case 'completed': return 'purple'
      case 'expired': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return Calendar
      case 'active': return Clock
      case 'completed': return CheckCircle
      case 'expired': return AlertCircle
      default: return Award
    }
  }

  const StatusIcon = getStatusIcon(quiz.status)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeRemaining = () => {
    if (quiz.status === 'completed' || quiz.status === 'expired') {
      return t(`quizzes.${quiz.status}`)
    }

    const startDate = new Date(`${quiz.startDate}T${quiz.startTime}`)
    const endDate = new Date(`${quiz.endDate}T${quiz.endTime}`)
    const now = new Date()

    if (quiz.status === 'active') {
      const timeLeft = endDate - now
      const minutes = Math.floor(timeLeft / (1000 * 60))
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60

      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m ${t('quizzes.left')}`
      }
      return `${minutes}m ${t('quizzes.left')}`
    }

    if (quiz.status === 'upcoming') {
      const timeUntil = startDate - now
      const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) {
        return `${days} ${t('quizzes.days')}`
      }
      return `${hours} ${t('quizzes.hours')}`
    }

    return ''
  }

  const handleAction = (action, e) => {
    e.stopPropagation()
    switch (action) {
      case 'view':
        window.location.href = `/quizzes/${quiz.id}`
        break
      case 'edit':
        window.location.href = `/quizzes/${quiz.id}/edit`
        break
      case 'delete':
        onDelete(quiz.id)
        break
      case 'start':
        window.location.href = `/quizzes/${quiz.id}/take`
        break
      case 'results':
        window.location.href = `/quizzes/${quiz.id}/results`
        break
      case 'analytics':
        window.location.href = `/quizzes/${quiz.id}/analytics`
        break
      default:
        break
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
      {/* Card Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 bg-${getStatusColor(quiz.status)}-100 rounded-lg flex items-center justify-center`}>
                <StatusIcon className={`w-5 h-5 text-${getStatusColor(quiz.status)}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(quiz.status)}-100 text-${getStatusColor(quiz.status)}-700`}>
                    {t(`quizzes.${quiz.status}`)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('quizzes.subject')}</p>
                  <p className="font-medium text-gray-900">{quiz.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('quizzes.teacher')}</p>
                  <p className="font-medium text-gray-900">{quiz.teacher}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('quizzes.date')}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(quiz.startDate)} {quiz.startTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">{t('quizzes.duration')}</p>
                  <p className="font-medium text-gray-900">{quiz.duration} {t('quizzes.minutes')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{quiz.questions}</div>
              <div className="text-sm text-gray-600">{t('quizzes.questions')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-6">
            {/* Quiz Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.totalPoints')}</p>
                <p className="text-2xl font-bold text-gray-900">{quiz.totalPoints}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.participants')}</p>
                <p className="text-2xl font-bold text-gray-900">{quiz.participants}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.averageScore')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quiz.averageScore ? `${quiz.averageScore}%` : t('quizzes.notAvailable')}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.timeRemaining')}</p>
                <p className="text-2xl font-bold text-gray-900">{getTimeRemaining()}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">{t('quizzes.tags')}</h4>
              <div className="flex flex-wrap gap-2">
                {quiz.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Time Remaining & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg ${
                  quiz.status === 'expired' 
                    ? 'bg-red-50 text-red-700' 
                    : quiz.status === 'active'
                    ? 'bg-green-50 text-green-700'
                    : quiz.status === 'upcoming'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {quiz.status === 'expired' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : quiz.status === 'active' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {getTimeRemaining()}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {t('quizzes.grade')} {quiz.grade} • {t('quizzes.section')} {quiz.section}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Button */}
                <Button
                  onClick={(e) => handleAction('view', e)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {t('quizzes.view')}
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
                      {t('quizzes.edit')}
                    </Button>
                    
                    {quiz.status === 'completed' && (
                      <>
                        <Button
                          onClick={(e) => handleAction('results', e)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                        >
                          <BarChart className="w-4 h-4" />
                          {t('quizzes.results')}
                        </Button>
                        
                        <Button
                          onClick={(e) => handleAction('analytics', e)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                        >
                          <BarChart className="w-4 h-4" />
                          {t('quizzes.analytics')}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={(e) => handleAction('delete', e)}
                      className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('quizzes.delete')}
                    </Button>
                  </>
                ) : (
                  (quiz.status === 'active' || quiz.status === 'upcoming') && (
                    <Button
                      onClick={(e) => handleAction('start', e)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {quiz.status === 'active' ? t('quizzes.startNow') : t('quizzes.prepare')}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizCard