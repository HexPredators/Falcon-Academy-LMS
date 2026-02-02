import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Save, Eye, Globe, Lock, Users, GraduationCap,
  AlertCircle, Calendar, Clock, Pin, Paperclip, X, 
  Bold, Italic, List, Link, Image, Video, Code, 
  Check, Upload, Type, Hash, AtSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const CreateNews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visibility: 'school',
    category: 'announcements',
    priority: 'medium',
    grade: 'all',
    section: 'all',
    publishDate: '',
    publishTime: '',
    pinned: false,
    attachments: [],
    tags: []
  });

  const visibilityOptions = [
    { value: 'public', label: t('news.public'), icon: Globe, description: t('news.publicDesc') },
    { value: 'school', label: t('news.school'), icon: Lock, description: t('news.schoolDesc') },
    { value: 'grade', label: t('news.gradeSpecific'), icon: GraduationCap, description: t('news.gradeDesc') },
    { value: 'section', label: t('news.sectionSpecific'), icon: Users, description: t('news.sectionDesc') }
  ];

  const categoryOptions = [
    { value: 'academic', label: t('news.academic'), color: 'blue' },
    { value: 'events', label: t('news.events'), color: 'green' },
    { value: 'announcements', label: t('news.announcements'), color: 'purple' },
    { value: 'emergency', label: t('news.emergency'), color: 'red' },
    { value: 'holidays', label: t('news.holidays'), color: 'yellow' }
  ];

  const priorityOptions = [
    { value: 'high', label: t('news.high'), color: 'red' },
    { value: 'medium', label: t('news.medium'), color: 'yellow' },
    { value: 'low', label: t('news.low'), color: 'blue' }
  ];

  const gradeOptions = [
    { value: 'all', label: t('news.allGrades') },
    { value: '9', label: t('news.grade9') },
    { value: '10', label: t('news.grade10') },
    { value: '11', label: t('news.grade11') },
    { value: '12', label: t('news.grade12') }
  ];

  const sectionOptions = [
    { value: 'all', label: t('news.allSections') },
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
      value: letter,
      label: `${t('news.section')} ${letter}`
    }))
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (id) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== id)
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Creating news:', formData);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - navigate back
      navigate('/news');
    } catch (error) {
      console.error('Error creating news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    console.log('Preview:', formData);
  };

  const handleSchedule = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      publishDate: tomorrow.toISOString().split('T')[0],
      publishTime: '09:00'
    }));
  };

  const handlePublishNow = () => {
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      publishDate: now.toISOString().split('T')[0],
      publishTime: now.toTimeString().slice(0, 5)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/news')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('news.createNews')}</h1>
                <p className="text-gray-600 mt-1">{t('news.createNewsDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 transition-all"
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium">{t('news.preview')}</span>
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold">{t('news.publishing')}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span className="font-semibold">{t('news.publishNews')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name || 'Author'}</p>
                <p className="text-sm text-gray-600">{t(`roles.${user?.role}`)} • {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <label className="block mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">{t('news.title')}</span>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={t('news.titlePlaceholder')}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </label>
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="flex items-center gap-2 p-4">
                    <button type="button" className="p-2 hover:bg-gray-100 rounded">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-100 rounded">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-100 rounded">
                      <List className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-100 rounded">
                      <Link className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-100 rounded">
                      <Image className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-100 rounded">
                      <Video className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-100 rounded">
                      <Code className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <label className="block mb-2">
                    <span className="text-lg font-semibold text-gray-900">{t('news.content')}</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder={t('news.contentPlaceholder')}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    required
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <label className="block mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Paperclip className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">{t('news.attachments')}</span>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 mb-2">
                        <span className="text-blue-600 font-medium">{t('news.clickToUpload')}</span>
                        {t('news.orDragDrop')}
                      </p>
                      <p className="text-sm text-gray-500">{t('news.supportedFormats')}</p>
                    </label>
                  </div>
                </label>

                {/* File List */}
                {formData.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {formData.attachments.length} {t('news.filesSelected')}
                    </h4>
                    <div className="space-y-3">
                      {formData.attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">{att.name}</p>
                              <p className="text-sm text-gray-600">{formatFileSize(att.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Visibility */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  {t('news.visibilitySettings')}
                </h3>
                <div className="space-y-3">
                  {visibilityOptions.map(option => (
                    <label key={option.value} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={formData.visibility === option.value}
                        onChange={(e) => handleInputChange('visibility', e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('news.category')}</h3>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    {t('news.priority')}
                  </h3>
                  <div className="space-y-2">
                    {priorityOptions.map(option => (
                      <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={formData.priority === option.value}
                          onChange={(e) => handleInputChange('priority', e.target.value)}
                          className={`text-${option.color}-600 focus:ring-${option.color}-500`}
                        />
                        <div className={`w-3 h-3 rounded-full bg-${option.color}-500`}></div>
                        <span className="font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              {(formData.visibility === 'grade' || formData.visibility === 'section') && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('news.targetAudience')}</h3>
                  
                  {/* Grade */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('news.targetGrade')}
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {gradeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section */}
                  {formData.visibility === 'section' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('news.targetSection')}
                      </label>
                      <select
                        value={formData.section}
                        onChange={(e) => handleInputChange('section', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        {sectionOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  {t('news.schedule')}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('news.date')}
                      </label>
                      <input
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) => handleInputChange('publishDate', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('news.time')}
                      </label>
                      <input
                        type="time"
                        value={formData.publishTime}
                        onChange={(e) => handleInputChange('publishTime', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePublishNow}
                      className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {t('news.publishNow')}
                    </button>
                    <button
                      type="button"
                      onClick={handleSchedule}
                      className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                    >
                      {t('news.scheduleForTomorrow')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-600" />
                  {t('news.tags')}
                </h3>
                
                <div className="mb-4">
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    placeholder={t('news.addTagsPlaceholder')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <p className="text-sm text-gray-500 mt-2">{t('news.tagsHint')}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full">
                      <span className="text-sm">#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('news.additionalOptions')}</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Pin className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">{t('news.pinToTop')}</p>
                        <p className="text-sm text-gray-600">{t('news.pinDesc')}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.pinned}
                      onChange={(e) => handleInputChange('pinned', e.target.checked)}
                      className="w-5 h-5 text-blue-600"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <AtSign className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">{t('news.allowComments')}</p>
                        <p className="text-sm text-gray-600">{t('news.commentsDesc')}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 text-blue-600"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">{t('news.requireApproval')}</p>
                        <p className="text-sm text-gray-600">{t('news.approvalDesc')}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;