import api from './api';

export const notificationService = {
  list: () => api.get('/notifications').then((res) => res.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((res) => res.data)
};
