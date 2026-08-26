const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');
const { asyncHandler } = require('./errorHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Please sign in to continue.');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'Account not found.');
  if (!user.isActive) throw new ApiError(403, 'This account is inactive. Contact an administrator.');

  req.user = user;
  next();
});

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource.'));
    }
    next();
  };
}

const requireStudent = authorize('student');
const requireTeacher = authorize('teacher');
const requireAdmin = authorize('admin');

module.exports = { protect, authorize, requireStudent, requireTeacher, requireAdmin };
