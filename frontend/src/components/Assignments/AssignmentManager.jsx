import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  Filter, 
  Search, 
  Download, 
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useNotification } from '../../contexts/NotificationContext';

// Fuckin' services
import { assignmentService } from '../../services/assignmentService';

// Fuckin' components that are common
import AssignmentCard from './AssignmentCard';
import CreateAssignmentModal from './CreateAssignmentModal';
import AssignmentFilters from './AssignmentFilters';
import SubmissionModal from './SubmissionModal';
import GradingInterface from './GradingInterface';

const AssignmentManager = () => {
  const { user } = useAuth();
  const { realTimeData, emitEvent } = useSocket();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    status: '',
    subject: '',
    search: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [view, setView] = useState('list'); 

  //this code must fetch components. if it doesn't work I will sucide my self aaaaaa!
  const { data: assignmentsData, isLoading, error } = useQuery(
    ['assignments', user.role, user.id, filters],
    () => assignmentService.getAssignments(user.role, user.id, filters),
    {
      refetchInterval: 30000, 
      staleTime: 10000,
    }
  );

  useEffect(() => {
    if (realTimeData.liveUpdates?.assignments) {
      queryClient.invalidateQueries(['assignments']);
    }
  }, [realTimeData.liveUpdates, queryClient]);

  const createAssignmentMutation = useMutation(
    assignmentService.createAssignment,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignments']);
        setShowCreateModal(false);
        showNotification({
          type: 'success',
          title: 'Assignment Created',
          message: 'Assignment has been created successfully'
        });
      },
      onError: (error) => {
        showNotification({
          type: 'error',
          title: 'Creation Failed',
          message: error.message || 'Failed to create assignment'
        });
      }
    }
  );

  const submitAssignmentMutation = useMutation(
    assignmentService.submitAssignment,
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['assignments']);
        setShowSubmissionModal(false);
        
        emitEvent('assignment_submitted', {
          assignmentId: variables.assignmentId,
          studentId: user.id,
          studentName: `${user.first_name} ${user.last_name}`
        });

        showNotification({
          type: 'success',
          title: 'Assignment Submitted',
          message: `Assignment submitted successfully${data.data.is_late ? ' (Late Submission)' : ''}`
        });
      },
      onError: (error) => {
        showNotification({
          type: 'error',
          title: 'Submission Failed',
          message: error.message || 'Failed to submit assignment'
        });
      }
    }
  );

  const handleCreateAssignment = (assignmentData) => {
    createAssignmentMutation.mutate(assignmentData);
  };

  const handleSubmitAssignment = (submissionData) => {
    submitAssignmentMutation.mutate({
      assignmentId: selectedAssignment.id,
      ...submissionData
    });
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    
    if (user.role === 'student' && assignment.submission_status !== 'graded') {
      setShowSubmissionModal(true);
    }
  };

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
            Failed to load assignments
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your assignments.
          </p>
          <button 
            onClick={() => queryClient.refetchQueries(['assignments'])}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { assignments, pagination, summary } = assignmentsData.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === 'teacher' ? 'Manage Assignments' : 'My Assignments'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'teacher' 
              ? 'Create and manage assignments for your classes'
              : 'View and submit your assignments'
            }
          </p>
        </div>

        {user.role === 'teacher' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Assignment
          </button>
        )}
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-500">{summary.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-green-500">{summary.submitted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Graded</p>
                <p className="text-2xl font-bold text-purple-500">{summary.graded}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <AssignmentFilters 
            filters={filters}
            onFilterChange={setFilters}
            userRole={user.role}
          />
          
          <div className="flex items-center space-x-4">
          {/* Toggles and Buttons mother fucker */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
            </div>

            {/* Export Button for Teachers  ma nigga'*/}
            {user.role === 'teacher' && (
              <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assignments Grid o List */}
      <div className={`
        ${view === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }
      `}>
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            view={view}
            userRole={user.role}
            onView={handleViewAssignment}
            onAction={(action, assignment) => {
              switch (action) {
                case 'submit':
                  setSelectedAssignment(assignment);
                  setShowSubmissionModal(true);
                  break;
                case 'grade':
                
                  break;
                case 'view':
                  
                  break;
              }
            }}
          />
        ))}
      </div>

      {/* Empty State  of matter hahha*/}
      {assignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No assignments found
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.status || filters.subject || filters.search
              ? 'Try adjusting your filters to see more results.'
              : user.role === 'teacher'
              ? 'Create your first assignment to get started.'
              : 'You currently have no assignments.'
            }
          </p>
          {user.role === 'teacher' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Assignment
            </button>
          )}
        </div>
      )}

      {/* Pagination dude */}
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

      {/* Modals nigga'*/}
      {showCreateModal && (
        <CreateAssignmentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAssignment}
          isLoading={createAssignmentMutation.isLoading}
        />
      )}

      {showSubmissionModal && selectedAssignment && (
        <SubmissionModal
          assignment={selectedAssignment}
          onClose={() => setShowSubmissionModal(false)}
          onSubmit={handleSubmitAssignment}
          isLoading={submitAssignmentMutation.isLoading}
        />
      )}
    </div>
  );
};

export default AssignmentManager;