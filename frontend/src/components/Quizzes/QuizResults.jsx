import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Clock, BarChart, Download, Eye, ChevronLeft, Share, Printer, Star, Target, TrendingUp, X, BookOpen, AlertCircle, ThumbsUp, Lightbulb } from 'lucide-react';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import Modal from '../Common/Modal';

const QuizResults = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockQuiz = {
          id: parseInt(id),
          title: 'Algebra Basics Quiz',
          subject: 'Mathematics',
          teacher: 'Mr. Alemayehu',
          totalPoints: 100,
          passingScore: 60,
          duration: 30,
          completedAt: '2024-02-25 10:28:45',
          description: 'Test your understanding of basic algebraic concepts',
          difficulty: 'medium',
          totalQuestions: 15,
          category: 'Mathematics'
        };

        const mockResults = {
          id: 101,
          studentName: 'ደመሰሰ ታደሰ',
          studentId: 'S2023001',
          grade: '10',
          section: 'A',
          score: 85,
          totalPoints: 100,
          percentage: 85,
          rank: 3,
          totalStudents: 28,
          timeSpent: '24:35',
          submittedAt: '2024-02-25 10:28:45',
          status: 'passed',
          gradeLetter: 'B+',
          questions: [
            {
              id: 1,
              question: 'What is the solution to 2x + 5 = 15?',
              type: 'multiple-choice',
              points: 5,
              studentAnswer: 'x = 5',
              correctAnswer: 'x = 5',
              isCorrect: true,
              explanation: 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5',
              timeSpent: '0:45',
              difficulty: 'easy',
              options: [
                { id: 1, text: 'x = 5', isCorrect: true },
                { id: 2, text: 'x = 10', isCorrect: false },
                { id: 3, text: 'x = 7.5', isCorrect: false },
                { id: 4, text: 'x = 20', isCorrect: false }
              ]
            },
            {
              id: 2,
              question: 'The equation x² = 4 has only one solution.',
              type: 'true-false',
              points: 3,
              studentAnswer: 'True',
              correctAnswer: 'False',
              isCorrect: false,
              explanation: 'x² = 4 has two solutions: x = 2 and x = -2',
              timeSpent: '1:20',
              difficulty: 'medium',
              options: [
                { id: 1, text: 'True', isCorrect: false },
                { id: 2, text: 'False', isCorrect: true }
              ]
            },
            {
              id: 3,
              question: 'Which of the following is a quadratic equation?',
              type: 'multiple-choice',
              points: 4,
              studentAnswer: 'x² + 3x - 4 = 0',
              correctAnswer: 'x² + 3x - 4 = 0',
              isCorrect: true,
              explanation: 'A quadratic equation has the form ax² + bx + c = 0',
              timeSpent: '1:05',
              difficulty: 'easy',
              options: [
                { id: 1, text: 'x + 2 = 5', isCorrect: false },
                { id: 2, text: 'x² + 3x - 4 = 0', isCorrect: true },
                { id: 3, text: '2x + 3y = 6', isCorrect: false },
                { id: 4, text: 'x³ - 2x + 1 = 0', isCorrect: false }
              ]
            },
            {
              id: 4,
              question: 'Solve for y: 3y - 7 = 8',
              type: 'short-answer',
              points: 6,
              studentAnswer: '5',
              correctAnswer: '5',
              isCorrect: true,
              explanation: 'Add 7 to both sides: 3y = 15, then divide by 3: y = 5',
              timeSpent: '2:30',
              difficulty: 'hard'
            },
            {
              id: 5,
              question: 'Factorize: x² - 9',
              type: 'short-answer',
              points: 5,
              studentAnswer: '(x-3)(x+3)',
              correctAnswer: '(x-3)(x+3)',
              isCorrect: true,
              explanation: 'This is a difference of squares: x² - 9 = (x-3)(x+3)',
              timeSpent: '1:45',
              difficulty: 'medium'
            }
          ],
          analytics: {
            correct: 4,
            incorrect: 1,
            skipped: 0,
            accuracy: 80,
            timePerQuestion: '6:09',
            subjectBreakdown: {
              'Algebra': 85,
              'Equations': 90,
              'Basics': 80
            },
            difficultyBreakdown: {
              easy: 100,
              medium: 60,
              hard: 100
            }
          },
          recommendations: [
            {
              title: 'Review quadratic equations and their solutions',
              description: 'Focus on solving quadratic equations using different methods',
              priority: 'high',
              resources: ['Algebra Textbook Chapter 3', 'Practice Set #4']
            },
            {
              title: 'Practice solving linear equations',
              description: 'Work on equations with variables on both sides',
              priority: 'medium',
              resources: ['Online Practice Modules', 'Worksheet #2']
            },
            {
              title: 'Focus on algebraic expressions',
              description: 'Simplify and factor algebraic expressions',
              priority: 'low',
              resources: ['Video Tutorials', 'Practice Problems']
            }
          ],
          teacherFeedback: {
            comment: 'Excellent work on algebraic expressions. Need more practice with quadratic equations.',
            strengths: ['Strong understanding of basic algebra', 'Good problem-solving skills'],
            improvements: ['Work on quadratic equations', 'Improve speed on complex problems'],
            nextSteps: ['Complete practice set #4', 'Review chapter 3 notes']
          },
          comparison: {
            classAverage: 78.5,
            previousScore: 72,
            improvement: '+13%',
            percentile: 85
          }
        };

        setQuiz(mockQuiz);
        setResults(mockResults);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading results:', error);
      setLoading(false);
    }
  };

  const downloadResults = async () => {
    setDownloading(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const content = `
        ===============================
        QUIZ RESULTS REPORT
        ===============================
        
        Quiz: ${quiz.title}
        Subject: ${quiz.subject}
        Student: ${results.studentName} (${results.studentId})
        Date: ${new Date(results.submittedAt).toLocaleDateString()}
        Score: ${results.score}/${results.totalPoints} (${results.percentage}%)
        Grade: ${results.gradeLetter}
        Status: ${results.status === 'passed' ? 'PASSED' : 'FAILED'}
        
        ===============================
        PERFORMANCE SUMMARY
        ===============================
        
        • Correct Answers: ${results.analytics.correct}
        • Incorrect Answers: ${results.analytics.incorrect}
        • Accuracy: ${results.analytics.accuracy}%
        • Time Spent: ${results.timeSpent}
        • Class Rank: ${results.rank}/${results.totalStudents}
        • Percentile: ${results.comparison.percentile}th
        
        ===============================
        SUBJECT BREAKDOWN
        ===============================
        
        ${Object.entries(results.analytics.subjectBreakdown)
          .map(([subject, score]) => `• ${subject}: ${score}%`)
          .join('\n')}
        
        ===============================
        TEACHER FEEDBACK
        ===============================
        
        ${results.teacherFeedback.comment}
        
        Strengths:
        ${results.teacherFeedback.strengths.map(s => `• ${s}`).join('\n')}
        
        Areas for Improvement:
        ${results.teacherFeedback.improvements.map(i => `• ${i}`).join('\n')}
        
        ===============================
        RECOMMENDATIONS
        ===============================
        
        ${results.recommendations.map((rec, idx) => 
          `${idx + 1}. ${rec.title}\n   ${rec.description}`
        ).join('\n\n')}
        
        ===============================
        GENERATED ON: ${new Date().toLocaleString()}
        ===============================
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-results-${quiz.title.replace(/\s+/g, '-')}-${results.studentId}-${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const printResults = () => {
    const printContent = document.getElementById('quiz-results-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${quiz.title} - Results</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .score { font-size: 48px; font-weight: bold; color: #4f46e5; }
              .section { margin: 30px 0; }
              .question { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
              .correct { background-color: #f0fdf4; border-color: #86efac; }
              .incorrect { background-color: #fef2f2; border-color: #fca5a5; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `${quiz.title} - Quiz Results`,
        text: `I scored ${results.score}/${results.totalPoints} (${results.percentage}%) on ${quiz.title}!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert(t('quizzes.linkCopied')))
        .catch(console.error);
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-green-500 bg-green-50';
    if (percentage >= 70) return 'text-yellow-500 bg-yellow-50';
    if (percentage >= 60) return 'text-orange-500 bg-orange-50';
    return 'text-red-500 bg-red-50';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{t('quizzes.loadingResults')}</p>
        </div>
      </div>
    );
  }

  if (!quiz || !results) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('quizzes.resultsNotFound')}</h3>
          <p className="text-gray-600 mb-6">{t('quizzes.noResultsAvailable')}</p>
          <Button onClick={() => navigate('/quizzes')}>
            {t('quizzes.backToQuizzes')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div id="quiz-results-content">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {quiz.subject}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {results.grade}{results.section}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {results.studentName}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={shareResults}
                variant="outline"
                className="px-4"
              >
                <Share className="w-4 h-4 mr-2" />
                {t('quizzes.share')}
              </Button>
              <Button
                onClick={downloadResults}
                disabled={downloading}
                variant="outline"
                className="px-4"
              >
                {downloading ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    {t('quizzes.downloading')}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {t('quizzes.download')}
                  </>
                )}
              </Button>
              <Button
                onClick={printResults}
                variant="outline"
                className="px-4"
              >
                <Printer className="w-4 h-4 mr-2" />
                {t('quizzes.print')}
              </Button>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{t('quizzes.yourScore')}</h2>
                <p className="text-blue-100 opacity-90">{quiz.description}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{quiz.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{t('quizzes.completedOn')} {new Date(results.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">{quiz.passingScore}% {t('quizzes.passingScore')}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-40 h-40" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${results.percentage * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="0.3em"
                      className="text-3xl font-bold fill-white"
                    >
                      {results.percentage}%
                    </text>
                  </svg>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{results.score}/{results.totalPoints} {t('quizzes.points')}</div>
                  <div className={`px-4 py-1 rounded-full inline-block mt-2 ${
                    results.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <span className="font-semibold">
                      {results.status === 'passed' ? t('quizzes.passed') : t('quizzes.failed')}
                    </span>
                    <span className="ml-2 opacity-90">{results.gradeLetter}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {['summary', 'questions', 'analytics', 'recommendations'].map((tab) => (
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
                {/* Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                          <div>
                            <p className="text-sm text-green-700">{t('quizzes.correct')}</p>
                            <p className="text-2xl font-bold text-green-900">{results.analytics.correct}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-8 h-8 text-red-500" />
                          <div>
                            <p className="text-sm text-red-700">{t('quizzes.incorrect')}</p>
                            <p className="text-2xl font-bold text-red-900">{results.analytics.incorrect}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3">
                          <Target className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="text-sm text-blue-700">{t('quizzes.accuracy')}</p>
                            <p className="text-2xl font-bold text-blue-900">{results.analytics.accuracy}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-3">
                          <Clock className="w-8 h-8 text-purple-500" />
                          <div>
                            <p className="text-sm text-purple-700">{t('quizzes.timeSpent')}</p>
                            <p className="text-2xl font-bold text-purple-900">{results.timeSpent}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grade Progress */}
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-semibold text-gray-900">{t('quizzes.gradeProgress')}</h3>
                          <p className="text-gray-600">{t('quizzes.basedOnPerformance')}</p>
                        </div>
                        <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getPerformanceColor(results.percentage)}`}>
                          {results.gradeLetter}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>0%</span>
                          <span>{t('quizzes.passing')}: {quiz.passingScore}%</span>
                          <span>100%</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full relative"
                            style={{ width: `${results.percentage}%` }}
                          >
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gray-900"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('quizzes.yourScore')}</span>
                          <span className="font-medium">{results.percentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Rank Card */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-900">{t('quizzes.classRank')}</h3>
                          <p className="text-gray-600 mt-2">
                            {t('quizzes.youRanked')} <span className="font-bold text-blue-600">{results.rank}</span> {t('quizzes.outOf')} {results.totalStudents} {t('quizzes.students')}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {t('quizzes.percentile')}: {results.comparison.percentile}th
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600">#{results.rank}</div>
                            <div className="text-sm text-gray-600">{t('quizzes.rank')}</div>
                          </div>
                          <div className="h-16 w-px bg-gray-300"></div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">+{results.comparison.improvement}</div>
                            <div className="text-sm text-gray-600">{t('quizzes.vsPrevious')}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subject Breakdown */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.subjectBreakdown')}</h3>
                      <div className="space-y-4">
                        {Object.entries(results.analytics.subjectBreakdown).map(([subject, score]) => (
                          <div key={subject} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-gray-900">{subject}</span>
                              <span className="text-lg font-bold text-blue-600">{score}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  score >= 90 ? 'bg-green-500' :
                                  score >= 80 ? 'bg-blue-500' :
                                  score >= 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Questions Tab */}
                {activeTab === 'questions' && (
                  <div className="space-y-6">
                    {results.questions.map((q, index) => (
                      <div 
                        key={q.id} 
                        className={`border rounded-xl p-6 transition-all hover:shadow-md ${
                          q.isCorrect 
                            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                            : 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              q.isCorrect ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {q.isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {t('quizzes.question')} {index + 1}
                                </h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(q.difficulty)}`}>
                                  {t(`quizzes.${q.difficulty}`)}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                  {q.points} {t('quizzes.points')}
                                </span>
                              </div>
                              <p className="font-medium text-gray-900">{q.question}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedQuestion(q)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors self-start"
                          >
                            <Eye className="w-4 h-4" />
                            {t('quizzes.viewDetails')}
                          </button>
                        </div>

                        <div className="mb-6">
                          {/* Multiple Choice Options */}
                          {q.type === 'multiple-choice' && (
                            <div className="space-y-2">
                              {q.options.map((option, optIndex) => (
                                <div
                                  key={option.id}
                                  className={`p-3 rounded-lg transition-all ${
                                    option.isCorrect
                                      ? 'bg-green-100 border-2 border-green-300'
                                      : q.studentAnswer === option.text && !option.isCorrect
                                      ? 'bg-red-100 border-2 border-red-300'
                                      : 'bg-gray-100 hover:bg-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      option.isCorrect
                                        ? 'bg-green-500 text-white'
                                        : q.studentAnswer === option.text && !option.isCorrect
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-300 text-gray-700'
                                    }`}>
                                      <span className="font-medium">
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                    </div>
                                    <span className="flex-1">{option.text}</span>
                                    {option.isCorrect && (
                                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    )}
                                    {q.studentAnswer === option.text && !option.isCorrect && (
                                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* True/False */}
                          {q.type === 'true-false' && (
                            <div className="grid grid-cols-2 gap-4">
                              {q.options.map((option) => (
                                <div
                                  key={option.id}
                                  className={`p-4 rounded-lg text-center transition-all ${
                                    option.isCorrect
                                      ? 'bg-green-100 border-2 border-green-300'
                                      : q.studentAnswer === option.text && !option.isCorrect
                                      ? 'bg-red-100 border-2 border-red-300'
                                      : 'bg-gray-100 hover:bg-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="font-medium">{option.text}</span>
                                    {option.isCorrect && (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    )}
                                    {q.studentAnswer === option.text && !option.isCorrect && (
                                      <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Short Answer */}
                          {q.type === 'short-answer' && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-700 mb-2">{t('quizzes.yourAnswer')}</p>
                                <p className="font-bold text-green-900 text-lg">{q.studentAnswer}</p>
                              </div>
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm font-medium text-blue-700 mb-2">{t('quizzes.correctAnswer')}</p>
                                <p className="font-bold text-blue-900 text-lg">{q.correctAnswer}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <p className="text-sm font-medium text-gray-900">{t('quizzes.explanation')}</p>
                          </div>
                          <p className="text-gray-700">{q.explanation}</p>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{t('quizzes.timeSpent')}: {q.timeSpent}</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              q.isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {q.isCorrect ? t('quizzes.correct') : t('quizzes.incorrect')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart className="w-5 h-5 text-blue-500" />
                          {t('quizzes.performanceOverview')}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">{t('quizzes.correctAnswers')}</span>
                              <span className="text-sm font-medium text-green-600">{results.analytics.correct} ({results.questions.length - results.analytics.incorrect})</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${(results.analytics.correct / results.questions.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">{t('quizzes.incorrectAnswers')}</span>
                              <span className="text-sm font-medium text-red-600">{results.analytics.incorrect}</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 rounded-full transition-all duration-500"
                                style={{ width: `${(results.analytics.incorrect / results.questions.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">{t('quizzes.accuracy')}</span>
                              <span className="text-sm font-medium text-blue-600">{results.analytics.accuracy}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${results.analytics.accuracy}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-500" />
                          {t('quizzes.timeAnalysis')}
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{t('quizzes.totalTime')}</span>
                            <span className="font-medium text-gray-900">{results.timeSpent}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{t('quizzes.timePerQuestion')}</span>
                            <span className="font-medium text-gray-900">{results.analytics.timePerQuestion}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{t('quizzes.timeRemaining')}</span>
                            <span className="font-medium text-green-600">
                              {30 - parseInt(results.timeSpent.split(':')[0])}:{(60 - parseInt(results.timeSpent.split(':')[1])).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{t('quizzes.efficiency')}</span>
                            <span className="font-medium text-blue-600">
                              {((parseInt(results.timeSpent.split(':')[0]) * 60 + parseInt(results.timeSpent.split(':')[1])) / (30 * 60) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Difficulty Analysis */}
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.difficultyBreakdown')}</h4>
                      <div className="space-y-4">
                        {Object.entries(results.analytics.difficultyBreakdown).map(([difficulty, score]) => (
                          <div key={difficulty} className="flex items-center gap-4">
                            <div className="w-24">
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(difficulty)}`}>
                                {t(`quizzes.${difficulty}`)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">
                                  {results.questions.filter(q => q.difficulty === difficulty).length} {t('quizzes.questions')}
                                </span>
                                <span className="text-sm font-medium text-gray-900">{score}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    difficulty === 'easy' ? 'bg-green-500' :
                                    difficulty === 'medium' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Question Type Analysis */}
                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.questionTypeAnalysis')}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {results.questions.filter(q => q.type === 'multiple-choice').length}
                          </div>
                          <div className="text-sm text-gray-600">{t('quizzes.multipleChoice')}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {((results.questions.filter(q => q.type === 'multiple-choice' && q.isCorrect).length / 
                               results.questions.filter(q => q.type === 'multiple-choice').length) * 100 || 0).toFixed(0)}% {t('quizzes.correct')}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {results.questions.filter(q => q.type === 'true-false').length}
                          </div>
                          <div className="text-sm text-gray-600">{t('quizzes.trueFalse')}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {((results.questions.filter(q => q.type === 'true-false' && q.isCorrect).length / 
                               results.questions.filter(q => q.type === 'true-false').length) * 100 || 0).toFixed(0)}% {t('quizzes.correct')}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {results.questions.filter(q => q.type === 'short-answer').length}
                          </div>
                          <div className="text-sm text-gray-600">{t('quizzes.shortAnswer')}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {((results.questions.filter(q => q.type === 'short-answer' && q.isCorrect).length / 
                               results.questions.filter(q => q.type === 'short-answer').length) * 100 || 0).toFixed(0)}% {t('quizzes.correct')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        {t('quizzes.studyRecommendations')}
                      </h3>
                      <div className="space-y-4">
                        {results.recommendations.map((rec, index) => (
                          <div key={index} className="p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                <span className="text-xs font-bold">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-medium text-gray-900">{rec.title}</h5>
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {rec.priority} {t('quizzes.priority')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {rec.resources.map((resource, resIndex) => (
                                    <span key={resIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                      {resource}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.immediateActions')}</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{t('quizzes.reviewIncorrect')}</p>
                              <p className="text-sm text-gray-600 mt-1">{t('quizzes.reviewIncorrectDesc')}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{t('quizzes.createStudyNotes')}</p>
                              <p className="text-sm text-gray-600 mt-1">{t('quizzes.createStudyNotesDesc')}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Clock className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{t('quizzes.schedulePractice')}</p>
                              <p className="text-sm text-gray-600 mt-1">{t('quizzes.schedulePracticeDesc')}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-4">{t('quizzes.longTermGoals')}</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{t('quizzes.achieveScore')} 90%</p>
                              <p className="text-sm text-gray-600 mt-1">{t('quizzes.nextQuiz')}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Target className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{t('quizzes.completeAll')}</p>
                              <p className="text-sm text-gray-600 mt-1">{t('quizzes.extraPractice')}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{t('quizzes.becomeTop')} 10%</p>
                              <p className="text-sm text-gray-600 mt-1">{t('quizzes.classRankGoal')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.quickStats')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('quizzes.score')}</span>
                  <span className="font-medium text-gray-900">{results.score}/{results.totalPoints}</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('quizzes.percentage')}</span>
                  <span className={`font-bold ${getPerformanceColor(results.percentage)} px-2 py-1 rounded`}>
                    {results.percentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('quizzes.status')}</span>
                  <span className={`font-medium ${
                    results.status === 'passed' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.status === 'passed' ? t('quizzes.passed') : t('quizzes.failed')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('quizzes.classRank')}</span>
                  <span className="font-medium text-gray-900">#{results.rank}</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('quizzes.timeSpent')}</span>
                  <span className="font-medium text-gray-900">{results.timeSpent}</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('quizzes.date')}</span>
                  <span className="font-medium text-gray-900">
                    {new Date(results.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('quizzes.teacher')}</span>
                  <span className="font-medium text-gray-900">{quiz.teacher}</span>
                </div>
              </div>
            </div>

            {/* Performance Meter */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.performanceMeter')}</h3>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <svg className="w-36 h-36" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${results.percentage * 2.51} 251`}
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="0.3em"
                      className="text-xl font-bold fill-gray-900"
                    >
                      {results.percentage}%
                    </text>
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{t('quizzes.overallPerformance')}</p>
                  <p className={`text-lg font-bold ${
                    results.percentage >= 80 ? 'text-green-600' :
                    results.percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {results.percentage >= 90 ? t('quizzes.excellent') :
                     results.percentage >= 80 ? t('quizzes.veryGood') :
                     results.percentage >= 70 ? t('quizzes.good') :
                     results.percentage >= 60 ? t('quizzes.satisfactory') :
                     t('quizzes.needsImprovement')}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-blue-500" />
                {t('quizzes.teacherFeedback')}
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-gray-700">{results.teacherFeedback.comment}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">{t('quizzes.strengths')}</p>
                  <ul className="space-y-1">
                    {results.teacherFeedback.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">{t('quizzes.areasToImprove')}</p>
                  <ul className="space-y-1">
                    {results.teacherFeedback.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('quizzes.nextSteps')}</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <BarChart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium">{t('quizzes.viewAnalytics')}</p>
                      <p className="text-sm opacity-75">{t('quizzes.detailedAnalysis')}</p>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => setActiveTab('questions')}
                  className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium">{t('quizzes.reviewAnswers')}</p>
                      <p className="text-sm opacity-75">{t('quizzes.seeCorrectAnswers')}</p>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => navigate(`/quizzes/${id}/retake`)}
                  className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium">{t('quizzes.takeAgain')}</p>
                      <p className="text-sm opacity-75">{t('quizzes.improveScore')}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <Modal
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          title={`${t('quizzes.question')} ${results.questions.findIndex(q => q.id === selectedQuestion.id) + 1}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedQuestion.question}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${
                selectedQuestion.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm font-medium text-gray-600 mb-2">{t('quizzes.yourAnswer')}</p>
                <p className={`text-lg font-bold ${
                  selectedQuestion.isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {selectedQuestion.studentAnswer}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {selectedQuestion.isCorrect ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">{t('quizzes.correct')}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">{t('quizzes.incorrect')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-gray-600 mb-2">{t('quizzes.correctAnswer')}</p>
                <p className="text-lg font-bold text-blue-700">{selectedQuestion.correctAnswer}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">{t('quizzes.explanation')}</h4>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-gray-700">{selectedQuestion.explanation}</p>
              </div>
            </div>

            {selectedQuestion.type === 'multiple-choice' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('quizzes.options')}</h4>
                <div className="space-y-2">
                  {selectedQuestion.options.map((option, idx) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg ${
                        option.isCorrect
                          ? 'bg-green-100 border border-green-300'
                          : selectedQuestion.studentAnswer === option.text && !option.isCorrect
                          ? 'bg-red-100 border border-red-300'
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          option.isCorrect
                            ? 'bg-green-500 text-white'
                            : selectedQuestion.studentAnswer === option.text && !option.isCorrect
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          <span className="font-medium">{String.fromCharCode(65 + idx)}</span>
                        </div>
                        <span className="flex-1">{option.text}</span>
                        {option.isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {selectedQuestion.studentAnswer === option.text && !option.isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                  {t(`quizzes.${selectedQuestion.difficulty}`)}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedQuestion.points} {t('quizzes.points')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{selectedQuestion.timeSpent}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setSelectedQuestion(null)}
                variant="outline"
              >
                {t('quizzes.close')}
              </Button>
              {selectedQuestion.id < results.questions.length && (
                <Button
                  onClick={() => {
                    const nextQuestion = results.questions.find(q => q.id === selectedQuestion.id + 1);
                    if (nextQuestion) {
                      setSelectedQuestion(nextQuestion);
                    }
                  }}
                >
                  {t('quizzes.nextQuestion')}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuizResults;