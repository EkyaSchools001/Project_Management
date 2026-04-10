# Backend Architecture & Mapping

This document outlines the backend architecture for SchoolOS, detailing the database schema, API structure, and the mapping between frontend pages and backend endpoints.

## 1. System Overview

- **Stack**: Node.js (v20+), Express.js (v5), Prisma ORM, PostgreSQL.
- **Security**: Helmet, CORS, JWT Authentication (`middlewares/auth.ts`).
- **Data Flow**: Frontend (React) -> API (Express) -> Service Layer -> Data Access (Prisma) -> Database (PostgreSQL).

## 2. Directory Structure (`server/src`)

```
server/src/
├── app.ts                 # Express App setup & middleware
├── server.ts              # Entry point (Server listener)
├── config/                # Configuration (Env vars, DB config)
├── controllers/           # Request handlers (Input validation, Response formatting)
├── services/              # Business logic (interactions with Prisma)
├── routes/                # Route definitions
├── middlewares/           # Auth, Error handling, Validation
├── utils/                 # Helper functions (Logger, Response wrapper)
└── types/                 # TypeScript interfaces and global types
```

## 3. Database Schema (Prisma)

Based on `server/prisma/schema.prisma`:

### Core Models
- **Profile**: Users (School Heads, Managers, Teachers). Includes Role & Department linkage.
- **School**: Educational institutions.
- **Department**: Sub-units within schools (e.g., Mathematics, Science).
- **PermissionOverride**: Fine-grained access control per user.

### PMS (Project Management System)
- **Project**: Initiatives managed by departments.
    - `status`: Active, Archived, Completed.
    - `creator`: The Profile who created it.
- **Task**: Action items within projects.
    - `status`: Todo, In Progress, Review, Done.
    - `priority`: Low, Medium, High, Urgent.
    - `assignee`: The Profile responsible for the task.
    - `dueDate`: Deadline.

### Growth & Communication
- **GrowthMetric**: Performance/Engagement data points for users.
- **Conversation / Message**: Internal messaging system.

## 4. API Endpoint Map (Frontend <-> Backend)

This section maps frontend pages to the necessary backend API endpoints and their corresponding controller actions.

### A. Authentication & User Management

| Frontend Page | Action | API Endpoint | Method | Controller/Service Function |
| :--- | :--- | :--- | :--- | :--- |
| **Login Page** | User Login | `/api/v1/auth/login` | POST | `AuthController.login` |
| **User Profile** | Get My Profile | `/api/v1/auth/me` | GET | `AuthController.getMe` |
| **User Management** | List Users | `/api/v1/users` | GET | `UserController.getAllUsers` |
| **User Management** | Create User | `/api/v1/users` | POST | `UserController.createUser` |
| **User Details** | Update Role/Dept | `/api/v1/users/:id` | PUT | `UserController.updateUser` |

### B. Project Management System (PMS)

| Frontend Page | Action | API Endpoint | Method | Controller/Service Function |
| :--- | :--- | :--- | :--- | :--- |
| **ProjectsPage** | View Project List | `/api/v1/pms/projects` | GET | `PmsController.getProjects` |
| **ProjectsPage** | Create New Project | `/api/v1/pms/projects` | POST | `PmsController.createProject` |
| **ProjectDetails** | View Project Info | `/api/v1/pms/projects/:id` | GET | `PmsController.getProjectById` |
| **ProjectDetails** | Update Status | `/api/v1/pms/projects/:id` | PATCH | `PmsController.updateProject` |
| **ProjectDetails** | Delete Project | `/api/v1/pms/projects/:id` | DELETE | `PmsController.deleteProject` |
| **TasksPage** | View Task List | `/api/v1/pms/tasks?projectId=...` | GET | `PmsController.getTasks` |
| **TasksPage** | Create Task | `/api/v1/pms/tasks` | POST | `PmsController.createTask` |
| **TaskDetails** | View Task Details | `/api/v1/pms/tasks/:id` | GET | `PmsController.getTaskById` |
| **TaskDetails** | Update Status/Assignee | `/api/v1/pms/tasks/:id` | PATCH | `PmsController.updateTask` |
| **ReportsPage** | Get PMS Analytics | `/api/v1/pms/stats` | GET | `PmsController.getPmsStats` |

### C. Growth & Analytics

| Frontend Page | Action | API Endpoint | Method | Controller/Service Function |
| :--- | :--- | :--- | :--- | :--- |
| **GrowthDashboard** | View Performance | `/api/v1/growth/metrics` | GET | `GrowthController.getMetrics` |
| **GrowthDashboard** | Log New Metric | `/api/v1/growth/metrics` | POST | `GrowthController.logMetric` |
| **AnalyticsPage** | School-wide Stats | `/api/v1/analytics/overview` | GET | `AnalyticsController.getOverview` |

### D. Schools & Departments (Metadata)

| Frontend Page | Action | API Endpoint | Method | Controller/Service Function |
| :--- | :--- | :--- | :--- | :--- |
| **System Settings** | List Schools | `/api/v1/schools` | GET | `SchoolController.getAllSchools` |
| **System Settings** | List Departments | `/api/v1/departments` | GET | `DepartmentController.getAllDepartments` |

## 5. Next Implementation Steps

1.  **Refactor `pms.controller.ts`**: Expand beyond just `getProjects` and `createProject` to include full CRUD for Projects and Tasks.
2.  **Create Service Layer**: Move business logic from controllers to dedicated services (`PmsService`, `UserService`).
3.  **Implement Auth Middleware**: Ensure all `/api/v1/pms` routes are protected.
4.  **Frontend Integration**: Update `src/services/api.js` (or similar) to use these defined endpoints.
