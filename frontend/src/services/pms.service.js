import api from './api';

export const pmsService = {
    getProjects: () => api.get('/projects').then(r => r.data),
    getProject: (id) => api.get(`/projects/${id}`).then(r => r.data),
    createProject: (data) => api.post('/projects', data).then(r => r.data),
    updateProject: (id, data) => api.put(`/projects/${id}`, data).then(r => r.data),
    deleteProject: (id) => api.delete(`/projects/${id}`).then(r => r.data),
    getTasks: (params) => api.get('/tasks', { params }).then(r => r.data),
    createTask: (data) => api.post('/tasks', data).then(r => r.data),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data),
    deleteTask: (id) => api.delete(`/tasks/${id}`).then(r => r.data),
    getReports: (params) => api.get('/reports', { params }).then(r => r.data),
    getTeamMembers: (params) => api.get('/team', { params }).then(r => r.data),
};
