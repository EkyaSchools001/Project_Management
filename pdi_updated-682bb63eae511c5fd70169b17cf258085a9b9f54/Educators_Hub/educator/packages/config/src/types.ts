export type Role = 'teacher' | 'hos' | 'admin' | 'management' | 'superadmin';
export type Action = 'view' | 'create' | 'edit' | 'delete' | 'publish';
export type Resource =
  | 'home'
  | 'whoWeAre'
  | 'myCampus'
  | 'teaching'
  | 'myClassroom'
  | 'grow'
  | 'joining'
  | 'peoplePDI'
  | 'policiesApprovals'
  | 'userManagement'
  | 'contentManagement'
  | 'platformSettings'
  | 'campusManagement'
  | 'reportsAnalytics'
  | 'auditLog'
  | 'networkTeaching'
  | 'studentRecords'
  | 'timetableCalendar'
  | 'platformAccess'
  | 'raiseTicket';

export type TabConfig = {
  id: string;
  label: string;
  path: string;
  resource: Resource;
  portal: Role | 'educator';
};

export type PermissionRule = {
  role: Role;
  resource: Resource;
  actions: Action[];
};
