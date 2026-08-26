const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { listHomework, getHomework, createHomework, updateHomework, deleteHomework } = require('../controllers/homeworkController');

const router = express.Router();
router.use(protect);
router.get('/', listHomework);
router.post('/', authorize('teacher', 'admin'), createHomework);
router.get('/:id', getHomework);
router.put('/:id', authorize('teacher', 'admin'), updateHomework);
router.delete('/:id', authorize('teacher', 'admin'), deleteHomework);

module.exports = router;
