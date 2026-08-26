function letterGrade(percentage) {
  if (percentage >= 85) return 'A';
  if (percentage >= 75) return 'B';
  if (percentage >= 65) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

function generateSubmissionId() {
  return `SUB-${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

function sanitizeUser(user) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  obj.fullName = `${obj.firstName || ''} ${obj.lastName || ''}`.trim();
  return obj;
}

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { letterGrade, generateSubmissionId, sanitizeUser, ApiError };
