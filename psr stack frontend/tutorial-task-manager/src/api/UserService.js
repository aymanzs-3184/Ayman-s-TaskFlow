import api from './axios';

export const userService = {
  getAll: () => api.get('/api/users').then(r => r.data),
};