export function formatDate(value, fallback = 'N/A') {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value, fallback = 'N/A') {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function fullName(user) {
  if (!user) return '—';
  return user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
}

export function dashboardPath(role) {
  if (role === 'teacher') return '/teacher/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/student/dashboard';
}

export function submissionFileUrl(filePath) {
  if (!filePath) return '';
  const origin = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  return `${origin}/uploads/${filePath}`;
}

export function homeworkStatus(homework, submission) {
  if (submission?.status === 'graded') return 'Graded';
  if (submission?.isLate || submission?.status === 'late') return 'Late';
  if (submission) return 'Submitted';
  if (new Date(homework.dueDate) < new Date()) return 'Overdue';
  return 'Pending';
}

export function submissionsForHomework(submissions, homeworkId) {
  return (submissions || []).filter((item) => String(item.homework?._id || item.homework) === String(homeworkId));
}

export function officialSubmission(submissions) {
  const list = submissions || [];
  return list.find((item) => item.isOfficial) || list[0] || null;
}
