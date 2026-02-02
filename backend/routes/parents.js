// backend/routes/parents.js
const express = require('express');
const router = express.Router();
const ParentController = require('../controllers/parentController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/dashboard', authenticate, requireRole(['parent']), ParentController.getParentDashboard);
router.post('/link-request', authenticate, requireRole(['parent']), ParentController.requestChildLink);

module.exports = router;