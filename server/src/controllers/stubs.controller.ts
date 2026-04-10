import { Request, Response } from 'express';

// ─── Shared Mock Data ────────────────────────────────────────────────────────

const MOCK_TEACHERS = [
  { id: 'teacher_001', name: 'Sarah Mitchell', email: 'sarah.mitchell@ekyaschools.com', role: 'TEACHER', department: 'Mathematics', campusId: 'EK-North', pdHours: 24, score: 3.6 },
  { id: 'teacher_002', name: 'James Okafor',   email: 'james.okafor@ekyaschools.com',  role: 'TEACHER', department: 'English',      campusId: 'EK-South', pdHours: 18, score: 3.2 },
  { id: 'teacher_003', name: 'Priya Sharma',   email: 'priya.sharma@ekyaschools.com',   role: 'TEACHER', department: 'Science',      campusId: 'EK-North', pdHours: 30, score: 3.8 },
  { id: 'teacher_004', name: 'Anil Kumar',     email: 'anil.kumar@ekyaschools.com',     role: 'TEACHER', department: 'Social',       campusId: 'EK-East',  pdHours: 12, score: 2.9 },
  { id: 'teacher_005', name: 'Meera Nair',     email: 'meera.nair@ekyaschools.com',     role: 'TEACHER', department: 'Arts',         campusId: 'EK-South', pdHours: 22, score: 3.5 },
];

const MOCK_OBSERVATIONS = [
  {
    id: 'obs_001', teacher: 'Sarah Mitchell', teacherId: 'teacher_001', teacherEmail: 'sarah.mitchell@ekyaschools.com',
    observer: 'Dr. Ramesh Kumar', date: '2025-03-15', type: 'Danielson Framework',
    score: 3.6, status: 'SUBMITTED', campusId: 'EK-North', campus: 'EK-North',
    actionStep: 'Focus on differentiated instruction strategies for diverse learners.',
    notes: 'Strong classroom management. Excellent use of questioning techniques.',
    hasReflection: true, teacherReflection: '',
    domains: { planning: 3.5, classroom: 3.8, instruction: 3.6, growth: 3.5 },
    metaTags: ['Differentiation', 'Questioning', 'Engagement'],
  },
  {
    id: 'obs_002', teacher: 'James Okafor', teacherId: 'teacher_002', teacherEmail: 'james.okafor@ekyaschools.com',
    observer: 'Ms. Anita Rao', date: '2025-03-20', type: 'Quick Feedback',
    score: 3.2, status: 'SUBMITTED', campusId: 'EK-South', campus: 'EK-South',
    actionStep: 'Incorporate more collaborative learning activities.',
    notes: 'Good rapport with students. Needs to improve lesson pacing.',
    hasReflection: false, teacherReflection: '',
    metaTags: ['Collaboration', 'Pacing'],
  },
  {
    id: 'obs_003', teacher: 'Priya Sharma', teacherId: 'teacher_003', teacherEmail: 'priya.sharma@ekyaschools.com',
    observer: 'Dr. Ramesh Kumar', date: '2025-04-01', type: 'Danielson Framework',
    score: 3.8, status: 'SUBMITTED', campusId: 'EK-North', campus: 'EK-North',
    actionStep: 'Continue excellent practices; explore cross-curricular connections.',
    notes: 'Outstanding inquiry-based teaching. Students highly engaged.',
    hasReflection: true, teacherReflection: 'I felt the lesson went well. I will explore more ways to connect topics.',
    metaTags: ['Inquiry', 'Engagement', 'Cross-curricular'],
  },
];

const MOCK_GOALS = [
  {
    id: 'goal_001', teacher: 'Sarah Mitchell', teacherId: 'teacher_001', teacherEmail: 'sarah.mitchell@ekyaschools.com',
    title: 'Implement differentiated instruction strategies in all units',
    category: 'Pedagogy', progress: 65, status: 'IN_PROGRESS',
    dueDate: 'Jun 30, 2025', assignedBy: 'Dr. Ramesh Kumar',
    description: 'Focus on providing tiered activities for diverse learning needs.',
    campus: 'EK-North', ay: '25-26', isSchoolAligned: true,
    assignedDate: '2025-01-10T00:00:00Z',
  },
  {
    id: 'goal_002', teacher: 'James Okafor', teacherId: 'teacher_002', teacherEmail: 'james.okafor@ekyaschools.com',
    title: 'Improve collaborative learning outcomes by 20%',
    category: 'Student Engagement', progress: 40, status: 'IN_PROGRESS',
    dueDate: 'May 31, 2025', assignedBy: 'Ms. Anita Rao',
    description: 'Increase peer learning activities across all English units.',
    campus: 'EK-South', ay: '25-26', isSchoolAligned: true,
    assignedDate: '2025-02-01T00:00:00Z',
  },
  {
    id: 'goal_003', teacher: 'Priya Sharma', teacherId: 'teacher_003', teacherEmail: 'priya.sharma@ekyaschools.com',
    title: 'Develop a cross-curricular STEM project framework',
    category: 'Curriculum', progress: 90, status: 'GOAL_COMPLETED',
    dueDate: 'Apr 15, 2025', assignedBy: 'Dr. Ramesh Kumar',
    description: 'Create an integrated Science-Math project for Grade 8.',
    campus: 'EK-North', ay: '25-26', isSchoolAligned: true,
    assignedDate: '2025-01-15T00:00:00Z',
  },
];

const MOCK_TRAINING_EVENTS = [
  {
    id: 'evt_001', title: 'Effective Questioning Strategies Workshop',
    date: '2025-04-20', endDate: '2025-04-20',
    location: 'EK-North Campus – Conference Hall',
    type: 'IN_SERVICE', category: 'Pedagogy',
    facilitator: 'Dr. Aiyana Redcloud', hours: 3,
    capacity: 30, registered: 18, spotsLeft: 12,
    isRegistered: false, status: 'UPCOMING',
    description: 'Deep dive into Bloom\'s taxonomy and higher-order questioning.',
  },
  {
    id: 'evt_002', title: 'Technology Integration in the Classroom',
    date: '2025-04-25', endDate: '2025-04-25',
    location: 'Online – Zoom', type: 'ONLINE', category: 'Technology',
    facilitator: 'Ms. Nkechi Obi', hours: 4,
    capacity: 50, registered: 45, spotsLeft: 5,
    isRegistered: true, status: 'UPCOMING',
    description: 'Hand-on workshop on using AI tools for lesson planning.',
  },
  {
    id: 'evt_003', title: 'Annual PDI Learning Festival 2025',
    date: '2025-05-10', endDate: '2025-05-12',
    location: 'Main Campus – Auditorium', type: 'FESTIVAL', category: 'Cross-Curricular',
    facilitator: 'Ekya Schools PD Team', hours: 12,
    capacity: 200, registered: 150, spotsLeft: 50,
    isRegistered: false, status: 'UPCOMING',
    description: 'Three-day learning celebration with keynotes, workshops, and showcases.',
  },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann_001', title: 'Goal Setting Window Opens April 15',
    content: 'The annual teacher goal setting window will open on April 15 and close on April 30. All staff must submit their professional goals by the deadline.',
    type: 'IMPORTANT', publishedAt: '2025-04-08T00:00:00Z',
    isAcknowledged: false, author: 'Admin',
  },
  {
    id: 'ann_002', title: 'Learning Festival Registration Now Open',
    content: 'Registration for the Ekya Annual PDI Learning Festival 2025 is now open. Seats are limited – register early!',
    type: 'INFO', publishedAt: '2025-04-05T00:00:00Z',
    isAcknowledged: true, author: 'PD Team',
  },
];

const MOCK_NOTIFICATIONS = [
  { id: 'notif_001', title: 'New Observation Submitted', message: 'Dr. Ramesh Kumar submitted an observation for your review.', type: 'OBSERVATION', read: false, createdAt: new Date().toISOString() },
  { id: 'notif_002', title: 'Goal Deadline Reminder', message: 'Your goal "Implement differentiated instruction" is due in 5 days.', type: 'GOAL', read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'notif_003', title: 'Training Event Reminder', message: 'Technology Integration workshop starts tomorrow at 9:00 AM.', type: 'TRAINING', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_COURSES = [
  {
    id: 'course_001', title: 'Foundations of Differentiated Instruction',
    description: 'Learn core strategies for meeting diverse learner needs.', category: 'Pedagogy',
    level: 'Intermediate', duration: '6 weeks', format: 'Self-paced', status: 'PUBLISHED',
    enrolled: 34, completionRate: 0.72, thumbnail: null,
  },
  {
    id: 'course_002', title: 'AI Tools for Educators',
    description: 'Practical hands-on course on integrating AI into daily teaching.', category: 'Technology',
    level: 'Beginner', duration: '4 weeks', format: 'Self-paced', status: 'PUBLISHED',
    enrolled: 51, completionRate: 0.55, thumbnail: null,
  },
];

const MOCK_MEETINGS = [
  {
    id: 'meet_001', title: 'Monthly PD Planning Meeting',
    agenda: 'Discuss upcoming training calendar and teacher feedback on Q3 observations.',
    scheduledAt: '2025-04-15T10:00:00Z', duration: 60, location: 'Staff Room A',
    organizer: 'Dr. Ramesh Kumar', attendees: ['teacher_001', 'teacher_002', 'teacher_003'],
    status: 'SCHEDULED', momPublished: false,
  },
];

const MOCK_TEMPLATES = [
  { id: 'tmpl_001', type: 'Reflection', name: 'Teacher Reflection Form', status: 'Active', fields: [] },
  { id: 'tmpl_002', type: 'Observation', name: 'Danielson Framework Form', status: 'Active', fields: [] },
];

// ─── Controllers ────────────────────────────────────────────────────────────

export const getNotifications = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { notifications: MOCK_NOTIFICATIONS } });
};

export const markNotificationRead = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: {} });
};

export const markAllNotificationsRead = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: {} });
};

export const deleteNotification = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: {} });
};

export const getSettings = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { settings: {} } });
};

export const getSettingByKey = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { setting: null } });
};

export const upsertSetting = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: {} });
};

export const getAccessMatrix = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { setting: null } });
};

export const getObservations = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { observations: MOCK_OBSERVATIONS } });
};

export const getGoals = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { goals: MOCK_GOALS } });
};

export const createGoal = (req: Request, res: Response) => {
  const newGoal = { id: `goal_${Date.now()}`, progress: 0, status: 'IN_PROGRESS', ...req.body };
  res.json({ status: 'success', data: { goal: newGoal } });
};

export const updateGoal = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { goal: { id: req.params.id, ...req.body } } });
};

export const requestGoalWindowOpen = (_req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Notification sent to administrators.' });
};

export const getGoalWindows = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { goalSettingOpen: true, completionOpen: true } });
};

export const getMooc = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { submissions: [] } });
};

export const submitMooc = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { submission: { id: `mooc_${Date.now()}` } } });
};

export const updateMoocStatus = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { id: req.params.id, ...req.body } });
};

export const getTraining = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { events: MOCK_TRAINING_EVENTS } });
};

export const getTrainingById = (req: Request, res: Response) => {
  const event = MOCK_TRAINING_EVENTS.find(e => e.id === req.params.id) || MOCK_TRAINING_EVENTS[0];
  res.json({ status: 'success', data: { event } });
};

export const createTraining = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { event: { id: `evt_${Date.now()}`, ...req.body } } });
};

export const updateTraining = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { event: { id: req.params.id, ...req.body } } });
};

export const deleteTraining = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { id: req.params.id } });
};

export const updateTrainingStatus = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { id: req.params.id, ...req.body } });
};

export const registerForTraining = (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Successfully registered for the event.', data: { eventId: req.params.id } });
};

export const getGrowthObservations = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { observations: MOCK_OBSERVATIONS } });
};

export const updateGrowthObservation = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { observation: { id: req.params.id, ...req.body } } });
};

export const getTemplates = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { templates: MOCK_TEMPLATES } });
};

export const getTemplateById = (req: Request, res: Response) => {
  const tmpl = MOCK_TEMPLATES.find(t => t.id === req.params.id) || MOCK_TEMPLATES[0];
  res.json({ status: 'success', data: { template: tmpl } });
};

export const getAnnouncements = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { announcements: MOCK_ANNOUNCEMENTS } });
};

export const getAnnouncementStats = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { stats: { total: 2, acknowledged: 1, pending: 1 } } });
};

export const acknowledgeAnnouncement = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { id: req.params.id } });
};

export const getMeetings = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { meetings: MOCK_MEETINGS } });
};

export const getMeetingById = (req: Request, res: Response) => {
  const meeting = MOCK_MEETINGS.find(m => m.id === req.params.id) || MOCK_MEETINGS[0];
  res.json({ status: 'success', data: { meeting } });
};

export const getMeetingMoM = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { mom: null, meetingId: req.params.meetingId } });
};

export const getSurveys = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { surveys: [], survey: null } });
};

export const getForms = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { forms: [] } });
};

export const getPdHours = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { total: 24, inService: 12, selfDirected: 8, online: 4, breakdown: [] } });
};

export const getPortfolio = (req: Request, res: Response) => {
  res.json({ status: 'success', data: { portfolio: [], achievements: [], summary: {}, timeline: [] } });
};

export const getAttendance = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { attendance: [] } });
};

export const getCourses = (_req: Request, res: Response) => {
  const params = new URLSearchParams(Object.entries((_req as any).query || {}).map(([k, v]) => [k, String(v)]));
  res.json({ status: 'success', data: { courses: MOCK_COURSES, enrolled: [] } });
};

export const getCourseById = (req: Request, res: Response) => {
  const course = MOCK_COURSES.find(c => c.id === req.params.id) || MOCK_COURSES[0];
  res.json({ status: 'success', data: { course } });
};

export const getMyEnrollments = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { enrollments: [] } });
};

export const getTeamMembers = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { teachers: MOCK_TEACHERS, team: MOCK_TEACHERS } });
};

export const getAssessments = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { assessments: [], myAssignments: [] } });
};

export const getAssessmentAnalytics = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { analytics: {} } });
};

export const getFestivals = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { festivals: [] } });
};

export const getFestivalAnalytics = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { analytics: {} } });
};

export const getFestivalApplications = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { applications: [] } });
};

export const getOkr = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { okr: [], dashboards: [] } });
};

export const getDashboards = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { dashboards: [] } });
};

export const getDashboardWidgetTypes = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { widgetTypes: [] } });
};

export const getAnalytics = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: { attendance: [], engagement: {}, feedback: {}, overview: {} } });
};

export const genericSuccess = (_req: Request, res: Response) => {
  res.json({ status: 'success', data: {} });
};
