export default function EmptyState({ title = 'Nothing to show yet', message = 'There is no data for this view.' }) {
  return (
    <div className="alert alert-light border text-center py-4">
      <i className="bi bi-inbox fs-2 d-block mb-2 text-muted" />
      <strong>{title}</strong>
      <div className="text-muted">{message}</div>
    </div>
  );
}
