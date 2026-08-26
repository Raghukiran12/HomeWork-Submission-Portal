import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import FileUpload from '../../components/FileUpload.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { homeworkService } from '../../services/homeworkService';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, fullName, submissionsForHomework } from '../../utils/format';

export default function SubmitHomework() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const list = useAsync(() => homeworkService.list().then((res) => res.homework), []);
  const previous = useAsync(() => submissionService.list().then((res) => res.submissions), []);
  const [homeworkId, setHomeworkId] = useState(id || '');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const homework = (list.data || []).find((item) => item._id === (homeworkId || id)) || list.data?.[0];
  const attempts = submissionsForHomework(previous.data, homework?._id);
  const isResubmit = attempts.length > 0;

  async function submit() {
    setError('');
    if (!homework) return;
    if (!file) {
      setError('Please select a file to submit.');
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append('homework', homework._id);
      body.append('studentComment', comment);
      body.append('file', file);
      const result = await submissionService.create(body);
      toast.success(result.message || `Submitted successfully (${result.submission.submissionId}).`);
      navigate('/student/submissions');
    } catch (err) {
      setError(err.message);
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  }

  if (list.loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader eyebrow="Submit" title={isResubmit ? 'Resubmit Homework' : 'Submit Homework'} actions={<Link className="btn btn-outline-secondary" to="/student/homework">Back</Link>} />
      {!homework && <div className="alert alert-warning">No homework available to submit.</div>}
      {homework && (
        <div className="card dashboard-card">
          <div className="card-body row g-3">
            {isResubmit && (
              <div className="col-12 alert alert-info mb-0">
                You already submitted {attempts.length} time{attempts.length === 1 ? '' : 's'}. A new upload is saved as attempt {attempts.length + 1}. The teacher can still open every file and choose which attempt to grade.
              </div>
            )}
            <div className="col-md-6">
              <label className="form-label">Homework</label>
              <select className="form-select" value={homework._id} onChange={(e) => setHomeworkId(e.target.value)}>
                {(list.data || []).map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
              </select>
            </div>
            <div className="col-md-6"><label className="form-label">Teacher</label><input className="form-control" readOnly value={fullName(homework.teacher)} /></div>
            <div className="col-md-6"><label className="form-label">Due date</label><input className="form-control" readOnly value={formatDate(homework.dueDate)} /></div>
            <div className="col-md-6"><label className="form-label">Allowed types</label><input className="form-control" readOnly value={(homework.allowedFileTypes || []).join(', ').toUpperCase()} /></div>
            <div className="col-12"><label className="form-label">Student comment</label><textarea className="form-control" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
            <div className="col-12"><FileUpload file={file} onChange={setFile} /></div>
            {error && <div className="col-12 alert alert-danger">{error}</div>}
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" disabled={busy} onClick={() => setConfirm(true)}>{busy ? 'Uploading...' : (isResubmit ? 'Resubmit' : 'Submit')}</button>
              <Link className="btn btn-outline-secondary" to="/student/homework">Cancel</Link>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        show={confirm}
        title={isResubmit ? 'Resubmit homework?' : 'Submit homework?'}
        message={isResubmit ? 'This uploads a new attempt. Earlier files stay available for your teacher.' : 'You are about to submit this file. Continue?'}
        confirmLabel={isResubmit ? 'Yes, resubmit' : 'Yes, submit'}
        busy={busy}
        onClose={() => setConfirm(false)}
        onConfirm={submit}
      />
    </>
  );
}
