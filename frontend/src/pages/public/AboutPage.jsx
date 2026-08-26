import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <section className="about-page">
      <span className="lp-badge">About</span>
      <h1>Unit notes</h1>
      <ul className="plain-list">
        <li>PDF or DOCX, under 10MB unless the task says otherwise.</li>
        <li>Late uploads are accepted and marked late.</li>
        <li>Staff accounts are created by the unit admin, not self-register.</li>
      </ul>
      <p className="help-line mb-0">
        Upload problems: <Link to="/contact">contact support</Link> or ITS, Level 3 GP.
      </p>
    </section>
  );
}
