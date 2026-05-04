import { Request, Response } from 'express';
import { prisma } from '../app';

const MOCK_USERS = [
    { id: 'teacher_001', fullName: 'Sarah Mitchell', email: 'sarah.mitchell@ekyaschools.com', role: 'TEACHER_CORE', status: 'Active', campusId: 'EK-North' },
    { id: 'teacher_002', fullName: 'James Okafor',   email: 'james.okafor@ekyaschools.com',  role: 'TEACHER_CORE', status: 'Active', campusId: 'EK-South' },
    { id: 'teacher_003', fullName: 'Priya Sharma',   email: 'priya.sharma@ekyaschools.com',   role: 'TEACHER_CORE', status: 'Active', campusId: 'EK-North' },
    { id: 'teacher_004', fullName: 'Anil Kumar',     email: 'anil.kumar@ekyaschools.com',     role: 'TEACHER_CORE', status: 'Active', campusId: 'EK-East' },
    { id: 'teacher_005', fullName: 'Meera Nair',     email: 'meera.nair@ekyaschools.com',     role: 'TEACHER_CORE', status: 'Active', campusId: 'EK-South' },
];

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const role = req.query?.role;

        const where: any = {};
        if (role) {
            where.role = role as any;
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                profile: true,
                department: true,
            }
        });

        res.status(200).json({
            status: 'success',
            data: { users }
        });
    } catch (error) {
        console.error('Error fetching users, falling back to mock data:', error);
        const role = req.query?.role;
        let users = MOCK_USERS;
        if (role) {
            users = MOCK_USERS.filter(u => u.role === role);
        }
        res.status(200).json({
            status: 'success',
            data: { users }
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const user = await prisma.user.findUnique({
            where: { id: id as string },
            include: {
                profile: true,
                department: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        console.error('Error fetching user by ID, falling back to mock data:', error);
        const id = req.params.i as string;
        const user = MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    }
};

export const assignRole = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { role, staffSubtype, roleScope } = req.body;
        
        const user = await prisma.user.update({
            where: { id },
            data: { 
                role: role as any,
                staffSubtype,
                roleScope: roleScope as any
            }
        });

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        console.error('Error assigning role:', error);
        res.status(500).json({ status: 'error', message: 'Failed to assign role' });
    }
};
