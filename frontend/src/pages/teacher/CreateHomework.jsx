import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import { homeworkService } from '../../services/homeworkService';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

export default function HomeworkForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const existing = useAsync(() => (isEdit ? homeworkService.get(id).then((res) => res.homework) : Promise.resolve(null)), [id]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const source = existing.data || {};
  const [form, setForm] = useState(null);

  const current = form || {
    title: source.title || '',
    subject: source.subject || user.subject || '',
    description: source.description || '',
    instructions: source.instructions || '',
    course: source.course || user.course || 'Bachelor of IT',
    classCode: source.classCode || user.classCode || 'IT-205',
    assignedDate: source.assignedDate ? String(source.assignedDate).slice(0, 10) : '',
    dueDate: source.dueDate ? String(source.dueDate).slice(0, 10) : '',
    maximumMarks: source.maximumMarks || 100,
    allowedFileTypes: (source.allowedFileTypes || ['pdf', 'docx']).join(', '),
    submissionRequirements: source.submissionRequirements || '',
    referenceMaterial: source.referenceMaterial || ''
  };

  function update(key, value) {
    setForm({ ...current, [key]: value });
  }

  async function save(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = { ...current, allowedFileTypes: current.allowedFileTypes };
      if (isEdit) {
        await homeworkService.update(id, payload);
        toast.success('Homework updated.');
      } else {
        await homeworkService.create(payload);
        toast.success('Homework created. Students in this class have been notified.');
      }
      navigate('/teacher/homework');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (isEdit && existing.loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader eyebrow="Teacher" title={isEdit ? 'Edit Homework' : 'Create Homework'} actions={<Link className="btn btn-outline-secondary" to="/teacher/homework">Cancel</Link>} />
      <form className="card dashboard-card" onSubmit={save}>
        <div className="card-body row g-3">
          <div className="col-lg-8"><label className="form-label">Homework Title</label><input className="form-control" required value={current.title} onChange={(e) => update('title', e.target.value)} /></div>
          <div className="col-lg-4"><label className="form-label">Subject</label><input className="form-control" required value={current.subject} onChange={(e) => update('subject', e.target.value)} /></div>
          <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={current.description} onChange={(e) => update('description', e.target.value)} /></div>
          <div className="col-12"><label className="form-label">Instructions</label><textarea className="form-control" rows="3" value={current.instructions} onChange={(e) => update('instructions', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Class/Course</label><input className="form-control" required value={current.course} onChange={(e) => update('course', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Class Code</label><input className="form-control" required value={current.classCode} onChange={(e) => update('classCode', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label">Assigned Date</label><input type="date" className="form-control" required value={current.assignedDate} onChange={(e) => update('assignedDate', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label">Due Date</label><input type="date" className="form-control" required value={current.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label">Maximum Marks</label><input type="number" min="1" className="form-control" required value={current.maximumMarks} onChange={(e) => update('maximumMarks', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label">Allowed File Types</label><input className="form-control" value={current.allowedFileTypes} onChange={(e) => update('allowedFileTypes', e.target.value)} /></div>
          <div className="col-12"><label className="form-label">Submission Requirements</label><textarea className="form-control" rows="2" value={current.submissionRequirements} onChange={(e) => update('submissionRequirements', e.target.value)} /></div>
          <div className="col-12"><label className="form-label">Reference Material</label><textarea className="form-control" rows="2" value={current.referenceMaterial} onChange={(e) => update('referenceMaterial', e.target.value)} /></div>
          {error && <div className="col-12 alert alert-danger">{error}</div>}
          <div className="col-12"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : isEdit ? 'Save changes' : 'Create Homework'}</button></div>
        </div>
      </form>
    </>
  );
}
