export interface TabConfig {
  id: string;
  label: string;
  path: string;
  resource: string;
  portal: string;
}

export const hubTabs: TabConfig[] = [
  { id: 'home', label: 'Home', path: '/edu-hub', resource: 'home', portal: 'teacher' },
  { id: 'whoWeAre', label: 'Who we are', path: '/edu-hub/who-we-are', resource: 'whoWeAre', portal: 'teacher' },
  { id: 'myCampus', label: 'My campus', path: '/edu-hub/my-campus', resource: 'myCampus', portal: 'teacher' },
  { id: 'teaching', label: 'Teaching', path: '/edu-hub/teaching', resource: 'teaching', portal: 'teacher' },
  { id: 'myClassroom', label: 'My classroom', path: '/edu-hub/my-classroom', resource: 'myClassroom', portal: 'teacher' },
  { id: 'interactions', label: 'Interactions', path: '/edu-hub/interactions', resource: 'interactions', portal: 'teacher' },
  { id: 'tickets', label: 'Tickets', path: '/edu-hub/tickets', resource: 'tickets', portal: 'teacher' },
  { id: 'grow', label: 'Grow', path: '/edu-hub/grow', resource: 'grow', portal: 'teacher' },
  { id: 'joining', label: 'Joining', path: '/edu-hub/joining', resource: 'joining', portal: 'teacher' }
];
