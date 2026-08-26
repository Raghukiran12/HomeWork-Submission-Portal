import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { dashboardPath } from '../../utils/format.js';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', remember: false });

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Signed in successfully.');
      navigate(dashboardPath(data.user.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="login-card">
        <aside className="brand-panel">
          <div className="brand-pill"><i className="bi bi-book-half" /> QUT Learning</div>
          <h1>Homework<br />Submission<br />Portal</h1>
          <p>Manage assignments, submit work, track progress and stay updated in one place.</p>
        </aside>
        <main className="form-panel">
          <div className="form-inner">
            <div className="user-badge"><i className="bi bi-person" /></div>
            <div className="welcome"><h2>Welcome Back!</h2><p>Sign in to continue to your account</p></div>
            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="label-row">Email</label>
                <div className="input-wrap">
                  <span className="field-icon"><i className="bi bi-envelope" /></span>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" />
                </div>
              </div>
              <div className="field-group">
                <label className="label-row">Password</label>
                <div className="input-wrap">
                  <span className="field-icon"><i className="bi bi-lock" /></span>
                  <input type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
                  <button type="button" className="toggle-password" onClick={() => setShow((v) => !v)}><i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} /></button>
                </div>
              </div>
              <div className="form-meta">
                <label className="check-wrap">
                  <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button type="submit" className="primary-btn" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
            </form>
            <ul className="demo-list">
              <li>Student: ava@student.com / password123</li>
              <li>Teacher: noah@teacher.com / password123</li>
              <li>Admin: olivia@admin.com / password123</li>
            </ul>
            <div className="signup-text">Don&apos;t have an account? <Link to="/register">Sign up</Link></div>
          </div>
        </main>
      </div>
    </div>
  );
}
