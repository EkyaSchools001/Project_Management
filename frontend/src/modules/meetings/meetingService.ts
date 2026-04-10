import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Meeting {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    duration: number;
    meetingType: 'zoom' | 'google_meet' | 'microsoft_teams' | 'internal';
    meetingUrl?: string;
    meetingId?: string;
    password?: string;
    hostId: string;
    hostName: string;
    attendees: Array<{
        userId: string;
        name: string;
        email?: string;
        role: 'host' | 'participant';
    }>;
    status: 'scheduled' | 'live' | 'ended' | 'cancelled';
}

export interface CreateMeetingInput {
    title: string;
    description?: string;
    startTime: string;
    duration: number;
    timezone?: string;
    meetingType: 'zoom' | 'google_meet' | 'microsoft_teams' | 'internal';
    hostId: string;
    hostName: string;
    attendeeIds?: string[];
    recurrence?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval: number;
        endDate?: string;
        count?: number;
    };
}

export const meetingService = {
    createInstantMeeting: async (data: CreateMeetingInput): Promise<Meeting> => {
        const response = await api.post('/meetings', data);
        return response.data.data;
    },

    scheduleMeeting: async (data: CreateMeetingInput): Promise<Meeting> => {
        const response = await api.post('/meetings/schedule', data);
        return response.data.data;
    },

    listMeetings: async (filters?: {
        hostId?: string;
        attendeeId?: string;
        status?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<Meeting[]> => {
        const response = await api.get('/meetings', { params: filters });
        return response.data.data;
    },

    getMeetingById: async (id: string): Promise<Meeting> => {
        const response = await api.get(`/meetings/${id}`);
        return response.data.data;
    },

    updateMeeting: async (id: string, data: Partial<CreateMeetingInput>): Promise<Meeting> => {
        const response = await api.put(`/meetings/${id}`, data);
        return response.data.data;
    },

    cancelMeeting: async (id: string): Promise<void> => {
        await api.delete(`/meetings/${id}`);
    },

    joinMeeting: async (id: string, userId: string, userName: string): Promise<{ meetingUrl: string; password?: string; meetingId: string }> => {
        const response = await api.post(`/meetings/${id}/join`, { userId, userName });
        return response.data.data;
    },

    leaveMeeting: async (id: string, userId: string): Promise<void> => {
        await api.post(`/meetings/${id}/leave`, { userId });
    },
};

export default meetingService;
