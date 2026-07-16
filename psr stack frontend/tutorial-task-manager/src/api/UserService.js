import api from './Axios';

export const userService = {
  getAll: () => api.get('/api/users').then(r => r.data),
};