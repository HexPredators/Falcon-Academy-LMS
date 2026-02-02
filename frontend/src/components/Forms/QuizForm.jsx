import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Clock, Hash, Award, Users, Calendar,
  Plus, Trash2, Edit, Eye, FileText, AlertCircle,
  CheckCircle, ChevronDown, ChevronUp, Timer,
  BarChart3, Target, Shield, Lock, Globe
} from 'lucide-react';

const QuizForm = ({
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
  const [questions, setQuestions] = useState(initialData.questions || []);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1,
    explanation: ''
  });

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
      duration: initialData.duration || 30,
      totalPoints: initialData.totalPoints || 100,
      passingScore: initialData.passingScore || 50,
      startDate: initialData.startDate || '',
      endDate: initialData.endDate || '',
      isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
      isTimed: initialData.isTimed !== undefined ? initialData.isTimed : true,
      showResults: initialData.showResults !== undefined ? initialData.showResults : true,
      shuffleQuestions: initialData.shuffleQuestions || false,
      shuffleOptions: initialData.shuffleOptions || false,
      allowRetake: initialData.allowRetake || false,
      maxAttempts: initialData.maxAttempts || 1,
      visibility: initialData.visibility || 'all',
      password: initialData.password || ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.questions) {
        setQuestions(initialData.questions);
      }
    }
  }, [initialData, reset]);

  const handleAddQuestion = () => {
    if (editingQuestion !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = { ...questionForm, id: Date.now() };
      setQuestions(updatedQuestions);
      setEditingQuestion(null);
    } else {
      const newQuestion = { ...questionForm, id: Date.now() };
      setQuestions([...questions, newQuestion]);
    }
    
    setQuestionForm({
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
      explanation: ''
    });
    
    setValue('questions', [...questions, newQuestion], { shouldDirty: true });
  };

  const handleEditQuestion = (index) => {
    setEditingQuestion(index);
    setQuestionForm(questions[index]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setValue('questions', newQuestions, { shouldDirty: true });
  };

  const handleQuestionFormChange = (field, value) => {
    setQuestionForm(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    setQuestionForm(prev => ({ ...prev, options: newOptions }));
  };

  const calculateTotalPoints = () => {
    return questions.reduce((total, q) => total + (parseFloat(q.points) || 0), 0);
  };

  const onSubmitForm = (data) => {
    const formData = {
      ...data,
      teacherId,
      questions,
      totalPoints: calculateTotalPoints(),
      totalQuestions: questions.length,
      createdAt: new Date().toISOString(),
      attempts: initialData.attempts || []
    };
    
    onSubmit(formData);
  };

  const renderQuestionForm = () => {
    return (
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {editingQuestion !== null ? t('edit_question') : t('add_question')}
          </h4>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            disabled={!questionForm.question || !questionForm.correctAnswer}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {editingQuestion !== null ? t('update_question') : t('add_question')}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('question_type')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['multiple_choice', 'true_false', 'short_answer', 'essay'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleQuestionFormChange('type', type)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    questionForm.type === type
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t(type)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('question')} *
            </label>
            <textarea
              value={questionForm.question}
              onChange={(e) => handleQuestionFormChange('question', e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder={t('question_placeholder')}
            />
          </div>

          {(questionForm.type === 'multiple_choice' || questionForm.type === 'true_false') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('options')} *
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t('add_option')}
                </button>
              </div>
              
              <div className="space-y-3">
                {questionForm.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type={questionForm.type === 'multiple_choice' ? 'radio' : 'checkbox'}
                      name="correctOption"
                      checked={questionForm.correctAnswer === String.fromCharCode(65 + index)}
                      onChange={() => handleQuestionFormChange('correctAnswer', String.fromCharCode(65 + index))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="flex-1 flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('option_placeholder', { option: String.fromCharCode(65 + index) })}
                      />
                    </div>
                    {questionForm.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {questionForm.type === 'short_answer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('correct_answer')} *
              </label>
              <input
                type="text"
                value={questionForm.correctAnswer}
                onChange={(e) => handleQuestionFormChange('correctAnswer', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder={t('correct_answer_placeholder')}
              />
            </div>
          )}

          {questionForm.type === 'essay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('expected_answer_guidelines')}
              </label>
              <textarea
                value={questionForm.correctAnswer}
                onChange={(e) => handleQuestionFormChange('correctAnswer', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder={t('essay_guidelines_placeholder')}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('points')} *
              </label>
              <input
                type="number"
                value={questionForm.points}
                onChange={(e) => handleQuestionFormChange('points', e.target.value)}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('explanation')}
              </label>
              <input
                type="text"
                value={questionForm.explanation}
                onChange={(e) => handleQuestionFormChange('explanation', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder={t('explanation_placeholder')}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            {mode === 'create' ? t('create_quiz') : t('edit_quiz')}
          </h2>
          <p className="mt-2 text-gray-600">
            {mode === 'create' ? t('create_quiz_description') : t('edit_quiz_description')}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="inline w-4 h-4 mr-2" />
              {t('quiz_title')} *
            </label>
            <input
              type="text"
              {...register('title', { required: t('title_required') })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('quiz_title_placeholder')}
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
              {t('description')}
            </label>
            <textarea
              {...register('description')}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder={t('quiz_description_placeholder')}
            />
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
                {availableSections.map(section => (
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
                {t('available_from')}
              </label>
              <input
                type="datetime-local"
                {...register('startDate')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                {t('available_until')}
              </label>
              <input
                type="datetime-local"
                {...register('endDate')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {t('questions')} ({questions.length})
              <span className="ml-2 text-sm font-normal text-gray-500">
                {t('total_points')}: {calculateTotalPoints()}
              </span>
            </h3>

            {renderQuestionForm()}

            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            Q{index + 1}. {question.type === 'multiple_choice' ? '📝' : 
                              question.type === 'true_false' ? '✅' : 
                              question.type === 'short_answer' ? '✏️' : '📝'}
                          </span>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {question.points} {t('points')}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-900">{question.question}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditQuestion(index)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title={t('edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title={t('remove')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="mt-3 space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-sm px-3 py-2 rounded-lg ${
                              String.fromCharCode(65 + optIndex) === question.correctAnswer
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>{' '}
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">{t('explanation')}:</span> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900">{t('no_questions_yet')}</h4>
                <p className="text-gray-500 mt-2">{t('add_questions_to_quiz')}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-8">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {t('advanced_settings')}
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
                  className="mt-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Timer className="inline w-4 h-4 mr-2" />
                        {t('duration_settings')}
                      </label>
                      
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...register('isTimed')}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              {t('enable_timer')}
                            </span>
                            <p className="text-xs text-gray-500">
                              {t('timer_description')}
                            </p>
                          </div>
                        </label>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('duration_minutes')} *
                          </label>
                          <input
                            type="number"
                            {...register('duration', {
                              required: t('duration_required'),
                              min: { value: 1, message: t('min_duration') },
                              max: { value: 180, message: t('max_duration') }
                            })}
                            disabled={!watch('isTimed')}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              errors.duration ? 'border-red-500' : 'border-gray-300'
                            }`}
                            min="1"
                            max="180"
                          />
                          {errors.duration && (
                            <p className="mt-1 text-xs text-red-600">{errors.duration.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Award className="inline w-4 h-4 mr-2" />
                        {t('scoring_settings')}
                      </label>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('total_points')}
                          </label>
                          <input
                            type="number"
                            value={calculateTotalPoints()}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('passing_score')} (%) *
                          </label>
                          <input
                            type="number"
                            {...register('passingScore', {
                              required: t('passing_score_required'),
                              min: { value: 0, message: t('min_passing_score') },
                              max: { value: 100, message: t('max_passing_score') }
                            })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              errors.passingScore ? 'border-red-500' : 'border-gray-300'
                            }`}
                            min="0"
                            max="100"
                          />
                          {errors.passingScore && (
                            <p className="mt-1 text-xs text-red-600">{errors.passingScore.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <BarChart3 className="inline w-4 h-4 mr-2" />
                        {t('quiz_behavior')}
                      </label>
                      
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...register('shuffleQuestions')}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {t('shuffle_questions')}
                          </span>
                        </label>
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...register('shuffleOptions')}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {t('shuffle_options')}
                          </span>
                        </label>
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...register('showResults')}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              {t('show_results')}
                            </span>
                            <p className="text-xs text-gray-500">
                              {t('show_results_description')}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Target className="inline w-4 h-4 mr-2" />
                        {t('attempts_retakes')}
                      </label>
                      
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...register('allowRetake')}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              {t('allow_retake')}
                            </span>
                            <p className="text-xs text-gray-500">
                              {t('allow_retake_description')}
                            </p>
                          </div>
                        </label>
                        
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
                            disabled={!watch('allowRetake')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            min="1"
                            max="10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline w-4 h-4 mr-2" />
                      {t('security_access')}
                    </label>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t('visibility')}
                        </label>
                        <select
                          {...register('visibility')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">{t('all_students')}</option>
                          <option value="selected">{t('selected_students')}</option>
                          <option value="password">{t('password_protected')}</option>
                        </select>
                      </div>
                      
                      {watch('visibility') === 'password' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t('quiz_password')}
                          </label>
                          <input
                            type="password"
                            {...register('password')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={t('enter_password')}
                          />
                        </div>
                      )}
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
                  {t('publish_quiz')}
                </span>
                <p className="text-xs text-gray-500">
                  {t('publish_quiz_description')}
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
          disabled={loading || (!isDirty && mode === 'edit') || questions.length === 0}
          className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 ${
            (loading || (!isDirty && mode === 'edit') || questions.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
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
              {mode === 'create' ? t('create_quiz') : t('update_quiz')}
            </div>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default QuizForm;