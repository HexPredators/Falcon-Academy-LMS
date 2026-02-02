import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserRole } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../contexts/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';
import { motion } from 'framer-motion';
import {
  Award, Plus, Search, Filter, Calendar, Clock,
  Users, BarChart3, ChevronRight, Eye, Edit, Play,
  CheckCircle, AlertCircle, TrendingUp, BookOpen,
  ChevronDown, ChevronUp, X, Timer, Target, Lock
} from 'lucide-react';
import Card, { CardGrid } from '../components/Common/Card';
import Button from '../components/Common/Button';

const Quizzes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isStudent, isTeacher, isParent } = useUserRole();
  const { t } = useLanguage();
  const { endpoints, loading: apiLoading } = useApi();
  
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    grade: 'all',
    section: 'all',
    type: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });

  const statusOptions = [
    { value: 'all', label: t('all_status') },
    { value: 'available', label: t('available'), color: 'bg-green-100 text-green-800' },
    { value: 'upcoming', label: t('upcoming'), color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: t('completed'), color: 'bg-purple-100 text-purple-800' },
    { value: 'expired', label: t('expired'), color: 'bg-red-100 text-red-800' }
  ];

  const subjectOptions = [
    { value: 'all', label: t('all_subjects') },
    { value: 'mathematics', label: t('mathematics') },
    { value: 'physics', label: t('physics') },
    { value: 'chemistry', label: t('chemistry') },
    { value: 'biology', label: t('biology') },
    { value: 'english', label: t('english') },
    { value: 'amharic', label: t('amharic') }
  ];

  const typeOptions = [
    { value: 'all', label: t('all_types') },
    { value: 'practice', label: t('practice'), icon: BookOpen },
    { value: 'quiz', label: t('quiz'), icon: Award },
    { value: 'exam', label: t('exam'), icon: Target }
  ];

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    filterAndSortQuizzes();
  }, [quizzes, debouncedSearch, filters, sortConfig]);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await endpoints.quizzes.list();
      setQuizzes(data);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuizzes = () => {
    let filtered = [...quizzes];

    if (debouncedSearch) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        quiz.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(quiz => {
        const now = new Date();
        const startDate = new Date(quiz.startDate);
        const endDate = new Date(quiz.endDate);
        
        if (filters.status === 'available') {
          return now >= startDate && now <= endDate;
        } else if (filters.status === 'upcoming') {
          return now < startDate;
        } else if (filters.status === 'completed') {
          return now > endDate;
        } else if (filters.status === 'expired') {
          return now > endDate;
        }
        return true;
      });
    }

    if (filters.subject !== 'all') {
      filtered = filtered.filter(quiz => quiz.subject === filters.subject);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(quiz => quiz.type === filters.type);
    }

    if (filters.grade !== 'all') {
      filtered = filtered.filter(quiz => quiz.grade === parseInt(filters.grade));
    }

    if (filters.section !== 'all') {
      filtered = filtered.filter(quiz => quiz.section === filters.section);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
        return sortConfig.direction === 'asc' 
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredQuizzes(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      subject: 'all',
      grade: 'all',
      section: 'all',
      type: 'all'
    });
  };

  const getQuizStatus = (quiz) => {
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    return 'available';
  };

  const getStatusBadge = (status) => {
    const config = {
      available: { color: 'bg-green-100 text-green-800', icon: Play },
      upcoming: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      completed: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      expired: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const { color, icon: Icon } = config[status] || { color: 'bg-gray-100 text-gray-800', icon: Award };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {t(status)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const config = {
      practice: { color: 'bg-blue-100 text-blue-800', icon: BookOpen },
      quiz: { color: 'bg-green-100 text-green-800', icon: Award },
      exam: { color: 'bg-red-100 text-red-800', icon: Target }
    };
    
    const { color, icon: Icon } = config[type] || { color: 'bg-gray-100 text-gray-800', icon: Award };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {t(type)}
      </span>
    );
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff < 0) return t('expired');
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ${t('days')}`;
    if (hours > 0) return `${hours} ${t('hours')}`;
    return t('less_than_hour');
  };

  const renderQuizCard = (quiz) => {
    const status = getQuizStatus(quiz);
    const canTakeQuiz = status === 'available' && isStudent;
    const hasAttempt = quiz.attempts && quiz.attempts.length > 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusBadge(status)}
              {getTypeBadge(quiz.type)}
              {quiz.password && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  <Lock className="w-3 h-3 mr-1" />
                  {t('password_protected')}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {quiz.title}
            </h3>
            
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {quiz.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {quiz.subject}
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {t('grade')} {quiz.grade}, {t('section')} {quiz.section}
              </span>
              <span className="flex items-center">
                <Timer className="w-4 h-4 mr-1" />
                {quiz.duration} {t('minutes')}
              </span>
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {quiz.totalPoints} {t('points')}
              </span>
            </div>
          </div>
          
          <div className="ml-4 flex flex-col items-end space-y-2">
            {hasAttempt && quiz.bestScore && (
              <div className="text-right">
                <p className="text-sm text-gray-500">{t('best_score')}</p>
                <p className="text-xl font-bold text-green-600">{quiz.bestScore}%</p>
              </div>
            )}
            
            <button
              onClick={() => navigate(`/quizzes/${quiz.id}`)}
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(quiz.startDate).toLocaleDateString()} - {new Date(quiz.endDate).toLocaleDateString()}
              </span>
            </div>
            
            {status === 'available' && (
              <div className="flex items-center space-x-1 text-green-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getTimeRemaining(quiz.endDate)} {t('remaining')}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {canTakeQuiz && (
              <button
                onClick={() => navigate(`/quizzes/${quiz.id}/take`)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                {t('take_quiz')}
              </button>
            )}
            
            {hasAttempt && (
              <button
                onClick={() => navigate(`/quizzes/${quiz.id}/results`)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                {t('view_results')}
              </button>
            )}
            
            {isTeacher && (
              <button
                onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => navigate(`/quizzes/${quiz.id}`)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderFilters = () => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('status')}
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('subject')}
            </label>
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {subjectOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('type')}
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {isTeacher && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('grade')}
                </label>
                <select
                  value={filters.grade}
                  onChange={(e) => handleFilterChange('grade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">{t('all_grades')}</option>
                  {[9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>
                      {t('grade')} {grade}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('section')}
                </label>
                <select
                  value={filters.section}
                  onChange={(e) => handleFilterChange('section', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">{t('all_sections')}</option>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(section => (
                    <option key={section} value={section}>
                      {t('section')} {section}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const renderStats = () => {
    const stats = {
      total: quizzes.length,
      available: quizzes.filter(q => getQuizStatus(q) === 'available').length,
      upcoming: quizzes.filter(q => getQuizStatus(q) === 'upcoming').length,
      completed: quizzes.filter(q => getQuizStatus(q) === 'expired').length
    };

    return (
      <CardGrid cols={4} className="mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('total_quizzes')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('available')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('upcoming')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('completed')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </CardGrid>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('quizzes')}</h1>
              <p className="text-gray-600 mt-2">
                {isStudent ? t('test_your_knowledge') :
                 isTeacher ? t('manage_class_quizzes') :
                 t('view_all_quizzes')}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {isTeacher && (
                <button
                  onClick={() => navigate('/quizzes/create')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('create_quiz')}
                </button>
              )}
              
              {isStudent && (
                <button
                  onClick={() => navigate('/quizzes/results')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  {t('my_results')}
                </button>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                {t('filter')}
                {showFilters ? (
                  <ChevronUp className="w-5 h-5 ml-2" />
                ) : (
                  <ChevronDown className="w-5 h-5 ml-2" />
                )}
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_quizzes')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {showFilters && renderFilters()}
        
        {renderStats()}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('no_quizzes_found')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? t('try_changing_filters')
                : t('no_quizzes_yet')}
            </p>
            {(searchQuery || Object.values(filters).some(f => f !== 'all')) && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                {t('clear_filters')}
              </button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id}>
                {renderQuizCard(quiz)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;