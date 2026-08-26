import { useRef, useState } from 'react';
import { formatBytes } from '../utils/format';

const ALLOWED = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip'];

export default function FileUpload({ file, onChange, maxMB = 10 }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);

  function accept(selected) {
    if (!selected) return;
    const ext = selected.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setError(`Only ${ALLOWED.join(', ').toUpperCase()} files are allowed.`);
      onChange(null);
      return;
    }
    if (selected.size > maxMB * 1024 * 1024) {
      setError(`File must be under ${maxMB} MB.`);
      onChange(null);
      return;
    }
    setError('');
    onChange(selected);
  }

  return (
    <div>
      <div
        className={`upload-zone ${drag ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files[0]); }}
      >
        <i className="bi bi-cloud-arrow-up fs-1 d-block mb-2" />
        <p className="mb-1">Drag and drop your file here</p>
        <button type="button" className="btn btn-outline-primary btn-sm">Browse file</button>
        <input ref={inputRef} type="file" className="d-none" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip" onChange={(e) => accept(e.target.files[0])} />
      </div>
      {error && <div className="text-danger small mt-2">{error}</div>}
      {file && (
        <div className="border rounded p-3 mt-3 d-flex justify-content-between align-items-center">
          <div>
            <strong>{file.name}</strong>
            <div className="small text-muted">{formatBytes(file.size)}</div>
          </div>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onChange(null)}>Remove</button>
        </div>
      )}
    </div>
  );
}
