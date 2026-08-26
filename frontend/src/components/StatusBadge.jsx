const MAP = {
  Pending: 'pending', pending: 'pending',
  Submitted: 'submitted', submitted: 'submitted',
  Late: 'late', late: 'late',
  Overdue: 'overdue', overdue: 'overdue',
  Graded: 'graded', graded: 'graded',
  active: 'active', Active: 'active',
  draft: 'draft', archived: 'draft',
  Inactive: 'draft'
};

export default function StatusBadge({ status }) {
  const tone = MAP[status] || 'pending';
  return <span className={`status-badge status-badge--${tone}`}>{status}</span>;
}
