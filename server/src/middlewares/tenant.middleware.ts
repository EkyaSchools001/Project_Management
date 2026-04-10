import { Request, Response, NextFunction } from 'express';

export const requireTenant = (req: Request, res: Response, next: NextFunction) => {
    // Stub implementation for development
    next();
};
