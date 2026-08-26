export default function ConfirmModal({ show, title, message, confirmLabel = 'Confirm', onConfirm, onClose, busy }) {
  if (!show) return null;
  return (
    <div className="modal-backdrop-app">
      <div className="app-modal">
        <h5>{title}</h5>
        <p className="text-muted">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={busy}>{busy ? 'Please wait...' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
