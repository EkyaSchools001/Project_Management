import api from './api.client';
import { MOCK_PROJECTS, MOCK_TASKS } from '../data/pmsData';
import { DEPARTMENTS } from '../data/organization';
import { MOCK_USERS } from '../data/users';
import { RECENT_ACTIVITY } from '../data/activity';

const getMockSummary = () => ({
    projects: MOCK_PROJECTS.length,
    tasks: MOCK_TASKS.length,
    users: MOCK_USERS.length,
    departments: DEPARTMENTS.length,
    systemHealth: '100%',
    efficiency: 92,
    uptime: 99.9,
    riskFactor: 'Low'
});

export const analyticsService = {
    async getSystemSummary() {
        try {
            return await api.get('/analytics/summary');
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return getMockSummary();
        }
    },

    async getProjectStats(id) {
        try {
            return await api.get(`/analytics/projects/${id}`);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const project = MOCK_PROJECTS.find(p => p.id === id);
            return {
                id,
                name: project?.name || 'Unknown Project',
                completion: project?.status === 'COMPLETED' ? 100 : 75,
                budgetUsed: 85,
                tasksCompleted: 12,
                tasksTotal: 18,
                teamSize: 5,
                daysRemaining: 45,
                health: 'Good',
                risks: 2,
                milestones: { completed: 3, total: 5 },
                budget: project?.budget || 0,
                spent: (project?.budget || 0) * 0.85
            };
        }
    },

    async getUserStats(id) {
        try {
            return await api.get(`/analytics/users/${id}`);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const user = MOCK_USERS.find(u => u.id === id);
            return {
                id,
                name: user?.name || 'Unknown User',
                tasksCompleted: 25,
                tasksInProgress: 5,
                tasksOverdue: 2,
                projectsInvolved: 3,
                hoursLogged: 156,
                productivity: 88,
                attendance: 95,
                performance: 'Good'
            };
        }
    },

    async getDepartmentStats(id) {
        try {
            return await api.get(`/analytics/departments/${id}`);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const dept = DEPARTMENTS.find(d => d.id === id);
            return {
                id,
                name: dept?.name || 'Unknown Department',
                memberCount: 12,
                projectCount: 5,
                taskCount: 28,
                completedTasks: 18,
                activeProjects: 3,
                budgetUsed: 65,
                performance: 88,
                averageProductivity: 85,
                topPerformers: ['user1', 'user2']
            };
        }
    },

    async getActivityLog(params = {}) {
        try {
            return await api.get('/analytics/activity', { params });
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            let activities = RECENT_ACTIVITY || [];
            
            if (params.userId) {
                activities = activities.filter(a => a.userId === params.userId);
            }
            
            if (params.action) {
                activities = activities.filter(a => a.action === params.action);
            }
            
            if (params.startDate) {
                activities = activities.filter(a => a.timestamp >= params.startDate);
            }
            
            if (params.endDate) {
                activities = activities.filter(a => a.timestamp <= params.endDate);
            }
            
            const page = params.page || 1;
            const limit = params.limit || 50;
            const start = (page - 1) * limit;
            
            return {
                data: activities.slice(start, start + limit),
                total: activities.length,
                page,
                limit
            };
        }
    },

    async getCustomReport(config = {}) {
        try {
            return await api.post('/analytics/reports/custom', config);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                id: `rpt-${Date.now()}`,
                ...config,
                generatedAt: new Date().toISOString(),
                data: {
                    summary: getMockSummary(),
                    trends: [],
                    insights: []
                }
            };
        }
    },

    async getDashboardMetrics() {
        try {
            return await api.get('/analytics/dashboard');
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return {
                overview: getMockSummary(),
                recentActivity: RECENT_ACTIVITY?.slice(0, 10) || [],
                pendingTasks: 15,
                upcomingDeadlines: 8,
                notifications: 12,
                messages: 5
            };
        }
    },

    async getTrendData(params = {}) {
        try {
            return await api.get('/analytics/trends', { params });
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    { label: 'Tasks Completed', data: [12, 19, 15, 25, 22, 30] },
                    { label: 'Projects Finished', data: [2, 3, 1, 4, 3, 5] }
                ]
            };
        }
    },

    async getPerformanceMetrics(params = {}) {
        try {
            return await api.get('/analytics/performance', { params });
        } catch (error) {
            return {
                overallScore: 87,
                categories: {
                    productivity: 90,
                    attendance: 95,
                    collaboration: 82,
                    quality: 85
                },
                comparison: {
                    thisMonth: 87,
                    lastMonth: 84,
                    trend: 'up'
                }
            };
        }
    },

    async getResourceUtilization() {
        try {
            return await api.get('/analytics/resources');
        } catch (error) {
            return {
                cpu: 45,
                memory: 62,
                storage: 38,
                bandwidth: 28,
                uptime: 99.9,
                incidents: 0
            };
        }
    },

    async getBudgetAnalytics(params = {}) {
        try {
            return await api.get('/analytics/budget', { params });
        } catch (error) {
            return {
                totalBudget: 5000000,
                allocated: 3250000,
                spent: 2100000,
                remaining: 2900000,
                byCategory: [
                    { category: 'Infrastructure', allocated: 1500000, spent: 800000 },
                    { category: 'Personnel', allocated: 2000000, spent: 1200000 },
                    { category: 'Operations', allocated: 1000000, spent: 400000 },
                    { category: 'Development', allocated: 500000, spent: 300000 }
                ],
                projections: {
                    endOfYear: 4500000,
                    variance: 500000
                }
            };
        }
    },

    async getAttendanceAnalytics(params = {}) {
        try {
            return await api.get('/analytics/attendance', { params });
        } catch (error) {
            return {
                overallRate: 94.5,
                byDepartment: [
                    { department: 'IT', rate: 96 },
                    { department: 'Academics', rate: 93 },
                    { department: 'Admin', rate: 95 }
                ],
                trends: [
                    { date: '2026-04-01', rate: 95 },
                    { date: '2026-04-02', rate: 94 },
                    { date: '2026-04-03', rate: 96 }
                ]
            };
        }
    },

    async exportReport(reportType, format = 'pdf', params = {}) {
        const response = await api.get(`/analytics/export/${reportType}`, {
            params: { format, ...params },
            responseType: 'blob'
        });
        return response.data;
    },

    async getRealTimeMetrics() {
        try {
            return await api.get('/analytics/realtime');
        } catch (error) {
            return {
                activeUsers: 24,
                onlineUsers: 18,
                currentTasks: 45,
                serverLoad: 35,
                apiCalls: 1250,
                errors: 0,
                responseTime: 120
            };
        }
    },

    async getScheduledReports() {
        try {
            return await api.get('/analytics/reports/scheduled');
        } catch (error) {
            return [
                { id: 'sr1', name: 'Weekly Summary', frequency: 'weekly', lastRun: '2026-04-07' },
                { id: 'sr2', name: 'Monthly Performance', frequency: 'monthly', lastRun: '2026-04-01' }
            ];
        }
    },

    async createScheduledReport(data) {
        try {
            return await api.post('/analytics/reports/scheduled', data);
        } catch (error) {
            return { ...data, id: `sr-${Date.now()}`, createdAt: new Date().toISOString() };
        }
    },

    async deleteScheduledReport(id) {
        try {
            return await api.delete(`/analytics/reports/scheduled/${id}`);
        } catch (error) {
            return { success: true };
        }
    }
};

export default analyticsService;
