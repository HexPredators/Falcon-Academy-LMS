import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Target, TrendingUp, Calendar, Clock, Award, Star, Eye, Bookmark, ChevronRight, Filter, Download, Share2, RefreshCw, BarChart, Trophy, Flame, Zap, TrendingDown } from 'lucide-react';
import Button from '../../Common/Button';
import Modal from '../../Common/Modal';
import LoadingSpinner from '../../Common/LoadingSpinner';

const ReadingProgress = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const timeRanges = [
    { id: 'week', name: t('progress.thisWeek') },
    { id: 'month', name: t('progress.thisMonth') },
    { id: 'quarter', name: t('progress.thisQuarter') },
    { id: 'year', name: t('progress.thisYear') },
    { id: 'all', name: t('progress.allTime') },
  ];

  useEffect(() => {
    fetchProgressData();
  }, [selectedTimeRange]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockData = {
          overview: {
            totalBooks: 24,
            booksCompleted: 8,
            totalPages: 5860,
            pagesRead: 3420,
            readingTime: 128,
            averageRating: 4.6,
            currentStreak: 14,
            longestStreak: 32,
            rank: 3,
            percentile: 95,
          },
          readingGoals: {
            daily: { target: 30, current: 28, unit: 'pages' },
            weekly: { target: 200, current: 195, unit: 'pages' },
            monthly: { target: 800, current: 720, unit: 'pages' },
            yearly: { target: 10000, current: 3420, unit: 'pages' },
          },
          readingHistory: [
            { date: '2024-02-20', pages: 45, time: 90, books: ['Advanced Mathematics'] },
            { date: '2024-02-19', pages: 38, time: 75, books: ['Ethiopian History'] },
            { date: '2024-02-18', pages: 52, time: 105, books: ['Physics Textbook'] },
            { date: '2024-02-17', pages: 28, time: 55, books: ['Amharic Literature'] },
            { date: '2024-02-16', pages: 65, time: 130, books: ['Chemistry Manual', 'English Grammar'] },
            { date: '2024-02-15', pages: 42, time: 85, books: ['Economics Book'] },
            { date: '2024-02-14', pages: 35, time: 70, books: ['Biology Encyclopedia'] },
          ],
          booksInProgress: [
            {
              id: 1,
              title: 'Advanced Mathematics for Grade 11',
              author: 'Dr. Alemayehu Tekle',
              thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
              progress: 65,
              pagesRead: 208,
              totalPages: 320,
              lastRead: '2 hours ago',
              estimatedCompletion: '3 days',
              readingSpeed: '32 pages/day',
              category: 'mathematics',
            },
            {
              id: 2,
              title: 'Physics for Natural Science',
              author: 'Dr. Michael Worku',
              thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
              progress: 30,
              pagesRead: 126,
              totalPages: 420,
              lastRead: '1 day ago',
              estimatedCompletion: '10 days',
              readingSpeed: '28 pages/day',
              category: 'science',
            },
            {
              id: 3,
              title: 'Chemistry Laboratory Manual',
              author: 'Dr. Sofia Mengistu',
              thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
              progress: 45,
              pagesRead: 81,
              totalPages: 180,
              lastRead: '3 days ago',
              estimatedCompletion: '4 days',
              readingSpeed: '20 pages/day',
              category: 'science',
            },
          ],
          completedBooks: [
            {
              id: 4,
              title: 'Ethiopian History & Geography',
              author: 'Professor Selamawit Bekele',
              thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
              completedDate: '2024-02-15',
              rating: 4.6,
              readingTime: 25,
              pages: 280,
              notes: 'Excellent overview of Ethiopian history',
            },
            {
              id: 5,
              title: 'Amharic Literature Collection',
              author: 'ደስታየሁ ወልደሚካኤል',
              thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
              completedDate: '2024-02-10',
              rating: 4.8,
              readingTime: 42,
              pages: 380,
              notes: 'Beautiful collection of classic works',
            },
            {
              id: 6,
              title: 'English Grammar Guide',
              author: 'Mr. John Smith',
              thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
              completedDate: '2024-02-05',
              rating: 4.4,
              readingTime: 18,
              pages: 260,
              notes: 'Great reference for grammar rules',
            },
          ],
          achievements: [
            { id: 1, title: 'Bookworm Beginner', description: 'Read 5 books', unlocked: true, icon: <BookOpen /> },
            { id: 2, title: 'Speed Reader', description: 'Read 50 pages in one day', unlocked: true, icon: <Zap /> },
            { id: 3, title: 'Consistent Scholar', description: '14-day reading streak', unlocked: true, icon: <Flame /> },
            { id: 4, title: 'Genre Explorer', description: 'Read from 3 different categories', unlocked: true, icon: <Target /> },
            { id: 5, title: 'Page Turner', description: 'Read 1000 pages', unlocked: true, icon: <BookOpen /> },
            { id: 6, title: 'Weekend Warrior', description: 'Read on 4 consecutive weekends', unlocked: false, icon: <Trophy /> },
            { id: 7, title: 'Night Owl', description: 'Read after 10 PM', unlocked: false, icon: <Star /> },
            { id: 8, title: 'Early Bird', description: 'Read before 6 AM', unlocked: false, icon: <Award /> },
          ],
          stats: {
            averageDailyPages: 42,
            favoriteCategory: 'Science',
            readingTimeDistribution: {
              morning: 25,
              afternoon: 35,
              evening: 30,
              night: 10,
            },
            completionRate: 78,
            retentionRate: 92,
          },
        };

        setProgressData(mockData);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error loading progress data:', error);
      setLoading(false);
    }
  };

  const calculateGoalProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (percentage >= 70) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const formatReadingTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const exportProgressReport = () => {
    const report = `
      FALCON ACADEMY - READING PROGRESS REPORT
      Generated: ${new Date().toLocaleDateString()}
      
      OVERVIEW:
      • Books Completed: ${progressData.overview.booksCompleted}/${progressData.overview.totalBooks}
      • Pages Read: ${progressData.overview.pagesRead}/${progressData.overview.totalPages}
      • Total Reading Time: ${formatReadingTime(progressData.overview.readingTime)}
      • Current Streak: ${progressData.overview.currentStreak} days
      
      GOALS:
      • Daily: ${progressData.readingGoals.daily.current}/${progressData.readingGoals.daily.target} pages
      • Weekly: ${progressData.readingGoals.weekly.current}/${progressData.readingGoals.weekly.target} pages
      • Monthly: ${progressData.readingGoals.monthly.current}/${progressData.readingGoals.monthly.target} pages
      
      BOOKS IN PROGRESS:
      ${progressData.booksInProgress.map(book => 
        `• ${book.title}: ${book.progress}% complete`
      ).join('\n')}
      
      ACHIEVEMENTS UNLOCKED:
      ${progressData.achievements.filter(a => a.unlocked).map(a => 
        `• ${a.title}: ${a.description}`
      ).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading-progress-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{t('progress.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('progress.readingProgress')}</h1>
            <p className="text-gray-600">{t('progress.trackYourJourney')}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={exportProgressReport}
              variant="outline"
              className="px-6"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('progress.exportReport')}
            </Button>
            <Button
              onClick={() => setShowStats(true)}
              variant="outline"
              className="px-6"
            >
              <BarChart className="w-5 h-5 mr-2" />
              {t('progress.viewStats')}
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {timeRanges.map(range => (
              <button
                key={range.id}
                onClick={() => setSelectedTimeRange(range.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTimeRange === range.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-2" />
            Last updated: 2 hours ago
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{t('progress.booksCompleted')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.overview.booksCompleted}<span className="text-gray-500">/{progressData.overview.totalBooks}</span>
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(progressData.overview.booksCompleted / progressData.overview.totalBooks) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{t('progress.pagesRead')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.overview.pagesRead.toLocaleString()}
              </p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-sm text-gray-600">
            {((progressData.overview.pagesRead / progressData.overview.totalPages) * 100).toFixed(1)}% complete
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{t('progress.readingTime')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatReadingTime(progressData.overview.readingTime)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-sm text-gray-600">
            {t('progress.totalTimeSpent')}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{t('progress.currentStreak')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.overview.currentStreak} days
              </p>
            </div>
            <Flame className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="text-sm text-gray-600">
            Best: {progressData.overview.longestStreak} days
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{t('progress.yourRank')}</p>
              <p className="text-2xl font-bold text-gray-900">
                #{progressData.overview.rank}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-red-400" />
          </div>
          <div className="text-sm text-gray-600">
            Top {progressData.overview.percentile}%
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Reading Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reading Goals */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('progress.readingGoals')}</h2>
              <Target className="w-6 h-6 text-gray-400" />
            </div>
            
            <div className="space-y-6">
              {Object.entries(progressData.readingGoals).map(([key, goal]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900 capitalize">{key}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {t('progress.target')}: {goal.target} {goal.unit}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getProgressColor(calculateGoalProgress(goal.current, goal.target))}`}
                      style={{ width: `${calculateGoalProgress(goal.current, goal.target)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{t('progress.progress')}: {calculateGoalProgress(goal.current, goal.target).toFixed(1)}%</span>
                    <span>{goal.target - goal.current} {goal.unit} {t('progress.toGo')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Books in Progress */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('progress.booksInProgress')}</h2>
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              {progressData.booksInProgress.map(book => (
                <div 
                  key={book.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
                      <span className="text-sm text-gray-600">{book.lastRead}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{book.pagesRead}/{book.totalPages} {t('progress.pages')}</span>
                        <span className="font-medium">{book.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(book.progress)}`}
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{t('progress.speed')}: {book.readingSpeed}</span>
                        <span>{t('progress.estCompletion')}: {book.estimatedCompletion}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Achievements & History */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('progress.achievements')}</h2>
              <Award className="w-6 h-6 text-purple-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {progressData.achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl text-center ${
                    achievement.unlocked
                      ? 'bg-white shadow-sm'
                      : 'bg-white/50 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reading History */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('progress.recentHistory')}</h2>
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              {progressData.readingHistory.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{day.pages} {t('progress.pages')}</div>
                    <div className="text-sm text-gray-600">{formatReadingTime(day.time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Books */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('progress.recentlyCompleted')}</h2>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>

            <div className="space-y-4">
              {progressData.completedBooks.map(book => (
                <div key={book.id} className="flex items-center gap-3">
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {book.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{book.rating}</span>
                      <span>•</span>
                      <span>{formatReadingTime(book.readingTime)}</span>
                      <span>•</span>
                      <span>{new Date(book.completedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <Modal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          title={selectedBook.title}
          size="md"
        >
          <div className="space-y-6">
            <div className="flex gap-4">
              <img
                src={selectedBook.thumbnail}
                alt={selectedBook.title}
                className="w-32 h-40 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedBook.title}</h3>
                <p className="text-gray-600 mb-4">{selectedBook.author}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('progress.progress')}</span>
                    <span className="font-bold text-gray-900">{selectedBook.progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('progress.pagesRead')}</span>
                    <span className="font-bold text-gray-900">
                      {selectedBook.pagesRead}/{selectedBook.totalPages}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('progress.readingSpeed')}</span>
                    <span className="font-bold text-gray-900">{selectedBook.readingSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('progress.estimatedCompletion')}</span>
                    <span className="font-bold text-green-600">{selectedBook.estimatedCompletion}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(selectedBook.progress)}`}
                style={{ width: `${selectedBook.progress}%` }}
              ></div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {/* Navigate to reading */}}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t('progress.continueReading')}
              </Button>
              <Button
                onClick={() => setSelectedBook(null)}
                variant="outline"
                className="flex-1"
              >
                {t('progress.close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detailed Statistics Modal */}
      {showStats && (
        <Modal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          title={t('progress.detailedStatistics')}
          size="lg"
        >
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">{t('progress.averageDailyPages')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.stats.averageDailyPages}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">{t('progress.favoriteCategory')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.stats.favoriteCategory}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">{t('progress.completionRate')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.stats.completionRate}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">{t('progress.retentionRate')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.stats.retentionRate}%
                </p>
              </div>
            </div>

            {/* Reading Time Distribution */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{t('progress.readingTimeDistribution')}</h4>
              <div className="space-y-3">
                {Object.entries(progressData.stats.readingTimeDistribution).map(([time, percentage]) => (
                  <div key={time}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">{time}</span>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          time === 'morning' ? 'bg-yellow-500' :
                          time === 'afternoon' ? 'bg-green-500' :
                          time === 'evening' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Trends */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{t('progress.readingTrends')}</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('progress.weeklyIncrease')}</p>
                      <p className="text-sm text-gray-600">+12% more pages this week</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold">+12%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('progress.readingSpeed')}</p>
                      <p className="text-sm text-gray-600">32 pages per hour average</p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-bold">32/hr</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('progress.mostProductiveDay')}</p>
                      <p className="text-sm text-gray-600">Saturday</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 font-bold">Sat</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setShowStats(false)}
                variant="outline"
              >
                {t('progress.close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReadingProgress;