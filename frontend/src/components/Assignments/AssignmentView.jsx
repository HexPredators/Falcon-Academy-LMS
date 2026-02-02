import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Award, Download, Eye, Edit, Trash2, ChevronLeft, MessageSquare, CheckCircle, AlertCircle, Users, BookOpen, FileCheck, Upload, AlertTriangle, X, Copy, ExternalLink, History, Star, ThumbsUp } from 'lucide-react';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import LoadingSpinner from '../Common/LoadingSpinner';

const AssignmentView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [assignmentStats, setAssignmentStats] = useState(null);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  const loadAssignment = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockAssignment = {
          id: parseInt(id),
          title: 'Algebra Homework: Quadratic Equations',
          description: 'Solve quadratic equations and show your work',
          subject: 'Mathematics',
          grade: '10',
          section: 'A',
          teacher: 'Mr. Alemayehu',
          teacherId: 'TCH001',
          teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
          dueDate: '2024-02-20',
          dueTime: '23:59',
          points: 20,
          status: 'active',
          submissions: 25,
          totalStudents: 30,
          createdAt: '2024-02-15',
          updatedAt: '2024-02-15',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          category: 'Homework',
          tags: ['Algebra', 'Quadratic Equations', 'Mathematics'],
          instructions: `**Instructions for Algebra Homework:**

1. **Solve the following quadratic equations:**
   a) x² - 5x + 6 = 0
   b) 2x² + 3x - 2 = 0
   c) x² - 4x + 4 = 0
   d) 3x² - 12x + 9 = 0

2. **Show your complete work** for each problem including:
   - Factorization method
   - Quadratic formula application
   - Verification of solutions

3. **Submission Guidelines:**
   - Submit your answers in PDF format only
   - Maximum file size: 10MB
   - Include your name and student ID on each page

4. **Grading Criteria:**
   - Correct solutions (40%)
   - Step-by-step work (30%)
   - Neatness & organization (15%)
   - Timeliness (15%)

5. **Late Policy:**
   - Late submissions will be penalized by 10% per day
   - No submissions accepted after 3 days past due date`,
          
          attachments: [
            { 
              id: 1, 
              name: 'algebra_problems.pdf', 
              size: '2.4 MB', 
              type: 'pdf',
              uploadedAt: '2024-02-15 09:30',
              pages: 5
            },
            { 
              id: 2, 
              name: 'sample_solution.pdf', 
              size: '1.8 MB', 
              type: 'pdf',
              uploadedAt: '2024-02-15 10:15',
              pages: 3
            },
            { 
              id: 3, 
              name: 'worksheet.docx', 
              size: '1.2 MB', 
              type: 'docx',
              uploadedAt: '2024-02-15 11:45',
              pages: 4
            }
          ],
          
          rubric: [
            { 
              criterion: 'Correct Solutions', 
              weight: 40,
              description: 'Accuracy of final answers'
            },
            { 
              criterion: 'Step-by-step Work', 
              weight: 30,
              description: 'Clear mathematical reasoning'
            },
            { 
              criterion: 'Neatness & Organization', 
              weight: 15,
              description: 'Presentation and structure'
            },
            { 
              criterion: 'Timeliness', 
              weight: 15,
              description: 'Submission before deadline'
            }
          ],
          
          comments: [
            {
              id: 1,
              user: 'Mr. Alemayehu',
              role: 'teacher',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
              content: 'Remember to show all your work! Partial credit will be given for correct methods even if final answer is wrong.',
              timestamp: '2024-02-15 10:30',
              likes: 12
            },
            {
              id: 2,
              user: 'ደመሰሰ ታደሰ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demesese',
              content: 'Sir, can we submit handwritten work scanned as PDF?',
              timestamp: '2024-02-15 14:15',
              likes: 3
            },
            {
              id: 3,
              user: 'Mr. Alemayehu',
              role: 'teacher',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
              content: 'Yes, scanned handwritten work is acceptable as long as it\'s clear and readable.',
              timestamp: '2024-02-15 15:45',
              likes: 8
            },
            {
              id: 4,
              user: 'ሙሉጌታ አባይ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mulugata',
              content: 'For problem 1c, is it acceptable to use the quadratic formula instead of factoring?',
              timestamp: '2024-02-16 09:20',
              likes: 5
            }
          ],
          
          resources: [
            {
              name: 'Quadratic Equations Textbook Chapter',
              type: 'textbook',
              link: '/library/algebra-textbook-chapter3'
            },
            {
              name: 'Video Tutorial: Solving Quadratic Equations',
              type: 'video',
              link: '/resources/videos/algebra-101'
            },
            {
              name: 'Practice Problems Set',
              type: 'worksheet',
              link: '/resources/worksheets/algebra-practice'
            }
          ]
        };

        const mockSubmission = {
          id: 101,
          studentName: 'ደመሰሰ ታደሰ',
          studentId: 'S2023001',
          studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demesese',
          submittedAt: '2024-02-18 14:30:00',
          status: 'graded',
          score: 18,
          maxScore: 20,
          grade: 'A-',
          feedback: 'Excellent work on showing step-by-step solutions! Minor calculation error in problem 1c - check your arithmetic.',
          teacherComment: 'Great attention to detail and clear presentation. Keep up the good work!',
          files: [
            { name: 'solution_2023001.pdf', size: '3.2 MB', pages: 4 }
          ],
          late: false,
          gradingHistory: [
            { date: '2024-02-18', action: 'Submitted', status: 'pending' },
            { date: '2024-02-19', action: 'Graded', status: 'completed', score: 18 }
          ],
          rubricScores: [
            { criterion: 'Correct Solutions', score: 16, max: 16 },
            { criterion: 'Step-by-step Work', score: 12, max: 12 },
            { criterion: 'Neatness & Organization', score: 5, max: 6 },
            { criterion: 'Timeliness', score: 6, max: 6 }
          ]
        };

        const mockStats = {
          averageScore: 16.5,
          submissionRate: 83.3,
          pendingGrading: 5,
          lateSubmissions: 3,
          topScore: 20,
          lowestScore: 10,
          gradeDistribution: {
            'A': 8,
            'B': 10,
            'C': 5,
            'D': 2,
            'F': 0
          }
        };

        setAssignment(mockAssignment);
        setSubmission(mockSubmission);
        setAssignmentStats(mockStats);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error loading assignment:', error);
      setLoading(false);
    }
  };

  const getTimeRemaining = () => {
    if (!assignment) return { status: 'unknown', message: '', time: '', color: 'gray' };
    
    const dueDate = new Date(`${assignment.dueDate}T${assignment.dueTime}`);
    const now = new Date();
    const diff = dueDate - now;
    
    if (diff < 0) {
      const daysOverdue = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));
      return {
        status: 'overdue',
        message: t('assignments.overdueBy'),
        time: `${daysOverdue} ${t('assignments.days')}`,
        color: 'red',
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />
      };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 2) {
      return {
        status: 'pending',
        message: t('assignments.dueIn'),
        time: `${days} ${t('assignments.days')}`,
        color: 'green',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />
      };
    }
    
    if (days > 0) {
      return {
        status: 'approaching',
        message: t('assignments.dueIn'),
        time: `${days} ${t('assignments.days')} ${hours} ${t('assignments.hours')}`,
        color: 'yellow',
        icon: <Clock className="w-5 h-5 text-yellow-600" />
      };
    }
    
    if (hours > 0) {
      return {
        status: 'urgent',
        message: t('assignments.dueIn'),
        time: `${hours} ${t('assignments.hours')} ${minutes} ${t('assignments.minutes')}`,
        color: 'orange',
        icon: <Clock className="w-5 h-5 text-orange-600" />
      };
    }
    
    return {
      status: 'very-urgent',
      message: t('assignments.dueIn'),
      time: `${minutes} ${t('assignments.minutes')}`,
      color: 'red',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />
    };
  };

  const handleDelete = async () => {
    try {
      // API call to delete assignment
      setShowDeleteConfirm(false);
      alert(t('assignments.deletedSuccess'));
      navigate('/assignments');
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleDownload = (file) => {
    // Simulate download
    alert(`${t('assignments.downloading')} ${file.name}`);
  };

  const handleSubmit = () => {
    navigate(`/assignments/${id}/submit`);
  };

  const handleGrade = () => {
    navigate(`/assignments/${id}/grade`);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/assignments/${id}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => alert(t('assignments.linkCopied')))
      .catch(console.error);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      // API call to submit comment
      const newCommentObj = {
        id: assignment.comments.length + 1,
        user: 'Current User',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        content: newComment,
        timestamp: new Date().toISOString().split('T')[0] + ' ' + 
                  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        likes: 0
      };
      
      setAssignment(prev => ({
        ...prev,
        comments: [...prev.comments, newCommentObj]
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const timeRemaining = getTimeRemaining();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{t('assignments.loading')}</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('assignments.notFound')}</h3>
          <p className="text-gray-600 mb-6">{t('assignments.assignmentNotFound')}</p>
          <Button onClick={() => navigate('/assignments')}>
            {t('assignments.backToAssignments')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/assignments')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  assignment.status === 'active' ? 'bg-green-100 text-green-800' :
                  assignment.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600">{assignment.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Student Actions */}
            {!submission && (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
              >
                <Upload className="w-5 h-5 mr-2" />
                {t('assignments.submit')}
              </Button>
            )}

            {/* Teacher Actions */}
            {assignment.submissions > 0 && (
              <Button
                onClick={handleGrade}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
              >
                <Award className="w-5 h-5 mr-2" />
                {t('assignments.grade')} ({assignment.submissions})
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleShare}
              className="px-6 border-gray-300"
            >
              <Copy className="w-5 h-5 mr-2" />
              {t('assignments.share')}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/assignments/${id}/edit`)}
              className="px-6 border-gray-300"
            >
              <Edit className="w-5 h-5 mr-2" />
              {t('assignments.edit')}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.subject')}</p>
                <p className="font-semibold text-gray-900">{assignment.subject}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.teacher')}</p>
                <p className="font-semibold text-gray-900">{assignment.teacher}</p>
              </div>
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.dueDate')}</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(assignment.dueDate)} {assignment.dueTime}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.points')}</p>
                <p className="font-semibold text-gray-900">{assignment.points}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.submissions')}</p>
                <p className="font-semibold text-gray-900">
                  {assignment.submissions}/{assignment.totalStudents}
                </p>
              </div>
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.difficulty')}</p>
                <p className="font-semibold text-gray-900">{assignment.difficulty}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('assignments.category')}</p>
                <p className="font-semibold text-gray-900">{assignment.category}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Time Remaining Alert */}
          <div className={`rounded-xl p-6 border ${
            timeRemaining.color === 'red' ? 'bg-red-50 border-red-200' :
            timeRemaining.color === 'yellow' || timeRemaining.color === 'orange' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-4">
              {timeRemaining.icon}
              <div className="flex-1">
                <p className="font-bold text-gray-900">
                  {timeRemaining.message} <span className="text-lg">{timeRemaining.time}</span>
                </p>
                <p className="text-sm text-gray-600">
                  {timeRemaining.status === 'overdue' 
                    ? t('assignments.submissionClosed')
                    : timeRemaining.status === 'very-urgent'
                    ? t('assignments.submitNow')
                    : timeRemaining.status === 'urgent'
                    ? t('assignments.submitSoon')
                    : t('assignments.timeRemaining')}
                </p>
              </div>
              {!submission && timeRemaining.status !== 'overdue' && (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {t('assignments.submitNow')}
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {['details', 'instructions', 'rubric', 'submissions', 'comments', 'resources'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-colors relative ${
                      activeTab === tab
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {t(`assignments.${tab}`)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.assignmentDetails')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('assignments.created')}</p>
                        <p className="font-medium text-gray-900">{formatDate(assignment.createdAt)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('assignments.updated')}</p>
                        <p className="font-medium text-gray-900">{formatDate(assignment.updatedAt)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('assignments.grade')}</p>
                        <p className="font-medium text-gray-900">Grade {assignment.grade}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('assignments.section')}</p>
                        <p className="font-medium text-gray-900">{assignment.section}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('assignments.estimatedTime')}</p>
                        <p className="font-medium text-gray-900">{assignment.estimatedTime}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('assignments.status')}</p>
                        <p className="font-medium text-gray-900 capitalize">{assignment.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">{t('assignments.tags')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {assignment.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      {t('assignments.attachments')}
                    </h3>
                    <div className="space-y-3">
                      {assignment.attachments.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.type.toUpperCase()}</span>
                                <span>•</span>
                                <span>{file.pages} pages</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownload(file)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                              title={t('assignments.download')}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                              title={t('assignments.preview')}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions Tab */}
              {activeTab === 'instructions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      {t('assignments.instructions')}
                    </h3>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl">
                      <div className="prose max-w-none">
                        {assignment.instructions.split('\n').map((line, idx) => {
                          if (line.includes('**')) {
                            const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            return <p key={idx} dangerouslySetInnerHTML={{ __html: boldText }} className="mb-3" />;
                          }
                          return <p key={idx} className="mb-3 text-gray-700">{line}</p>;
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Submission Guidelines */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-green-600" />
                      {t('assignments.submissionGuidelines')}
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{t('assignments.formatRequirement')}: PDF only</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{t('assignments.maxSize')}: 10MB</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{t('assignments.nameIdRequired')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Rubric Tab */}
              {activeTab === 'rubric' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.gradingRubric')}</h3>
                    <div className="space-y-4">
                      {assignment.rubric.map((item, idx) => (
                        <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{item.criterion}</h4>
                              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-blue-600">{item.weight}%</div>
                              <div className="text-sm text-gray-600">{t('assignments.weight')}</div>
                            </div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${item.weight}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{t('assignments.total')}</h4>
                            <p className="text-gray-600">{t('assignments.totalPoints')}: {assignment.points}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-blue-600">100%</div>
                            <div className="text-sm text-gray-600">{t('assignments.rubricTotal')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submissions Tab */}
              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  {submission ? (
                    <>
                      <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.yourSubmission')}</h3>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">
                                {t('assignments.submitted')} • {submission.grade}
                              </h4>
                              <p className="text-gray-600">
                                {t('assignments.submittedOn')} {formatDateTime(submission.submittedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-green-600">
                              {submission.score}/{submission.maxScore}
                            </div>
                            <div className="text-sm text-gray-600">{t('assignments.score')}</div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Rubric Scores */}
                          <div className="bg-white rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-3">{t('assignments.rubricScores')}</h5>
                            <div className="space-y-3">
                              {submission.rubricScores.map((rubric, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                  <span className="text-sm text-gray-700">{rubric.criterion}</span>
                                  <span className="font-medium text-gray-900">
                                    {rubric.score}/{rubric.max}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Grading History */}
                          <div className="bg-white rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-3">{t('assignments.gradingHistory')}</h5>
                            <div className="space-y-2">
                              {submission.gradingHistory.map((history, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      history.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></div>
                                    <span>{history.action}</span>
                                  </div>
                                  <span className="text-gray-600">{history.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-900 mb-3">{t('assignments.teacherFeedback')}</h5>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-gray-700 mb-3">{submission.feedback}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{t('assignments.comment')}:</span>
                              <span className="font-medium">{submission.teacherComment}</span>
                            </div>
                          </div>
                        </div>

                        {/* Submitted Files */}
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-900 mb-3">{t('assignments.submittedFiles')}</h5>
                          <div className="flex flex-wrap gap-3">
                            {submission.files.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-gray-900">{file.name}</p>
                                  <p className="text-sm text-gray-600">{file.size}</p>
                                </div>
                                <button
                                  onClick={() => handleDownload(file)}
                                  className="ml-2 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                >
                                  {t('assignments.download')}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-yellow-500" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        {t('assignments.noSubmission')}
                      </h4>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        {t('assignments.submitNowPrompt')}
                      </p>
                      <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {t('assignments.submitNow')}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.discussion')}</h3>
                    <div className="space-y-6">
                      {assignment.comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                          <div className="flex items-start gap-4 mb-3">
                            <img
                              src={comment.avatar}
                              alt={comment.user}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{comment.user}</span>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                      comment.role === 'teacher' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {comment.role}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500">{comment.timestamp}</p>
                                </div>
                                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{comment.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Comment */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">{t('assignments.addComment')}</h4>
                    <div className="space-y-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('assignments.typeComment')}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {t('assignments.markdownSupported')}
                        </div>
                        <Button
                          onClick={submitComment}
                          disabled={!newComment.trim() || submittingComment}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
                        >
                          {submittingComment ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <>
                              <MessageSquare className="w-5 h-5 mr-2" />
                              {t('assignments.post')}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resources Tab */}
              {activeTab === 'resources' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.learningResources')}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {assignment.resources.map((resource, idx) => (
                      <div key={idx} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            resource.type === 'video' ? 'bg-red-100' :
                            resource.type === 'textbook' ? 'bg-blue-100' :
                            'bg-green-100'
                          }`}>
                            <BookOpen className={`w-6 h-6 ${
                              resource.type === 'video' ? 'text-red-600' :
                              resource.type === 'textbook' ? 'text-blue-600' :
                              'text-green-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{resource.name}</h4>
                            <p className="text-sm text-gray-600 capitalize mb-3">{resource.type}</p>
                            <button 
                              onClick={() => navigate(resource.link)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                              {t('assignments.viewResource')}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Status Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <h3 className="font-bold text-lg">{t('assignments.yourStatus')}</h3>
            </div>
            <div className="p-6">
              {submission ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(submission.score / submission.maxScore) * 283} 283`}
                          transform="rotate(-90 50 50)"
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dy="0.3em"
                          className="text-2xl font-bold fill-gray-900"
                        >
                          {submission.score}
                        </text>
                      </svg>
                    </div>
                    <div className="mb-2">
                      <h4 className="text-2xl font-bold text-gray-900">
                        {submission.score}/{submission.maxScore}
                      </h4>
                      <p className="text-sm text-gray-600">{submission.grade}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      submission.status === 'graded' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status === 'graded' 
                        ? t('assignments.graded')
                        : t('assignments.pending')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-gray-600">{t('assignments.submitted')}</span>
                      <span className="font-medium text-gray-900">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-gray-600">{t('assignments.late')}</span>
                      <span className={`font-medium ${submission.late ? 'text-red-600' : 'text-green-600'}`}>
                        {submission.late ? t('assignments.yes') : t('assignments.no')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-gray-600">{t('assignments.files')}</span>
                      <span className="font-medium text-gray-900">{submission.files.length}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setActiveTab('submissions')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    {t('assignments.viewDetails')}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    {t('assignments.notSubmitted')}
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    {t('assignments.submitBeforeDeadline')}
                  </p>
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {t('assignments.submitNow')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.quickActions')}</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left transition-colors flex items-center gap-3 group">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">{t('assignments.downloadAll')}</p>
                  <p className="text-sm opacity-75">{t('assignments.assignmentFiles')}</p>
                </div>
              </button>
              <button className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-left transition-colors flex items-center gap-3 group">
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">{t('assignments.askQuestion')}</p>
                  <p className="text-sm opacity-75">{t('assignments.clarifyInstructions')}</p>
                </div>
              </button>
              <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-left transition-colors flex items-center gap-3 group">
                <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">{t('assignments.viewHistory')}</p>
                  <p className="text-sm opacity-75">{t('assignments.submissionHistory')}</p>
                </div>
              </button>
              <button className="w-full p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-left transition-colors flex items-center gap-3 group">
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">{t('assignments.printAssignment')}</p>
                  <p className="text-sm opacity-75">{t('assignments.physicalCopy')}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Class Stats (Teacher Only) */}
          {assignmentStats && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('assignments.classStatistics')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-600">{t('assignments.averageScore')}</span>
                  <span className="font-bold text-gray-900">{assignmentStats.averageScore}/{assignment.points}</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-600">{t('assignments.submissionRate')}</span>
                  <span className="font-bold text-green-600">{assignmentStats.submissionRate}%</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-600">{t('assignments.pendingGrading')}</span>
                  <span className="font-bold text-yellow-600">{assignmentStats.pendingGrading}</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-600">{t('assignments.lateSubmissions')}</span>
                  <span className="font-bold text-red-600">{assignmentStats.lateSubmissions}</span>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {t('assignments.dangerZone')}
            </h3>
            <p className="text-sm text-red-700 mb-4">
              {t('assignments.deleteWarning')}
            </p>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              {t('assignments.deleteAssignment')}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title={t('assignments.deleteConfirm')}
          size="md"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{t('assignments.deleteConfirmTitle')}</h4>
                <p className="text-gray-600 text-sm">{t('assignments.deleteConfirmDesc')}</p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{t('assignments.allSubmissionsLost')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{t('assignments.cannotUndo')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{t('assignments.gradesRemoved')}</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="px-6"
              >
                {t('assignments.cancel')}
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6"
              >
                {t('assignments.delete')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={t('assignments.shareAssignment')}
          size="md"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{t('assignments.shareLink')}</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/assignments/${id}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button
                  onClick={copyShareLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">{t('assignments.shareVia')}</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t('assignments.message')}
                </button>
                <button className="p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  {t('assignments.embed')}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
              >
                {t('assignments.close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AssignmentView;