import api from './api.client';
import { MOCK_PROJECTS } from '../data/pmsData';

const getStoredProjects = () => {
    try {
        const stored = localStorage.getItem('school_projects');
        return stored ? JSON.parse(stored) : MOCK_PROJECTS;
    } catch {
        return MOCK_PROJECTS;
    }
};

const saveProjects = (projects) => {
    localStorage.setItem('school_projects', JSON.stringify(projects));
};

export const projectService = {
    async getProjects(params = {}) {
        try {
            const response = await api.get('/projects', { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total,
                page: response.data.page,
                limit: response.data.limit
            };
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 300));
            let projects = getStoredProjects();
            
            if (params.status) {
                projects = projects.filter(p => p.status === params.status);
            }
            
            if (params.search) {
                const search = params.search.toLowerCase();
                projects = projects.filter(p => 
                    p.name?.toLowerCase().includes(search) ||
                    p.description?.toLowerCase().includes(search)
                );
            }
            
            if (params.managerId) {
                projects = projects.filter(p => p.managerId === params.managerId);
            }
            
            if (params.startDate) {
                projects = projects.filter(p => p.startDate >= params.startDate);
            }
            
            if (params.endDate) {
                projects = projects.filter(p => p.endDate <= params.endDate);
            }
            
            const page = params.page || 1;
            const limit = params.limit || 20;
            const start = (page - 1) * limit;
            
            return {
                data: projects.slice(start, start + limit),
                total: projects.length,
                page,
                limit
            };
        }
    },

    async getProject(id) {
        try {
            return await api.get(`/projects/${id}`);
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 200));
            return getStoredProjects().find(p => p.id === id);
        }
    },

    async createProject(data) {
        try {
            return await api.post('/projects', data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const projects = getStoredProjects();
            const newProject = {
                ...data,
                id: `p-${Date.now()}`,
                status: 'PLANNED',
                createdAt: new Date().toISOString()
            };
            saveProjects([...projects, newProject]);
            return newProject;
        }
    },

    async updateProject(id, data) {
        try {
            return await api.put(`/projects/${id}`, data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const projects = getStoredProjects();
            const updated = projects.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
            saveProjects(updated);
            return updated.find(p => p.id === id);
        }
    },

    async deleteProject(id) {
        try {
            return await api.delete(`/projects/${id}`);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const projects = getStoredProjects();
            const filtered = projects.filter(p => p.id !== id);
            saveProjects(filtered);
            return { success: true };
        }
    },

    async getProjectStats(id) {
        try {
            return await api.get(`/projects/${id}/stats`);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const project = getStoredProjects().find(p => p.id === id);
            return {
                completion: project?.status === 'COMPLETED' ? 100 : 65,
                budgetUsed: 75,
                tasksCompleted: 12,
                tasksTotal: 18,
                teamSize: 5,
                daysRemaining: 45,
                health: 'Good',
                risks: 2,
                milestones: { completed: 3, total: 5 }
            };
        }
    },

    async getProjectTasks(id, params = {}) {
        try {
            return await api.get(`/projects/${id}/tasks`, { params });
        } catch (error) {
            const storedTasks = localStorage.getItem('school_tasks');
            const tasks = storedTasks ? JSON.parse(storedTasks) : [];
            return tasks.filter(t => t.projectId === id);
        }
    },

    async getProjectTeam(id) {
        try {
            return await api.get(`/projects/${id}/team`);
        } catch (error) {
            return [];
        }
    },

    async addTeamMember(projectId, userId, role = 'member') {
        try {
            return await api.post(`/projects/${projectId}/team`, { userId, role });
        } catch (error) {
            return { success: true, projectId, userId, role };
        }
    },

    async removeTeamMember(projectId, userId) {
        try {
            return await api.delete(`/projects/${projectId}/team/${userId}`);
        } catch (error) {
            return { success: true };
        }
    },

    async getProjectMilestones(id) {
        try {
            return await api.get(`/projects/${id}/milestones`);
        } catch (error) {
            return [
                { id: 'm1', title: 'Phase 1 Complete', status: 'completed', dueDate: '2026-01-15' },
                { id: 'm2', title: 'Phase 2 Complete', status: 'completed', dueDate: '2026-02-28' },
                { id: 'm3', title: 'Phase 3 Complete', status: 'in_progress', dueDate: '2026-04-15' },
                { id: 'm4', title: 'Final Review', status: 'pending', dueDate: '2026-05-30' }
            ];
        }
    },

    async createMilestone(projectId, data) {
        try {
            return await api.post(`/projects/${projectId}/milestones`, data);
        } catch (error) {
            return { ...data, id: `ms-${Date.now()}`, projectId };
        }
    },

    async updateMilestone(projectId, milestoneId, data) {
        try {
            return await api.put(`/projects/${projectId}/milestones/${milestoneId}`, data);
        } catch (error) {
            return { ...data, id: milestoneId, projectId };
        }
    },

    async getProjectDocuments(id) {
        try {
            return await api.get(`/projects/${id}/documents`);
        } catch (error) {
            return [];
        }
    },

    async uploadProjectDocument(projectId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            return await api.post(`/projects/${projectId}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (error) {
            return { success: true, fileId: `doc-${Date.now()}`, name: file.name };
        }
    },

    async cloneProject(id, newData = {}) {
        try {
            return await api.post(`/projects/${id}/clone`, newData);
        } catch (error) {
            const project = getStoredProjects().find(p => p.id === id);
            const cloned = {
                ...project,
                ...newData,
                id: `p-${Date.now()}`,
                name: `${project?.name} (Copy)`,
                status: 'PLANNED',
                createdAt: new Date().toISOString()
            };
            const projects = getStoredProjects();
            saveProjects([...projects, cloned]);
            return cloned;
        }
    },

    async archiveProject(id) {
        try {
            return await api.patch(`/projects/${id}`, { archived: true });
        } catch (error) {
            return this.updateProject(id, { archived: true });
        }
    },

    async exportProject(id, format = 'pdf') {
        const response = await api.get(`/projects/${id}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    },

    getAllProjects: () => getStoredProjects(),
    saveAllProjects: saveProjects
};

export default projectService;
