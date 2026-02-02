import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Upload, Calendar, Clock, FileText, Users, Award, ChevronDown, Save, Send } from 'lucide-react'
import Button from '../../Common/Button'

const CreateAssignment = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSections, setSelectedSections] = useState([])
  const [selectedStream, setSelectedStream] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    instructions: '',
    points: '',
    dueDate: '',
    dueTime: '',
    allowLateSubmission: false,
    maxFileSize: '10',
    allowedFileTypes: ['pdf'],
    visibility: 'immediate'
  })

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography', 'Civics', 'ICT']
  const grades = ['9', '10', '11', '12']
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const streams = ['Natural Science', 'Social Science']
  const fileTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
  const maxFileSizes = ['5', '10', '20', '50']

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const formattedDate = tomorrow.toISOString().split('T')[0]
    
    setFormData(prev => ({
      ...prev,
      dueDate: formattedDate,
      dueTime: '23:59'
    }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const fileType = file.name.split('.').pop().toLowerCase()
      return file.size <= parseInt(formData.maxFileSize) * 1024 * 1024 && 
             formData.allowedFileTypes.includes(fileType)
    })

    const newAttachments = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.name.split('.').pop().toLowerCase(),
      file: file
    }))

    setAttachments(prev => [...prev, ...newAttachments])
  }

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const toggleSection = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(prev => prev.filter(s => s !== section))
    } else {
      setSelectedSections(prev => [...prev, section])
    }
  }

  const toggleFileType = (fileType) => {
    const currentTypes = [...formData.allowedFileTypes]
    if (currentTypes.includes(fileType)) {
      setFormData(prev => ({
        ...prev,
        allowedFileTypes: currentTypes.filter(type => type !== fileType)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        allowedFileTypes: [...currentTypes, fileType]
      }))
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert(t('assignments.enterTitle'))
      return false
    }
    if (!formData.subject) {
      alert(t('assignments.selectSubject'))
      return false
    }
    if (!selectedGrade) {
      alert(t('assignments.selectGrade'))
      return false
    }
    if (selectedSections.length === 0) {
      alert(t('assignments.selectSection'))
      return false
    }
    if (!formData.dueDate || !formData.dueTime) {
      alert(t('assignments.setDueDate'))
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    const assignmentData = {
      ...formData,
      grade: selectedGrade,
      sections: selectedSections,
      stream: selectedGrade >= 11 ? selectedStream : null,
      attachments: attachments,
      createdAt: new Date().toISOString(),
      status: 'draft'
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Assignment created:', assignmentData)
      setLoading(false)
      alert(t('assignments.createdSuccess'))
      // Redirect to assignments list
      window.location.href = '/assignments'
    }, 2000)
  }

  const handleSaveDraft = () => {
    const draftData = {
      ...formData,
      grade: selectedGrade,
      sections: selectedSections,
      stream: selectedStream,
      attachments: attachments,
      savedAt: new Date().toISOString(),
      status: 'draft'
    }
    
    localStorage.setItem('assignment_draft', JSON.stringify(draftData))
    alert(t('assignments.draftSaved'))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('assignments.createAssignment')}</h1>
        <p className="text-gray-600">{t('assignments.createAssignmentDesc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('assignments.basicInfo')}</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignments.title')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('assignments.titlePlaceholder')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('assignments.subject')} *
                </label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">{t('assignments.selectSubject')}</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('assignments.points')} *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Award className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100"
                    className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignments.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('assignments.descriptionPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignments.instructions')} *
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('assignments.instructionsPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('assignments.targetAudience')}</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('assignments.grade')} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {grades.map(grade => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      selectedGrade === grade
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('assignments.grade')} {grade}
                  </button>
                ))}
              </div>
            </div>

            {selectedGrade >= 11 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('assignments.stream')} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {streams.map(stream => (
                    <button
                      key={stream}
                      type="button"
                      onClick={() => setSelectedStream(stream)}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        selectedStream === stream
                          ? 'bg-blue-600 text-white'
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
                {t('assignments.sections')} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                {sections.map(section => (
                  <label
                    key={section}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedSections.includes(section)
                        ? 'border-blue-500 bg-blue-50'
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
                      {t('assignments.section')} {section}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Due Date & Time */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('assignments.dueDateTime')}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignments.dueDate')} *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignments.dueTime')} *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleInputChange}
                  required
                  className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="allowLateSubmission"
                checked={formData.allowLateSubmission}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">{t('assignments.allowLateSubmission')}</span>
            </label>
          </div>
        </div>

        {/* File Upload Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('assignments.fileSettings')}</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignments.allowedFileTypes')}
              </label>
              <div className="flex flex-wrap gap-2">
                {fileTypes.map(type => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                      formData.allowedFileTypes.includes(type)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.allowedFileTypes.includes(type)}
                      onChange={() => toggleFileType(type)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900">.{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignments.maxFileSize')} (MB)
              </label>
              <div className="flex flex-wrap gap-2">
                {maxFileSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, maxFileSize: size }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      formData.maxFileSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size} MB
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('assignments.uploadFiles')}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  accept={formData.allowedFileTypes.map(type => `.${type}`).join(',')}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    {t('assignments.dragDrop')}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-6"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {t('assignments.browseFiles')}
                  </Button>
                  <p className="text-sm text-gray-500 mt-3">
                    {t('assignments.maxSize')}: {formData.maxFileSize}MB | 
                    {t('assignments.allowedTypes')}: {formData.allowedFileTypes.join(', ')}
                  </p>
                </label>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {t('assignments.attachments')} ({attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{att.name}</p>
                            <p className="text-sm text-gray-600">{att.size} • {att.type}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(att.id)}
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{t('assignments.readyToPublish')}</h3>
              <p className="text-sm text-gray-600">
                {t('assignments.reviewAssignment')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleSaveDraft}
                variant="outline"
                className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {t('assignments.saveDraft')}
              </Button>
              
              <Button
                type="submit"
                loading={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {t('assignments.publishAssignment')}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Preview Section */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('assignments.assignmentPreview')}</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {formData.title || t('assignments.sampleTitle')}
              </h4>
              <p className="text-gray-600 mt-1">
                {formData.description || t('assignments.sampleDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.subject')}</p>
                <p className="font-medium text-gray-900">{formData.subject || 'Mathematics'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('assignments.points')}</p>
                <p className="font-medium text-gray-900">{formData.points || '20'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('assignments.dueDate')}</p>
                <p className="font-medium text-gray-900">
                  {formData.dueDate || '2024-02-20'} {formData.dueTime || '23:59'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('assignments.target')}</p>
                <p className="font-medium text-gray-900">
                  {selectedGrade ? `${t('assignments.grade')} ${selectedGrade}` : 'Grade 10'} • 
                  {selectedSections.length > 0 ? ` ${selectedSections.join(', ')}` : ' Section A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAssignment