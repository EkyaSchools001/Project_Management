import api from './api.client';

export const reportService = {
  getReports: async (params = {}) => {
    const response = await api.get('/api/v1/reports', { params });
    return response.data;
  },

  getReport: async (id) => {
    const response = await api.get(`/api/v1/reports/${id}`);
    return response.data;
  },

  createReport: async (data) => {
    const response = await api.post('/api/v1/reports', data);
    return response.data;
  },

  updateReport: async (id, data) => {
    const response = await api.put(`/api/v1/reports/${id}`, data);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/api/v1/reports/${id}`);
    return response.data;
  },

  generateReport: async (data) => {
    const response = await api.post('/api/v1/reports/generate', data);
    return response.data;
  },

  exportReport: async (id, format) => {
    const response = await api.post(`/api/v1/reports/${id}/export`, { format });
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/api/v1/reports/templates');
    return response.data;
  },

  getDataSources: async () => {
    const response = await api.get('/api/v1/reports/datasources');
    return response.data;
  },

  scheduleReport: async (data) => {
    const response = await api.post('/api/v1/reports/schedule', data);
    return response.data;
  },

  getSchedules: async (reportId) => {
    const response = await api.get('/api/v1/reports/schedules', { params: { reportId } });
    return response.data;
  },
};

export default reportService;