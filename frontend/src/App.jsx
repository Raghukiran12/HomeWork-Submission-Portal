import { Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import TeacherLayout from './layouts/TeacherLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import HomePage from './pages/public/HomePage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import MyHomework from './pages/student/StudentHomework.jsx';
import HomeworkDetails from './pages/student/HomeworkDetails.jsx';
import SubmitHomework from './pages/student/SubmitHomework.jsx';
import SubmissionHistory from './pages/student/SubmissionHistory.jsx';
import StudentGrades from './pages/student/StudentGrades.jsx';
import NotificationsPage from './pages/shared/NotificationsPage.jsx';
import ProfilePage from './pages/shared/ProfilePage.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import HomeworkForm from './pages/teacher/CreateHomework.jsx';
import ManageHomework from './pages/teacher/ManageHomework.jsx';
import TeacherHomeworkDetails from './pages/teacher/TeacherHomeworkDetails.jsx';
import TeacherSubmissions from './pages/teacher/TeacherSubmissions.jsx';
import GradeSubmission from './pages/teacher/GradeSubmission.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminStudents from './pages/admin/AdminStudents.jsx';
import AdminTeachers from './pages/admin/AdminTeachers.jsx';
import AdminHomework from './pages/admin/AdminHomework.jsx';
import AdminSubmissions from './pages/admin/AdminSubmissions.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      </Route>

      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="homework" element={<MyHomework />} />
        <Route path="homework/:id" element={<HomeworkDetails />} />
        <Route path="submit" element={<SubmitHomework />} />
        <Route path="submit/:id" element={<SubmitHomework />} />
        <Route path="submissions" element={<SubmissionHistory />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="homework" element={<ManageHomework />} />
        <Route path="homework/create" element={<HomeworkForm />} />
        <Route path="homework/:id" element={<TeacherHomeworkDetails />} />
        <Route path="homework/:id/edit" element={<HomeworkForm />} />
        <Route path="submissions" element={<TeacherSubmissions />} />
        <Route path="grade" element={<GradeSubmission />} />
        <Route path="grade/:id" element={<GradeSubmission />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="homework" element={<AdminHomework />} />
        <Route path="submissions" element={<AdminSubmissions />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
