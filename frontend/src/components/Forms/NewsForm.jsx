import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Newspaper, Calendar, Clock, Globe, Lock, Users,
  Upload, X, Image as ImageIcon, AlertCircle, CheckCircle,
  Eye, Tag, Target, Bell, Star, Pin, ChevronDown, Hash
} from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

const NewsForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = 'create',
  authorId,
  availableGrades = [],
  availableSections = [],
  className = '',
  ...props
}) => {
  const { t } = useTranslation();
  const [featuredImage, setFeaturedImage] = useState(initialData.featuredImage || '');
  const [editorContent, setEditorContent] = useState(initialData.content || '');
  const [selectedGrades, setSelectedGrades] = useState(initialData.targetGrades || []);
  const [selectedSections, setSelectedSections] = useState(initialData.targetSections || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
    trigger
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      summary: initialData.summary || '',
      content: initialData.content || '',
      category: initialData.category || 'general',
      priority: initialData.priority || 'normal',
      visibility: initialData.visibility || 'public',
      isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
      isPinned: initialData.isPinned || false,
      sendNotification: initialData.sendNotification || false,
      publishDate: initialData.publishDate || new Date().toISOString().split('T')[0],
      publishTime: initialData.publishTime || new Date().toTimeString().slice(0, 5),
      expiryDate: initialData.expiryDate || '',
      tags: initialData.tags || [],
      targetGrades: initialData.targetGrades || [],
      targetSections: initialData.targetSections || []
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.featuredImage) {
        setFeaturedImage(initialData.featuredImage);
      }
      if (initialData.content) {
        setEditorContent(initialData.content);
      }
      if (initialData.targetGrades) {
        setSelectedGrades(initialData.targetGrades);
      }
      if (initialData.targetSections) {
        setSelectedSections(initialData.targetSections);
      }
    }
  }, [initialData, reset]);

  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('image_size_error'));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(t('image_type_error'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFeaturedImage(event.target.result);
        setValue('featuredImage', event.target.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFeaturedImage = () => {
    setFeaturedImage('');
    setValue('featuredImage', '', { shouldDirty: true });
  };

  const handleContentChange = (content) => {
    setEditorContent(content);
    setValue('content', content, { shouldDirty: true });
  };

  const handleGradeToggle = (grade) => {
    const newGrades = selectedGrades.includes(grade)
      ? selectedGrades.filter(g => g !== grade)
      : [...selectedGrades, grade];
    
    setSelectedGrades(newGrades);
    setValue('targetGrades', newGrades, { shouldDirty: true });
  };

  const handleSectionToggle = (section) => {
    const newSections = selectedSections.includes(section)
      ? selectedSections.filter(s => s !== section)
      : [...selectedSections, section];
    
    setSelectedSections(newSections);
    setValue('targetSections', newSections, { shouldDirty: true });
  };

  const onSubmitForm = (data) => {
    const formData = {
      ...data,
      authorId,
      featuredImage,
      content: editorContent,
      targetGrades: selectedGrades,
      targetSections: selectedSections,
      publishedAt: new Date().toISOString(),
      views: initialData.views || 0,
      likes: initialData.likes || 0,
      comments: initialData.comments || []
    };
    
    onSubmit(formData);
  };

  const categories = [
    { value: 'general', label: t('general'), icon: Newspaper },
    { value: 'academic', label: t('academic'), icon: Calendar },
    { value: 'event', label: t('event'), icon: Bell },
    { value: 'announcement', label: t('announcement'), icon: Target },
    { value: 'achievement', label: t('achievement'), icon: Star },
    { value: 'holiday', label: t('holiday'), icon: Globe }
  ];

  const priorities = [
    { value: 'low', label: t('low'), color: 'text-green-600 bg-green-100' },
    { value: 'normal', label: t('normal'), color: 'text-blue-600 bg-blue-100' },
    { value: 'high', label: t('high'), color: 'text-yellow-600 bg-yellow-100' },
    { value: 'urgent', label: t('urgent'), color: 'text-red-600 bg-red-100' }
  ];

  const visibilities = [
    { value: 'public', label: t('public'), icon: Globe, description: t('public_description') },
    { value: 'school', label: t('school'), icon: Users, description: t('school_description') },
    { value: 'grade', label: t('grade_specific'), icon: Hash, description: t('grade_specific_description') },
    { value: 'section', label: t('section_specific'), icon: Users, description: t('section_specific_description') },
    { value: 'private', label: t('private'), icon: Lock, description: t('private_description') }
  ];

  const watchedVisibility = watch('visibility');

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmitForm)}
      className={`space-y-8 ${className}`}
      {...props}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? t('create_news') : t('edit_news')}
          </h2>
          <p className="mt-2 text-gray-600">
            {mode === 'create' ? t('create_news_description') : t('edit_news_description')}
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Newspaper className="inline w-4 h-4 mr-2" />
                  {t('title')} *
                </label>
                <input
                  type="text"
                  {...register('title', { required: t('title_required') })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('news_title_placeholder')}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Newspaper className="inline w-4 h-4 mr-2" />
                  {t('summary')} *
                </label>
                <textarea
                  {...register('summary', { required: t('summary_required') })}
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.summary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('summary_placeholder')}
                  maxLength="200"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500">
                    {t('summary_hint')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {watch('summary')?.length || 0}/200
                  </p>
                </div>
                {errors.summary && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.summary.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Newspaper className="inline w-4 h-4 mr-2" />
                  {t('content')} *
                </label>
                <RichTextEditor
                  value={editorContent}
                  onChange={handleContentChange}
                  placeholder={t('content_placeholder')}
                />
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline w-4 h-4 mr-2" />
                    {t('category')} *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setValue('category', cat.value, { shouldDirty: true })}
                        className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                          watch('category') === cat.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <cat.icon className="w-5 h-5 mb-2" />
                        <span className="text-xs font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="inline w-4 h-4 mr-2" />
                    {t('priority')} *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setValue('priority', priority.value, { shouldDirty: true })}
                        className={`p-3 border rounded-xl text-center transition-all duration-200 ${
                          watch('priority') === priority.value
                            ? 'border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priority.color}`}>
                          {priority.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.priority && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.priority.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-2" />
                  {t('tags')}
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={t('tags_placeholder')}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {t('tags_hint')}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline w-4 h-4 mr-2" />
                  {t('featured_image')}
                </label>
                <div className="relative">
                  <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden">
                    {featuredImage ? (
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-blue-400 mb-3" />
                        <p className="text-gray-500">{t('no_featured_image')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <label className="cursor-pointer p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
                      <Upload className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFeaturedImageUpload}
                      />
                    </label>
                    
                    {featuredImage && (
                      <button
                        type="button"
                        onClick={handleRemoveFeaturedImage}
                        className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {t('featured_image_hint')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline w-4 h-4 mr-2" />
                  {t('visibility')} *
                </label>
                <div className="space-y-3">
                  {visibilities.map(visibility => (
                    <button
                      key={visibility.value}
                      type="button"
                      onClick={() => setValue('visibility', visibility.value, { shouldDirty: true })}
                      className={`w-full p-3 border rounded-xl text-left transition-all duration-200 ${
                        watchedVisibility === visibility.value
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <visibility.icon className="w-5 h-5 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{visibility.label}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {visibility.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.visibility && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.visibility.message}
                  </p>
                )}
              </div>

              {(watchedVisibility === 'grade' || watchedVisibility === 'section') && (
                <div className="space-y-6">
                  {watchedVisibility === 'grade' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Hash className="inline w-4 h-4 mr-2" />
                        {t('target_grades')} *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableGrades.map(grade => (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => handleGradeToggle(grade)}
                            className={`px-3 py-2 border rounded-lg text-sm transition-all duration-200 ${
                              selectedGrades.includes(grade)
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {t('grade')} {grade}
                          </button>
                        ))}
                      </div>
                      {selectedGrades.length === 0 && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {t('select_at_least_one_grade')}
                        </p>
                      )}
                    </div>
                  )}

                  {watchedVisibility === 'section' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="inline w-4 h-4 mr-2" />
                        {t('target_sections')} *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableSections.map(section => (
                          <button
                            key={section}
                            type="button"
                            onClick={() => handleSectionToggle(section)}
                            className={`px-3 py-2 border rounded-lg text-sm transition-all duration-200 ${
                              selectedSections.includes(section)
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {t('section')} {section}
                          </button>
                        ))}
                      </div>
                      {selectedSections.length === 0 && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {t('select_at_least_one_section')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    {t('publish_date')}
                  </label>
                  <input
                    type="date"
                    {...register('publishDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-2" />
                    {t('publish_time')}
                  </label>
                  <input
                    type="time"
                    {...register('publishTime')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {t('expiry_date')}
                </label>
                <input
                  type="date"
                  {...register('expiryDate')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {t('expiry_date_hint')}
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('isPublished')}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {t('publish_immediately')}
                    </span>
                    <p className="text-xs text-gray-500">
                      {t('publish_immediately_description')}
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('isPinned')}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {t('pin_to_top')}
                    </span>
                    <p className="text-xs text-gray-500">
                      {t('pin_to_top_description')}
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('sendNotification')}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {t('send_notification')}
                    </span>
                    <p className="text-xs text-gray-500">
                      {t('send_notification_description')}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          {t('cancel')}
        </button>
        
        <button
          type="submit"
          disabled={loading || (!isDirty && mode === 'edit')}
          className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 ${
            (loading || (!isDirty && mode === 'edit')) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('processing')}
            </div>
          ) : (
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {mode === 'create' ? t('create_news') : t('update_news')}
            </div>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default NewsForm;