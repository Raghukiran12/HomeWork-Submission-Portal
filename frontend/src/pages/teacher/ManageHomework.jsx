import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { homeworkService } from '../../services/homeworkService';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate } from '../../utils/format';

export default function ManageHomework() {
  const { data, loading, error, reload } = useAsync(() => homeworkService.list().then((res) => res.homework), []);
  const toast = useToast();
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      await homeworkService.remove(target._id);
      toast.success('Homework deleted.');
      setTarget(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageHeader eyebrow="Teacher" title="Manage Homework" actions={<Link className="btn btn-primary" to="/teacher/homework/create">Create New Homework</Link>} />
      <div className="card dashboard-card">
        <DataTable
          rows={data || []}
          empty={<EmptyState title="No homework created yet" />}
          columns={[
            { key: 'id', label: 'Homework ID', render: (row) => String(row._id).slice(-8).toUpperCase() },
            { key: 'title', label: 'Title' },
            { key: 'subject', label: 'Subject' },
            { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
            { key: 'submissionCount', label: 'Submission Count' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'actions', label: 'Actions', render: (row) => (
              <div className="d-flex gap-2 flex-wrap">
                <Link className="btn btn-sm btn-outline-primary" to={`/teacher/homework/${row._id}`}>View</Link>
                <Link className="btn btn-sm btn-outline-secondary" to={`/teacher/homework/${row._id}/edit`}>Edit</Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setTarget(row)}>Delete</button>
              </div>
            ) }
          ]}
        />
      </div>
      <ConfirmModal show={Boolean(target)} title="Delete homework?" message="This will also remove related submissions." confirmLabel="Delete" busy={busy} onClose={() => setTarget(null)} onConfirm={remove} />
    </>
  );
}
