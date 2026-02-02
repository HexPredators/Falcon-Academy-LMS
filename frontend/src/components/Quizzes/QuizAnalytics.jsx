import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, TrendingUp, Users, Target, Award, Clock, Download, Filter, ChevronDown, Eye, User, Star, AlertCircle, CheckCircle, XCircle, BarChart, Clock3, TrendingDown, BookOpen, FileText, HelpCircle } from 'lucide-react';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import Modal from '../Common/Modal';

const QuizAnalytics = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchQuizAnalytics();
  }, [id, timeRange]);

  const fetchQuizAnalytics = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockQuiz = {
          id: parseInt(id),
          title: 'Algebra Basics Quiz',
          subject: 'Mathematics',
          grade: '10',
          section: 'A',
          teacher: 'Mr. Alemayehu',
          teacherId: 'T2023001',
          totalPoints: 100,
          duration: 30,
          totalQuestions: 15,
          totalStudents: 28,
          completedStudents: 25,
          averageScore: 78.5,
          passingRate: 85,
          passingScore: 60,
          createdAt: '2024-02-20',
          status: 'completed',
          tags: ['Algebra', 'Basics', 'Math'],
          difficulty: 'medium'
        };

        const mockAnalytics = {
          quizId: parseInt(id),
          overview: {
            averageScore: 78.5,
            medianScore: 80,
            highestScore: 98,
            lowestScore: 45,
            passingRate: 85,
            completionRate: 89.3,
            averageTime: '24:35',
            standardDeviation: 12.4,
            questionCount: 15,
            totalAttempts: 25,
            successRate: 85.2
          },
          scoreDistribution: [
            { range: '0-49', count: 2, percentage: 8, color: '#EF4444' },
            { range: '50-59', count: 1, percentage: 4, color: '#F97316' },
            { range: '60-69', count: 3, percentage: 12, color: '#EAB308' },
            { range: '70-79', count: 6, percentage: 24, color: '#84CC16' },
            { range: '80-89', count: 8, percentage: 32, color: '#10B981' },
            { range: '90-100', count: 5, percentage: 20, color: '#3B82F6' }
          ],
          questionAnalysis: [
            {
              id: 1,
              question: 'What is the solution to 2x + 5 = 15?',
              type: 'multiple-choice',
              difficulty: 'easy',
              correctRate: 92,
              averageTime: '0:45',
              points: 5,
              options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 3'],
              correctAnswer: 'x = 5',
              studentAttempts: 25
            },
            {
              id: 2,
              question: 'The equation x² = 4 has only one solution.',
              type: 'true-false',
              difficulty: 'medium',
              correctRate: 68,
              averageTime: '1:20',
              points: 3,
              correctAnswer: 'False',
              studentAttempts: 25
            },
            {
              id: 3,
              question: 'Which of the following is a quadratic equation?',
              type: 'multiple-choice',
              difficulty: 'easy',
              correctRate: 85,
              averageTime: '1:05',
              points: 4,
              options: ['2x + 3 = 0', 'x² - 4x + 4 = 0', '3x - 7', '5/x = 2'],
              correctAnswer: 'x² - 4x + 4 = 0',
              studentAttempts: 25
            },
            {
              id: 4,
              question: 'Solve for y: 3y - 7 = 8',
              type: 'short-answer',
              difficulty: 'hard',
              correctRate: 72,
              averageTime: '2:30',
              points: 6,
              correctAnswer: 'y = 5',
              studentAttempts: 25
            },
            {
              id: 5,
              question: 'Factorize: x² - 9',
              type: 'short-answer',
              difficulty: 'medium',
              correctRate: 88,
              averageTime: '1:45',
              points: 5,
              correctAnswer: '(x-3)(x+3)',
              studentAttempts: 25
            }
          ],
          studentPerformance: [
            {
              id: 1,
              name: 'ደመሰሰ ታደሰ',
              studentId: 'S2023001',
              score: 85,
              percentage: 85,
              rank: 3,
              timeSpent: '24:35',
              status: 'passed',
              improvement: '+12%',
              grade: '10A',
              submissionTime: '2024-02-20 10:30:00',
              accuracy: 92
            },
            {
              id: 2,
              name: 'ሙሉጌታ አባይ',
              studentId: 'S2023002',
              score: 92,
              percentage: 92,
              rank: 1,
              timeSpent: '28:15',
              status: 'passed',
              improvement: '+8%',
              grade: '10A',
              submissionTime: '2024-02-20 11:15:00',
              accuracy: 96
            },
            {
              id: 3,
              name: 'ትንሳኤ መኮንን',
              studentId: 'S2023003',
              score: 78,
              percentage: 78,
              rank: 12,
              timeSpent: '21:45',
              status: 'passed',
              improvement: '+5%',
              grade: '10A',
              submissionTime: '2024-02-20 09:45:00',
              accuracy: 84
            },
            {
              id: 4,
              name: 'ሰላም አለማየሁ',
              studentId: 'S2023004',
              score: 52,
              percentage: 52,
              rank: 25,
              timeSpent: '18:20',
              status: 'failed',
              improvement: '-3%',
              grade: '10A',
              submissionTime: '2024-02-20 14:20:00',
              accuracy: 58
            },
            {
              id: 5,
              name: 'ሚካኤል ተስፋዬ',
              studentId: 'S2023005',
              score: 95,
              percentage: 95,
              rank: 2,
              timeSpent: '26:40',
              status: 'passed',
              improvement: '+15%',
              grade: '10A',
              submissionTime: '2024-02-20 10:05:00',
              accuracy: 98
            }
          ],
          trends: {
            dailyScores: [
              { date: '2024-02-25', average: 78.5, attempts: 5 },
              { date: '2024-02-26', average: 80.2, attempts: 6 },
              { date: '2024-02-27', average: 82.1, attempts: 7 },
              { date: '2024-02-28', average: 79.8, attempts: 4 },
              { date: '2024-02-29', average: 81.5, attempts: 3 }
            ],
            completionRate: [
              { day: 'Mon', rate: 85, attempts: 17 },
              { day: 'Tue', rate: 88, attempts: 22 },
              { day: 'Wed', rate: 82, attempts: 18 },
              { day: 'Thu', rate: 90, attempts: 27 },
              { day: 'Fri', rate: 87, attempts: 21 }
            ],
            timeOfDay: [
              { hour: '08:00', average: 82.5, attempts: 8 },
              { hour: '10:00', average: 85.2, attempts: 12 },
              { hour: '12:00', average: 78.3, attempts: 10 },
              { hour: '14:00', average: 76.8, attempts: 7 },
              { hour: '16:00', average: 81.4, attempts: 9 }
            ]
          },
          insights: [
            { 
              type: 'warning', 
              text: 'Most students struggled with question 4 (short answer)', 
              impact: 'high',
              suggestion: 'Review this question in class'
            },
            { 
              type: 'info', 
              text: 'Question 2 (true/false) had the lowest correct rate', 
              impact: 'medium',
              suggestion: 'Consider rephrasing the question'
            },
            { 
              type: 'success', 
              text: 'Students who spent more time scored higher', 
              impact: 'low',
              suggestion: 'Encourage thorough reading'
            },
            { 
              type: 'warning', 
              text: 'Morning attempts had better scores than evening attempts', 
              impact: 'medium',
              suggestion: 'Schedule quizzes in morning hours'
            }
          ],
          recommendations: [
            'Review question 2 and 4 in the next class session',
            'Provide additional practice problems for quadratic equations',
            'Consider extending time limit for complex problems',
            'Schedule one-on-one sessions with students scoring below 60%',
            'Create a study group for collaborative learning'
          ],
          comparison: {
            classAverage: 78.5,
            schoolAverage: 75.2,
            previousQuiz: 72.8,
            improvement: '+5.7%'
          }
        };

        setQuiz(mockQuiz);
        setAnalytics(mockAnalytics);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  const exportAnalytics = async (format = 'csv') => {
    setExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      let content, filename, mimeType;

      if (format === 'csv') {
        const csvContent = [
          ['Quiz Analytics Report', quiz.title, timestamp],
          ['Subject', quiz.subject, 'Grade', quiz.grade, 'Section', quiz.section],
          ['Teacher', quiz.teacher, 'Total Students', quiz.totalStudents, 'Average Score', analytics.overview.averageScore + '%'],
          [],
          ['OVERVIEW STATISTICS'],
          ['Metric', 'Value'],
          ['Average Score', analytics.overview.averageScore + '%'],
          ['Median Score', analytics.overview.medianScore + '%'],
          ['Highest Score', analytics.overview.highestScore + '%'],
          ['Lowest Score', analytics.overview.lowestScore + '%'],
          ['Passing Rate', analytics.overview.passingRate + '%'],
          ['Completion Rate', analytics.overview.completionRate + '%'],
          ['Standard Deviation', analytics.overview.standardDeviation],
          [],
          ['SCORE DISTRIBUTION'],
          ['Score Range', 'Number of Students', 'Percentage'],
          ...analytics.scoreDistribution.map(d => [d.range, d.count, d.percentage + '%']),
          [],
          ['STUDENT PERFORMANCE'],
          ['Rank', 'Student ID', 'Name', 'Score', 'Percentage', 'Status', 'Time Spent', 'Improvement'],
          ...analytics.studentPerformance.map(s => [
            s.rank,
            s.studentId,
            s.name,
            s.score,
            s.percentage + '%',
            s.status,
            s.timeSpent,
            s.improvement
          ])
        ].map(row => row.join(',')).join('\n');

        content = csvContent;
        filename = `quiz-analytics-${quiz.title.replace(/\s+/g, '-')}-${timestamp}.csv`;
        mimeType = 'text/csv';
      } else if (format === 'json') {
        const report = {
          quiz: quiz,
          analytics: analytics,
          generatedAt: new Date().toISOString(),
          exportedBy: 'Teacher'
        };
        content = JSON.stringify(report, null, 2);
        filename = `quiz-analytics-${quiz.title.replace(/\s+/g, '-')}-${timestamp}.json`;
        mimeType = 'application/json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{t('quizzes.loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  if (!quiz || !analytics) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('quizzes.analyticsNotFound')}</h3>
          <p className="text-gray-600 mb-6">{t('quizzes.noAnalyticsAvailable')}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            {t('common.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-500 transform -rotate-90" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {t('quizzes.analytics')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>{quiz.subject} • Grade {quiz.grade}{quiz.section}</span>
              <span>•</span>
              <span>{t('quizzes.teacher')}: {quiz.teacher}</span>
              <span>•</span>
              <span>{t('quizzes.created')}: {new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">{t('quizzes.allTime')}</option>
                <option value="week">{t('quizzes.lastWeek')}</option>
                <option value="month">{t('quizzes.lastMonth')}</option>
                <option value="quarter">{t('quizzes.lastQuarter')}</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="grid">{t('quizzes.gridView')}</option>
                <option value="list">{t('quizzes.listView')}</option>
                <option value="detailed">{t('quizzes.detailedView')}</option>
              </select>
              <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Button
                onClick={() => exportAnalytics('csv')}
                disabled={exporting}
                variant="outline"
                className="px-6"
              >
                {exporting ? (
                  <LoadingSpinner size="small" className="mr-2" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                {exporting ? t('common.exporting') : t('quizzes.export')}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.averageScore')}</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={`px-2 py-1 rounded-full ${analytics.comparison.improvement.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {analytics.comparison.improvement} {t('quizzes.vsPrevious')}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.passingRate')}</p>
                <p className="text-2xl font-bold text-green-600">{analytics.overview.passingRate}%</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {quiz.completedStudents}/{quiz.totalStudents} {t('quizzes.students')}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.completionRate')}</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.overview.completionRate}%</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {quiz.totalStudents - quiz.completedStudents} {t('quizzes.pending')}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.averageTime')}</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.overview.averageTime}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {t('quizzes.of')} {quiz.duration} {t('quizzes.minutes')}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.highestScore')}</p>
                <p className="text-2xl font-bold text-green-600">{analytics.overview.highestScore}%</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {analytics.studentPerformance.find(s => s.rank === 1)?.name}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('quizzes.questions')}</p>
                <p className="text-2xl font-bold text-indigo-600">{quiz.totalQuestions}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {analytics.questionAnalysis.filter(q => q.difficulty === 'easy').length} {t('quizzes.easy')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {['overview', 'questions', 'students', 'trends', 'insights', 'comparison'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t(`quizzes.${tab}`)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    {t('quizzes.scoreDistribution')}
                  </h3>
                  <div className="space-y-4">
                    {analytics.scoreDistribution.map((item) => (
                      <div key={item.range} className="flex items-center gap-4">
                        <div className="w-20">
                          <span className="text-sm font-medium text-gray-900">{item.range}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{item.count} {t('quizzes.students')}</span>
                            <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: item.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-500" />
                    {t('quizzes.performanceSummary')}
                  </h3>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                        <span className="text-gray-700">{t('quizzes.highestScore')}</span>
                        <span className="font-bold text-green-600">{analytics.overview.highestScore}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                        <span className="text-gray-700">{t('quizzes.lowestScore')}</span>
                        <span className="font-bold text-red-600">{analytics.overview.lowestScore}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                        <span className="text-gray-700">{t('quizzes.medianScore')}</span>
                        <span className="font-bold text-blue-600">{analytics.overview.medianScore}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                        <span className="text-gray-700">{t('quizzes.standardDeviation')}</span>
                        <span className="font-bold text-gray-900">{analytics.overview.standardDeviation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.studentEngagement')}</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{t('quizzes.completed')}</span>
                        <span className="text-sm font-bold text-green-600">{quiz.completedStudents}/{quiz.totalStudents}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(quiz.completedStudents / quiz.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{t('quizzes.inProgress')}</span>
                        <span className="text-sm font-bold text-yellow-600">
                          {quiz.totalStudents - quiz.completedStudents}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                          style={{ width: `${((quiz.totalStudents - quiz.completedStudents) / quiz.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{t('quizzes.notStarted')}</span>
                        <span className="text-sm font-bold text-red-600">0</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.timeAnalysis')}</h3>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock3 className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-600">{t('quizzes.averageCompletionTime')}</p>
                            <p className="text-lg font-bold text-gray-900">{analytics.overview.averageTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{t('quizzes.quizDuration')}</p>
                          <p className="text-lg font-bold text-gray-900">{quiz.duration} {t('common.minutes')}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>{t('quizzes.fastest')}: 18:20</span>
                          <span>{t('quizzes.slowest')}: 28:15</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t('quizzes.question')}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t('quizzes.type')}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t('quizzes.difficulty')}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t('quizzes.correctRate')}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t('quizzes.avgTime')}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t('quizzes.points')}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {t('quizzes.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.questionAnalysis.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{q.question}</p>
                            <p className="text-xs text-gray-500 mt-1">{q.correctAnswer}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {q.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                            {t(`quizzes.${q.difficulty}`)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>{q.correctRate}%</span>
                                <span>{q.studentAttempts} {t('quizzes.attempts')}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    q.correctRate >= 80 ? 'bg-green-500' :
                                    q.correctRate >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${q.correctRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{q.averageTime}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                            {q.points}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {/* View question details */}}
                              className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                              title={t('quizzes.viewDetails')}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {/* Edit question */}}
                              className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                              title={t('common.edit')}
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {t('quizzes.difficultyBreakdown')}
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="text-gray-700">{t('quizzes.easy')}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {analytics.questionAnalysis.filter(q => q.difficulty === 'easy').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="text-gray-700">{t('quizzes.medium')}</span>
                      <span className="text-2xl font-bold text-yellow-600">
                        {analytics.questionAnalysis.filter(q => q.difficulty === 'medium').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="text-gray-700">{t('quizzes.hard')}</span>
                      <span className="text-2xl font-bold text-red-600">
                        {analytics.questionAnalysis.filter(q => q.difficulty === 'hard').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-500" />
                    {t('quizzes.questionTypeAnalysis')}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Multiple Choice</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">True/False</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Short Answer</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    {t('quizzes.topPerformingQuestions')}
                  </h4>
                  <div className="space-y-3">
                    {analytics.questionAnalysis
                      .filter(q => q.correctRate >= 80)
                      .sort((a, b) => b.correctRate - a.correctRate)
                      .slice(0, 3)
                      .map((q, index) => (
                        <div key={q.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              <span className="font-bold">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">Q{q.id}</p>
                              <p className="text-xs text-gray-500">{q.correctRate}% {t('quizzes.correct')}</p>
                            </div>
                          </div>
                          <Star className="w-5 h-5 text-yellow-400" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">{t('quizzes.studentPerformance')}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">{t('quizzes.showing')}:</span>
                  <select className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>{t('quizzes.allStudents')}</option>
                    <option>{t('quizzes.passedOnly')}</option>
                    <option>{t('quizzes.failedOnly')}</option>
                    <option>{t('quizzes.topPerformers')}</option>
                  </select>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analytics.studentPerformance.map((student) => (
                    <div 
                      key={student.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-700">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-500">{student.studentId} • {student.grade}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'passed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status === 'passed' ? t('quizzes.passed') : t('quizzes.failed')}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('quizzes.score')}</span>
                          <span className="text-lg font-bold text-gray-900">{student.score}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('quizzes.rank')}</span>
                          <span className="text-lg font-bold text-blue-600">#{student.rank}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('quizzes.timeSpent')}</span>
                          <span className="text-sm font-medium text-gray-900">{student.timeSpent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('quizzes.improvement')}</span>
                          <span className={`text-sm font-medium ${
                            student.improvement.startsWith('+')
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {student.improvement}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="flex-1 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {t('quizzes.viewDetails')}
                          </button>
                          <button
                            onClick={() => {/* Send message */}}
                            className="flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {t('common.message')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {t('quizzes.student')}
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {t('quizzes.score')}
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {t('quizzes.rank')}
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {t('quizzes.timeSpent')}
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {t('quizzes.status')}
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {t('quizzes.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.studentPerformance.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                <span className="font-medium text-blue-700">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-gray-900">{student.score}</span>
                              <span className="text-sm text-gray-500">/100</span>
                              <span className={`ml-2 text-sm font-medium ${
                                student.percentage >= 80 ? 'text-green-600' :
                                student.percentage >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                ({student.percentage}%)
                              </span>
                            </div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  student.percentage >= 80 ? 'bg-green-500' :
                                  student.percentage >= 60 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${student.percentage}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                student.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                student.rank <= 3 ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                <span className="font-bold">#{student.rank}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{student.timeSpent}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(student.status)}
                              <span className={`text-sm font-medium ${
                                student.status === 'passed' ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {student.status === 'passed' ? t('quizzes.passed') : t('quizzes.failed')}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                {t('quizzes.viewDetails')}
                              </button>
                              <button
                                onClick={() => {/* Message student */}}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                {t('common.message')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.dailyAverageScores')}</h4>
                  <div className="space-y-4">
                    {analytics.trends.dailyScores.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${day.average}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{day.average}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.completionTrend')}</h4>
                  <div className="space-y-4">
                    {analytics.trends.completionRate.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{day.day}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${day.rate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{day.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.timeOfDayAnalysis')}</h4>
                <div className="grid grid-cols-5 gap-4">
                  {analytics.trends.timeOfDay.map((time, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-gray-900">{time.average}%</div>
                        <div className="text-xs text-gray-600">{time.hour}</div>
                      </div>
                      <div className="h-32 flex items-end justify-center">
                        <div 
                          className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-500"
                          style={{ height: `${time.average}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{time.attempts} {t('quizzes.attempts')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    {t('quizzes.keyInsights')}
                  </h3>
                  <div className="space-y-4">
                    {analytics.insights.map((insight, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        insight.type === 'success' ? 'bg-green-50 border-green-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                          {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                          {insight.type === 'info' && <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{insight.text}</p>
                            <p className="text-xs text-gray-600 mt-1">{insight.suggestion}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                                insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {insight.impact} {t('quizzes.impact')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    {t('quizzes.recommendations')}
                  </h3>
                  <div className="space-y-3">
                    {analytics.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-700">{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.actionableInsights')}</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-2">{t('quizzes.immediateActions')}</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• {t('quizzes.reviewDifficultQuestions')}</li>
                      <li>• {t('quizzes.contactLowPerformers')}</li>
                      <li>• {t('quizzes.updateQuizSettings')}</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-2">{t('quizzes.longTermStrategies')}</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• {t('quizzes.adjustCurriculumFocus')}</li>
                      <li>• {t('quizzes.implementStudyGroups')}</li>
                      <li>• {t('quizzes.enhanceLearningMaterials')}</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-2">{t('quizzes.futureImprovements')}</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• {t('quizzes.addPracticeQuestions')}</li>
                      <li>• {t('quizzes.createVideoTutorials')}</li>
                      <li>• {t('quizzes.implementGamification')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{t('quizzes.classAverage')}</h4>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {analytics.comparison.classAverage}%
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('quizzes.schoolAverage')}</span>
                      <span className="font-medium">{analytics.comparison.schoolAverage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('quizzes.previousQuiz')}</span>
                      <span className="font-medium">{analytics.comparison.previousQuiz}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('quizzes.improvement')}</span>
                      <span className="font-medium text-green-600">{analytics.comparison.improvement}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.performanceTrend')}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Month</span>
                      <span className="text-sm font-medium text-green-600">+5.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Quarter</span>
                      <span className="text-sm font-medium text-green-600">+8.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Year-to-Date</span>
                      <span className="text-sm font-medium text-red-600">-1.3%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.goalProgress')}</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{t('quizzes.targetScore')}</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(analytics.overview.averageScore / 85) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{t('quizzes.passingRateGoal')}</span>
                        <span className="font-medium">90%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(analytics.overview.passingRate / 90) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={t('quizzes.studentDetails')}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-700">
                  {selectedStudent.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-gray-600">{selectedStudent.studentId} • {selectedStudent.grade}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.score')}</p>
                <p className="text-xl font-bold text-gray-900">{selectedStudent.score}/100</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.rank')}</p>
                <p className="text-xl font-bold text-blue-600">#{selectedStudent.rank}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.accuracy')}</p>
                <p className="text-xl font-bold text-green-600">{selectedStudent.accuracy}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('quizzes.improvement')}</p>
                <p className={`text-xl font-bold ${
                  selectedStudent.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedStudent.improvement}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{t('quizzes.performanceBreakdown')}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('quizzes.timeSpent')}</span>
                    <span className="text-sm font-medium">{selectedStudent.timeSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('quizzes.submissionTime')}</span>
                    <span className="text-sm font-medium">{selectedStudent.submissionTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('quizzes.status')}</span>
                    <span className={`text-sm font-medium ${
                      selectedStudent.status === 'passed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedStudent.status === 'passed' ? t('quizzes.passed') : t('quizzes.failed')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  // Navigate to student profile
                  navigate(`/students/${selectedStudent.studentId}`);
                  setSelectedStudent(null);
                }}
                variant="primary"
                className="flex-1"
              >
                {t('quizzes.viewProfile')}
              </Button>
              <Button
                onClick={() => {
                  // Send message to student
                  setSelectedStudent(null);
                }}
                variant="outline"
                className="flex-1"
              >
                {t('common.message')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuizAnalytics;