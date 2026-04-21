// @ts-nocheck
import { prisma } from '../app';

export const PmsService = {
    // Project Methods
    async getProjects(userId: string, role?: string) {
        const whereClause: any = {};

        // If not SuperAdmin, restrict to user's department
        if (role !== 'SuperAdmin') {
            whereClause.department = {
                users: {
                    some: { id: userId }
                }
            };
        }

        return await prisma.project.findMany({
            where: whereClause,
            include: {
                tasks: true,
                department: true,
                manager: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async getProjectById(projectId: string, userId: string, role?: string) {
        const whereClause: any = { id: projectId };

        // If not SuperAdmin, must match user's department
        if (role !== 'SuperAdmin') {
            whereClause.department = {
                users: {
                    some: { id: userId }
                }
            };
        }

        const project = await prisma.project.findFirst({
            where: whereClause,
            include: {
                tasks: {
                    include: {
                        assignee: {
                            select: { 
                                id: true, 
                                name: true, 
                                profile: { select: { avatarUrl: true } } 
                            }
                        }
                    }
                },
                department: true,
                manager: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                }
            }
        });
        return project;
    },

    async createProject(data: { name: string; description?: string; departmentId: string; managerId: string }) {
        return await prisma.project.create({
            data,
            include: { tasks: true }
        });
    },

    async updateProject(projectId: string, data: { name?: string; description?: string; status?: any }) {
        return await prisma.project.update({
            where: { id: projectId },
            data
        });
    },

    async deleteProject(projectId: string) {
        return await prisma.project.delete({
            where: { id: projectId }
        });
    },

    // Task Methods
    async getTasks(projectId: string) {
        return await prisma.task.findMany({
            where: { projectId },
            include: {
                assignee: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                },
                creator: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async getTaskById(taskId: string) {
        return await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: {
                    select: { id: true, name: true }
                },
                assignee: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                },
                creator: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                }
            }
        });
    },

    async createTask(data: { title: string; description?: string; projectId: string; assigneeId?: string; priority?: any; dueDate?: Date; creatorId: string }) {
        return await prisma.task.create({
            data,
            include: {
                assignee: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                }
            }
        });
    },

    async updateTask(taskId: string, data: { title?: string; description?: string; status?: any; priority?: any; dueDate?: Date; assigneeId?: string }) {
        return await prisma.task.update({
            where: { id: taskId },
            data,
            include: {
                assignee: {
                    select: { 
                        id: true, 
                        name: true, 
                        profile: { select: { avatarUrl: true } } 
                    }
                }
            }
        });
    },

    async deleteTask(taskId: string) {
        return await prisma.task.delete({
            where: { id: taskId }
        });
    },

    async getPmsStats(userId: string, role?: string) {
        // If SuperAdmin, return global stats
        if (role === 'SuperAdmin') {
            const projectsCount = await prisma.project.count();
            const tasksCount = await prisma.task.count();

            const tasksByStatus = await prisma.task.groupBy({
                by: ['status'],
                _count: { status: true }
            });

            return {
                totalProjects: projectsCount,
                totalTasks: tasksCount,
                tasksByStatus: tasksByStatus.map(t => ({ status: t.status, count: t._count.status }))
            };
        }

        // Standard user: restrict to department
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { department: true }
        });

        if (!user || !user.departmentId) {
            return { totalProjects: 0, totalTasks: 0, tasksByStatus: [] };
        }

        const projectsCount = await prisma.project.count({
            where: { departmentId: user.departmentId }
        });

        const tasksCount = await prisma.task.count({
            where: { project: { departmentId: user.departmentId } }
        });

        const tasksByStatus = await prisma.task.groupBy({
            by: ['status'],
            where: { project: { departmentId: user.departmentId } },
            _count: { status: true }
        });

        return {
            totalProjects: projectsCount,
            totalTasks: tasksCount,
            tasksByStatus: tasksByStatus.map(t => ({ status: t.status, count: t._count.status }))
        };
    }
};

