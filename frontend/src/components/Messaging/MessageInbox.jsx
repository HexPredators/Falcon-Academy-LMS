import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Inbox, Send, Star, Archive, Trash2, Users, UserCheck, AlertCircle,
  MoreVertical, Check, CheckCheck, Clock, Pin, Mail, MailOpen, Reply, Forward,
  Download, Eye, EyeOff, ChevronRight, Calendar, Tag, Bell, BellOff, X, Plus,
  RefreshCw, ArrowUpDown, MessageSquare, MessageCircle, Shield, Bookmark, BookmarkCheck
} from 'lucide-react';
import MessageCard from './MessageCard';
import MessageComposer from './MessageComposer';
import Button from '../../Common/Button';
import Modal from '../../Common/Modal';
import LoadingSpinner from '../../Common/LoadingSpinner';

const MessageInbox = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    category: 'all',
    priority: 'all',
    dateRange: 'all',
    unreadOnly: false,
    starredOnly: false,
  });

  const tabs = [
    { id: 'inbox', name: t('messaging.inbox'), icon: <Inbox className="w-4 h-4" />, count: 0 },
    { id: 'sent', name: t('messaging.sent'), icon: <Send className="w-4 h-4" />, count: 0 },
    { id: 'starred', name: t('messaging.starred'), icon: <Star className="w-4 h-4" />, count: 0 },
    { id: 'important', name: t('messaging.important'), icon: <AlertCircle className="w-4 h-4" />, count: 0 },
    { id: 'archived', name: t('messaging.archived'), icon: <Archive className="w-4 h-4" />, count: 0 },
    { id: 'trash', name: t('messaging.trash'), icon: <Trash2 className="w-4 h-4" />, count: 0 },
  ];

  const categories = [
    { id: 'academic', name: t('messaging.academic'), color: 'bg-blue-100 text-blue-800' },
    { id: 'announcement', name: t('messaging.announcement'), color: 'bg-green-100 text-green-800' },
    { id: 'assignment', name: t('messaging.assignment'), color: 'bg-purple-100 text-purple-800' },
    { id: 'grade', name: t('messaging.grade'), color: 'bg-yellow-100 text-yellow-800' },
    { id: 'parent', name: t('messaging.parent'), color: 'bg-red-100 text-red-800' },
    { id: 'general', name: t('messaging.general'), color: 'bg-gray-100 text-gray-800' },
  ];

  const priorities = [
    { id: 'high', name: t('messaging.high'), color: 'bg-red-100 text-red-800' },
    { id: 'medium', name: t('messaging.medium'), color: 'bg-yellow-100 text-yellow-800' },
    { id: 'low', name: t('messaging.low'), color: 'bg-blue-100 text-blue-800' },
  ];

  useEffect(() => {
    fetchMessages();
  }, [selectedTab, filterOptions]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockMessages = [
          {
            id: 1,
            sender: {
              name: 'Mr. Alemayehu',
              role: 'teacher',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
              id: 'TCH001',
            },
            recipients: [
              { name: 'ደመሰሰ ታደሰ', role: 'student', id: 'S2023001' },
              { name: 'ሙሉጌታ አባይ', role: 'student', id: 'S2023002' },
              { name: 'ትንሳኤ መኮንን', role: 'student', id: 'S2023003' },
            ],
            subject: 'Assignment Feedback: Algebra Homework',
            preview: 'Great work on the algebra assignment. I\'ve provided detailed feedback...',
            body: 'Great work on the algebra assignment. I\'ve provided detailed feedback on your solutions. Please review my comments and let me know if you have any questions.',
            category: 'assignment',
            priority: 'high',
            timestamp: '2024-02-20 14:30:00',
            read: true,
            starred: true,
            important: true,
            archived: false,
            hasAttachment: true,
            attachments: [
              { name: 'feedback.pdf', size: '2.4 MB', type: 'pdf' },
            ],
            replies: 3,
            tags: ['algebra', 'feedback', 'homework'],
          },
          {
            id: 2,
            sender: {
              name: 'ደመሰሰ ታደሰ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demesese',
              id: 'S2023001',
            },
            recipient: {
              name: 'Mr. Alemayehu',
              role: 'teacher',
              id: 'TCH001',
            },
            subject: 'Question about Problem #3',
            preview: 'Sir, I\'m having trouble understanding problem #3 from yesterday\'s assignment...',
            body: 'Sir, I\'m having trouble understanding problem #3 from yesterday\'s assignment. Could you please explain the solution in more detail?',
            category: 'academic',
            priority: 'medium',
            timestamp: '2024-02-20 10:15:00',
            read: false,
            starred: false,
            important: false,
            archived: false,
            hasAttachment: false,
            tags: ['question', 'algebra', 'help'],
          },
          {
            id: 3,
            sender: {
              name: 'School Administration',
              role: 'admin',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
              id: 'ADM001',
            },
            recipients: 'all_students',
            subject: 'Important Announcement: Exam Schedule',
            preview: 'The final exam schedule for Semester 2 has been published...',
            body: 'The final exam schedule for Semester 2 has been published. Please check the notice board for details.',
            category: 'announcement',
            priority: 'high',
            timestamp: '2024-02-19 09:00:00',
            read: true,
            starred: true,
            important: true,
            archived: false,
            hasAttachment: true,
            attachments: [
              { name: 'exam_schedule.pdf', size: '1.8 MB', type: 'pdf' },
            ],
            tags: ['exam', 'schedule', 'important'],
          },
          {
            id: 4,
            sender: {
              name: 'ሙሉጌታ አባይ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mulugata',
              id: 'S2023002',
            },
            recipient: {
              name: 'ደመሰሰ ታደሰ',
              role: 'student',
              id: 'S2023001',
            },
            subject: 'Study Group Meeting',
            preview: 'Hey, are you free tomorrow for our math study group?',
            body: 'Hey, are you free tomorrow for our math study group? I found some practice problems we can work on.',
            category: 'general',
            priority: 'low',
            timestamp: '2024-02-19 16:45:00',
            read: true,
            starred: false,
            important: false,
            archived: false,
            tags: ['study', 'group', 'math'],
          },
          {
            id: 5,
            sender: {
              name: 'Parent: Mrs. Tadese',
              role: 'parent',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Parent',
              id: 'PAR001',
            },
            recipient: {
              name: 'Mr. Alemayehu',
              role: 'teacher',
              id: 'TCH001',
            },
            subject: 'Regarding my child\'s progress',
            preview: 'I would like to schedule a meeting to discuss my child\'s academic progress...',
            body: 'I would like to schedule a meeting to discuss my child\'s academic progress. Please let me know your availability.',
            category: 'parent',
            priority: 'medium',
            timestamp: '2024-02-18 11:30:00',
            read: true,
            starred: false,
            important: true,
            archived: false,
            tags: ['parent', 'meeting', 'progress'],
          },
          {
            id: 6,
            sender: {
              name: 'Mr. Zerihun',
              role: 'director',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zerihun',
              id: 'DIR001',
            },
            recipients: 'all_teachers',
            subject: 'Staff Meeting Reminder',
            preview: 'Reminder: Staff meeting this Friday at 2 PM in the conference room...',
            body: 'Reminder: Staff meeting this Friday at 2 PM in the conference room. Attendance is mandatory.',
            category: 'announcement',
            priority: 'high',
            timestamp: '2024-02-18 08:15:00',
            read: true,
            starred: true,
            important: true,
            archived: true,
            tags: ['staff', 'meeting', 'reminder'],
          },
        ];

        const mockStats = {
          total: 156,
          unread: 12,
          starred: 24,
          important: 18,
          today: 8,
          thisWeek: 45,
          categories: {
            academic: 56,
            announcement: 23,
            assignment: 34,
            grade: 18,
            parent: 15,
            general: 10,
          },
        };

        // Filter messages based on selected tab
        let filteredMessages = [...mockMessages];
        
        if (selectedTab === 'inbox') {
          filteredMessages = filteredMessages.filter(m => !m.archived && !m.sender?.role?.includes('current'));
        } else if (selectedTab === 'sent') {
          filteredMessages = filteredMessages.filter(m => m.sender?.role?.includes('current'));
        } else if (selectedTab === 'starred') {
          filteredMessages = filteredMessages.filter(m => m.starred);
        } else if (selectedTab === 'important') {
          filteredMessages = filteredMessages.filter(m => m.important);
        } else if (selectedTab === 'archived') {
          filteredMessages = filteredMessages.filter(m => m.archived);
        } else if (selectedTab === 'trash') {
          filteredMessages = filteredMessages.filter(m => m.deleted);
        }

        // Apply additional filters
        if (filterOptions.category !== 'all') {
          filteredMessages = filteredMessages.filter(m => m.category === filterOptions.category);
        }
        
        if (filterOptions.priority !== 'all') {
          filteredMessages = filteredMessages.filter(m => m.priority === filterOptions.priority);
        }
        
        if (filterOptions.unreadOnly) {
          filteredMessages = filteredMessages.filter(m => !m.read);
        }
        
        if (filterOptions.starredOnly) {
          filteredMessages = filteredMessages.filter(m => m.starred);
        }

        // Update tab counts
        const updatedTabs = tabs.map(tab => ({
          ...tab,
          count: mockMessages.filter(m => {
            if (tab.id === 'inbox') return !m.archived && !m.deleted;
            if (tab.id === 'starred') return m.starred;
            if (tab.id === 'important') return m.important;
            if (tab.id === 'archived') return m.archived;
            return false;
          }).length,
        }));

        setMessages(filteredMessages);
        setStats(mockStats);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(m => m.id));
    }
  };

  const handleMarkAsRead = () => {
    setMessages(prev =>
      prev.map(message =>
        selectedMessages.includes(message.id) ? { ...message, read: true } : message
      )
    );
    setSelectedMessages([]);
  };

  const handleMarkAsUnread = () => {
    setMessages(prev =>
      prev.map(message =>
        selectedMessages.includes(message.id) ? { ...message, read: false } : message
      )
    );
    setSelectedMessages([]);
  };

  const handleStarMessage = () => {
    setMessages(prev =>
      prev.map(message =>
        selectedMessages.includes(message.id) ? { ...message, starred: !message.starred } : message
      )
    );
    setSelectedMessages([]);
  };

  const handleArchiveMessage = () => {
    setMessages(prev =>
      prev.map(message =>
        selectedMessages.includes(message.id) ? { ...message, archived: !message.archived } : message
      )
    );
    setSelectedMessages([]);
  };

  const handleDeleteMessage = () => {
    setMessages(prev => prev.filter(message => !selectedMessages.includes(message.id)));
    setSelectedMessages([]);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic
  };

  const clearFilters = () => {
    setFilterOptions({
      category: 'all',
      priority: 'all',
      dateRange: 'all',
      unreadOnly: false,
      starredOnly: false,
    });
  };

  const openMessageThread = (message) => {
    setSelectedThread(message);
  };

  const refreshMessages = () => {
    fetchMessages();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{t('messaging.loading')}</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('messaging.messages')}</h1>
            <p className="text-gray-600">{t('messaging.communicationCenter')}</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowComposer(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('messaging.newMessage')}
            </Button>
            
            <Button
              onClick={refreshMessages}
              variant="outline"
              className="px-6"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('messaging.totalMessages')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Inbox className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('messaging.unread')}</p>
                <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              </div>
              <Mail className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('messaging.starred')}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.starred}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('messaging.important')}</p>
                <p className="text-2xl font-bold text-green-600">{stats.important}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('messaging.today')}</p>
                <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('messaging.thisWeek')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Tabs & Filters */}
        <div className="lg:w-64 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center justify-between w-full px-6 py-4 text-left transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span className="font-medium">{tab.name}</span>
                </div>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedTab === tab.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('messaging.categories')}</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilterOptions(prev => ({ ...prev, category: category.id }))}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                    filterOptions.category === category.id
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${category.color.split(' ')[0]}`}></span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {stats.categories[category.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('messaging.quickActions')}</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowComposer(true)}
                className="w-full p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">{t('messaging.newMessage')}</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">{t('messaging.filterMessages')}</span>
              </button>
              <button
                onClick={() => {/* Mark all as read */}}
                className="w-full p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 transition-colors"
              >
                <CheckCheck className="w-5 h-5" />
                <span className="font-medium">{t('messaging.markAllRead')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Actions Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Selection Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMessages.length === messages.length && messages.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedMessages.length > 0
                      ? `${selectedMessages.length} ${t('messaging.selected')}`
                      : t('messaging.selectAll')}
                  </span>
                </div>

                {selectedMessages.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleMarkAsRead}
                      className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                    >
                      <CheckCheck className="w-4 h-4 inline mr-1" />
                      {t('messaging.markRead')}
                    </button>
                    <button
                      onClick={handleMarkAsUnread}
                      className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                    >
                      <Mail className="w-4 h-4 inline mr-1" />
                      {t('messaging.markUnread')}
                    </button>
                    <button
                      onClick={handleStarMessage}
                      className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
                    >
                      <Star className="w-4 h-4 inline mr-1" />
                      {t('messaging.star')}
                    </button>
                    <button
                      onClick={handleArchiveMessage}
                      className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                    >
                      <Archive className="w-4 h-4 inline mr-1" />
                      {t('messaging.archive')}
                    </button>
                    <button
                      onClick={handleDeleteMessage}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      {t('messaging.delete')}
                    </button>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder={t('messaging.searchMessages')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('messaging.noMessages')}
                </h3>
                <p className="text-gray-600 mb-6">{t('messaging.noMessagesDesc')}</p>
                <Button
                  onClick={() => setShowComposer(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {t('messaging.composeMessage')}
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map(message => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    isSelected={selectedMessages.includes(message.id)}
                    onSelect={() => handleSelectMessage(message.id)}
                    onClick={() => openMessageThread(message)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {messages.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                {t('messaging.showing')} 1-{messages.length} {t('messaging.of')} {messages.length}
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  {t('messaging.previous')}
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  {t('messaging.next')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Composer Modal */}
      {showComposer && (
        <MessageComposer
          isOpen={showComposer}
          onClose={() => setShowComposer(false)}
          onSend={(message) => {
            console.log('Message sent:', message);
            setShowComposer(false);
          }}
        />
      )}

      {/* Message Thread Modal */}
      {selectedThread && (
        <Modal
          isOpen={!!selectedThread}
          onClose={() => setSelectedThread(null)}
          title={selectedThread.subject}
          size="xl"
        >
          <div className="space-y-6">
            {/* Message Header */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedThread.sender.avatar}
                    alt={selectedThread.sender.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{selectedThread.sender.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        selectedThread.sender.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        selectedThread.sender.role === 'student' ? 'bg-green-100 text-green-800' :
                        selectedThread.sender.role === 'parent' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedThread.sender.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t('messaging.to')}: {selectedThread.recipient?.name || t('messaging.multipleRecipients')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(selectedThread.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(selectedThread.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  selectedThread.priority === 'high' ? 'bg-red-100 text-red-800' :
                  selectedThread.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedThread.priority} {t('messaging.priority')}
                </span>
                {selectedThread.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedThread.body}</p>
            </div>

            {/* Attachments */}
            {selectedThread.hasAttachment && selectedThread.attachments && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('messaging.attachments')}</h4>
                <div className="space-y-2">
                  {selectedThread.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold">PDF</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-600">{file.size}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                        {t('messaging.download')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => {
                  setShowComposer(true);
                  setSelectedThread(null);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Reply className="w-5 h-5 mr-2" />
                {t('messaging.reply')}
              </Button>
              <Button
                onClick={() => {
                  setShowComposer(true);
                  setSelectedThread(null);
                }}
                variant="outline"
                className="flex-1"
              >
                <Forward className="w-5 h-5 mr-2" />
                {t('messaging.forward')}
              </Button>
              <Button
                onClick={() => {
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === selectedThread.id ? { ...m, starred: !m.starred } : m
                    )
                  );
                  setSelectedThread(null);
                }}
                variant="outline"
              >
                <Star className={`w-5 h-5 ${selectedThread.starred ? 'fill-current text-yellow-500' : ''}`} />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title={t('messaging.filterMessages')}
          size="md"
        >
          <div className="space-y-6">
            {/* Priority Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{t('messaging.priority')}</h4>
              <div className="space-y-2">
                {priorities.map(priority => (
                  <label key={priority.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={priority.id}
                      checked={filterOptions.priority === priority.id}
                      onChange={(e) => setFilterOptions(prev => ({ ...prev, priority: e.target.value }))}
                      className="text-blue-600"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm ${priority.color}`}>
                      {priority.name}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value="all"
                    checked={filterOptions.priority === 'all'}
                    onChange={(e) => setFilterOptions(prev => ({ ...prev, priority: e.target.value }))}
                    className="text-blue-600"
                  />
                  <span>{t('messaging.allPriorities')}</span>
                </label>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{t('messaging.dateRange')}</h4>
              <div className="grid grid-cols-2 gap-2">
                {['today', 'week', 'month', 'year', 'all'].map(range => (
                  <button
                    key={range}
                    onClick={() => setFilterOptions(prev => ({ ...prev, dateRange: range }))}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      filterOptions.dateRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(`messaging.${range}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOptions.unreadOnly}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, unreadOnly: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('messaging.unreadOnly')}</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOptions.starredOnly}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, starredOnly: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('messaging.starredOnly')}</span>
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                onClick={clearFilters}
                variant="outline"
              >
                {t('messaging.clearFilters')}
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="outline"
                >
                  {t('messaging.cancel')}
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {t('messaging.applyFilters')}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MessageInbox;