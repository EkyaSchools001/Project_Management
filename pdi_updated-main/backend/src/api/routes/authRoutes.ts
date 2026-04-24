import { Router } from 'express';
import { login, refresh, impersonate, googleLogin } from '../controllers/authController';
import { protect, restrictTo } from '../middlewares/auth';
import { authLimiter } from '../middlewares/security';

const router = Router();

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accessToken]
 *             properties:
 *               accessToken: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid Google token }
 */
router.post('/login', authLimiter, login);
router.post('/google-login', authLimiter, googleLogin);
router.post('/refresh', refresh);
router.post('/impersonate/:id', protect, restrictTo('SUPERADMIN'), impersonate as any);

export default router;
