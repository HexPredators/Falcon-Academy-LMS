import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Sun, Moon, Bookmark, Settings, Download, Printer, Share2,
  Search, BookmarkCheck, Volume2, Eye, EyeOff, Clock,
  FileText, Menu, X, Maximize2, Minimize2, RotateCw,
  Type, Columns, ChevronUp, ChevronDown, MoreVertical,
  Flag, MessageSquare, Highlight, PenTool, Undo,
  Home, ArrowLeft, ArrowRight, RefreshCw, CheckCircle
} from 'lucide-react';
import Button from '../../Common/Button';
import Modal from '../../Common/Modal';
import LoadingSpinner from '../../Common/LoadingSpinner';

const BookReader = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(320);
  const [bookmarks, setBookmarks] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  // Reader Settings
  const [settings, setSettings] = useState({
    theme: 'light',
    fontSize: 16,
    fontFamily: 'serif',
    lineHeight: 1.6,
    columnLayout: 'single',
    fullscreen: false,
    showProgress: true,
    showNavigation: true,
    autoScroll: false,
    scrollSpeed: 1,
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const readerRef = useRef(null);
  const contentRef = useRef(null);
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    fetchBook();
    startReadingTimer();
    
    return () => {
      stopAutoScroll();
      clearReadingTimer();
    };
  }, []);

  useEffect(() => {
    updateReadingProgress();
    saveReadingProgress();
  }, [currentPage]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockBook = {
          id: parseInt(id),
          title: 'Advanced Mathematics for Grade 11',
          author: 'Dr. Alemayehu Tekle',
          subject: 'Mathematics',
          grade: '11',
          stream: 'Natural',
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
          description: 'Complete mathematics textbook covering calculus, algebra, and geometry.',
          totalPages: 320,
          fileSize: '24.5 MB',
          language: 'English',
          publishedYear: 2023,
          chapters: [
            { id: 1, title: 'Introduction to Calculus', pages: '1-25' },
            { id: 2, title: 'Differential Equations', pages: '26-50' },
            { id: 3, title: 'Integral Calculus', pages: '51-75' },
            { id: 4, title: 'Linear Algebra', pages: '76-100' },
            { id: 5, title: 'Probability & Statistics', pages: '101-125' },
          ],
          tableOfContents: [
            'Chapter 1: Introduction to Calculus',
            '1.1 Limits and Continuity',
            '1.2 Derivatives',
            '1.3 Applications of Derivatives',
            'Chapter 2: Differential Equations',
            '2.1 First Order Equations',
            '2.2 Second Order Equations',
            'Chapter 3: Integral Calculus',
            '3.1 Definite Integrals',
            '3.2 Applications of Integration',
          ],
        };

        // Mock bookmarks and notes
        const mockBookmarks = [
          { id: 1, page: 25, title: 'Limits Definition', note: 'Important concept' },
          { id: 2, page: 48, title: 'Derivative Rules', note: 'Need to memorize' },
          { id: 3, page: 72, title: 'Integration Techniques', note: 'Practice problems' },
        ];

        const mockHighlights = [
          { id: 1, page: 15, text: 'The derivative measures the rate of change...', color: 'yellow' },
          { id: 2, page: 32, text: 'Fundamental Theorem of Calculus...', color: 'blue' },
          { id: 3, page: 67, text: 'Integration by substitution method...', color: 'green' },
        ];

        const mockNotes = [
          { id: 1, page: 20, text: 'Need to review L\'Hôpital\'s rule', date: '2024-02-20' },
          { id: 2, page: 45, text: 'Excellent explanation of chain rule', date: '2024-02-21' },
        ];

        setBook(mockBook);
        setBookmarks(mockBookmarks);
        setHighlights(mockHighlights);
        setNotes(mockNotes);
        setTotalPages(mockBook.totalPages);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading book:', error);
      setLoading(false);
    }
  };

  const startReadingTimer = () => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 60000); // Update every minute
    return timer;
  };

  const clearReadingTimer = () => {
    // Save reading time to localStorage or API
    localStorage.setItem(`reading_time_${id}`, readingTime.toString());
  };

  const updateReadingProgress = () => {
    const progress = (currentPage / totalPages) * 100;
    setReadingProgress(progress);
  };

  const saveReadingProgress = () => {
    // Save progress to localStorage or API
    localStorage.setItem(`book_progress_${id}`, JSON.stringify({
      page: currentPage,
      progress: readingProgress,
      lastRead: new Date().toISOString(),
    }));
  };

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  const toggleBookmark = () => {
    const existingBookmark = bookmarks.find(b => b.page === currentPage);
    if (existingBookmark) {
      setBookmarks(bookmarks.filter(b => b.id !== existingBookmark.id));
    } else {
      const newBookmark = {
        id: bookmarks.length + 1,
        page: currentPage,
        title: `Page ${currentPage}`,
        note: '',
        createdAt: new Date().toISOString(),
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const addHighlight = (text, color = 'yellow') => {
    const newHighlight = {
      id: highlights.length + 1,
      page: currentPage,
      text,
      color,
      createdAt: new Date().toISOString(),
    };
    setHighlights([...highlights, newHighlight]);
  };

  const addNote = (text) => {
    const newNote = {
      id: notes.length + 1,
      page: currentPage,
      text,
      date: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'sepia'
    }));
  };

  const toggleFullscreen = () => {
    if (!settings.fullscreen) {
      if (readerRef.current.requestFullscreen) {
        readerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setSettings(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval.current = setInterval(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop += settings.scrollSpeed;
        
        // Check if reached bottom
        if (contentRef.current.scrollTop + contentRef.current.clientHeight >= contentRef.current.scrollHeight) {
          nextPage();
          if (contentRef.current) {
            contentRef.current.scrollTop = 0;
          }
        }
      }
    }, 50);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Simulate search API call
      setTimeout(() => {
        const mockResults = [
          { page: 15, context: 'The derivative measures the rate of change of a function...' },
          { page: 32, context: 'Derivative rules including chain rule and product rule...' },
          { page: 45, context: 'Applications of derivatives in optimization problems...' },
          { page: 67, context: 'Higher order derivatives and their significance...' },
        ];
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      console.error('Search failed:', error);
      setIsSearching(false);
    }
  };

  const formatReadingTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getThemeClasses = () => {
    switch(settings.theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-white">{t('reader.loadingBook')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={readerRef} className={`fixed inset-0 ${getThemeClasses()} transition-colors duration-300`}>
      {/* Top Navigation Bar */}
      <div className={`h-16 px-4 flex items-center justify-between border-b ${
        settings.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/library')}
            className={`p-2 rounded-lg ${
              settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="font-bold text-lg truncate max-w-md">
              {book.title}
            </h1>
            <p className="text-sm opacity-75">
              {book.author} • Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reading Stats */}
          <div className={`hidden md:flex items-center gap-4 px-4 py-2 rounded-lg ${
            settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className="text-center">
              <div className="text-sm font-medium">{readingProgress.toFixed(1)}%</div>
              <div className="text-xs opacity-75">{t('reader.progress')}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{formatReadingTime(readingTime)}</div>
              <div className="text-xs opacity-75">{t('reader.time')}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg ${
              bookmarks.some(b => b.page === currentPage)
                ? 'text-yellow-500'
                : settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.bookmark')}
          >
            <Bookmark className={`w-5 h-5 ${
              bookmarks.some(b => b.page === currentPage) ? 'fill-current' : ''
            }`} />
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg ${
              settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.settings')}
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg hidden md:block ${
              settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.fullscreen')}
          >
            {settings.fullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Reader Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Table of Contents */}
        <div className={`w-64 border-r ${
          settings.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        } hidden lg:block overflow-y-auto`}>
          <div className="p-4">
            <h3 className="font-bold mb-4">{t('reader.tableOfContents')}</h3>
            <div className="space-y-2">
              {book.tableOfContents.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(Math.floor(Math.random() * totalPages) + 1)}
                  className={`block w-full text-left p-2 rounded-lg text-sm ${
                    settings.theme === 'dark'
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Bookmarks Section */}
            <div className="mt-8">
              <h4 className="font-bold mb-3 flex items-center justify-between">
                <span>{t('reader.bookmarks')}</span>
                <BookmarkCheck className="w-4 h-4" />
              </h4>
              <div className="space-y-2">
                {bookmarks.slice(0, 5).map(bookmark => (
                  <button
                    key={bookmark.id}
                    onClick={() => goToPage(bookmark.page)}
                    className={`block w-full text-left p-2 rounded-lg text-sm ${
                      settings.theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Page {bookmark.page}</div>
                    <div className="text-xs opacity-75 truncate">{bookmark.note || bookmark.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Book Content */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={contentRef}
            className="h-full overflow-y-auto"
            style={{
              fontSize: `${settings.fontSize}px`,
              fontFamily: settings.fontFamily,
              lineHeight: settings.lineHeight,
            }}
          >
            <div className="max-w-4xl mx-auto p-8">
              {/* Page Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Chapter {Math.ceil(currentPage / 64)}</h2>
                <div className="text-sm opacity-75">
                  Page {currentPage} • {book.title}
                </div>
              </div>

              {/* Simulated Book Content */}
              <div className={`space-y-6 ${
                settings.columnLayout === 'double' ? 'columns-2 gap-8' : ''
              }`}>
                <h3 className="text-xl font-bold">
                  {currentPage <= 25 ? 'Introduction to Calculus' :
                   currentPage <= 50 ? 'Differential Equations' :
                   currentPage <= 75 ? 'Integral Calculus' :
                   'Advanced Topics'}
                </h3>
                
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                
                {currentPage === 15 && (
                  <div className={`p-4 rounded-lg ${
                    settings.theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-50'
                  }`}>
                    <h4 className="font-bold mb-2">Definition: Derivative</h4>
                    <p>
                      The derivative of a function at a point measures the rate at which the function's value 
                      changes as its input changes. It is defined as the limit of the difference quotient.
                    </p>
                    <div className="mt-3 p-3 bg-gray-900 text-white rounded font-mono">
                      f'(x) = lim(h→0) [f(x+h) - f(x)] / h
                    </div>
                  </div>
                )}
                
                {currentPage === 32 && (
                  <div className={`p-4 rounded-lg ${
                    settings.theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
                  }`}>
                    <h4 className="font-bold mb-2">Fundamental Theorem of Calculus</h4>
                    <p>
                      The fundamental theorem of calculus links the concept of differentiating a function 
                      with the concept of integrating a function.
                    </p>
                  </div>
                )}
                
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>
              </div>

              {/* Page Footer */}
              <div className="mt-12 pt-6 border-t text-center text-sm opacity-75">
                Falcon Academy Digital Library • {book.subject} • Grade {book.grade}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools & Notes */}
        <div className={`w-64 border-l ${
          settings.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        } hidden lg:block overflow-y-auto`}>
          <div className="p-4">
            {/* Search */}
            <div className="mb-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" />
                {t('reader.search')}
              </h4>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t('reader.searchInBook')}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    settings.theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reading Tools */}
            <div className="mb-6">
              <h4 className="font-bold mb-3">{t('reader.tools')}</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleTheme}
                  className={`p-3 rounded-lg flex flex-col items-center ${
                    settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  title={t('reader.theme')}
                >
                  {settings.theme === 'dark' ? (
                    <Moon className="w-5 h-5 mb-1" />
                  ) : (
                    <Sun className="w-5 h-5 mb-1" />
                  )}
                  <span className="text-xs">{t('reader.theme')}</span>
                </button>

                <button
                  onClick={() => setSettings(prev => ({ ...prev, fontSize: prev.fontSize + 1 }))}
                  className={`p-3 rounded-lg flex flex-col items-center ${
                    settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  title={t('reader.fontSize')}
                >
                  <Type className="w-5 h-5 mb-1" />
                  <span className="text-xs">{t('reader.font')}</span>
                </button>

                <button
                  onClick={() => setSettings(prev => ({ ...prev, columnLayout: prev.columnLayout === 'single' ? 'double' : 'single' }))}
                  className={`p-3 rounded-lg flex flex-col items-center ${
                    settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  title={t('reader.columns')}
                >
                  <Columns className="w-5 h-5 mb-1" />
                  <span className="text-xs">{t('reader.columns')}</span>
                </button>

                <button
                  onClick={settings.autoScroll ? stopAutoScroll : startAutoScroll}
                  className={`p-3 rounded-lg flex flex-col items-center ${
                    settings.autoScroll
                      ? 'bg-blue-100 text-blue-700'
                      : settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  title={t('reader.autoScroll')}
                >
                  <RefreshCw className="w-5 h-5 mb-1" />
                  <span className="text-xs">{t('reader.scroll')}</span>
                </button>
              </div>
            </div>

            {/* Your Notes */}
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                {t('reader.yourNotes')}
              </h4>
              <div className="space-y-3">
                {notes.filter(note => Math.abs(note.page - currentPage) <= 5).map(note => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg ${
                      settings.theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-50'
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      Page {note.page} • {new Date(note.date).toLocaleDateString()}
                    </div>
                    <p className="text-sm">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className={`h-16 px-4 flex items-center justify-between border-t ${
        settings.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => goToPage(1)}
            className={`p-2 rounded-lg ${
              settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.firstPage')}
          >
            <Home className="w-5 h-5" />
          </button>

          <button
            onClick={previousPage}
            disabled={currentPage <= 1}
            className={`p-2 rounded-lg ${
              currentPage <= 1
                ? 'opacity-50 cursor-not-allowed'
                : settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.previousPage')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className={`w-16 px-2 py-1 rounded text-center ${
                settings.theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-300'
              } border`}
              min="1"
              max={totalPages}
            />
            <span className="opacity-75">/ {totalPages}</span>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className={`p-2 rounded-lg ${
              currentPage >= totalPages
                ? 'opacity-50 cursor-not-allowed'
                : settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.nextPage')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => goToPage(totalPages)}
            className={`p-2 rounded-lg ${
              settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.lastPage')}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-center mt-1">
            {readingProgress.toFixed(1)}% {t('reader.complete')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBookmarks(true)}
            className={`p-2 rounded-lg ${
              settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.allBookmarks')}
          >
            <BookmarkCheck className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowNotes(true)}
            className={`p-2 rounded-lg ${
              settings.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title={t('reader.addNote')}
          >
            <PenTool className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={t('reader.readerSettings')}
        size="md"
      >
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">{t('reader.theme')}</h4>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'sepia'].map(theme => (
                <button
                  key={theme}
                  onClick={() => setSettings(prev => ({ ...prev, theme }))}
                  className={`p-4 rounded-xl border-2 text-center capitalize ${
                    settings.theme === theme
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Font Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">{t('reader.fontSettings')}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {t('reader.fontSize')}: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {t('reader.fontFamily')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['serif', 'sans-serif', 'monospace'].map(font => (
                    <button
                      key={font}
                      onClick={() => setSettings(prev => ({ ...prev, fontFamily: font }))}
                      className={`p-3 rounded-lg border ${
                        settings.fontFamily === font
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {t('reader.lineHeight')}: {settings.lineHeight}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.2"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => setSettings(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Layout Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">{t('reader.layout')}</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.columnLayout === 'double'}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    columnLayout: e.target.checked ? 'double' : 'single' 
                  }))}
                  className="rounded"
                />
                <span>{t('reader.twoColumnLayout')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showProgress}
                  onChange={(e) => setSettings(prev => ({ ...prev, showProgress: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('reader.showProgressBar')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showNavigation}
                  onChange={(e) => setSettings(prev => ({ ...prev, showNavigation: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('reader.showNavigation')}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowSettings(false)}>
              {t('reader.apply')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bookmarks Modal */}
      <Modal
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        title={t('reader.yourBookmarks')}
        size="lg"
      >
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t('reader.noBookmarks')}
              </h4>
              <p className="text-gray-600">
                {t('reader.bookmarkDescription')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  {bookmarks.length} {t('reader.bookmarks')}
                </span>
                <Button
                  onClick={() => setBookmarks([])}
                  variant="outline"
                  size="sm"
                >
                  {t('reader.clearAll')}
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Page {bookmark.page}
                        </h4>
                        <p className="text-sm text-gray-600">{bookmark.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => goToPage(bookmark.page)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          {t('reader.goToPage')}
                        </button>
                        <button
                          onClick={() => setBookmarks(prev => prev.filter(b => b.id !== bookmark.id))}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          {t('reader.remove')}
                        </button>
                      </div>
                    </div>
                    {bookmark.note && (
                      <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-700">{bookmark.note}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Notes Modal */}
      <Modal
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        title={t('reader.addNote')}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('reader.noteForPage')} {currentPage}
            </label>
            <textarea
              placeholder={t('reader.typeYourNote')}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">{t('reader.recentNotes')}</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {notes
                .filter(note => Math.abs(note.page - currentPage) <= 10)
                .map(note => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Page {note.page}</span>
                      <span>{new Date(note.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-900">{note.text}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowNotes(false)}
              variant="outline"
            >
              {t('reader.cancel')}
            </Button>
            <Button onClick={() => {
              const textarea = document.querySelector('textarea');
              if (textarea?.value.trim()) {
                addNote(textarea.value);
                textarea.value = '';
              }
              setShowNotes(false);
            }}>
              {t('reader.saveNote')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookReader;