import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime, fullName } from '../../utils/format';

export default function AdminSubmissions() {
  const { data, loading, error } = useAsync(() => submissionService.list().then((res) => res.submissions), []);
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  return (
    <>
      <PageHeader eyebrow="Admin" title="Submission Management" />
      <div className="card dashboard-card">
        <DataTable
          rows={data || []}
          empty="No submissions found."
          columns={[
            { key: 'submissionId', label: 'Submission ID' },
            { key: 'student', label: 'Student', render: (row) => fullName(row.student) },
            { key: 'homework', label: 'Homework', render: (row) => row.homework?.title },
            { key: 'attempt', label: 'Attempt', render: (row) => `Attempt ${row.attemptNumber || 1}${row.isOfficial ? ' · assigned' : ''}` },
            { key: 'teacher', label: 'Teacher', render: (row) => fullName(row.homework?.teacher) },
            { key: 'submittedAt', label: 'Submitted Date', render: (row) => formatDateTime(row.submittedAt) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'grade', label: 'Grade', render: (row) => row.grade || '—' },
            { key: 'late', label: 'Late Status', render: (row) => row.isLate ? 'Late' : 'On-time' }
          ]}
        />
      </div>
    </>
  );
}
