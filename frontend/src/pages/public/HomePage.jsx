import { Link } from 'react-router-dom';

const week = [
  { unit: 'SE-101', title: 'Requirements spec', due: 'Fri 28 Aug', status: 'Due', tone: 'due', icon: 'bi-file-earmark-text' },
  { unit: 'DB-201', title: 'SQL design', due: 'Sun 23 Aug', status: 'Late', tone: 'late', icon: 'bi-database' },
  { unit: 'IT-205', title: 'Web prototype', due: 'Wed 2 Sep', status: 'Open', tone: 'open', icon: 'bi-code-slash' }
];

const features = [
  { icon: 'bi-cloud-arrow-up', tone: 'purple', title: 'Easy Submission', body: 'Upload your assignments in seconds with our simple and secure system.' },
  { icon: 'bi-calendar3', tone: 'blue', title: 'Track Deadlines', body: 'Never miss a deadline with clear due dates and smart reminders.' },
  { icon: 'bi-bar-chart', tone: 'green', title: 'Check Marks', body: 'View your results and feedback as soon as they are released.' },
  { icon: 'bi-shield-check', tone: 'orange', title: 'Secure & Reliable', body: 'Your work is safe with enterprise-grade security and backups.' }
];

export default function HomePage() {
  return (
    <div className="lp">
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-copy">
            <span className="lp-badge">Welcome to QUT Homework Portal 👋</span>
            <h1>
              Submit <em>smarter</em>,<br />
              Track <em>better.</em>
            </h1>
            <p>Upload your assignments, stay on top of deadlines, and check your marks — all in one place.</p>
            <div className="lp-ctas">
              <Link className="lp-btn-primary" to="/login">
                Sign in to your account <i className="bi bi-arrow-right" />
              </Link>
              <Link className="lp-btn-ghost" to="/register">
                <i className="bi bi-person-plus" /> Create new account
              </Link>
            </div>
          </div>

          <div className="lp-art">
            <div className="lp-glow" />
            <img src="/hero-study.png" alt="" />
          </div>

          <aside className="lp-due">
            <div className="lp-due-head">
              <strong>Due this week</strong>
              <Link to="/login">View all →</Link>
            </div>
            {week.map((item) => (
              <div className="lp-due-row" key={item.unit}>
                <span className={`lp-due-icon ${item.tone}`}>
                  <i className={`bi ${item.icon}`} />
                </span>
                <div>
                  <div className="lp-due-title">{item.unit} {item.title}</div>
                  <div className="lp-due-date">{item.due}</div>
                </div>
                <span className={`lp-chip ${item.tone}`}>{item.status}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="lp-features">
        {features.map((item) => (
          <article className={`lp-feature ${item.tone}`} key={item.title}>
            <span className="lp-feature-icon"><i className={`bi ${item.icon}`} /></span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
