import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import FilterDropdown from '../../components/FilterDropdown.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DataTable from '../../components/DataTable.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { homeworkService } from '../../services/homeworkService';
import { submissionService } from '../../services/submissionService';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, fullName, homeworkStatus, officialSubmission, submissionsForHomework } from '../../utils/format';

export default function MyHomework() {
  const homework = useAsync(() => homeworkService.list().then((res) => res.homework), []);
  const submissions = useAsync(() => submissionService.list().then((res) => res.submissions), []);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    const list = homework.data || [];
    const subs = submissions.data || [];
    return list.map((item) => {
      const attempts = submissionsForHomework(subs, item._id);
      const submission = officialSubmission(attempts);
      return { ...item, statusLabel: homeworkStatus(item, submission), submission, attempts };
    }).filter((item) => {
      const q = search.toLowerCase();
      const matchQ = !q || item.title.toLowerCase().includes(q) || item.subject.toLowerCase().includes(q);
      return matchQ && (!subject || item.subject === subject) && (!status || item.statusLabel === status);
    }).sort((a, b) => (sortAsc ? 1 : -1) * (new Date(a.dueDate) - new Date(b.dueDate)));
  }, [homework.data, submissions.data, search, subject, status, sortAsc]);

  if (homework.loading) return <LoadingSpinner />;
  if (homework.error) return <div className="alert alert-danger">{homework.error}</div>;

  return (
    <>
      <PageHeader eyebrow="Student" title="My Homework" />
      <div className="card dashboard-card">
        <div className="card-body row g-3">
          <div className="col-md-4"><SearchBar value={search} onChange={setSearch} placeholder="Search title or subject" /></div>
          <div className="col-md-3"><FilterDropdown value={subject} onChange={setSubject} options={[...new Set((homework.data || []).map((item) => item.subject))]} label="All subjects" /></div>
          <div className="col-md-3"><FilterDropdown value={status} onChange={setStatus} options={['Pending', 'Submitted', 'Late', 'Overdue', 'Graded']} label="All statuses" /></div>
          <div className="col-md-2"><button className="btn btn-primary w-100" onClick={() => setSortAsc((v) => !v)}>Sort due date</button></div>
        </div>
      </div>
      <div className="card dashboard-card">
        <DataTable
          empty={<EmptyState title="No homework matches your filters" />}
          rows={rows}
          columns={[
            { key: '_id', label: 'Homework ID', render: (row) => String(row._id).slice(-8).toUpperCase() },
            { key: 'title', label: 'Title' },
            { key: 'subject', label: 'Subject' },
            { key: 'teacher', label: 'Teacher', render: (row) => fullName(row.teacher) },
            { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
            { key: 'maximumMarks', label: 'Maximum Marks' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.statusLabel} /> },
            { key: 'action', label: 'Action', render: (row) => (
              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-outline-primary" to={`/student/homework/${row._id}`}>View</Link>
                <Link className="btn btn-sm btn-primary" to={`/student/submit/${row._id}`}>
                  {row.attempts?.length ? 'Resubmit' : 'Submit'}
                </Link>
              </div>
            ) }
          ]}
        />
      </div>
    </>
  );
}
