const express = require('express');
const { registerRules, loginRules, register, login, logout, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
