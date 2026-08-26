export default function Modal({ show, title, children, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-backdrop-app" onClick={onClose}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <button className="btn-close" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}
