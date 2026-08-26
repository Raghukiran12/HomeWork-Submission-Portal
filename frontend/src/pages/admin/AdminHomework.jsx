import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { homeworkService } from '../../services/homeworkService';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, fullName } from '../../utils/format';

export default function AdminHomework() {
  const { data, loading, error } = useAsync(() => homeworkService.list().then((res) => res.homework), []);
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  return (
    <>
      <PageHeader eyebrow="Admin" title="Homework Management" />
      <div className="card dashboard-card">
        <DataTable
          rows={data || []}
          empty="No homework records."
          columns={[
            { key: 'id', label: 'Homework ID', render: (row) => String(row._id).slice(-8).toUpperCase() },
            { key: 'title', label: 'Title' },
            { key: 'subject', label: 'Subject' },
            { key: 'teacher', label: 'Teacher', render: (row) => fullName(row.teacher) },
            { key: 'course', label: 'Course' },
            { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
            { key: 'submissionCount', label: 'Submission Count' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
          ]}
        />
      </div>
    </>
  );
}
