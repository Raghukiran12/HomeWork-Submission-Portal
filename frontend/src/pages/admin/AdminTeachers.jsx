import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { userService } from '../../services/userService';
import { useAsync } from '../../hooks/useAsync';
import { fullName } from '../../utils/format';

export default function AdminTeachers() {
  const { data, loading, error } = useAsync(() => userService.list({ role: 'teacher' }).then((res) => res.users), []);
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  return (
    <>
      <PageHeader eyebrow="Admin" title="Teacher Management" />
      <div className="card dashboard-card">
        <DataTable
          rows={data || []}
          empty="No teachers found."
          columns={[
            { key: 'teacherId', label: 'Teacher ID' },
            { key: 'name', label: 'Name', render: (row) => fullName(row) },
            { key: 'email', label: 'Email' },
            { key: 'subject', label: 'Subject' },
            { key: 'homeworkCount', label: 'Homework Count' },
            { key: 'submissionCount', label: 'Submission Count' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'Inactive'} /> }
          ]}
        />
      </div>
    </>
  );
}
