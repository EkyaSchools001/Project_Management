import { prisma } from '../app';

export interface CreateTenantData {
    name: string;
    slug: string;
    domain?: string;
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    settings?: any;
}

export interface UpdateTenantData {
    name?: string;
    domain?: string;
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    status?: 'Active' | 'Inactive' | 'Suspended';
    settings?: any;
}

export interface BrandingData {
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
}

export const createTenant = async (data: CreateTenantData) => {
    const existingTenant = await prisma.tenant.findUnique({
        where: { slug: data.slug }
    });
    if (existingTenant) {
        throw new Error('Tenant slug already exists');
    }

    const tenant = await prisma.tenant.create({
        data: {
            name: data.name,
            slug: data.slug,
            domain: data.domain,
            logo: data.logo,
            favicon: data.favicon,
            primaryColor: data.primaryColor || '#3B82F6',
            secondaryColor: data.secondaryColor || '#10B981',
            accentColor: data.accentColor || '#F59E0B',
            backgroundColor: data.backgroundColor || '#FFFFFF',
            settings: data.settings || {}
        }
    });

    return tenant;
};

export const getTenantById = async (id: string) => {
    return prisma.tenant.findUnique({
        where: { id },
        include: {
            settings: true,
            customFields: true
        }
    });
};

export const getTenantBySlug = async (slug: string) => {
    return prisma.tenant.findUnique({
        where: { slug },
        include: {
            settings: true,
            customFields: true
        }
    });
};

export const getTenantByDomain = async (domain: string) => {
    return prisma.tenant.findUnique({
        where: { domain },
        include: {
            settings: true
        }
    });
};

export const listTenants = async (options?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const { status, search, page = 1, limit = 20 } = options || {};
    
    const where: any = {};
    if (status) {
        where.status = status;
    }
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { domain: { contains: search, mode: 'insensitive' } }
        ];
    }

    const [tenants, total] = await Promise.all([
        prisma.tenant.findMany({
            where,
            include: {
                _count: { select: { users: true } }
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.tenant.count({ where })
    ]);

    return {
        tenants: tenants.map(t => ({
            ...t,
            userCount: t._count.users
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

export const updateTenant = async (id: string, data: UpdateTenantData) => {
    const tenant = await prisma.tenant.update({
        where: { id },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.domain !== undefined && { domain: data.domain }),
            ...(data.logo !== undefined && { logo: data.logo }),
            ...(data.favicon !== undefined && { favicon: data.favicon }),
            ...(data.primaryColor && { primaryColor: data.primaryColor }),
            ...(data.secondaryColor && { secondaryColor: data.secondaryColor }),
            ...(data.accentColor && { accentColor: data.accentColor }),
            ...(data.backgroundColor && { backgroundColor: data.backgroundColor }),
            ...(data.status && { status: data.status }),
            ...(data.settings && { settings: data.settings })
        }
    });

    return tenant;
};

export const deleteTenant = async (id: string) => {
    await prisma.tenant.delete({
        where: { id }
    });
};

export const updateBranding = async (id: string, branding: BrandingData) => {
    return prisma.tenant.update({
        where: { id },
        data: {
            ...(branding.logo !== undefined && { logo: branding.logo }),
            ...(branding.favicon !== undefined && { favicon: branding.favicon }),
            ...(branding.primaryColor && { primaryColor: branding.primaryColor }),
            ...(branding.secondaryColor && { secondaryColor: branding.secondaryColor }),
            ...(branding.accentColor && { accentColor: branding.accentColor }),
            ...(branding.backgroundColor && { backgroundColor: branding.backgroundColor })
        }
    });
};

export const getBranding = async (tenantId: string) => {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: {
            logo: true,
            favicon: true,
            primaryColor: true,
            secondaryColor: true,
            accentColor: true,
            backgroundColor: true
        }
    });
    return tenant;
};

export const getTenantSettings = async (tenantId: string) => {
    const settings = await prisma.tenantSetting.findMany({
        where: { tenantId }
    });
    
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
        settingsMap[s.key] = s.value;
    });
    
    return settingsMap;
};

export const updateTenantSettings = async (tenantId: string, settings: Record<string, string>) => {
    const updates = Object.entries(settings).map(([key, value]) => {
        return prisma.tenantSetting.upsert({
            where: { tenantId_key: { tenantId, key } },
            update: { value },
            create: { tenantId, key, value }
        });
    });

    await Promise.all(updates);
    return getTenantSettings(tenantId);
};

export const addUserToTenant = async (userId: string, tenantId: string, role: string = 'member', isPrimary: boolean = false) => {
    return prisma.tenantUser.upsert({
        where: { userId_tenantId: { userId, tenantId } },
        update: { role, isPrimary },
        create: { userId, tenantId, role, isPrimary }
    });
};

export const removeUserFromTenant = async (userId: string, tenantId: string) => {
    return prisma.tenantUser.delete({
        where: { userId_tenantId: { userId, tenantId } }
    });
};

export const getTenantUsers = async (tenantId: string) => {
    return prisma.tenantUser.findMany({
        where: { tenantId },
        include: { user: { include: { profile: true } } }
    });
};

export const getUserTenants = async (userId: string) => {
    return prisma.tenantUser.findMany({
        where: { userId },
        include: { tenant: true }
    });
};

export const getUserPrimaryTenant = async (userId: string) => {
    const tenantUser = await prisma.tenantUser.findFirst({
        where: { userId, isPrimary: true },
        include: { tenant: true }
    });
    return tenantUser?.tenant;
};

export const createCustomField = async (tenantId: string, data: {
    entity: string;
    fieldName: string;
    label: string;
    type?: string;
    required?: boolean;
    options?: string;
    defaultValue?: string;
}) => {
    return prisma.customField.create({
        data: {
            tenantId,
            entity: data.entity,
            fieldName: data.fieldName,
            label: data.label,
            type: data.type as any || 'text',
            required: data.required || false,
            options: data.options,
            defaultValue: data.defaultValue
        }
    });
};

export const getCustomFields = async (tenantId: string, entity: string) => {
    return prisma.customField.findMany({
        where: { tenantId, entity },
        orderBy: { createdAt: 'asc' }
    });
};

export const deleteCustomField = async (id: string) => {
    return prisma.customField.delete({
        where: { id }
    });
};

export const scopeToTenant = (tenantId?: string) => {
    return tenantId ? { tenantId } : {};
};