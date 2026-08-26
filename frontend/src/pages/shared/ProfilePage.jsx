import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { userService } from '../../services/userService';
import { fullName } from '../../utils/format';

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    course: user.course || '',
    classCode: user.classCode || '',
    yearLevel: user.yearLevel || '',
    subject: user.subject || '',
    office: user.office || ''
  });
  const [busy, setBusy] = useState(false);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await userService.update(user._id, form);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Account" title="Profile" subtitle={fullName(user)} />
      <div className="card dashboard-card">
        <form className="card-body row g-3" onSubmit={save}>
          <div className="col-md-6"><label className="form-label">First name</label><input className="form-control" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Last name</label><input className="form-control" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" value={user.email} readOnly /></div>
          <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          {user.role === 'student' && (
            <>
              <div className="col-md-6"><label className="form-label">Student ID</label><input className="form-control" value={user.studentId} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Course</label><input className="form-control" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Class</label><input className="form-control" value={form.classCode} onChange={(e) => setForm({ ...form, classCode: e.target.value })} /></div>
            </>
          )}
          {user.role === 'teacher' && (
            <>
              <div className="col-md-6"><label className="form-label">Teacher ID</label><input className="form-control" value={user.teacherId} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Subject</label><input className="form-control" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Office</label><input className="form-control" value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} /></div>
            </>
          )}
          <div className="col-md-6"><label className="form-label">Role</label><input className="form-control text-capitalize" value={user.role} readOnly /></div>
          <div className="col-12"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save profile'}</button></div>
        </form>
      </div>
    </>
  );
}
