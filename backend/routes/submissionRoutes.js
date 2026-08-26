const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { listSubmissions, getSubmission, createSubmission, updateSubmission, gradeSubmission, selectOfficial } = require('../controllers/submissionController');

const router = express.Router();
router.use(protect);
router.get('/', listSubmissions);
router.post('/', authorize('student'), upload.single('file'), createSubmission);
router.get('/:id', getSubmission);
router.put('/:id', updateSubmission);
router.put('/:id/grade', authorize('teacher', 'admin'), gradeSubmission);
router.put('/:id/official', authorize('teacher', 'admin'), selectOfficial);

module.exports = router;
