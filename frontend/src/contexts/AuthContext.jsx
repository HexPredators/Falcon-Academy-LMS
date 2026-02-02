import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          const response = await axios.get(`${API_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (response.data.valid) {
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      
      const redirectTo = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(redirectTo);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, userData);

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      
      const redirectTo = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(redirectTo);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Email verified successfully!');
      
      const redirectTo = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(redirectTo);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/resend-otp`, { email });
      toast.success('OTP sent successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      toast.success('Password reset instructions sent to your email!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password
      });
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      logout();
      return null;
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    const rolePermissions = {
      super_admin: ['*'],
      director: ['read_all', 'write_all', 'delete_all'],
      school_admin: ['read_all', 'write_all', 'delete_limited'],
      teacher: ['read_own', 'write_own', 'delete_own'],
      student: ['read_own'],
      parent: ['read_linked'],
      librarian: ['read_all', 'write_books', 'delete_books'],
      other: []
    };

    const userPermissions = rolePermissions[user.role] || [];
    
    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      return true;
    }

    if (user.role === 'teacher' && user.subjects && user.grades) {
      if (permission.startsWith('grade_')) {
        const grade = permission.split('_')[1];
        return user.grades.includes(parseInt(grade));
      }
      if (permission.startsWith('subject_')) {
        const subject = permission.split('_')[1];
        return user.subjects.includes(subject);
      }
    }

    if (user.role === 'director') {
      if (user.name === 'Mr. Kidane') return true;
      if (user.name === 'Mr. Andargachew') {
        return permission.includes('grade_11') || permission.includes('grade_12');
      }
      if (user.name === 'Mr. Zerihun') {
        return permission.includes('grade_9') || permission.includes('grade_10');
      }
    }

    return false;
  };

  const canAccessGrade = (grade) => {
    if (!user) return false;
    
    if (hasPermission('*')) return true;
    
    if (user.role === 'teacher') {
      return user.grades?.includes(parseInt(grade)) || false;
    }
    
    if (user.role === 'director') {
      if (user.name === 'Mr. Kidane') return true;
      if (user.name === 'Mr. Andargachew') return grade >= 11;
      if (user.name === 'Mr. Zerihun') return grade <= 10;
    }
    
    if (user.role === 'student') {
      return user.grade === parseInt(grade);
    }
    
    return false;
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'super_admin':
        return '/admin/dashboard';
      case 'director':
        return '/director/dashboard';
      case 'school_admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'parent':
        return '/parent/dashboard';
      case 'librarian':
        return '/librarian/dashboard';
      default:
        return '/';
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    logout,
    refreshToken,
    hasPermission,
    canAccessGrade,
    getDashboardPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;