import api from './api';

export const aiService = {
    async prioritizeTasks(tasks, context) {
        const response = await api.post('/v1/ai/prioritize', { tasks, context });
        return response.data.data;
    },

    async analyzeRisk(project, historicalData) {
        const response = await api.post('/v1/ai/risk-assessment', { project, historicalData });
        return response.data.data;
    },

    async suggestWorkload(teamMembers, tasks) {
        const response = await api.post('/v1/ai/workload-balance', { teamMembers, tasks });
        return response.data.data;
    },

    async optimizeMeeting(meetings, constraints) {
        const response = await api.post('/v1/ai/meeting-schedule', { meetings, constraints });
        return response.data.data;
    },

    async analyze(text, type) {
        const response = await api.post('/v1/ai/analyze', { text, type });
        return response.data.data;
    },

    async chatbot(message, context) {
        const response = await api.post('/v1/ai/chatbot', { message, context });
        return response.data.data;
    },

    async getSuggestions(userId, types) {
        try {
            const response = await api.get('/v1/ai/suggestions', { params: { userId, types: types?.join(',') } });
            // #region agent log
            fetch('http://127.0.0.1:7595/ingest/a1327625-861f-425d-8b19-5e387310336b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea8b1'},body:JSON.stringify({sessionId:'5ea8b1',runId:'run1',hypothesisId:'H4',location:'ai.service.js:getSuggestions:success',message:'AI suggestions endpoint success',data:{status:response?.status||null,count:Array.isArray(response?.data?.data)?response.data.data.length:null},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            return response.data.data;
        } catch (error) {
            // #region agent log
            fetch('http://127.0.0.1:7595/ingest/a1327625-861f-425d-8b19-5e387310336b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea8b1'},body:JSON.stringify({sessionId:'5ea8b1',runId:'run1',hypothesisId:'H4',location:'ai.service.js:getSuggestions:failed',message:'AI suggestions endpoint failed',data:{status:error?.response?.status||null,hasResponse:!!error?.response},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            // Local/dev fallback when AI suggestions endpoint is unavailable.
            if (error?.response?.status === 404 || error?.response?.status === 401 || error?.response?.status === 403) {
                return [
                    {
                        id: 'fallback-1',
                        type: 'task',
                        title: 'Review your open tasks',
                        description: 'Prioritize overdue or high-impact items first.',
                        priority: 'medium',
                        action: { type: 'navigate', path: '/pms/tasks' }
                    }
                ];
            }
            throw error;
        }
    },

    async autoTag(items) {
        const response = await api.post('/v1/ai/auto-tag', { items });
        return response.data.data;
    }
};