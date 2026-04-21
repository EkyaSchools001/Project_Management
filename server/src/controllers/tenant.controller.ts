import { Request, Response } from 'express';
import * as tenantService from '../services/tenant.service';
import { getCurrentUserId } from '../middlewares/auth.middleware';
import { TenantRequest } from '../middleware/tenant.middleware';

export const getAllTenants = async (req: Request, res: Response) => {
    try {
        const { status, search, page, limit } = req.query;
        const result = await tenantService.listTenants({
            status: status as string,
            search: search as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error listing tenants:', error);
        res.status(500).json({ error: 'Failed to list tenants' });
    }
};

export const getTenantById = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const tenant = await tenantService.getTenantById(id);
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        res.status(200).json(tenant);
    } catch (error) {
        console.error('Error fetching tenant:', error);
        res.status(500).json({ error: 'Failed to fetch tenant' });
    }
};

export const createTenant = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const tenant = await tenantService.createTenant(data);
        res.status(201).json(tenant);
    } catch (error: any) {
        console.error('Error creating tenant:', error);
        res.status(400).json({ error: error.message || 'Failed to create tenant' });
    }
};

export const updateTenant = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const data = req.body;
        const tenant = await tenantService.updateTenant(id, data);
        res.status(200).json(tenant);
    } catch (error) {
        console.error('Error updating tenant:', error);
        res.status(500).json({ error: 'Failed to update tenant' });
    }
};

export const deleteTenant = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        await tenantService.deleteTenant(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting tenant:', error);
        res.status(500).json({ error: 'Failed to delete tenant' });
    }
};

export const updateBranding = async (req: TenantRequest, res: Response) => {
    try {
        const tenantId = req.tenantId;
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required' });
        }
        const branding = req.body;
        const tenant = await tenantService.updateBranding(tenantId, branding);
        res.status(200).json(tenant);
    } catch (error) {
        console.error('Error updating branding:', error);
        res.status(500).json({ error: 'Failed to update branding' });
    }
};

export const getTenantSettings = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const settings = await tenantService.getTenantSettings(id);
        res.status(200).json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

export const updateTenantSettings = async (req: TenantRequest, res: Response) => {
    try {
        const tenantId = req.tenantId;
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required' });
        }
        const settings = req.body;
        const updatedSettings = await tenantService.updateTenantSettings(tenantId, settings);
        res.status(200).json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

export const getTenantUsers = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const users = await tenantService.getTenantUsers(id);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching tenant users:', error);
        res.status(500).json({ error: 'Failed to fetch tenant users' });
    }
};

export const addUserToTenant = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const { userId, role, isPrimary } = req.body;
        const result = await tenantService.addUserToTenant(userId, id, role, isPrimary);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding user to tenant:', error);
        res.status(500).json({ error: 'Failed to add user to tenant' });
    }
};

export const removeUserFromTenant = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const userId = req.params.userId as string;
        await tenantService.removeUserFromTenant(userId, id);
        res.status(204).send();
    } catch (error) {
        console.error('Error removing user from tenant:', error);
        res.status(500).json({ error: 'Failed to remove user from tenant' });
    }
};

export const getCustomFields = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const entity = req.params.entity as string;
        const fields = await tenantService.getCustomFields(id, entity);
        res.status(200).json(fields);
    } catch (error) {
        console.error('Error fetching custom fields:', error);
        res.status(500).json({ error: 'Failed to fetch custom fields' });
    }
};

export const createCustomField = async (req: TenantRequest, res: Response) => {
    try {
        const tenantId = req.tenantId;
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required' });
        }
        const data = req.body;
        const field = await tenantService.createCustomField(tenantId, data);
        res.status(201).json(field);
    } catch (error) {
        console.error('Error creating custom field:', error);
        res.status(500).json({ error: 'Failed to create custom field' });
    }
};

export const deleteCustomField = async (req: Request, res: Response) => {
    try {
        const fieldId = req.params.fieldId as string;
        await tenantService.deleteCustomField(fieldId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting custom field:', error);
        res.status(500).json({ error: 'Failed to delete custom field' });
    }
};