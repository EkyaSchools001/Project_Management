import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../app';
import { getIO } from '../../socket';
import { createNotification } from './notificationController';

export const getAnnouncements = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role?.toUpperCase() || '';
        const userCampusId = req.user?.campusId;
        const userDepartment = req.user?.department;

        const isAdmin = ['ADMIN', 'SUPERADMIN', 'MANAGEMENT'].includes(userRole);

        // Fetch announcements. Admins see all. Others see Published or their own.
        const announcements = await prisma.pDIAnnouncement.findMany({
            where: isAdmin ? {} : {
                OR: [
                    { status: 'Published' },
                    { createdById: userId }
                ]
            },
            include: {
                createdBy: {
                    select: {
                        fullName: true,
                        role: true
                    }
                },
                acknowledgements: {
                    where: {
                        userId: userId
                    }
                }
            },
            orderBy: [
                { isPinned: 'desc' },
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        // Filter based on Target Roles, Campuses, and Departments in memory for accuracy

        const filteredAnnouncements = announcements.filter((a: any) => {
            // Creators always see their own, and admins see everything
            if (a.createdById === userId || isAdmin) return true;

            const safeParseArr = (val: string | null) => { try { return JSON.parse(val || '[]'); } catch (e) { return []; } };
            const targetRoles = safeParseArr(a.targetRoles);
            const targetCampuses = safeParseArr(a.targetCampuses);
            const targetDepartments = safeParseArr(a.targetDepartments);

            const roleMatch = targetRoles.length === 0 || targetRoles.includes(userRole);
            const campusMatch = targetCampuses.length === 0 || targetCampuses.includes(userCampusId) || targetCampuses.includes('ALL');
            const deptMatch = targetDepartments.length === 0 || targetDepartments.includes(userDepartment) || targetDepartments.includes('ALL');

            return roleMatch && campusMatch && deptMatch;
        });

        // Map to include a simple "isAcknowledged" flag
        const mappedAnnouncements = filteredAnnouncements.map((a: any) => ({
            ...a,
            isAcknowledged: a.acknowledgements.length > 0,
            acknowledgements: undefined // Don't send the full array
        }));

        res.status(200).json({
            status: 'success',
            data: mappedAnnouncements
        });
    } catch (err) {
        next(err);
    }
};

export const createAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, priority, targetRoles, targetDepartments, targetCampuses, expiryDate, status } = req.body;
        const userId = req.user?.id;
        const userRole = req.user?.role || '';

        if (!userId) {
            return next(new AppError('User not authenticated', 401));
        }

        const announcement = await prisma.pDIAnnouncement.create({
            data: {
                title,
                description,
                priority: priority || 'Normal',
                status: status || 'Published',
                isPinned: req.body.isPinned || false,
                targetRoles: Array.isArray(targetRoles) ? JSON.stringify(targetRoles) : targetRoles || '[]',
                targetDepartments: Array.isArray(targetDepartments) ? JSON.stringify(targetDepartments) : targetDepartments || '[]',
                targetCampuses: Array.isArray(targetCampuses) ? JSON.stringify(targetCampuses) : targetCampuses || '[]',
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                createdById: userId,
                role: userRole
            },
            include: {
                createdBy: {
                    select: {
                        fullName: true,
                        role: true
                    }
                }
            }
        });

        // If published, notify users
        if (announcement.status === 'Published') {
            const io = getIO();
            const parsedRoles = Array.isArray(targetRoles) ? targetRoles : JSON.parse(targetRoles || '[]');
            const parsedCampuses = Array.isArray(targetCampuses) ? targetCampuses : JSON.parse(targetCampuses || '[]');
            const parsedDepts = Array.isArray(targetDepartments) ? targetDepartments : JSON.parse(targetDepartments || '[]');

            if (parsedCampuses.includes('ALL')) {
                io.emit('announcement:new', announcement);
            } else {
                parsedCampuses.forEach((campusId: string) => {
                    io.to(`campus:${campusId}`).emit('announcement:new', announcement);
                });
                // Also notify the creator
                io.to(`user:${userId}`).emit('announcement:new', announcement);
            }

            // Create individual notifications for the targeted users
            // Determine targeting filters
            const userFilters: any[] = [];
            if (parsedRoles.length > 0) userFilters.push({ role: { in: parsedRoles } });
            if (parsedCampuses.length > 0 && !parsedCampuses.includes('ALL')) userFilters.push({ campusId: { in: parsedCampuses } });
            if (parsedDepts.length > 0 && !parsedDepts.includes('ALL')) userFilters.push({ department: { in: parsedDepts } });

            // Fetch target users
            const targetUsers = await prisma.user.findMany({
                where: userFilters.length > 0 ? { AND: userFilters } : {}
            });

            // Create notifications in background
            targetUsers.forEach(user => {
                if (user.id !== userId) { // Don't notify the creator
                    createNotification({
                        userId: user.id,
                        title: `New Announcement: ${title}`,
                        message: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
                        type: priority === 'High' ? 'WARNING' : 'INFO',
                        link: '/announcements'
                    });
                }
            });
        }

        res.status(201).json({
            status: 'success',
            data: announcement
        });
    } catch (err) {
        next(err);
    }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role?.toUpperCase() || '';

        const existing = await prisma.pDIAnnouncement.findUnique({
            where: { id: id as string }
        });

        if (!existing) {
            return next(new AppError('Announcement not found', 404));
        }

        // RBAC Check: Only creator or high roles can edit
        const isCreator = existing.createdById === userId;
        const isAdmin = ['ADMIN', 'SUPERADMIN', 'MANAGEMENT'].includes(userRole);

        if (!isCreator && !isAdmin) {
            return next(new AppError('You do not have permission to edit this announcement', 403));
        }

        const updated = await prisma.pDIAnnouncement.update({
            where: { id: id as string },
            data: {
                ...req.body,
                updatedAt: new Date()
            },
            include: {
                createdBy: {
                    select: {
                        fullName: true,
                        role: true
                    }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            data: updated
        });

        getIO().emit('announcement:updated', updated);
    } catch (err) {
        next(err);
    }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role?.toUpperCase() || '';

        const existing = await prisma.pDIAnnouncement.findUnique({
            where: { id: id as string }
        });

        if (!existing) {
            return next(new AppError('Announcement not found', 404));
        }

        // RBAC Check
        const isCreator = existing.createdById === userId;
        const isAdmin = ['ADMIN', 'SUPERADMIN', 'MANAGEMENT'].includes(userRole);

        // Management can delete anything except PDI (system) if we had that logic
        // For now, creators and admins/management can delete.
        if (!isCreator && !isAdmin) {
            return next(new AppError('You do not have permission to delete this announcement', 403));
        }

        await prisma.pDIAnnouncement.delete({
            where: { id: id as string }
        });

        res.status(204).json({
            status: 'success',
            data: null
        });

        getIO().emit('announcement:deleted', { id });
    } catch (err) {
        next(err);
    }
};

export const acknowledgeAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) return next(new AppError('User not authenticated', 401));

        // Create acknowledgement only if it doesn't exist
        const ack = await prisma.pDIAnnouncementAcknowledgement.upsert({
            where: {
                announcementId_userId: {
                    announcementId: id as string,
                    userId: userId as string
                }
            },
            update: {
                acknowledgedAt: new Date()
            },
            create: {
                announcementId: id as string,
                userId: userId as string
            }
        });

        res.status(200).json({
            status: 'success',
            data: ack
        });

        getIO().emit('announcement:acknowledged', { announcementId: id, userId });
    } catch (err) {
        next(err);
    }
};

export const getAnnouncementStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const announcement = await prisma.pDIAnnouncement.findUnique({
            where: { id: id as string },
            include: {
                acknowledgements: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                role: true,
                                campusId: true
                            }
                        }
                    }
                }
            }
        });

        if (!announcement) {
            return next(new AppError('Announcement not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                count: (announcement as any).acknowledgements.length,
                users: (announcement as any).acknowledgements.map((ack: any) => ack.user)
            }
        });
    } catch (err) {
        next(err);
    }
};
