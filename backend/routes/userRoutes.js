const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const { listUsers, getUser, createUser, updateUser, updateStatus, deleteUser } = require('../controllers/userController');

const router = express.Router();
router.use(protect);
router.get('/', requireAdmin, listUsers);
router.post('/', requireAdmin, createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.patch('/:id/status', requireAdmin, updateStatus);
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;
