const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError, sanitizeUser } = require('../utils/helpers');

function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

async function registerUser(payload) {
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) throw new ApiError(409, 'An account with that email already exists.');

  const role = payload.role === 'student' ? 'student' : 'student';
  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email.toLowerCase(),
    password: payload.password,
    phone: payload.phone || '',
    role,
    studentId: `S-${Date.now().toString().slice(-6)}`,
    course: payload.course || 'Bachelor of IT',
    classCode: payload.classCode || 'IT-205',
    yearLevel: payload.yearLevel || '2',
    isActive: true
  });

  return { token: signToken(user), user: sanitizeUser(user) };
}

async function loginUser(email, password) {
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user) throw new ApiError(401, 'No account found for that email.');
  const match = await user.matchPassword(password);
  if (!match) throw new ApiError(401, 'Incorrect password. Please try again.');
  if (!user.isActive) throw new ApiError(403, 'This account is inactive. Please contact the administrator.');
  return { token: signToken(user), user: sanitizeUser(user) };
}

module.exports = { signToken, registerUser, loginUser };
