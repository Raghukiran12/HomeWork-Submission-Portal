import api from './api';

export const userService = {
  list: (params) => api.get('/users', { params }).then((res) => res.data),
  get: (id) => api.get(`/users/${id}`).then((res) => res.data),
  create: (payload) => api.post('/users', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/users/${id}`, payload).then((res) => res.data),
  updateStatus: (id, isActive) => api.patch(`/users/${id}/status`, { isActive }).then((res) => res.data),
  remove: (id) => api.delete(`/users/${id}`).then((res) => res.data)
};
