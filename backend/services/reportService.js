const User = require('../models/User');
const Homework = require('../models/Homework');
const Submission = require('../models/Submission');

async function getDashboardStats(user) {
  const [users, students, teachers, admins, homework, submissions] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'teacher' }),
    User.countDocuments({ role: 'admin' }),
    Homework.find(),
    Submission.find()
  ]);

  let scopedHomework = homework;
  let scopedSubs = submissions;

  if (user.role === 'teacher') {
    scopedHomework = homework.filter((item) => String(item.teacher) === String(user._id));
    const ids = new Set(scopedHomework.map((item) => String(item._id)));
    scopedSubs = submissions.filter((item) => ids.has(String(item.homework)));
  }

  if (user.role === 'student') {
    scopedHomework = homework.filter((item) => item.course === user.course && item.classCode === user.classCode);
    scopedSubs = submissions.filter((item) => String(item.student) === String(user._id) && item.isOfficial !== false);
  }

  const graded = scopedSubs.filter((item) => item.status === 'graded' && item.percentage != null);
  const pending = scopedSubs.filter((item) => item.status !== 'graded');
  const late = scopedSubs.filter((item) => item.isLate);
  const avg = graded.length ? graded.reduce((sum, item) => sum + item.percentage, 0) / graded.length : 0;
  const highest = graded.length ? Math.max(...graded.map((item) => item.percentage)) : 0;
  const lowest = graded.length ? Math.min(...graded.map((item) => item.percentage)) : 0;
  const studentCount = user.role === 'admin' ? students : Math.max(students, 1);
  const expected = user.role === 'student' ? scopedHomework.length : scopedHomework.length * Math.max(studentCount, 1);
  const submissionRate = expected ? (scopedSubs.length / expected) * 100 : 0;
  const lateRate = scopedSubs.length ? (late.length / scopedSubs.length) * 100 : 0;
  const gradingRate = scopedSubs.length ? (graded.length / scopedSubs.length) * 100 : 0;
  const onTime = scopedSubs.filter((item) => !item.isLate).length;
  const onTimeRate = scopedSubs.length ? (onTime / scopedSubs.length) * 100 : 0;

  const teacherActivity = await Promise.all((await User.find({ role: 'teacher' })).map(async (teacher) => {
    const hwCount = await Homework.countDocuments({ teacher: teacher._id });
    const subCount = await Submission.countDocuments({}).then(async () => {
      const hw = await Homework.find({ teacher: teacher._id }).select('_id');
      return Submission.countDocuments({ homework: { $in: hw.map((item) => item._id) } });
    });
    return { teacher: teacher.fullName, homeworkCount: hwCount, submissionCount: subCount };
  }));

  return {
    totalUsers: users,
    totalStudents: students,
    totalTeachers: teachers,
    totalAdmins: admins,
    totalHomework: scopedHomework.length,
    activeHomework: scopedHomework.filter((item) => item.status === 'active').length,
    totalSubmissions: scopedSubs.length,
    pendingGrading: pending.length,
    gradedSubmissions: graded.length,
    lateSubmissions: late.length,
    averageGrade: Number(avg.toFixed(1)),
    highestGrade: Number(highest.toFixed(1)),
    lowestGrade: Number(lowest.toFixed(1)),
    submissionRate: Number(submissionRate.toFixed(1)),
    lateSubmissionRate: Number(lateRate.toFixed(1)),
    gradingCompletionRate: Number(gradingRate.toFixed(1)),
    onTimeSubmissionRate: Number(onTimeRate.toFixed(1)),
    pendingHomework: user.role === 'student'
      ? scopedHomework.filter((item) => !scopedSubs.some((sub) => String(sub.homework) === String(item._id))).length
      : pending.length,
    overdueHomework: user.role === 'student'
      ? scopedHomework.filter((item) => !scopedSubs.some((sub) => String(sub.homework) === String(item._id)) && new Date(item.dueDate) < new Date()).length
      : 0,
    teacherActivity
  };
}

async function getSubmissionReport() {
  const submissions = await Submission.find()
    .populate('student', 'firstName lastName studentId')
    .populate({ path: 'homework', populate: { path: 'teacher', select: 'firstName lastName' } });
  return submissions;
}

async function getGradeReport() {
  return Submission.find({ status: 'graded' })
    .populate('student', 'firstName lastName studentId')
    .populate('homework', 'title subject maximumMarks');
}

module.exports = { getDashboardStats, getSubmissionReport, getGradeReport };
