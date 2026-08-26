import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatDateTime } from '../utils/format';

const ICONS = {
  new_homework: 'bi-pencil-square',
  deadline: 'bi-alarm',
  reminder: 'bi-bell',
  successful_submission: 'bi-check-circle',
  graded: 'bi-star-fill',
  feedback: 'bi-chat-left-text',
  submission: 'bi-file-earmark-text',
  system: 'bi-info-circle'
};

export default function NotificationList() {
  const [items, setItems] = useState([]);

  async function load() {
    setItems(await api('/notifications'));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id) {
    await api(`/notifications/${id}/read`, { method: 'PATCH' });
    load();
  }

  if (!items.length) {
    return <div className="alert alert-light border">No notifications yet.</div>;
  }

  return items.map((notification) => (
    <div key={notification.id} className={`notification-item ${notification.read ? '' : 'unread'} border rounded p-3 mb-3`}>
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className={`bi ${ICONS[notification.type] || 'bi-bell'}`} />
            <strong>{notification.title}</strong>
            {!notification.read && <span className="badge bg-primary">New</span>}
          </div>
          <p className="mb-1">{notification.message}</p>
          <small className="text-muted">{formatDateTime(notification.createdAt)}</small>
        </div>
        <button className="btn btn-sm btn-outline-primary" onClick={() => markRead(notification.id)}>
          {notification.read ? 'Read' : 'Mark read'}
        </button>
      </div>
    </div>
  ));
}
