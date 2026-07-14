import api from './axios';

export const taskService = {

  // GET /api/tasks?page=0&size=20
  getAll: (page = 0, size = 20) =>
    api.get(`/api/tasks?page=${page}&size=${size}`).then(r => r.data),

  // POST /api/tasks
  create: (task) =>
    api.post('/api/tasks', task).then(r => r.data),

  // PUT /api/tasks/:id
  update: (id, task) =>
    api.put(`/api/tasks/${id}`, task).then(r => r.data),

  // DELETE /api/tasks/:id
  delete: (id) =>
    api.delete(`/api/tasks/${id}`).then(r => r.data),

  updateStatus: (id, status) =>
    api.patch(`/api/tasks/${id}/status`, { status }).then(r => r.data),

  getMyTasks: () =>
    api.get('/api/tasks/my').then(r => r.data),

};