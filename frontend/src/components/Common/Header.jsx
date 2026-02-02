import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, Search, User, Settings, LogOut, Moon, Sun, Globe,
  ChevronDown, Menu, X, HelpCircle, Shield, Home, BookOpen,
  MessageSquare, Calendar, Star, TrendingUp, Users, Award,
  Activity, Target, Zap, Heart, Brain, Lock, Unlock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹' },
    { code: 'om', name: 'Afaan Oromoo', flag: '🇪🇹' },
    { code: 'ti', name: 'Tigrinya', flag: '🇪🇹' }
  ];

  const notifications = [
    { id: 1, title: 'New Assignment', message: 'Math homework due tomorrow', time: '10 min ago', read: false, icon: BookOpen },
    { id: 2, title: 'Grade Updated', message: 'Physics quiz results available', time: '1 hour ago', read: false, icon: TrendingUp },
    { id: 3, title: 'Message Received', message: 'New message from Mr. Alemu', time: '2 hours ago', read: true, icon: MessageSquare },
    { id: 4, title: 'Event Reminder', message: 'Parent-Teacher meeting tomorrow', time: '1 day ago', read: true, icon: Calendar }
  ];

  const quickActions = [
    { icon: Home, label: t('common.dashboard'), path: '/dashboard' },
    { icon: BookOpen, label: t('common.library'), path: '/library' },
    { icon: MessageSquare, label: t('common.messages'), path: '/messages' },
    { icon: Calendar, label: t('common.calendar'), path: '/calendar' }
  ];

  const userMenuItems = [
    { icon: User, label: t('common.profile'), path: '/profile' },
    { icon: Settings, label: t('common.settings'), path: '/settings' },
    { icon: Shield, label: t('common.privacy'), path: '/privacy' },
    { icon: HelpCircle, label: t('common.help'), path: '/help' },
    { icon: LogOut, label: t('common.logout'), action: logout }
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };

  const getUserRoleColor = () => {
    const role = user?.role;
    switch(role) {
      case 'admin': return 'from-red-500 to-red-600';
      case 'director': return 'from-yellow-500 to-yellow-600';
      case 'teacher': return 'from-blue-500 to-blue-600';
      case 'student': return 'from-green-500 to-green-600';
      case 'parent': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo & Search */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Falcon Academy
                </h1>
                <p className="text-xs text-gray-500">Digital Learning Management System</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:block w-96">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {t('common.search')}
                </button>
              </form>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={action.label}
                >
                  <action.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title={darkMode ? t('common.lightMode') : t('common.darkMode')}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{languages.find(l => l.code === i18n.language)?.flag || '🌐'}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 hidden group-hover:block">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                      i18n.language === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{t('common.notifications')}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {t('common.markAllRead')}
                        </button>
                        <Settings className="w-4 h-4 text-gray-500 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <notification.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/notifications')}
                      className="w-full text-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {t('common.viewAll')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getUserRoleColor()} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || t('common.user')}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || t('common.role')}</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getUserRoleColor()} flex items-center justify-center`}>
                        <span className="text-white font-bold">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{user?.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else if (item.path) {
                            navigate(item.path);
                          }
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-700">85%</div>
                        <div className="text-xs text-gray-600">{t('common.progress')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-700">24</div>
                        <div className="text-xs text-gray-600">{t('common.courses')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(action.path);
                    setShowMobileMenu(false);
                  }}
                  className="flex flex-col items-center p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <action.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{t('common.language')}</h4>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setShowMobileMenu(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
                      i18n.language === lang.code
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;