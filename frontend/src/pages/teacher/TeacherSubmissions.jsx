import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, formatDateTime, fullName, submissionFileUrl } from '../../utils/format';

export default function TeacherSubmissions() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => submissionService.list().then((res) => res.submissions), []);

  async function assignAttempt(id) {
    try {
      const result = await submissionService.selectOfficial(id);
      toast.success(result.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const rows = [...(data || [])].sort((a, b) => {
    const student = fullName(a.student).localeCompare(fullName(b.student));
    if (student) return student;
    const hw = (a.homework?.title || '').localeCompare(b.homework?.title || '');
    if (hw) return hw;
    return (a.attemptNumber || 1) - (b.attemptNumber || 1);
  });

  return (
    <>
      <PageHeader eyebrow="Teacher" title="Student Submissions" subtitle="Every attempt is listed. Assign the file that should count, then grade it." />
      <div className="card dashboard-card">
        <DataTable
          rows={rows}
          empty={<EmptyState title="No submissions to review" />}
          columns={[
            { key: 'student', label: 'Student', render: (row) => fullName(row.student) },
            { key: 'studentId', label: 'Student ID', render: (row) => row.student?.studentId },
            { key: 'homework', label: 'Homework', render: (row) => row.homework?.title },
            { key: 'attempt', label: 'Attempt', render: (row) => (
              <>
                Attempt {row.attemptNumber || 1}
                {row.isOfficial ? <span className="badge bg-primary ms-2">Assigned</span> : null}
              </>
            ) },
            { key: 'file', label: 'File', render: (row) => row.fileName },
            { key: 'submittedAt', label: 'Submitted Date', render: (row) => formatDateTime(row.submittedAt) },
            { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.homework?.dueDate) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'late', label: 'Late/On-time', render: (row) => row.isLate ? 'Late' : 'On-time' },
            { key: 'grade', label: 'Grade', render: (row) => row.grade || '—' },
            {
              key: 'action',
              label: 'Action',
              render: (row) => (
                <div className="d-flex flex-wrap gap-2">
                  {row.filePath && (
                    <a className="btn btn-sm btn-outline-primary" href={submissionFileUrl(row.filePath)} target="_blank" rel="noreferrer">
                      View file
                    </a>
                  )}
                  {!row.isOfficial && (
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => assignAttempt(row._id)}>
                      Assign this attempt
                    </button>
                  )}
                  <Link className="btn btn-sm btn-primary" to={`/teacher/grade/${row._id}`}>Grade</Link>
                </div>
              )
            }
          ]}
        />
      </div>
    </>
  );
}
