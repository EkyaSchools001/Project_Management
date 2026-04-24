import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

export interface AuthRequest extends Request {
    user?: any;
    sessionId?: string;
}

export interface JWTPayload {
    sub: string;
    sessionId?: string;
    iat?: number;
    exp?: number;
}

export const generateTokens = (userId: string, sessionId: string, role?: string) => {
    const jwtSecret = (process.env.JWT_SECRET || 'your-super-secret-key') as jwt.Secret;
    const jwtRefreshSecret = (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-super-secret-key-refresh') as jwt.Secret;

    const accessToken = jwt.sign(
        { sub: userId, sessionId, ...(role ? { role } : {}) },
        jwtSecret,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any }
    );

    const refreshToken = jwt.sign(
        { sub: userId, sessionId, type: 'refresh' },
        jwtRefreshSecret,
        { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any }
    );

    return { accessToken, refreshToken };
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Auth token missing' });
        }

        const token = authHeader.split(' ')[1];

        // --- Mock Token Support for Local Dev ---
        if (token.startsWith('mock-token-')) {
            const mockId = token.replace('mock-token-', '');
            // Simple mock user for local dev stability
            req.user = {
                id: mockId,
                email: 'mock@ekyaschools.com',
                name: 'Mock User',
                role: 'SuperAdmin', // Grant high privileges for dev
                status: 'Active',
                permissions: ['*'] // Allow everything
            };
            req.sessionId = 'mock-session-id';
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key') as JWTPayload;

            const session = await prisma.session.findUnique({
                where: { token },
                include: { user: { include: { profile: { include: { overrides: true } } } } }
            });

            if (!session || !session.isActive || new Date() > session.expiresAt) {
                return res.status(401).json({ error: 'Session expired or invalid' });
            }

            const user = session.user;
            if (user.status !== 'Active') {
                return res.status(401).json({ error: 'Account is not active' });
            }

            req.user = {
                ...user,
                permissions: user.profile?.overrides.map((o: any) => o.permission) || []
            };
            req.sessionId = session.id;
            next();
        } catch (jwtError) {
            if (jwtError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
            }
            if (jwtError instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            throw jwtError;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key') as JWTPayload;

            const session = await prisma.session.findUnique({
                where: { token },
                include: { user: { include: { profile: { include: { overrides: true } } } } }
            });

            if (session && session.isActive && new Date() <= session.expiresAt) {
                req.user = {
                    ...session.user,
                    permissions: session.user.profile?.overrides.map((o: any) => o.permission) || []
                };
                req.sessionId = session.id;
            }
        } catch {
            // Ignore JWT errors for optional auth
        }

        next();
    } catch (error) {
        next();
    }
};

export const authorize = (permissions: string | string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userPermissions = req.user.permissions || [];
        const required = Array.isArray(permissions) ? permissions : [permissions];

        if (req.user.role === 'SuperAdmin' || req.user.role === 'SUPER_ADMIN') {
            return next();
        }

        const hasPermission = required.every(p => userPermissions.includes(p));

        if (!hasPermission) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'SuperAdmin access required' });
    }

    next();
};

export const getCurrentUserId = (req: AuthRequest): string => {
    if (!req.user) {
        throw new Error('User not authenticated');
    }
    return req.user.id;
};
