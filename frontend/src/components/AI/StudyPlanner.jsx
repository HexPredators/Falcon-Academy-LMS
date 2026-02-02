import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, Target, BookOpen, Brain, TrendingUp, AlertCircle, CheckCircle, X, Plus, Trash2, Edit2, Download } from 'lucide-react'
import Button from '../../Common/Button'

const StudyPlanner = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [studyPlan, setStudyPlan] = useState(null)
  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, subject: 'Mathematics', task: 'Complete algebra exercises', due: 'Today, 4:00 PM', priority: 'high' },
    { id: 2, subject: 'Physics', task: 'Read chapter 5', due: 'Tomorrow, 10:00 AM', priority: 'medium' },
    { id: 3, subject: 'Chemistry', task: 'Lab report', due: 'Friday, 2:00 PM', priority: 'high' },
  ])

  const [formData, setFormData] = useState({
    subjects: ['Mathematics', 'Physics'],
    studyHours: '2',
    availableDays: ['Mon', 'Wed', 'Fri'],
    examDate: '',
    goals: 'Improve algebra skills, understand physics concepts',
    learningStyle: 'visual',
    focusAreas: 'Weak topics: Calculus, Organic Chemistry'
  })

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography', 'Civics', 'ICT']
  const learningStyles = [
    { id: 'visual', name: t('ai.visualLearner'), icon: '👁️' },
    { id: 'auditory', name: t('ai.auditoryLearner'), icon: '👂' },
    { id: 'kinesthetic', name: t('ai.kinestheticLearner'), icon: '👐' },
    { id: 'reading', name: t('ai.readingLearner'), icon: '📖' }
  ]

  const generateStudyPlan = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedPlan = {
        id: Date.now(),
        title: `${formData.subjects.length} Subjects Study Plan`,
        duration: `${formData.studyHours} hours daily`,
        schedule: [
          { day: 'Monday', time: '4:00-6:00 PM', subject: 'Mathematics', topic: 'Algebra' },
          { day: 'Tuesday', time: '5:00-7:00 PM', subject: 'Physics', topic: 'Mechanics' },
          { day: 'Wednesday', time: '4:00-6:00 PM', subject: 'Chemistry', topic: 'Organic' },
          { day: 'Thursday', time: '5:00-7:00 PM', subject: 'Mathematics', topic: 'Calculus' },
          { day: 'Friday', time: '3:00-5:00 PM', subject: 'Physics', topic: 'Electromagnetism' },
          { day: 'Saturday', time: '9:00-11:00 AM', subject: 'Revision', topic: 'Weekly Review' },
          { day: 'Sunday', time: 'Rest', subject: '', topic: '' }
        ],
        goals: formData.goals.split(',').map(g => g.trim()).filter(g => g),
        tips: [
          t('ai.tipPomodoro'),
          t('ai.tipActiveRecall'),
          t('ai.tipSpacedRepetition'),
          t('ai.tipRegularBreaks')
        ],
        resources: ['Textbooks', 'Practice Papers', 'Online Videos', 'Study Groups'],
        progressTarget: '85% overall score',
        generatedAt: new Date().toLocaleString()
      }
      
      setStudyPlan(generatedPlan)
      setLoading(false)
    }, 2000)
  }

  const addTask = () => {
    const newTask = {
      id: upcomingTasks.length + 1,
      subject: 'New Subject',
      task: 'New task description',
      due: 'Today',
      priority: 'medium'
    }
    setUpcomingTasks([...upcomingTasks, newTask])
  }

  const removeTask = (id) => {
    setUpcomingTasks(upcomingTasks.filter(task => task.id !== id))
  }

  const markComplete = (id) => {
    setUpcomingTasks(upcomingTasks.filter(task => task.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Brain className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('ai.studyPlanner')}</h1>
            <p className="text-gray-600">{t('ai.studyPlannerSubtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Form & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('ai.createStudyPlan')}</h2>

            <form onSubmit={generateStudyPlan} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.subjects')} *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.subjects.map((subject, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                      <BookOpen className="w-4 h-4" />
                      <span>{subject}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          subjects: prev.subjects.filter((_, i) => i !== idx)
                        }))}
                        className="text-green-700 hover:text-green-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value && !formData.subjects.includes(e.target.value)) {
                        setFormData(prev => ({ ...prev, subjects: [...prev.subjects, e.target.value] }))
                      }
                      e.target.value = ''
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">{t('ai.addSubject')}</option>
                    {subjects.filter(s => !formData.subjects.includes(s)).map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={() => {
                      const newSubject = prompt(t('ai.enterSubject'))
                      if (newSubject && !formData.subjects.includes(newSubject)) {
                        setFormData(prev => ({ ...prev, subjects: [...prev.subjects, newSubject] }))
                      }
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ai.dailyStudyHours')} *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={formData.studyHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, studyHours: e.target.value }))}
                      required
                      className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ai.examDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.learningStyle')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {learningStyles.map(style => (
                    <label
                      key={style.id}
                      className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.learningStyle === style.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="learningStyle"
                        value={style.id}
                        checked={formData.learningStyle === style.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, learningStyle: e.target.value }))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-2xl mt-2">{style.icon}</span>
                      <span className="text-sm font-medium text-gray-900 mt-1">{style.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.studyGoals')} *
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('ai.goalsPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.focusAreas')}
                </label>
                <textarea
                  value={formData.focusAreas}
                  onChange={(e) => setFormData(prev => ({ ...prev, focusAreas: e.target.value }))}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('ai.focusAreasPlaceholder')}
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {t('ai.generateStudyPlan')}
              </Button>
            </form>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('ai.upcomingTasks')}</h3>
              <Button
                onClick={addTask}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('ai.addTask')}
              </Button>
            </div>

            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className={`p-4 border rounded-lg ${
                  task.priority === 'high' ? 'border-red-200 bg-red-50' :
                  task.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.priority === 'high' ? 'bg-red-100' :
                        task.priority === 'medium' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        <BookOpen className={`w-5 h-5 ${
                          task.priority === 'high' ? 'text-red-600' :
                          task.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{task.subject}</h4>
                        <p className="text-gray-600">{task.task}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{task.due}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {t(`ai.${task.priority}Priority`)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markComplete(task.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                        title={t('ai.markComplete')}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title={t('ai.delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Generated Plan & Stats */}
        <div className="space-y-6">
          {/* Study Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ai.studyStats')}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">{t('ai.weeklyStudyTime')}</p>
                    <p className="text-2xl font-bold text-blue-900">14 hrs</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">{t('ai.completionRate')}</p>
                    <p className="text-2xl font-bold text-green-900">78%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">{t('ai.upcomingExams')}</p>
                    <p className="text-2xl font-bold text-purple-900">3</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Generated Study Plan */}
          {studyPlan && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{t('ai.yourStudyPlan')}</h3>
                <button
                  onClick={() => {
                    const element = document.createElement("a")
                    const file = new Blob([JSON.stringify(studyPlan, null, 2)], {type: 'application/json'})
                    element.href = URL.createObjectURL(file)
                    element.download = `study-plan-${new Date().toISOString().split('T')[0]}.json`
                    element.click()
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title={t('ai.download')}
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">{studyPlan.title}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{studyPlan.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{studyPlan.generatedAt}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.weeklySchedule')}</h5>
                  <div className="space-y-2">
                    {studyPlan.schedule.map((day, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${
                        day.time === 'Rest' ? 'bg-gray-100' : 'bg-green-50'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{day.day}</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            day.time === 'Rest' ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'
                          }`}>
                            {day.time}
                          </span>
                        </div>
                        {day.subject && (
                          <div className="mt-1 text-sm text-gray-600">
                            {day.subject} • {day.topic}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.studyTips')}</h5>
                  <ul className="space-y-2">
                    {studyPlan.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">{t('ai.quickTips')}</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{t('ai.tipConsistency')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{t('ai.tipEnvironment')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{t('ai.tipReview')}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{t('ai.tipHealth')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPlanner