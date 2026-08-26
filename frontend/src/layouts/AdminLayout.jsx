import RoleLayout from './RoleLayout.jsx';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-grid', end: true },
  { to: '/admin/users', label: 'User Management', icon: 'bi-people' },
  { to: '/admin/students', label: 'Student Management', icon: 'bi-mortarboard' },
  { to: '/admin/teachers', label: 'Teacher Management', icon: 'bi-person-workspace' },
  { to: '/admin/homework', label: 'Homework Management', icon: 'bi-journal-text' },
  { to: '/admin/submissions', label: 'Submission Management', icon: 'bi-clipboard-data' },
  { to: '/admin/reports', label: 'Reports', icon: 'bi-bar-chart' },
  { to: '/admin/notifications', label: 'Notifications', icon: 'bi-bell' },
  { to: '/admin/settings', label: 'System Settings', icon: 'bi-sliders' },
  { to: '/admin/profile', label: 'Profile', icon: 'bi-person' }
];

export default function AdminLayout() {
  return <RoleLayout links={links} />;
}
