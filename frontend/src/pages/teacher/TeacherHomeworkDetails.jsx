import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { homeworkService } from '../../services/homeworkService';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, fullName } from '../../utils/format';

export default function TeacherHomeworkDetails() {
  const { id } = useParams();
  const { data, loading, error } = useAsync(() => homeworkService.get(id).then((res) => res.homework), [id]);
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageHeader title={data.title} actions={<Link className="btn btn-outline-primary" to={`/teacher/homework/${data._id}/edit`}>Edit</Link>} />
      <div className="card dashboard-card">
        <div className="card-body row g-3">
          <div className="col-md-6"><strong>Subject:</strong> {data.subject}</div>
          <div className="col-md-6"><strong>Teacher:</strong> {fullName(data.teacher)}</div>
          <div className="col-md-6"><strong>Course:</strong> {data.course} / {data.classCode}</div>
          <div className="col-md-6"><strong>Due:</strong> {formatDate(data.dueDate)}</div>
          <div className="col-12"><strong>Description</strong><p>{data.description}</p></div>
          <div className="col-12"><strong>Instructions</strong><p>{data.instructions}</p></div>
        </div>
      </div>
    </>
  );
}
