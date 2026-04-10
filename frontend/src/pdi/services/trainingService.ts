import api from '@pdi/lib/api';

export interface TrainingEvent {
    id: string;
    title: string;
    topic: string;
    type: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
    registrations?: any[];
    trainingHours?: number;
}

export const trainingService = {
    async getAllEvents() {
        try {
            const response = await api.get('/training');
            return response?.data?.data?.events || [];
        } catch (e) {
            console.error("trainingService getAllEvents error", e);
            return [];
        }
    },

    async getEvent(id: string) {
        try {
            const response = await api.get(`/training/${id}`);
            return response?.data?.data?.event || null;
        } catch (e) {
            console.error("trainingService getEvent error", e);
            return null;
        }
    },

    async createEvent(data: any) {
        const response = await api.post('/training', data);
        return response.data.data.event;
    },

    async registerForEvent(eventId: string) {
        const response = await api.post(`/training/${eventId}/register`);
        return response.data.data.registration;
    },

    async updateStatus(id: string, status: string) {
        const response = await api.patch(`/training/${id}/status`, { status });
        return response.data.data.event;
    },

    async deleteEvent(id: string) {
        const response = await api.delete(`/training/${id}`);
        return response.data;
    },

    async updateEvent(id: string, data: any) {
        const response = await api.put(`/training/${id}`, data);
        return response.data.data.event;
    },

    async toggleAttendance(id: string, action: 'enable' | 'close') {
        const response = await api.post(`/attendance/${id}/toggle`, { action });
        return response.data.data.event;
    }
};
