const Homework = require('../models/Homework');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { notifyMany } = require('../services/notificationService');
const { ApiError } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');

function homeworkFilter(user) {
  if (user.role === 'admin') return {};
  if (user.role === 'teacher') return { teacher: user._id };
  return { course: user.course, classCode: user.classCode, status: 'active' };
}

const listHomework = asyncHandler(async (req, res) => {
  const homework = await Homework.find(homeworkFilter(req.user))
    .populate('teacher', 'firstName lastName teacherId subject email')
    .sort({ dueDate: 1 });

  const submissions = await Submission.find();
  const rows = homework.map((item) => {
    const obj = item.toObject({ virtuals: true });
    obj.submissionCount = submissions.filter((sub) => String(sub.homework) === String(item._id)).length;
    return obj;
  });
  res.json({ success: true, homework: rows });
});

const getHomework = asyncHandler(async (req, res) => {
  const item = await Homework.findById(req.params.id).populate('teacher', 'firstName lastName teacherId subject email');
  if (!item) throw new ApiError(404, 'Homework not found.');

  if (req.user.role === 'teacher' && String(item.teacher._id || item.teacher) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only view your own homework.');
  }
  if (req.user.role === 'student' && (item.course !== req.user.course || item.classCode !== req.user.classCode)) {
    throw new ApiError(403, 'This homework is not assigned to your class.');
  }
  res.json({ success: true, homework: item });
});

const createHomework = asyncHandler(async (req, res) => {
  const homework = await Homework.create({
    title: req.body.title,
    subject: req.body.subject,
    description: req.body.description || '',
    instructions: req.body.instructions || '',
    teacher: req.user._id,
    course: req.body.course,
    classCode: req.body.classCode,
    assignedDate: req.body.assignedDate || new Date(),
    dueDate: req.body.dueDate,
    maximumMarks: Number(req.body.maximumMarks || 100),
    allowedFileTypes: Array.isArray(req.body.allowedFileTypes)
      ? req.body.allowedFileTypes
      : String(req.body.allowedFileTypes || 'pdf,docx').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean),
    submissionRequirements: req.body.submissionRequirements || '',
    referenceMaterial: req.body.referenceMaterial || '',
    status: req.body.status || 'active'
  });

  const students = await User.find({ role: 'student', course: homework.course, classCode: homework.classCode, isActive: true });
  await notifyMany(
    students.map((student) => student._id),
    'New homework assigned',
    `${homework.title} has been assigned in ${homework.subject}. Due ${new Date(homework.dueDate).toLocaleDateString('en-AU')}.`,
    'new_homework'
  );

  const populated = await homework.populate('teacher', 'firstName lastName teacherId subject');
  res.status(201).json({ success: true, message: 'Homework created.', homework: populated });
});

const updateHomework = asyncHandler(async (req, res) => {
  const item = await Homework.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Homework not found.');
  if (req.user.role === 'teacher' && String(item.teacher) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only edit your own homework.');
  }

  const fields = ['title', 'subject', 'description', 'instructions', 'course', 'classCode', 'assignedDate', 'dueDate', 'maximumMarks', 'submissionRequirements', 'referenceMaterial', 'status', 'allowedFileTypes'];
  fields.forEach((key) => {
    if (req.body[key] !== undefined) item[key] = req.body[key];
  });
  await item.save();
  res.json({ success: true, message: 'Homework updated.', homework: await item.populate('teacher', 'firstName lastName') });
});

const deleteHomework = asyncHandler(async (req, res) => {
  const item = await Homework.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Homework not found.');
  if (req.user.role === 'teacher' && String(item.teacher) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only delete your own homework.');
  }
  await Submission.deleteMany({ homework: item._id });
  await item.deleteOne();
  res.json({ success: true, message: 'Homework deleted.' });
});

module.exports = { listHomework, getHomework, createHomework, updateHomework, deleteHomework };
