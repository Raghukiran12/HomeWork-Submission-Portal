import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import Modal from '../../components/Modal.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { userService } from '../../services/userService';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, fullName } from '../../utils/format';

const emptyForm = { firstName: '', lastName: '', email: '', password: 'password123', role: 'student', course: 'Bachelor of IT', classCode: 'IT-205', subject: '' };

export default function AdminUsers() {
  const { data, loading, error, reload } = useAsync(() => userService.list().then((res) => res.users), []);
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [busy, setBusy] = useState(false);

  async function createUser(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await userService.create(form);
      toast.success('User created.');
      setCreating(false);
      setForm(emptyForm);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await userService.update(editing._id, editing);
      toast.success('User updated.');
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggle(user) {
    await userService.updateStatus(user._id, !user.isActive);
    toast.success(user.isActive ? 'User deactivated.' : 'User activated.');
    reload();
  }

  async function remove() {
    setBusy(true);
    try {
      await userService.remove(removeId);
      toast.success('User deleted.');
      setRemoveId(null);
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
      <PageHeader eyebrow="Admin" title="User Management" actions={<button className="btn btn-primary" onClick={() => setCreating(true)}>Add user</button>} />
      <div className="card dashboard-card">
        <DataTable
          rows={data || []}
          empty="No users found."
          columns={[
            { key: 'id', label: 'User ID', render: (row) => String(row._id).slice(-8).toUpperCase() },
            { key: 'name', label: 'Name', render: (row) => fullName(row) },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'Inactive'} /> },
            { key: 'createdAt', label: 'Created Date', render: (row) => formatDate(row.createdAt) },
            { key: 'actions', label: 'Actions', render: (row) => (
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing({ ...row })}>View/Edit</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => toggle(row)}>{row.isActive ? 'Deactivate' : 'Activate'}</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setRemoveId(row._id)}>Delete</button>
              </div>
            ) }
          ]}
        />
      </div>
      <Modal show={creating} title="Add user" onClose={() => setCreating(false)}>
        <form onSubmit={createUser} className="row g-2">
          {['firstName', 'lastName', 'email', 'password'].map((key) => (
            <div className="col-md-6" key={key}><input className="form-control" placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required /></div>
          ))}
          <div className="col-12">
            <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-12"><button className="btn btn-primary" disabled={busy}>Create</button></div>
        </form>
      </Modal>
      <Modal show={Boolean(editing)} title="Edit user" onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={saveEdit} className="row g-2">
            <div className="col-md-6"><input className="form-control" value={editing.firstName} onChange={(e) => setEditing({ ...editing, firstName: e.target.value })} /></div>
            <div className="col-md-6"><input className="form-control" value={editing.lastName} onChange={(e) => setEditing({ ...editing, lastName: e.target.value })} /></div>
            <div className="col-12"><input className="form-control" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
            <div className="col-12"><button className="btn btn-primary" disabled={busy}>Save</button></div>
          </form>
        )}
      </Modal>
      <ConfirmModal show={Boolean(removeId)} title="Delete user?" message="This cannot be undone." confirmLabel="Delete" busy={busy} onClose={() => setRemoveId(null)} onConfirm={remove} />
    </>
  );
}
