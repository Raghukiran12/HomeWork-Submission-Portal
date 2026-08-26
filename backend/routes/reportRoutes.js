const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { dashboard, submissions, grades } = require('../controllers/reportController');

const router = express.Router();
router.use(protect);
router.get('/dashboard', dashboard);
router.get('/submissions', authorize('admin', 'teacher'), submissions);
router.get('/grades', authorize('admin', 'teacher'), grades);

module.exports = router;
