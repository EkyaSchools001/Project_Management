import { Request, Response } from 'express';
import * as iotService from '../services/iot.service';

export const createDevice = async (req: Request, res: Response) => {
  try {
    const device = await iotService.createDevice(req.body);
    res.status(201).json(device);
  } catch (error: any) {
    console.error('Error creating device:', error);
    res.status(400).json({ error: error.message || 'Failed to create device' });
  }
};

export const getAllDevices = async (req: Request, res: Response) => {
  try {
    const { schoolId, status } = req.query;
    const devices = await iotService.getAllDevices(schoolId as string, status as string);
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const device = await iotService.getDeviceById(id);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const device = await iotService.updateDevice(id, req.body);
    res.status(200).json(device);
  } catch (error: any) {
    console.error('Error updating device:', error);
    res.status(400).json({ error: error.message || 'Failed to update device' });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await iotService.deleteDevice(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ error: 'Failed to delete device' });
  }
};

export const addReading = async (req: Request, res: Response) => {
  try {
    const reading = await iotService.addReading(req.body);
    res.status(201).json(reading);
  } catch (error: any) {
    console.error('Error adding reading:', error);
    res.status(400).json({ error: error.message || 'Failed to add reading' });
  }
};

export const getLatestReading = async (req: Request, res: Response) => {
  try {
    const { deviceId, type } = req.query;
    const reading = await iotService.getLatestReading(deviceId as string, type as string);
    res.status(200).json(reading);
  } catch (error) {
    console.error('Error fetching reading:', error);
    res.status(500).json({ error: 'Failed to fetch reading' });
  }
};

export const getReadingHistory = async (req: Request, res: Response) => {
  try {
    const { deviceId, type, startDate, endDate, limit } = req.query;
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    const readings = await iotService.getReadingHistory(
      deviceId as string,
      type as string,
      start,
      end,
      limit ? parseInt(limit as string) : 100
    );
    res.status(200).json(readings);
  } catch (error) {
    console.error('Error fetching reading history:', error);
    res.status(500).json({ error: 'Failed to fetch reading history' });
  }
};

export const createAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = await iotService.createAttendance(req.body);
    res.status(201).json(attendance);
  } catch (error: any) {
    console.error('Error creating attendance:', error);
    res.status(400).json({ error: error.message || 'Failed to create attendance' });
  }
};

export const getTodayAttendance = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const attendance = await iotService.getTodayAttendance(schoolId as string);
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const getAttendanceHistory = async (req: Request, res: Response) => {
  try {
    const { studentId, startDate, endDate, limit } = req.query;
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    const history = await iotService.getAttendanceHistory(
      studentId as string,
      start,
      end,
      limit ? parseInt(limit as string) : 100
    );
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = await iotService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error: any) {
    console.error('Error creating room:', error);
    res.status(400).json({ error: error.message || 'Failed to create room' });
  }
};

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { schoolId, building } = req.query;
    const rooms = await iotService.getAllRooms(schoolId as string, building as string);
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await iotService.getRoomById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await iotService.updateRoom(id, req.body);
    res.status(200).json(room);
  } catch (error: any) {
    console.error('Error updating room:', error);
    res.status(400).json({ error: error.message || 'Failed to update room' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await iotService.deleteRoom(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

export const createRoomBooking = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
    };
    const booking = await iotService.createRoomBooking(data);
    res.status(201).json(booking);
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(400).json({ error: error.message || 'Failed to create booking' });
  }
};

export const getRoomBookings = async (req: Request, res: Response) => {
  try {
    const { roomId, userId, startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    const bookings = await iotService.getRoomBookings(
      roomId as string,
      userId as string,
      start,
      end
    );
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await iotService.updateBookingStatus(id, status);
    res.status(200).json(booking);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    res.status(400).json({ error: error.message || 'Failed to update booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await iotService.deleteBooking(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

export const createVisitor = async (req: Request, res: Response) => {
  try {
    const visitor = await iotService.createVisitor(req.body);
    res.status(201).json(visitor);
  } catch (error: any) {
    console.error('Error creating visitor:', error);
    res.status(400).json({ error: error.message || 'Failed to create visitor' });
  }
};

export const getAllVisitors = async (req: Request, res: Response) => {
  try {
    const { schoolId, all } = req.query;
    const todayOnly = all !== 'true';
    const visitors = await iotService.getAllVisitors(schoolId as string, todayOnly);
    res.status(200).json(visitors);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
};

export const getVisitorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const visitor = await iotService.getVisitorById(id);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    res.status(200).json(visitor);
  } catch (error) {
    console.error('Error fetching visitor:', error);
    res.status(500).json({ error: 'Failed to fetch visitor' });
  }
};

export const checkOutVisitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const visitor = await iotService.checkOutVisitor(id);
    res.status(200).json(visitor);
  } catch (error) {
    console.error('Error checking out visitor:', error);
    res.status(500).json({ error: 'Failed to check out visitor' });
  }
};

export const createMaintenanceRequest = async (req: Request, res: Response) => {
  try {
    const request = await iotService.createMaintenanceRequest(req.body);
    res.status(201).json(request);
  } catch (error: any) {
    console.error('Error creating maintenance request:', error);
    res.status(400).json({ error: error.message || 'Failed to create request' });
  }
};

export const getMaintenanceRequests = async (req: Request, res: Response) => {
  try {
    const { deviceId, status, priority } = req.query;
    const requests = await iotService.getMaintenanceRequests(
      deviceId as string,
      status as string,
      priority as string
    );
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const getMaintenanceRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await iotService.getMaintenanceRequestById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching maintenance request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

export const updateMaintenanceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await iotService.updateMaintenanceRequest(id, req.body);
    res.status(200).json(request);
  } catch (error: any) {
    console.error('Error updating maintenance request:', error);
    res.status(400).json({ error: error.message || 'Failed to update request' });
  }
};

export const getDeviceStats = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const stats = await iotService.getDeviceStats(schoolId as string);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching device stats:', error);
    res.status(500).json({ error: 'Failed to fetch device stats' });
  }
};