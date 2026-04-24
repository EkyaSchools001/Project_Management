import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../infrastructure/database/prisma';
import { AppError } from '../../infrastructure/utils/AppError';
import { loginSchema } from '../../core/models/schemas';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id: string, role: string, fullName: string, campusId?: string | null, department?: string | null, academics?: string | null) => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret === 'secret') {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET must be set in production environment.');
        }
        console.warn('⚠️ WARNING: Using insecure default JWT_SECRET. Set JWT_SECRET in .env for production.');
    }

    return jwt.sign({ id, role, fullName, campusId, department, academics }, (secret || 'secret') as Secret, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
    });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return next(new AppError('Invalid input data', 400));
        }

        const { email, password } = result.data;

        // 1) Find user
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.passwordHash || ''))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 2) Sign token
        const token = signToken(user.id, user.role, user.fullName, user.campusId, user.department, user.academics);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    campusId: user.campusId,
                    department: user.department,
                    academics: user.academics,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    // Logic for token refresh would go here
    res.status(200).json({ status: 'success', message: 'TBD' });
};

export const impersonate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        // Ensure user exists
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) {
            return next(new AppError('User not found', 404));
        }

        // Generate a new temporary token for that user
        const token = signToken(
            targetUser.id,
            targetUser.role,
            targetUser.fullName,
            targetUser.campusId,
            targetUser.department,
            targetUser.academics
        );

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: targetUser.id,
                    fullName: targetUser.fullName,
                    email: targetUser.email,
                    role: targetUser.role,
                    campusId: targetUser.campusId,
                    department: targetUser.department,
                    academics: targetUser.academics,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return next(new AppError('Access Token is required', 400));
        }

        // Verify the token by fetching user info from Google
        const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        
        if (!googleResponse.ok) {
            return next(new AppError('Invalid Google token', 401));
        }

        const payload: any = await googleResponse.json();
        
        if (!payload || !payload.email) {
            return next(new AppError('Invalid Google token response', 401));
        }

        const { email, name, picture } = payload;

        // 1) Find user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Option: Auto-register or error
            return next(new AppError(`User with email ${email} is not registered. Please contact your administrator.`, 401));
        }

        // 2) Sign token
        const token = signToken(user.id, user.role, user.fullName, user.campusId, user.department, user.academics);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    campusId: user.campusId,
                    department: user.department,
                    academics: user.academics,
                    avatarUrl: picture || user.profilePicture
                },
            },
        });
    } catch (err) {
        next(err);
    }
};
