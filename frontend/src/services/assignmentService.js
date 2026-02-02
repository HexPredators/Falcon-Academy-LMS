import api from './api';

class AssignmentService {
  async getAssignments(role, userId, filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const endpoint = role === 'teacher' 
      ? `/assignments/teacher/${userId}`
      : `/assignments/student/${userId}`;

    return api.get(`${endpoint}?${params.toString()}`);
  }

  async createAssignment(assignmentData) {
    const formData = new FormData();

    Object.entries(assignmentData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'tags' || key === 'resources' || key === 'rubric') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'assignment_file' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
    });

    return api.post('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async submitAssignment({ assignmentId, submissionText, studentNotes, submissionFile }) {
    const formData = new FormData();
    
    formData.append('submission_text', submissionText || '');
    formData.append('student_notes', studentNotes || '');

    if (submissionFile instanceof File) {
      formData.append('submission_file', submissionFile);
    }

    return api.post(`/assignments/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async gradeAssignment(submissionId, gradeData) {
    return api.post(`/assignments/submissions/${submissionId}/grade`, gradeData);
  }

  async getAssignmentAnalytics(assignmentId) {
    return api.get(`/assignments/${assignmentId}/analytics`);
  }

  async getSubmissionDetails(submissionId) {
    return api.get(`/assignments/submissions/${submissionId}`);
  }

  async downloadAssignmentFile(assignmentId) {
    return api.get(`/assignments/${assignmentId}/download`, {
      responseType: 'blob'
    });
  }

  async getSubmissionsForGrading(assignmentId, filters = {}) {
    const params = new URLSearchParams(filters);
    return api.get(`/assignments/${assignmentId}/submissions?${params.toString()}`);
  }
}

export const assignmentService = new AssignmentService();
export default assignmentService.js