import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fullName } from '../utils/format.js';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const rolePath = `/${user.role}`;

  return (
    <nav className="topbar">
      <div className="d-flex align-items-center gap-3">
        <button className="menu-toggle" onClick={onMenu} aria-label="Open menu"><i className="bi bi-list" /></button>
        <div className="brand"><i className="bi bi-mortarboard me-2" />Homework Portal</div>
      </div>
      <div className="user-panel">
        <span id="topbar-user-name">{fullName(user)}</span>
        <span className="badge bg-light text-dark text-capitalize">{user.role}</span>
        <button className="topbar-bell" onClick={() => navigate(`${rolePath}/notifications`)} aria-label="Notifications">
          <i className="bi bi-bell" />
        </button>
        <Link to={`${rolePath}/profile`} className="user-avatar" aria-label="Profile">
          <i className="bi bi-person-circle" />
        </Link>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
