import type { PermissionRule, Role, Resource, Action } from './types';

const actions: Action[] = ['view', 'create', 'edit', 'delete', 'publish'];

const allPermissions: PermissionRule[] = [
  { role: 'teacher', resource: 'home', actions: ['view'] },
  { role: 'teacher', resource: 'whoWeAre', actions: ['view'] },
  { role: 'teacher', resource: 'myCampus', actions: ['view'] },
  { role: 'teacher', resource: 'teaching', actions: ['view'] },
  { role: 'teacher', resource: 'myClassroom', actions: ['view'] },
  { role: 'teacher', resource: 'grow', actions: ['view'] },
  { role: 'teacher', resource: 'joining', actions: ['view'] },
  { role: 'hos', resource: 'home', actions: ['view'] },
  { role: 'hos', resource: 'myCampus', actions: ['view', 'edit'] },
  { role: 'hos', resource: 'studentRecords', actions: ['view', 'edit'] },
  { role: 'hos', resource: 'timetableCalendar', actions: ['view', 'edit'] },
  { role: 'hos', resource: 'policiesApprovals', actions: ['view', 'edit', 'publish'] },
  { role: 'hos', resource: 'raiseTicket', actions: ['view', 'create'] },
  { role: 'admin', resource: 'home', actions: ['view'] },
  { role: 'admin', resource: 'myCampus', actions: ['view', 'edit'] },
  { role: 'admin', resource: 'studentRecords', actions: ['view', 'edit'] },
  { role: 'admin', resource: 'platformAccess', actions: ['view', 'edit'] },
  { role: 'admin', resource: 'raiseTicket', actions: ['view', 'create'] },
  { role: 'management', resource: 'home', actions: ['view'] },
  { role: 'management', resource: 'myCampus', actions: ['view'] },
  { role: 'management', resource: 'networkTeaching', actions: ['view', 'edit'] },
  { role: 'management', resource: 'peoplePDI', actions: ['view', 'edit'] },
  { role: 'management', resource: 'reportsAnalytics', actions: ['view'] },
  { role: 'superadmin', resource: 'home', actions: actions },
  { role: 'superadmin', resource: 'userManagement', actions: actions },
  { role: 'superadmin', resource: 'contentManagement', actions: actions },
  { role: 'superadmin', resource: 'platformSettings', actions: actions },
  { role: 'superadmin', resource: 'campusManagement', actions: actions },
  { role: 'superadmin', resource: 'reportsAnalytics', actions: actions },
  { role: 'superadmin', resource: 'auditLog', actions: actions }
];

export const hasPermission = (role: Role, resource: Resource, action: Action): boolean => {
  const rule = allPermissions.find((item) => item.role === role && item.resource === resource);
  return !!rule && rule.actions.includes(action);
};

import { portalTabs } from './nav.js';

export const getRoleTabs = (role: Role) => portalTabs[role];

export const roles: Role[] = ['teacher', 'hos', 'admin', 'management', 'superadmin'];
