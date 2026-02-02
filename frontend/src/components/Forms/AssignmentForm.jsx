import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Calendar, Clock, FileText, Upload, X,
  AlertCircle, CheckCircle, Plus, Trash2, Eye,
  Hash, Award, Users, Target, Paperclip,
  ChevronDown, ChevronUp
} from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

const AssignmentForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = 'create',
  teacherId,
  availableGrades = [],
  availableSections = [],
  availableSubjects = [],
  className = '',
  ...props
}) => {
  const { t } = useTranslation();
  const [attachments, setAttachments] = useState(initialData.attachments || []);
  const [rubric, setRubric] = useState(initialData.rubric || []);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editorContent, setEditorContent] = useState(initialData.description || '');
  
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
      description: initialData.description || '',
      subject: initialData.subject || '',
      grade: initialData.grade || '',
      section: initialData.section || '',
      dueDate: initialData.dueDate || '',
      dueTime: initialData.dueTime || '23:59',
      totalPoints: initialData.totalPoints || 100,
      passingPoints: initialData.passingPoints || 50,
      allowLateSubmission: initialData.allowLateSubmission || false,
      lateSubmissionPenalty: initialData.lateSubmissionPenalty || 0,
      maxAttempts: initialData.maxAttempts || 1,
      isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
      requiresFileUpload: initialData.requiresFileUpload !== undefined ? initialData.requiresFileUpload : true,
      allowedFileTypes: initialData.allowedFileTypes || ['pdf', 'doc', 'docx'],
      maxFileSize: initialData.maxFileSize || 10,
      visibility: initialData.visibility || 'all',
      tags: initialData.tags || []
    }
  });

  const watchedGrade = watch('grade');
  const watchedSubject = watch('subject');
  const watchedRequiresFileUpload = watch('requiresFileUpload');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.attachments) {
        setAttachments(initialData.attachments);
      }
      if (initialData.rubric) {
        setRubric(initialData.rubric);
      }
      if (initialData.description) {
        setEditorContent(initialData.description);
      }
    }
  }, [initialData, reset]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(t('file_too_large'));
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert(t('invalid_file_type'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachment = {
          id: Date.now(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: event.target.result,
          uploadedAt: new Date().toISOString()
        };
        setAttachments(prev => [...prev, newAttachment]);
        setValue('attachments', [...attachments, newAttachment], { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (id) => {
    const newAttachments = attachments.filter(att => att.id !== id);
    setAttachments(newAttachments);
    setValue('attachments', newAttachments, { shouldDirty: true });
  };

  const handleAddRubricItem = () => {
    const newItem = {
      id: Date.now(),
      criterion: '',
      points: 0,
      description: ''
    };
    setRubric(prev => [...prev, newItem]);
    setValue('rubric', [...rubric, newItem], { shouldDirty: true });
  };

  const handleUpdateRubricItem = (id, field, value) => {
    const updatedRubric = rubric.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setRubric(updatedRubric);
    setValue('rubric', updatedRubric, { shouldDirty: true });
  };

  const handleRemoveRubricItem = (id) => {
    const newRubric = rubric.filter(item => item.id !== id);
    setRubric(newRubric);
    setValue('rubric', newRubric, { shouldDirty: true });
  };

  const handleDescriptionChange = (content) => {
    setEditorContent(content);
    setValue('description', content, { shouldDirty: true });
  };

  const onSubmitForm = (data) => {
    const formData = {
      ...data,
      teacherId,
      attachments,
      rubric,
      description: editorContent,
      createdAt: new Date().toISOString(),
      submissions: initialData.submissions || []
    };
    
    onSubmit(formData);
  };

  const calculateTotalRubricPoints = () => {
    return rubric.reduce((total, item) => total + (parseFloat(item.points) || 0), 0);
  };

  const availableSectionsForGrade = availableSections.filter(section => 
    !watchedGrade || section.grade === parseInt(watchedGrade)
  );

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
            {mode === 'create' ? t('create_assignment') : t('edit_assignment')}
          </h2>
          <p className="mt-2 text-gray-600">
            {mode === 'create' ? t('create_assignment_description') : t('edit_assignment_description')}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="inline w-4 h-4 mr-2" />
              {t('assignment_title')} *
            </label>
            <input
              type="text"
              {...register('title', { required: t('title_required') })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('assignment_title_placeholder')}
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
              <FileText className="inline w-4 h-4 mr-2" />
              {t('description')} *
            </label>
            <RichTextEditor
              value={editorContent}
              onChange={handleDescriptionChange}
              placeholder={t('assignment_description_placeholder')}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline w-4 h-4 mr-2" />
                {t('subject')} *
              </label>
              <select
                {...register('subject', { required: t('subject_required') })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('select_subject')}</option>
                {availableSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline w-4 h-4 mr-2" />
                {t('grade')} *
              </label>
              <select
                {...register('grade', { required: t('grade_required') })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.grade ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('select_grade')}</option>
                {availableGrades.map(grade => (
                  <option key={grade} value={grade}>
                    {t('grade')} {grade}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.grade.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-2" />
                {t('section')} *
              </label>
              <select
                {...register('section', { required: t('section_required') })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.section ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('select_section')}</option>
                {availableSectionsForGrade.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              {errors.section && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.section.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                {t('due_date')} *
              </label>
              <input
                type="date"
                {...register('dueDate', { required: t('due_date_required') })}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                {t('due_time')} *
              </label>
              <input
                type="time"
                {...register('dueTime', { required: t('due_time_required') })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.dueTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dueTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="inline w-4 h-4 mr-2" />
                {t('total_points')} *
              </label>
              <input
                type="number"
                {...register('totalPoints', {
                  required: t('total_points_required'),
                  min: { value: 1, message: t('min_points') },
                  max: { value: 1000, message: t('max_points') }
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.totalPoints ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
                max="1000"
              />
              {errors.totalPoints && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.totalPoints.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline w-4 h-4 mr-2" />
                {t('passing_points')} *
              </label>
              <input
                type="number"
                {...register('passingPoints', {
                  required: t('passing_points_required'),
                  min: { value: 0, message: t('min_passing_points') },
                  max: { value: watch('totalPoints'), message: t('max_passing_points') },
                  validate: value => 
                    parseFloat(value) <= parseFloat(watch('totalPoints')) || t('passing_exceeds_total')
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.passingPoints ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                max={watch('totalPoints')}
              />
              {errors.passingPoints && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.passingPoints.message}
                </p>
              )}
            </div>
          </div>

          <div className="border-t pt-8">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center">
                <Paperclip className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {t('attachments_rubric')}
                </span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 space-y-8"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        <Upload className="inline w-4 h-4 mr-2" />
                        {t('attachments')}
                      </label>
                      <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <Upload className="w-4 h-4 inline mr-2" />
                        {t('upload_files')}
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    
                    {attachments.length > 0 ? (
                      <div className="space-y-3">
                        {attachments.map(attachment => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title={t('preview')}
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachment(attachment.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title={t('remove')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">{t('no_attachments')}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {t('upload_pdf_doc')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        <Award className="inline w-4 h-4 mr-2" />
                        {t('grading_rubric')}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          {t('total_rubric_points')}: {calculateTotalRubricPoints()}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddRubricItem}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {t('add_criterion')}
                      </button>
                    </div>
                    
                    {rubric.length > 0 ? (
                      <div className="space-y-4">
                        {rubric.map((item, index) => (
                          <div
                            key={item.id}
                            className="p-4 border border-gray-200 rounded-xl bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-900">
                                {t('criterion')} {index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleRemoveRubricItem(item.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {t('criterion_name')} *
                                </label>
                                <input
                                  type="text"
                                  value={item.criterion}
                                  onChange={(e) => handleUpdateRubricItem(item.id, 'criterion', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder={t('criterion_placeholder')}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {t('points')} *
                                </label>
                                <input
                                  type="number"
                                  value={item.points}
                                  onChange={(e) => handleUpdateRubricItem(item.id, 'points', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="0"
                                  max="1000"
                                  step="0.5"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  {t('description')}
                                </label>
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => handleUpdateRubricItem(item.id, 'description', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder={t('description_placeholder')}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {calculateTotalRubricPoints() > watch('totalPoints') && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              {t('rubric_points_exceed_total')}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">{t('no_rubric_items')}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {t('add_rubric_description')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline w-4 h-4 mr-2" />
                        {t('submission_settings')}
                      </label>
                      
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...register('allowLateSubmission')}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              {t('allow_late_submission')}
                            </span>
                            <p className="text-xs text-gray-500">
                              {t('late_submission_description')}
                            </p>
                          </div>
                        </label>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('late_submission_penalty')} (%)
                          </label>
                          <input
                            type="number"
                            {...register('lateSubmissionPenalty', {
                              min: 0,
                              max: 100
                            })}
                            disabled={!watch('allowLateSubmission')}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            min="0"
                            max="100"
                            step="1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('max_attempts')}
                          </label>
                          <input
                            type="number"
                            {...register('maxAttempts', {
                              min: 1,
                              max: 10
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max="10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="inline w-4 h-4 mr-2" />
                        {t('file_upload_settings')}
                      </label>
                      
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...register('requiresFileUpload')}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              {t('require_file_upload')}
                            </span>
                            <p className="text-xs text-gray-500">
                              {t('file_upload_description')}
                            </p>
                          </div>
                        </label>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('max_file_size')} (MB)
                          </label>
                          <input
                            type="number"
                            {...register('maxFileSize', {
                              min: 1,
                              max: 100
                            })}
                            disabled={!watchedRequiresFileUpload}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            min="1"
                            max="100"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('allowed_file_types')}
                          </label>
                          <select
                            {...register('allowedFileTypes')}
                            multiple
                            disabled={!watchedRequiresFileUpload}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            <option value="pdf">PDF</option>
                            <option value="doc">DOC</option>
                            <option value="docx">DOCX</option>
                            <option value="jpg">JPG</option>
                            <option value="png">PNG</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            {t('hold_ctrl_multiselect')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t pt-8">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('isPublished')}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {t('publish_assignment')}
                </span>
                <p className="text-xs text-gray-500">
                  {t('publish_assignment_description')}
                </p>
              </div>
            </label>
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
              {mode === 'create' ? t('create_assignment') : t('update_assignment')}
            </div>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default AssignmentForm;