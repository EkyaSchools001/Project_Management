export type GuideCategory = "General" | "Observations" | "Goals" | "MOOCs" | "Analytics" | "Technical";

export interface GuideArticle {
  id: string;
  title: string;
  keywords: string[];
  content: string; // HTML or Markdown as simple string
  roles?: ("TEACHER" | "LEADER" | "ADMIN" | "SUPERADMIN" | "MANAGEMENT")[]; // If not present, applies to everyone
  route?: string; // Optional route where this is most relevant
  relatedArticleIds?: string[]; // IDs of related articles
}

export interface Insight {
  id: string;
  type: "milestone" | "deadline" | "discovery";
  title: string;
  description: string;
  role: ("TEACHER" | "LEADER" | "ADMIN" | "SUPERADMIN" | "MANAGEMENT")[];
  actionLabel?: string;
  actionId?: string;
}

export const PROACTIVE_INSIGHTS: Insight[] = [
  {
    id: "m1",
    type: "milestone",
    role: ["TEACHER"],
    title: "Milestone Achieved! 🎉",
    description: "You've successfully reflected on 5 observations this term. Great consistency!",
  },
  {
    id: "d1",
    type: "deadline",
    role: ["TEACHER"],
    title: "Pending Reflections",
    description: "You have 3 observations waiting for your reflection. Want to complete them now?",
    actionLabel: "View Observations",
    actionId: "teacher-reflection"
  },
  {
    id: "f1",
    type: "discovery",
    role: ["TEACHER", "LEADER", "ADMIN"],
    title: "Pro Tip: PDF Exports",
    description: "Did you know? You can now export your growth analytics as a high-quality PDF from the Reports page.",
  },
  {
    id: "l1",
    type: "deadline",
    role: ["LEADER"],
    title: "Schedule Visits",
    description: "It looks like you haven't scheduled any observations for next week. Keep the momentum going!",
    actionLabel: "Open Calendar",
    actionId: "schedule-observation"
  },
  {
    id: "insight-meeting-summary",
    type: "discovery",
    role: ["TEACHER", "LEADER"],
    title: "Meeting Finished",
    description: "I see your department meeting just finished. Would you like me to draft the MoM (Minutes of Meeting) based on the agenda?",
    actionLabel: "Draft MoM",
    actionId: "action-draft-mom"
  },
  {
    id: "insight-deadline-reminder",
    type: "deadline",
    role: ["TEACHER"],
    title: "Goal Reflection Due",
    description: "Hi there, your self-reflection for the Q2 Goal Window is due in 3 days. Do you want to start it now?",
    actionLabel: "Start Reflection",
    actionId: "action-start-reflection"
  },
  {
    id: "insight-obs-debrief",
    type: "discovery",
    role: ["LEADER"],
    title: "Observation Completed",
    description: "You just completed an observation for Mrs. Smith. Would you like help drafting the actionable feedback?",
    actionLabel: "Draft Feedback",
    actionId: "action-draft-feedback"
  }
];

export const QUICK_ACTIONS = [
  {
    id: "action-schedule-meeting",
    title: "Schedule a meeting with John for next Tuesday",
    keywords: ["schedule", "meeting", "book", "setup", "calendar"],
    roles: ["TEACHER", "LEADER", "ADMIN"]
  },
  {
    id: "action-create-goal",
    title: "Create a new goal for improving student engagement",
    keywords: ["create", "goal", "target", "okr", "new goal", "add goal"],
    roles: ["TEACHER", "LEADER"]
  },
  {
    id: "action-log-pd",
    title: "Log 2 hours of PD for the recent workshop",
    keywords: ["log", "pd", "hours", "professional", "development", "add hours", "record"],
    roles: ["TEACHER", "LEADER"]
  },
  {
    id: "action-form-assistant",
    title: "Fill Learning Festival Application Form",
    keywords: ["form", "learning festival", "application", "apply", "fill form"],
    roles: ["TEACHER", "LEADER", "ADMIN"]
  }
];

export const QUICK_TIPS = {
  TEACHER: [
    { label: "My Growth Portfolio", articleId: "teacher-portfolio", route: "/teacher" },
    { label: "Add MOOC Submission", articleId: "submit-mooc", route: "/courses" },
    { label: "Reflect on Observations", articleId: "teacher-reflection", route: "/teacher" },
  ],
  LEADER: [
    { label: "Schedule Observation", articleId: "schedule-observation", route: "/leader" },
    { label: "Target vs Actual Analytics", articleId: "leader-analytics", route: "/reports" },
    { label: "Assign a Goal", articleId: "assign-goal", route: "/goals" },
  ],
  ADMIN: [
    { label: "Review MOOCs", articleId: "admin-moocs", route: "/courses" },
    { label: "Overall Campus Analytics", articleId: "admin-analytics", route: "/reports" },
  ],
  SUPERADMIN: [
    { label: "System Configuration", articleId: "admin-analytics", route: "/settings" },
    { label: "Access Control", articleId: "admin-analytics", route: "/settings" },
  ],
  MANAGEMENT: [
    { label: "System-Wide Analytics", articleId: "admin-analytics", route: "/reports" },
  ]
};

export const guideArticles: GuideArticle[] = [
  // --- TEACHER GUIDES ---
  {
    id: "teacher-portfolio",
    title: "How to view my Growth Portfolio?",
    keywords: ["portfolio", "growth", "teacher dashboard", "my progress"],
    roles: ["TEACHER"],
    relatedArticleIds: ["teacher-reflection", "submit-mooc"],
    content: `
      <p>Your Growth Portfolio acts as a comprehensive summary of your professional journey.</p>
      <ol>
        <li>Go to your <strong>Dashboard</strong>.</li>
        <li>Scroll down to the <strong>My Growth Portfolio</strong> section.</li>
        <li>Here, you will find your Recent Observations, Annual Goals, and Completed MOOCs.</li>
      </ol>
      <p>💡 <em>Tip: Use the "View Full Analytics" button to drill down into specific observation domains.</em></p>
    `
  },
  {
    id: "submit-mooc",
    title: "How do I submit a new MOOC or Certification?",
    keywords: ["mooc", "course", "certification", "submit", "add", "evidence"],
    roles: ["TEACHER"],
    relatedArticleIds: ["teacher-portfolio"],
    content: `
      <p>Submitting external certifications is easy:</p>
      <ol>
        <li>Navigate to the <strong>Courses</strong> module in the sidebar.</li>
        <li>Click the <strong>Add Certification/MOOC</strong> button.</li>
        <li>Fill in the course details, duration, platform, and paste your certificate Drive link.</li>
        <li>Click <strong>Submit</strong>. Your campus Admin will review and approve it.</li>
      </ol>
    `
  },
  {
    id: "teacher-reflection",
    title: "How do I reflect on a completed Observation?",
    keywords: ["reflect", "reflection", "observation", "feedback", "post-observation"],
    roles: ["TEACHER"],
    relatedArticleIds: ["teacher-portfolio"],
    content: `
      <p>Reflecting on leadership feedback is a core part of the TD cycle.</p>
      <ol>
        <li>On your Dashboard, look for the <strong>Recent Observations</strong> section.</li>
        <li>If an observation has a "Pending Reflection" status, click the <strong>Reflect</strong> button.</li>
        <li>A form will open allowing you to submit your self-reflection and thoughts on the feedback.</li>
        <li>Once submitted, the status changes to "Completed".</li>
      </ol>
    `
  },

  // --- LEADER GUIDES ---
  {
    id: "schedule-observation",
    title: "How do I schedule an Observation?",
    keywords: ["schedule", "observation", "calendar", "plan", "book", "visit"],
    roles: ["LEADER"],
    relatedArticleIds: ["leader-analytics"],
    content: `
      <p>To schedule a classroom visit:</p>
      <ol>
        <li>Go to the <strong>Leader Dashboard</strong>.</li>
        <li>Locate the <strong>TD Calendar</strong> section.</li>
        <li>Click the <strong>Schedule Event</strong> button.</li>
        <li>Select "Observation" as the Entry Type.</li>
        <li>Pick the Teacher, Date, and Time, then click Save.</li>
      </ol>
      <p>The teacher will automatically see this in their Upcoming Scheduled Observations panel.</p>
    `
  },
  {
    id: "leader-analytics",
    title: "How do I view Target vs Actual Observation Analytics?",
    keywords: ["analytics", "target", "actual", "reports", "leader", "overview", "progress"],
    roles: ["LEADER"],
    relatedArticleIds: ["schedule-observation"],
    content: `
      <p>To track your observation progress against targets:</p>
      <ol>
        <li>Go to the <strong>Reports & Analytics</strong> module.</li>
        <li>Select the <strong>Growth Analytics</strong> tab.</li>
        <li>You will see a "Target vs Actual" progress bar and gauge chart detailing how many observations you have completed vs your weekly/monthly target.</li>
      </ol>
    `
  },
  {
    id: "assign-goal",
    title: "How do I assign a goal to a teacher?",
    keywords: ["goal", "assign", "target", "okr", "performance"],
    roles: ["LEADER"],
    content: `
      <p>To assign professional goals:</p>
      <ol>
        <li>Go to the <strong>Goals</strong> module from the sidebar.</li>
        <li>Click <strong>Assign New Goal</strong>.</li>
        <li>Select the Teacher, set the Goal description, timeline, and link it to an Ekya Pillar.</li>
        <li>Click <strong>Assign</strong>.</li>
      </ol>
    `
  },

  // --- ADMIN & MANAGEMENT GUIDES ---
  {
    id: "admin-moocs",
    title: "How do I review and approve MOOC submissions?",
    keywords: ["review", "approve", "reject", "mooc", "admin", "certifications"],
    roles: ["ADMIN", "MANAGEMENT", "SUPERADMIN"],
    content: `
      <p>As an admin, you verify teacher certifications:</p>
      <ol>
        <li>Navigate to the <strong>Courses</strong> dashboard.</li>
        <li>You will see a <strong>Pending Reviews</strong> queue.</li>
        <li>Click on a submission to view the details and evidence link.</li>
        <li>Click <strong>Approve</strong> or <strong>Request Changes</strong>.</li>
      </ol>
    `
  },
  {
    id: "admin-analytics",
    title: "Where can I see System-Wide Analytics?",
    keywords: ["system-wide", "analytics", "all campuses", "admin", "reports"],
    roles: ["ADMIN", "MANAGEMENT", "SUPERADMIN"],
    content: `
      <p>System-Wide insights are available in the Reports module.</p>
      <ol>
        <li>Go to <strong>Reports & Analytics</strong>.</li>
        <li>The default view acts as a "Bird's-Eye View" across all campuses.</li>
        <li>Use the Campus Filter dropdown at the top to drill down into specific locations.</li>
      </ol>
    `
  },

  // --- GENERAL GUIDES ---
  {
    id: "tech-support",
    title: "I found a bug. How do I report it?",
    keywords: ["bug", "error", "problem", "support", "help", "broken"],
    content: `
      <p>We're sorry you're experiencing issues!</p>
      <p>If something isn't working as expected, please take a screenshot and email our IT Support helpdesk at <strong>techproducts@ekyaschools.com</strong>.</p>
    `
  },
  // --- NAVIGATION & SIDEBAR GUIDES ---
  {
    id: "nav-dashboard",
    title: "Where can I find my Dashboard and Overview?",
    keywords: ["dashboard", "overview", "home", "main page", "sections"],
    content: `
      <p>Your <strong>Dashboard</strong> is the central hub of your platform. It provides an overview of your current progress and pending tasks.</p>
      <ul>
        <li>You can find it at the top of the sidebar under the <strong>Dashboard</strong> module.</li>
        <li>Click <strong>Overview</strong> to return to your main home page.</li>
      </ul>
    `
  },
  {
    id: "nav-growth",
    title: "How do I find Growth, Observations, and Goals?",
    keywords: ["growth", "observation", "goals", "performance", "okr", "progress", "sections"],
    content: `
      <p>All teacher development tracking is located in the <strong>Growth</strong> (or <strong>Growth & Performance</strong>) module.</p>
      <ul>
        <li><strong>Observation:</strong> Detailed classroom visit feedback.</li>
        <li><strong>Goals:</strong> Your professional targets and OKRs.</li>
        <li><strong>Progress Dashboard:</strong> A bird's-eye view of your development metrics.</li>
      </ul>
    `
  },
  {
    id: "nav-learning",
    title: "Where are the Courses and TD Calendar located?",
    keywords: ["learning", "training", "courses", "calendar", "training hours", "teacher development", "sections"],
    content: `
      <p>The <strong>Learning & Training</strong> section houses all your educational resources.</p>
      <ul>
        <li><strong>Courses:</strong> Your current MOOCs and certifications.</li>
        <li><strong>Training & Training Calendar:</strong> Upcoming school workshops and sessions.</li>
        <li><strong>Training Hours:</strong> A log of your total teacher development time.</li>
      </ul>
    `
  },
  {
    id: "nav-engagement",
    title: "Where do I find Meetings and Announcements?",
    keywords: ["engagement", "meetings", "announcements", "survey", "notifications", "sections"],
    content: `
      <p>The <strong>Engagement</strong> (or <strong>Operations</strong>) section is for coordination and school-wide updates.</p>
      <ul>
        <li><strong>Meetings:</strong> View upcoming meetings and Minutes of Meetings (MoM).</li>
        <li><strong>Announcements:</strong> Stay updated with school notifications.</li>
        <li><strong>Survey:</strong> Participate in school feedback surveys.</li>
      </ul>
    `
  },
  {
    id: "nav-admin-ops",
    title: "Admin: Where is User Management and Reports?",
    keywords: ["operations", "admin", "reports", "users", "user management", "settings", "attendance", "forms", "console", "sections"],
    roles: ["ADMIN", "SUPERADMIN", "LEADER"],
    content: `
      <p>For Leaders and Admins, the <strong>Operations</strong> and <strong>User Management</strong> sections provide system-wide controls.</p>
      <ul>
        <li><strong>User Management:</strong> Add or manage platform users.</li>
        <li><strong>Reports:</strong> Access campus or system-wide analytics.</li>
        <li><strong>Attendance Register:</strong> Manage teacher/student attendance logs.</li>
        <li><strong>Settings:</strong> Configure system preferences.</li>
        <li><strong>SuperAdmin Console:</strong> (SuperAdmin only) Technical platform settings.</li>
      </ul>
    `
  },
  {
    id: "nav-management",
    title: "Management: Where is TD Index and Campus Performance?",
    keywords: ["management", "health", "tdi health", "performance", "impact", "campus performance", "survey", "festival", "learning festival", "sections"],
    roles: ["MANAGEMENT", "SUPERADMIN"],
    content: `
      <p>Management specific sections provide high-level insights into school performance.</p>
      <ul>
        <li><strong>TD Index:</strong> Strategic overview of platform health.</li>
        <li><strong>Campus Performance:</strong> Comparing metrics across different locations.</li>
        <li><strong>TD Impact:</strong> Measuring the effectiveness of training.</li>
        <li><strong>Learning Festival:</strong> Governance and achievement showcase.</li>
      </ul>
    `
  },
  {
    id: "change-password",
    title: "How do I change my password?",
    keywords: ["password", "change", "reset", "login", "security", "profile"],
    content: `
      <p>To update your security details:</p>
      <ol>
        <li>Click your <strong>Profile Avatar</strong> in the top right corner.</li>
        <li>Select <strong>View Profile</strong>.</li>
        <li>Go to the <strong>Settings</strong> tab.</li>
        <li>Enter your new password in the Security section and click <strong>Save Changes</strong>.</li>
      </ol>
    `
  },
  // --- NEW PLATFORM ROUTES (TRAINING DATA) ---
  {
    id: "hr-resources",
    title: "HR Resources Hub",
    keywords: ["hr", "resources", "human resources", "staff hub", "documents", "policies"],
    route: "/hr/resources",
    content: "The HR Resources Hub contains all institutional policies, staff handbooks, and official documents."
  },
  {
    id: "hr-wellbeing",
    title: "Educator Well-Being",
    keywords: ["wellbeing", "health", "mental health", "support", "teacher care"],
    route: "/hr/wellbeing",
    content: "Resources and support systems dedicated to the physical and mental well-being of our educators."
  },
  {
    id: "tech-schoology",
    title: "Schoology Integration",
    keywords: ["schoology", "lms", "learning management", "classroom", "online classes"],
    route: "/technology/schoology",
    content: "Access and manage your Schoology classroom directly from the PDI platform."
  },
  {
    id: "tech-google-workspace",
    title: "Google Workspace Hub",
    keywords: ["google", "workspace", "drive", "docs", "sheets", "slides", "forms", "meet", "calendar"],
    route: "/technology/google-workspace",
    content: "A centralized location for all Google Workspace tools including Docs, Sheets, Slides, and Calendar."
  },
  {
    id: "tech-greythr",
    title: "GreytHR Payroll & Leave",
    keywords: ["greythr", "payroll", "payslip", "leave", "attendance", "salary"],
    route: "/technology/greythr",
    content: "Direct access to GreytHR for managing your leave, viewing payslips, and tracking attendance."
  },
  {
    id: "tech-ekyaverse",
    title: "Ekyaverse (The Metaverse)",
    keywords: ["ekyaverse", "metaverse", "vr", "virtual", "3d classroom"],
    route: "/technology/ekyaverse",
    content: "Explore the virtual learning landscape of Ekyaverse, our institutional metaverse."
  },
  {
    id: "campus-cmr-nps",
    title: "CMR NPS Campus Info",
    keywords: ["cmr nps", "campus", "school info", "cmr", "nps"],
    route: "/campuses/cmr-nps/info",
    content: "Detailed information, vision, and leadership specific to the CMR NPS campus."
  },
  {
    id: "campus-ekya-byrathi",
    title: "Ekya Byrathi Campus Info",
    keywords: ["byrathi", "ekya byrathi", "campus", "school info"],
    route: "/campuses/ekya-byrathi/info",
    content: "Detailed information, vision, and leadership specific to the Ekya Byrathi campus."
  },
  {
    id: "meeting-dashboard",
    title: "Meetings & MoM Dashboard",
    keywords: ["meetings", "mom", "minutes of meeting", "agenda", "schedule meeting"],
    route: "/meetings",
    content: "Track upcoming meetings, view agendas, and manage Minutes of Meetings (MoM)."
  },
  {
    id: "portfolio-directory",
    title: "Staff Portfolio Directory",
    keywords: ["portfolios", "staff directory", "teacher records", "profiles"],
    route: "/portfolio",
    content: "Browse and search through the professional growth portfolios of all campus staff."
  }
];


// Helper to search articles
export function searchGuide(query: string, userRole?: string): GuideArticle[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return guideArticles.filter(article => {
    // Check role access
    if (article.roles && userRole && !article.roles.includes(userRole as any)) {
      return false;
    }

    // Search logic
    const matchesTitle = article.title.toLowerCase().includes(normalizedQuery);
    const matchesKeyword = article.keywords.some(k => k.toLowerCase().includes(normalizedQuery));
    const matchesContent = article.content.toLowerCase().includes(normalizedQuery);

    return matchesTitle || matchesKeyword || matchesContent;
  });
}
