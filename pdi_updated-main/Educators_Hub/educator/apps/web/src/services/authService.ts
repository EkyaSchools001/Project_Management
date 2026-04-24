import type { UserSession } from '../stores/authStore';

const users: Record<string, Omit<UserSession, 'email'> & { password: string }> = {
  'teacher@ekya.test': {
    password: 'Teacher123!',
    id: 'teacher-1',
    role: 'teacher',
    campusId: 'cmr',
    teacherId: 't1',
    token: 'teacher-token'
  },
  'hos@ekya.test': {
    password: 'HoS123!',
    id: 'hos-1',
    role: 'hos',
    campusId: 'cmr',
    token: 'hos-token'
  },
  'admin@ekya.test': {
    password: 'Admin123!',
    id: 'admin-1',
    role: 'admin',
    campusId: 'cmr',
    token: 'admin-token'
  },
  'management@ekya.test': {
    password: 'Mgmt123!',
    id: 'management-1',
    role: 'management',
    token: 'management-token'
  },
  'superadmin@ekya.test': {
    password: 'Super123!',
    id: 'superadmin-1',
    role: 'superadmin',
    token: 'superadmin-token'
  }
};

export async function mockLogin(email: string, password: string): Promise<UserSession | null> {
  const record = users[email.toLowerCase()];
  if (!record || record.password !== password) {
    return null;
  }

  return {
    id: record.id,
    email: email.toLowerCase(),
    role: record.role,
    campusId: record.campusId,
    teacherId: record.teacherId,
    token: record.token
  };
}
