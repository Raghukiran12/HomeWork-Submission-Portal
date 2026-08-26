import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import PublicFooter from '../components/PublicFooter.jsx';

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <PublicNavbar />
      <main className="public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
