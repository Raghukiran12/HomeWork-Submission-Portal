const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  submissionId: { type: String, required: true, unique: true },
  homework: { type: mongoose.Schema.Types.ObjectId, ref: 'Homework', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  studentComment: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'late', 'graded'], default: 'submitted' },
  isLate: { type: Boolean, default: false },
  attemptNumber: { type: Number, default: 1 },
  isOfficial: { type: Boolean, default: true },
  marks: { type: Number, default: null },
  percentage: { type: Number, default: null },
  grade: { type: String, default: '' },
  teacherFeedback: { type: String, default: '' },
  gradedAt: { type: Date, default: null },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
