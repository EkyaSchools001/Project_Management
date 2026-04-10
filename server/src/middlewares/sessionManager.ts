import { prisma } from '../app';
import { generateTokens } from './auth.middleware';

export interface CreateSessionOptions {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    deviceInfo?: string;
    rememberMe?: boolean;
}

export const createSession = async (options: CreateSessionOptions) => {
    const { userId, ipAddress, userAgent, deviceInfo, rememberMe } = options;

    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const refreshExpiresIn = rememberMe ? 90 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    const { accessToken, refreshToken } = generateTokens(userId, '');

    const session = await prisma.session.create({
        data: {
            userId,
            token: accessToken,
            refreshToken,
            expiresAt: new Date(Date.now() + expiresIn),
            refreshExpiresAt: new Date(Date.now() + refreshExpiresIn),
            ipAddress,
            userAgent,
            deviceInfo,
            isActive: true
        }
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(userId, session.id);

    await prisma.session.update({
        where: { id: session.id },
        data: {
            token: newAccessToken,
            refreshToken: newRefreshToken
        }
    });

    await prisma.profile.update({
        where: { userId },
        data: {
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress,
            failedLoginAttempts: 0,
            lockedUntil: null
        }
    }).catch(() => {});

    return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + expiresIn),
        refreshExpiresAt: new Date(Date.now() + refreshExpiresIn),
        sessionId: session.id
    };
};

export const refreshSession = async (refreshToken: string) => {
    const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: { include: { profile: { include: { overrides: true } } } } }
    });

    if (!session || !session.isActive) {
        throw new Error('Invalid refresh token');
    }

    if (new Date() > session.refreshExpiresAt) {
        await invalidateSession(session.id);
        throw new Error('Refresh token expired');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(session.userId, session.id);
    const expiresIn = 24 * 60 * 60 * 1000;

    await prisma.session.update({
        where: { id: session.id },
        data: {
            token: accessToken,
            refreshToken: newRefreshToken,
            expiresAt: new Date(Date.now() + expiresIn),
            refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    return {
        token: accessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + expiresIn),
        refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sessionId: session.id
    };
};

export const invalidateSession = async (sessionId: string) => {
    await prisma.session.update({
        where: { id: sessionId },
        data: { isActive: false }
    });
};

export const invalidateAllSessions = async (userId: string, exceptSessionId?: string) => {
    const where: any = { userId, isActive: true };
    if (exceptSessionId) {
        where.id = { not: exceptSessionId };
    }
    
    await prisma.session.updateMany({
        where,
        data: { isActive: false }
    });
};

export const getUserSessions = async (userId: string) => {
    const sessions = await prisma.session.findMany({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            deviceInfo: true,
            ipAddress: true,
            userAgent: true,
            createdAt: true,
            expiresAt: true,
            updatedAt: true
        }
    });

    return sessions.map(session => ({
        ...session,
        isCurrent: false,
        isExpired: new Date() > session.expiresAt
    }));
};

export const cleanupExpiredSessions = async () => {
    const result = await prisma.session.updateMany({
        where: {
            isActive: true,
            OR: [
                { expiresAt: { lt: new Date() } },
                { refreshExpiresAt: { lt: new Date() } }
            ]
        },
        data: { isActive: false }
    });

    console.log(`Cleaned up ${result.count} expired sessions`);
    return result.count;
};

export const recordFailedLogin = async (email: string, ipAddress?: string) => {
    try {
        const profile = await prisma.profile.findFirst({
            where: { user: { email: email.toLowerCase() } }
        });

        if (profile) {
            const failedAttempts = profile.failedLoginAttempts + 1;
            const updates: any = { failedLoginAttempts: failedAttempts };

            if (failedAttempts >= 5) {
                updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }

            await prisma.profile.update({
                where: { id: profile.id },
                data: updates
            });
        }
    } catch (error) {
        console.error('Error recording failed login:', error);
    }
};

setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
