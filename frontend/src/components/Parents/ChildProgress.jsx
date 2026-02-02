import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, BarChart3, Target, Clock, Award, BookOpen,
  Calendar, CheckCircle, XCircle, AlertCircle, Star, Users,
  GraduationCap, Book, FileText, Video, Download, Eye,
  Filter, RefreshCw, ChevronDown, ChevronUp, ExternalLink,
  MessageSquare, ThumbsUp, TrendingDown, Home, School, 
  Brain, Heart, Zap, Shield, Lock, Unlock, Share2
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const ChildProgress = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  const children = [
    {
      id: 1,
      name: 'Samuel Tekle',
      grade: '10',
      section: 'B',
      favId: 'FAV2023001',
      photo: 'ST',
      overallProgress: 85,
      attendance: 92,
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Meron Abebe',
      grade: '11',
      section: 'A',
      favId: 'FAV2023002',
      photo: 'MA',
      overallProgress: 78,
      attendance: 88,
      lastActive: '1 day ago'
    }
  ];

  const timeRanges = [
    { value: 'week', label: t('parents.thisWeek') },
    { value: 'month', label: t('parents.thisMonth') },
    { value: 'quarter', label: t('parents.thisQuarter') },
    { value: 'year', label: t('parents.thisYear') }
  ];

  const subjects = [
    { name: 'Mathematics', progress: 90, target: 95, icon: '➕', color: 'blue' },
    { name: 'Physics', progress: 85, target: 90, icon: '⚛️', color: 'purple' },
    { name: 'Chemistry', progress: 78, target: 85, icon: '🧪', color: 'green' },
    { name: 'Biology', progress: 82, target: 88, icon: '🧬', color: 'red' },
    { name: 'English', progress: 88, target: 92, icon: '📚', color: 'yellow' },
    { name: 'Amharic', progress: 92, target: 95, icon: '🇪🇹', color: 'orange' }
  ];

  const milestones = [
    { title: 'Completed 50 Assignments', date: 'Jan 15, 2024', icon: CheckCircle, color: 'green' },
    { title: 'Perfect Attendance (Week)', date: 'Jan 12, 2024', icon: Award, color: 'blue' },
    { title: 'Top 10% in Mathematics', date: 'Jan 10, 2024', icon: TrendingUp, color: 'purple' },
    { title: 'Library Reading Goal', date: 'Jan 8, 2024', icon: BookOpen, color: 'yellow' }
  ];

  const activities = [
    { type: 'assignment', title: 'Submitted Math Homework', time: '2 hours ago', score: '95/100' },
    { type: 'quiz', title: 'Completed Physics Quiz', time: '1 day ago', score: '88/100' },
    { type: 'reading', title: 'Finished "Physics Fundamentals"', time: '2 days ago', pages: '150' },
    { type: 'video', title: 'Watched Chemistry Lecture', time: '3 days ago', duration: '45 min' }
  ];

  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
    fetchProgressData();
  }, [selectedChild, timeRange]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const mockData = {
        overallProgress: 85,
        attendanceRate: 92,
        assignmentCompletion: 88,
        quizAverage: 86,
        readingTime: 12,
        activeDays: 5,
        streak: 7,
        rank: 'Top 15%',
        improvement: '+5%',
        weeklyHours: 35,
        subjectProgress: subjects,
        recentActivities: activities
      };
      setProgressData(mockData);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'text-green-600 bg-green-100';
    if (progress >= 80) return 'text-blue-600 bg-blue-100';
    if (progress >= 70) return 'text-yellow-600 bg-yellow-100';
    if (progress >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'assignment': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'quiz': return <Book className="w-5 h-5 text-purple-600" />;
      case 'reading': return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'video': return <Video className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('parents.childProgress')}</h1>
                <p className="text-gray-600 mt-1">{t('parents.trackAcademicPerformance')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={fetchProgressData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('common.refresh')}</span>
              </button>
            </div>
          </div>

          {/* Child Selector */}
          <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all min-w-[300px] ${
                  selectedChild?.id === child.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300'
                    : 'bg-white border border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {child.photo}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      child.overallProgress >= 80 ? 'bg-green-100 text-green-600' :
                      child.overallProgress >= 70 ? 'bg-blue-100 text-blue-600' :
                      child.overallProgress >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <span className="text-xs font-bold">{child.overallProgress}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">{child.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">Grade {child.grade} - Section {child.section}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {child.favId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>{child.attendance}% {t('parents.attendance')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{child.lastActive}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(skeleton => (
              <div key={skeleton} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        ) : progressData && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Overall Progress */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-blue-700">{t('parents.overallProgress')}</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {progressData.overallProgress}%
                    </p>
                  </div>
                  <div className="relative">
                    <div className="w-16 h-16">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${progressData.overallProgress * 2.51} 251`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">
                    {progressData.improvement} {t('parents.fromLastMonth')}
                  </span>
                  <span className="font-semibold text-blue-900">{progressData.rank}</span>
                </div>
              </div>

              {/* Attendance */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-700">{t('parents.attendance')}</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {progressData.attendanceRate}%
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-500 opacity-80" />
                </div>
                <div className="text-sm text-green-800">
                  {t('parents.activeDays')}: {progressData.activeDays}/7
                </div>
              </div>

              {/* Assignments */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-purple-700">{t('parents.assignments')}</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {progressData.assignmentCompletion}%
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-500 opacity-80" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-purple-800">
                    {t('parents.quizAverage')}: {progressData.quizAverage}%
                  </span>
                </div>
              </div>

              {/* Reading */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">{t('parents.readingTime')}</p>
                    <p className="text-3xl font-bold text-yellow-900 mt-2">
                      {progressData.readingTime} {t('parents.hours')}
                    </p>
                  </div>
                  <BookOpen className="w-12 h-12 text-yellow-500 opacity-80" />
                </div>
                <div className="text-sm text-yellow-800">
                  {t('parents.streak')}: {progressData.streak} {t('parents.days')}
                </div>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Book className="w-6 h-6 text-blue-600" />
                  {t('parents.subjectProgress')}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t('parents.weeklyHours')}:</span>
                  <span className="font-bold text-blue-700">{progressData.weeklyHours}h</span>
                </div>
              </div>

              <div className="space-y-6">
                {progressData.subjectProgress.map((subject, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${subject.color}-100 flex items-center justify-center`}>
                          <span className="text-lg">{subject.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{t('parents.target')}: {subject.target}%</span>
                            <span className="flex items-center gap-1">
                              {subject.progress >= subject.target ? (
                                <>
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                  <span className="text-green-600">
                                    +{subject.progress - subject.target}%
                                  </span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                  <span className="text-red-600">
                                    {subject.progress - subject.target}%
                                  </span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xl font-bold ${getProgressColor(subject.progress)} px-4 py-2 rounded-full`}>
                          {subject.progress}%
                        </span>
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full bg-${subject.color}-500 rounded-full transition-all duration-1000`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                      <div
                        className={`absolute top-0 left-0 h-full border-r-2 border-${subject.color}-700`}
                        style={{ width: `${subject.target}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Milestones */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  {t('parents.recentMilestones')}
                </h2>
                
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div className={`p-3 rounded-lg bg-${milestone.color}-100`}>
                        <milestone.icon className={`w-6 h-6 text-${milestone.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{milestone.date}</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                  <span className="font-medium">{t('parents.viewAllMilestones')}</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  {t('parents.recentActivities')}
                </h2>
                
                <div className="space-y-4">
                  {progressData.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">{activity.time}</span>
                          {activity.score && (
                            <span className={`text-sm font-medium ${
                              parseInt(activity.score) >= 90 ? 'text-green-600' :
                              parseInt(activity.score) >= 80 ? 'text-blue-600' :
                              parseInt(activity.score) >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {activity.score}
                            </span>
                          )}
                          {activity.pages && (
                            <span className="text-sm text-gray-600">{activity.pages} pages</span>
                          )}
                          {activity.duration && (
                            <span className="text-sm text-gray-600">{activity.duration}</span>
                          )}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <ExternalLink className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                  <span className="font-medium">{t('parents.viewAllActivities')}</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Insights & Recommendations */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="w-8 h-8 text-blue-600" />
                  {t('parents.insightsRecommendations')}
                </h2>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-blue-800">AI Generated</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">{t('parents.strengths')}</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Excellent performance in Mathematics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Consistent assignment submission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">Strong reading habits</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Target className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">{t('parents.recommendations')}</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-gray-700">Focus on Physics problem-solving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-gray-700">Practice Chemistry equations daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-gray-700">Join study group for Biology</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{t('parents.nextSteps')}</h3>
                      <p className="text-gray-600 text-sm">
                        {t('parents.suggestedActionPlan')}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">{t('parents.downloadReport')}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChildProgress;