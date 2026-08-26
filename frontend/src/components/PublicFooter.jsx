import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div>
          <div className="lp-footer-brand">
            <span className="lp-logo" aria-hidden="true">
              <i className="bi bi-mortarboard-fill" />
            </span>
            <strong>QUT Homework Portal</strong>
          </div>
          <p>Your all-in-one platform for homework submission, tracking and feedback.</p>
        </div>
        <div>
          <h4>Need help?</h4>
          <Link to="/about"><i className="bi bi-question-circle" /> Help Center</Link>
          <Link to="/contact"><i className="bi bi-headset" /> Contact Support</Link>
        </div>
        <div>
          <h4>Quick links</h4>
          <Link to="/login">Sign in</Link>
          <Link to="/about">Notes</Link>
          <Link to="/contact">Help</Link>
          <small>© 2026 QUT Homework Portal · Gardens Point Campus</small>
        </div>
      </div>
    </footer>
  );
}
