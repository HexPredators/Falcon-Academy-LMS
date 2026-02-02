import api from './api';

export const libraryService = {
  uploadBook: async (bookData) => {
    const formData = new FormData();
    
    Object.keys(bookData).forEach((key) => {
      if (key === 'file' && bookData.file) {
        formData.append('file', bookData.file);
      } else if (key === 'coverImage' && bookData.coverImage) {
        formData.append('coverImage', bookData.coverImage);
      } else {
        formData.append(key, bookData[key]);
      }
    });
    
    const response = await api.post('/library/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getBooks: async (params = {}) => {
    const response = await api.get('/library/books', { params });
    return response.data;
  },

  getBookById: async (bookId) => {
    const response = await api.get(`/library/books/${bookId}`);
    return response.data;
  },

  updateBook: async (bookId, bookData) => {
    const formData = new FormData();
    
    Object.keys(bookData).forEach((key) => {
      if (key === 'file' && bookData.file) {
        formData.append('file', bookData.file);
      } else if (key === 'coverImage' && bookData.coverImage) {
        formData.append('coverImage', bookData.coverImage);
      } else if (bookData[key] !== undefined) {
        formData.append(key, bookData[key]);
      }
    });
    
    const response = await api.put(`/library/books/${bookId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await api.delete(`/library/books/${bookId}`);
    return response.data;
  },

  downloadBook: async (bookId) => {
    const response = await api.get(`/library/books/${bookId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  readBook: async (bookId) => {
    const response = await api.get(`/library/books/${bookId}/read`);
    return response.data;
  },

  updateReadingProgress: async (bookId, progressData) => {
    const response = await api.post(`/library/books/${bookId}/progress`, progressData);
    return response.data;
  },

  getReadingProgress: async (bookId) => {
    const response = await api.get(`/library/books/${bookId}/progress`);
    return response.data;
  },

  getStudentReadingProgress: async (studentId, params = {}) => {
    const response = await api.get(`/library/students/${studentId}/progress`, { params });
    return response.data;
  },

  getPopularBooks: async (params = {}) => {
    const response = await api.get('/library/books/popular', { params });
    return response.data;
  },

  getRecentBooks: async (params = {}) => {
    const response = await api.get('/library/books/recent', { params });
    return response.data;
  },

  getRecommendedBooks: async (params = {}) => {
    const response = await api.get('/library/books/recommended', { params });
    return response.data;
  },

  searchBooks: async (query, params = {}) => {
    const response = await api.get('/library/books/search', {
      params: { query, ...params },
    });
    return response.data;
  },

  filterBooks: async (filters, params = {}) => {
    const response = await api.get('/library/books/filter', {
      params: { ...filters, ...params },
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/library/categories');
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/library/subjects');
    return response.data;
  },

  getGrades: async () => {
    const response = await api.get('/library/grades');
    return response.data;
  },

  getStreams: async () => {
    const response = await api.get('/library/streams');
    return response.data;
  },

  addCategory: async (categoryData) => {
    const response = await api.post('/library/categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/library/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/library/categories/${categoryId}`);
    return response.data;
  },

  addBookmark: async (bookId, pageNumber, note = '') => {
    const response = await api.post(`/library/books/${bookId}/bookmarks`, {
      pageNumber,
      note,
    });
    return response.data;
  },

  getBookmarks: async (bookId) => {
    const response = await api.get(`/library/books/${bookId}/bookmarks`);
    return response.data;
  },

  deleteBookmark: async (bookId, bookmarkId) => {
    const response = await api.delete(`/library/books/${bookId}/bookmarks/${bookmarkId}`);
    return response.data;
  },

  addHighlight: async (bookId, highlightData) => {
    const response = await api.post(`/library/books/${bookId}/highlights`, highlightData);
    return response.data;
  },

  getHighlights: async (bookId) => {
    const response = await api.get(`/library/books/${bookId}/highlights`);
    return response.data;
  },

  deleteHighlight: async (bookId, highlightId) => {
    const response = await api.delete(`/library/books/${bookId}/highlights/${highlightId}`);
    return response.data;
  },

  addNote: async (bookId, noteData) => {
    const response = await api.post(`/library/books/${bookId}/notes`, noteData);
    return response.data;
  },

  getNotes: async (bookId) => {
    const response = await api.get(`/library/books/${bookId}/notes`);
    return response.data;
  },

  updateNote: async (bookId, noteId, noteData) => {
    const response = await api.put(`/library/books/${bookId}/notes/${noteId}`, noteData);
    return response.data;
  },

  deleteNote: async (bookId, noteId) => {
    const response = await api.delete(`/library/books/${bookId}/notes/${noteId}`);
    return response.data;
  },

  getLibraryStatistics: async () => {
    const response = await api.get('/library/statistics');
    return response.data;
  },

  getMostReadBooks: async (params = {}) => {
    const response = await api.get('/library/analytics/most-read', { params });
    return response.data;
  },

  getReadingTimeAnalytics: async (params = {}) => {
    const response = await api.get('/library/analytics/reading-time', { params });
    return response.data;
  },

  getStudentReadingAnalytics: async (studentId, params = {}) => {
    const response = await api.get(`/library/analytics/student/${studentId}`, { params });
    return response.data;
  },

  getClassReadingAnalytics: async (grade, section, params = {}) => {
    const response = await api.get(`/library/analytics/class/${grade}/${section}`, { params });
    return response.data;
  },

  bulkUploadBooks: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/library/books/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  exportLibraryCatalog: async (params = {}) => {
    const response = await api.get('/library/export-catalog', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  requestBook: async (bookRequestData) => {
    const response = await api.post('/library/requests', bookRequestData);
    return response.data;
  },

  getBookRequests: async (params = {}) => {
    const response = await api.get('/library/requests', { params });
    return response.data;
  },

  approveBookRequest: async (requestId) => {
    const response = await api.put(`/library/requests/${requestId}/approve`);
    return response.data;
  },

  rejectBookRequest: async (requestId, reason) => {
    const response = await api.put(`/library/requests/${requestId}/reject`, { reason });
    return response.data;
  },

  addReview: async (bookId, reviewData) => {
    const response = await api.post(`/library/books/${bookId}/reviews`, reviewData);
    return response.data;
  },

  getReviews: async (bookId, params = {}) => {
    const response = await api.get(`/library/books/${bookId}/reviews`, { params });
    return response.data;
  },

  updateReview: async (bookId, reviewId, reviewData) => {
    const response = await api.put(`/library/books/${bookId}/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (bookId, reviewId) => {
    const response = await api.delete(`/library/books/${bookId}/reviews/${reviewId}`);
    return response.data;
  },

  getBookSuggestions: async (params = {}) => {
    const response = await api.get('/library/suggestions', { params });
    return response.data;
  },

  generateReadingReport: async (studentId, params = {}) => {
    const response = await api.get(`/library/reports/reading/${studentId}`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};