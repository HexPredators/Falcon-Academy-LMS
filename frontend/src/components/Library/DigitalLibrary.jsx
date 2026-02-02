import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Grid, List, Star, BookOpen, TrendingUp, Clock, Download, Eye, Share2, Heart, Bookmark, ArrowUpDown, ChevronDown, Plus, Menu, X, Calendar, User, Hash, BookMarked } from 'lucide-react';
import BookCard from './BookCard';
import Button from '../../Common/Button';
import Modal from '../../Common/Modal';
import LoadingSpinner from '../../Common/LoadingSpinner';

const DigitalLibrary = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState(null);

  const categories = [
    { id: 'all', name: t('library.allCategories'), icon: <BookOpen className="w-4 h-4" />, count: 0 },
    { id: 'mathematics', name: t('library.mathematics'), icon: <Hash className="w-4 h-4" />, count: 124 },
    { id: 'science', name: t('library.science'), icon: <TrendingUp className="w-4 h-4" />, count: 89 },
    { id: 'literature', name: t('library.literature'), icon: <BookMarked className="w-4 h-4" />, count: 156 },
    { id: 'history', name: t('library.history'), icon: <Calendar className="w-4 h-4" />, count: 67 },
    { id: 'languages', name: t('library.languages'), icon: <User className="w-4 h-4" />, count: 92 },
    { id: 'reference', name: t('library.reference'), icon: <BookOpen className="w-4 h-4" />, count: 45 },
    { id: 'fiction', name: t('library.fiction'), icon: <Star className="w-4 h-4" />, count: 203 },
  ];

  const grades = [
    { id: 'all', name: t('library.allGrades') },
    { id: '9', name: t('library.grade9') },
    { id: '10', name: t('library.grade10') },
    { id: '11', name: t('library.grade11'), streams: ['Natural', 'Social'] },
    { id: '12', name: t('library.grade12'), streams: ['Natural', 'Social'] },
  ];

  const sortOptions = [
    { id: 'recent', name: t('library.mostRecent') },
    { id: 'popular', name: t('library.mostPopular') },
    { id: 'title', name: t('library.title') },
    { id: 'author', name: t('library.author') },
    { id: 'rating', name: t('library.highestRated') },
    { id: 'reads', name: t('library.mostReads') },
  ];

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, selectedGrade, sortBy]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockBooks = [
          {
            id: 1,
            title: 'Advanced Mathematics for Grade 11',
            author: 'Dr. Alemayehu Tekle',
            category: 'mathematics',
            grade: '11',
            stream: 'Natural',
            thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
            description: 'Complete mathematics textbook covering calculus, algebra, and geometry for Grade 11 Natural Science students.',
            pages: 320,
            fileSize: '24.5 MB',
            fileType: 'pdf',
            rating: 4.8,
            reviews: 124,
            reads: 2456,
            isNew: true,
            isFeatured: true,
            tags: ['Calculus', 'Algebra', 'Natural Science'],
            uploadedAt: '2024-02-15',
            readingProgress: 65,
            isBookmarked: true,
            isLiked: true,
          },
          {
            id: 2,
            title: 'Ethiopian History & Geography',
            author: 'Professor Selamawit Bekele',
            category: 'history',
            grade: '10',
            thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
            description: 'Comprehensive guide to Ethiopian history, geography, and cultural heritage.',
            pages: 280,
            fileSize: '18.2 MB',
            fileType: 'pdf',
            rating: 4.6,
            reviews: 89,
            reads: 1876,
            isFeatured: true,
            tags: ['History', 'Geography', 'Ethiopia'],
            uploadedAt: '2024-02-10',
            readingProgress: 30,
            isBookmarked: false,
            isLiked: true,
          },
          {
            id: 3,
            title: 'Physics for Natural Science',
            author: 'Dr. Michael Worku',
            category: 'science',
            grade: '12',
            stream: 'Natural',
            thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w-400',
            description: 'Complete physics textbook covering mechanics, electromagnetism, and modern physics.',
            pages: 420,
            fileSize: '32.1 MB',
            fileType: 'pdf',
            rating: 4.9,
            reviews: 156,
            reads: 3120,
            isNew: true,
            tags: ['Physics', 'Mechanics', 'Electromagnetism'],
            uploadedAt: '2024-02-18',
            readingProgress: 0,
            isBookmarked: true,
            isLiked: false,
          },
          {
            id: 4,
            title: 'Amharic Literature Collection',
            author: 'ደስታየሁ ወልደሚካኤል',
            category: 'literature',
            grade: '9',
            thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
            description: 'Collection of classic and contemporary Amharic literature works.',
            pages: 380,
            fileSize: '28.7 MB',
            fileType: 'pdf',
            rating: 4.7,
            reviews: 203,
            reads: 4231,
            tags: ['Amharic', 'Literature', 'Poetry'],
            uploadedAt: '2024-01-28',
            readingProgress: 100,
            isBookmarked: false,
            isLiked: true,
          },
          {
            id: 5,
            title: 'Chemistry Laboratory Manual',
            author: 'Dr. Sofia Mengistu',
            category: 'science',
            grade: '11',
            stream: 'Natural',
            thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
            description: 'Practical laboratory manual for chemistry experiments and procedures.',
            pages: 180,
            fileSize: '15.3 MB',
            fileType: 'pdf',
            rating: 4.5,
            reviews: 67,
            reads: 1245,
            tags: ['Chemistry', 'Laboratory', 'Experiments'],
            uploadedAt: '2024-02-05',
            readingProgress: 45,
            isBookmarked: true,
            isLiked: false,
          },
          {
            id: 6,
            title: 'English Grammar Guide',
            author: 'Mr. John Smith',
            category: 'languages',
            grade: 'all',
            thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
            description: 'Comprehensive English grammar reference for all grade levels.',
            pages: 260,
            fileSize: '21.4 MB',
            fileType: 'pdf',
            rating: 4.4,
            reviews: 145,
            reads: 2987,
            tags: ['English', 'Grammar', 'Language'],
            uploadedAt: '2024-01-20',
            readingProgress: 80,
            isBookmarked: false,
            isLiked: false,
          },
          {
            id: 7,
            title: 'Economics for Social Science',
            author: 'Dr. Helen Teshome',
            category: 'reference',
            grade: '12',
            stream: 'Social',
            thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
            description: 'Economics principles and applications for Social Science students.',
            pages: 310,
            fileSize: '26.8 MB',
            fileType: 'pdf',
            rating: 4.6,
            reviews: 92,
            reads: 1654,
            isFeatured: true,
            tags: ['Economics', 'Social Science', 'Business'],
            uploadedAt: '2024-02-12',
            readingProgress: 20,
            isBookmarked: true,
            isLiked: true,
          },
          {
            id: 8,
            title: 'Biology Encyclopedia',
            author: 'Dr. Genet Assefa',
            category: 'science',
            grade: '10',
            thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
            description: 'Complete biology reference with illustrations and diagrams.',
            pages: 450,
            fileSize: '35.2 MB',
            fileType: 'pdf',
            rating: 4.8,
            reviews: 178,
            reads: 3456,
            isNew: true,
            tags: ['Biology', 'Science', 'Reference'],
            uploadedAt: '2024-02-20',
            readingProgress: 10,
            isBookmarked: false,
            isLiked: true,
          },
        ];

        const mockStats = {
          totalBooks: 856,
          totalReads: 125430,
          averageRating: 4.6,
          activeReaders: 1245,
          newThisMonth: 24,
          mostPopularCategory: 'Mathematics',
          topBook: 'Advanced Mathematics for Grade 11',
        };

        setBooks(mockBooks);
        setStats(mockStats);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading books:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || book.grade === selectedGrade;
    
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      case 'popular':
        return b.reads - a.reads;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'rating':
        return b.rating - a.rating;
      case 'reads':
        return b.reads - a.reads;
      default:
        return 0;
    }
  });

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleReadBook = (bookId) => {
    navigate(`/library/read/${bookId}`);
  };

  const handleDownloadBook = (book) => {
    alert(`Downloading ${book.title}`);
  };

  const handleShareBook = (book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author} on Falcon Academy Digital Library`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('library.linkCopied'));
    }
  };

  const handleLikeBook = (bookId) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, isLiked: !book.isLiked } : book
    ));
  };

  const handleBookmarkBook = (bookId) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, isBookmarked: !book.isBookmarked } : book
    ));
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedGrade('all');
    setSearchQuery('');
    setSortBy('recent');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{t('library.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('library.digitalLibrary')}</h1>
            <p className="text-gray-600">{t('library.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('library.uploadBook')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('library.totalBooks')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('library.totalReads')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.totalReads / 1000).toFixed(1)}K
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('library.averageRating')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('library.activeReaders')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeReaders}</p>
              </div>
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('library.newThisMonth')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
              </div>
              <Clock className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('library.topCategory')}</p>
                <p className="text-lg font-bold text-gray-900">{stats.mostPopularCategory}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('library.searchBooks')}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* View Toggle and Sort */}
          <div className="flex gap-3">
            <div className="hidden md:flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="md:hidden"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-6`}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">{t('library.filters')}</h3>
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
              >
                {t('library.clearAll')}
              </Button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">{t('library.categories')}</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    <span className="text-sm opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grades */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{t('library.grades')}</h4>
              <div className="flex flex-wrap gap-2">
                {grades.map(grade => (
                  <button
                    key={grade.id}
                    onClick={() => setSelectedGrade(grade.id)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedGrade === grade.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {grade.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {t('library.books')} <span className="text-gray-500">({sortedBooks.length})</span>
          </h2>
          <div className="text-sm text-gray-600">
            {t('library.showing')} {sortedBooks.length} {t('library.of')} {books.length}
          </div>
        </div>

        {sortedBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('library.noBooksFound')}</h3>
            <p className="text-gray-600 mb-6">{t('library.tryDifferentFilters')}</p>
            <Button onClick={clearFilters} variant="outline">
              {t('library.clearFilters')}
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                viewMode={viewMode}
                onRead={() => handleReadBook(book.id)}
                onDownload={() => handleDownloadBook(book)}
                onShare={() => handleShareBook(book)}
                onLike={() => handleLikeBook(book.id)}
                onBookmark={() => handleBookmarkBook(book.id)}
                onClick={() => handleBookClick(book)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                viewMode={viewMode}
                onRead={() => handleReadBook(book.id)}
                onDownload={() => handleDownloadBook(book)}
                onShare={() => handleShareBook(book)}
                onLike={() => handleLikeBook(book.id)}
                onBookmark={() => handleBookmarkBook(book.id)}
                onClick={() => handleBookClick(book)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <Modal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          title={selectedBook.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={selectedBook.thumbnail}
                alt={selectedBook.title}
                className="w-full md:w-1/3 h-64 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBook.title}</h3>
                <p className="text-gray-600 mb-4">{selectedBook.author}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {selectedBook.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    Grade {selectedBook.grade}
                  </span>
                  {selectedBook.stream && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {selectedBook.stream}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{t('library.pages')}</p>
                    <p className="font-bold text-gray-900">{selectedBook.pages}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{t('library.fileSize')}</p>
                    <p className="font-bold text-gray-900">{selectedBook.fileSize}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{t('library.rating')}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold text-gray-900">{selectedBook.rating}</span>
                      <span className="text-gray-500">({selectedBook.reviews})</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{t('library.reads')}</p>
                    <p className="font-bold text-gray-900">{selectedBook.reads.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">{t('library.description')}</h4>
              <p className="text-gray-700">{selectedBook.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">{t('library.tags')}</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBook.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleReadBook(selectedBook.id)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t('library.readNow')}
              </Button>
              <Button
                onClick={() => handleDownloadBook(selectedBook)}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-5 h-5 mr-2" />
                {t('library.download')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title={t('library.uploadBook')}
          size="lg"
        >
          <div className="p-6">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t('library.uploadFeatureComingSoon')}
              </h4>
              <p className="text-gray-600 mb-6">
                {t('library.uploadDescription')}
              </p>
              <Button onClick={() => setShowUploadModal(false)}>
                {t('library.close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DigitalLibrary;