import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { homeworkService } from '../../services/homeworkService';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, formatDateTime, fullName, submissionFileUrl, submissionsForHomework } from '../../utils/format';

export default function HomeworkDetails() {
  const { id } = useParams();
  const homework = useAsync(() => homeworkService.get(id).then((res) => res.homework), [id]);
  const submissions = useAsync(() => submissionService.list().then((res) => res.submissions), []);
  if (homework.loading) return <LoadingSpinner />;
  if (homework.error) return <div className="alert alert-danger">{homework.error}</div>;
  const hw = homework.data;
  const attempts = submissionsForHomework(submissions.data, hw._id).sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));
  const submitted = attempts.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Homework details"
        title={hw.title}
        actions={(
          <Link className="btn btn-primary" to={`/student/submit/${hw._id}`}>
            {submitted ? 'Resubmit Homework' : 'Submit Homework'}
          </Link>
        )}
      />
      <div className="card dashboard-card mb-3">
        <div className="card-body row g-3">
          <div className="col-md-6"><p className="text-muted mb-1">Subject</p><h5>{hw.subject}</h5></div>
          <div className="col-md-6"><p className="text-muted mb-1">Teacher</p><h5>{fullName(hw.teacher)}</h5></div>
          <div className="col-md-6"><p className="text-muted mb-1">Assigned date</p><h5>{formatDate(hw.assignedDate)}</h5></div>
          <div className="col-md-6"><p className="text-muted mb-1">Due date</p><h5>{formatDate(hw.dueDate)}</h5></div>
          <div className="col-md-6"><p className="text-muted mb-1">Maximum marks</p><h5>{hw.maximumMarks}</h5></div>
          <div className="col-md-6"><p className="text-muted mb-1">Allowed file types</p><h5>{(hw.allowedFileTypes || []).join(', ').toUpperCase()}</h5></div>
        </div>
      </div>
      <div className="card dashboard-card mb-3"><div className="card-header"><h5 className="mb-0">Description</h5></div><div className="card-body">{hw.description}</div></div>
      <div className="card dashboard-card mb-3"><div className="card-header"><h5 className="mb-0">Instructions</h5></div><div className="card-body">{hw.instructions}</div></div>
      <div className="card dashboard-card mb-3"><div className="card-header"><h5 className="mb-0">Submission requirements</h5></div><div className="card-body">{hw.submissionRequirements || '—'}</div></div>
      {submitted && (
        <div className="card dashboard-card mb-3">
          <div className="card-header"><h5 className="mb-0">Your attempts</h5></div>
          <div className="card-body">
            {attempts.map((item) => (
              <div key={item._id} className="d-flex flex-wrap justify-content-between gap-2 align-items-center py-2 border-bottom">
                <div>
                  <strong>Attempt {item.attemptNumber || 1}</strong>
                  {item.isOfficial ? <span className="badge bg-primary ms-2">Counts for grade</span> : null}
                  <div className="text-muted small">{item.fileName} · {formatDateTime(item.submittedAt)}</div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <StatusBadge status={item.status} />
                  {item.filePath && (
                    <a className="btn btn-sm btn-outline-primary" href={submissionFileUrl(item.filePath)} target="_blank" rel="noreferrer">View file</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
