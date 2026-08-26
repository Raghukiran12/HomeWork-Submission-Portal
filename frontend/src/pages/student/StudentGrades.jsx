import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { formatDate } from '../../utils/format';

export default function StudentGrades() {
  const { data, loading, error } = useAsync(() => submissionService.list({ graded: 'true' }).then((res) => res.submissions), []);
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  const graded = (data || []).filter((item) => item.status === 'graded' && (item.isOfficial || item.isOfficial === undefined));
  const percents = graded.map((item) => item.percentage || 0);
  const avg = percents.length ? (percents.reduce((a, b) => a + b, 0) / percents.length).toFixed(1) : 0;
  const high = percents.length ? Math.max(...percents) : 0;
  const low = percents.length ? Math.min(...percents) : 0;

  return (
    <>
      <PageHeader eyebrow="Student" title="Grades & Feedback" />
      <div className="row g-3">
        <StatCard title="Average grade" value={`${avg}%`} icon="bi-graph-up" />
        <StatCard title="Highest grade" value={`${high}%`} icon="bi-arrow-up" />
        <StatCard title="Lowest grade" value={`${low}%`} icon="bi-arrow-down" />
      </div>
      <div className="card dashboard-card">
        <DataTable
          rows={graded}
          empty={<EmptyState title="No graded submissions yet" />}
          columns={[
            { key: 'homework', label: 'Homework', render: (row) => row.homework?.title },
            { key: 'subject', label: 'Subject', render: (row) => row.homework?.subject },
            { key: 'marks', label: 'Marks', render: (row) => row.marks ?? '—' },
            { key: 'max', label: 'Maximum Marks', render: (row) => row.homework?.maximumMarks },
            { key: 'percentage', label: 'Percentage', render: (row) => row.percentage != null ? `${row.percentage}%` : '—' },
            { key: 'grade', label: 'Grade' },
            { key: 'teacherFeedback', label: 'Teacher Feedback', render: (row) => row.teacherFeedback || '—' },
            { key: 'gradedAt', label: 'Graded Date', render: (row) => formatDate(row.gradedAt) }
          ]}
        />
      </div>
    </>
  );
}
