// backend/routes/students.js
const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/dashboard', authenticate, requireRole(['student']), StudentController.getStudentDashboard);
router.post('/assignments/:assignment_id/submit', authenticate, requireRole(['student']), StudentController.submitAssignment);

module.exports = router;