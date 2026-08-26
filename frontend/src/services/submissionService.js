import api from './api';

export const submissionService = {
  list: (params) => api.get('/submissions', { params }).then((res) => res.data),
  get: (id) => api.get(`/submissions/${id}`).then((res) => res.data),
  create: (formData) => api.post('/submissions', formData).then((res) => res.data),
  update: (id, payload) => api.put(`/submissions/${id}`, payload).then((res) => res.data),
  grade: (id, payload) => api.put(`/submissions/${id}/grade`, payload).then((res) => res.data),
  selectOfficial: (id) => api.put(`/submissions/${id}/official`).then((res) => res.data)
};
