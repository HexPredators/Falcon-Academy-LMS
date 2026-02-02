import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileText, BookOpen, User, Hash, Calendar, Tag, Award, Globe, Lock, Image, Eye, EyeOff, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../Common/Button';
import Modal from '../../Common/Modal';
import LoadingSpinner from '../../Common/LoadingSpinner';

const UploadBook = ({ isOpen, onClose, onUploadSuccess }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    grade: '',
    stream: '',
    tags: [],
    language: 'am',
    visibility: 'public',
    allowDownloads: true,
    allowComments: true,
    copyright: 'educational',
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'mathematics', name: t('library.mathematics'), icon: <Hash className="w-4 h-4" /> },
    { id: 'science', name: t('library.science'), icon: <FileText className="w-4 h-4" /> },
    { id: 'literature', name: t('library.literature'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'history', name: t('library.history'), icon: <Calendar className="w-4 h-4" /> },
    { id: 'languages', name: t('library.languages'), icon: <Globe className="w-4 h-4" /> },
    { id: 'reference', name: t('library.reference'), icon: <Award className="w-4 h-4" /> },
    { id: 'fiction', name: t('library.fiction'), icon: <Tag className="w-4 h-4" /> },
  ];

  const grades = [
    { id: '9', name: t('library.grade9') },
    { id: '10', name: t('library.grade10') },
    { id: '11', name: t('library.grade11') },
    { id: '12', name: t('library.grade12') },
    { id: 'all', name: t('library.allGrades') },
  ];

  const streams = [
    { id: 'natural', name: t('library.naturalScience') },
    { id: 'social', name: t('library.socialScience') },
    { id: 'both', name: t('library.bothStreams') },
    { id: 'na', name: t('library.notApplicable') },
  ];

  const languages = [
    { id: 'am', name: 'አማርኛ' },
    { id: 'en', name: 'English' },
    { id: 'om', name: 'Afaan Oromoo' },
    { id: 'ti', name: 'ትግርኛ' },
  ];

  const visibilityOptions = [
    { id: 'public', name: t('library.public'), icon: <Globe className="w-4 h-4" />, description: t('library.publicDesc') },
    { id: 'school', name: t('library.schoolOnly'), icon: <Lock className="w-4 h-4" />, description: t('library.schoolOnlyDesc') },
    { id: 'private', name: t('library.private'), icon: <EyeOff className="w-4 h-4" />, description: t('library.privateDesc') },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setErrors({ ...errors, file: t('library.pdfOnly') });
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB
        setErrors({ ...errors, file: t('library.fileTooLarge') });
        return;
      }
      setFile(selectedFile);
      setErrors({ ...errors, file: null });
      
      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag) && formData.tags.length < 5) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!file) newErrors.file = t('library.fileRequired');
    if (!formData.title.trim()) newErrors.title = t('library.titleRequired');
    if (!formData.author.trim()) newErrors.author = t('library.authorRequired');
    if (!formData.description.trim()) newErrors.description = t('library.descriptionRequired');
    if (!formData.category) newErrors.category = t('library.categoryRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.grade) newErrors.grade = t('library.gradeRequired');
    if (!formData.language) newErrors.language = t('library.languageRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Upload success
      onUploadSuccess({
        ...formData,
        file: file.name,
        uploadedAt: new Date().toISOString(),
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({ ...errors, submit: t('library.uploadFailed') });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      category: '',
      grade: '',
      stream: '',
      tags: [],
      language: 'am',
      visibility: 'public',
      allowDownloads: true,
      allowComments: true,
      copyright: 'educational',
    });
    setErrors({});
    setStep(1);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          {t('library.selectBookFile')} *
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              errors.file
                ? 'border-red-300 bg-red-50 hover:bg-red-100'
                : file
                ? 'border-green-300 bg-green-50 hover:bg-green-100'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {file ? (
              <div className="text-center p-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <div className="font-medium text-gray-900">{file.name}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="font-medium text-gray-900 mb-2">
                  {t('library.dropOrClick')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('library.pdfOnlyMax50')}
                </div>
              </div>
            )}
          </label>
          {errors.file && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.file}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('library.bookTitle')} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder={t('library.enterBookTitle')}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('library.author')} *
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.author ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder={t('library.enterAuthorName')}
          />
          {errors.author && (
            <p className="mt-2 text-sm text-red-600">{errors.author}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {t('library.category')} *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleInputChange('category', category.id)}
              className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                formData.category === category.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {category.icon}
              <span className="mt-2 text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-2 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {t('library.description')} *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows="4"
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder={t('library.enterDescription')}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Grade and Stream */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('library.gradeLevel')} *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {grades.map(grade => (
              <button
                key={grade.id}
                type="button"
                onClick={() => handleInputChange('grade', grade.id)}
                className={`p-3 border rounded-xl text-center transition-all ${
                  formData.grade === grade.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {grade.name}
              </button>
            ))}
          </div>
          {errors.grade && (
            <p className="mt-2 text-sm text-red-600">{errors.grade}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('library.stream')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {streams.map(stream => (
              <button
                key={stream.id}
                type="button"
                onClick={() => handleInputChange('stream', stream.id)}
                className={`p-3 border rounded-xl text-center transition-all ${
                  formData.stream === stream.id
                    ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {stream.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {t('library.language')} *
        </label>
        <div className="grid grid-cols-4 gap-3">
          {languages.map(lang => (
            <button
              key={lang.id}
              type="button"
              onClick={() => handleInputChange('language', lang.id)}
              className={`p-3 border rounded-xl text-center transition-all ${
                formData.language === lang.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
        {errors.language && (
          <p className="mt-2 text-sm text-red-600">{errors.language}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {t('library.tags')}
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          onKeyDown={handleTagInput}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('library.addTags')}
        />
        <p className="mt-2 text-sm text-gray-500">
          {t('library.tagsHint')}
        </p>
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {t('library.visibility')}
        </label>
        <div className="space-y-3">
          {visibilityOptions.map(option => (
            <label
              key={option.id}
              className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                formData.visibility === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={option.id}
                checked={formData.visibility === option.id}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {option.icon}
                  <span className="font-medium text-gray-900">{option.name}</span>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allowDownloads}
            onChange={(e) => handleInputChange('allowDownloads', e.target.checked)}
            className="rounded"
          />
          <div>
            <span className="font-medium text-gray-900">{t('library.allowDownloads')}</span>
            <p className="text-sm text-gray-600">{t('library.allowDownloadsDesc')}</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allowComments}
            onChange={(e) => handleInputChange('allowComments', e.target.checked)}
            className="rounded"
          />
          <div>
            <span className="font-medium text-gray-900">{t('library.allowComments')}</span>
            <p className="text-sm text-gray-600">{t('library.allowCommentsDesc')}</p>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('library.uploadBook')}
      size="xl"
    >
      <div className="p-1">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {step === 1 ? t('library.basicInformation') : t('library.additionalDetails')}
          </h3>
          <p className="text-gray-600">
            {step === 1 ? t('library.step1Desc') : t('library.step2Desc')}
          </p>
        </div>

        {/* Form Content */}
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {step === 1 ? renderStep1() : renderStep2()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {step > 1 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={uploading}
              >
                {t('library.previous')}
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={uploading}
            >
              {t('library.cancel')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {uploading ? (
                <LoadingSpinner size="small" />
              ) : step === 1 ? (
                t('library.next')
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  {t('library.upload')}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.submit}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UploadBook;