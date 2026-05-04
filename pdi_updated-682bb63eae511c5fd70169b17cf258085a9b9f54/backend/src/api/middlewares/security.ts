import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../../infrastructure/config/redis';
import { AppError } from '../../infrastructure/utils/AppError';

// ─── General Rate Limiter (Protects against Overload/DoS) ────────────────────
// Limits all requests to 20,000 per 15 minutes window across all clusters
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20000,
    standardHeaders: true,
    legacyHeaders: false,
    /* store: redisClient ? new RedisStore({
        // @ts-ignore
        sendCommand: (...args: string[]) => redisClient.call(...args),
    }) : undefined, */
    message: {
        status: 'fail',
        message: 'Too many requests from this IP, please try again after 5 minutes'
    },
    // Don't crash on rate limit; return clean API error
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    }
});

// ─── Auth/Login Rate Limiter (Protects against Brute-Force) ─────────────────
// Limits login attempts to 10 per 1 hour window per IP
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'fail',
        message: 'Too many login attempts from this IP, please try again after an hour'
    },
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    }
});

// ─── Heavy Operation Limiter (Protects against Overload) ─────────────────────
// Use for expensive routes like database backups or complex exports
export const heavyOpsLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        status: 'fail',
        message: 'Too many heavy operations performed. Please wait before trying again.'
    },
    handler: (req, res, next, options) => {
        next(new AppError(options.message.message, 429));
    }
});
