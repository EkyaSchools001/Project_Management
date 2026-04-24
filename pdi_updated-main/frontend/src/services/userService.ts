import api from '@/lib/api';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    department?: string;
    campusId?: string;
    status: string;
    academics?: 'CORE' | 'NON_CORE';
    category?: 'IN_SERVICE' | 'NEW_JOINER';
}

export const userService = {
    async getAllUsers(role?: string) {
        try {
            const params = role ? { role } : {};
            const response = await api.get('/users', { params });
            console.log('UserService: API response', { status: response.data?.status, usersCount: response.data?.data?.users?.length });

            if (response.data?.status === 'success') {
                return response.data.data?.users || [];
            } else {
                console.warn('UserService: Non-success status:', response.data?.status);
                return [];
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            console.error('Error details:', error.response?.data || error.message);
            return []; // Return empty array instead of throwing
        }
    },

    async getTeachers() {
        const teachers = await this.getAllUsers('TEACHER');
        console.log('UserService: getTeachers returned', teachers?.length || 0, 'teachers');
        return teachers || [];
    },

    async getUserById(id: string) {
        try {
            const response = await api.get(`/users/${id}`);
            if (response.data?.status === 'success') {
                return response.data.data?.user || null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }
    }
};
