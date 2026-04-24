import { Router } from 'express';
import { signToken } from '../services/jwt.js';
import { prisma } from '../prismaClient.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = await signToken({ id: user.id, email: user.email, role: user.role, campusId: user.campusId, teacherId: user.teacherId });

  return res.json({ token, user: { id: user.id, email: user.email, role: user.role, campusId: user.campusId, teacherId: user.teacherId } });
});

export default router;
