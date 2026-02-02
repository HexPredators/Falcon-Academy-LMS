import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, BookOpen, Target, Download, Share2, Save, Printer, Zap, ChevronDown, CheckCircle } from 'lucide-react'
import Button from '../../Common/Button'

const LessonPlanner = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [lessonPlan, setLessonPlan] = useState(null)
  
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: '40',
    objectives: '',
    teachingMethod: 'interactive',
    resources: '',
    difficulty: 'medium'
  })

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography', 'Civics', 'ICT']
  const grades = ['9', '10', '11', '12']
  const teachingMethods = [
    { id: 'lecture', name: t('ai.lectureMethod') },
    { id: 'interactive', name: t('ai.interactiveMethod') },
    { id: 'group-work', name: t('ai.groupWorkMethod') },
    { id: 'demonstration', name: t('ai.demoMethod') },
    { id: 'discussion', name: t('ai.discussionMethod') }
  ]
  const difficulties = ['easy', 'medium', 'hard']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateLessonPlan = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedPlan = {
        id: Date.now(),
        title: `${formData.subject} - ${formData.topic}`,
        grade: formData.grade,
        duration: `${formData.duration} minutes`,
        objectives: formData.objectives.split(',').map(obj => obj.trim()).filter(obj => obj),
        activities: [
          { time: '0-5', activity: t('ai.warmUpActivity'), description: t('ai.warmUpDesc') },
          { time: '5-20', activity: t('ai.instructionActivity'), description: t('ai.instructionDesc') },
          { time: '20-30', activity: t('ai.practiceActivity'), description: t('ai.practiceDesc') },
          { time: '30-38', activity: t('ai.assessmentActivity'), description: t('ai.assessmentDesc') },
          { time: '38-40', activity: t('ai.wrapUpActivity'), description: t('ai.wrapUpDesc') }
        ],
        resources: ['Textbook Chapter 3', 'Whiteboard', 'Projector', 'Worksheets', 'Online Simulation'],
        assessment: t('ai.sampleAssessment'),
        notes: t('ai.sampleNotes'),
        generatedAt: new Date().toLocaleString()
      }
      
      setLessonPlan(generatedPlan)
      setLoading(false)
    }, 2000)
  }

  const downloadLessonPlan = () => {
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(lessonPlan, null, 2)], {type: 'application/json'})
    element.href = URL.createObjectURL(file)
    element.download = `lesson-plan-${formData.subject}-${formData.topic}.json`
    document.body.appendChild(element)
    element.click()
  }

  const printLessonPlan = () => {
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('ai.lessonPlanner')}</h1>
            <p className="text-gray-600">{t('ai.lessonPlannerSubtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('ai.createLessonPlan')}</h2>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">{t('ai.aiPowered')}</span>
              </div>
            </div>

            <form onSubmit={generateLessonPlan} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ai.subject')} *
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">{t('ai.selectSubject')}</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ai.grade')} *
                  </label>
                  <div className="relative">
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">{t('ai.selectGrade')}</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{t('ai.grade')} {grade}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.topic')} *
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('ai.topicPlaceholder')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ai.duration')} (minutes) *
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
                      min="10"
                      max="120"
                      className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ai.difficulty')}
                  </label>
                  <div className="flex gap-2">
                    {difficulties.map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, difficulty: diff }))}
                        className={`flex-1 py-2 rounded-lg text-center font-medium transition-colors ${
                          formData.difficulty === diff
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t(`ai.${diff}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.learningObjectives')} *
                </label>
                <textarea
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('ai.objectivesPlaceholder')}
                />
                <p className="text-xs text-gray-500 mt-1">{t('ai.commaSeparated')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.teachingMethod')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {teachingMethods.map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.teachingMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="teachingMethod"
                        value={method.id}
                        checked={formData.teachingMethod === method.id}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ai.resources')}
                </label>
                <textarea
                  name="resources"
                  value={formData.resources}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('ai.resourcesPlaceholder')}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  {t('ai.generatePlan')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setFormData({
                    subject: '',
                    grade: '',
                    topic: '',
                    duration: '40',
                    objectives: '',
                    teachingMethod: 'interactive',
                    resources: '',
                    difficulty: 'medium'
                  })}
                >
                  {t('ai.clear')}
                </Button>
              </div>
            </form>
          </div>

          {/* Recent Plans */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ai.recentPlans')}</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Mathematics - Algebra Basics</h4>
                      <p className="text-sm text-gray-600">Grade 10 • 40 minutes • 2 days ago</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Generated Plan */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{t('ai.tips')}</h3>
                <p className="text-sm text-gray-600">{t('ai.bestPractices')}</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('ai.tipClearObjectives')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('ai.tipTimeManagement')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('ai.tipAssessments')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t('ai.tipDifferentiation')}</span>
              </li>
            </ul>
          </div>

          {/* Generated Lesson Plan Preview */}
          {lessonPlan && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{t('ai.generatedPlan')}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadLessonPlan}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={t('ai.download')}
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={printLessonPlan}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={t('ai.print')}
                  >
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {/* Save logic */}}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={t('ai.save')}
                  >
                    <Save className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">{lessonPlan.title}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Grade {lessonPlan.grade}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{lessonPlan.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{lessonPlan.generatedAt}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.objectives')}</h5>
                  <ul className="space-y-1">
                    {lessonPlan.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.timeline')}</h5>
                  <div className="space-y-3">
                    {lessonPlan.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-20 flex-shrink-0">
                          <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                            {activity.time} min
                          </div>
                        </div>
                        <div className="flex-1">
                          <h6 className="font-medium text-gray-900">{activity.activity}</h6>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{t('ai.resources')}</h5>
                  <div className="flex flex-wrap gap-2">
                    {lessonPlan.resources.map((resource, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonPlanner