import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUserRole } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Users, BookOpen, Award,
  Calendar, Clock, CheckCircle, AlertCircle, Bell,
  ChevronRight, FileText, BarChart3, Star, Target,
  GraduationCap, School, Book, UserCheck, Download,
  MessageSquare, Eye, Activity, Award as AwardIcon,
  Bookmark, Settings, HelpCircle, ExternalLink
} from 'lucide-react';
import Card, { CardGrid } from '../components/Common/Card';
import StatsCard from '../components/Common/StatsCard';
import Table from '../components/Common/Table';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isStudent, isTeacher, isParent, isDirector, 
    isSchoolAdmin, isSuperAdmin, roleName 
  } = useUserRole();
  const { t } = useLanguage();
  const { notifications, unreadCount, addNotification } = useNotifications();
  const { endpoints, loading: apiLoading } = useApi();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    loadDashboardData();
    loadRecentActivity();
    loadUpcomingEvents();
    loadQuickActions();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await endpoints.analytics.overview();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const loadRecentActivity = async () => {
    const mockActivity = [
      {
        id: 1,
        type: 'assignment_submitted',
        title: 'Mathematics Assignment Submitted',
        description: 'You submitted your assignment on Algebra',
        time: '2 hours ago',
        icon: FileText,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        id: 2,
        type: 'quiz_completed',
        title: 'Physics Quiz Completed',
        description: 'You scored 85% on the latest quiz',
        time: '1 day ago',
        icon: Award,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        id: 3,
        type: 'book_read',
        title: 'New Book Added to Library',
        description: 'Advanced Chemistry textbook available',
        time: '2 days ago',
        icon: BookOpen,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        id: 4,
        type: 'message_received',
        title: 'New Message from Teacher',
        description: 'Feedback on your recent submission',
        time: '3 days ago',
        icon: MessageSquare,
        color: 'text-pink-600',
        bgColor: 'bg-pink-100'
      }
    ];
    setRecentActivity(mockActivity);
  };

  const loadUpcomingEvents = async () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Mid-Term Exams',
        date: '2024-03-15',
        time: '09:00 AM',
        subject: 'All Subjects',
        type: 'exam',
        importance: 'high'
      },
      {
        id: 2,
        title: 'Parent-Teacher Meeting',
        date: '2024-03-20',
        time: '02:00 PM',
        subject: 'General',
        type: 'meeting',
        importance: 'medium'
      },
      {
        id: 3,
        title: 'Science Fair',
        date: '2024-03-25',
        time: '10:00 AM',
        subject: 'Science',
        type: 'event',
        importance: 'medium'
      },
      {
        id: 4,
        title: 'Assignment Deadline',
        date: '2024-03-12',
        time: '11:59 PM',
        subject: 'Mathematics',
        type: 'assignment',
        importance: 'high'
      }
    ];
    setUpcomingEvents(mockEvents);
  };

  const loadQuickActions = () => {
    const actions = [];
    
    if (isStudent) {
      actions.push(
        { id: 1, title: t('view_assignments'), icon: FileText, route: '/assignments', color: 'blue' },
        { id: 2, title: t('take_quiz'), icon: Award, route: '/quizzes', color: 'green' },
        { id: 3, title: t('access_library'), icon: BookOpen, route: '/library', color: 'purple' },
        { id: 4, title: t('check_grades'), icon: TrendingUp, route: '/analytics', color: 'orange' }
      );
    } else if (isTeacher) {
      actions.push(
        { id: 1, title: t('create_assignment'), icon: FileText, route: '/assignments/create', color: 'blue' },
        { id: 2, title: t('create_quiz'), icon: Award, route: '/quizzes/create', color: 'green' },
        { id: 3, title: t('grade_submissions'), icon: CheckCircle, route: '/assignments/grading', color: 'purple' },
        { id: 4, title: t('view_analytics'), icon: BarChart3, route: '/analytics', color: 'orange' }
      );
    } else if (isParent) {
      actions.push(
        { id: 1, title: t('view_child_progress'), icon: TrendingUp, route: '/parent/progress', color: 'blue' },
        { id: 2, title: t('check_attendance'), icon: UserCheck, route: '/parent/attendance', color: 'green' },
        { id: 3, title: t('view_grades'), icon: Award, route: '/parent/grades', color: 'purple' },
        { id: 4, title: t('contact_teacher'), icon: MessageSquare, route: '/messages', color: 'orange' }
      );
    } else if (isDirector || isSchoolAdmin || isSuperAdmin) {
      actions.push(
        { id: 1, title: t('manage_users'), icon: Users, route: '/admin/users', color: 'blue' },
        { id: 2, title: t('view_reports'), icon: BarChart3, route: '/analytics', color: 'green' },
        { id: 3, title: t('system_settings'), icon: Settings, route: '/admin/settings', color: 'purple' },
        { id: 4, title: t('manage_content'), icon: BookOpen, route: '/admin/content', color: 'orange' }
      );
    }
    
    setQuickActions(actions);
  };

  const renderWelcomeSection = () => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = t('good_morning');
    
    if (hour >= 12 && hour < 17) {
      greeting = t('good_afternoon');
    } else if (hour >= 17) {
      greeting = t('good_evening');
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {user?.firstName || t('user')}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              {t('welcome_to_dashboard', { role: roleName })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            
            <div className="hidden lg:flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{roleName}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStatsCards = () => {
    if (apiLoading || !dashboardData) {
      return (
        <CardGrid cols={4}>
          {[1, 2, 3, 4].map(i => (
            <Card key={i} loading className="h-32" />
          ))}
        </CardGrid>
      );
    }

    const stats = [];

    if (isStudent) {
      stats.push(
        {
          title: t('average_score'),
          value: '85.5',
          change: '+2.3',
          changeType: 'percent',
          icon: TrendingUp,
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600'
        },
        {
          title: t('assignments_completed'),
          value: '24',
          change: '+3',
          changeType: 'absolute',
          icon: CheckCircle,
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600'
        },
        {
          title: t('attendance_rate'),
          value: '96',
          change: '+1.2',
          changeType: 'percent',
          icon: UserCheck,
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        },
        {
          title: t('books_read'),
          value: '12',
          change: '+2',
          changeType: 'absolute',
          icon: BookOpen,
          iconBgColor: 'bg-orange-100',
          iconColor: 'text-orange-600'
        }
      );
    } else if (isTeacher) {
      stats.push(
        {
          title: t('total_students'),
          value: '156',
          change: '+12',
          changeType: 'absolute',
          icon: Users,
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600'
        },
        {
          title: t('assignments_graded'),
          value: '84',
          change: '+8',
          changeType: 'absolute',
          icon: CheckCircle,
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600'
        },
        {
          title: t('average_class_score'),
          value: '78.2',
          change: '+3.1',
          changeType: 'percent',
          icon: TrendingUp,
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        },
        {
          title: t('pending_grading'),
          value: '12',
          change: '-4',
          changeType: 'absolute',
          icon: AlertCircle,
          iconBgColor: 'bg-red-100',
          iconColor: 'text-red-600'
        }
      );
    } else if (isParent) {
      stats.push(
        {
          title: t('child_average'),
          value: '88.5',
          change: '+1.5',
          changeType: 'percent',
          icon: TrendingUp,
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600'
        },
        {
          title: t('attendance'),
          value: '95',
          change: '+0.5',
          changeType: 'percent',
          icon: UserCheck,
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600'
        },
        {
          title: t('assignments_missing'),
          value: '2',
          change: '-1',
          changeType: 'absolute',
          icon: AlertCircle,
          iconBgColor: 'bg-red-100',
          iconColor: 'text-red-600'
        },
        {
          title: t('messages_unread'),
          value: '3',
          change: '+1',
          changeType: 'absolute',
          icon: MessageSquare,
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        }
      );
    } else {
      stats.push(
        {
          title: t('total_users'),
          value: '2,456',
          change: '+124',
          changeType: 'absolute',
          icon: Users,
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600'
        },
        {
          title: t('active_students'),
          value: '1,845',
          change: '+89',
          changeType: 'absolute',
          icon: GraduationCap,
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600'
        },
        {
          title: t('total_assignments'),
          value: '4,231',
          change: '+256',
          changeType: 'absolute',
          icon: FileText,
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        },
        {
          title: t('system_uptime'),
          value: '99.9',
          change: '+0.1',
          changeType: 'percent',
          icon: Activity,
          iconBgColor: 'bg-orange-100',
          iconColor: 'text-orange-600'
        }
      );
    }

    return (
      <CardGrid cols={4}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </CardGrid>
    );
  };

  const renderQuickActions = () => {
    return (
      <Card title={t('quick_actions')} icon={Target} className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.route)}
              className={`p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 text-left group`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                action.color === 'blue' ? 'from-blue-500 to-blue-600' :
                action.color === 'green' ? 'from-green-500 to-green-600' :
                action.color === 'purple' ? 'from-purple-500 to-purple-600' :
                'from-orange-500 to-orange-600'
              } flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {action.title}
              </h3>
              <div className="flex items-center text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{t('get_started')}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </Card>
    );
  };

  const renderRecentActivity = () => {
    const columns = [
      { key: 'activity', title: t('activity'), render: (item) => (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        </div>
      )},
      { key: 'time', title: t('time'), render: (item) => (
        <span className="text-sm text-gray-500">{item.time}</span>
      )},
      { key: 'actions', title: t('actions'), render: (item) => (
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {t('view_details')}
        </button>
      )}
    ];

    return (
      <Card 
        title={t('recent_activity')} 
        icon={Clock}
        headerAction={
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {t('view_all')}
          </button>
        }
        className="mb-6"
      >
        <Table
          columns={columns}
          data={recentActivity}
          compact
          showHeader={false}
        />
      </Card>
    );
  };

  const renderUpcomingEvents = () => {
    return (
      <Card title={t('upcoming_events')} icon={Calendar} className="mb-6">
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${
                  event.importance === 'high' ? 'bg-red-100' : 'bg-blue-100'
                } flex flex-col items-center justify-center`}>
                  <span className="text-lg font-bold text-gray-900">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                    <span>•</span>
                    <span>{event.subject}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.type === 'exam' ? 'bg-red-100 text-red-800' :
                event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderPerformanceChart = () => {
    if (!isStudent && !isTeacher && !isParent) return null;

    const performanceData = [
      { month: 'Jan', score: 75 },
      { month: 'Feb', score: 78 },
      { month: 'Mar', score: 82 },
      { month: 'Apr', score: 85 },
      { month: 'May', score: 88 },
      { month: 'Jun', score: 90 }
    ];

    return (
      <Card title={t('performance_trend')} icon={TrendingUp} className="mb-6">
        <div className="h-64 flex items-end space-x-2">
          {performanceData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
                style={{ height: `${(item.score / 100) * 200}px` }}
              ></div>
              <span className="text-sm text-gray-500 mt-2">{item.month}</span>
              <span className="text-xs font-medium text-gray-900">{item.score}%</span>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderHelpSection = () => {
    return (
      <Card title={t('need_help')} icon={HelpCircle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{t('user_guide')}</p>
                <p className="text-sm text-gray-500">{t('learn_how_to_use')}</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{t('contact_support')}</p>
                <p className="text-sm text-gray-500">{t('get_help_from_team')}</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {renderWelcomeSection()}
        {renderStatsCards()}
        {renderQuickActions()}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {renderRecentActivity()}
            {renderPerformanceChart()}
          </div>
          <div>
            {renderUpcomingEvents()}
            {renderHelpSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;