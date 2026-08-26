const User = require('../models/User');
const Submission = require('../models/Submission');
const Homework = require('../models/Homework');
const { ApiError, sanitizeUser } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');

const listUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).sort({ createdAt: -1 });

  const submissions = await Submission.find();
  const homework = await Homework.find();

  const payload = users.map((user) => {
    const row = sanitizeUser(user);
    if (user.role === 'student') {
      const mine = submissions.filter((item) => String(item.student) === String(user._id));
      const graded = mine.filter((item) => item.percentage != null);
      row.submissionCount = mine.length;
      row.averageGrade = graded.length
        ? Number((graded.reduce((sum, item) => sum + item.percentage, 0) / graded.length).toFixed(1))
        : 0;
    }
    if (user.role === 'teacher') {
      const mineHw = homework.filter((item) => String(item.teacher) === String(user._id));
      const ids = new Set(mineHw.map((item) => String(item._id)));
      row.homeworkCount = mineHw.length;
      row.submissionCount = submissions.filter((item) => ids.has(String(item.homework))).length;
    }
    return row;
  });

  res.json({ success: true, users: payload });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  if (req.user.role !== 'admin' && String(req.user._id) !== String(user._id)) {
    throw new ApiError(403, 'You can only view your own profile.');
  }
  res.json({ success: true, user: sanitizeUser(user) });
});

const createUser = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: String(req.body.email).toLowerCase() });
  if (exists) throw new ApiError(409, 'An account with that email already exists.');

  const role = ['student', 'teacher', 'admin'].includes(req.body.role) ? req.body.role : 'student';
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: String(req.body.email).toLowerCase(),
    password: req.body.password || 'password123',
    phone: req.body.phone || '',
    role,
    studentId: role === 'student' ? (req.body.studentId || `S-${Date.now().toString().slice(-6)}`) : '',
    teacherId: role === 'teacher' ? (req.body.teacherId || `T-${Date.now().toString().slice(-6)}`) : '',
    course: req.body.course || '',
    classCode: req.body.classCode || '',
    yearLevel: req.body.yearLevel || '',
    subject: req.body.subject || '',
    office: req.body.office || '',
    isActive: true
  });
  res.status(201).json({ success: true, message: 'User created.', user: sanitizeUser(user) });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  if (req.user.role !== 'admin' && String(req.user._id) !== String(user._id)) {
    throw new ApiError(403, 'You can only update your own profile.');
  }

  const allowed = ['firstName', 'lastName', 'phone', 'course', 'classCode', 'yearLevel', 'subject', 'office', 'profileImage'];
  if (req.user.role === 'admin') allowed.push('email', 'role', 'studentId', 'teacherId');
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) user[key] = req.body[key];
  });
  if (req.body.password && req.user.role === 'admin') user.password = req.body.password;
  await user.save();
  res.json({ success: true, message: 'Profile updated.', user: sanitizeUser(user) });
});

const updateStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  user.isActive = Boolean(req.body.isActive);
  await user.save();
  res.json({ success: true, message: user.isActive ? 'User activated.' : 'User deactivated.', user: sanitizeUser(user) });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted.' });
});

module.exports = { listUsers, getUser, createUser, updateUser, updateStatus, deleteUser };
