import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  enableTwoFactor: async () => {
    const response = await api.post('/auth/enable-2fa');
    return response.data;
  },

  verifyTwoFactor: async (code) => {
    const response = await api.post('/auth/verify-2fa', { code });
    return response.data;
  },

  disableTwoFactor: async () => {
    const response = await api.post('/auth/disable-2fa');
    return response.data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  registerStudent: async (studentData) => {
    const response = await api.post('/auth/register/student', studentData);
    return response.data;
  },

  registerTeacher: async (teacherData) => {
    const response = await api.post('/auth/register/teacher', teacherData);
    return response.data;
  },

  registerParent: async (parentData) => {
    const response = await api.post('/auth/register/parent', parentData);
    return response.data;
  },

  getRegistrationStats: async () => {
    const response = await api.get('/auth/registration-stats');
    return response.data;
  },

  validateFAV: async (favId) => {
    const response = await api.post('/auth/validate-fav', { favId });
    return response.data;
  },
};