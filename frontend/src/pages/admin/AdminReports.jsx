import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { reportService } from '../../services/reportService';
import { useAsync } from '../../hooks/useAsync';

export default function AdminReports() {
  const stats = useAsync(() => reportService.dashboard().then((res) => res.stats), []);
  if (stats.loading) return <LoadingSpinner />;
  if (stats.error) return <div className="alert alert-danger">{stats.error}</div>;
  const s = stats.data || {};
  return (
    <>
      <PageHeader eyebrow="Admin" title="Reports" />
      <div className="row g-3">
        <StatCard title="Total Homework" value={s.totalHomework ?? 0} icon="bi-book" />
        <StatCard title="Submission Rate" value={`${s.submissionRate ?? 0}%`} icon="bi-check2-square" />
        <StatCard title="Late Submission Rate" value={`${s.lateSubmissionRate ?? 0}%`} icon="bi-alarm" />
        <StatCard title="Grading Completion" value={`${s.gradingCompletionRate ?? 0}%`} icon="bi-clipboard-check" />
        <StatCard title="Average Grade" value={`${s.averageGrade ?? 0}%`} icon="bi-percent" />
        <StatCard title="Highest Grade" value={`${s.highestGrade ?? 0}%`} icon="bi-arrow-up" />
        <StatCard title="Lowest Grade" value={`${s.lowestGrade ?? 0}%`} icon="bi-arrow-down" />
      </div>
      <div className="card dashboard-card">
        <div className="card-header"><h5 className="mb-0">Teacher Activity / Homework Completion</h5></div>
        <DataTable
          rows={s.teacherActivity || []}
          empty="No teacher activity."
          columns={[
            { key: 'teacher', label: 'Teacher' },
            { key: 'homeworkCount', label: 'Homework Assigned' },
            { key: 'submissionCount', label: 'Submissions' }
          ]}
        />
      </div>
    </>
  );
}
