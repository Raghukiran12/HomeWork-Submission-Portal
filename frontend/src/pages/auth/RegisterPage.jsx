import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { dashboardPath } from '../../utils/format.js';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false, course: 'Bachelor of IT', classCode: 'IT-205'
  });

  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please complete all required fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.terms) {
      setError('You must agree to the Terms of Use.');
      return;
    }
    setBusy(true);
    try {
      const data = await register({ ...form, role: 'student' });
      toast.success('Account created successfully.');
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
          <h1>Join the Homework Submission Portal</h1>
          <p>Create your student account to submit homework and track grades.</p>
        </aside>
        <main className="form-panel">
          <div className="form-inner">
            <div className="welcome"><h2>Create Account</h2><p>Students can self-register. Staff accounts are created by admin.</p></div>
            <form onSubmit={handleSubmit}>
              <div className="field-grid">
                <div className="field-group"><label>First name</label><div className="input-wrap"><span className="field-icon"><i className="bi bi-person" /></span><input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} /></div></div>
                <div className="field-group"><label>Last name</label><div className="input-wrap"><span className="field-icon"><i className="bi bi-person" /></span><input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} /></div></div>
              </div>
              <div className="field-group"><label>Email</label><div className="input-wrap"><span className="field-icon"><i className="bi bi-envelope" /></span><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></div></div>
              <div className="field-grid">
                <div className="field-group"><label>Password</label><div className="input-wrap"><span className="field-icon"><i className="bi bi-lock" /></span><input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} /></div></div>
                <div className="field-group"><label>Confirm password</label><div className="input-wrap"><span className="field-icon"><i className="bi bi-lock" /></span><input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} /></div></div>
              </div>
              <label className="terms"><input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} /> I agree to the Terms of Use</label>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button className="primary-btn" disabled={busy}>{busy ? 'Creating account...' : 'Create Account'}</button>
            </form>
            <div className="signup-text">Already have an account? <Link to="/login">Sign in</Link></div>
          </div>
        </main>
      </div>
    </div>
  );
}
