import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Bell, CheckCircle, AlertCircle, Info, XCircle,
  MessageSquare, Calendar, Upload, Download, Award,
  Users, BookOpen, FileText, Clock, Star
} from 'lucide-react';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const notificationTypes = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  assignment: {
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  quiz: {
    icon: Award,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  message: {
    icon: MessageSquare,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  event: {
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  announcement: {
    icon: Bell,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  },
  grade: {
    icon: Star,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  }
};

export const NotificationProvider = ({ children }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      email: true,
      push: true,
      sound: true,
      desktop: true,
      types: {
        assignments: true,
        quizzes: true,
        messages: true,
        grades: true,
        announcements: true,
        events: true
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
    
    if (count > 0 && settings.sound) {
      playNotificationSound();
    }
  }, [notifications, settings.sound]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(() => {});
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      type: notification.type || 'info',
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      data: notification.data || {},
      read: false,
      createdAt: new Date().toISOString(),
      expiresAt: notification.expiresAt
    };

    if (shouldShowNotification(newNotification)) {
      setNotifications(prev => [newNotification, ...prev.slice(0, 99)]);
      
      if (settings.desktop && Notification.permission === 'granted') {
        showDesktopNotification(newNotification);
      }
    }

    return newNotification.id;
  };

  const shouldShowNotification = (notification) => {
    if (!settings.types) return true;
    
    switch (notification.type) {
      case 'assignment':
        return settings.types.assignments;
      case 'quiz':
        return settings.types.quizzes;
      case 'message':
        return settings.types.messages;
      case 'grade':
        return settings.types.grades;
      case 'announcement':
        return settings.types.announcements;
      case 'event':
        return settings.types.events;
      default:
        return true;
    }
  };

  const showDesktopNotification = (notification) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const clearExpired = () => {
    const now = new Date();
    setNotifications(prev =>
      prev.filter(notification => {
        if (!notification.expiresAt) return true;
        return new Date(notification.expiresAt) > now;
      })
    );
  };

  const showToast = (type, title, message) => {
    const config = {
      duration: 4000,
      position: 'top-right',
      icon: getNotificationIcon(type)
    };

    switch (type) {
      case 'success':
        toast.success(message, config);
        break;
      case 'error':
        toast.error(message, config);
        break;
      case 'warning':
        toast(message, { ...config, icon: '⚠️' });
        break;
      default:
        toast(message, config);
    }
  };

  const getNotificationIcon = (type) => {
    const typeConfig = notificationTypes[type] || notificationTypes.info;
    const Icon = typeConfig.icon;
    return <Icon className={`w-5 h-5 ${typeConfig.color}`} />;
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  const getRecentNotifications = (limit = 10) => {
    return notifications.slice(0, limit);
  };

  const requestPermission = () => {
    if (!('Notification' in window)) {
      return Promise.resolve(false);
    }
    
    return Notification.requestPermission();
  };

  const scheduleNotification = (notification, delayMs) => {
    setTimeout(() => {
      addNotification(notification);
    }, delayMs);
  };

  const getStatistics = () => {
    const total = notifications.length;
    const read = notifications.filter(n => n.read).length;
    const unread = total - read;
    
    const byType = {};
    notifications.forEach(notification => {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = notifications.filter(n => 
      new Date(n.createdAt) >= today
    ).length;

    return {
      total,
      read,
      unread,
      byType,
      todayCount
    };
  };

  const exportNotifications = () => {
    const data = {
      notifications,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNotifications = (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.notifications) {
        setNotifications(prev => [...parsed.notifications, ...prev]);
      }
      if (parsed.settings) {
        setSettings(parsed.settings);
      }
      return true;
    } catch (error) {
      console.error('Failed to import notifications:', error);
      return false;
    }
  };

  const value = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    clearExpired,
    showToast,
    updateSettings,
    getNotificationsByType,
    getRecentNotifications,
    getNotificationIcon,
    notificationTypes,
    requestPermission,
    scheduleNotification,
    getStatistics,
    exportNotifications,
    importNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;