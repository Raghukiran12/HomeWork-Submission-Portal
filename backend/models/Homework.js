const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  description: { type: String, default: '' },
  instructions: { type: String, default: '' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, required: true },
  classCode: { type: String, required: true },
  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  maximumMarks: { type: Number, required: true, default: 100 },
  allowedFileTypes: { type: [String], default: ['pdf', 'docx'] },
  submissionRequirements: { type: String, default: '' },
  referenceMaterial: { type: String, default: '' },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Homework', homeworkSchema);
