import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { reportService } from '../../services/reportService';
import { homeworkService } from '../../services/homeworkService';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, formatDateTime, fullName } from '../../utils/format';

export default function TeacherDashboard() {
  const stats = useAsync(() => reportService.dashboard().then((res) => res.stats), []);
  const homework = useAsync(() => homeworkService.list().then((res) => res.homework), []);
  const submissions = useAsync(() => submissionService.list().then((res) => res.submissions), []);
  if (stats.loading) return <LoadingSpinner />;
  if (stats.error) return <div className="alert alert-danger">{stats.error}</div>;
  const s = stats.data || {};
  const upcoming = (homework.data || []).filter((item) => new Date(item.dueDate) > new Date()).slice(0, 5);
  const recent = (submissions.data || []).slice(0, 5);

  return (
    <>
      <PageHeader eyebrow="Teacher" title="Dashboard" actions={<Link className="btn btn-primary" to="/teacher/homework/create">Create homework</Link>} />
      <div className="row g-3">
        <StatCard title="Total Homework" value={s.totalHomework ?? 0} icon="bi-journal-text" />
        <StatCard title="Active Homework" value={s.activeHomework ?? 0} icon="bi-activity" />
        <StatCard title="Total Submissions" value={s.totalSubmissions ?? 0} icon="bi-clipboard-data" />
        <StatCard title="Pending Grading" value={s.pendingGrading ?? 0} icon="bi-hourglass-split" />
        <StatCard title="Graded Submissions" value={s.gradedSubmissions ?? 0} icon="bi-check2-square" />
        <StatCard title="Late Submissions" value={s.lateSubmissions ?? 0} icon="bi-exclamation-circle" />
      </div>
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card dashboard-card">
            <div className="card-header"><h5 className="mb-0">Recent submissions</h5></div>
            {!recent.length && <EmptyState />}
            {recent.map((item) => (
              <div key={item._id} className="list-group-item d-flex justify-content-between align-items-center gap-3">
                <div><strong>{fullName(item.student)}</strong><div className="small text-muted">{item.homework?.title}</div><div className="small text-muted">{formatDateTime(item.submittedAt)}</div></div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card dashboard-card">
            <div className="card-header"><h5 className="mb-0">Upcoming deadlines</h5></div>
            {!upcoming.length && <EmptyState title="No upcoming deadlines" />}
            {upcoming.map((item) => (
              <div key={item._id} className="list-group-item d-flex justify-content-between align-items-center gap-3">
                <strong>{item.title}</strong>
                <span>{formatDate(item.dueDate)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
