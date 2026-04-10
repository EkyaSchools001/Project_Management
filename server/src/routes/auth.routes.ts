import { Router } from 'express';
import {
    register,
    login,
    verify2FA,
    refresh,
    logout,
    logoutAll,
    forgotPassword,
    resetPassword,
    getMe,
    updateMe,
    changePassword,
    setup2FA,
    disable2FA,
    initiate2FASetup,
    initiate2FADisable,
    getSessions,
    revokeSession,
    googleOAuth,
    microsoftOAuth
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { loginRateLimiter, passwordResetRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);
router.post('/verify-2fa', verify2FA);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.post('/forgot-password', passwordResetRateLimiter, forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.post('/change-password', authenticate, changePassword);
router.get('/sessions', authenticate, getSessions);
router.delete('/sessions/:sessionId', authenticate, revokeSession);
router.post('/2fa/setup', authenticate, initiate2FASetup);
router.post('/2fa/verify-setup', authenticate, setup2FA);
router.post('/2fa/disable', authenticate, initiate2FADisable);
router.post('/2fa/confirm-disable', authenticate, disable2FA);
router.post('/google', googleOAuth);
router.post('/microsoft', microsoftOAuth);

export default router;
