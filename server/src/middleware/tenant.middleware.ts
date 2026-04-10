import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';

export interface TenantRequest extends Request {
    tenantId?: string;
    tenant?: any;
}

export const extractTenant = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        let tenantId: string | undefined;
        let tenant: any = undefined;

        const tenantHeader = req.headers['x-tenant-id'] as string;
        if (tenantHeader) {
            tenantId = tenantHeader;
            tenant = await prisma.tenant.findUnique({
                where: { id: tenantId },
                include: { settings: true }
            });
            if (tenant && tenant.status !== 'Active') {
                return res.status(403).json({ error: 'Tenant is not active' });
            }
        }

        const host = req.headers.host;
        if (host && !tenant) {
            const subdomain = host.split('.')[0];
            if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
                tenant = await prisma.tenant.findUnique({
                    where: { slug: subdomain },
                    include: { settings: true }
                });
                if (tenant) {
                    tenantId = tenant.id;
                    if (tenant.status !== 'Active') {
                        return res.status(403).json({ error: 'Tenant is not active' });
                    }
                }
            }
        }

        req.tenantId = tenantId;
        req.tenant = tenant;
        next();
    } catch (error) {
        console.error('Tenant extraction error:', error);
        next();
    }
};

export const requireTenant = async (req: TenantRequest, res: Response, next: NextFunction) => {
    if (!req.tenantId || !req.tenant) {
        return res.status(400).json({ error: 'Tenant context required' });
    }
    next();
};

export const getTenantId = (req: TenantRequest): string | undefined => {
    return req.tenantId;
};

export const getTenant = (req: TenantRequest): any => {
    return req.tenant;
};