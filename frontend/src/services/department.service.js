import api from './api.client';
import { DEPARTMENTS } from '../data/organization';

const getStoredDepartments = () => {
    try {
        const stored = localStorage.getItem('school_departments');
        return stored ? JSON.parse(stored) : DEPARTMENTS;
    } catch {
        return DEPARTMENTS;
    }
};

const saveDepartments = (departments) => {
    localStorage.setItem('school_departments', JSON.stringify(departments));
};

export const departmentService = {
    async getDepartments(params = {}) {
        try {
            const response = await api.get('/departments', { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total
            };
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 300));
            let departments = getStoredDepartments();
            
            if (params.search) {
                const search = params.search.toLowerCase();
                departments = departments.filter(d => 
                    d.name?.toLowerCase().includes(search) ||
                    d.description?.toLowerCase().includes(search)
                );
            }
            
            if (params.schoolId) {
                departments = departments.filter(d => d.schoolId === params.schoolId);
            }
            
            return { data: departments, total: departments.length };
        }
    },

    async getDepartment(id) {
        try {
            return await api.get(`/departments/${id}`);
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 200));
            return getStoredDepartments().find(d => d.id === id);
        }
    },

    async createDepartment(data) {
        try {
            return await api.post('/departments', data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const departments = getStoredDepartments();
            const newDepartment = {
                ...data,
                id: `d-${Date.now()}`,
                createdAt: new Date().toISOString()
            };
            saveDepartments([...departments, newDepartment]);
            return newDepartment;
        }
    },

    async updateDepartment(id, data) {
        try {
            return await api.put(`/departments/${id}`, data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const departments = getStoredDepartments();
            const updated = departments.map(d => d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d);
            saveDepartments(updated);
            return updated.find(d => d.id === id);
        }
    },

    async deleteDepartment(id) {
        try {
            return await api.delete(`/departments/${id}`);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const departments = getStoredDepartments();
            const filtered = departments.filter(d => d.id !== id);
            saveDepartments(filtered);
            return { success: true };
        }
    },

    async getDepartmentMembers(id, params = {}) {
        try {
            return await api.get(`/departments/${id}/members`, { params });
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const storedUsers = JSON.parse(localStorage.getItem('school_mgmt_users') || '[]');
            return storedUsers.filter(u => u.departmentId === id);
        }
    },

    async addMember(departmentId, userId, role = 'member') {
        try {
            return await api.post(`/departments/${departmentId}/members`, { userId, role });
        } catch (error) {
            return { success: true, departmentId, userId, role };
        }
    },

    async removeMember(departmentId, userId) {
        try {
            return await api.delete(`/departments/${departmentId}/members/${userId}`);
        } catch (error) {
            return { success: true };
        }
    },

    async updateMemberRole(departmentId, userId, role) {
        try {
            return await api.patch(`/departments/${departmentId}/members/${userId}`, { role });
        } catch (error) {
            return { success: true, role };
        }
    },

    async getDepartmentProjects(id, params = {}) {
        try {
            return await api.get(`/departments/${id}/projects`, { params });
        } catch (error) {
            return [];
        }
    },

    async getDepartmentTasks(id, params = {}) {
        try {
            return await api.get(`/departments/${id}/tasks`, { params });
        } catch (error) {
            return [];
        }
    },

    async getDepartmentStats(id) {
        try {
            return await api.get(`/departments/${id}/stats`);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return {
                memberCount: 12,
                projectCount: 5,
                taskCount: 28,
                completedTasks: 18,
                activeProjects: 3,
                budgetUsed: 65,
                performance: 88
            };
        }
    },

    async getDepartmentBudget(id) {
        try {
            return await api.get(`/departments/${id}/budget`);
        } catch (error) {
            return {
                allocated: 500000,
                spent: 325000,
                remaining: 175000
            };
        }
    },

    async updateBudget(id, data) {
        try {
            return await api.put(`/departments/${id}/budget`, data);
        } catch (error) {
            return { success: true, ...data };
        }
    },

    async getDepartmentResources(id) {
        try {
            return await api.get(`/departments/${id}/resources`);
        } catch (error) {
            return [];
        }
    },

    async addResource(departmentId, data) {
        try {
            return await api.post(`/departments/${departmentId}/resources`, data);
        } catch (error) {
            return { ...data, id: `r-${Date.now()}`, departmentId };
        }
    },

    async getDepartmentMeetings(id, params = {}) {
        try {
            return await api.get(`/departments/${id}/meetings`, { params });
        } catch (error) {
            return [];
        }
    },

    async createMeeting(departmentId, data) {
        try {
            return await api.post(`/departments/${departmentId}/meetings`, data);
        } catch (error) {
            return { ...data, id: `mtg-${Date.now()}`, departmentId };
        }
    },

    async getDepartmentAnnouncements(id) {
        try {
            return await api.get(`/departments/${id}/announcements`);
        } catch (error) {
            return [];
        }
    },

    async createAnnouncement(departmentId, data) {
        try {
            return await api.post(`/departments/${departmentId}/announcements`, data);
        } catch (error) {
            return { ...data, id: `ann-${Date.now()}`, departmentId, createdAt: new Date().toISOString() };
        }
    },

    async exportDepartment(id, format = 'pdf') {
        const response = await api.get(`/departments/${id}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    },

    getAllDepartments: () => getStoredDepartments(),
    saveAllDepartments: saveDepartments
};

export default departmentService;
