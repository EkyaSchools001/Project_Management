import type { TabConfig, Role } from './types';

export const portalTabs: Record<Role, TabConfig[]> = {
  teacher: [
    { id: 'home', label: 'Home', path: '/teacher/home', resource: 'home', portal: 'teacher' },
    { id: 'whoWeAre', label: 'Who we are', path: '/teacher/who-we-are', resource: 'whoWeAre', portal: 'teacher' },
    { id: 'myCampus', label: 'My campus', path: '/teacher/my-campus', resource: 'myCampus', portal: 'teacher' },
    { id: 'teaching', label: 'Teaching', path: '/teacher/teaching', resource: 'teaching', portal: 'teacher' },
    { id: 'myClassroom', label: 'My classroom', path: '/teacher/my-classroom', resource: 'myClassroom', portal: 'teacher' },
    { id: 'grow', label: 'Grow', path: '/teacher/grow', resource: 'grow', portal: 'teacher' },
    { id: 'joining', label: 'Joining', path: '/teacher/joining', resource: 'joining', portal: 'teacher' }
  ],
  hos: [
    { id: 'home', label: 'Home', path: '/hos/home', resource: 'home', portal: 'hos' },
    { id: 'myCampus', label: 'My campus', path: '/hos/my-campus', resource: 'myCampus', portal: 'hos' },
    { id: 'studentRecords', label: 'Student records', path: '/hos/student-records', resource: 'studentRecords', portal: 'hos' },
    { id: 'timetableCalendar', label: 'Timetable calendar', path: '/hos/timetable', resource: 'timetableCalendar', portal: 'hos' },
    { id: 'policiesApprovals', label: 'Policies approvals', path: '/hos/policies', resource: 'policiesApprovals', portal: 'hos' },
    { id: 'raiseTicket', label: 'Raise a ticket', path: '/hos/ticket', resource: 'raiseTicket', portal: 'hos' }
  ],
  admin: [
    { id: 'home', label: 'Home', path: '/admin/home', resource: 'home', portal: 'admin' },
    { id: 'myCampus', label: 'My campus', path: '/admin/my-campus', resource: 'myCampus', portal: 'admin' },
    { id: 'studentRecords', label: 'Student records', path: '/admin/student-records', resource: 'studentRecords', portal: 'admin' },
    { id: 'platformAccess', label: 'Platform access', path: '/admin/platform-access', resource: 'platformAccess', portal: 'admin' },
    { id: 'raiseTicket', label: 'Raise a ticket', path: '/admin/ticket', resource: 'raiseTicket', portal: 'admin' }
  ],
  management: [
    { id: 'home', label: 'Home', path: '/management/home', resource: 'home', portal: 'management' },
    { id: 'allCampuses', label: 'All campuses', path: '/management/all-campuses', resource: 'myCampus', portal: 'management' },
    { id: 'networkTeaching', label: 'Teaching - Network', path: '/management/teaching-network', resource: 'networkTeaching', portal: 'management' },
    { id: 'peoplePDI', label: 'People PDI', path: '/management/people-pdi', resource: 'peoplePDI', portal: 'management' },
    { id: 'reportsAnalytics', label: 'Reports analytics', path: '/management/reports-analytics', resource: 'reportsAnalytics', portal: 'management' }
  ],
  superadmin: [
    { id: 'home', label: 'Home', path: '/superadmin/home', resource: 'home', portal: 'superadmin' },
    { id: 'userManagement', label: 'User management', path: '/superadmin/user-management', resource: 'userManagement', portal: 'superadmin' },
    { id: 'contentManagement', label: 'Content management', path: '/superadmin/content-management', resource: 'contentManagement', portal: 'superadmin' },
    { id: 'platformSettings', label: 'Platform settings', path: '/superadmin/platform-settings', resource: 'platformSettings', portal: 'superadmin' },
    { id: 'campusManagement', label: 'Campus management', path: '/superadmin/campus-management', resource: 'campusManagement', portal: 'superadmin' },
    { id: 'reportsAnalytics', label: 'Reports analytics', path: '/superadmin/reports-analytics', resource: 'reportsAnalytics', portal: 'superadmin' },
    { id: 'auditLog', label: 'Audit log', path: '/superadmin/audit-log', resource: 'auditLog', portal: 'superadmin' }
  ]
};
