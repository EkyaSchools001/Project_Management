import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import LoginPage from '../../modules/auth/pages/LoginPage';
import ForgotPasswordPage from '../../modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../modules/auth/pages/ResetPasswordPage';
import ProfilePage from '../../modules/auth/pages/ProfilePage';
import SettingsPage from '../../modules/auth/pages/SettingsPage';
import DashboardPage from '../../modules/dashboard/pages/DashboardPage';
import DepartmentListPage from '../../modules/departments/pages/Departments';
import DepartmentDetailsPage from '../../modules/departments/pages/DepartmentDetails';
import PDDepartmentHub from '../../modules/departments/pages/PDDepartmentHub';
import SchoolListPage from '../../modules/schools/pages/Schools';
import SchoolDetailsPage from '../../modules/schools/pages/SchoolDetails';
import UserManagementPage from '../../modules/users/pages/UserManagement';
import ProjectsPage from '../../modules/pms/pages/ProjectsPage';
import TasksPage from '../../modules/pms/pages/TasksPage';
import ReportsPage from '../../modules/pms/pages/ReportsPage';
import TeamMembersPage from '../../modules/pms/pages/TeamMembersPage';
import CalendarPage from '../../modules/pms/pages/CalendarPage';
import ChatPage from '../../modules/pms/pages/ChatPage';
import ProjectDetailsPage from '../../modules/pms/pages/ProjectDetailsPage';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { PERMISSIONS } from '../../utils/constants';
import AnalyticsPage from '../../modules/analytics/pages/AnalyticsPage';
import { useAuth } from '../../modules/auth/authContext';
import TicketingPortal from '../../modules/support/pages/TicketingPortal';
import TimeTrackingPage from '../../modules/time/pages/TimeTrackingPage';
import AICenterPage from '../../modules/ai/pages/AICenterPage';
import ReportsBuilderPage from '../../modules/reports/pages/ReportsBuilderPage';
import ReportsViewPage from '../../modules/reports/pages/ReportsViewPage';
import LMSPage from '../../modules/lms/pages/LMSPage';
import FinanceDashboardPage from '../../modules/finance/pages/FinanceDashboardPage';
import BudgetsPage from '../../modules/finance/pages/BudgetsPage';
import ExpensesPage from '../../modules/finance/pages/ExpensesPage';
import InvoicesPage from '../../modules/finance/pages/InvoicesPage';
import CoursePage from '../../modules/lms/pages/CoursePage';
import LessonPage from '../../modules/lms/pages/LessonPage';
import GamificationPage from '../../modules/gamification/pages/GamificationPage';
import LeaderboardPage from '../../modules/gamification/pages/LeaderboardPage';
import TenantManagementPage from '../../modules/tenant/pages/TenantManagementPage';
import TenantSettingsPage from '../../modules/tenant/pages/TenantSettingsPage';
import RBACDashboard from '../../modules/admin/pages/RBACDashboard';

const TestPage = () => (
    <div className="p-20 flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white font-sans">
        <h1 className="text-5xl font-black mb-4">Frontend Active ✅</h1>
        <p className="text-slate-400 text-lg">If you can see this, your Vite server and React app are running correctly.</p>
        <div className="mt-10 p-6 bg-slate-800 rounded-2xl border border-slate-700">
            <p className="text-primary font-bold">Next Steps:</p>
            <ul className="list-disc ml-5 mt-2 space-y-2 text-sm">
                <li>Check the <code className="bg-slate-700 px-2 py-1 rounded">/login</code> route.</li>
                <li>Ensure the backend is running at <code className="bg-slate-700 px-2 py-1 rounded">port 8888</code>.</li>
            </ul>
        </div>
        <a href="/login" className="mt-8 px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-colors">Go to Login</a>
    </div>
);

const ProtectedRoute = ({ children, permission }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const RedirectToPD = ({ prefix }) => {
    const location = useLocation();
    const newPath = `/departments/pd${location.pathname}${location.search}`;
    return <Navigate to={newPath} replace />;
};

const RoleBasedRedirect = () => {
    return <Navigate to="/dashboard" replace />;
};

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/test" element={<TestPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/departments/pd/*" element={
                <ProtectedRoute permission={PERMISSIONS.DEPARTMENTS}>
                    <PDDepartmentHub />
                </ProtectedRoute>
            } />

            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<RoleBasedRedirect />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />

                <Route path="departments" element={
                    <ProtectedRoute permission={PERMISSIONS.DEPARTMENTS}>
                        <DepartmentListPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:id" element={
                    <ProtectedRoute permission={PERMISSIONS.DEPARTMENTS}>
                        <DepartmentDetailsPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:id/projects" element={
                    <ProtectedRoute permission={PERMISSIONS.PROJECTS}>
                        <ProjectsPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:id/tasks" element={
                    <ProtectedRoute permission={PERMISSIONS.TASKS}>
                        <TasksPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:id/reports" element={
                    <ProtectedRoute permission={PERMISSIONS.REPORTS}>
                        <ReportsPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:id/team" element={
                    <ProtectedRoute permission={PERMISSIONS.DEPARTMENTS}>
                        <TeamMembersPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:id/calendar" element={
                    <ProtectedRoute permission={PERMISSIONS.CALENDAR}>
                        <CalendarPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:deptId/projects/:id" element={
                    <ProtectedRoute permission={PERMISSIONS.PROJECTS}>
                        <ProjectDetailsPage />
                    </ProtectedRoute>
                } />

                <Route path="departments/:id/chat" element={
                    <ProtectedRoute permission={PERMISSIONS.CHAT}>
                        <ChatPage />
                    </ProtectedRoute>
                } />

                <Route path="schools" element={
                    <ProtectedRoute permission={PERMISSIONS.SCHOOLS}>
                        <SchoolListPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:id" element={
                    <ProtectedRoute permission={PERMISSIONS.SCHOOLS}>
                        <SchoolDetailsPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:id/projects" element={
                    <ProtectedRoute permission={PERMISSIONS.PROJECTS}>
                        <ProjectsPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:id/tasks" element={
                    <ProtectedRoute permission={PERMISSIONS.TASKS}>
                        <TasksPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:id/reports" element={
                    <ProtectedRoute permission={PERMISSIONS.REPORTS}>
                        <ReportsPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:id/team" element={
                    <ProtectedRoute permission={PERMISSIONS.SCHOOLS}>
                        <TeamMembersPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:id/calendar" element={
                    <ProtectedRoute permission={PERMISSIONS.CALENDAR}>
                        <CalendarPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:schoolId/projects/:id" element={
                    <ProtectedRoute permission={PERMISSIONS.PROJECTS}>
                        <ProjectDetailsPage />
                    </ProtectedRoute>
                } />

                <Route path="schools/:id/chat" element={
                    <ProtectedRoute permission={PERMISSIONS.CHAT}>
                        <ChatPage />
                    </ProtectedRoute>
                } />

                <Route path="analytics" element={
                    <ProtectedRoute permission={PERMISSIONS.ANALYTICS}>
                        <AnalyticsPage />
                    </ProtectedRoute>
                } />

                <Route path="ai" element={
                    <ProtectedRoute>
                        <AICenterPage />
                    </ProtectedRoute>
                } />

                <Route path="users" element={
                    <ProtectedRoute permission={PERMISSIONS.USER_MGMT}>
                        <UserManagementPage />
                    </ProtectedRoute>
                } />

                <Route path="permissions" element={
                    <ProtectedRoute permission={PERMISSIONS.USER_MGMT}>
                        <UserManagementPage initialView="permissions" />
                    </ProtectedRoute>
                } />

                <Route path="rbac" element={
                    <ProtectedRoute permission={PERMISSIONS.USER_MGMT}>
                        <RBACDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/pms/projects" element={
                    <ProtectedRoute permission={PERMISSIONS.PROJECTS}>
                        <ProjectsPage />
                    </ProtectedRoute>
                } />
                <Route path="/pms/projects/:id" element={
                    <ProtectedRoute permission={PERMISSIONS.PROJECTS}>
                        <ProjectDetailsPage />
                    </ProtectedRoute>
                } />
                <Route path="/pms/tasks" element={
                    <ProtectedRoute permission={PERMISSIONS.TASKS}>
                        <TasksPage />
                    </ProtectedRoute>
                } />
                <Route path="/pms/reports" element={
                    <ProtectedRoute permission={PERMISSIONS.REPORTS}>
                        <ReportsPage />
                    </ProtectedRoute>
                } />
                <Route path="/pms/calendar" element={
                    <ProtectedRoute permission={PERMISSIONS.CALENDAR}>
                        <CalendarPage />
                    </ProtectedRoute>
                } />
                <Route path="/pms/chat" element={
                    <ProtectedRoute permission={PERMISSIONS.CHAT}>
                        <ChatPage />
                    </ProtectedRoute>
                } />
                <Route path="/pms/users" element={
                    <ProtectedRoute permission={PERMISSIONS.DEPARTMENTS}>
                        <TeamMembersPage />
                    </ProtectedRoute>
                } />
            </Route>

            <Route path="/support/tickets" element={
                <ProtectedRoute permission={PERMISSIONS.DASHBOARD}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<TicketingPortal />} />
            </Route>

            <Route path="/time" element={
                <ProtectedRoute permission={PERMISSIONS.DASHBOARD}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<TimeTrackingPage />} />
            </Route>

            <Route path="/reports" element={
                <ProtectedRoute permission={PERMISSIONS.REPORTS}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<ReportsViewPage />} />
                <Route path="builder" element={<ReportsBuilderPage />} />
            </Route>

            <Route path="/finance" element={
                <ProtectedRoute permission={PERMISSIONS.DASHBOARD}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<FinanceDashboardPage />} />
                <Route path="budgets" element={<BudgetsPage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
            </Route>

            <Route path="/lms" element={
                <ProtectedRoute permission={PERMISSIONS.DASHBOARD}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<LMSPage />} />
                <Route path="courses/:id" element={<CoursePage />} />
                <Route path="lessons/:id" element={<LessonPage />} />
            </Route>

            <Route path="/gamification" element={
                <ProtectedRoute permission={PERMISSIONS.DASHBOARD}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<GamificationPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
            </Route>

            <Route path="/admin/tenants" element={
                <ProtectedRoute permission={PERMISSIONS.USER_MGMT}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<TenantManagementPage />} />
            </Route>

            <Route path="/settings/tenant" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <TenantSettingsPage />
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            <Route path="/teacher/*" element={<RedirectToPD />} />
            <Route path="/leader/*" element={<RedirectToPD />} />
            <Route path="/admin/*" element={<RedirectToPD />} />
            <Route path="/management/*" element={<RedirectToPD />} />
            <Route path="/coordinator/*" element={<RedirectToPD />} />
            <Route path="/okr" element={<RedirectToPD />} />
            <Route path="/hr/*" element={<RedirectToPD />} />
            <Route path="/technology/*" element={<RedirectToPD />} />
            <Route path="/edu-hub/*" element={<RedirectToPD />} />
            <Route path="/campuses/*" element={<RedirectToPD />} />
            <Route path="/educator-hub/*" element={<RedirectToPD />} />
            <Route path="/portfolio/*" element={<RedirectToPD />} />
            <Route path="/announcements" element={<RedirectToPD />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
