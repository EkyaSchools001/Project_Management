import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// IMPORTANT: Specific routes MUST come before generic /:id wildcard routes
// otherwise Express matches /role/TEACHER as /:id with id="role" → 404

// All authenticated users can read dashboards
router.get('/', protect, dashboardController.getDashboards);

// Specific named routes first
router.get('/role/:role', protect, dashboardController.getDashboardsByRole);
router.get('/widget-types/list', protect, dashboardController.getWidgetTypes);

// Generic /:id wildcard — must come after all specific GET routes
router.get('/:id', protect, dashboardController.getDashboard);

// Only SuperAdmin can create/update/delete dashboards
router.post('/', protect, restrictTo('SUPERADMIN'), dashboardController.createDashboard);
router.put('/role/:role/set-default/:id', protect, restrictTo('SUPERADMIN'), dashboardController.setDefaultDashboard);
router.put('/:id', protect, restrictTo('SUPERADMIN'), dashboardController.updateDashboard);
router.delete('/:id', protect, restrictTo('SUPERADMIN'), dashboardController.deleteDashboard);

// Widget management
router.post('/:id/widgets', protect, restrictTo('SUPERADMIN'), dashboardController.addWidget);
router.put('/:id/widgets/reorder', protect, restrictTo('SUPERADMIN'), dashboardController.reorderWidgets);
router.put('/:id/widgets/:widgetId', protect, restrictTo('SUPERADMIN'), dashboardController.updateWidget);
router.delete('/:id/widgets/:widgetId', protect, restrictTo('SUPERADMIN'), dashboardController.deleteWidget);

// Widget types management (SuperAdmin only)
router.post('/widget-types', protect, restrictTo('SUPERADMIN'), dashboardController.createWidgetType);
router.put('/widget-types/:id', protect, restrictTo('SUPERADMIN'), dashboardController.updateWidgetType);
router.delete('/widget-types/:id', protect, restrictTo('SUPERADMIN'), dashboardController.deleteWidgetType);

export default router;
