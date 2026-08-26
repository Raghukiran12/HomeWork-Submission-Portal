import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { reportService } from '../../services/reportService';
import { homeworkService } from '../../services/homeworkService';
import { submissionService } from '../../services/submissionService';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, formatDateTime, fullName } from '../../utils/format';

export default function StudentDashboard() {
  const { user } = useAuth();
  const stats = useAsync(() => reportService.dashboard().then((res) => res.stats), []);
  const homework = useAsync(() => homeworkService.list().then((res) => res.homework), []);
  const submissions = useAsync(() => submissionService.list().then((res) => res.submissions), []);

  if (stats.loading || homework.loading) return <LoadingSpinner />;
  if (stats.error) return <div className="alert alert-danger">{stats.error}</div>;

  const upcoming = (homework.data || []).filter((item) => new Date(item.dueDate) > new Date()).slice(0, 5);
  const recent = (submissions.data || []).slice(0, 4);
  const s = stats.data || {};

  return (
    <>
      <PageHeader eyebrow="Student portal" title={`Welcome back, ${user.firstName}!`} subtitle="Here is your homework overview." />
      <div className="row g-3">
        <StatCard title="Total Homework" value={s.totalHomework ?? 0} icon="bi-journal-text" />
        <StatCard title="Pending" value={s.pendingHomework ?? 0} icon="bi-clock-history" />
        <StatCard title="Submitted" value={s.totalSubmissions ?? 0} icon="bi-check2-circle" />
        <StatCard title="Overdue" value={s.overdueHomework ?? 0} icon="bi-exclamation-triangle" />
        <StatCard title="Graded" value={s.gradedSubmissions ?? 0} icon="bi-award" />
        <StatCard title="Average grade" value={`${s.averageGrade ?? 0}%`} icon="bi-graph-up" />
        <StatCard title="Submission rate" value={`${s.submissionRate ?? 0}%`} icon="bi-percent" />
        <StatCard title="On-time rate" value={`${s.onTimeSubmissionRate ?? 0}%`} icon="bi-alarm" />
      </div>
      <div className="row g-3">
        <div className="col-lg-7">
          <div className="card dashboard-card">
            <div className="card-header d-flex justify-content-between"><h5 className="mb-0">Upcoming deadlines</h5><Link to="/student/homework">View all</Link></div>
            {!upcoming.length && <EmptyState title="No upcoming homework" />}
            {upcoming.map((item) => (
              <div key={item._id} className="list-group-item d-flex justify-content-between align-items-center gap-3">
                <div><strong>{item.title}</strong><div className="small text-muted">{item.subject} · {fullName(item.teacher)}</div></div>
                <span className="deadline-pill">{formatDate(item.dueDate)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card dashboard-card">
            <div className="card-header d-flex justify-content-between"><h5 className="mb-0">Recent submissions</h5><Link to="/student/submissions">View all</Link></div>
            {!recent.length && <EmptyState title="No submissions yet" />}
            {recent.map((item) => (
              <div key={item._id} className="list-group-item">
                <strong>{item.homework?.title}</strong>
                <div className="small text-muted">{item.status} · {formatDateTime(item.submittedAt)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
