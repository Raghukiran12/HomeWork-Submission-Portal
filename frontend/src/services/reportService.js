import api from './api';

export const reportService = {
  dashboard: () => api.get('/reports/dashboard').then((res) => res.data),
  submissions: () => api.get('/reports/submissions').then((res) => res.data),
  grades: () => api.get('/reports/grades').then((res) => res.data)
};
