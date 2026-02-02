import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  Clock, 
  Eye, 
  BarChart3, 
  Users,
  AlertTriangle,
  CheckCircle,
  Play,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useNotification } from '../../contexts/NotificationContext';

// Services
import { quizService } from '../../services/quizService';

// Components
import QuizCard from './QuizCard';
import CreateQuizModal from './CreateQuizModal';
import QuizTaker from './QuizTaker';
import QuizMonitoring from './QuizMonitoring';
import QuizAnalytics from './QuizAnalytics';

const QuizManager = () => {
  const { user } = useAuth();
  const { realTimeData, emitEvent, isConnected } = useSocket();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    status: '',
    subject: '',
    search: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'monitoring', 'analytics'
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Fetch quizzes based on user role
  const { data: quizzesData, isLoading, error } = useQuery(
    ['quizzes', user.role, user.id, filters],
    () => quizService.getQuizzes(user.role, user.id, filters),
    {
      refetchInterval: user.role === 'teacher' ? 10000 : 30000, // More frequent for teachers
      staleTime: 5000,
    }
  );

  // Real-time updates
  useEffect(() => {
    if (realTimeData.liveUpdates?.quizzes) {
      queryClient.invalidateQueries(['quizzes']);
    }
  }, [realTimeData.liveUpdates, queryClient]);

  // Quiz creation mutation
  const createQuizMutation = useMutation(quizService.createQuiz, {
    onSuccess: () => {
      queryClient.invalidateQueries(['quizzes']);
      setShowCreateModal(false);
      showNotification({
        type: 'success',
        title: 'Quiz Created',
        message: 'Quiz has been created successfully'
      });
    },
    onError: (error) => {
      showNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create quiz'
      });
    }
  });

  // Start quiz mutation
  const startQuizMutation = useMutation(quizService.startQuiz, {
    onSuccess: (data) => {
      setActiveQuiz({
        ...data.data.quiz,
        attemptId: data.data.attempt_id,
        timeLimit: data.data.time_limit
      });
      showNotification({
        type: 'success',
        title: 'Quiz Started',
        message: 'Good luck! The timer has started.'
      });
    },
    onError: (error) => {
      showNotification({
        type: 'error',
        title: 'Failed to Start',
        message: error.message || 'Failed to start quiz'
      });
    }
  });

  const handleCreateQuiz = (quizData) => {
    createQuizMutation.mutate(quizData);
  };

  const handleStartQuiz = (quizId) => {
    startQuizMutation.mutate(quizId);
  };

  const handleViewMonitoring = (quiz) => {
    setSelectedQuiz(quiz);
    setView('monitoring');
  };

  const handleViewAnalytics = (quiz) => {
    setSelectedQuiz(quiz);
    setView('analytics');
  };

  // If a quiz is active, show the quiz taker
  if (activeQuiz) {
    return (
      <QuizTaker
        quiz={activeQuiz}
        onComplete={() => {
          setActiveQuiz(null);
          queryClient.invalidateQueries(['quizzes']);
        }}
        onExit={() => setActiveQuiz(null)}
      />
    );
  }

  // Show monitoring view
  if (view === 'monitoring' && selectedQuiz) {
    return (
      <QuizMonitoring
        quiz={selectedQuiz}
        onBack={() => {
          setView('list');
          setSelectedQuiz(null);
        }}
      />
    );
  }

  // Show analytics view
  if (view === 'analytics' && selectedQuiz) {
    return (
      <QuizAnalytics
        quiz={selectedQuiz}
        onBack={() => {
          setView('list');
          setSelectedQuiz(null);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load quizzes
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your quizzes.
          </p>
          <button 
            onClick={() => queryClient.refetchQueries(['quizzes'])}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { quizzes, pagination, summary } = quizzesData.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === 'teacher' ? 'Manage Quizzes' : 'Available Quizzes'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'teacher' 
              ? 'Create and monitor quizzes for your classes'
              : 'Take quizzes and test your knowledge'
            }
          </p>
        </div>

        {user.role === 'teacher' && (
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Quiz
            </button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-500">{summary.active}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-500">{summary.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-orange-500">{summary.averageScore}%</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* View Toggle for Teachers */}
      {user.role === 'teacher' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === 'list'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All Quizzes
            </button>
            <button
              onClick={() => setView('monitoring')}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === 'monitoring'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Live Monitoring
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === 'analytics'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      )}

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            userRole={user.role}
            onStart={handleStartQuiz}
            onMonitor={handleViewMonitoring}
            onAnalyze={handleViewAnalytics}
            onView={(quiz) => {
              // View quiz details
              setSelectedQuiz(quiz);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.status || filters.subject || filters.search
              ? 'Try adjusting your filters to see more results.'
              : user.role === 'teacher'
              ? 'Create your first quiz to get started.'
              : 'No quizzes are currently available.'
            }
          </p>
          {user.role === 'teacher' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Quiz
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setFilters(prev => ({ ...prev, page }))}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <CreateQuizModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateQuiz}
          isLoading={createQuizMutation.isLoading}
        />
      )}
    </div>
  );
};

export default QuizManager;