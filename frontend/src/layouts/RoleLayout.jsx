import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoleLayout({ links }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Navbar onMenu={() => setOpen(true)} />
      <Sidebar
        links={links}
        open={open}
        onClose={() => setOpen(false)}
        onLogout={async () => {
          await logout();
          navigate('/login');
        }}
      />
      <main className="content">
        <div id="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
