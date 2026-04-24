import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { roleModuleAuth } from '../middlewares/accessControl';

const router = Router();

// Institutional Identity
router.get('/institutional-identity', protect, roleModuleAuth, (req: any, res) => {
    const rawRole = req.user?.role || 'TEACHER';
    const role = rawRole.toUpperCase();
    
    res.status(200).json({ 
        status: 'success', 
        data: { 
            message: `Institutional Identity data for ${role}`,
            canEdit: role === 'ADMIN' || role === 'SUPERADMIN' || role === 'MANAGEMENT'
        } 
    });
});

// Academic Operations
router.get('/academic-operations', protect, roleModuleAuth, (req: any, res) => {
    const rawRole = req.user?.role || 'TEACHER';
    const role = rawRole.toUpperCase();
    let dashboardData = {};

    if (role.includes('TEACHER')) {
        dashboardData = { type: 'Personal', schedule: [] };
    } else if (role.includes('LEADER')) {
        dashboardData = { type: 'Campus', alerts: 2 };
    } else if (role.includes('MANAGEMENT')) {
        dashboardData = { type: 'Analytical', kpis: [] };
    } else {
        dashboardData = { type: 'Admin', status: 'Global' };
    }

    res.status(200).json({ status: 'success', data: dashboardData });
});

// Pedagogy & Learning
router.get('/pedagogy-learning', protect, roleModuleAuth, (req: any, res) => {
    const role = req.user?.role || 'TEACHER';
    res.status(200).json({ 
        status: 'success', 
        data: { 
            message: `Pedagogy & Learning access for ${role}`,
            repositoryOpen: true 
        } 
    });
});

// Professional Development
router.get('/professional-development', protect, roleModuleAuth, (req: any, res) => {
    const role = req.user?.role || 'TEACHER';
    res.status(200).json({ 
        status: 'success', 
        data: { 
            message: `PDI modules for ${role}`,
            modules: [] 
        } 
    });
});

// Management & Support
router.get('/management-support', protect, roleModuleAuth, (req: any, res) => {
    const role = req.user?.role || 'TEACHER';
    res.status(200).json({ 
        status: 'success', 
        data: { 
            message: `Support portal for ${role}`,
            tickets: [] 
        } 
    });
});

export default router;
