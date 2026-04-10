import { Request, Response } from 'express';
import { prisma } from '../app';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;
        
        let where: any = {};
        if (role) {
            where.role = role as any;
        }

        const users = await prisma.profile.findMany({
            where,
            include: {
                department: true,
                school: true,
                overrides: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: { users }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching users.'
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.profile.findUnique({
            where: { id: id as string },
            include: {
                department: true,
                school: true,
                overrides: true
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
        console.error('Error fetching user by ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching user.'
        });
    }
};
