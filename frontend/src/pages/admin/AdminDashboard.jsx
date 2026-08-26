import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { reportService } from '../../services/reportService';
import { notificationService } from '../../services/notificationService';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../utils/format';

export default function AdminDashboard() {
  const stats = useAsync(() => reportService.dashboard().then((res) => res.stats), []);
  const notes = useAsync(() => notificationService.list().then((res) => res.notifications), []);
  if (stats.loading) return <LoadingSpinner />;
  if (stats.error) return <div className="alert alert-danger">{stats.error}</div>;
  const s = stats.data || {};

  return (
    <>
      <PageHeader eyebrow="Admin" title="System Overview" />
      <div className="row g-3">
        <StatCard title="Total Users" value={s.totalUsers ?? 0} icon="bi-people" />
        <StatCard title="Total Students" value={s.totalStudents ?? 0} icon="bi-mortarboard" />
        <StatCard title="Total Teachers" value={s.totalTeachers ?? 0} icon="bi-person-workspace" />
        <StatCard title="Total Homework" value={s.totalHomework ?? 0} icon="bi-journal-richtext" />
        <StatCard title="Total Submissions" value={s.totalSubmissions ?? 0} icon="bi-clipboard-check" />
        <StatCard title="Pending Grading" value={s.pendingGrading ?? 0} icon="bi-hourglass-split" />
        <StatCard title="Late Submissions" value={s.lateSubmissions ?? 0} icon="bi-exclamation-triangle" />
        <StatCard title="Average Grade" value={`${s.averageGrade ?? 0}%`} icon="bi-percent" />
      </div>
      <div className="card dashboard-card">
        <div className="card-header"><h5 className="mb-0">Recent activity</h5></div>
        {(notes.data || []).slice(0, 8).map((item) => (
          <div key={item._id} className="list-group-item d-flex justify-content-between align-items-center gap-3">
            <div><strong>{item.title}</strong><div className="small text-muted">{item.message}</div></div>
            <small>{formatDateTime(item.createdAt)}</small>
          </div>
        ))}
      </div>
    </>
  );
}
