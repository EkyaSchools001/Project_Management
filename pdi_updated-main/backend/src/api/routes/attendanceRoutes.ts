import { Router } from 'express';
import * as attendanceController from '../controllers/attendanceController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// Protect all routes
router.use(protect);

// Global Admin View
router.get('/admin/all', restrictTo('ADMIN', 'SUPERADMIN', 'LEADER'), attendanceController.getAllAttendance);

// Manual mark by Admin
router.post('/mark', restrictTo('ADMIN', 'SUPERADMIN', 'LEADER', 'SCHOOL_LEADER', 'MANAGEMENT'), attendanceController.markAttendance);

// Event specific routes
router.post('/:id/toggle', attendanceController.toggleAttendance); // Enable/Close
router.post('/:id/submit', attendanceController.submitAttendance); // Mark Attendance
router.post('/:id/award', attendanceController.awardTrainingHours); // Award Hours
router.get('/:id', attendanceController.getEventAttendance); // View List

export default router;
