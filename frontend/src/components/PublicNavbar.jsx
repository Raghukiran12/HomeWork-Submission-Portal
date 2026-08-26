import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardPath } from '../utils/format.js';

const links = [
  { to: '/', label: 'Home', icon: 'bi-house-door', end: true },
  { to: '/about', label: 'About', icon: 'bi-info-circle' },
  { to: '/contact', label: 'Contact', icon: 'bi-envelope' }
];

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="lp-nav">
      <div className="lp-nav-inner">
        <Link to="/" className="lp-brand" onClick={() => setOpen(false)}>
          <span className="lp-logo" aria-hidden="true">
            <i className="bi bi-mortarboard-fill" />
          </span>
          <span className="lp-brand-text">
            <strong>QUT Homework</strong>
            <small>Submission Portal</small>
          </span>
        </Link>

        <nav className={`lp-center ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `lp-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <i className={`bi ${link.icon}`} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={`lp-actions ${open ? 'open' : ''}`}>
          {user ? (
            <>
              <Link className="lp-login" to={dashboardPath(user.role)} onClick={() => setOpen(false)}>
                <i className="bi bi-speedometer2" /> Dashboard
              </Link>
              <button
                className="lp-register"
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="lp-login" to="/login" onClick={() => setOpen(false)}>
                <i className="bi bi-person" /> Login
              </Link>
              <Link className="lp-register" to="/register" onClick={() => setOpen(false)}>
                <i className="bi bi-plus-lg" /> Register
              </Link>
            </>
          )}
        </div>

        <button className="lp-menu-btn" aria-label="Toggle menu" type="button" onClick={() => setOpen((v) => !v)}>
          <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`} />
        </button>
      </div>
    </header>
  );
}
