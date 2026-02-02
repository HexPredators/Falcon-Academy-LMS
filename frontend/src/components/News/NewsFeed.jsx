import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, Filter, Search, Calendar, Clock, Globe, Lock, Users, 
  GraduationCap, BookOpen, Plus, ChevronRight, RefreshCw, Eye,
  Star, TrendingUp, Pin, AlertCircle, Megaphone, Newspaper
} from 'lucide-react';
import NewsCard from './NewsCard';
import { useAuth } from '../../../hooks/useAuth';

const NewsFeed = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    visibility: 'all',
    category: 'all',
    grade: 'all',
    sortBy: 'latest',
    search: ''
  });

  const visibilityOptions = [
    { value: 'all', label: t('news.allVisibilities'), icon: Globe },
    { value: 'public', label: t('news.public'), icon: Globe },
    { value: 'school', label: t('news.school'), icon: Lock },
    { value: 'grade', label: t('news.gradeSpecific'), icon: GraduationCap },
    { value: 'section', label: t('news.sectionSpecific'), icon: Users }
  ];

  const categoryOptions = [
    { value: 'all', label: t('news.allCategories'), icon: Newspaper },
    { value: 'academic', label: t('news.academic'), icon: BookOpen },
    { value: 'events', label: t('news.events'), icon: Calendar },
    { value: 'announcements', label: t('news.announcements'), icon: Megaphone },
    { value: 'emergency', label: t('news.emergency'), icon: AlertCircle },
    { value: 'holidays', label: t('news.holidays'), icon: Calendar }
  ];

  const sortOptions = [
    { value: 'latest', label: t('news.latestFirst') },
    { value: 'oldest', label: t('news.oldestFirst') },
    { value: 'priority', label: t('news.highPriority') },
    { value: 'popular', label: t('news.mostViewed') }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [filters, news]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const mockNews = [
        {
          id: 1,
          title: "Mid-Term Examination Schedule",
          content: "The mid-term examinations for all grades will commence from next Monday. Please check your respective timetables.",
          author: "Academic Office",
          date: "2024-01-15T10:00:00",
          visibility: "school",
          category: "academic",
          priority: "high",
          views: 245,
          likes: 34,
          grade: "all",
          section: "all",
          pinned: true,
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop"
        },
        {
          id: 2,
          title: "Annual Sports Day Celebration",
          content: "Join us for the annual sports day celebration on February 20th. All students and parents are welcome.",
          author: "Sports Committee",
          date: "2024-01-14T14:30:00",
          visibility: "public",
          category: "events",
          priority: "medium",
          views: 189,
          likes: 42,
          grade: "all",
          section: "all",
          pinned: false,
          imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w-800&auto=format&fit=crop"
        }
      ];
      setNews(mockNews);
      setFilteredNews(mockNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = [...news];

    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.content.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.visibility !== 'all') {
      filtered = filtered.filter(item => item.visibility === filters.visibility);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.grade !== 'all') {
      filtered = filtered.filter(item => 
        item.grade === 'all' || item.grade === filters.grade
      );
    }

    if (filters.sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filters.sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    setFilteredNews(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    fetchNews();
  };

  const canCreateNews = ['admin', 'director', 'teacher'].includes(user?.role);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('news.newsFeed')}</h1>
                <p className="text-gray-600 mt-1">{t('news.stayUpdated')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('common.refresh')}</span>
              </button>
              
              {canCreateNews && (
                <button
                  onClick={() => console.log('Create news')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">{t('news.createNews')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">{t('news.totalNews')}</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">48</p>
                </div>
                <Newspaper className="w-10 h-10 text-blue-500 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">{t('news.today')}</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">5</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">{t('news.pinned')}</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">3</p>
                </div>
                <Pin className="w-10 h-10 text-purple-500 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">{t('news.emergency')}</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">2</p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('news.searchNews')}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Visibility Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t('news.visibility')}
                </div>
              </label>
              <select
                value={filters.visibility}
                onChange={(e) => handleFilterChange('visibility', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {visibilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {t('news.category')}
                </div>
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('news.sortBy')}
                </div>
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.visibility !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Globe className="w-3 h-3" />
                {visibilityOptions.find(v => v.value === filters.visibility)?.label}
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
                <Filter className="w-3 h-3" />
                {categoryOptions.find(c => c.value === filters.category)?.label}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
                <Search className="w-3 h-3" />
                {filters.search}
              </span>
            )}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(skeleton => (
              <div key={skeleton} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-6"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Newspaper className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('news.noNewsFound')}</h3>
            <p className="text-gray-600 mb-6">{t('news.tryDifferentFilters')}</p>
            <button
              onClick={() => setFilters({
                visibility: 'all',
                category: 'all',
                grade: 'all',
                sortBy: 'latest',
                search: ''
              })}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t('news.clearFilters')}
            </button>
          </div>
        ) : (
          <>
            {/* Pinned News */}
            {filteredNews.filter(n => n.pinned).length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Pin className="w-5 h-5 text-yellow-500 rotate-45" />
                  <h2 className="text-xl font-bold text-gray-900">{t('news.pinnedNews')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews.filter(n => n.pinned).map(newsItem => (
                    <NewsCard key={newsItem.id} news={newsItem} pinned />
                  ))}
                </div>
              </div>
            )}

            {/* All News */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t('news.allNews')}</h2>
                <span className="text-sm text-gray-600">
                  {filteredNews.length} {t('news.items')}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.filter(n => !n.pinned).map(newsItem => (
                  <NewsCard key={newsItem.id} news={newsItem} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;