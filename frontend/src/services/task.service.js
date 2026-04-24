import api from './api.client';
import { MOCK_TASKS } from '../data/pmsData';

const getStoredTasks = () => {
    try {
        const stored = localStorage.getItem('school_tasks');
        return stored ? JSON.parse(stored) : MOCK_TASKS;
    } catch {
        return MOCK_TASKS;
    }
};

const saveTasks = (tasks) => {
    localStorage.setItem('school_tasks', JSON.stringify(tasks));
};

export const taskService = {
    async getTasks(params = {}) {
        try {
            const response = await api.get('/projects/tasks', { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total,
                page: response.data.page,
                limit: response.data.limit
            };
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 300));
            let tasks = getStoredTasks();
            
            if (params.status) {
                tasks = tasks.filter(t => t.status === params.status);
            }
            
            if (params.priority) {
                tasks = tasks.filter(t => t.priority === params.priority);
            }
            
            if (params.projectId) {
                tasks = tasks.filter(t => t.projectId === params.projectId);
            }
            
            if (params.assigneeId) {
                tasks = tasks.filter(t => t.assigneeId === params.assigneeId);
            }
            
            if (params.search) {
                const search = params.search.toLowerCase();
                tasks = tasks.filter(t => 
                    t.title?.toLowerCase().includes(search) ||
                    t.description?.toLowerCase().includes(search)
                );
            }
            
            if (params.dueDate) {
                tasks = tasks.filter(t => t.dueDate === params.dueDate);
            }
            
            if (params.overdue) {
                const now = new Date().toISOString().split('T')[0];
                tasks = tasks.filter(t => t.dueDate < now && t.status !== 'Done');
            }
            
            const page = params.page || 1;
            const limit = params.limit || 20;
            const start = (page - 1) * limit;
            
            return {
                data: tasks.slice(start, start + limit),
                total: tasks.length,
                page,
                limit
            };
        }
    },

    async getTask(id) {
        try {
            return await api.get(`/projects/tasks/${id}`);
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 200));
            return getStoredTasks().find(t => t.id === id);
        }
    },

    async createTask(data) {
        try {
            return await api.post('/projects/tasks', data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const tasks = getStoredTasks();
            const newTask = {
                ...data,
                id: `t-${Date.now()}`,
                status: 'Todo',
                createdAt: new Date().toISOString()
            };
            saveTasks([...tasks, newTask]);
            return newTask;
        }
    },

    async updateTask(id, data) {
        try {
            return await api.put(`/projects/tasks/${id}`, data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const tasks = getStoredTasks();
            const updated = tasks.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t);
            saveTasks(updated);
            return updated.find(t => t.id === id);
        }
    },

    async deleteTask(id) {
        try {
            return await api.delete(`/projects/tasks/${id}`);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const tasks = getStoredTasks();
            const filtered = tasks.filter(t => t.id !== id);
            saveTasks(filtered);
            return { success: true };
        }
    },

    async assignTask(id, userId) {
        try {
            return await api.patch(`/projects/tasks/${id}/assign`, { userId });
        } catch (error) {
            return this.updateTask(id, { assigneeId: userId });
        }
    },

    async updateTaskStatus(id, status) {
        try {
            return await api.patch(`/projects/tasks/${id}/status`, { status });
        } catch (error) {
            return this.updateTask(id, { status });
        }
    },

    async getTaskComments(taskId) {
        try {
            return await api.get(`/projects/tasks/${taskId}/comments`);
        } catch (error) {
            return [];
        }
    },

    async addComment(taskId, content) {
        try {
            return await api.post(`/projects/tasks/${taskId}/comments`, { content });
        } catch (error) {
            return {
                id: `c-${Date.now()}`,
                taskId,
                content,
                createdAt: new Date().toISOString()
            };
        }
    },

    async getTaskAttachments(taskId) {
        try {
            return await api.get(`/projects/tasks/${taskId}/attachments`);
        } catch (error) {
            return [];
        }
    },

    async addAttachment(taskId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            return await api.post(`/projects/tasks/${taskId}/attachments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (error) {
            return {
                id: `att-${Date.now()}`,
                taskId,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file)
            };
        }
    },

    async getTaskActivity(taskId) {
        try {
            return await api.get(`/projects/tasks/${taskId}/activity`);
        } catch (error) {
            return [];
        }
    },

    async getSubtasks(taskId) {
        try {
            return await api.get(`/projects/tasks/${taskId}/subtasks`);
        } catch (error) {
            const tasks = getStoredTasks();
            return tasks.filter(t => t.parentId === taskId);
        }
    },

    async createSubtask(parentId, data) {
        try {
            return await api.post(`/projects/tasks/${parentId}/subtasks`, data);
        } catch (error) {
            return this.createTask({ ...data, parentId });
        }
    },

    async bulkUpdateTasks(ids, data) {
        try {
            return await api.patch('/projects/tasks/bulk', { ids, data });
        } catch (error) {
            const tasks = getStoredTasks();
            const updated = tasks.map(t => ids.includes(t.id) ? { ...t, ...data } : t);
            saveTasks(updated);
            return { success: true, updated: ids.length };
        }
    },

    async duplicateTask(id) {
        try {
            return await api.post(`/projects/tasks/${id}/duplicate`);
        } catch (error) {
            const task = getStoredTasks().find(t => t.id === id);
            const duplicated = {
                ...task,
                id: `t-${Date.now()}`,
                title: `${task?.title} (Copy)`,
                status: 'Todo',
                createdAt: new Date().toISOString()
            };
            const tasks = getStoredTasks();
            saveTasks([...tasks, duplicated]);
            return duplicated;
        }
    },

    async getMyTasks(params = {}) {
        const userJson = localStorage.getItem('school_mgmt_user');
        const user = userJson ? JSON.parse(userJson) : null;
        if (user) {
            params.assigneeId = user.id;
        }
        return this.getTasks(params);
    },

    async getOverdueTasks() {
        return this.getTasks({ overdue: true });
    },

    async getTasksByProject(projectId) {
        return this.getTasks({ projectId });
    },

    async exportTasks(params = {}, format = 'csv') {
        const response = await api.get('/projects/tasks/export', {
            params: { ...params, format },
            responseType: 'blob'
        });
        return response.data;
    },

    getAllTasks: () => getStoredTasks(),
    saveAllTasks: saveTasks
};

export default taskService;
