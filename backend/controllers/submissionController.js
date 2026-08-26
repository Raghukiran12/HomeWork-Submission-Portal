const path = require('path');
const Homework = require('../models/Homework');
const Submission = require('../models/Submission');
const { notify } = require('../services/notificationService');
const { ApiError, generateSubmissionId, letterGrade } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');

const populate = [
  { path: 'student', select: 'firstName lastName studentId email course classCode' },
  { path: 'homework', populate: { path: 'teacher', select: 'firstName lastName teacherId subject' } },
  { path: 'gradedBy', select: 'firstName lastName' }
];

function canAccess(user, submission) {
  const homework = submission.homework;
  const teacherId = homework?.teacher?._id || homework?.teacher;
  if (user.role === 'admin') return true;
  if (user.role === 'student') return String(submission.student._id || submission.student) === String(user._id);
  if (user.role === 'teacher') return String(teacherId) === String(user._id);
  return false;
}

const listSubmissions = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'student') filter.student = req.user._id;
  if (req.query.homework) filter.homework = req.query.homework;
  if (req.query.graded === 'true') filter.status = 'graded';

  let submissions = await Submission.find(filter).populate(populate).sort({ submittedAt: -1 });

  if (req.user.role === 'teacher') {
    submissions = submissions.filter((item) => String(item.homework?.teacher?._id || item.homework?.teacher) === String(req.user._id));
  }

  res.json({ success: true, submissions });
});

const getSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate(populate);
  if (!submission) throw new ApiError(404, 'Submission not found.');
  if (!canAccess(req.user, submission)) throw new ApiError(403, 'You cannot access this submission.');
  res.json({ success: true, submission });
});

const createSubmission = asyncHandler(async (req, res) => {
  const homework = await Homework.findById(req.body.homework);
  if (!homework) throw new ApiError(404, 'Homework not found.');
  if (homework.course !== req.user.course || homework.classCode !== req.user.classCode) {
    throw new ApiError(403, 'This homework is not assigned to your class.');
  }
  if (!req.file) throw new ApiError(400, 'Please attach a file to submit.');

  const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase();
  if (homework.allowedFileTypes?.length && !homework.allowedFileTypes.includes(ext)) {
    throw new ApiError(400, `This homework only accepts ${homework.allowedFileTypes.join(', ').toUpperCase()} files.`);
  }

  const isLate = new Date() > new Date(homework.dueDate);
  const previous = await Submission.find({ homework: homework._id, student: req.user._id });
  const lastAttempt = previous.reduce((max, item) => Math.max(max, item.attemptNumber || 1), 0);
  const attemptNumber = lastAttempt + 1;
  await Submission.updateMany(
    { homework: homework._id, student: req.user._id },
    { $set: { isOfficial: false } }
  );

  const submission = await Submission.create({
    submissionId: generateSubmissionId(),
    homework: homework._id,
    student: req.user._id,
    fileName: req.file.originalname,
    filePath: req.file.filename,
    fileType: ext,
    fileSize: req.file.size,
    studentComment: req.body.studentComment || '',
    submittedAt: new Date(),
    status: isLate ? 'late' : 'submitted',
    isLate,
    attemptNumber,
    isOfficial: true
  });

  const label = attemptNumber > 1 ? `resubmitted (attempt ${attemptNumber})` : 'submitted';
  await notify(homework.teacher, 'New submission received', `${req.user.firstName} ${req.user.lastName} ${label} ${homework.title}.`, 'submission');
  await notify(req.user._id, attemptNumber > 1 ? 'Homework resubmitted' : 'Homework submitted', `${homework.title} was ${label} successfully.`, 'successful_submission');

  res.status(201).json({
    success: true,
    message: attemptNumber > 1 ? `Resubmitted as attempt ${attemptNumber}.` : 'Homework submitted successfully.',
    submission: await Submission.findById(submission._id).populate(populate)
  });
});

const updateSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) throw new ApiError(404, 'Submission not found.');
  if (req.user.role === 'student' && String(submission.student) !== String(req.user._id)) {
    throw new ApiError(403, 'You can only update your own submission.');
  }
  if (req.body.studentComment !== undefined) submission.studentComment = req.body.studentComment;
  await submission.save();
  res.json({ success: true, submission: await submission.populate(populate) });
});

const gradeSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate('homework');
  if (!submission) throw new ApiError(404, 'Submission not found.');
  if (req.user.role === 'teacher' && String(submission.homework.teacher) !== String(req.user._id)) {
    throw new ApiError(403, 'Only the assigned teacher can grade this submission.');
  }

  const marks = Number(req.body.marks);
  if (Number.isNaN(marks) || marks < 0) throw new ApiError(400, 'Enter a valid mark.');
  if (marks > submission.homework.maximumMarks) {
    throw new ApiError(400, `Marks cannot exceed ${submission.homework.maximumMarks}.`);
  }

  const percentage = Number(((marks / submission.homework.maximumMarks) * 100).toFixed(1));
  submission.marks = marks;
  submission.percentage = percentage;
  submission.grade = letterGrade(percentage);
  submission.teacherFeedback = req.body.teacherFeedback || '';
  submission.status = 'graded';
  submission.gradedAt = new Date();
  submission.gradedBy = req.user._id;
  submission.isOfficial = true;
  await Submission.updateMany(
    { homework: submission.homework._id, student: submission.student, _id: { $ne: submission._id } },
    { $set: { isOfficial: false } }
  );
  await submission.save();

  await notify(
    submission.student,
    'Homework graded',
    `${submission.homework.title} has been graded: ${marks}/${submission.homework.maximumMarks} (${submission.grade}).`,
    'graded'
  );

  res.json({
    success: true,
    message: 'Grade saved. This attempt is now the one that counts.',
    submission: await Submission.findById(submission._id).populate(populate)
  });
});

const selectOfficial = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate('homework');
  if (!submission) throw new ApiError(404, 'Submission not found.');
  if (req.user.role === 'teacher' && String(submission.homework.teacher) !== String(req.user._id)) {
    throw new ApiError(403, 'Only the assigned teacher can choose the attempt.');
  }

  await Submission.updateMany(
    { homework: submission.homework._id, student: submission.student },
    { $set: { isOfficial: false } }
  );
  submission.isOfficial = true;
  await submission.save();

  res.json({
    success: true,
    message: `Attempt ${submission.attemptNumber} is now the assigned submission.`,
    submission: await Submission.findById(submission._id).populate(populate)
  });
});

module.exports = { listSubmissions, getSubmission, createSubmission, updateSubmission, gradeSubmission, selectOfficial };
