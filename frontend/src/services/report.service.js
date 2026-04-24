import api from './api.client';

export const reportService = {
  getReports: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  getReport: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  createReport: async (data) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  updateReport: async (id, data) => {
    const response = await api.put(`/reports/${id}`, data);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  generateReport: async (data) => {
    const response = await api.post('/reports/generate', data);
    return response.data;
  },

  exportReport: async (id, format) => {
    const response = await api.post(`/reports/${id}/export`, { format });
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/reports/templates');
    return response.data;
  },

  getDataSources: async () => {
    const response = await api.get('/reports/datasources');
    return response.data;
  },

  scheduleReport: async (data) => {
    const response = await api.post('/reports/schedule', data);
    return response.data;
  },

  getSchedules: async (reportId) => {
    const response = await api.get('/reports/schedules', { params: { reportId } });
    return response.data;
  },
};

export default reportService;