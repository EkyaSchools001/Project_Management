import api from './api.client';
import { MOCK_USERS } from '../data/users';

const getStoredUsers = () => {
    try {
        const stored = localStorage.getItem('school_mgmt_users');
        return stored ? JSON.parse(stored) : MOCK_USERS;
    } catch {
        return MOCK_USERS;
    }
};

const saveUsers = (users) => {
    localStorage.setItem('school_mgmt_users', JSON.stringify(users));
};

export const userService = {
    async getUsers(params = {}) {
        try {
            const response = await api.get('/users', { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total,
                page: response.data.page,
                limit: response.data.limit
            };
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 300));
            let users = getStoredUsers();
            
            if (params.search) {
                const search = params.search.toLowerCase();
                users = users.filter(u => 
                    u.name?.toLowerCase().includes(search) ||
                    u.email?.toLowerCase().includes(search)
                );
            }
            
            if (params.role) {
                users = users.filter(u => u.role === params.role);
            }
            
            if (params.status) {
                users = users.filter(u => u.status === params.status);
            }
            
            const page = params.page || 1;
            const limit = params.limit || 20;
            const start = (page - 1) * limit;
            const paginatedUsers = users.slice(start, start + limit);
            
            return {
                data: paginatedUsers,
                total: users.length,
                page,
                limit
            };
        }
    },

    async getUser(id) {
        try {
            return await api.get(`/users/${id}`);
        } catch (error) {
            console.warn('API unavailable, using mock data');
            await new Promise(resolve => setTimeout(resolve, 200));
            return getStoredUsers().find(u => u.id === id);
        }
    },

    async createUser(data) {
        try {
            return await api.post('/users', data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const users = getStoredUsers();
            const newUser = {
                ...data,
                id: `u-${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'active'
            };
            saveUsers([...users, newUser]);
            return newUser;
        }
    },

    async updateUser(id, data) {
        try {
            return await api.put(`/users/${id}`, data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const users = getStoredUsers();
            const updated = users.map(u => u.id === id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u);
            saveUsers(updated);
            return updated.find(u => u.id === id);
        }
    },

    async deleteUser(id) {
        try {
            return await api.delete(`/users/${id}`);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const users = getStoredUsers();
            const filtered = users.filter(u => u.id !== id);
            saveUsers(filtered);
            return { success: true };
        }
    },

    async updateUserRole(id, role) {
        try {
            return await api.patch(`/users/${id}/role`, { role });
        } catch (error) {
            return this.updateUser(id, { role });
        }
    },

    async updateUserPermissions(id, permissions) {
        try {
            return await api.patch(`/users/${id}/permissions`, { permissions });
        } catch (error) {
            return this.updateUser(id, { permissions });
        }
    },

    async getProfile() {
        try {
            return await api.get('/auth/profile');
        } catch (error) {
            const userJson = localStorage.getItem('school_mgmt_user');
            return userJson ? JSON.parse(userJson) : null;
        }
    },

    async updateProfile(data) {
        try {
            return await api.put('/auth/profile', data);
        } catch (error) {
            const userJson = localStorage.getItem('school_mgmt_user');
            if (userJson) {
                const user = JSON.parse(userJson);
                const updated = { ...user, ...data };
                localStorage.setItem('school_mgmt_user', JSON.stringify(updated));
                return updated;
            }
            throw error;
        }
    },

    async changePassword(oldPassword, newPassword) {
        return await api.post('/auth/change-password', { oldPassword, newPassword });
    },

    async resetPassword(email) {
        return await api.post('/auth/reset-password', { email });
    },

    async verifyEmail(token) {
        return await api.post('/auth/verify-email', { token });
    },

    async getUsersByDepartment(departmentId) {
        try {
            return await api.get(`/departments/${departmentId}/users`);
        } catch (error) {
            const users = getStoredUsers();
            return users.filter(u => u.departmentId === departmentId);
        }
    },

    async bulkUpdateUsers(ids, data) {
        try {
            return await api.patch('/users/bulk', { ids, data });
        } catch (error) {
            const users = getStoredUsers();
            const updated = users.map(u => ids.includes(u.id) ? { ...u, ...data } : u);
            saveUsers(updated);
            return { success: true, updated: ids.length };
        }
    },

    async exportUsers(format = 'csv') {
        const response = await api.get('/users/export', { 
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    },

    getAllUsers: () => getStoredUsers(),
    saveAllUsers: saveUsers
};

export default userService;
