import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Home, BookOpen, FileText, MessageSquare, Users, 
  Award, BarChart3, Settings, HelpCircle, Calendar,
  Video, Music, Image, Download, Upload, Share2,
  Bell, Star, Heart, Zap, Target, TrendingUp,
  ChevronLeft, ChevronRight, Shield, Lock, User,
  GraduationCap, School, Brain, Heart as HeartIcon,
  Users as UsersIcon, Book, Calculator, Globe
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const getRoleBasedMenu = () => {
    const role = user?.role;
    
    const commonItems = [
      {
        id: 'dashboard',
        label: t('sidebar.dashboard'),
        icon: Home,
        path: '/dashboard',
        color: 'text-blue-600 bg-blue-50'
      },
      {
        id: 'library',
        label: t('sidebar.library'),
        icon: BookOpen,
        path: '/library',
        color: 'text-purple-600 bg-purple-50',
        submenu: [
          { label: t('sidebar.academicBooks'), path: '/library/academic' },
          { label: t('sidebar.fiction'), path: '/library/fiction' },
          { label: t('sidebar.resources'), path: '/library/resources' },
          { label: t('sidebar.myBooks'), path: '/library/my-books' }
        ]
      }
    ];

    const roleSpecificItems = {
      student: [
        {
          id: 'assignments',
          label: t('sidebar.assignments'),
          icon: FileText,
          path: '/assignments',
          color: 'text-green-600 bg-green-50',
          badge: '3'
        },
        {
          id: 'quizzes',
          label: t('sidebar.quizzes'),
          icon: Award,
          path: '/quizzes',
          color: 'text-yellow-600 bg-yellow-50'
        },
        {
          id: 'messages',
          label: t('sidebar.messages'),
          icon: MessageSquare,
          path: '/messages',
          color: 'text-red-600 bg-red-50',
          badge: '5'
        },
        {
          id: 'progress',
          label: t('sidebar.myProgress'),
          icon: TrendingUp,
          path: '/progress',
          color: 'text-indigo-600 bg-indigo-50'
        }
      ],
      teacher: [
        {
          id: 'assignments',
          label: t('sidebar.assignments'),
          icon: FileText,
          path: '/assignments',
          color: 'text-green-600 bg-green-50',
          submenu: [
            { label: t('sidebar.createAssignment'), path: '/assignments/create' },
            { label: t('sidebar.gradeAssignments'), path: '/assignments/grade' },
            { label: t('sidebar.viewSubmissions'), path: '/assignments/submissions' }
          ]
        },
        {
          id: 'quizzes',
          label: t('sidebar.quizzes'),
          icon: Award,
          path: '/quizzes',
          color: 'text-yellow-600 bg-yellow-50'
        },
        {
          id: 'students',
          label: t('sidebar.myStudents'),
          icon: Users,
          path: '/students',
          color: 'text-blue-600 bg-blue-50'
        },
        {
          id: 'analytics',
          label: t('sidebar.analytics'),
          icon: BarChart3,
          path: '/analytics',
          color: 'text-purple-600 bg-purple-50'
        }
      ],
      parent: [
        {
          id: 'children',
          label: t('sidebar.myChildren'),
          icon: UsersIcon,
          path: '/children',
          color: 'text-green-600 bg-green-50'
        },
        {
          id: 'progress',
          label: t('sidebar.childProgress'),
          icon: TrendingUp,
          path: '/progress',
          color: 'text-indigo-600 bg-indigo-50'
        },
        {
          id: 'grades',
          label: t('sidebar.grades'),
          icon: Award,
          path: '/grades',
          color: 'text-yellow-600 bg-yellow-50'
        },
        {
          id: 'messages',
          label: t('sidebar.messages'),
          icon: MessageSquare,
          path: '/messages',
          color: 'text-red-600 bg-red-50'
        }
      ],
      admin: [
        {
          id: 'users',
          label: t('sidebar.userManagement'),
          icon: Users,
          path: '/users',
          color: 'text-blue-600 bg-blue-50'
        },
        {
          id: 'analytics',
          label: t('sidebar.analytics'),
          icon: BarChart3,
          path: '/analytics',
          color: 'text-purple-600 bg-purple-50',
          submenu: [
            { label: t('sidebar.gradeAnalytics'), path: '/analytics/grades' },
            { label: t('sidebar.teacherAnalytics'), path: '/analytics/teachers' },
            { label: t('sidebar.studentAnalytics'), path: '/analytics/students' }
          ]
        },
        {
          id: 'system',
          label: t('sidebar.systemSettings'),
          icon: Settings,
          path: '/system',
          color: 'text-gray-600 bg-gray-50'
        }
      ],
      director: [
        {
          id: 'overview',
          label: t('sidebar.overview'),
          icon: Home,
          path: '/overview',
          color: 'text-blue-600 bg-blue-50'
        },
        {
          id: 'grades',
          label: t('sidebar.grades'),
          icon: GraduationCap,
          path: '/grades',
          color: 'text-purple-600 bg-purple-50',
          submenu: [
            { label: 'Grade 9-10', path: '/grades/9-10' },
            { label: 'Grade 11-12', path: '/grades/11-12' }
          ]
        },
        {
          id: 'reports',
          label: t('sidebar.reports'),
          icon: BarChart3,
          path: '/reports',
          color: 'text-green-600 bg-green-50'
        }
      ]
    };

    const additionalItems = [
      {
        id: 'calendar',
        label: t('sidebar.calendar'),
        icon: Calendar,
        path: '/calendar',
        color: 'text-orange-600 bg-orange-50'
      },
      {
        id: 'ai-assistant',
        label: t('sidebar.aiAssistant'),
        icon: Brain,
        path: '/ai',
        color: 'text-pink-600 bg-pink-50',
        badge: 'NEW'
      },
      {
        id: 'news',
        label: t('sidebar.news'),
        icon: Bell,
        path: '/news',
        color: 'text-cyan-600 bg-cyan-50'
      }
    ];

    const bottomItems = [
      {
        id: 'settings',
        label: t('sidebar.settings'),
        icon: Settings,
        path: '/settings',
        color: 'text-gray-600 bg-gray-50'
      },
      {
        id: 'help',
        label: t('sidebar.help'),
        icon: HelpCircle,
        path: '/help',
        color: 'text-gray-600 bg-gray-50'
      }
    ];

    return [
      ...commonItems,
      ...(roleSpecificItems[role] || []),
      ...additionalItems,
      ...bottomItems
    ];
  };

  const menuItems = getRoleBasedMenu();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleSubmenu = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  return (
    <aside className={`sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-6">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 truncate">{user?.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <div key={item.id}>
              <NavLink
                to={item.path}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleSubmenu(item.id);
                  }
                }}
                className={({ isActive }) => `
                  flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 px-3 py-3 rounded-xl transition-all
                  ${isActive || activeSubmenu === item.id ? item.color : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive(item.path) ? item.color.split(' ')[1] : 'bg-gray-100'}`}>
                    <item.icon className={`w-5 h-5 ${isActive(item.path) ? item.color.split(' ')[0] : 'text-gray-600'}`} />
                  </div>
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
                
                {!collapsed && (
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeSubmenu === item.id ? 'rotate-180' : ''
                      }`} />
                    )}
                  </div>
                )}
              </NavLink>

              {/* Submenu */}
              {item.submenu && activeSubmenu === item.id && !collapsed && (
                <div className="ml-12 mt-1 space-y-1">
                  {item.submenu.map((subItem, index) => (
                    <NavLink
                      key={index}
                      to={subItem.path}
                      className={({ isActive }) => `
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                        ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        {!collapsed && (
          <div className="mt-8 mx-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-900 text-sm mb-3">{t('sidebar.quickStats')}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">{t('sidebar.progress')}</span>
                <span className="font-bold text-blue-900">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">{t('sidebar.assignments')}</span>
                <span className="font-bold text-blue-900">24/26</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">{t('sidebar.streak')}</span>
                <span className="font-bold text-blue-900">7 days</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Quick Access */}
        {!collapsed && (
          <div className="mt-4 mx-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">{t('sidebar.aiAssistant')}</span>
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <Settings className="w-5 h-5" />
              <span className="text-sm">{t('sidebar.settings')}</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm">{t('sidebar.help')}</span>
            </button>
          </div>
        )}

        {/* Version */}
        {!collapsed && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">v2.1.0 • Falcon Academy</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;