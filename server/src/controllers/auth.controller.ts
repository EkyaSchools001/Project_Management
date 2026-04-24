import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../app';
import { AuthRequest, generateTokens } from '../middlewares/auth.middleware';
import { 
    createSession, 
    refreshSession, 
    invalidateSession, 
    invalidateAllSessions,
    recordFailedLogin,
    getUserSessions
} from '../middlewares/sessionManager';
import { sendPasswordResetEmail, sendTwoFactorCodeEmail, sendEmail } from '../services/email.service';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateProfileSchema
} from '../utils/validation.schemas';

const handleZodError = (error: z.ZodError) => {
    const errors = error.issues.map((err: z.ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message
    }));
    return { error: 'Validation failed', details: errors };
};

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { email, password, name, role } = validatedData;

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
                role: role || 'TeacherStaff',
                profile: {
                    create: {
                        firstName: name.split(' ')[0],
                        lastName: name.split(' ').slice(1).join(' ') || null
                    }
                }
            },
            include: { profile: true }
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'USER_REGISTERED',
                details: JSON.stringify({ email: user.email }),
                ipAddress: req.ip
            }
        });

        const session = await createSession({
            userId: user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            message: 'Registration successful',
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(handleZodError(error));
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password, rememberMe } = validatedData;

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: { profile: true }
        });

        console.log(`[LOGIN ATTEMPT] Email: ${email}, Found User: ${!!user}`);

        if (!user) {
            await recordFailedLogin(email, req.ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.profile?.lockedUntil && new Date() < user.profile.lockedUntil) {
            const remainingMinutes = Math.ceil((user.profile.lockedUntil.getTime() - Date.now()) / 60000);
            return res.status(423).json({
                error: 'Account is temporarily locked',
                code: 'ACCOUNT_LOCKED',
                retryAfter: remainingMinutes
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            await recordFailedLogin(email, req.ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.status !== 'Active') {
            return res.status(401).json({ error: 'Account is not active' });
        }

        if (user.profile?.twoFactorEnabled) {
            const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.twoFactorCode.create({
                data: {
                    userId: user.id,
                    code: twoFactorCode,
                    type: 'LOGIN',
                    expiresAt
                }
            });

            await sendTwoFactorCodeEmail(user.email, twoFactorCode, user.name);

            const tempToken = jwt.sign(
                { sub: user.id, type: '2fa_pending' },
                process.env.JWT_SECRET || 'your-super-secret-key',
                { expiresIn: '10m' }
            );

            return res.json({
                requires2FA: true,
                tempToken,
                message: 'Two-factor authentication code sent to your email'
            });
        }

        const session = await createSession({
            userId: user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            rememberMe
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'USER_LOGIN',
                ipAddress: req.ip
            }
        });

        res.json({
            message: 'Login successful',
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                profile: user.profile
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(handleZodError(error));
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

export const verify2FA = async (req: Request, res: Response) => {
    try {
        const { code, tempToken } = req.body;

        if (!tempToken) {
            return res.status(400).json({ error: 'Temporary token required' });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'your-super-secret-key');
        } catch {
            return res.status(401).json({ error: 'Invalid or expired temporary token' });
        }

        if (decoded.type !== '2fa_pending') {
            return res.status(401).json({ error: 'Invalid token type' });
        }

        const twoFactorRecord = await prisma.twoFactorCode.findFirst({
            where: {
                userId: decoded.sub,
                code,
                type: 'LOGIN',
                usedAt: null,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!twoFactorRecord) {
            return res.status(401).json({ error: 'Invalid or expired verification code' });
        }

        await prisma.twoFactorCode.update({
            where: { id: twoFactorRecord.id },
            data: { usedAt: new Date() }
        });

        const user = await prisma.user.findUnique({
            where: { id: decoded.sub },
            include: { profile: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const session = await createSession({
            userId: user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'USER_LOGIN_2FA',
                ipAddress: req.ip
            }
        });

        res.json({
            message: 'Login successful',
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ error: '2FA verification failed' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }

        const session = await refreshSession(refreshToken);

        res.json({
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        if (req.sessionId) {
            await invalidateSession(req.sessionId);
        }

        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: 'USER_LOGOUT',
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

export const logoutAll = async (req: AuthRequest, res: Response) => {
    try {
        await invalidateAllSessions(req.user?.id, req.sessionId);

        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: 'USER_LOGOUT_ALL',
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({ message: 'Logged out from all devices' });
    } catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({ error: 'Failed to logout from all devices' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = forgotPasswordSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return res.json({
                message: 'If the email exists, a password reset link has been sent'
            });
        }

        const resetToken = jwt.sign(
            { sub: user.id, type: 'password_reset' },
            process.env.JWT_SECRET || 'your-super-secret-key',
            { expiresIn: '1h' }
        );

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: resetToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            }
        });

        await sendPasswordResetEmail(user.email, resetToken, user.name);

        res.json({
            message: 'If the email exists, a password reset link has been sent'
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(handleZodError(error));
        }
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = resetPasswordSchema.parse(req.body);

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key');
        } catch {
            return res.status(401).json({ error: 'Invalid or expired reset token' });
        }

        if (decoded.type !== 'password_reset') {
            return res.status(401).json({ error: 'Invalid token type' });
        }

        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                token,
                userId: decoded.sub,
                usedAt: null,
                expiresAt: { gt: new Date() }
            }
        });

        if (!resetToken) {
            return res.status(401).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { id: decoded.sub },
            data: { password: hashedPassword }
        });

        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { usedAt: new Date() }
        });

        await invalidateAllSessions(decoded.sub);

        await prisma.auditLog.create({
            data: {
                userId: decoded.sub,
                action: 'PASSWORD_RESET',
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(handleZodError(error));
        }
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            include: {
                profile: {
                    include: {
                        overrides: true
                    }
                },
                department: true,
                school: true
            }
        });

        if (!user) {
            // Handle mock users in dev
            if (req.user?.id?.startsWith('u-') || req.user?.id === 'mock-id') {
                return res.json({
                    id: req.user.id,
                    email: req.user.email || 'mock@ekyaschools.com',
                    name: req.user.name || 'Mock User',
                    role: req.user.role || 'SuperAdmin',
                    status: 'Active',
                    permissions: ['*'],
                    profile: { firstName: 'Mock', lastName: 'User' }
                });
            }
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;

        res.json({
            ...userWithoutPassword,
            permissions: user.profile?.overrides.map((o: any) => o.permission) || []
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
    try {
        const validatedData = updateProfileSchema.parse(req.body);

        const profile = await prisma.profile.update({
            where: { userId: req.user?.id },
            data: validatedData,
            include: {
                user: true,
                overrides: true
            }
        });

        const { password, ...userWithoutPassword } = profile.user;

        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: 'PROFILE_UPDATED',
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({
            ...profile,
            user: userWithoutPassword,
            permissions: profile.overrides.map((o: any) => o.permission)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(handleZodError(error));
        }
        console.error('Update me error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const validatedData = changePasswordSchema.parse(req.body);
        const { currentPassword, newPassword } = validatedData;

        const user = await prisma.user.findUnique({
            where: { id: req.user?.id }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: req.user?.id },
            data: { password: hashedPassword }
        });

        await invalidateAllSessions(req.user?.id, req.sessionId);

        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: 'PASSWORD_CHANGED',
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(handleZodError(error));
        }
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

export const setup2FA = async (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            include: { profile: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.profile?.twoFactorEnabled) {
            return res.status(400).json({ error: '2FA is already enabled' });
        }

        const twoFactorRecord = await prisma.twoFactorCode.findFirst({
            where: {
                userId: req.user?.id,
                code,
                type: 'SETUP',
                usedAt: null,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!twoFactorRecord) {
            return res.status(401).json({ error: 'Invalid or expired verification code' });
        }

        await prisma.twoFactorCode.update({
            where: { id: twoFactorRecord.id },
            data: { usedAt: new Date() }
        });

        await prisma.profile.update({
            where: { userId: req.user?.id },
            data: { twoFactorEnabled: true }
        });

        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: '2FA_ENABLED',
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({
            message: 'Two-factor authentication enabled successfully'
        });
    } catch (error) {
        console.error('2FA setup error:', error);
        res.status(500).json({ error: 'Failed to setup 2FA' });
    }
};

export const disable2FA = async (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            include: { profile: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.profile?.twoFactorEnabled) {
            return res.status(400).json({ error: '2FA is not enabled' });
        }

        const twoFactorRecord = await prisma.twoFactorCode.findFirst({
            where: {
                userId: req.user?.id,
                code,
                type: 'DISABLE',
                usedAt: null,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!twoFactorRecord) {
            return res.status(401).json({ error: 'Invalid or expired verification code' });
        }

        await prisma.twoFactorCode.update({
            where: { id: twoFactorRecord.id },
            data: { usedAt: new Date() }
        });

        await prisma.profile.update({
            where: { userId: req.user?.id },
            data: { 
                twoFactorEnabled: false,
                twoFactorSecret: null
            }
        });

        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: '2FA_DISABLED',
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({
            message: 'Two-factor authentication disabled successfully'
        });
    } catch (error) {
        console.error('2FA disable error:', error);
        res.status(500).json({ error: 'Failed to disable 2FA' });
    }
};

export const initiate2FASetup = async (req: AuthRequest, res: Response) => {
    try {
        const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.twoFactorCode.create({
            data: {
                userId: req.user?.id,
                code,
                type: 'SETUP',
                expiresAt
            }
        });

        const user = await prisma.user.findUnique({
            where: { id: req.user?.id }
        });

        if (user) {
            await sendTwoFactorCodeEmail(user.email, code, user.name);
        }

        res.json({
            message: 'Verification code sent to your email',
            expiresAt
        });
    } catch (error) {
        console.error('2FA initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate 2FA setup' });
    }
};

export const initiate2FADisable = async (req: AuthRequest, res: Response) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.twoFactorCode.create({
            data: {
                userId: req.user?.id,
                code,
                type: 'DISABLE',
                expiresAt
            }
        });

        const user = await prisma.user.findUnique({
            where: { id: req.user?.id }
        });

        if (user) {
            await sendTwoFactorCodeEmail(user.email, code, user.name);
        }

        res.json({
            message: 'Verification code sent to your email',
            expiresAt
        });
    } catch (error) {
        console.error('2FA disable initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate 2FA disable' });
    }
};

export const getSessions = async (req: AuthRequest, res: Response) => {
    try {
        const sessions = await getUserSessions(req.user?.id);
        res.json({ sessions });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
};

export const revokeSession = async (req: AuthRequest, res: Response) => {
    try {
        const rawSessionId = req.params.sessionId as string;
        const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        if (sessionId === req.sessionId) {
            return res.status(400).json({ error: 'Cannot revoke current session' });
        }

        await invalidateSession(sessionId);

        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: 'SESSION_REVOKED',
                details: JSON.stringify({ revokedSessionId: sessionId }),
                ipAddress: req.ip
            }
        }).catch(() => {});

        res.json({ message: 'Session revoked successfully' });
    } catch (error) {
        console.error('Revoke session error:', error);
        res.status(500).json({ error: 'Failed to revoke session' });
    }
};

export const googleOAuth = async (req: Request, res: Response) => {
    try {
        const { code, redirectUri } = req.body;

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return res.status(501).json({ error: 'Google OAuth not configured' });
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        if (!tokenResponse.ok) {
            return res.status(400).json({ error: 'Failed to exchange code for tokens' });
        }

        const tokenData: any = await tokenResponse.json();

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        if (!userInfoResponse.ok) {
            return res.status(400).json({ error: 'Failed to get user info' });
        }

        const googleUser: any = await userInfoResponse.json();

        let oauthAccount = await prisma.oAuthAccount.findUnique({
            where: {
                provider_providerId: {
                    provider: 'google',
                    providerId: googleUser.id
                }
            },
            include: { user: { include: { profile: true } } }
        });

        let user: any;
        let isNewUser = false;

        if (!oauthAccount) {
            user = await prisma.user.findUnique({
                where: { email: googleUser.email }
            });

            if (user) {
                await prisma.oAuthAccount.create({
                    data: {
                        userId: user.id,
                        provider: 'google',
                        providerId: googleUser.id,
                        accessToken: tokenData.access_token,
                        refreshToken: tokenData.refresh_token,
                        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
                        profileData: JSON.stringify(googleUser)
                    }
                });
            } else {
                user = await prisma.user.create({
                    data: {
                        email: googleUser.email,
                        name: googleUser.name || 'User',
                        password: await bcrypt.hash(Math.random().toString(36), 12),
                        role: 'TeacherStaff',
                        profile: {
                            create: {
                                avatar: googleUser.picture,
                                firstName: googleUser.given_name,
                                lastName: googleUser.family_name
                            }
                        }
                    },
                    include: { profile: true }
                });

                await prisma.oAuthAccount.create({
                    data: {
                        userId: user.id,
                        provider: 'google',
                        providerId: googleUser.id,
                        accessToken: tokenData.access_token,
                        refreshToken: tokenData.refresh_token,
                        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
                        profileData: JSON.stringify(googleUser)
                    }
                });

                isNewUser = true;
            }
        } else {
            user = oauthAccount.user;

            await prisma.oAuthAccount.update({
                where: { id: oauthAccount.id },
                data: {
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null
                }
            });
        }

        if (user.status !== 'Active') {
            return res.status(401).json({ error: 'Account is not active' });
        }

        const session = await createSession({
            userId: user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: isNewUser ? 'USER_GOOGLE_SIGNUP' : 'USER_GOOGLE_LOGIN',
                ipAddress: req.ip
            }
        });

        res.json({
            message: isNewUser ? 'Account created successfully' : 'Login successful',
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ error: 'OAuth authentication failed' });
    }
};

export const microsoftOAuth = async (req: Request, res: Response) => {
    try {
        const { code, redirectUri } = req.body;

        const clientId = process.env.MICROSOFT_CLIENT_ID;
        const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return res.status(501).json({ error: 'Microsoft OAuth not configured' });
        }

        const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
                scope: 'openid profile email'
            })
        });

        if (!tokenResponse.ok) {
            return res.status(400).json({ error: 'Failed to exchange code for tokens' });
        }

        const tokenData: any = await tokenResponse.json();

        const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        if (!userInfoResponse.ok) {
            return res.status(400).json({ error: 'Failed to get user info' });
        }

        const msUser: any = await userInfoResponse.json();

        let oauthAccount = await prisma.oAuthAccount.findUnique({
            where: {
                provider_providerId: {
                    provider: 'microsoft',
                    providerId: msUser.id
                }
            },
            include: { user: { include: { profile: true } } }
        });

        let user: any;
        let isNewUser = false;

        if (!oauthAccount) {
            user = await prisma.user.findUnique({
                where: { email: msUser.mail || msUser.userPrincipalName }
            });

            if (user) {
                await prisma.oAuthAccount.create({
                    data: {
                        userId: user.id,
                        provider: 'microsoft',
                        providerId: msUser.id,
                        accessToken: tokenData.access_token,
                        refreshToken: tokenData.refresh_token,
                        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
                        profileData: JSON.stringify(msUser)
                    }
                });
            } else {
                user = await prisma.user.create({
                    data: {
                        email: msUser.mail || msUser.userPrincipalName,
                        name: msUser.displayName || 'User',
                        password: await bcrypt.hash(Math.random().toString(36), 12),
                        role: 'TeacherStaff',
                        profile: {
                            create: {
                                firstName: msUser.givenName,
                                lastName: msUser.surname
                            }
                        }
                    },
                    include: { profile: true }
                });

                await prisma.oAuthAccount.create({
                    data: {
                        userId: user.id,
                        provider: 'microsoft',
                        providerId: msUser.id,
                        accessToken: tokenData.access_token,
                        refreshToken: tokenData.refresh_token,
                        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
                        profileData: JSON.stringify(msUser)
                    }
                });

                isNewUser = true;
            }
        } else {
            user = oauthAccount.user;

            await prisma.oAuthAccount.update({
                where: { id: oauthAccount.id },
                data: {
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null
                }
            });
        }

        if (user.status !== 'Active') {
            return res.status(401).json({ error: 'Account is not active' });
        }

        const session = await createSession({
            userId: user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: isNewUser ? 'USER_MICROSOFT_SIGNUP' : 'USER_MICROSOFT_LOGIN',
                ipAddress: req.ip
            }
        });

        res.json({
            message: isNewUser ? 'Account created successfully' : 'Login successful',
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Microsoft OAuth error:', error);
        res.status(500).json({ error: 'OAuth authentication failed' });
    }
};
