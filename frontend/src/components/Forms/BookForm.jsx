import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Upload, X, FileText, Hash, Users,
  Calendar, Globe, Tag, Award, Star, Eye,
  AlertCircle, CheckCircle, Book, GraduationCap,
  File, Image as ImageIcon, Film, Music, Link
} from 'lucide-react';

const BookForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = 'create',
  uploaderId,
  availableGrades = [],
  availableSubjects = [],
  availableStreams = [],
  className = '',
  ...props
}) => {
  const { t } = useTranslation();
  const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
  const [filePreview, setFilePreview] = useState(initialData.fileUrl || '');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

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
      author: initialData.author || '',
      description: initialData.description || '',
      isbn: initialData.isbn || '',
      publisher: initialData.publisher || '',
      publicationYear: initialData.publicationYear || new Date().getFullYear(),
      language: initialData.language || 'en',
      category: initialData.category || 'academic',
      type: initialData.type || 'ebook',
      subject: initialData.subject || '',
      grade: initialData.grade || '',
      stream: initialData.stream || '',
      tags: initialData.tags || [],
      rating: initialData.rating || 0,
      pages: initialData.pages || 0,
      fileType: initialData.fileType || 'pdf',
      fileSize: initialData.fileSize || 0,
      downloadCount: initialData.downloadCount || 0,
      viewCount: initialData.viewCount || 0,
      isFeatured: initialData.isFeatured || false,
      isPublic: initialData.isPublic !== undefined ? initialData.isPublic : true,
      requiresApproval: initialData.requiresApproval !== undefined ? initialData.requiresApproval : false,
      downloadAllowed: initialData.downloadAllowed !== undefined ? initialData.downloadAllowed : true,
      previewAllowed: initialData.previewAllowed !== undefined ? initialData.previewAllowed : true
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.coverImage) {
        setCoverImage(initialData.coverImage);
      }
      if (initialData.fileUrl) {
        setFilePreview(initialData.fileUrl);
      }
    }
  }, [initialData, reset]);

  const handleCoverImageUpload = (e) => {
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
        setCoverImage(event.target.result);
        setValue('coverImage', event.target.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
      'audio/mpeg',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(t('invalid_file_type'));
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert(t('file_too_large'));
      return;
    }

    setUploading(true);
    
    const fileType = file.type.split('/')[1];
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        setFilePreview(event.target.result);
        setValue('fileUrl', event.target.result, { shouldDirty: true });
        setValue('fileType', fileType, { shouldDirty: true });
        setValue('fileSize', fileSizeMB, { shouldDirty: true });
        setUploadProgress(100);
        setUploading(false);
      }, 2000);
    };
    reader.readAsDataURL(file);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 90) clearInterval(interval);
    }, 200);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage('');
    setValue('coverImage', '', { shouldDirty: true });
  };

  const handleRemoveFile = () => {
    setFilePreview('');
    setValue('fileUrl', '', { shouldDirty: true });
    setValue('fileType', '', { shouldDirty: true });
    setValue('fileSize', 0, { shouldDirty: true });
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-600" />;
      case 'epub':
        return <Book className="w-8 h-8 text-blue-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'mp4':
        return <Film className="w-8 h-8 text-purple-600" />;
      case 'mp3':
        return <Music className="w-8 h-8 text-green-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon className="w-8 h-8 text-yellow-600" />;
      default:
        return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const onSubmitForm = (data) => {
    const formData = {
      ...data,
      uploaderId,
      coverImage,
      fileUrl: filePreview,
      uploadedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    onSubmit(formData);
  };

  const categories = [
    { value: 'academic', label: t('academic'), icon: GraduationCap },
    { value: 'fiction', label: t('fiction'), icon: Book },
    { value: 'non_fiction', label: t('non_fiction'), icon: BookOpen },
    { value: 'reference', label: t('reference'), icon: FileText },
    { value: 'video', label: t('video'), icon: Film },
    { value: 'audio', label: t('audio'), icon: Music },
    { value: 'image', label: t('image'), icon: ImageIcon }
  ];

  const types = [
    { value: 'ebook', label: t('ebook'), description: t('ebook_description') },
    { value: 'video', label: t('video'), description: t('video_description') },
    { value: 'audio', label: t('audio'), description: t('audio_description') },
    { value: 'presentation', label: t('presentation'), description: t('presentation_description') },
    { value: 'worksheet', label: t('worksheet'), description: t('worksheet_description') },
    { value: 'quiz', label: t('quiz'), description: t('quiz_description') },
    { value: 'link', label: t('link'), description: t('link_description') }
  ];

  const languages = [
    { value: 'en', label: t('english') },
    { value: 'am', label: t('amharic') },
    { value: 'om', label: t('oromo') },
    { value: 'ti', label: t('tigrinya') },
    { value: 'ar', label: t('arabic') },
    { value: 'fr', label: t('french') }
  ];

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
            {mode === 'create' ? t('add_book') : t('edit_book')}
          </h2>
          <p className="mt-2 text-gray-600">
            {mode === 'create' ? t('add_book_description') : t('edit_book_description')}
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="inline w-4 h-4 mr-2" />
                  {t('title')} *
                </label>
                <input
                  type="text"
                  {...register('title', { required: t('title_required') })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('book_title_placeholder')}
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
                  <Users className="inline w-4 h-4 mr-2" />
                  {t('author')} *
                </label>
                <input
                  type="text"
                  {...register('author', { required: t('author_required') })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.author ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('author_placeholder')}
                />
                {errors.author && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.author.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2" />
                  {t('description')} *
                </label>
                <textarea
                  {...register('description', { required: t('description_required') })}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('description_placeholder')}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="inline w-4 h-4 mr-2" />
                    {t('isbn')}
                  </label>
                  <input
                    type="text"
                    {...register('isbn')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="978-3-16-148410-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-2" />
                    {t('publisher')}
                  </label>
                  <input
                    type="text"
                    {...register('publisher')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('publisher_placeholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    {t('publication_year')}
                  </label>
                  <input
                    type="number"
                    {...register('publicationYear', {
                      min: 1900,
                      max: new Date().getFullYear()
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline w-4 h-4 mr-2" />
                    {t('language')} *
                  </label>
                  <select
                    {...register('language', { required: t('language_required') })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.language ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('select_language')}</option>
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  {errors.language && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.language.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="inline w-4 h-4 mr-2" />
                    {t('pages')}
                  </label>
                  <input
                    type="number"
                    {...register('pages', { min: 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="0"
                  />
                </div>
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
                    <File className="inline w-4 h-4 mr-2" />
                    {t('resource_type')} *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {types.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setValue('type', type.value, { shouldDirty: true })}
                        className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                          watch('type') === type.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-medium mb-1">{type.label}</span>
                        <span className="text-xs text-gray-500 text-center">{type.description}</span>
                      </button>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              {watch('category') === 'academic' && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {t('academic_info')}
                  </h3>
                  
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
                        {t('grade')}
                      </label>
                      <select
                        {...register('grade')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">{t('all_grades')}</option>
                        {availableGrades.map(grade => (
                          <option key={grade} value={grade}>
                            {t('grade')} {grade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="inline w-4 h-4 mr-2" />
                        {t('stream')}
                      </label>
                      <select
                        {...register('stream')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">{t('all_streams')}</option>
                        {availableStreams.map(stream => (
                          <option key={stream} value={stream}>
                            {t(stream)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline w-4 h-4 mr-2" />
                  {t('cover_image')}
                </label>
                <div className="relative">
                  <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-blue-400 mb-3" />
                        <p className="text-gray-500">{t('no_cover_image')}</p>
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
                        onChange={handleCoverImageUpload}
                      />
                    </label>
                    
                    {coverImage && (
                      <button
                        type="button"
                        onClick={handleRemoveCoverImage}
                        className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {t('cover_image_hint')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="inline w-4 h-4 mr-2" />
                  {t('file_upload')} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
                  {filePreview ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        {getFileIcon(watch('fileType'))}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {t('file_uploaded')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {watch('fileSize')} MB • {watch('fileType').toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={filePreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title={t('preview')}
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1 text-red-600 hover:text-red-800"
                            title={t('remove')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : uploading ? (
                    <div className="space-y-3">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-bounce" />
                        <p className="text-gray-700 font-medium">{t('uploading_file')}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {t('uploading_description')}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-sm text-gray-500">
                        {uploadProgress}% {t('complete')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium mb-2">{t('drag_drop_file')}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {t('supported_formats')}
                      </p>
                      <label className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 inline-flex items-center">
                        <Upload className="w-5 h-5 mr-2" />
                        {t('select_file')}
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-3">
                        {t('max_file_size')}: 100MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.fileUrl && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fileUrl.message}
                  </p>
                )}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Star className="inline w-4 h-4 mr-2" />
                  {t('rating')}
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue('rating', star, { shouldDirty: true })}
                      className={`p-1 ${
                        star <= watch('rating') ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {watch('rating')}/5
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {t('featured_resource')}
                    </span>
                    <p className="text-xs text-gray-500">
                      {t('featured_resource_description')}
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('isPublic')}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {t('public_resource')}
                    </span>
                    <p className="text-xs text-gray-500">
                      {t('public_resource_description')}
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('downloadAllowed')}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {t('allow_download')}
                    </span>
                    <p className="text-xs text-gray-500">
                      {t('allow_download_description')}
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('previewAllowed')}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {t('allow_preview')}
                    </span>
                    <p className="text-xs text-gray-500">
                      {t('allow_preview_description')}
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
          disabled={loading || (!isDirty && mode === 'edit') || !filePreview}
          className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 ${
            (loading || (!isDirty && mode === 'edit') || !filePreview) ? 'opacity-50 cursor-not-allowed' : ''
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
              {mode === 'create' ? t('add_book') : t('update_book')}
            </div>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default BookForm;