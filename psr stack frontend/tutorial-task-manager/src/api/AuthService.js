import api from './Axios';

export const authService = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }).then(r => r.data),

  register: (name, email, password) =>
    api.post('/api/auth/register', { name, email, password }).then(r => r.data),
};