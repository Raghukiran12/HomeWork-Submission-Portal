import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }).then((res) => res.data),
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data)
};
