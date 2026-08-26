import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    if (!email) {
      setError('Enter the email for your account.');
      return;
    }
    setError('');
    setSent(true);
  }

  return (
    <div className="page-shell">
      <div className="login-card" style={{ gridTemplateColumns: '1fr', minHeight: 'auto', maxWidth: 520 }}>
        <main className="form-panel">
          <div className="form-inner">
            <div className="welcome"><h2>Forgot password</h2><p>We will send reset instructions if the account exists.</p></div>
            {sent ? (
              <div className="alert alert-success">If an account exists for {email}, a reset link has been sent. This is a UI preview until email delivery is enabled.</div>
            ) : (
              <form onSubmit={submit}>
                <div className="field-group">
                  <label>Email</label>
                  <div className="input-wrap">
                    <span className="field-icon"><i className="bi bi-envelope" /></span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@qut.edu.au" />
                  </div>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <button className="primary-btn">Send reset link</button>
              </form>
            )}
            <div className="signup-text"><Link to="/login">Back to sign in</Link></div>
          </div>
        </main>
      </div>
    </div>
  );
}
