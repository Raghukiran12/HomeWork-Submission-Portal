import { NavLink } from 'react-router-dom';

export default function Sidebar({ links, open, onClose, onLogout }) {
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="nav flex-column">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onClose}>
              <i className={`bi ${link.icon}`} /> {link.label}
            </NavLink>
          ))}
          <a className="nav-link" href="#logout" onClick={(event) => { event.preventDefault(); onLogout(); }}>
            <i className="bi bi-box-arrow-right" /> Logout
          </a>
        </div>
      </aside>
    </>
  );
}
