import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const timeService = {
    async startTimer(userId: string, taskId: string, description?: string) {
        const existing = await prisma.activeTimer.findFirst({
            where: { userId }
        });

        if (existing) {
            await this.stopTimer(userId, existing.id);
        }

        const timer = await prisma.activeTimer.create({
            data: {
                userId,
                taskId,
                description: description || '',
                startTime: new Date()
            }
        });

        return timer;
    },

    async stopTimer(userId: string, timerId?: string) {
        let timer;
        
        if (timerId) {
            timer = await prisma.activeTimer.findUnique({ where: { id: timerId } });
        } else {
            timer = await prisma.activeTimer.findFirst({ where: { userId } });
        }

        if (!timer) {
            throw new Error('No active timer found');
        }

        const endTime = new Date();
        const duration = Math.round((endTime.getTime() - timer.startTime.getTime()) / 60000);

        const entry = await prisma.timeEntry.create({
            data: {
                taskId: timer.taskId,
                userId: timer.userId,
                description: timer.description,
                startTime: timer.startTime,
                endTime,
                duration,
                status: 'Pending'
            },
            include: {
                task: true,
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        await prisma.activeTimer.delete({ where: { id: timer.id } });

        return entry;
    },

    async getActiveTimer(userId: string) {
        const timer = await prisma.activeTimer.findFirst({
            where: { userId },
            include: {
                task: true
            }
        });

        if (!timer) return null;

        const elapsed = Math.round((Date.now() - timer.startTime.getTime()) / 1000);

        return {
            ...timer,
            elapsed,
            isRunning: true
        };
    },

    async getEntries(filters: {
        userId?: string;
        taskId?: string;
        projectId?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        billable?: boolean;
        page?: number;
        limit?: number;
    }) {
        const where: any = {};

        if (filters.userId) where.userId = filters.userId;
        if (filters.taskId) where.taskId = filters.taskId;
        if (filters.status) where.status = filters.status;
        if (filters.billable !== undefined) where.billable = filters.billable;

        if (filters.projectId) {
            where.task = { projectId: filters.projectId };
        }

        if (filters.startDate || filters.endDate) {
            where.startTime = {};
            if (filters.startDate) where.startTime.gte = new Date(filters.startDate);
            if (filters.endDate) where.startTime.lte = new Date(filters.endDate);
        }

        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const skip = (page - 1) * limit;

        const [entries, total] = await Promise.all([
            prisma.timeEntry.findMany({
                where,
                include: {
                    task: true,
                    user: {
                        select: { id: true, name: true, email: true }
                    },
                    approvedBy: {
                        select: { id: true, name: true }
                    }
                },
                orderBy: { startTime: 'desc' },
                skip,
                take: limit
            }),
            prisma.timeEntry.count({ where })
        ]);

        return { data: entries, total, page, limit };
    },

    async createEntry(data: {
        taskId: string;
        userId: string;
        description?: string;
        startTime: string;
        endTime?: string;
        duration?: number;
        billable?: boolean;
    }) {
        let duration = data.duration;
        let startTime = new Date(data.startTime);
        let endTime = data.endTime ? new Date(data.endTime) : undefined;

        if (!duration && startTime && endTime) {
            duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        }

        const entry = await prisma.timeEntry.create({
            data: {
                taskId: data.taskId,
                userId: data.userId,
                description: data.description || '',
                startTime,
                endTime,
                duration,
                billable: data.billable ?? true,
                status: 'Pending'
            },
            include: {
                task: true,
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        return entry;
    },

    async updateEntry(id: string, data: {
        description?: string;
        startTime?: string;
        endTime?: string;
        duration?: number;
        billable?: boolean;
        status?: string;
    }) {
        const updateData: any = { updatedAt: new Date() };

        if (data.description !== undefined) updateData.description = data.description;
        if (data.billable !== undefined) updateData.billable = data.billable;
        if (data.status !== undefined) updateData.status = data.status;

        if (data.duration !== undefined) {
            updateData.duration = data.duration;
        }

        if (data.startTime) {
            updateData.startTime = new Date(data.startTime);
        }

        if (data.endTime) {
            updateData.endTime = new Date(data.endTime);
        }

        if (data.startTime && data.endTime) {
            updateData.duration = Math.round(
                (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 60000
            );
        }

        const entry = await prisma.timeEntry.update({
            where: { id },
            data: updateData,
            include: {
                task: true,
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        return entry;
    },

    async deleteEntry(id: string) {
        await prisma.timeEntry.delete({ where: { id } });
        return { success: true };
    },

    async approveEntry(id: string, approvedById: string) {
        const entry = await prisma.timeEntry.update({
            where: { id },
            data: {
                status: 'Approved',
                approvedById
            },
            include: {
                task: true,
                user: { select: { id: true, name: true } },
                approvedBy: { select: { id: true, name: true } }
            }
        });

        return entry;
    },

    async getReport(userId: string, filters: {
        startDate?: string;
        endDate?: string;
        projectId?: string;
        taskId?: string;
    }) {
        const where: any = { userId };

        if (filters.projectId) {
            where.task = { projectId: filters.projectId };
        }

        if (filters.taskId) {
            where.taskId = filters.taskId;
        }

        if (filters.startDate || filters.endDate) {
            where.startTime = {};
            if (filters.startDate) where.startTime.gte = new Date(filters.startDate);
            if (filters.endDate) where.startTime.lte = new Date(filters.endDate);
        }

        const entries = await prisma.timeEntry.findMany({
            where,
            include: {
                task: {
                    include: { project: true }
                }
            }
        });

        const totalMinutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
        const billableMinutes = entries
            .filter(e => e.billable)
            .reduce((sum, e) => sum + (e.duration || 0), 0);

        const byTask: Record<string, { minutes: number; count: number; taskTitle: string }> = {};
        const byDate: Record<string, number> = {};
        const byProject: Record<string, { minutes: number; count: number }> = {};

        entries.forEach(entry => {
            const taskId = entry.taskId;
            const taskTitle = entry.task.title;
            const dateKey = entry.startTime.toISOString().split('T')[0];
            const projectId = entry.task.projectId;
            const duration = entry.duration || 0;

            if (!byTask[taskId]) {
                byTask[taskId] = { minutes: 0, count: 0, taskTitle };
            }
            byTask[taskId].minutes += duration;
            byTask[taskId].count++;

            if (!byDate[dateKey]) byDate[dateKey] = 0;
            byDate[dateKey] += duration;

            if (!byProject[projectId]) {
                byProject[projectId] = { minutes: 0, count: 0 };
            }
            byProject[projectId].minutes += duration;
            byProject[projectId].count++;
        });

        const uniqueDates = Object.keys(byDate).length;

        return {
            userId,
            period: filters,
            totalHours: Math.round(totalMinutes / 60 * 100) / 100,
            totalMinutes,
            billableHours: Math.round(billableMinutes / 60 * 100) / 100,
            nonBillableHours: Math.round((totalMinutes - billableMinutes) / 60 * 100) / 100,
            entryCount: entries.length,
            pendingCount: entries.filter(e => e.status === 'Pending').length,
            approvedCount: entries.filter(e => e.status === 'Approved').length,
            byTask,
            byDate,
            byProject,
            averageHoursPerDay: uniqueDates > 0 
                ? Math.round(totalMinutes / 60 / uniqueDates * 100) / 100 
                : 0
        };
    }
};

export default timeService;
