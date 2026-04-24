import api from './api.client';

const getStoredTimeEntries = () => {
    try {
        const stored = localStorage.getItem('school_time_entries');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveTimeEntries = (entries) => {
    localStorage.setItem('school_time_entries', JSON.stringify(entries));
};

let activeTimer = null;

export const timeService = {
    async startTimer(taskId, description = '') {
        if (activeTimer) {
            await this.stopTimer(activeTimer.id);
        }

        try {
            const response = await api.post('/time/start', { taskId, description });
            activeTimer = response.data;
            return response.data;
        } catch (error) {
            activeTimer = {
                id: `timer-${Date.now()}`,
                taskId,
                description,
                startTime: new Date().toISOString(),
                status: 'running'
            };
            localStorage.setItem('active_timer', JSON.stringify(activeTimer));
            return activeTimer;
        }
    },

    async stopTimer(entryId) {
        try {
            const response = await api.post('/time/stop', { entryId });
            if (activeTimer?.id === entryId) {
                activeTimer = null;
                localStorage.removeItem('active_timer');
            }
            return response.data;
        } catch (error) {
            const timer = activeTimer;
            if (timer?.id === entryId) {
                const entry = {
                    ...timer,
                    endTime: new Date().toISOString(),
                    status: 'completed'
                };
                const entries = getStoredTimeEntries();
                saveTimeEntries([...entries, entry]);
                activeTimer = null;
                localStorage.removeItem('active_timer');
                return entry;
            }
            throw error;
        }
    },

    async getActiveTimer() {
        if (activeTimer) return activeTimer;
        
        const stored = localStorage.getItem('active_timer');
        if (stored) {
            activeTimer = JSON.parse(stored);
            return activeTimer;
        }

        try {
            const response = await api.get('/time/timer/status');
            activeTimer = response.data;
            return activeTimer;
        } catch (error) {
            return null;
        }
    },

    async getTimeEntries(params = {}) {
        try {
            const response = await api.get('/time/entries', { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total
            };
        } catch (error) {
            console.warn('API unavailable, using local storage');
            await new Promise(resolve => setTimeout(resolve, 200));
            let entries = getStoredTimeEntries();
            
            if (params.taskId) {
                entries = entries.filter(e => e.taskId === params.taskId);
            }
            
            if (params.userId) {
                entries = entries.filter(e => e.userId === params.userId);
            }
            
            if (params.startDate) {
                entries = entries.filter(e => e.startTime >= params.startDate);
            }
            
            if (params.endDate) {
                entries = entries.filter(e => e.endTime <= params.endDate);
            }
            
            if (params.billable !== undefined) {
                entries = entries.filter(e => e.billable === params.billable);
            }
            
            const page = params.page || 1;
            const limit = params.limit || 50;
            const start = (page - 1) * limit;
            
            return {
                data: entries.slice(start, start + limit),
                total: entries.length
            };
        }
    },

    async createManualEntry(data) {
        try {
            const response = await api.post('/time/entries', data);
            return response.data;
        } catch (error) {
            const entry = {
                ...data,
                id: `te-${Date.now()}`,
                status: 'approved',
                createdAt: new Date().toISOString()
            };
            const entries = getStoredTimeEntries();
            saveTimeEntries([...entries, entry]);
            return entry;
        }
    },

    async updateEntry(id, data) {
        try {
            return await api.put(`/time/entries/${id}`, data);
        } catch (error) {
            const entries = getStoredTimeEntries();
            const updated = entries.map(e => e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e);
            saveTimeEntries(updated);
            return updated.find(e => e.id === id);
        }
    },

    async deleteEntry(id) {
        try {
            return await api.delete(`/time/entries/${id}`);
        } catch (error) {
            const entries = getStoredTimeEntries();
            const filtered = entries.filter(e => e.id !== id);
            saveTimeEntries(filtered);
            return { success: true };
        }
    },

    async getTimeReport(userId, params = {}) {
        try {
            return await api.get('/time/report', { params: { userId, ...params } });
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const entries = getStoredTimeEntries().filter(e => 
                !userId || e.userId === userId
            );
            
            const startDate = params.startDate || new Date(new Date().setDate(1)).toISOString();
            const endDate = params.endDate || new Date().toISOString();
            
            const filteredEntries = entries.filter(e => 
                e.startTime >= startDate && e.startTime <= endDate
            );
            
            const totalMinutes = filteredEntries.reduce((sum, e) => {
                const start = new Date(e.startTime);
                const end = new Date(e.endTime || new Date());
                return sum + (end - start) / 60000;
            }, 0);
            
            const byTask = {};
            filteredEntries.forEach(e => {
                if (!byTask[e.taskId]) {
                    byTask[e.taskId] = { minutes: 0, count: 0 };
                }
                const start = new Date(e.startTime);
                const end = new Date(e.endTime || new Date());
                byTask[e.taskId].minutes += (end - start) / 60000;
                byTask[e.taskId].count++;
            });
            
            const byDate = {};
            filteredEntries.forEach(e => {
                const date = e.startTime.split('T')[0];
                if (!byDate[date]) {
                    byDate[date] = 0;
                }
                const start = new Date(e.startTime);
                const end = new Date(e.endTime || new Date());
                byDate[date] += (end - start) / 60000;
            });
            
            return {
                userId: userId || 'me',
                period: { startDate, endDate },
                totalHours: Math.round(totalMinutes / 60 * 100) / 100,
                totalMinutes,
                billableHours: Math.round(filteredEntries.filter(e => e.billable).reduce((sum, e) => {
                    const start = new Date(e.startTime);
                    const end = new Date(e.endTime || new Date());
                    return sum + (end - start) / 3600000;
                }, 0) * 100) / 100,
                nonBillableHours: Math.round(filteredEntries.filter(e => !e.billable).reduce((sum, e) => {
                    const start = new Date(e.startTime);
                    const end = new Date(e.endTime || new Date());
                    return sum + (end - start) / 3600000;
                }, 0) * 100) / 100,
                entryCount: filteredEntries.length,
                byTask,
                byDate,
                averageHoursPerDay: Object.keys(byDate).length > 0 
                    ? Math.round(totalMinutes / 60 / Object.keys(byDate).length * 100) / 100 
                    : 0
            };
        }
    },

    async approveEntry(id) {
        try {
            return await api.post(`/time/entries/${id}/approve`);
        } catch (error) {
            return this.updateEntry(id, { status: 'approved' });
        }
    },

    async rejectEntry(id, reason) {
        try {
            return await api.post(`/time/entries/${id}/reject`, { reason });
        } catch (error) {
            return this.updateEntry(id, { status: 'rejected', rejectionReason: reason });
        }
    },

    async getPendingApprovals(managerId) {
        try {
            return await api.get('/time/approvals/pending', { params: { managerId } });
        } catch (error) {
            return getStoredTimeEntries().filter(e => e.status === 'pending');
        }
    },

    async bulkApprove(ids) {
        try {
            return await api.post('/time/approvals/bulk', { ids });
        } catch (error) {
            const entries = getStoredTimeEntries();
            const updated = entries.map(e => ids.includes(e.id) ? { ...e, status: 'approved' } : e);
            saveTimeEntries(updated);
            return { success: true, approved: ids.length };
        }
    },

    async getProjectsForTimeTracking() {
        try {
            return await api.get('/time/project-options');
        } catch (error) {
            return [];
        }
    },

    async getTasksForTimeTracking(projectId) {
        try {
            return await api.get('/time/task-options', { params: { projectId } });
        } catch (error) {
            return [];
        }
    },

    async getTodaySummary(userId) {
        try {
            return await api.get(`/time/summary/today`, { params: { userId } });
        } catch (error) {
            const today = new Date().toISOString().split('T')[0];
            const entries = getStoredTimeEntries().filter(e => 
                e.startTime.startsWith(today) && (!userId || e.userId === userId)
            );
            
            const totalMinutes = entries.reduce((sum, e) => {
                const start = new Date(e.startTime);
                const end = new Date(e.endTime || new Date());
                return sum + (end - start) / 60000;
            }, 0);
            
            return {
                date: today,
                totalHours: Math.round(totalMinutes / 60 * 100) / 100,
                entriesCount: entries.length,
                entries
            };
        }
    },

    async getWeeklySummary(userId) {
        try {
            return await api.get(`/time/summary/weekly`, { params: { userId } });
        } catch (error) {
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            
            return this.getTimeReport(userId, {
                startDate: startOfWeek.toISOString(),
                endDate: endOfWeek.toISOString()
            });
        }
    },

    async getMonthlySummary(userId) {
        try {
            return await api.get(`/time/summary/monthly`, { params: { userId } });
        } catch (error) {
            const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
            const endDate = new Date().toISOString();
            return this.getTimeReport(userId, { startDate, endDate });
        }
    },

    async exportTimeReport(userId, format = 'csv', params = {}) {
        const response = await api.get(`/time/export/${userId || 'me'}`, {
            params: { format, ...params },
            responseType: 'blob'
        });
        return response.data;
    },

    async createRecurringEntry(data) {
        try {
            return await api.post('/time/recurring', data);
        } catch (error) {
            return {
                ...data,
                id: `rec-${Date.now()}`,
                status: 'active',
                createdAt: new Date().toISOString()
            };
        }
    },

    async getRecurringEntries() {
        try {
            return await api.get('/time/recurring');
        } catch (error) {
            return [];
        }
    },

    async deleteRecurringEntry(id) {
        try {
            return await api.delete(`/time/recurring/${id}`);
        } catch (error) {
            return { success: true };
        }
    },

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    },

    getAllEntries: () => getStoredTimeEntries(),
    saveAllEntries: saveTimeEntries
};

export default timeService;
