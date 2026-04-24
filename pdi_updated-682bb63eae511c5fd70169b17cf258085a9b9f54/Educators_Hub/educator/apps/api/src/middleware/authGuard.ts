import type { RequestHandler } from 'express';
import { verifyToken } from '../services/jwt.js';

export const authGuard: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyToken(token);
    res.locals.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
