import { useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Name, email and message are required.');
      return;
    }
    setError('');
    toast.success('Message sent to the unit team.');
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <section className="about-page">
      <span className="lp-badge">Contact</span>
      <h1>Contact support</h1>
      <p className="intro">Marks and extensions: email your tutor. This form is for login or upload faults.</p>
      <p className="help-line mb-3">ITS · Level 3, Gardens Point · +61 7 3138 2000</p>

      <form className="who-box" onSubmit={submit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input className="form-control" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows="4" value={form.message} onChange={(e) => update('message', e.target.value)} />
          </div>
          {error && <div className="col-12 text-danger">{error}</div>}
          <div className="col-12">
            <button className="btn btn-primary" type="submit">Send</button>
          </div>
        </div>
      </form>
    </section>
  );
}
