import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { notificationService } from '../../services/notificationService';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../utils/format';

export default function NotificationsPage() {
  const { data, loading, error, reload } = useAsync(() => notificationService.list().then((res) => res.notifications), []);
  const [busy, setBusy] = useState('');

  async function mark(id) {
    setBusy(id);
    await notificationService.markRead(id);
    await reload();
    setBusy('');
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageHeader eyebrow="Inbox" title="Notifications" />
      {!data?.length && <EmptyState title="No notifications" message="You are up to date." />}
      {data?.map((item) => (
        <div key={item._id} className={`notification-item border rounded p-3 mb-3 ${item.isRead ? '' : 'unread'}`}>
          <div className="d-flex justify-content-between gap-3">
            <div>
              <strong>{item.title}</strong>
              {!item.isRead && <span className="badge bg-primary ms-2">New</span>}
              <p className="mb-1">{item.message}</p>
              <small className="text-muted">{formatDateTime(item.createdAt)}</small>
            </div>
            <button className="btn btn-sm btn-outline-primary" disabled={busy === item._id || item.isRead} onClick={() => mark(item._id)}>
              {item.isRead ? 'Read' : 'Mark read'}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
