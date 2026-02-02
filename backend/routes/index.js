// backend/routes/index.js
const express = require('express');
const router = express.Router();

// Import all route files with dependency injection
module.exports = (db, io) => {
  // Auth routes
  router.use('/auth', require('./auth')(db, io));
  
  // User management routes
  router.use('/users', require('./users')(db, io));
  
  // Assignment routes
  router.use('/assignments', require('./assignments')(db, io));
  
  // Quiz routes
  router.use('/quizzes', require('./quizzes')(db, io));
  
  // Parent routes
  router.use('/parents', require('./parents')(db, io));
  
  // AI Assistant routes
  router.use('/ai', require('./ai')(db, io));
  
  // Analytics routes
  router.use('/analytics', require('./analytics')(db, io));
  
  // Library routes
  router.use('/library', require('./library')(db, io));
  
  // News routes
  router.use('/news', require('./news')(db, io));
  
  // Messaging routes
  router.use('/messaging', require('./messaging')(db, io));

  return router;
};