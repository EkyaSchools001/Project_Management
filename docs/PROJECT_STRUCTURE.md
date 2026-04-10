# Project File Structure

Generated on: 17/2/2026, 1:57:40 pm

```text
testing
├── docs
│   ├── pms-features
│   │   ├── CALENDAR_INTEGRATION.md
│   │   ├── OVERVIEW.md
│   │   ├── PROJECTS_MODULE.md
│   │   ├── REPORTS_ANALYTICS.md
│   │   ├── TASKS_MODULE.md
│   │   └── USER_MANAGEMENT.md
│   ├── architecture_design.md
│   ├── BACKEND_ARCHITECTURE_PLAN.md
│   ├── calendar_module_design.md
│   ├── COLLABORATION_GUIDE.md
│   ├── DATABASE_FIX_GUIDE.md
│   ├── DEPLOY_GUIDE.md
│   ├── DISCORD_SETUP_GUIDE.md
│   ├── FUTURE_ENHANCEMENTS.md
│   ├── GOOGLE_OAUTH_SETUP.md
│   ├── PROJECT_STATUS.md
│   ├── README.md
│   ├── ROLE_MIGRATION_GUIDE.md
│   ├── SCHOOLOS_SYSTEM_DESIGN.md
│   ├── SCHOOLOS_SYSTEM_DESIGN.pdf
│   └── STATUS_REPORT.md
├── public
│   ├── ekya-logo.png
│   └── vite.svg
├── server
│   ├── prisma
│   │   └── schema.prisma
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   │   ├── analytics.controller.ts
│   │   │   ├── growth.controller.ts
│   │   │   └── pms.controller.ts
│   │   ├── middlewares
│   │   │   └── auth.ts
│   │   ├── routes
│   │   │   ├── analytics.routes.ts
│   │   │   ├── growth.routes.ts
│   │   │   └── pms.routes.ts
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
├── src
│   ├── app
│   │   ├── layouts
│   │   │   └── DashboardLayout.jsx
│   │   ├── providers
│   │   └── routes
│   │       └── AppRoutes.jsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── common
│   │   ├── home
│   │   │   └── DashboardPreview.tsx
│   │   ├── layout
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── navigation
│   │   │   └── Sidebar.jsx
│   │   ├── ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── ButtonLegacy.jsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── CardLegacy.jsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   ├── AIAnalysisModal.tsx
│   │   ├── DynamicForm.tsx
│   │   ├── GoalCard.tsx
│   │   ├── GoalSettingForm.tsx
│   │   ├── LeaderPerformanceAnalytics.tsx
│   │   ├── MoocEvidenceForm.tsx
│   │   ├── NavLink.tsx
│   │   ├── ObservationCard.tsx
│   │   ├── ReflectionForm.tsx
│   │   ├── RoleBadge.tsx
│   │   ├── StatCard.tsx
│   │   ├── TeacherAnalyticsReport.tsx
│   │   └── TrainingEventCard.tsx
│   ├── data
│   │   ├── activity.js
│   │   ├── departments.json
│   │   ├── organization.js
│   │   ├── pmsData.js
│   │   ├── roles.json
│   │   ├── schools.json
│   │   └── users.js
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useRoleAccess.js
│   ├── integrations
│   │   └── supabase
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib
│   │   ├── groq.ts
│   │   ├── template-utils.ts
│   │   └── utils.ts
│   ├── modules
│   │   ├── analytics
│   │   │   └── pages
│   │   │       └── AnalyticsPage.jsx
│   │   ├── auth
│   │   │   ├── components
│   │   │   ├── pages
│   │   │   │   └── LoginPage.jsx
│   │   │   └── authContext.jsx
│   │   ├── dashboard
│   │   │   ├── components
│   │   │   └── pages
│   │   │       └── DashboardPage.jsx
│   │   ├── departments
│   │   │   ├── Admissions
│   │   │   ├── BrandGrowth
│   │   │   ├── FinanceAccounts
│   │   │   ├── HR
│   │   │   ├── LearningCentre
│   │   │   ├── Marketing
│   │   │   ├── Operations
│   │   │   ├── pages
│   │   │   │   ├── DepartmentDetails.jsx
│   │   │   │   └── Departments.jsx
│   │   │   ├── ProfessionalDevelopment
│   │   │   ├── QualityAssurance
│   │   │   ├── StrategicInnovation
│   │   │   ├── StudentDevelopment
│   │   │   ├── Technology
│   │   │   ├── WellBeing
│   │   │   └── DepartmentListPage.jsx
│   │   ├── growth
│   │   │   ├── components
│   │   │   ├── integrations
│   │   │   │   ├── client.ts
│   │   │   │   └── types.ts
│   │   │   └── pages
│   │   │       ├── admin
│   │   │       │   ├── AdminCalendarView.tsx
│   │   │       │   ├── AdminReportsView.tsx
│   │   │       │   ├── CourseManagementView.tsx
│   │   │       │   ├── FormTemplatesView.tsx
│   │   │       │   ├── SystemSettingsView.tsx
│   │   │       │   └── UserManagementView.tsx
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── Auth.tsx
│   │   │       ├── LandingPage.tsx
│   │   │       ├── LeaderDashboard.tsx
│   │   │       ├── NotFound.tsx
│   │   │       └── TeacherDashboard.tsx
│   │   ├── pms
│   │   │   ├── components
│   │   │   │   ├── ChatSidebar.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── CreateProjectModal.jsx
│   │   │   │   ├── CreateTaskModal.jsx
│   │   │   │   ├── FloatingChatbot.jsx
│   │   │   │   ├── QuickAddTaskModal.jsx
│   │   │   │   ├── ReportsDashboard.jsx
│   │   │   │   ├── ReportsGantt.jsx
│   │   │   │   ├── ReportsSquadLogs.jsx
│   │   │   │   └── ScheduleMeetingModal.jsx
│   │   │   └── pages
│   │   │       ├── CalendarPage.jsx
│   │   │       ├── ChatPage.jsx
│   │   │       ├── ProjectDetailsPage.jsx
│   │   │       ├── ProjectsPage.jsx
│   │   │       ├── ReportsPage.jsx
│   │   │       ├── TasksPage.jsx
│   │   │       └── TeamMembersPage.jsx
│   │   ├── roles
│   │   │   ├── Admin
│   │   │   ├── Guest
│   │   │   ├── ManagementAdmin
│   │   │   ├── SuperAdmin
│   │   │   └── TeacherStaff
│   │   ├── schools
│   │   │   ├── pages
│   │   │   │   ├── SchoolDetails.jsx
│   │   │   │   └── Schools.jsx
│   │   │   ├── ProgressiveSchools
│   │   │   ├── PurposeBasedSchools
│   │   │   ├── WorldSchool
│   │   │   └── SchoolListPage.jsx
│   │   └── users
│   │       └── pages
│   │           └── UserManagement.jsx
│   ├── services
│   │   ├── api.js
│   │   ├── socketService.js
│   │   └── userService.js
│   ├── styles
│   ├── types
│   │   └── observation.ts
│   ├── utils
│   │   ├── constants.js
│   │   └── permissions.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── vite-env.d.ts
├── .gitignore
├── create-dirs.cjs
├── CREDENTIALS_REGISTRY.md
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.js

```
