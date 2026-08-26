import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, formatDateTime, formatBytes, fullName, submissionFileUrl } from '../../utils/format';

export default function GradeSubmission() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const list = useAsync(() => submissionService.list().then((res) => res.submissions), []);
  const submission = (list.data || []).find((item) => item._id === id);
  const attempts = (list.data || [])
    .filter((item) => String(item.student?._id || item.student) === String(submission?.student?._id || submission?.student)
      && String(item.homework?._id || item.homework) === String(submission?.homework?._id || submission?.homework))
    .sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const max = submission?.homework?.maximumMarks || 100;
  const numeric = Number(marks || submission?.marks || 0);
  const percentage = max ? Number(((numeric / max) * 100).toFixed(1)) : 0;

  async function save() {
    if (!submission) return;
    setBusy(true);
    setError('');
    try {
      await submissionService.grade(submission._id, { marks: numeric, teacherFeedback: feedback || submission.teacherFeedback });
      toast.success('Grade submitted. This attempt now counts for the student.');
      navigate('/teacher/submissions');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (list.loading) return <LoadingSpinner />;
  if (!submission) return <EmptyState title="No submission available for grading" />;

  return (
    <>
      <PageHeader title={`Grade attempt ${submission.attemptNumber || 1}`} />
      {attempts.length > 1 && (
        <div className="card dashboard-card mb-3">
          <div className="card-header"><h5 className="mb-0">All attempts for this student</h5></div>
          <div className="card-body">
            {attempts.map((item) => (
              <div key={item._id} className="d-flex flex-wrap justify-content-between gap-2 align-items-center py-2 border-bottom">
                <div>
                  <strong>Attempt {item.attemptNumber || 1}</strong>
                  {item.isOfficial ? <span className="badge bg-primary ms-2">Assigned</span> : null}
                  {item._id === submission._id ? <span className="badge bg-secondary ms-2">Open</span> : null}
                  <div className="text-muted small">{item.fileName} · {formatDateTime(item.submittedAt)}</div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <StatusBadge status={item.status} />
                  {item.filePath && (
                    <a className="btn btn-sm btn-outline-primary" href={submissionFileUrl(item.filePath)} target="_blank" rel="noreferrer">View file</a>
                  )}
                  {item._id !== submission._id && (
                    <Link className="btn btn-sm btn-outline-secondary" to={`/teacher/grade/${item._id}`}>Grade this attempt</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="card dashboard-card">
        <div className="card-body row g-3">
          <div className="col-md-6"><label className="form-label">Student</label><input className="form-control" readOnly value={`${fullName(submission.student)} (${submission.student?.studentId || ''})`} /></div>
          <div className="col-md-6"><label className="form-label">Homework</label><input className="form-control" readOnly value={submission.homework?.title || ''} /></div>
          <div className="col-md-6">
            <label className="form-label">Submitted file</label>
            <div className="d-flex gap-2">
              <input className="form-control" readOnly value={`${submission.fileName} (${formatBytes(submission.fileSize)})`} />
              {submission.filePath && (
                <a className="btn btn-outline-primary text-nowrap" href={submissionFileUrl(submission.filePath)} target="_blank" rel="noreferrer">
                  View file
                </a>
              )}
            </div>
          </div>
          <div className="col-md-3"><label className="form-label">Submission date</label><input className="form-control" readOnly value={formatDateTime(submission.submittedAt)} /></div>
          <div className="col-md-3"><label className="form-label">Due date</label><input className="form-control" readOnly value={formatDate(submission.homework?.dueDate)} /></div>
          <div className="col-12"><label className="form-label">Student comment</label><textarea className="form-control" rows="3" readOnly value={submission.studentComment || 'No comments'} /></div>
          <div className="col-md-4"><label className="form-label">Maximum marks</label><input className="form-control" readOnly value={max} /></div>
          <div className="col-md-4"><label className="form-label">Marks obtained</label><input className="form-control" type="number" min="0" max={max} value={marks || submission.marks || ''} onChange={(e) => setMarks(e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Percentage / Grade preview</label><input className="form-control" readOnly value={`${percentage}%`} /></div>
          <div className="col-12"><label className="form-label">Teacher feedback</label><textarea className="form-control" rows="4" value={feedback || submission.teacherFeedback || ''} onChange={(e) => setFeedback(e.target.value)} /></div>
          {error && <div className="col-12 alert alert-danger">{error}</div>}
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" disabled={busy} onClick={save}>{busy ? 'Saving...' : 'Submit Grade'}</button>
            <Link className="btn btn-outline-secondary" to="/teacher/submissions">Cancel</Link>
          </div>
        </div>
      </div>
    </>
  );
}
