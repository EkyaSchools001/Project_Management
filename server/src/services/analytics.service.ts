import { prisma } from '../app';

export const AnalyticsService = {
    async getSystemSummary() {
        const [projectsCount, tasksCount, usersCount] = await Promise.all([
            prisma.project.count(),
            prisma.task.count(),
            prisma.profile.count()
        ]);

        return {
            projects: projectsCount,
            tasks: tasksCount,
            users: usersCount,
            systemHealth: "99.9%",
            upTime: "12 days" // In a real app, calculate this
        };
    },

    async getDepartmentDistribution() {
        return await prisma.department.findMany({
            include: {
                _count: {
                    select: { projects: true, users: true }
                }
            }
        });
    },

    async getRoleDistribution() {
        // Useful for SuperAdmins to see user breakdown
        const roles = await prisma.user.groupBy({
            by: ['role'],
            _count: { _all: true }
        });
        return roles.map(r => ({ role: r.role, count: r._count._all }));
    }
};
