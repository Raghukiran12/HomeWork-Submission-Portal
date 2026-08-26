import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminSettings() {
  const toast = useToast();
  const [form, setForm] = useState({
    portalName: 'Homework Submission Portal',
    fileSizeLimitMB: 10,
    allowedFileTypes: 'pdf, doc, docx, ppt, pptx, zip',
    maintenanceMode: false
  });

  function save(event) {
    event.preventDefault();
    toast.success('Settings saved locally. Connect a settings API to persist these values.');
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="System Settings" />
      <form className="card dashboard-card" onSubmit={save}>
        <div className="card-body row g-3">
          <div className="col-md-6"><label className="form-label">Portal name</label><input className="form-control" value={form.portalName} onChange={(e) => setForm({ ...form, portalName: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">File size limit (MB)</label><input type="number" className="form-control" value={form.fileSizeLimitMB} onChange={(e) => setForm({ ...form, fileSizeLimitMB: e.target.value })} /></div>
          <div className="col-12"><label className="form-label">Allowed file types</label><input className="form-control" value={form.allowedFileTypes} onChange={(e) => setForm({ ...form, allowedFileTypes: e.target.value })} /></div>
          <div className="col-12 form-check form-switch">
            <input className="form-check-input" type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
            <label className="form-check-label">Maintenance mode</label>
          </div>
          <div className="col-12"><button className="btn btn-primary">Save settings</button></div>
        </div>
      </form>
    </>
  );
}
