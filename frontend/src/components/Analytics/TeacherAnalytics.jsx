import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, Users, Award, Clock, Calendar, Filter,
  Download, Printer, Share2, RefreshCw, ChevronDown, ChevronUp,
  Target, Zap, Brain, Eye, EyeOff, Search, BookOpen,
  GraduationCap, Book, Calculator, Percent, Home, School,
  Shield, Lock, Unlock, MessageSquare, ThumbsUp, Star,
  CheckCircle, XCircle, AlertCircle, User, Users as UsersIcon,
  BarChart3, LineChart as LineChartIcon, Mail, Phone,
  Video, FileText, Settings, Bell, Heart, ThumbsUp as ThumbsUpIcon
} from 'lucide-react';
import BarChart from './Charts/BarChart';
import PieChart from './Charts/PieChart';
import LineChart from './Charts/LineChart';
import ProgressChart from './Charts/ProgressChart';
import { useAuth } from '../../../hooks/useAuth';

const TeacherAnalytics = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [showDetails, setShowDetails] = useState(true);

  const subjects = [
    { value: 'all', label: t('analytics.allSubjects') },
    { value: 'mathematics', label: t('analytics.mathematics') },
    { value: 'physics', label: t('analytics.physics') },
    { value: 'chemistry', label: t('analytics.chemistry') },
    { value: 'biology', label: t('analytics.biology') },
    { value: 'english', label: t('analytics.english') },
    { value: 'amharic', label: t('analytics.amharic') }
  ];

  const grades = ['9', '10', '11', '12'];
  const timeRanges = [
    { value: 'week', label: t('analytics.thisWeek') },
    { value: 'month', label: t('analytics.thisMonth') },
    { value: 'quarter', label: t('analytics.thisQuarter') },
    { value: 'year', label: t('analytics.thisYear') }
  ];

  useEffect(() => {
    fetchTeachers();
    if (!selectedTeacher) {
      fetchDefaultTeacher();
    }
  }, [selectedSubject, selectedGrade]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultTeacher = () => {
    const mockTeacher = {
      id: 1,
      name: 'Mr. Alemu Tekle',
      subjects: ['Mathematics', 'Physics'],
      grades: ['10', '11'],
      teacherId: 'TCH2023001',
      photo: 'AT',
      overallRating: 4.8,
      studentSatisfaction: 92,
      assignmentCompletion: 88,
      attendanceRate: 95,
      yearsOfService: 8,
      totalStudents: 120
    };
    setSelectedTeacher(mockTeacher);
  };

  // Mock data
  const teachers = [
    {
      id: 1,
      name: 'Mr. Alemu Tekle',
      subjects: ['Mathematics', 'Physics'],
      grades: ['10', '11'],
      teacherId: 'TCH2023001',
      photo: 'AT',
      overallRating: 4.8,
      studentSatisfaction: 92,
      assignmentCompletion: 88,
      attendanceRate: 95
    },
    {
      id: 2,
      name: 'Mrs. Selam Assefa',
      subjects: ['Chemistry', 'Biology'],
      grades: ['9', '10'],
      teacherId: 'TCH2023002',
      photo: 'SA',
      overallRating: 4.6,
      studentSatisfaction: 88,
      assignmentCompletion: 85,
      attendanceRate: 92
    },
    {
      id: 3,
      name: 'Dr. Tekle Yohannes',
      subjects: ['English', 'Amharic'],
      grades: ['11', '12'],
      teacherId: 'TCH2023003',
      photo: 'TY',
      overallRating: 4.9,
      studentSatisfaction: 95,
      assignmentCompletion: 90,
      attendanceRate: 98
    },
    {
      id: 4,
      name: 'Ms. Frehiwot Mekonnen',
      subjects: ['Physics', 'Chemistry'],
      grades: ['12'],
      teacherId: 'TCH2023004',
      photo: 'FM',
      overallRating: 4.7,
      studentSatisfaction: 90,
      assignmentCompletion: 87,
      attendanceRate: 94
    }
  ];

  const teacherPerformance = [
    { month: 'Sep', rating: 4.5, satisfaction: 85 },
    { month: 'Oct', rating: 4.6, satisfaction: 87 },
    { month: 'Nov', rating: 4.7, satisfaction: 89 },
    { month: 'Dec', rating: 4.8, satisfaction: 91 },
    { month: 'Jan', rating: 4.8, satisfaction: 92 },
    { month: 'Feb', rating: 4.9, satisfaction: 94 }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', averageScore: 85, improvement: '+5%', color: 'blue' },
    { subject: 'Physics', averageScore: 82, improvement: '+4%', color: 'purple' },
    { subject: 'Chemistry', averageScore: 80, improvement: '+3%', color: 'green' },
    { subject: 'Biology', averageScore: 83, improvement: '+4%', color: 'red' }
  ];

  const studentFeedback = [
    { category: 'Teaching Quality', score: 4.8, color: 'bg-green-600' },
    { category: 'Communication', score: 4.6, color: 'bg-blue-600' },
    { category: 'Assignment Quality', score: 4.7, color: 'bg-purple-600' },
    { category: 'Availability', score: 4.5, color: 'bg-yellow-600' },
    { category: 'Grading Fairness', score: 4.9, color: 'bg-red-600' }
  ];

  const classPerformance = [
    { class: '10A', average: 88, students: 30, improvement: '+6%' },
    { class: '10B', average: 85, students: 28, improvement: '+5%' },
    { class: '11A', average: 86, students: 32, improvement: '+4%' },
    { class: '11B', average: 84, students: 30, improvement: '+3%' }
  ];

  const recentActivities = [
    { type: 'assignment', title: 'Posted Math Assignment', class: '10A', time: '2 hours ago' },
    { type: 'quiz', title: 'Created Physics Quiz', class: '11B', time: '1 day ago' },
    { type: 'grade', title: 'Graded Chemistry Exams', count: '45 papers', time: '2 days ago' },
    { type: 'meeting', title: 'Parent-Teacher Meeting', participants: '12 parents', time: '3 days ago' }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'assignment': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'quiz': return <Calculator className="w-5 h-5 text-purple-600" />;
      case 'grade': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'meeting': return <UsersIcon className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleExportReport = () => {
    console.log('Exporting teacher analytics report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('analytics.teacherAnalytics')}</h1>
                <p className="text-gray-600 mt-1">{t('analytics.teacherPerformanceInsights')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchTeachers}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('common.refresh')}</span>
              </button>
              
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">{t('analytics.exportReport')}</span>
              </button>
            </div>
          </div>

          {/* Teacher Selector & Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {subjects.map(subject => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="all">{t('analytics.allGrades')}</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{t('analytics.grade')} {grade}</option>
                  ))}
                </select>
              </div>

              <div>
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

            {/* Teacher Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teachers.map(teacher => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    selectedTeacher?.id === teacher.id
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300'
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {teacher.photo}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        teacher.overallRating >= 4.8 ? 'bg-green-100 text-green-600' :
                        teacher.overallRating >= 4.5 ? 'bg-blue-100 text-blue-600' :
                        teacher.overallRating >= 4.0 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <span className="text-xs font-bold">{teacher.overallRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-center">{teacher.name}</h3>
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {teacher.subjects.slice(0, 2).map((subject, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {subject}
                      </span>
                    ))}
                    {teacher.subjects.length > 2 && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        +{teacher.subjects.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      ID: {teacher.teacherId}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {teacher.grades.join(', ')}
                    </span>
                  </div>
                </button>
              ))}
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
        ) : selectedTeacher ? (
          <>
            {/* Teacher Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {selectedTeacher.photo}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h2>
                    <div className="flex items-center gap-4 flex-wrap mt-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">
                          {selectedTeacher.subjects.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <School className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">
                          Grades: {selectedTeacher.grades.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold text-gray-900">
                          Teacher ID: {selectedTeacher.teacherId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">{selectedTeacher.overallRating}/5</div>
                    <div className="text-sm text-gray-600">{t('analytics.overallRating')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700">{selectedTeacher.studentSatisfaction}%</div>
                    <div className="text-sm text-gray-600">{t('analytics.studentSatisfaction')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-700">{selectedTeacher.yearsOfService || 8}</div>
                    <div className="text-sm text-gray-600">{t('analytics.yearsOfService')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ProgressChart
                current={selectedTeacher.overallRating * 20}
                target={100}
                label={t('analytics.teacherRating')}
                color="blue"
                size="medium"
                showDetails={false}
              />
              
              <ProgressChart
                current={selectedTeacher.studentSatisfaction}
                target={95}
                label={t('analytics.studentSatisfaction')}
                color="green"
                size="medium"
                showDetails={false}
              />
              
              <ProgressChart
                current={selectedTeacher.assignmentCompletion}
                target={90}
                label={t('analytics.assignmentCompletion')}
                color="purple"
                size="medium"
                showDetails={false}
              />
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-900">{selectedTeacher.totalStudents || 120}</div>
                  <div className="text-sm text-yellow-800 mt-2">{t('analytics.totalStudents')}</div>
                  <div className="text-xs text-yellow-700 mt-1">
                    {selectedTeacher.grades?.length || 2} {t('analytics.grades')} • {selectedTeacher.subjects?.length || 2} {t('analytics.subjects')}
                  </div>
                  <div className={`text-sm font-medium mt-3 px-3 py-1 rounded-full ${
                    selectedTeacher.overallRating >= 4.8 ? 'bg-green-100 text-green-800' :
                    selectedTeacher.overallRating >= 4.5 ? 'bg-blue-100 text-blue-800' :
                    selectedTeacher.overallRating >= 4.0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedTeacher.overallRating >= 4.8 ? t('analytics.exceptional') :
                     selectedTeacher.overallRating >= 4.5 ? t('analytics.excellent') :
                     selectedTeacher.overallRating >= 4.0 ? t('analytics.good') : t('analytics.needsImprovement')}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Performance Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    {t('analytics.performanceTrend')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('analytics.growth')}:</span>
                    <span className="font-bold text-green-600">
                      +{(teacherPerformance[teacherPerformance.length - 1].rating - teacherPerformance[0].rating).toFixed(1)}
                    </span>
                  </div>
                </div>
                <LineChart
                  data={teacherPerformance}
                  xKey="month"
                  yKey="rating"
                  color="green"
                  height={300}
                  title={t('analytics.monthlyPerformanceRating')}
                  smooth={true}
                />
              </div>

              {/* Student Feedback */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ThumbsUpIcon className="w-6 h-6 text-purple-600" />
                    {t('analytics.studentFeedback')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('analytics.average')}:</span>
                    <span className="font-bold text-purple-700">
                      {(studentFeedback.reduce((sum, f) => sum + f.score, 0) / studentFeedback.length).toFixed(1)}/5
                    </span>
                  </div>
                </div>
                <BarChart
                  data={studentFeedback}
                  xKey="category"
                  yKey="score"
                  color="purple"
                  height={300}
                  title={t('analytics.feedbackCategories')}
                />
              </div>
            </div>

            {/* Subject & Class Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Subject Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Book className="w-6 h-6 text-blue-600" />
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
                            <span className="text-sm text-gray-600">{t('analytics.averageScore')}:</span>
                            <span className="text-sm font-medium text-gray-900">{subject.averageScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold text-${subject.color}-600`}>
                          {subject.improvement}
                        </div>
                        <div className="text-sm text-gray-600">{t('analytics.improvement')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-orange-600" />
                    {t('analytics.classPerformance')}
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('analytics.viewAll')}</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {classPerformance.map((cls, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="font-bold text-blue-700">{cls.class}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{t('analytics.class')} {cls.class}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">{cls.students} {t('analytics.students')}</span>
                            <span className={`text-sm font-medium ${
                              cls.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {cls.improvement}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">{cls.average}%</div>
                        <div className="text-sm text-gray-600">{t('analytics.average')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities & Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  {t('analytics.recentActivities')}
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">{activity.time}</span>
                          {activity.class && (
                            <span className="text-sm text-blue-600 font-medium">{activity.class}</span>
                          )}
                          {activity.count && (
                            <span className="text-sm text-gray-600">{activity.count}</span>
                          )}
                          {activity.participants && (
                            <span className="text-sm text-gray-600">{activity.participants}</span>
                          )}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <ExternalLink className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Testimonials */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                    {t('analytics.studentTestimonials')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-green-800">4.8/5 Rating</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-700">S</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Samuel T.</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Excellent teaching methodology. Makes complex concepts easy to understand."
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-700">M</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Meron A.</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Very responsive to student questions. Provides helpful feedback on assignments."
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="font-bold text-purple-700">T</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Tewodros K.</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Engaging teaching style. Always goes above and beyond to help students succeed."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Insights */}
            {showDetails && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Brain className="w-8 h-8 text-blue-600" />
                    {t('analytics.detailedInsights')}
                  </h2>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">{t('analytics.performanceSettings')}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">{t('analytics.downloadReport')}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">{t('analytics.teachingEffectiveness')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-blue-800">{t('analytics.studentEngagement')}</p>
                        <p className="font-semibold text-blue-900">92% (Excellent)</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-800">{t('analytics.conceptClarity')}</p>
                        <p className="font-semibold text-blue-900">94% (Outstanding)</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-800">{t('analytics.feedbackQuality')}</p>
                        <p className="font-semibold text-blue-900">89% (Very Good)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-bold text-green-900 mb-3">{t('analytics.administrativeMetrics')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-green-800">{t('analytics.onTimeGrading')}</p>
                        <p className="font-semibold text-green-900">96% (Excellent)</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-800">{t('analytics.attendanceRate')}</p>
                        <p className="font-semibold text-green-900">95% (Consistent)</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-800">{t('analytics.meetingParticipation')}</p>
                        <p className="font-semibold text-green-900">100% (Perfect)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-3">{t('analytics.professionalDevelopment')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-purple-800">{t('analytics.trainingCompleted')}</p>
                        <p className="font-semibold text-purple-900">8/10 courses</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-800">{t('analytics.certifications')}</p>
                        <p className="font-semibold text-purple-900">3 active</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-800">{t('analytics.researchPublications')}</p>
                        <p className="font-semibold text-purple-900">2 papers</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Target className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{t('analytics.recommendations')}</h3>
                        <p className="text-gray-600 text-sm">
                          {t('analytics.aiPoweredSuggestions')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-blue-800">AI Generated</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">{t('analytics.strengthsToLeverage')}</span>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {t('analytics.excellentStudentEngagement')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {t('analytics.strongConceptClarity')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {t('analytics.highAttendanceConsistency')}
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{t('analytics.areasForImprovement')}</span>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500" />
                          {t('analytics.enhanceDigitalToolUsage')}
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500" />
                          {t('analytics.increaseResearchPublications')}
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500" />
                          {t('analytics.implementAdvancedAssessment')}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('analytics.selectTeacher')}</h3>
            <p className="text-gray-600 mb-6">{t('analytics.selectTeacherDescription')}</p>
            <button
              onClick={fetchDefaultTeacher}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t('analytics.loadSampleData')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAnalytics;