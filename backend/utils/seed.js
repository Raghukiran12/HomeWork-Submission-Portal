require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Homework = require('../models/Homework');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const { generateSubmissionId } = require('./helpers');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Homework.deleteMany({}), Submission.deleteMany({}), Notification.deleteMany({})]);

  const ava = await User.create({
    firstName: 'Ava', lastName: 'Carter', email: 'ava@student.com', password: 'password123',
    phone: '+61 400 111 222', role: 'student', studentId: 'S-2201', course: 'Bachelor of IT',
    classCode: 'IT-205', yearLevel: '2', isActive: true
  });
  const liam = await User.create({
    firstName: 'Liam', lastName: 'Nguyen', email: 'liam@student.com', password: 'password123',
    phone: '+61 400 222 333', role: 'student', studentId: 'S-2202', course: 'Bachelor of IT',
    classCode: 'IT-205', yearLevel: '2', isActive: true
  });
  const noah = await User.create({
    firstName: 'Noah', lastName: 'Brooks', email: 'noah@teacher.com', password: 'password123',
    phone: '+61 400 333 444', role: 'teacher', teacherId: 'T-1101', subject: 'Software Engineering',
    classCode: 'IT-205', course: 'Bachelor of IT', office: 'Room 21', isActive: true
  });
  const emma = await User.create({
    firstName: 'Emma', lastName: 'Patel', email: 'emma@teacher.com', password: 'password123',
    phone: '+61 400 444 555', role: 'teacher', teacherId: 'T-1102', subject: 'Database Systems',
    classCode: 'IT-205', course: 'Bachelor of IT', office: 'Room 14', isActive: true
  });
  await User.create({
    firstName: 'Olivia', lastName: 'Reed', email: 'olivia@admin.com', password: 'password123',
    phone: '+61 400 555 666', role: 'admin', isActive: true
  });

  const today = new Date();
  const offset = (days) => new Date(today.getTime() + days * 86400000);

  const hw1 = await Homework.create({
    title: 'Software Requirements Specification',
    subject: 'Software Engineering',
    description: 'Prepare a complete requirements specification for a university student portal.',
    instructions: 'Use IEEE SRS template, include functional and non-functional requirements, risk analysis, and acceptance criteria.',
    teacher: noah._id, course: 'Bachelor of IT', classCode: 'IT-205',
    assignedDate: offset(-12), dueDate: offset(5), maximumMarks: 100,
    allowedFileTypes: ['pdf', 'docx'], submissionRequirements: 'Include title page and references',
    referenceMaterial: 'Lecture slides, user stories, sample case study', status: 'active'
  });
  const hw2 = await Homework.create({
    title: 'SQL Database Design',
    subject: 'Database Systems',
    description: 'Design a normalized relational database and produce entity relationship diagrams.',
    instructions: 'Provide ERD, schema, sample data, and justification for normalization choices.',
    teacher: emma._id, course: 'Bachelor of IT', classCode: 'IT-205',
    assignedDate: offset(-20), dueDate: offset(-2), maximumMarks: 90,
    allowedFileTypes: ['pdf', 'docx'], submissionRequirements: 'Submit a single PDF',
    referenceMaterial: 'Normalization notes and ERD samples', status: 'active'
  });
  const hw3 = await Homework.create({
    title: 'Web Interface Prototype',
    subject: 'Web Development',
    description: 'Create a responsive mockup for a homepage and checkout flow.',
    instructions: 'Design a mobile-friendly interface and justify your UI decisions.',
    teacher: noah._id, course: 'Bachelor of IT', classCode: 'IT-205',
    assignedDate: offset(-5), dueDate: offset(10), maximumMarks: 80,
    allowedFileTypes: ['pdf', 'pptx'], submissionRequirements: 'Include screenshots',
    referenceMaterial: 'Bootstrap component guide', status: 'active'
  });

  await Submission.create({
    submissionId: generateSubmissionId(), homework: hw1._id, student: ava._id,
    fileName: 'ava-srs.pdf', filePath: 'seed-ava-srs.pdf', fileType: 'pdf', fileSize: 245000,
    studentComment: 'Submitted the specification with all sections complete.',
    submittedAt: offset(-1), status: 'graded', isLate: false, attemptNumber: 1, isOfficial: true, marks: 91, percentage: 91, grade: 'A',
    teacherFeedback: 'Excellent structure and requirement traceability. Minor improvement in use cases.',
    gradedAt: offset(-1), gradedBy: noah._id
  });
  await Submission.create({
    submissionId: generateSubmissionId(), homework: hw2._id, student: ava._id,
    fileName: 'ava-er-diagram.pdf', filePath: 'seed-ava-erd.pdf', fileType: 'pdf', fileSize: 180000,
    studentComment: 'Submitted after the deadline due to technical issues.',
    submittedAt: offset(-1), status: 'late', isLate: true, attemptNumber: 1, isOfficial: true
  });
  await Submission.create({
    submissionId: generateSubmissionId(), homework: hw1._id, student: liam._id,
    fileName: 'liam-srs.pdf', filePath: 'seed-liam-srs.pdf', fileType: 'pdf', fileSize: 210000,
    studentComment: 'Draft version uploaded for review.',
    submittedAt: offset(0), status: 'submitted', isLate: false, attemptNumber: 1, isOfficial: true
  });

  await Notification.insertMany([
    { recipient: ava._id, title: 'New homework assigned', message: 'Software Requirements Specification has been assigned.', type: 'new_homework' },
    { recipient: ava._id, title: 'Homework graded', message: 'SRS has been graded and feedback is available.', type: 'graded', isRead: false },
    { recipient: noah._id, title: 'New submission received', message: 'A student submitted the requirements specification.', type: 'submission' },
    { recipient: liam._id, title: 'New homework assigned', message: 'Web Interface Prototype has been assigned.', type: 'new_homework' }
  ]);

  console.log('Seed complete.');
  console.log('Student: ava@student.com / password123');
  console.log('Teacher: noah@teacher.com / password123');
  console.log('Admin:   olivia@admin.com / password123');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
