import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { UserRole, AccessLevel } from '@prisma/client';

const API_MODULE_MAP: Record<string, string> = {
    'projects': 'Timetable',
    'tasks': 'Timetable',
    'courses': 'Curriculum',
    'lms': 'Curriculum',
    'finance': 'Payments',
    'users': 'User Mgmt',
    'analytics': 'Management BI',
    'growth': 'Appraisal',
    'attendance': 'Student Attendance',
};

export const checkPermission = (moduleName?: string, action: string = 'view') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const path = req.originalUrl || req.url;

    // Public paths whitelist
    const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
    if (PUBLIC_PATHS.some(p => path.includes(p))) {
      return next();
    }

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    // SuperAdmin bypasses all checks
    if (user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    try {
      let targetModule = moduleName;

      // Dynamic detection if moduleName not provided
      if (!targetModule) {
        const segments = req.path.split('/').filter(Boolean);
        for (const segment of segments) {
          if (API_MODULE_MAP[segment]) {
            targetModule = API_MODULE_MAP[segment];
            break;
          }
        }
      }

      if (!targetModule) {
        // If no module mapping found, allow for now (transitional state)
        return next();
      }

      // Find the module
      const module = await prisma.eRPModule.findUnique({
        where: { name: targetModule }
      });

      if (!module) {
        return next();
      }

      // Check permission
      const permission = await prisma.rolePermission.findUnique({
        where: {
          role_moduleId_action: {
            role: user.role as UserRole,
            moduleId: module.id,
            action: action
          }
        }
      });

      if (!permission || permission.access === AccessLevel.NONE) {
        return res.status(403).json({ 
          status: 'error', 
          message: `Access Denied: You do not have ${action} permissions for ${targetModule}` 
        });
      }

      // Attach access level to request for data scoping
      (req as any).accessLevel = permission.access;
      (req as any).moduleScope = user.roleScope;

      next();
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      next();
    }
  };
};

export const globalRBAC = checkPermission();
