import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserRole } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../contexts/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';
import { motion } from 'framer-motion';
import {
  FileText, Plus, Search, Filter, Calendar, Clock,
  Users, Award, ChevronRight, Eye, Download, Edit,
  CheckCircle, AlertCircle, TrendingUp, BookOpen,
  ChevronDown, ChevronUp, X, Upload
} from 'lucide-react';
import Card, { CardGrid } from '../components/Common/Card';
import Table from '../components/Common/Table';
import Button from '../components/Common/Button';

const Assignments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isStudent, isTeacher, isParent } = useUserRole();
  const { t } = useLanguage();
  const { endpoints, loading: apiLoading } = useApi();
  
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    grade: 'all',
    section: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });

  const statusOptions = [
    { value: 'all', label: t('all_status') },
    { value: 'pending', label: t('pending'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'submitted', label: t('submitted'), color: 'bg-blue-100 text-blue-800' },
    { value: 'graded', label: t('graded'), color: 'bg-green-100 text-green-800' },
    { value: 'overdue', label: t('overdue'), color: 'bg-red-100 text-red-800' }
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

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    filterAndSortAssignments();
  }, [assignments, debouncedSearch, filters, sortConfig]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await endpoints.assignments.list();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAssignments = () => {
    let filtered = [...assignments];

    if (debouncedSearch) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        assignment.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === filters.status);
    }

    if (filters.subject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === filters.subject);
    }

    if (filters.grade !== 'all') {
      filtered = filtered.filter(assignment => assignment.grade === parseInt(filters.grade));
    }

    if (filters.section !== 'all') {
      filtered = filtered.filter(assignment => assignment.section === filters.section);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'dueDate') {
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

    setFilteredAssignments(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
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
      section: 'all'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      submitted: { color: 'bg-blue-100 text-blue-800', icon: Upload },
      graded: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const { color, icon: Icon } = config[status] || { color: 'bg-gray-100 text-gray-800', icon: FileText };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {t(status)}
      </span>
    );
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    
    if (diff < 0) return t('overdue');
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ${t('days')}`;
    if (hours > 0) return `${hours} ${t('hours')}`;
    return t('less_than_hour');
  };

  const renderAssignmentCard = (assignment) => {
    const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status !== 'submitted' && assignment.status !== 'graded';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusBadge(isOverdue ? 'overdue' : assignment.status)}
              <span className="text-xs text-gray-500">
                {assignment.subject} • {t('grade')} {assignment.grade}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {assignment.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {assignment.description}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1 text-gray-500 mb-2">
              <Award className="w-4 h-4" />
              <span className="text-sm">{assignment.points} {t('points')}</span>
            </div>
            <button
              onClick={() => navigate(`/assignments/${assignment.id}`)}
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
                {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                {getTimeRemaining(assignment.dueDate)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isStudent && assignment.status === 'pending' && !isOverdue && (
              <button
                onClick={() => navigate(`/assignments/${assignment.id}/submit`)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                {t('submit')}
              </button>
            )}
            
            {isTeacher && (
              <button
                onClick={() => navigate(`/assignments/${assignment.id}/edit`)}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => navigate(`/assignments/${assignment.id}`)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
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
      total: assignments.length,
      pending: assignments.filter(a => a.status === 'pending').length,
      submitted: assignments.filter(a => a.status === 'submitted').length,
      graded: assignments.filter(a => a.status === 'graded').length,
      overdue: assignments.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'submitted' && a.status !== 'graded').length
    };

    return (
      <CardGrid cols={4} className="mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('total_assignments')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('pending')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('submitted')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('overdue')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
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
              <h1 className="text-3xl font-bold text-gray-900">{t('assignments')}</h1>
              <p className="text-gray-600 mt-2">
                {isStudent ? t('manage_your_assignments') :
                 isTeacher ? t('manage_class_assignments') :
                 t('view_all_assignments')}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {(isTeacher || isStudent) && (
                <button
                  onClick={() => navigate(isTeacher ? '/assignments/create' : '/assignments/submissions')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isTeacher ? t('create_assignment') : t('my_submissions')}
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
              placeholder={t('search_assignments')}
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
        ) : filteredAssignments.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('no_assignments_found')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? t('try_changing_filters')
                : t('no_assignments_yet')}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id}>
                {renderAssignmentCard(assignment)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;