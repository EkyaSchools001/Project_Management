import { prisma } from '../app';

export interface CreateDeviceData {
  name: string;
  type: string;
  location?: string;
  schoolId?: string;
  metadata?: any;
}

export interface UpdateDeviceData {
  name?: string;
  type?: string;
  location?: string;
  status?: 'Active' | 'Inactive' | 'Maintenance' | 'Offline';
  metadata?: any;
}

export interface CreateReadingData {
  deviceId: string;
  type: string;
  value: number;
  unit?: string;
}

export interface CreateAttendanceData {
  studentId: string;
  deviceId: string;
  type?: 'CheckIn' | 'CheckOut';
}

export interface CreateRoomData {
  name: string;
  building?: string;
  capacity?: number;
  amenities?: string;
  schoolId?: string;
}

export interface CreateRoomBookingData {
  roomId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  purpose?: string;
}

export interface CreateVisitorData {
  name: string;
  email?: string;
  phone?: string;
  purpose?: string;
  schoolId?: string;
}

export interface CreateMaintenanceData {
  deviceId: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: string;
}

export const createDevice = async (data: CreateDeviceData) => {
  return prisma.ioTDevice.create({
    data: {
      name: data.name,
      type: data.type,
      location: data.location,
      schoolId: data.schoolId,
      metadata: data.metadata || {},
      lastSeen: new Date(),
    },
  });
};

export const getAllDevices = async (schoolId?: string, status?: string) => {
  const where: any = {};
  if (schoolId) where.schoolId = schoolId;
  if (status) where.status = status;

  return prisma.ioTDevice.findMany({
    where,
    include: {
      readings: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const getDeviceById = async (id: string) => {
  return prisma.ioTDevice.findUnique({
    where: { id },
    include: {
      readings: {
        orderBy: { timestamp: 'desc' },
        take: 50,
      },
      maintenanceRequests: {
        where: { status: { not: 'Completed' } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
};

export const updateDevice = async (id: string, data: UpdateDeviceData) => {
  return prisma.ioTDevice.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.type && { type: data.type }),
      ...(data.location && { location: data.location }),
      ...(data.status && { status: data.status }),
      ...(data.metadata && { metadata: data.metadata }),
      lastSeen: data.status ? new Date() : undefined,
    },
  });
};

export const deleteDevice = async (id: string) => {
  await prisma.ioTDevice.delete({ where: { id } });
};

export const addReading = async (data: CreateReadingData) => {
  const reading = await prisma.ioTReading.create({
    data: {
      deviceId: data.deviceId,
      type: data.type,
      value: data.value,
      unit: data.unit,
      timestamp: new Date(),
    },
  });

  await prisma.ioTDevice.update({
    where: { id: data.deviceId },
    data: { lastSeen: new Date() },
  });

  return reading;
};

export const getLatestReading = async (deviceId: string, type?: string) => {
  const where: any = { deviceId };
  if (type) where.type = type;

  return prisma.ioTReading.findFirst({
    where,
    orderBy: { timestamp: 'desc' },
  });
};

export const getReadingHistory = async (
  deviceId: string,
  type: string,
  startDate?: Date,
  endDate?: Date,
  limit: number = 100
) => {
  const where: any = { deviceId, type };
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = startDate;
    if (endDate) where.timestamp.lte = endDate;
  }

  return prisma.ioTReading.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
};

export const createAttendance = async (data: CreateAttendanceData) => {
  return prisma.attendance.create({
    data: {
      studentId: data.studentId,
      deviceId: data.deviceId,
      type: data.type || 'CheckIn',
    },
  });
};

export const getTodayAttendance = async (schoolId?: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where: any = {
    timestamp: { gte: today },
  };

  return prisma.attendance.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  });
};

export const getAttendanceHistory = async (
  studentId?: string,
  startDate?: Date,
  endDate?: Date,
  limit: number = 100
) => {
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = startDate;
    if (endDate) where.timestamp.lte = endDate;
  }

  return prisma.attendance.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
};

export const createRoom = async (data: CreateRoomData) => {
  return prisma.room.create({
    data: {
      name: data.name,
      building: data.building,
      capacity: data.capacity || 0,
      amenities: data.amenities,
      schoolId: data.schoolId,
    },
  });
};

export const getAllRooms = async (schoolId?: string, building?: string) => {
  const where: any = {};
  if (schoolId) where.schoolId = schoolId;
  if (building) where.building = building;

  return prisma.room.findMany({
    where,
    orderBy: { name: 'asc' },
  });
};

export const getRoomById = async (id: string) => {
  return prisma.room.findUnique({
    where: { id },
    include: {
      bookings: {
        where: {
          status: { not: 'Cancelled' },
          endTime: { gte: new Date() },
        },
        orderBy: { startTime: 'asc' },
        take: 10,
      },
    },
  });
};

export const updateRoom = async (id: string, data: Partial<CreateRoomData>) => {
  return prisma.room.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.building && { building: data.building }),
      ...(data.capacity !== undefined && { capacity: data.capacity }),
      ...(data.amenities && { amenities: data.amenities }),
    },
  });
};

export const deleteRoom = async (id: string) => {
  await prisma.room.delete({ where: { id } });
};

export const createRoomBooking = async (data: CreateRoomBookingData) => {
  const conflicting = await prisma.roomBooking.findFirst({
    where: {
      roomId: data.roomId,
      status: { not: 'Cancelled' },
      OR: [
        { startTime: { lte: data.startTime }, endTime: { gte: data.startTime } },
        { startTime: { lt: data.endTime }, endTime: { gte: data.endTime } },
        { startTime: { gte: data.startTime }, endTime: { lte: data.endTime } },
      ],
    },
  });

  if (conflicting) {
    throw new Error('Room is not available for the selected time slot');
  }

  return prisma.roomBooking.create({
    data: {
      roomId: data.roomId,
      userId: data.userId,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
    },
  });
};

export const getRoomBookings = async (
  roomId?: string,
  userId?: string,
  startDate?: Date,
  endDate?: Date
) => {
  const where: any = {};
  if (roomId) where.roomId = roomId;
  if (userId) where.userId = userId;
  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = startDate;
    if (endDate) where.startTime.lte = endDate;
  }

  return prisma.roomBooking.findMany({
    where,
    include: { room: true, user: true },
    orderBy: { startTime: 'asc' },
  });
};

export const updateBookingStatus = async (
  id: string,
  status: 'Pending' | 'Approved' | 'Cancelled' | 'Completed'
) => {
  return prisma.roomBooking.update({
    where: { id },
    data: { status },
  });
};

export const deleteBooking = async (id: string) => {
  await prisma.roomBooking.delete({ where: { id } });
};

export const createVisitor = async (data: CreateVisitorData) => {
  const badgeNumber = `VIS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  return prisma.visitor.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      purpose: data.purpose,
      schoolId: data.schoolId,
      badgeNumber,
    },
  });
};

export const getAllVisitors = async (
  schoolId?: string,
  todayOnly: boolean = true
) => {
  const where: any = {};
  if (schoolId) where.schoolId = schoolId;
  if (todayOnly) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    where.checkInTime = { gte: today };
  }

  return prisma.visitor.findMany({
    where,
    orderBy: { checkInTime: 'desc' },
  });
};

export const getVisitorById = async (id: string) => {
  return prisma.visitor.findUnique({ where: { id } });
};

export const checkOutVisitor = async (id: string) => {
  return prisma.visitor.update({
    where: { id },
    data: { checkOutTime: new Date() },
  });
};

export const deleteVisitor = async (id: string) => {
  await prisma.visitor.delete({ where: { id } });
};

export const createMaintenanceRequest = async (data: CreateMaintenanceData) => {
  return prisma.maintenanceRequest.create({
    data: {
      deviceId: data.deviceId,
      description: data.description,
      priority: data.priority || 'Medium',
      assignedTo: data.assignedTo,
    },
  });
};

export const getMaintenanceRequests = async (
  deviceId?: string,
  status?: string,
  priority?: string
) => {
  const where: any = {};
  if (deviceId) where.deviceId = deviceId;
  if (status) where.status = status as any;
  if (priority) where.priority = priority as any;

  const orderBy: any = {};
  if (priority) {
    orderBy.priority = 'desc';
  } else {
    orderBy.createdAt = 'desc';
  }

  return prisma.maintenanceRequest.findMany({
    where,
    include: { device: true },
    orderBy,
  });
};

export const getMaintenanceRequestById = async (id: string) => {
  return prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { device: true },
  });
};

export const updateMaintenanceRequest = async (
  id: string,
  data: {
    status?: 'Open' | 'InProgress' | 'Completed' | 'Cancelled';
    assignedTo?: string;
    notes?: string;
  }
) => {
  const updateData: any = { ...data };
  if (data.status === 'Completed') {
    updateData.completedAt = new Date();
  }

  return prisma.maintenanceRequest.update({
    where: { id },
    data: updateData,
  });
};

export const deleteMaintenanceRequest = async (id: string) => {
  await prisma.maintenanceRequest.delete({ where: { id } });
};

export const getDeviceStats = async (schoolId?: string) => {
  const where: any = {};
  if (schoolId) where.schoolId = schoolId;

  const [total, active, offline, maintenance] = await Promise.all([
    prisma.ioTDevice.count({ where }),
    prisma.ioTDevice.count({ where: { ...where, status: 'Active' } }),
    prisma.ioTDevice.count({ where: { ...where, status: 'Offline' } }),
    prisma.ioTDevice.count({ where: { ...where, status: 'Maintenance' } }),
  ]);

  const openMaintenance = await prisma.maintenanceRequest.count({
    where: { status: { not: 'Completed' } },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAttendance = await prisma.attendance.count({
    where: { timestamp: { gte: today } },
  });

  return { total, active, offline, maintenance, openMaintenance, todayAttendance };
};