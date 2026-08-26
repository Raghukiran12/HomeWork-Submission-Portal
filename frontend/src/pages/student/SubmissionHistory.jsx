import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, formatDateTime, submissionFileUrl } from '../../utils/format';

export default function SubmissionHistory() {
  const { data, loading, error } = useAsync(() => submissionService.list().then((res) => res.submissions), []);
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageHeader eyebrow="Student" title="Submission History" />
      <div className="card dashboard-card">
        <DataTable
          rows={data || []}
          empty={<EmptyState title="No submissions found" />}
          columns={[
            { key: 'submissionId', label: 'Submission ID' },
            { key: 'attempt', label: 'Attempt', render: (row) => `Attempt ${row.attemptNumber || 1}${row.isOfficial ? ' · counts' : ''}` },
            { key: 'homework', label: 'Homework', render: (row) => row.homework?.title },
            { key: 'subject', label: 'Subject', render: (row) => row.homework?.subject },
            { key: 'submittedAt', label: 'Submitted Date', render: (row) => formatDateTime(row.submittedAt) },
            { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.homework?.dueDate) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'late', label: 'Late/On-time', render: (row) => row.isLate ? 'Late' : 'On-time' },
            { key: 'marks', label: 'Grade', render: (row) => row.marks ?? '—' },
            { key: 'feedback', label: 'Feedback', render: (row) => row.teacherFeedback || 'Pending' },
            {
              key: 'view',
              label: 'View',
              render: (row) => (
                <div className="d-flex gap-2">
                  {row.filePath && (
                    <a className="btn btn-sm btn-outline-secondary" href={submissionFileUrl(row.filePath)} target="_blank" rel="noreferrer">File</a>
                  )}
                  <Link className="btn btn-sm btn-outline-primary" to={`/student/homework/${row.homework?._id}`}>Details</Link>
                  <Link className="btn btn-sm btn-primary" to={`/student/submit/${row.homework?._id}`}>Resubmit</Link>
                </div>
              )
            }
          ]}
        />
      </div>
    </>
  );
}
