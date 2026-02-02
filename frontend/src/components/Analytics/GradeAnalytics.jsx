import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3, TrendingUp, Users, Award, BookOpen, Filter,
  Download, Printer, Share2, RefreshCw, ChevronDown, ChevronUp,
  Target, Zap, Brain, Clock, Calendar, Eye, EyeOff, School,
  GraduationCap, Book, Calculator, Globe, Hash, Percent,
  Home, Shield, Lock, Unlock, MessageSquare, ThumbsUp
} from 'lucide-react';
import BarChart from './Charts/BarChart';
import PieChart from './Charts/PieChart';
import LineChart from './Charts/LineChart';
import ProgressChart from './Charts/ProgressChart';
import { useAuth } from '../../../hooks/useAuth';

const GradeAnalytics = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('current');
  const [timeRange, setTimeRange] = useState('month');
  const [showDetails, setShowDetails] = useState(false);

  const grades = [
    { value: 'all', label: t('analytics.allGrades') },
    { value: '9', label: t('analytics.grade9') },
    { value: '10', label: t('analytics.grade10') },
    { value: '11', label: t('analytics.grade11') },
    { value: '12', label: t('analytics.grade12') }
  ];

  const terms = [
    { value: 'current', label: t('analytics.currentTerm') },
    { value: 'previous', label: t('analytics.previousTerm') },
    { value: 'year', label: t('analytics.thisYear') }
  ];

  const timeRanges = [
    { value: 'week', label: t('analytics.thisWeek') },
    { value: 'month', label: t('analytics.thisMonth') },
    { value: 'quarter', label: t('analytics.thisQuarter') },
    { value: 'year', label: t('analytics.thisYear') }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [selectedGrade, selectedTerm, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const gradePerformance = [
    { grade: '9', average: 78, students: 120, improvement: '+3%' },
    { grade: '10', average: 82, students: 115, improvement: '+5%' },
    { grade: '11', average: 85, students: 105, improvement: '+4%' },
    { grade: '12', average: 88, students: 95, improvement: '+6%' }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', average: 85, topScore: 98, color: 'blue' },
    { subject: 'Physics', average: 82, topScore: 96, color: 'purple' },
    { subject: 'Chemistry', average: 80, topScore: 94, color: 'green' },
    { subject: 'Biology', average: 83, topScore: 97, color: 'red' },
    { subject: 'English', average: 87, topScore: 99, color: 'yellow' },
    { subject: 'Amharic', average: 90, topScore: 100, color: 'orange' }
  ];

  const gradeDistribution = [
    { label: 'A (90-100%)', value: 45, color: 'bg-green-600' },
    { label: 'B (80-89%)', value: 120, color: 'bg-blue-600' },
    { label: 'C (70-79%)', value: 85, color: 'bg-yellow-600' },
    { label: 'D (60-69%)', value: 30, color: 'bg-orange-600' },
    { label: 'F (<60%)', value: 15, color: 'bg-red-600' }
  ];

  const performanceTrend = [
    { month: 'Sep', average: 78 },
    { month: 'Oct', average: 80 },
    { month: 'Nov', average: 82 },
    { month: 'Dec', average: 85 },
    { month: 'Jan', average: 87 },
    { month: 'Feb', average: 89 }
  ];

  const topPerformers = [
    { rank: 1, name: 'Samuel Tekle', grade: '12A', average: 98.5 },
    { rank: 2, name: 'Meron Abebe', grade: '11B', average: 97.2 },
    { rank: 3, name: 'Tewodros Kassahun', grade: '10C', average: 96.8 },
    { rank: 4, name: 'Selamawit Assefa', grade: '12A', average: 95.5 },
    { rank: 5, name: 'Kaleb Yohannes', grade: '11A', average: 94.2 }
  ];

  const improvementAreas = [
    { subject: 'Physics', improvementNeeded: 15, priority: 'high' },
    { subject: 'Chemistry', improvementNeeded: 12, priority: 'medium' },
    { subject: 'Mathematics', improvementNeeded: 8, priority: 'medium' },
    { subject: 'Biology', improvementNeeded: 5, priority: 'low' }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting analytics as ${format}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('analytics.gradeAnalytics')}</h1>
                <p className="text-gray-600 mt-1">{t('analytics.comprehensiveGradeInsights')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchAnalytics}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('common.refresh')}</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">{t('common.export')}</span>
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {showDetails ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {showDetails ? t('analytics.hideDetails') : t('analytics.showDetails')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4" />
                    {t('analytics.selectGrade')}
                  </div>
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {grades.map(grade => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('analytics.selectTerm')}
                  </div>
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {terms.map(term => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t('analytics.timeRange')}
                  </div>
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(skeleton => (
              <div key={skeleton} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-40 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">{t('analytics.averageGrade')}</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">85.2%</p>
                  </div>
                  <Percent className="w-10 h-10 text-blue-500 opacity-80" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-800">+3.2% {t('analytics.fromLastTerm')}</span>
                    <span className="font-semibold text-blue-900">{t('analytics.aboveTarget')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">{t('analytics.totalStudents')}</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">435</p>
                  </div>
                  <Users className="w-10 h-10 text-green-500 opacity-80" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-800">Grade 9: 120</span>
                    <span className="text-green-800">Grade 10: 115</span>
                    <span className="text-green-800">Grade 11: 105</span>
                    <span className="text-green-800">Grade 12: 95</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">{t('analytics.passRate')}</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">94.7%</p>
                  </div>
                  <Award className="w-10 h-10 text-purple-500 opacity-80" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-purple-800">
                    {t('analytics.studentsAbove70')}: 412
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">{t('analytics.improvementRate')}</p>
                    <p className="text-3xl font-bold text-yellow-900 mt-2">+4.8%</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-yellow-500 opacity-80" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-yellow-800">
                    {t('analytics.termOverTerm')}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Grade Performance Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    {t('analytics.gradePerformance')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('analytics.average')}:</span>
                    <span className="font-bold text-blue-700">83.8%</span>
                  </div>
                </div>
                <BarChart
                  data={gradePerformance}
                  xKey="grade"
                  yKey="average"
                  color="blue"
                  height={300}
                  title={t('analytics.gradeWiseAverages')}
                />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {gradePerformance.map(grade => (
                    <div key={grade.grade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="font-bold text-blue-700">{grade.grade}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{t('analytics.grade')} {grade.grade}</p>
                          <p className="text-sm text-gray-600">{grade.students} {t('analytics.students')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{grade.average}%</p>
                        <p className={`text-sm ${
                          grade.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {grade.improvement}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <PieChart className="w-6 h-6 text-purple-600" />
                    {t('analytics.gradeDistribution')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('analytics.students')}:</span>
                    <span className="font-bold text-purple-700">435</span>
                  </div>
                </div>
                <PieChart
                  data={gradeDistribution}
                  title={t('analytics.gradeCategories')}
                  height={300}
                  showPercentage={true}
                />
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">{t('analytics.highestGrade')}</div>
                      <div className="text-2xl font-bold text-green-600">45 A's</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">{t('analytics.needsAttention')}</div>
                      <div className="text-2xl font-bold text-red-600">15 F's</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  {t('analytics.performanceTrend')}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{t('analytics.overallGrowth')}:</span>
                  <span className="font-bold text-green-600">+11%</span>
                </div>
              </div>
              <LineChart
                data={performanceTrend}
                xKey="month"
                yKey="average"
                color="green"
                height={300}
                title={t('analytics.monthlyAverageGrades')}
                smooth={true}
              />
            </div>

            {/* Subject Performance & Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Subject Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Book className="w-6 h-6 text-orange-600" />
                  {t('analytics.subjectPerformance')}
                </h2>
                <div className="space-y-4">
                  {subjectPerformance.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${subject.color}-100 flex items-center justify-center`}>
                          <BookOpen className={`w-5 h-5 text-${subject.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">{t('analytics.topScore')}:</span>
                            <span className="text-sm font-medium text-gray-900">{subject.topScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold text-${subject.color}-600`}>
                          {subject.average}%
                        </div>
                        <div className="text-sm text-gray-600">{t('analytics.average')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-600" />
                    {t('analytics.topPerformers')}
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('analytics.shareRanking')}</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {topPerformers.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          student.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                          student.rank === 2 ? 'bg-gray-100 text-gray-600' :
                          student.rank === 3 ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <span className="font-bold">{student.rank}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.grade}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">{student.average}%</div>
                        <div className="text-sm text-gray-600">{t('analytics.average')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Charts & Improvement Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-red-600" />
                  {t('analytics.progressOverview')}
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <ProgressChart
                    current={85}
                    target={90}
                    label={t('analytics.academicTarget')}
                    color="blue"
                    size="medium"
                    showDetails={false}
                  />
                  <ProgressChart
                    current={94.7}
                    target={95}
                    label={t('analytics.passRate')}
                    color="green"
                    size="medium"
                    showDetails={false}
                  />
                  <ProgressChart
                    current={78}
                    target={85}
                    label={t('analytics.attendance')}
                    color="purple"
                    size="medium"
                    showDetails={false}
                  />
                  <ProgressChart
                    current={4.8}
                    target={5}
                    label={t('analytics.improvement')}
                    color="yellow"
                    size="medium"
                    showDetails={false}
                  />
                </div>
              </div>

              {/* Improvement Areas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    {t('analytics.improvementAreas')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-purple-800">{t('analytics.aiRecommendations')}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {improvementAreas.map((area, index) => (
                    <div key={index} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-gray-600" />
                          <h4 className="font-semibold text-gray-900">{area.subject}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(area.priority)}`}>
                          {t(`analytics.priority.${area.priority}`)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{t('analytics.improvementNeeded')}</p>
                          <p className="text-xl font-bold text-gray-900">{area.improvementNeeded}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{t('analytics.recommendedActions')}</p>
                          <ul className="text-xs text-gray-700 mt-1">
                            <li>• {t('analytics.additionalPractice')}</li>
                            <li>• {t('analytics.weeklyAssessments')}</li>
                            <li>• {t('analytics.focusedStudyGroups')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            {showDetails && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Brain className="w-8 h-8 text-blue-600" />
                    {t('analytics.detailedInsights')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-blue-800">AI Powered Analysis</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('analytics.strengths')}</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{t('analytics.strongPerformanceInLanguages')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{t('analytics.consistentImprovementTrend')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{t('analytics.highPassRateAcrossAllGrades')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Target className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('analytics.recommendations')}</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <span className="text-gray-700">{t('analytics.focusOnScienceSubjects')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <span className="text-gray-700">{t('analytics.implementRemedialPrograms')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <span className="text-gray-700">{t('analytics.enhanceSTEMEducation')}</span>
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
                        <h3 className="font-bold text-gray-900">{t('analytics.nextQuarterGoals')}</h3>
                        <p className="text-gray-600 text-sm">
                          {t('analytics.targetBasedOnCurrentTrends')}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">{t('analytics.downloadFullReport')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GradeAnalytics;