// backend/routes/teachers.js
const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacherController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/dashboard', authenticate, requireRole(['teacher']), TeacherController.getTeacherDashboard);
router.post('/assignments', authenticate, requireRole(['teacher']), TeacherController.createAssignment);
router.get('/assignments/grading', authenticate, requireRole(['teacher']), TeacherController.getAssignmentsForGrading);
router.post('/assignments/:submission_id/grade', authenticate, requireRole(['teacher']), TeacherController.gradeAssignment);
router.post('/quizzes', authenticate, requireRole(['teacher']), TeacherController.createQuiz);
router.get('/quizzes/:quiz_id/analytics', authenticate, requireRole(['teacher']), TeacherController.getQuizAnalytics);

module.exports = router;