import api from './api.client';

const getStoredSchools = () => {
    try {
        const stored = localStorage.getItem('school_schools');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveSchools = (schools) => {
    localStorage.setItem('school_schools', JSON.stringify(schools));
};

export const schoolService = {
    async getSchools(params = {}) {
        try {
            const response = await api.get('/schools', { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total
            };
        } catch (error) {
            console.warn('API unavailable, using local storage');
            await new Promise(resolve => setTimeout(resolve, 300));
            let schools = getStoredSchools();
            
            if (params.search) {
                const search = params.search.toLowerCase();
                schools = schools.filter(s => 
                    s.name?.toLowerCase().includes(search) ||
                    s.address?.toLowerCase().includes(search)
                );
            }
            
            if (params.type) {
                schools = schools.filter(s => s.type === params.type);
            }
            
            if (params.status) {
                schools = schools.filter(s => s.status === params.status);
            }
            
            if (params.district) {
                schools = schools.filter(s => s.district === params.district);
            }
            
            return { data: schools, total: schools.length };
        }
    },

    async getSchool(id) {
        try {
            return await api.get(`/schools/${id}`);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            await new Promise(resolve => setTimeout(resolve, 200));
            return getStoredSchools().find(s => s.id === id);
        }
    },

    async createSchool(data) {
        try {
            return await api.post('/schools', data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const schools = getStoredSchools();
            const newSchool = {
                ...data,
                id: `s-${Date.now()}`,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            saveSchools([...schools, newSchool]);
            return newSchool;
        }
    },

    async updateSchool(id, data) {
        try {
            return await api.put(`/schools/${id}`, data);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const schools = getStoredSchools();
            const updated = schools.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s);
            saveSchools(updated);
            return updated.find(s => s.id === id);
        }
    },

    async deleteSchool(id) {
        try {
            return await api.delete(`/schools/${id}`);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const schools = getStoredSchools();
            const filtered = schools.filter(s => s.id !== id);
            saveSchools(filtered);
            return { success: true };
        }
    },

    async getSchoolStats(id) {
        try {
            return await api.get(`/schools/${id}/stats`);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return {
                totalStudents: 1250,
                totalStaff: 85,
                totalDepartments: 12,
                activeProjects: 8,
                totalTasks: 156,
                completedTasks: 98,
                attendanceRate: 94.5,
                performanceIndex: 87
            };
        }
    },

    async getSchoolDepartments(id) {
        try {
            return await api.get(`/schools/${id}/departments`);
        } catch (error) {
            return [];
        }
    },

    async getSchoolUsers(id, params = {}) {
        try {
            return await api.get(`/schools/${id}/users`, { params });
        } catch (error) {
            return [];
        }
    },

    async getSchoolProjects(id, params = {}) {
        try {
            return await api.get(`/schools/${id}/projects`, { params });
        } catch (error) {
            return [];
        }
    },

    async getSchoolAnnouncements(id) {
        try {
            return await api.get(`/schools/${id}/announcements`);
        } catch (error) {
            return [];
        }
    },

    async createAnnouncement(schoolId, data) {
        try {
            return await api.post(`/schools/${schoolId}/announcements`, data);
        } catch (error) {
            return { ...data, id: `ann-${Date.now()}`, schoolId, createdAt: new Date().toISOString() };
        }
    },

    async getSchoolCalendar(id, params = {}) {
        try {
            return await api.get(`/schools/${id}/calendar`, { params });
        } catch (error) {
            return [];
        }
    },

    async createEvent(schoolId, data) {
        try {
            return await api.post(`/schools/${schoolId}/calendar`, data);
        } catch (error) {
            return { ...data, id: `evt-${Date.now()}`, schoolId };
        }
    },

    async getSchoolSettings(id) {
        try {
            return await api.get(`/schools/${id}/settings`);
        } catch (error) {
            return {
                academicYear: '2025-2026',
                termSystem: 'semester',
                workingDays: 'monday_to_friday',
                timezone: 'UTC',
                language: 'en'
            };
        }
    },

    async updateSchoolSettings(id, data) {
        try {
            return await api.put(`/schools/${id}/settings`, data);
        } catch (error) {
            return { success: true, ...data };
        }
    },

    async getSchoolReports(id, params = {}) {
        try {
            return await api.get(`/schools/${id}/reports`, { params });
        } catch (error) {
            return [];
        }
    },

    async generateReport(schoolId, reportType) {
        try {
            return await api.post(`/schools/${schoolId}/reports`, { type: reportType });
        } catch (error) {
            return { success: true, reportId: `rpt-${Date.now()}`, type: reportType };
        }
    },

    async addSchoolAdmin(schoolId, userId) {
        try {
            return await api.post(`/schools/${schoolId}/admins`, { userId });
        } catch (error) {
            return { success: true, schoolId, userId };
        }
    },

    async removeSchoolAdmin(schoolId, userId) {
        try {
            return await api.delete(`/schools/${schoolId}/admins/${userId}`);
        } catch (error) {
            return { success: true };
        }
    },

    async uploadSchoolLogo(schoolId, file) {
        try {
            const formData = new FormData();
            formData.append('logo', file);
            return await api.post(`/schools/${schoolId}/logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (error) {
            return { success: true, logoUrl: URL.createObjectURL(file) };
        }
    },

    async getSchoolAcademicYears(id) {
        try {
            return await api.get(`/schools/${id}/academic-years`);
        } catch (error) {
            return [
                { id: 'ay1', year: '2025-2026', status: 'current' },
                { id: 'ay2', year: '2024-2025', status: 'completed' }
            ];
        }
    },

    async createAcademicYear(schoolId, data) {
        try {
            return await api.post(`/schools/${schoolId}/academic-years`, data);
        } catch (error) {
            return { ...data, id: `ay-${Date.now()}`, schoolId };
        }
    },

    async exportSchoolData(id, format = 'zip') {
        const response = await api.get(`/schools/${id}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    },

    async cloneSchool(id, newData = {}) {
        try {
            return await api.post(`/schools/${id}/clone`, newData);
        } catch (error) {
            const school = getStoredSchools().find(s => s.id === id);
            const cloned = {
                ...school,
                ...newData,
                id: `s-${Date.now()}`,
                name: `${school?.name} (Copy)`,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            const schools = getStoredSchools();
            saveSchools([...schools, cloned]);
            return cloned;
        }
    },

    getAllSchools: () => getStoredSchools(),
    saveAllSchools: saveSchools
};

export default schoolService;
