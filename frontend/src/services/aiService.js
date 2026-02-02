import api from './api';

export const aiService = {
  getAIModules: async () => {
    const response = await api.get('/ai/modules');
    return response.data;
  },

  getHowWeWork: async (topic = null) => {
    const response = await api.get('/ai/how-we-work', {
      params: { topic },
    });
    return response.data;
  },

  generateLessonPlan: async (lessonData) => {
    const response = await api.post('/ai/lesson-planner', lessonData);
    return response.data;
  },

  generateStudyPlan: async (studyData) => {
    const response = await api.post('/ai/study-planner', studyData);
    return response.data;
  },

  getInteractiveSupport: async (query, context = {}) => {
    const response = await api.post('/ai/interactive-support', {
      query,
      context,
    });
    return response.data;
  },

  explainConcept: async (conceptData) => {
    const response = await api.post('/ai/explain-concept', conceptData);
    return response.data;
  },

  generatePracticeQuestions: async (questionData) => {
    const response = await api.post('/ai/practice-questions', questionData);
    return response.data;
  },

  analyzeLearningProgress: async (studentId, subject = null) => {
    const response = await api.get(`/ai/analyze-progress/${studentId}`, {
      params: { subject },
    });
    return response.data;
  },

  getLearningPath: async (studentId, subject) => {
    const response = await api.get(`/ai/learning-path/${studentId}/${subject}`);
    return response.data;
  },

  suggestResources: async (topic, grade, subject = null) => {
    const response = await api.post('/ai/suggest-resources', {
      topic,
      grade,
      subject,
    });
    return response.data;
  },

  getAITutor: async (question, subject, grade) => {
    const response = await api.post('/ai/tutor', {
      question,
      subject,
      grade,
    });
    return response.data;
  },

  generateAssignmentIdeas: async (assignmentData) => {
    const response = await api.post('/ai/assignment-ideas', assignmentData);
    return response.data;
  },

  generateQuizQuestions: async (quizData) => {
    const response = await api.post('/ai/quiz-questions', quizData);
    return response.data;
  },

  gradeEssay: async (essayData) => {
    const response = await api.post('/ai/grade-essay', essayData);
    return response.data;
  },

  provideFeedback: async (feedbackData) => {
    const response = await api.post('/ai/provide-feedback', feedbackData);
    return response.data;
  },

  translateContent: async (content, targetLanguage) => {
    const response = await api.post('/ai/translate', {
      content,
      targetLanguage,
    });
    return response.data;
  },

  summarizeText: async (text, length = 'medium') => {
    const response = await api.post('/ai/summarize', {
      text,
      length,
    });
    return response.data;
  },

  generateFlashcards: async (topic, numberOfCards = 10) => {
    const response = await api.post('/ai/flashcards', {
      topic,
      numberOfCards,
    });
    return response.data;
  },

  createMindMap: async (topic, subtopics = []) => {
    const response = await api.post('/ai/mindmap', {
      topic,
      subtopics,
    });
    return response.data;
  },

  getAIConversation: async (conversationId = null) => {
    const response = await api.get('/ai/conversation', {
      params: { conversationId },
    });
    return response.data;
  },

  continueAIConversation: async (conversationId, message) => {
    const response = await api.post('/ai/conversation', {
      conversationId,
      message,
    });
    return response.data;
  },

  deleteAIConversation: async (conversationId) => {
    const response = await api.delete(`/ai/conversation/${conversationId}`);
    return response.data;
  },

  getAIHistory: async (params = {}) => {
    const response = await api.get('/ai/history', { params });
    return response.data;
  },

  getAISettings: async () => {
    const response = await api.get('/ai/settings');
    return response.data;
  },

  updateAISettings: async (settings) => {
    const response = await api.put('/ai/settings', settings);
    return response.data;
  },

  getAIUsage: async (params = {}) => {
    const response = await api.get('/ai/usage', { params });
    return response.data;
  },

  generateReport: async (reportData) => {
    const response = await api.post('/ai/generate-report', reportData);
    return response.data;
  },

  analyzeWriting: async (writingData) => {
    const response = await api.post('/ai/analyze-writing', writingData);
    return response.data;
  },

  suggestImprovements: async (content, context) => {
    const response = await api.post('/ai/suggest-improvements', {
      content,
      context,
    });
    return response.data;
  },

  generatePresentation: async (topic, slides = 10) => {
    const response = await api.post('/ai/generate-presentation', {
      topic,
      slides,
    });
    return response.data;
  },

  createStudyGuide: async (topic, chapters = []) => {
    const response = await api.post('/ai/study-guide', {
      topic,
      chapters,
    });
    return response.data;
  },

  getAITips: async (category = 'general') => {
    const response = await api.get('/ai/tips', {
      params: { category },
    });
    return response.data;
  },

  evaluateAnswer: async (question, answer, correctAnswer = null) => {
    const response = await api.post('/ai/evaluate-answer', {
      question,
      answer,
      correctAnswer,
    });
    return response.data;
  },

  generateAnalytics: async (analyticsData) => {
    const response = await api.post('/ai/generate-analytics', analyticsData);
    return response.data;
  },

  predictPerformance: async (studentId, subject, upcomingTest = null) => {
    const response = await api.post('/ai/predict-performance', {
      studentId,
      subject,
      upcomingTest,
    });
    return response.data;
  },

  recommendStudyMethods: async (studentId, subject) => {
    const response = await api.get(`/ai/recommend-methods/${studentId}/${subject}`);
    return response.data;
  },

  createCustomExercise: async (exerciseData) => {
    const response = await api.post('/ai/custom-exercise', exerciseData);
    return response.data;
  },

  getAIVoiceAssistant: async (audioFile, language = 'en') => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);
    
    const response = await api.post('/ai/voice-assistant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  textToSpeech: async (text, language = 'en', voice = null) => {
    const response = await api.post('/ai/text-to-speech', {
      text,
      language,
      voice,
    });
    return response.data;
  },

  detectLanguage: async (text) => {
    const response = await api.post('/ai/detect-language', { text });
    return response.data;
  },

  getAvailableLanguages: async () => {
    const response = await api.get('/ai/languages');
    return response.data;
  },

  getAIModels: async () => {
    const response = await api.get('/ai/models');
    return response.data;
  },

  switchAIModel: async (modelId) => {
    const response = await api.post('/ai/switch-model', { modelId });
    return response.data;
  },

  getAICapabilities: async () => {
    const response = await api.get('/ai/capabilities');
    return response.data;
  },
};