import { Router } from 'express';
import {
    getAllTenants,
    getTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
    updateBranding,
    getTenantSettings,
    updateTenantSettings,
    getTenantUsers,
    addUserToTenant,
    removeUserFromTenant,
    getCustomFields,
    createCustomField,
    deleteCustomField
} from '../controllers/tenant.controller';
import { authenticate, isSuperAdmin } from '../middlewares/auth.middleware';
import { requireTenant } from '../middlewares/tenant.middleware';

const router = Router();

router.use(authenticate);

router.get('/', isSuperAdmin, getAllTenants);
router.post('/', isSuperAdmin, createTenant);

router.get('/:id', getTenantById);
router.put('/:id', updateTenant);
router.delete('/:id', isSuperAdmin, deleteTenant);

router.put('/:id/branding', requireTenant, updateBranding);
router.get('/:id/settings', getTenantSettings);
router.put('/:id/settings', requireTenant, updateTenantSettings);

router.get('/:id/users', getTenantUsers);
router.post('/:id/users', addUserToTenant);
router.delete('/:id/users/:userId', removeUserFromTenant);

router.get('/:id/custom-fields/:entity', getCustomFields);
router.post('/:id/custom-fields', requireTenant, createCustomField);
router.delete('/:id/custom-fields/:fieldId', requireTenant, deleteCustomField);

export default router;
