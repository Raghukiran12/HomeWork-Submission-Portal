import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardPath } from '../utils/format.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner text="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={dashboardPath(user.role)} replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;
  return children;
}
