import api from './api';

export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  bulkImportUsers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  exportUsers: async (params = {}) => {
    const response = await api.get('/users/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  getStudents: async (params = {}) => {
    const response = await api.get('/users/students', { params });
    return response.data;
  },

  getTeachers: async (params = {}) => {
    const response = await api.get('/users/teachers', { params });
    return response.data;
  },

  getParents: async (params = {}) => {
    const response = await api.get('/users/parents', { params });
    return response.data;
  },

  getDirectors: async () => {
    const response = await api.get('/users/directors');
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get('/users/admins');
    return response.data;
  },

  assignRole: async (userId, role) => {
    const response = await api.post(`/users/${userId}/assign-role`, { role });
    return response.data;
  },

  updatePermissions: async (userId, permissions) => {
    const response = await api.put(`/users/${userId}/permissions`, { permissions });
    return response.data;
  },

  suspendUser: async (userId, reason) => {
    const response = await api.post(`/users/${userId}/suspend`, { reason });
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await api.post(`/users/${userId}/activate`);
    return response.data;
  },

  getUserActivity: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/activity`, { params });
    return response.data;
  },

  searchUsers: async (query, params = {}) => {
    const response = await api.get('/users/search', {
      params: { query, ...params },
    });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/users/statistics');
    return response.data;
  },

  updateProfilePicture: async (userId, imageFile) => {
    const formData = new FormData();
    formData.append('profilePicture', imageFile);
    
    const response = await api.post(`/users/${userId}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateStudentGrade: async (studentId, gradeData) => {
    const response = await api.put(`/users/students/${studentId}/grade`, gradeData);
    return response.data;
  },

  updateTeacherSubjects: async (teacherId, subjects) => {
    const response = await api.put(`/users/teachers/${teacherId}/subjects`, { subjects });
    return response.data;
  },

  getGradeStudents: async (grade, section = null) => {
    const response = await api.get(`/users/students/grade/${grade}`, {
      params: { section },
    });
    return response.data;
  },

  getSectionStudents: async (grade, section) => {
    const response = await api.get(`/users/students/section/${grade}/${section}`);
    return response.data;
  },

  getStreamStudents: async (stream) => {
    const response = await api.get(`/users/students/stream/${stream}`);
    return response.data;
  },

  getTeacherSections: async (teacherId) => {
    const response = await api.get(`/users/teachers/${teacherId}/sections`);
    return response.data;
  },

  assignTeacherToSection: async (teacherId, sectionData) => {
    const response = await api.post(`/users/teachers/${teacherId}/assign-section`, sectionData);
    return response.data;
  },

  removeTeacherFromSection: async (teacherId, sectionData) => {
    const response = await api.delete(`/users/teachers/${teacherId}/remove-section`, {
      data: sectionData,
    });
    return response.data;
  },

  getStudentParents: async (studentId) => {
    const response = await api.get(`/users/students/${studentId}/parents`);
    return response.data;
  },

  getParentChildren: async (parentId) => {
    const response = await api.get(`/users/parents/${parentId}/children`);
    return response.data;
  },

  getUserNotifications: async () => {
    const response = await api.get('/users/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId) => {
    const response = await api.put(`/users/notifications/${notificationId}/read`);
    return response.data;
  },

  clearNotifications: async () => {
    const response = await api.delete('/users/notifications');
    return response.data;
  },

  updateUserSettings: async (settings) => {
    const response = await api.put('/users/settings', settings);
    return response.data;
  },

  getUserDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },
};