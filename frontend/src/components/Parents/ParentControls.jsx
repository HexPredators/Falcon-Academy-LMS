import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield, Lock, Unlock, Users, UserCheck, UserX, Bell, BellOff,
  Eye, EyeOff, Clock, Calendar, Filter, Download, Print, Share2,
  Settings, RefreshCw, Save, Trash2, Edit, Plus, Search, AlertCircle,
  CheckCircle, XCircle, ChevronRight, ChevronDown, ExternalLink,
  MessageSquare, Mail, Phone, Home, School, GraduationCap, BookOpen,
  Award, TrendingUp, BarChart3, Target, Heart, Brain, Zap, Star
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const ParentControls = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [controls, setControls] = useState({
    notifications: {
      grades: true,
      assignments: true,
      attendance: true,
      messages: true,
      announcements: true,
      emergencies: true
    },
    privacy: {
      showGrades: true,
      showAttendance: true,
      showProfile: true,
      showProgress: true,
      allowMessaging: true,
      shareWithTeachers: true
    },
    restrictions: {
      dailyScreenTime: 180,
      bedtimeStart: '22:00',
      bedtimeEnd: '06:00',
      blockInappropriate: true,
      requireApproval: true,
      limitSocialMedia: true
    },
    communication: {
      emailFrequency: 'daily',
      smsAlerts: true,
      pushNotifications: true,
      weeklyReports: true,
      monthlySummary: true
    },
    permissions: {
      canPurchase: false,
      canDownload: true,
      canPrint: true,
      canShare: false,
      canEditProfile: false
    }
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingControl, setEditingControl] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchChildren();
    fetchControls();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const mockChildren = [
        {
          id: 1,
          name: 'Samuel Tekle',
          grade: '10',
          section: 'B',
          favId: 'FAV2023001',
          photo: 'ST',
          status: 'active',
          lastLogin: '2 hours ago',
          permissions: {
            canViewGrades: true,
            canViewAssignments: true,
            canMessageTeachers: true,
            canAccessLibrary: true
          }
        },
        {
          id: 2,
          name: 'Meron Abebe',
          grade: '11',
          section: 'A',
          favId: 'FAV2023002',
          photo: 'MA',
          status: 'active',
          lastLogin: '1 day ago',
          permissions: {
            canViewGrades: true,
            canViewAssignments: true,
            canMessageTeachers: false,
            canAccessLibrary: true
          }
        }
      ];
      setChildren(mockChildren);
      if (mockChildren.length > 0 && !selectedChild) {
        setSelectedChild(mockChildren[0]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchControls = async () => {
    try {
      // Mock controls data
      console.log('Fetching controls');
    } catch (error) {
      console.error('Error fetching controls:', error);
    }
  };

  const handleControlChange = (category, key, value) => {
    setControls(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveControls = async () => {
    setLoading(true);
    try {
      console.log('Saving controls:', controls);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(t('parents.controlsSaved'));
    } catch (error) {
      console.error('Error saving controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetControls = () => {
    if (window.confirm(t('parents.resetConfirmation'))) {
      const defaultControls = {
        notifications: {
          grades: true,
          assignments: true,
          attendance: true,
          messages: true,
          announcements: true,
          emergencies: true
        },
        privacy: {
          showGrades: true,
          showAttendance: true,
          showProfile: true,
          showProgress: true,
          allowMessaging: true,
          shareWithTeachers: true
        },
        restrictions: {
          dailyScreenTime: 180,
          bedtimeStart: '22:00',
          bedtimeEnd: '06:00',
          blockInappropriate: true,
          requireApproval: true,
          limitSocialMedia: true
        },
        communication: {
          emailFrequency: 'daily',
          smsAlerts: true,
          pushNotifications: true,
          weeklyReports: true,
          monthlySummary: true
        },
        permissions: {
          canPurchase: false,
          canDownload: true,
          canPrint: true,
          canShare: false,
          canEditProfile: false
        }
      };
      setControls(defaultControls);
    }
  };

  const handleEditControl = (category, key) => {
    setEditingControl({ category, key });
    setEditValue(controls[category][key]);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingControl) {
      handleControlChange(editingControl.category, editingControl.key, editValue);
    }
    setShowEditModal(false);
    setEditingControl(null);
    setEditValue('');
  };

  const getNotificationLabel = (key) => {
    const labels = {
      grades: t('parents.gradeUpdates'),
      assignments: t('parents.assignmentDeadlines'),
      attendance: t('parents.attendanceChanges'),
      messages: t('parents.newMessages'),
      announcements: t('parents.schoolAnnouncements'),
      emergencies: t('parents.emergencyAlerts')
    };
    return labels[key] || key;
  };

  const getPrivacyLabel = (key) => {
    const labels = {
      showGrades: t('parents.showGrades'),
      showAttendance: t('parents.showAttendance'),
      showProfile: t('parents.showProfile'),
      showProgress: t('parents.showProgress'),
      allowMessaging: t('parents.allowMessaging'),
      shareWithTeachers: t('parents.shareWithTeachers')
    };
    return labels[key] || key;
  };

  const getRestrictionLabel = (key) => {
    const labels = {
      dailyScreenTime: t('parents.dailyScreenTime'),
      bedtimeStart: t('parents.bedtimeStart'),
      bedtimeEnd: t('parents.bedtimeEnd'),
      blockInappropriate: t('parents.blockInappropriate'),
      requireApproval: t('parents.requireApproval'),
      limitSocialMedia: t('parents.limitSocialMedia')
    };
    return labels[key] || key;
  };

  const formatScreenTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('parents.parentalControls')}</h1>
                <p className="text-gray-600 mt-1">{t('parents.manageChildSettings')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleResetControls}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('parents.resetDefaults')}</span>
              </button>
              
              <button
                onClick={handleSaveControls}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span className="font-semibold">{t('common.save')}</span>
              </button>
            </div>
          </div>

          {/* Child Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('parents.selectChild')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    selectedChild?.id === child.id
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300'
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {child.photo}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      {child.status === 'active' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-gray-900">{child.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">Grade {child.grade} - Section {child.section}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {child.favId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{t('parents.lastLogin')}: {child.lastLogin}</span>
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-5 h-5 ${
                    selectedChild?.id === child.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(skeleton => (
              <div key={skeleton} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map(line => (
                    <div key={line} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Notifications Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-blue-600" />
                  {t('parents.notificationSettings')}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t('parents.receiveAlertsFor')}:</span>
                  <span className="font-bold text-blue-700">
                    {Object.values(controls.notifications).filter(v => v).length}/{Object.keys(controls.notifications).length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(controls.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                    <div className="flex items-center gap-3">
                      {value ? (
                        <Bell className="w-5 h-5 text-green-600" />
                      ) : (
                        <BellOff className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{getNotificationLabel(key)}</p>
                        <p className="text-sm text-gray-600">
                          {value ? t('parents.enabled') : t('parents.disabled')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleControlChange('notifications', key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-purple-600" />
                {t('parents.privacySettings')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(controls.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                    <div className="flex items-center gap-3">
                      {value ? (
                        <Eye className="w-5 h-5 text-green-600" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{getPrivacyLabel(key)}</p>
                        <p className="text-sm text-gray-600">
                          {value ? t('parents.visible') : t('parents.hidden')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleControlChange('privacy', key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-600" />
                  {t('parents.restrictions')}
                </h2>
                <button
                  onClick={() => handleEditControl('restrictions', 'dailyScreenTime')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">{t('parents.customize')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Screen Time */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-red-900">{t('parents.dailyScreenTime')}</h3>
                    </div>
                    <button
                      onClick={() => handleEditControl('restrictions', 'dailyScreenTime')}
                      className="p-2 hover:bg-red-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <p className="text-3xl font-bold text-red-700 mb-2">
                    {formatScreenTime(controls.restrictions.dailyScreenTime)}
                  </p>
                  <p className="text-sm text-red-800">
                    {t('parents.maximumAllowed')}
                  </p>
                </div>

                {/* Bedtime */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-900">{t('parents.bedtime')}</h3>
                    </div>
                    <button
                      onClick={() => handleEditControl('restrictions', 'bedtimeStart')}
                      className="p-2 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-blue-800">{t('parents.start')}</p>
                      <p className="text-xl font-bold text-blue-700">
                        {controls.restrictions.bedtimeStart}
                      </p>
                    </div>
                    <div className="text-gray-400">-</div>
                    <div>
                      <p className="text-sm text-blue-800">{t('parents.end')}</p>
                      <p className="text-xl font-bold text-blue-700">
                        {controls.restrictions.bedtimeEnd}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Filter */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-purple-600" />
                      <h3 className="font-bold text-purple-900">{t('parents.contentFilter')}</h3>
                    </div>
                    <button
                      onClick={() => handleControlChange('restrictions', 'blockInappropriate', !controls.restrictions.blockInappropriate)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        controls.restrictions.blockInappropriate ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        controls.restrictions.blockInappropriate ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-purple-700 mb-2">
                    {controls.restrictions.blockInappropriate ? t('parents.active') : t('parents.inactive')}
                  </p>
                  <p className="text-sm text-purple-800">
                    {t('parents.blocksInappropriateContent')}
                  </p>
                </div>
              </div>

              {/* Additional Restrictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.requireApproval')}</p>
                      <p className="text-sm text-gray-600">{t('parents.forPurchasesDownloads')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('restrictions', 'requireApproval', !controls.restrictions.requireApproval)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.restrictions.requireApproval ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.restrictions.requireApproval ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.limitSocialMedia')}</p>
                      <p className="text-sm text-gray-600">{t('parents.duringStudyHours')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('restrictions', 'limitSocialMedia', !controls.restrictions.limitSocialMedia)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.restrictions.limitSocialMedia ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.restrictions.limitSocialMedia ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-green-600" />
                {t('parents.communicationPreferences')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-gray-900">{t('parents.emailFrequency')}</h3>
                  </div>
                  <select
                    value={controls.communication.emailFrequency}
                    onChange={(e) => handleControlChange('communication', 'emailFrequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="instant">{t('parents.instant')}</option>
                    <option value="daily">{t('parents.daily')}</option>
                    <option value="weekly">{t('parents.weekly')}</option>
                    <option value="monthly">{t('parents.monthly')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.smsAlerts')}</p>
                      <p className="text-sm text-gray-600">{t('parents.emergencyOnly')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('communication', 'smsAlerts', !controls.communication.smsAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.communication.smsAlerts ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.communication.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.pushNotifications')}</p>
                      <p className="text-sm text-gray-600">{t('parents.onThisDevice')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('communication', 'pushNotifications', !controls.communication.pushNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.communication.pushNotifications ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.communication.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.weeklyReports')}</p>
                      <p className="text-sm text-gray-600">{t('parents.everyMonday')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('communication', 'weeklyReports', !controls.communication.weeklyReports)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.communication.weeklyReports ? 'bg-yellow-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.communication.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.monthlySummary')}</p>
                      <p className="text-sm text-gray-600">{t('parents.detailedProgress')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('communication', 'monthlySummary', !controls.communication.monthlySummary)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.communication.monthlySummary ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.communication.monthlySummary ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Unlock className="w-6 h-6 text-orange-600" />
                {t('parents.permissions')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.canPurchase')}</p>
                      <p className="text-sm text-gray-600">{t('parents.booksMaterials')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('permissions', 'canPurchase', !controls.permissions.canPurchase)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.permissions.canPurchase ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.permissions.canPurchase ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.canDownload')}</p>
                      <p className="text-sm text-gray-600">{t('parents.studyMaterials')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('permissions', 'canDownload', !controls.permissions.canDownload)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.permissions.canDownload ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.permissions.canDownload ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Print className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.canPrint')}</p>
                      <p className="text-sm text-gray-600">{t('parents.documentsAssignments')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('permissions', 'canPrint', !controls.permissions.canPrint)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.permissions.canPrint ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.permissions.canPrint ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.canShare')}</p>
                      <p className="text-sm text-gray-600">{t('parents.progressAchievements')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('permissions', 'canShare', !controls.permissions.canShare)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.permissions.canShare ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.permissions.canShare ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Edit className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('parents.canEditProfile')}</p>
                      <p className="text-sm text-gray-600">{t('parents.personalInformation')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlChange('permissions', 'canEditProfile', !controls.permissions.canEditProfile)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      controls.permissions.canEditProfile ? 'bg-yellow-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.permissions.canEditProfile ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-gray-600" />
                  {t('parents.recentActivity')}
                </h2>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">{t('parents.downloadLog')}</span>
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { action: 'Changed screen time limit', time: '2 hours ago', user: 'Parent' },
                  { action: 'Disabled SMS alerts', time: '1 day ago', user: 'Parent' },
                  { action: 'Viewed grades', time: '2 days ago', user: 'Child' },
                  { action: 'Downloaded assignment', time: '3 days ago', user: 'Child' },
                  { action: 'Updated privacy settings', time: '1 week ago', user: 'Parent' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        activity.user === 'Parent' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {activity.user === 'Parent' ? (
                          <Users className="w-5 h-5 text-blue-600" />
                        ) : (
                          <UserCheck className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600">{activity.time}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activity.user === 'Parent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {activity.user}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingControl && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t('parents.editSetting')}
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingControl.category === 'restrictions' 
                      ? getRestrictionLabel(editingControl.key)
                      : editingControl.category === 'notifications'
                      ? getNotificationLabel(editingControl.key)
                      : getPrivacyLabel(editingControl.key)}
                  </label>
                  
                  {editingControl.key === 'dailyScreenTime' ? (
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="30"
                        max="480"
                        step="30"
                        value={editValue}
                        onChange={(e) => setEditValue(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-700">
                          {formatScreenTime(editValue)}
                        </p>
                        <p className="text-sm text-gray-600">{t('parents.perDay')}</p>
                      </div>
                    </div>
                  ) : editingControl.key.includes('bedtime') ? (
                    <input
                      type="time"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : typeof editValue === 'boolean' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {editValue ? t('parents.enabled') : t('parents.disabled')}
                      </span>
                      <button
                        onClick={() => setEditValue(!editValue)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          editValue ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          editValue ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingControl(null);
                      setEditValue('');
                    }}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Missing icon component
const ShoppingBag = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default ParentControls;