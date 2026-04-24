export const MOCK_PROJECTS = [
  {
    id: 'p-1',
    name: 'School Website Redesign',
    description: 'Modernizing the public-facing website for Ekya Schools.',
    status: 'Active',
    budget: 5000,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    managerId: 'u-sa-1',
    departmentId: 'marketing',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-2',
    name: 'LMS Content Expansion',
    description: 'Developing new courses for the Grade 5-8 curriculum.',
    status: 'Active',
    budget: 2000,
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    managerId: 'u-adm-2',
    departmentId: 'pd',
    createdAt: new Date().toISOString()
  }
];

export const MOCK_TASKS = [
  {
    id: 't-1',
    title: 'Finalize Homepage Mockups',
    description: 'Complete the high-fidelity mockups for the new homepage.',
    status: 'InProgress',
    priority: 'High',
    dueDate: '2026-05-15',
    projectId: 'p-1',
    assigneeId: 'u-sa-1',
    creatorId: 'u-adm-7',
    createdAt: new Date().toISOString()
  },
  {
    id: 't-2',
    title: 'Review Course Outlines',
    description: 'Peer review of the new course outlines for the LMS.',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '2026-05-20',
    projectId: 'p-2',
    assigneeId: 'u-ts-1',
    creatorId: 'u-adm-2',
    createdAt: new Date().toISOString()
  }
];

export const MOCK_PMS_STATS = {
  totalProjects: 12,
  activeTasks: 45,
  completedTasks: 156,
  upcomingDeadlines: 8
};
