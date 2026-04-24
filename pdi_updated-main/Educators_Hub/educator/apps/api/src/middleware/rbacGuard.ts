import type { RequestHandler } from 'express';
import { hasPermission } from '../../../../packages/config/src/rbac.js';

export const rbacGuard = (resource: string, action: string): RequestHandler => {
  return (req, res, next) => {
    const user = res.locals.user as { role?: string };
    if (!user?.role) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!hasPermission(user.role as any, resource as any, action as any)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
