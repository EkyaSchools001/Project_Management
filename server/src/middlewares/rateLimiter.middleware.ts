import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';

interface RateLimitEntry {
    count: number;
    firstAttempt: number;
    lastAttempt: number;
    blockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_HOUR = 20;

const cleanupOldEntries = () => {
    const now = Date.now();
    for (const [key, entry] of loginAttempts.entries()) {
        if (now - entry.firstAttempt > WINDOW_MS * 2) {
            loginAttempts.delete(key);
        }
    }
};

setInterval(cleanupOldEntries, 5 * 60 * 1000);

export const loginRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const email = req.body?.email?.toLowerCase();
    const key = email ? `${ip}:${email}` : ip;

    const now = Date.now();
    let entry = loginAttempts.get(key);

    if (!entry) {
        entry = { count: 0, firstAttempt: now, lastAttempt: now };
        loginAttempts.set(key, entry);
    }

    if (entry.blockedUntil && now < entry.blockedUntil) {
        const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000);
        return res.status(429).json({
            error: 'Too many login attempts',
            code: 'RATE_LIMITED',
            retryAfter: remainingMinutes,
            message: `Please try again in ${remainingMinutes} minutes`
        });
    }

    if (now - entry.firstAttempt > WINDOW_MS) {
        entry.count = 0;
        entry.firstAttempt = now;
        entry.blockedUntil = undefined;
    }

    entry.count++;
    entry.lastAttempt = now;

    if (entry.count > MAX_ATTEMPTS) {
        entry.blockedUntil = now + BLOCK_DURATION_MS;
        
        await prisma.auditLog.create({
            data: {
                userId: 'system',
                action: 'RATE_LIMIT_TRIGGERED',
                details: JSON.stringify({ ip, email, attempts: entry.count }),
                ipAddress: ip
            }
        }).catch(() => {});

        const remainingMinutes = Math.ceil(BLOCK_DURATION_MS / 60000);
        return res.status(429).json({
            error: 'Too many login attempts',
            code: 'RATE_LIMITED',
            retryAfter: remainingMinutes,
            message: `Account temporarily locked. Please try again in ${remainingMinutes} minutes`
        });
    }

    if (entry.count > 3) {
        res.setHeader('X-RateLimit-Limit', MAX_ATTEMPTS);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_ATTEMPTS - entry.count));
        res.setHeader('X-RateLimit-Reset', new Date(entry.firstAttempt + WINDOW_MS).toISOString());
    }

    next();
};

export const passwordResetRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const email = req.body?.email?.toLowerCase();
    const key = `password_reset:${email || ip}`;

    const now = Date.now();
    let entry = loginAttempts.get(key);

    if (!entry) {
        entry = { count: 0, firstAttempt: now, lastAttempt: now };
        loginAttempts.set(key, entry);
    }

    if (entry.blockedUntil && now < entry.blockedUntil) {
        const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000);
        return res.status(429).json({
            error: 'Too many password reset requests',
            code: 'RATE_LIMITED',
            retryAfter: remainingMinutes
        });
    }

    if (now - entry.firstAttempt > 60 * 60 * 1000) {
        entry.count = 0;
        entry.firstAttempt = now;
        entry.blockedUntil = undefined;
    }

    entry.count++;
    entry.lastAttempt = now;

    if (entry.count > 3) {
        entry.blockedUntil = now + 60 * 60 * 1000;
        return res.status(429).json({
            error: 'Too many password reset requests',
            code: 'RATE_LIMITED',
            retryAfter: 60
        });
    }

    next();
};

export const apiRateLimiter = (maxRequests = 100, windowMs = 60 * 1000) => {
    const requests = new Map<string, { count: number; resetAt: number }>();

    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        
        let entry = requests.get(ip);
        
        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
            requests.set(ip, entry);
        }

        entry.count++;

        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
        res.setHeader('X-RateLimit-Reset', new Date(entry.resetAt).toISOString());

        if (entry.count > maxRequests) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            res.setHeader('Retry-After', retryAfter);
            return res.status(429).json({
                error: 'Too many requests',
                code: 'RATE_LIMITED',
                retryAfter
            });
        }

        next();
    };
};

export const clearRateLimit = (key: string) => {
    loginAttempts.delete(key);
};
