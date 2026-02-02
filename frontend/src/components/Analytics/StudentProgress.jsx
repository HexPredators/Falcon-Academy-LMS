import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, Users, Award, Clock, Calendar, Filter,
  Download, Printer, Share2, RefreshCw, ChevronDown, ChevronUp,
  Target, Zap, Brain, Eye, EyeOff, Search, BookOpen,
  GraduationCap, Book, Calculator, Percent, Home, School,
  Shield, Lock, Unlock, MessageSquare, ThumbsUp, Star,
  CheckCircle, XCircle, AlertCircle, User, Users as UsersIcon,
  BarChart3, LineChart as LineChartIcon
} from 'lucide-react';
import BarChart from './Charts/BarChart';
import PieChart from './Charts/PieChart';
import LineChart from './Charts/LineChart';
import ProgressChart from './Charts/ProgressChart';
import { useAuth } from '../../../hooks/useAuth';

const StudentProgress = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [showDetails, setShowDetails] = useState(true);

  const grades = ['9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const timeRanges = [
    { value: 'week', label: t('analytics.thisWeek') },
    { value: 'month', label: t('analytics.thisMonth') },
    { value: 'quarter', label: t('analytics.thisQuarter') },
    { value: 'year', label: t('analytics.thisYear') }
  ];

  useEffect(() => {
    fetchStudents();
    if (!selectedStudent) {
      fetchDefaultStudent();
    }
  }, [selectedGrade, selectedSection]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultStudent = () => {
    const mockStudent = {
      id: 1,
      name: 'Samuel Tekle',
      grade: '10',
      section: 'B',
      favId: 'FAV2023001',
      photo: 'ST',
      overallProgress: 85,
      attendance: 92,
      lastActive: '2 hours ago',
      gpa: 3.8,
      rank: 5,
      totalStudents: 45
    };
    setSelectedStudent(mockStudent);
  };

  // Mock data
  const students = [
    {
      id: 1,
      name: 'Samuel Tekle',
      grade: '10',
      section: 'B',
      favId: 'FAV2023001',
      photo: 'ST',
      overallProgress: 85,
      attendance: 92,
      lastActive: '2 hours ago',
      gpa: 3.8,
      rank: 5
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
      lastActive: '1 day ago',
      gpa: 3.4,
      rank: 12
    },
    {
      id: 3,
      name: 'Tewodros Kassahun',
      grade: '9',
      section: 'C',
      favId: 'FAV2023003',
      photo: 'TK',
      overallProgress: 92,
      attendance: 95,
      lastActive: '3 hours ago',
      gpa: 3.9,
      rank: 2
    },
    {
      id: 4,
      name: 'Selamawit Assefa',
      grade: '12',
      section: 'A',
      favId: 'FAV2023004',
      photo: 'SA',
      overallProgress: 88,
      attendance: 90,
      lastActive: '5 hours ago',
      gpa: 3.7,
      rank: 8
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.favId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesSection = selectedSection === 'all' || student.section === selectedSection;
    
    return matchesSearch && matchesGrade && matchesSection;
  });

  const subjectPerformance = [
    { subject: 'Mathematics', score: 95, target: 90, trend: 'up', color: 'blue' },
    { subject: 'Physics', score: 88, target: 85, trend: 'up', color: 'purple' },
    { subject: 'Chemistry', score: 85, target: 88, trend: 'down', color: 'green' },
    { subject: 'Biology', score: 92, target: 90, trend: 'up', color: 'red' },
    { subject: 'English', score: 90, target: 92, trend: 'stable', color: 'yellow' },
    { subject: 'Amharic', score: 96, target: 95, trend: 'up', color: 'orange' }
  ];

  const weeklyProgress = [
    { week: 'W1', progress: 78 },
    { week: 'W2', progress: 80 },
    { week: 'W3', progress: 82 },
    { week: 'W4', progress: 85 },
    { week: 'W5', progress: 87 },
    { week: 'W6', progress: 89 },
    { week: 'W7', progress: 92 }
  ];

  const assignmentCompletion = [
    { type: 'Completed', value: 24, color: 'bg-green-600' },
    { type: 'Pending', value: 3, color: 'bg-yellow-600' },
    { type: 'Overdue', value: 1, color: 'bg-red-600' },
    { type: 'Not Started', value: 2, color: 'bg-gray-600' }
  ];

  const recentActivities = [
    { type: 'assignment', title: 'Submitted Math Homework', score: '95/100', time: '2 hours ago' },
    { type: 'quiz', title: 'Completed Physics Quiz', score: '88/100', time: '1 day ago' },
    { type: 'reading', title: 'Finished "Physics Fundamentals"', pages: '150', time: '2 days ago' },
    { type: 'video', title: 'Watched Chemistry Lecture', duration: '45 min', time: '3 days ago' }
  ];

  const milestones = [
    { title: 'Completed 50 Assignments', date: 'Jan 15, 2024', achieved: true },
    { title: 'Perfect Attendance (Week)', date: 'Jan 12, 2024', achieved: true },
    { title: 'Top 10% in Mathematics', date: 'Jan 10, 2024', achieved: true },
    { title: 'Library Reading Goal', date: 'Jan 8, 2024', achieved: false }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'assignment': return <Book className="w-5 h-5 text-blue-600" />;
      case 'quiz': return <Calculator className="w-5 h-5 text-purple-600" />;
      case 'reading': return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'video': return <Video className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const Video = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  const handleExportReport = () => {
    console.log('Exporting student progress report');
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
                <h1 className="text-3xl font-bold text-gray-900">{t('analytics.studentProgress')}</h1>
                <p className="text-gray-600 mt-1">{t('analytics.trackIndividualPerformance')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchStudents}
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

          {/* Student Selector & Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('analytics.searchStudents')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
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
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="all">{t('analytics.allSections')}</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{t('analytics.section')} {section}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    selectedStudent?.id === student.id
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300'
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {student.photo}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        student.overallProgress >= 90 ? 'bg-green-100 text-green-600' :
                        student.overallProgress >= 80 ? 'bg-blue-100 text-blue-600' :
                        student.overallProgress >= 70 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <span className="text-xs font-bold">{student.overallProgress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-center">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">Grade {student.grade} - Section {student.section}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {student.favId}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Rank: {student.rank}
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
        ) : selectedStudent ? (
          <>
            {/* Student Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {selectedStudent.photo}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                    <div className="flex items-center gap-4 flex-wrap mt-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">Grade {selectedStudent.grade} - Section {selectedStudent.section}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold text-gray-900">FAV ID: {selectedStudent.favId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-600">{selectedStudent.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">{selectedStudent.overallProgress}%</div>
                    <div className="text-sm text-gray-600">{t('analytics.overallProgress')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700">{selectedStudent.attendance}%</div>
                    <div className="text-sm text-gray-600">{t('analytics.attendance')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-700">{selectedStudent.gpa}</div>
                    <div className="text-sm text-gray-600">GPA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ProgressChart
                current={selectedStudent.overallProgress}
                target={90}
                label={t('analytics.academicProgress')}
                color="blue"
                size="medium"
                showDetails={false}
              />
              
              <ProgressChart
                current={selectedStudent.attendance}
                target={95}
                label={t('analytics.attendanceRate')}
                color="green"
                size="medium"
                showDetails={false}
              />
              
              <ProgressChart
                current={selectedStudent.gpa}
                target={4.0}
                label={t('analytics.gpaProgress')}
                color="purple"
                size="medium"
                showDetails={false}
              />
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-900">{selectedStudent.rank}</div>
                  <div className="text-sm text-yellow-800 mt-2">{t('analytics.classRank')}</div>
                  <div className="text-xs text-yellow-700 mt-1">
                    {t('analytics.outOf')} {selectedStudent.totalStudents} {t('analytics.students')}
                  </div>
                  <div className={`text-sm font-medium mt-3 px-3 py-1 rounded-full ${
                    selectedStudent.rank <= 10 ? 'bg-green-100 text-green-800' :
                    selectedStudent.rank <= 20 ? 'bg-blue-100 text-blue-800' :
                    selectedStudent.rank <= 30 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedStudent.rank <= 10 ? t('analytics.topPerformer') :
                     selectedStudent.rank <= 20 ? t('analytics.aboveAverage') :
                     selectedStudent.rank <= 30 ? t('analytics.average') : t('analytics.needsImprovement')}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Subject Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Book className="w-6 h-6 text-blue-600" />
                    {t('analytics.subjectPerformance')}
                  </h2>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {timeRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                <BarChart
                  data={subjectPerformance}
                  xKey="subject"
                  yKey="score"
                  color="blue"
                  height={300}
                  title={t('analytics.subjectWiseScores')}
                />
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{t('analytics.detailedBreakdown')}</h3>
                    <span className="text-sm text-gray-600">
                      {t('analytics.average')}: {(subjectPerformance.reduce((sum, s) => sum + s.score, 0) / subjectPerformance.length).toFixed(1)}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    {subjectPerformance.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${subject.color}-500`}></div>
                          <span className="font-medium text-gray-900">{subject.subject}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            subject.score >= subject.target ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subject.score >= subject.target ? '✓' : '✗'} {subject.target}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">{subject.score}%</span>
                          <span className={`flex items-center gap-1 ${
                            subject.trend === 'up' ? 'text-green-600' :
                            subject.trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {subject.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                             subject.trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                             <Minus className="w-4 h-4" />}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <LineChartIcon className="w-6 h-6 text-green-600" />
                    {t('analytics.progressTrend')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('analytics.growth')}:</span>
                    <span className="font-bold text-green-600">
                      +{weeklyProgress[weeklyProgress.length - 1].progress - weeklyProgress[0].progress}%
                    </span>
                  </div>
                </div>
                <LineChart
                  data={weeklyProgress}
                  xKey="week"
                  yKey="progress"
                  color="green"
                  height={300}
                  title={t('analytics.weeklyProgress')}
                  smooth={true}
                />
              </div>
            </div>

            {/* Assignment & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Assignment Completion */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    {t('analytics.assignmentCompletion')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('analytics.total')}:</span>
                    <span className="font-bold text-purple-700">
                      {assignmentCompletion.reduce((sum, a) => sum + a.value, 0)}
                    </span>
                  </div>
                </div>
                <PieChart
                  data={assignmentCompletion}
                  title={t('analytics.assignmentStatus')}
                  height={250}
                  showPercentage={true}
                />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">{t('analytics.completionRate')}</div>
                    <div className="text-2xl font-bold text-green-900">
                      {Math.round((assignmentCompletion[0].value / assignmentCompletion.reduce((sum, a) => sum + a.value, 0)) * 100)}%
                    </div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-700">{t('analytics.overdueAssignments')}</div>
                    <div className="text-2xl font-bold text-red-900">{assignmentCompletion[2].value}</div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-orange-600" />
                    {t('analytics.recentActivities')}
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('analytics.viewAll')}</span>
                  </button>
                </div>
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
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <ExternalLink className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Milestones */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  {t('analytics.milestonesAchieved')}
                </h2>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        milestone.achieved ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {milestone.achieved ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{milestone.date}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        milestone.achieved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {milestone.achieved ? t('analytics.achieved') : t('analytics.pending')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-600" />
                    {t('analytics.recommendations')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-blue-800">AI Generated</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('analytics.immediateFocus')}</h3>
                    </div>
                    <p className="text-gray-700">
                      {t('analytics.chemistryScores')} <span className="font-semibold text-red-600">-3%</span>. {t('analytics.recommendAdditionalPractice')}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('analytics.strengths')}</h3>
                    </div>
                    <p className="text-gray-700">
                      {t('analytics.excellentPerformanceInLanguages')} (<span className="font-semibold text-green-600">96% Amharic</span>, <span className="font-semibold text-green-600">90% English</span>).
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('analytics.nextGoals')}</h3>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {t('analytics.improveChemistryTo85')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {t('analytics.maintainMathematicsAbove95')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {t('analytics.achievePerfectAttendance')}
                      </li>
                    </ul>
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
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">{t('analytics.contactTeacher')}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">{t('analytics.downloadReport')}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">{t('analytics.learningPatterns')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-blue-800">{t('analytics.peakStudyHours')}</p>
                        <p className="font-semibold text-blue-900">4:00 PM - 7:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-800">{t('analytics.mostActiveDays')}</p>
                        <p className="font-semibold text-blue-900">Monday, Wednesday, Friday</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-800">{t('analytics.preferredSubjects')}</p>
                        <p className="font-semibold text-blue-900">Mathematics, Amharic</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-bold text-green-900 mb-3">{t('analytics.engagementMetrics')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-green-800">{t('analytics.averageDailyTime')}</p>
                        <p className="font-semibold text-green-900">2.5 hours</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-800">{t('analytics.assignmentSubmissionRate')}</p>
                        <p className="font-semibold text-green-900">94% (On Time)</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-800">{t('analytics.participationRate')}</p>
                        <p className="font-semibold text-green-900">88% (Above Average)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-3">{t('analytics.predictiveAnalysis')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-purple-800">{t('analytics.expectedTermGrade')}</p>
                        <p className="font-semibold text-purple-900">A- (3.7 GPA)</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-800">{t('analytics.collegeReadiness')}</p>
                        <p className="font-semibold text-purple-900">92% (Excellent)</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-800">{t('analytics.recommendedStream')}</p>
                        <p className="font-semibold text-purple-900">Natural Science</p>
                      </div>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('analytics.selectStudent')}</h3>
            <p className="text-gray-600 mb-6">{t('analytics.selectStudentDescription')}</p>
            <button
              onClick={fetchDefaultStudent}
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

export default StudentProgress;