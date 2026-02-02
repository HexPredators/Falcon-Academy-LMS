import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserRole } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../contexts/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Filter, Plus, Download, Eye,
  Star, Users, Calendar, Clock, ChevronRight, Book,
  FileText, Film, Music, Image as ImageIcon, Globe,
  ChevronDown, ChevronUp, X, TrendingUp, Bookmark,
  Share2, Heart, MoreVertical, GraduationCap, Hash
} from 'lucide-react';
import Card, { CardGrid } from '../components/Common/Card';
import Button from '../components/Common/Button';

const Library = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isStudent, isTeacher, isParent, isLibrarian } = useUserRole();
  const { t } = useLanguage();
  const { endpoints, loading: apiLoading } = useApi();
  
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState({
    category: 'all',
    subject: 'all',
    grade: 'all',
    language: 'all',
    type: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const categories = [
    { value: 'all', label: t('all_categories') },
    { value: 'academic', label: t('academic'), icon: GraduationCap, color: 'blue' },
    { value: 'fiction', label: t('fiction'), icon: Book, color: 'purple' },
    { value: 'non_fiction', label: t('non_fiction'), icon: BookOpen, color: 'green' },
    { value: 'reference', label: t('reference'), icon: FileText, color: 'orange' },
    { value: 'video', label: t('video'), icon: Film, color: 'pink' },
    { value: 'audio', label: t('audio'), icon: Music, color: 'indigo' }
  ];

  const languages = [
    { value: 'all', label: t('all_languages') },
    { value: 'en', label: t('english') },
    { value: 'am', label: t('amharic') },
    { value: 'om', label: t('oromo') },
    { value: 'ti', label: t('tigrinya') }
  ];

  const types = [
    { value: 'all', label: t('all_types') },
    { value: 'ebook', label: t('ebook'), icon: BookOpen },
    { value: 'pdf', label: t('pdf'), icon: FileText },
    { value: 'video', label: t('video'), icon: Film },
    { value: 'audio', label: t('audio'), icon: Music },
    { value: 'presentation', label: t('presentation'), icon: FileText }
  ];

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, debouncedSearch, filters, sortConfig]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await endpoints.library.books();
      setBooks(data);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...books];

    if (debouncedSearch) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        book.author.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        book.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        book.subject?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(book => book.category === filters.category);
    }

    if (filters.subject !== 'all') {
      filtered = filtered.filter(book => book.subject === filters.subject);
    }

    if (filters.grade !== 'all') {
      filtered = filtered.filter(book => book.grade === parseInt(filters.grade));
    }

    if (filters.language !== 'all') {
      filtered = filtered.filter(book => book.language === filters.language);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(book => book.type === filters.type);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'publicationYear' || sortConfig.key === 'rating') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    setFilteredBooks(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: 'all',
      subject: 'all',
      grade: 'all',
      language: 'all',
      type: 'all'
    });
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : BookOpen;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      pink: 'bg-pink-100 text-pink-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };
    return colors[cat?.color || 'blue'];
  };

  const getTypeIcon = (type) => {
    const typeConfig = types.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : FileText;
  };

  const renderBookCard = (book) => {
    const CategoryIcon = getCategoryIcon(book.category);
    const TypeIcon = getTypeIcon(book.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200"
      >
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-16 h-16 text-blue-400" />
            )}
          </div>
          
          <div className="absolute top-3 right-3 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(book.category)}`}>
              <CategoryIcon className="w-3 h-3 inline mr-1" />
              {categories.find(c => c.value === book.category)?.label}
            </span>
            {book.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 inline mr-1" />
                {t('featured')}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {t('by')} {book.author}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {book.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <TypeIcon className="w-4 h-4 mr-1" />
                {book.type}
              </span>
              <span className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                {book.language}
              </span>
              {book.grade && (
                <span className="flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  {t('grade')} {book.grade}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{book.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <div className="flex items-center">
                <Download className="w-3 h-3 mr-1" />
                {book.downloadCount || 0} {t('downloads')}
              </div>
              <div className="flex items-center mt-1">
                <Eye className="w-3 h-3 mr-1" />
                {book.viewCount || 0} {t('views')}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/library/${book.id}`)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                title={t('view_details')}
              >
                <Eye className="w-5 h-5" />
              </button>
              
              {book.downloadAllowed && (
                <button
                  onClick={() => handleDownload(book.id)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
                  title={t('download')}
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={() => navigate(`/library/${book.id}/read`)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t('read')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderBookList = (book) => {
    const CategoryIcon = getCategoryIcon(book.category);
    const TypeIcon = getTypeIcon(book.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 mb-4"
      >
        <div className="flex items-start">
          <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-5 flex-shrink-0">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <BookOpen className="w-12 h-12 text-blue-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(book.category)}`}>
                    <CategoryIcon className="w-3 h-3 inline mr-1" />
                    {categories.find(c => c.value === book.category)?.label}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {book.type}
                  </span>
                  {book.isFeatured && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 inline mr-1" />
                      {t('featured')}
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 text-xl mb-1">
                  {book.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('by')} {book.author} • {book.publicationYear} • {book.pages} {t('pages')}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{book.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {book.downloadCount || 0} {t('downloads')}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {book.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {book.language}
                </span>
                {book.subject && (
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {book.subject}
                  </span>
                )}
                {book.grade && (
                  <span className="flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    {t('grade')} {book.grade}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/library/${book.id}`)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                  title={t('view_details')}
                >
                  <Eye className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => navigate(`/library/${book.id}/read`)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('read')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const handleDownload = async (bookId) => {
    try {
      await endpoints.library.download(bookId);
    } catch (error) {
      console.error('Download failed:', error);
    }
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
              {t('category')}
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(option => (
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
              <option value="all">{t('all_subjects')}</option>
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic'].map(subject => (
                <option key={subject} value={subject.toLowerCase()}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          
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
              {t('language')}
            </label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {languages.map(option => (
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
              {types.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStats = () => {
    const stats = {
      total: books.length,
      academic: books.filter(b => b.category === 'academic').length,
      digital: books.filter(b => b.type === 'ebook' || b.type === 'pdf').length,
      languages: [...new Set(books.map(b => b.language))].length
    };

    return (
      <CardGrid cols={4} className="mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('total_resources')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('academic_resources')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.academic}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('digital_books')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.digital}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('languages')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.languages}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </CardGrid>
    );
  };

  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {categories.filter(c => c.value !== 'all').map((category) => (
          <button
            key={category.value}
            onClick={() => handleFilterChange('category', category.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
              filters.category === category.value
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('digital_library')}</h1>
              <p className="text-gray-600 mt-2">
                {t('access_educational_resources')}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {(isTeacher || isLibrarian) && (
                <button
                  onClick={() => navigate('/library/upload')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('upload_resource')}
                </button>
              )}
              
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <div className="grid grid-cols-2 gap-1 w-5 h-5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`${viewMode === 'grid' ? 'bg-gray-600' : 'bg-gray-400'} rounded`}></div>
                    ))}
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <div className="space-y-1 w-5 h-5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`${viewMode === 'list' ? 'bg-gray-600' : 'bg-gray-400'} h-1 rounded`}></div>
                    ))}
                  </div>
                </button>
              </div>
              
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
              placeholder={t('search_library')}
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

        {renderCategoryTabs()}
        
        {showFilters && renderFilters()}
        
        {renderStats()}

        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`${viewMode === 'grid' ? 'h-80' : 'h-40'} bg-gray-200 rounded-xl animate-pulse`}></div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('no_books_found')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? t('try_changing_filters')
                : t('no_books_yet')}
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
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
            >
              {filteredBooks.map((book) => (
                viewMode === 'grid' ? renderBookCard(book) : renderBookList(book)
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Library;