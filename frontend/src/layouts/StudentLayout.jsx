import RoleLayout from './RoleLayout.jsx';

const links = [
  { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-grid', end: true },
  { to: '/student/homework', label: 'My Homework', icon: 'bi-journal-text' },
  { to: '/student/submit', label: 'Submit Homework', icon: 'bi-upload' },
  { to: '/student/submissions', label: 'Submission History', icon: 'bi-folder2-open' },
  { to: '/student/grades', label: 'Grades & Feedback', icon: 'bi-award' },
  { to: '/student/notifications', label: 'Notifications', icon: 'bi-bell' },
  { to: '/student/profile', label: 'Profile', icon: 'bi-person' }
];

export default function StudentLayout() {
  return <RoleLayout links={links} />;
}
