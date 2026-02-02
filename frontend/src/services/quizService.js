import api from './api';

export const quizService = {
  createQuiz: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  getQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes', { params });
    return response.data;
  },

  getQuizById: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  updateQuiz: async (quizId, quizData) => {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },

  deleteQuiz: async (quizId) => {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  },

  startQuiz: async (quizId) => {
    const response = await api.post(`/quizzes/${quizId}/start`);
    return response.data;
  },

  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  getAttempts: async (quizId, params = {}) => {
    const response = await api.get(`/quizzes/${quizId}/attempts`, { params });
    return response.data;
  },

  getAttemptById: async (quizId, attemptId) => {
    const response = await api.get(`/quizzes/${quizId}/attempts/${attemptId}`);
    return response.data;
  },

  getStudentAttempts: async (studentId, params = {}) => {
    const response = await api.get(`/quizzes/student/${studentId}/attempts`, { params });
    return response.data;
  },

  getTeacherQuizzes: async (teacherId, params = {}) => {
    const response = await api.get(`/quizzes/teacher/${teacherId}`, { params });
    return response.data;
  },

  getGradeQuizzes: async (grade, section = null, params = {}) => {
    const response = await api.get(`/quizzes/grade/${grade}`, {
      params: { section, ...params },
    });
    return response.data;
  },

  getSubjectQuizzes: async (subject, grade = null, params = {}) => {
    const response = await api.get(`/quizzes/subject/${subject}`, {
      params: { grade, ...params },
    });
    return response.data;
  },

  getUpcomingQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes/upcoming', { params });
    return response.data;
  },

  getPastQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes/past', { params });
    return response.data;
  },

  getQuizStatistics: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/statistics`);
    return response.data;
  },

  getQuestionTypes: async () => {
    const response = await api.get('/quizzes/question-types');
    return response.data;
  },

  createQuestion: async (quizId, questionData) => {
    const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data;
  },

  updateQuestion: async (quizId, questionId, questionData) => {
    const response = await api.put(`/quizzes/${quizId}/questions/${questionId}`, questionData);
    return response.data;
  },

  deleteQuestion: async (quizId, questionId) => {
    const response = await api.delete(`/quizzes/${quizId}/questions/${questionId}`);
    return response.data;
  },

  reorderQuestions: async (quizId, questionOrder) => {
    const response = await api.put(`/quizzes/${quizId}/questions/reorder`, { questionOrder });
    return response.data;
  },

  gradeAttempt: async (quizId, attemptId, grades) => {
    const response = await api.post(`/quizzes/${quizId}/attempts/${attemptId}/grade`, { grades });
    return response.data;
  },

  autoGradeQuiz: async (quizId) => {
    const response = await api.post(`/quizzes/${quizId}/auto-grade`);
    return response.data;
  },

  getQuizAnalytics: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/analytics`);
    return response.data;
  },

  getClassQuizAnalytics: async (grade, section, subject, params = {}) => {
    const response = await api.get(`/quizzes/analytics/class/${grade}/${section}/${subject}`, {
      params,
    });
    return response.data;
  },

  getStudentQuizAnalytics: async (studentId, params = {}) => {
    const response = await api.get(`/quizzes/analytics/student/${studentId}`, { params });
    return response.data;
  },

  generateQuizReport: async (quizId, params = {}) => {
    const response = await api.get(`/quizzes/${quizId}/report`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  exportQuizResults: async (quizId, params = {}) => {
    const response = await api.get(`/quizzes/${quizId}/export-results`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  duplicateQuiz: async (quizId, newQuizData) => {
    const response = await api.post(`/quizzes/${quizId}/duplicate`, newQuizData);
    return response.data;
  },

  archiveQuiz: async (quizId) => {
    const response = await api.post(`/quizzes/${quizId}/archive`);
    return response.data;
  },

  restoreQuiz: async (quizId) => {
    const response = await api.post(`/quizzes/${quizId}/restore`);
    return response.data;
  },

  getArchivedQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes/archived', { params });
    return response.data;
  },

  setTimeLimit: async (quizId, timeLimit) => {
    const response = await api.put(`/quizzes/${quizId}/time-limit`, { timeLimit });
    return response.data;
  },

  setAccessControls: async (quizId, accessControls) => {
    const response = await api.put(`/quizzes/${quizId}/access-controls`, { accessControls });
    return response.data;
  },

  generatePracticeQuiz: async (topic, difficulty, numberOfQuestions) => {
    const response = await api.post('/quizzes/generate-practice', {
      topic,
      difficulty,
      numberOfQuestions,
    });
    return response.data;
  },

  getQuizLeaderboard: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/leaderboard`);
    return response.data;
  },

  bulkImportQuestions: async (quizId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/quizzes/${quizId}/bulk-import-questions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};