import RoleLayout from './RoleLayout.jsx';

const links = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: 'bi-grid', end: true },
  { to: '/teacher/homework/create', label: 'Create Homework', icon: 'bi-plus-square' },
  { to: '/teacher/homework', label: 'Manage Homework', icon: 'bi-pencil-square' },
  { to: '/teacher/submissions', label: 'Student Submissions', icon: 'bi-folder2-open' },
  { to: '/teacher/grade', label: 'Grade Submissions', icon: 'bi-award' },
  { to: '/teacher/notifications', label: 'Notifications', icon: 'bi-bell' },
  { to: '/teacher/profile', label: 'Profile', icon: 'bi-person' }
];

export default function TeacherLayout() {
  return <RoleLayout links={links} />;
}
