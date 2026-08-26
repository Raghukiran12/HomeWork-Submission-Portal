export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border text-primary mb-3" role="status" />
      <div>{text}</div>
    </div>
  );
}
