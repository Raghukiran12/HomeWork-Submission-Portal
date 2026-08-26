import api from './api';

export const homeworkService = {
  list: () => api.get('/homework').then((res) => res.data),
  get: (id) => api.get(`/homework/${id}`).then((res) => res.data),
  create: (payload) => api.post('/homework', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/homework/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/homework/${id}`).then((res) => res.data)
};
