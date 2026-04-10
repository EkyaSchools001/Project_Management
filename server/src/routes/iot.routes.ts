import { Router } from 'express';
import {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  addReading,
  getLatestReading,
  getReadingHistory,
  createAttendance,
  getTodayAttendance,
  getAttendanceHistory,
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  createRoomBooking,
  getRoomBookings,
  updateBookingStatus,
  deleteBooking,
  createVisitor,
  getAllVisitors,
  getVisitorById,
  checkOutVisitor,
  createMaintenanceRequest,
  getMaintenanceRequests,
  getMaintenanceRequestById,
  updateMaintenanceRequest,
  getDeviceStats,
} from '../controllers/iot.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/devices', createDevice);
router.get('/devices', getAllDevices);
router.get('/devices/stats', getDeviceStats);
router.get('/devices/:id', getDeviceById);
router.put('/devices/:id', updateDevice);
router.delete('/devices/:id', deleteDevice);

router.post('/readings', addReading);
router.get('/readings/latest', getLatestReading);
router.get('/readings/history', getReadingHistory);

router.post('/attendance', createAttendance);
router.get('/attendance/today', getTodayAttendance);
router.get('/attendance/history', getAttendanceHistory);

router.post('/rooms', createRoom);
router.get('/rooms', getAllRooms);
router.get('/rooms/:id', getRoomById);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

router.post('/bookings', createRoomBooking);
router.get('/bookings', getRoomBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

router.post('/visitors', createVisitor);
router.get('/visitors', getAllVisitors);
router.get('/visitors/:id', getVisitorById);
router.post('/visitors/:id/checkout', checkOutVisitor);

router.post('/maintenance', createMaintenanceRequest);
router.get('/maintenance', getMaintenanceRequests);
router.get('/maintenance/:id', getMaintenanceRequestById);
router.put('/maintenance/:id', updateMaintenanceRequest);

export default router;