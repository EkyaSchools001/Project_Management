import { Request, Response, NextFunction } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { AppError } from '../../infrastructure/utils/AppError';

// Format user role safely inside controller context
function normalizeRole(raw: string): string {
    if (!raw) return 'TEACHER';
    let role = raw.toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    if (role.includes('SCHOOL LEADER') || role === 'LEADER') return 'LEADER';
    if (role.includes('MANAGEMENT') || role === 'MANAGEMENT') return 'MANAGEMENT';
    if (role.includes('TEACHER') || role === 'TEACHER') return 'TEACHER';
    if (role.includes('ADMIN') || role.includes('ELC') || role.includes('PDI')) {
        if (role !== 'SUPERADMIN') return 'ADMIN';
    }
    if (role === 'SUPERADMIN') return 'SUPERADMIN';
    return 'TEACHER';
}

// Check if user has global read/write access to PTIL
function hasGlobalAccess(role: string): boolean {
    return ['LEADER', 'MANAGEMENT', 'ADMIN', 'SUPERADMIN'].includes(role);
}

export const createPTILRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = normalizeRole((req as any).user?.role || '');

        if (!userId) {
            return next(new AppError('Not authenticated', 401));
        }

        const data = req.body;

        let finalTeacherId = data.teacherId;
        let finalTeacherEmail = data.teacherEmail;

        if (!finalTeacherId && finalTeacherEmail) {
            const userMatch = await prisma.user.findUnique({ where: { email: finalTeacherEmail } });
            if (userMatch) {
                finalTeacherId = userMatch.id;
            }
        }
        
        if (!finalTeacherId) {
            finalTeacherId = userId;
        }
        
        if (!finalTeacherEmail) {
            const userMatch = await prisma.user.findUnique({ where: { id: finalTeacherId } });
            finalTeacherEmail = userMatch?.email || '';
        }

        // Verify teacher exists. If the initial check fails, try to resolve via email
        let teacherExists = await prisma.user.findUnique({ where: { id: finalTeacherId } });
        
        if (!teacherExists && finalTeacherEmail) {
            const userByEmail = await prisma.user.findUnique({ where: { email: finalTeacherEmail } });
            if (userByEmail) {
                teacherExists = userByEmail;
                finalTeacherId = userByEmail.id;
            }
        }

        if (!teacherExists) {
            return next(new AppError('Invalid teacher specified. Cannot create record.', 400));
        }

        const record = await prisma.pTIL_Record.create({
            data: {
                meetingRequestedBy: data.meetingRequestedBy,
                meetingDate: new Date(data.meetingDate),
                meetingTime: data.meetingTime,
                parentName: data.parentName,
                parentEmail: data.parentEmail,
                team: data.team,
                teacherId: finalTeacherId,
                teacherEmail: finalTeacherEmail,
                multipleAttendees: data.multipleAttendees,
                grade: data.grade,
                studentName: data.studentName,
                concernCategory: data.concernCategory,
                concernIssue: data.concernIssue,
                remarks: data.remarks || null,
                status: data.status || 'IN_PROGRESS',
                informationPassedTo: JSON.stringify(data.informationPassedTo || []),
            }
        });

        // Mock Notification Logic
        console.log(`[NOTIFICATION simulated] Email dispatched to Parent (${data.parentEmail}) and Teacher (${data.teacherEmail}) regarding PTIL #${record.id}`);
        const passedTo = data.informationPassedTo || [];
        if (passedTo.length > 0) {
            console.log(`[NOTIFICATION simulated] Information Passed To triggers sent to: ${passedTo.join(', ')}`);
        }

        res.status(201).json({
            status: 'success',
            data: { record }
        });
    } catch (err) {
        next(err);
    }
};

export const createPublicPTILRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        if (!data.teacherEmail) {
            return next(new AppError('Teacher email is required for public log submissions.', 400));
        }

        // Look up the teacher by email to get a valid UUID for the database
        const teacherUser = await prisma.user.findUnique({
            where: { email: data.teacherEmail }
        });

        if (!teacherUser) {
            return next(new AppError(`No teacher found matching the email address: ${data.teacherEmail}`, 404));
        }

        const record = await prisma.pTIL_Record.create({
            data: {
                meetingRequestedBy: data.meetingRequestedBy,
                meetingDate: new Date(data.meetingDate),
                meetingTime: data.meetingTime,
                parentName: data.parentName,
                parentEmail: data.parentEmail,
                team: data.team,
                teacherId: teacherUser.id, // Use the dynamically resolved UUID
                teacherEmail: teacherUser.email,
                multipleAttendees: data.multipleAttendees,
                grade: data.grade,
                studentName: data.studentName,
                concernCategory: data.concernCategory,
                concernIssue: data.concernIssue,
                remarks: data.remarks || null,
                status: data.status || 'IN_PROGRESS',
                informationPassedTo: JSON.stringify(data.informationPassedTo || []),
            }
        });

        console.log(`[PUBLIC-PTIL] Interaction Logged Successfully by external source. ID: ${record.id}`);
        console.log(`[NOTIFICATION simulated] Email dispatched to Parent (${data.parentEmail}) and Teacher (${data.teacherEmail}) regarding Public PTIL #${record.id}`);

        res.status(201).json({
            status: 'success',
            data: { record }
        });
    } catch (err) {
        next(err);
    }
};

export const getPTILRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = normalizeRole((req as any).user?.role || '');

        if (!userId) {
            return next(new AppError('Not authenticated', 401));
        }

        const { status, grade, teacherId, search } = req.query;

        // Build where clause
        const where: any = {};

        // Enforcement: Teachers only see their own records unless they have global access
        if (!hasGlobalAccess(userRole)) {
            where.teacherId = userId;
        } else if (teacherId) {
            where.teacherId = String(teacherId);
        }

        if (status) where.status = String(status);
        if (grade) where.grade = String(grade);

        if (search) {
            where.OR = [
                { parentName: { contains: String(search) } },
                { studentName: { contains: String(search) } },
                { parentEmail: { contains: String(search) } }
            ];
        }

        const records = await prisma.pTIL_Record.findMany({
            where,
            orderBy: { meetingDate: 'desc' },
            include: { teacher: { select: { fullName: true } } }
        });

        res.status(200).json({
            status: 'success',
            results: records.length,
            data: { records }
        });
    } catch (err) {
        next(err);
    }
};

export const updatePTILRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = normalizeRole((req as any).user?.role || '');
        const recordId = String(req.params.id);

        if (!userId) {
            return next(new AppError('Not authenticated', 401));
        }

        const existing = await prisma.pTIL_Record.findUnique({ where: { id: recordId } });
        if (!existing) {
            return next(new AppError('Record not found', 404));
        }

        if (!hasGlobalAccess(userRole) && existing.teacherId !== userId) {
            return next(new AppError('You do not have permission to update this record.', 403));
        }

        const { status, remarks, teacherId, teacherEmail } = req.body;
        const updateData: any = {};
        if (status) updateData.status = status;
        if (remarks !== undefined) updateData.remarks = remarks;
        if (teacherId) updateData.teacherId = teacherId;
        if (teacherEmail) updateData.teacherEmail = teacherEmail;

        const record = await prisma.pTIL_Record.update({
            where: { id: recordId },
            data: updateData
        });

        res.status(200).json({
            status: 'success',
            data: { record }
        });
    } catch (err) {
        next(err);
    }
};

export const getPTILAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = normalizeRole((req as any).user?.role || '');

        if (!userId) return next(new AppError('Not authenticated', 401));

        // Teachers get analytics ONLY for their records. Leaders get for ALL (or filtered by campus if implemented).
        const baseWhere = hasGlobalAccess(userRole) ? {} : { teacherId: userId };

        const totalRecords = await prisma.pTIL_Record.count({ where: baseWhere });
        const resolvedCount = await prisma.pTIL_Record.count({ where: { ...baseWhere, status: 'RESOLVED' } });
        const unresolvedCount = await prisma.pTIL_Record.count({ where: { ...baseWhere, status: 'UNRESOLVED' } });
        const inProgressCount = await prisma.pTIL_Record.count({ where: { ...baseWhere, status: 'IN_PROGRESS' } });
        const parkedCount = await prisma.pTIL_Record.count({ where: { ...baseWhere, status: 'PARKED' } });

        // Group by category
        const categoryData = await prisma.pTIL_Record.groupBy({
            by: ['concernCategory'],
            where: baseWhere,
            _count: { concernCategory: true },
            orderBy: { _count: { concernCategory: 'desc' } },
            take: 5
        });

        // Group by grade
        const gradeData = await prisma.pTIL_Record.groupBy({
            by: ['grade'],
            where: baseWhere,
            _count: { grade: true }
        });

        res.status(200).json({
            status: 'success',
            data: {
                total: totalRecords,
                statusCounts: {
                    resolved: resolvedCount,
                    unresolved: unresolvedCount,
                    inProgress: inProgressCount,
                    parked: parkedCount
                },
                topCategories: categoryData.map(c => ({
                    category: c.concernCategory,
                    count: c._count.concernCategory
                })),
                gradeDistribution: gradeData.map(g => ({
                    grade: g.grade,
                    count: g._count.grade
                }))
            }
        });
    } catch (err) {
        next(err);
    }
};
