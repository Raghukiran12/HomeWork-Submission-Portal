const { body } = require('express-validator');
const User = require('../models/User');
const { registerUser, loginUser } = require('../services/authService');
const { sanitizeUser } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate } = require('../middleware/validate');

const registerRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match.'),
  validate
];

const loginRules = [
  body('email').notEmpty().withMessage('Please enter your email.'),
  body('password').notEmpty().withMessage('Please enter your password.'),
  validate
];

const register = asyncHandler(async (req, res) => {
  if (!req.body.terms) {
    return res.status(400).json({ success: false, message: 'You must agree to the Terms of Use.' });
  }
  const data = await registerUser(req.body);
  res.status(201).json({ success: true, message: 'Account created successfully.', ...data });
});

const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body.email, req.body.password);
  res.json({ success: true, message: 'Signed in successfully.', ...data });
});

const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Signed out successfully.' });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user: sanitizeUser(user) });
});

module.exports = { registerRules, loginRules, register, login, logout, me };
