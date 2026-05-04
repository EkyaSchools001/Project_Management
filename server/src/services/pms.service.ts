import { prisma } from '../app';
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_PMS_STATS } from '../data/pms_mocks';
import { getScopeFilter } from '../utils/rbac.utils';

export const PmsService = {
    // Project Methods
    async getProjects(user: any) {
        const whereClause = getScopeFilter(user, 'project');

        try {
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
        } catch (error) {
            console.error('DB Error in getProjects, falling back to mocks:', error.message);
            return MOCK_PROJECTS;
        }
    },

    async getProjectById(projectId: string, user: any) {
        const scopeFilter = getScopeFilter(user, 'project');
        const whereClause: any = { id: projectId, ...scopeFilter };

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
    async getTasks(filters?: { projectId?: string; status?: any; assigneeId?: string }) {
        try {
            const whereClause: any = {};
            if (filters?.projectId) whereClause.projectId = filters.projectId;
            if (filters?.status) whereClause.status = filters.status;
            if (filters?.assigneeId) whereClause.assigneeId = filters.assigneeId;

            return await prisma.task.findMany({
                where: whereClause,
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
        } catch (error) {
            console.error('DB Error in getTasks, falling back to mocks:', error.message);
            let mocks = MOCK_TASKS;
            if (filters?.projectId) mocks = mocks.filter(t => t.projectId === filters.projectId);
            if (filters?.status) mocks = mocks.filter(t => t.status === filters.status);
            return mocks;
        }
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

    async getPmsStats(user: any) {
        try {
            const scopeFilter = getScopeFilter(user, 'project');
            
            // If SuperAdmin or Management, return global stats (with campus filter if applicable)
            if (user.role === 'SUPER_ADMIN' || user.role === 'MANAGEMENT') {
                const projectsCount = await prisma.project.count({ where: scopeFilter });
                const tasksCount = await prisma.task.count({ where: { project: scopeFilter } });

                const tasksByStatus = await prisma.task.groupBy({
                    by: ['status'],
                    where: { project: scopeFilter },
                    _count: { status: true }
                });

                return {
                    totalProjects: projectsCount,
                    totalTasks: tasksCount,
                    tasksByStatus: tasksByStatus.map(t => ({ status: t.status, count: t._count.status }))
                };
            }

            // Standard user scoping
            const projectsCount = await prisma.project.count({
                where: scopeFilter
            });

            const tasksCount = await prisma.task.count({
                where: { project: scopeFilter }
            });

            const tasksByStatus = await prisma.task.groupBy({
                by: ['status'],
                where: { project: scopeFilter },
                _count: { status: true }
            });

            return {
                totalProjects: projectsCount,
                totalTasks: tasksCount,
                tasksByStatus: tasksByStatus.map(t => ({ status: t.status, count: t._count.status }))
            };
        } catch (error) {
            console.error('DB Error in getPmsStats, falling back to mocks:', error.message);
            return MOCK_PMS_STATS;
        }
    }
};

