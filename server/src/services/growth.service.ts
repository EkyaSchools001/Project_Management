import { prisma } from '../app';

export const GrowthService = {
    async getMetrics(userId: string, role?: string, targetUserId?: string) {
        let whereClause: any = {};

        if (role === 'SuperAdmin') {
            if (targetUserId) {
                // SuperAdmin viewing specific user
                whereClause = { profileId: targetUserId };
            } else {
                // SuperAdmin viewing ALL metrics (global overview)
                whereClause = {};
            }
        } else {
            // Standard user can only see their own metrics
            whereClause = { profileId: userId };
        }

        return await prisma.growthMetric.findMany({
            where: whereClause,
            include: {
                profile: {
                    select: { id: true, name: true, avatarUrl: true, department: true }
                }
            },
            orderBy: { date: 'desc' },
            take: 100
        });
    },

    async createMetric(userId: string, data: { metricType: string; value: number }) {
        return await prisma.growthMetric.create({
            data: {
                ...data,
                profileId: userId
            }
        });
    },

    async getTeamMetrics(managerId: string) {
        const manager = await prisma.profile.findUnique({
            where: { id: managerId },
            select: { departmentId: true }
        });

        if (!manager || !manager.departmentId) return [];

        return await prisma.growthMetric.findMany({
            where: {
                profile: {
                    departmentId: manager.departmentId
                }
            },
            include: {
                profile: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            },
            orderBy: { date: 'desc' }
        });
    }
};
