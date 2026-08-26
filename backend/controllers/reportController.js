const { getDashboardStats, getSubmissionReport, getGradeReport } = require('../services/reportService');
const { asyncHandler } = require('../middleware/errorHandler');

const dashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user);
  res.json({ success: true, stats });
});

const submissions = asyncHandler(async (_req, res) => {
  const rows = await getSubmissionReport();
  res.json({ success: true, submissions: rows });
});

const grades = asyncHandler(async (_req, res) => {
  const rows = await getGradeReport();
  res.json({ success: true, grades: rows });
});

module.exports = { dashboard, submissions, grades };
