const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const AssignmentController = require('../controllers/assignmentController');
const { authenticate, requireRole, checkGradeAccess } = require('../middleware/auth');

module.exports = (db, io) => {
  const assignmentController = new AssignmentController(db, io);

  // Apply authentication to all routes
  router.use(authenticate);

  // Teacher routes
  router.post('/',
    requireRole(['teacher']),
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('subject').notEmpty().withMessage('Subject is required'),
      body('target_grade').isInt({ min: 9, max: 12 }).withMessage('Invalid grade'),
      body('target_section').isIn(['A','B','C','D','E','F','G']).withMessage('Invalid section'),
      body('due_date').isISO8601().withMessage('Invalid due date'),
      body('max_points').isFloat({ min: 0 }).withMessage('Invalid max points')
    ],
    assignmentController.upload.single('assignment_file'),
    assignmentController.createAssignment
  );

  // Student routes
  router.get('/student/:studentId',
    requireRole(['student']),
    [
      param('studentId').isInt().withMessage('Invalid student ID'),
      query('status').optional().isIn(['pending', 'submitted', 'overdue', 'graded']),
      query('subject').optional().isString(),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 })
    ],
    assignmentController.getStudentAssignments
  );

  router.post('/:assignment_id/submit',
    requireRole(['student']),
    [
      param('assignment_id').isInt().withMessage('Invalid assignment ID'),
      body('submission_text').optional().isString(),
      body('student_notes').optional().isString()
    ],
    assignmentController.upload.single('submission_file'),
    assignmentController.submitAssignment
  );

  // Grading routes
  router.post('/submissions/:submission_id/grade',
    requireRole(['teacher']),
    [
      param('submission_id').isInt().withMessage('Invalid submission ID'),
      body('points_earned').isFloat({ min: 0 }).withMessage('Invalid points'),
      body('teacher_feedback').optional().isString(),
      body('rubric_scores').optional().isObject()
    ],
    assignmentController.gradeAssignment
  );

  // Analytics routes
  router.get('/:assignment_id/analytics',
    requireRole(['teacher', 'director_all', 'director_11_12', 'director_9_10']),
    [
      param('assignment_id').isInt().withMessage('Invalid assignment ID')
    ],
    assignmentController.getAssignmentAnalytics
  );

  // File download routes
  router.get('/:assignment_id/download',
    authenticate,
    [
      param('assignment_id').isInt().withMessage('Invalid assignment ID')
    ],
    assignmentController.downloadAssignment
  );

  return router;
};