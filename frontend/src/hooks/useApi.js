import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const useApi = () => {
  const { token, refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.request({
        method,
        url,
        data,
        ...config
      });
      
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || { message: err.message };
      setError(errorData);
      
      if (err.response?.status === 401 && token) {
        try {
          const newToken = await refreshToken();
          if (newToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            const retryResponse = await api.request({
              method,
              url,
              data,
              ...config
            });
            return retryResponse.data;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, [token, refreshToken]);

  const get = useCallback((url, config = {}) => 
    request('GET', url, null, config), [request]);

  const post = useCallback((url, data, config = {}) => 
    request('POST', url, data, config), [request]);

  const put = useCallback((url, data, config = {}) => 
    request('PUT', url, data, config), [request]);

  const patch = useCallback((url, data, config = {}) => 
    request('PATCH', url, data, config), [request]);

  const del = useCallback((url, config = {}) => 
    request('DELETE', url, null, config), [request]);

  const upload = useCallback(async (url, file, onProgress = null, config = {}) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
        ...config
      });
      
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || { message: err.message };
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, []);

  const download = useCallback(async (url, filename, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(url, {
        responseType: 'blob',
        ...config
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return { success: true };
    } catch (err) {
      const errorData = err.response?.data || { message: err.message };
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setAuthHeader = useCallback((newToken) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }, []);

  const removeAuthHeader = useCallback(() => {
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const endpoints = {
    auth: {
      login: (data) => post('/auth/login', data),
      register: (data) => post('/auth/register', data),
      verifyOTP: (data) => post('/auth/verify-otp', data),
      resendOTP: (data) => post('/auth/resend-otp', data),
      forgotPassword: (data) => post('/auth/forgot-password', data),
      resetPassword: (data) => post('/auth/reset-password', data),
      changePassword: (data) => post('/auth/change-password', data),
      profile: () => get('/auth/profile'),
      updateProfile: (data) => put('/auth/profile', data),
      logout: () => post('/auth/logout')
    },
    users: {
      list: (params) => get('/users', { params }),
      get: (id) => get(`/users/${id}`),
      create: (data) => post('/users', data),
      update: (id, data) => put(`/users/${id}`, data),
      delete: (id) => del(`/users/${id}`),
      bulkImport: (file) => upload('/users/import', file),
      bulkExport: (params) => download('/users/export', 'users.csv', { params }),
      roles: () => get('/users/roles'),
      permissions: () => get('/users/permissions')
    },
    students: {
      list: (params) => get('/students', { params }),
      get: (id) => get(`/students/${id}`),
      create: (data) => post('/students', data),
      update: (id, data) => put(`/students/${id}`, data),
      delete: (id) => del(`/students/${id}`),
      progress: (id) => get(`/students/${id}/progress`),
      assignments: (id) => get(`/students/${id}/assignments`),
      quizzes: (id) => get(`/students/${id}/quizzes`),
      attendance: (id) => get(`/students/${id}/attendance`),
      grades: (id) => get(`/students/${id}/grades`)
    },
    teachers: {
      list: (params) => get('/teachers', { params }),
      get: (id) => get(`/teachers/${id}`),
      create: (data) => post('/teachers', data),
      update: (id, data) => put(`/teachers/${id}`, data),
      delete: (id) => del(`/teachers/${id}`),
      subjects: (id) => get(`/teachers/${id}/subjects`),
      classes: (id) => get(`/teachers/${id}/classes`),
      schedule: (id) => get(`/teachers/${id}/schedule`),
      analytics: (id) => get(`/teachers/${id}/analytics`)
    },
    assignments: {
      list: (params) => get('/assignments', { params }),
      get: (id) => get(`/assignments/${id}`),
      create: (data) => post('/assignments', data),
      update: (id, data) => put(`/assignments/${id}`, data),
      delete: (id) => del(`/assignments/${id}`),
      submit: (id, data) => post(`/assignments/${id}/submit`, data),
      grade: (id, submissionId, data) => put(`/assignments/${id}/submissions/${submissionId}/grade`, data),
      submissions: (id) => get(`/assignments/${id}/submissions`),
      analytics: (id) => get(`/assignments/${id}/analytics`)
    },
    quizzes: {
      list: (params) => get('/quizzes', { params }),
      get: (id) => get(`/quizzes/${id}`),
      create: (data) => post('/quizzes', data),
      update: (id, data) => put(`/quizzes/${id}`, data),
      delete: (id) => del(`/quizzes/${id}`),
      take: (id) => get(`/quizzes/${id}/take`),
      submit: (id, data) => post(`/quizzes/${id}/submit`, data),
      results: (id) => get(`/quizzes/${id}/results`),
      analytics: (id) => get(`/quizzes/${id}/analytics`)
    },
    library: {
      books: (params) => get('/library/books', { params }),
      getBook: (id) => get(`/library/books/${id}`),
      createBook: (data) => post('/library/books', data),
      updateBook: (id, data) => put(`/library/books/${id}`, data),
      deleteBook: (id) => del(`/library/books/${id}`),
      categories: () => get('/library/categories'),
      subjects: () => get('/library/subjects'),
      readingProgress: (id) => get(`/library/books/${id}/progress`),
      updateProgress: (id, data) => put(`/library/books/${id}/progress`, data),
      download: (id) => download(`/library/books/${id}/download`, 'book.pdf'),
      search: (params) => get('/library/search', { params })
    },
    analytics: {
      overview: () => get('/analytics/overview'),
      users: (params) => get('/analytics/users', { params }),
      academic: (params) => get('/analytics/academic', { params }),
      library: (params) => get('/analytics/library', { params }),
      realtime: () => get('/analytics/realtime'),
      export: (type, params) => download(`/analytics/export/${type}`, `analytics-${type}.csv`, { params })
    },
    ai: {
      lessonPlanner: (data) => post('/ai/lesson-planner', data),
      studyPlanner: (data) => post('/ai/study-planner', data),
      learningSupport: (data) => post('/ai/learning-support', data),
      howWeWork: () => get('/ai/how-we-work'),
      chat: (data) => post('/ai/chat', data)
    }
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    del,
    upload,
    download,
    clearError,
    setAuthHeader,
    removeAuthHeader,
    endpoints,
    api
  };
};

export const useApiQuery = (key, fetcher, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.lazy);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async (params = {}) => {
    if (options.lazy && !isFetching) {
      setIsFetching(true);
      setLoading(true);
    }

    try {
      const result = await fetcher(params);
      setData(result);
      setError(null);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [fetcher, options]);

  useEffect(() => {
    if (!options.lazy) {
      fetchData();
    }
  }, [fetchData, options.lazy]);

  const refetch = useCallback((params = {}) => {
    return fetchData(params);
  }, [fetchData]);

  const mutate = useCallback(async (mutator, optimisticData = null) => {
    if (optimisticData) {
      setData(optimisticData);
    }

    try {
      const result = await mutator();
      setData(result);
      setError(null);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      if (optimisticData) {
        setData(data);
      }
      setError(err);
      options.onError?.(err);
      throw err;
    }
  }, [data, options]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
    isFetching
  };
};

export const useInfiniteApiQuery = (key, fetcher, options = {}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(!options.lazy);
  const [error, setError] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const result = await fetcher({ page, ...options.params });
      
      if (result.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...result]);
        setPage(prev => prev + 1);
      }
      
      setError(null);
      options.onSuccess?.(result);
    } catch (err) {
      setError(err);
      options.onError?.(err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page, hasMore, isFetchingMore, fetcher, options]);

  useEffect(() => {
    if (!options.lazy) {
      loadMore();
    }
  }, []);

  const refetch = useCallback(async () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    
    try {
      const result = await fetcher({ page: 1, ...options.params });
      setData(result);
      setPage(2);
      setHasMore(result.length > 0);
      setError(null);
      options.onSuccess?.(result);
    } catch (err) {
      setError(err);
      options.onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [fetcher, options]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    isFetchingMore,
    loadMore,
    refetch,
    reset
  };
};