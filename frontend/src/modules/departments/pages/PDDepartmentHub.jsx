/**
 * PDDepartmentHub.jsx
 * Mounts the complete pdi_updated-main frontend at /departments/pd/*
 * Acting as a thin shell that wires SchoolOS auth into the PDI system.
 */

import React from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@pdi/components/ui/tooltip';
import { PermissionProvider } from '@pdi/contexts/PermissionContext';
import { AIProvider } from '@pdi/contexts/AIContext';
import ErrorBoundary from '@pdi/components/ErrorBoundary';
import { useAuth } from '@/modules/auth/authContext';
import { DashboardLayout } from '@pdi/components/layout/DashboardLayout';
import PDIProtectedRoute from '@pdi/components/ProtectedRoute';

// ---- Full PDI page imports ------------------------------------------------
import TeacherDashboard from '@pdi/pages/TeacherDashboard';
import LeaderDashboard  from '@pdi/pages/LeaderDashboard';
import GrowthPage       from '@pdi/pages/GrowthPage';
import AnnouncementsPage from '@pdi/pages/AnnouncementsPage';
import OKRDashboard     from '@pdi/pages/OKRDashboard';
import SurveyPage       from '@pdi/pages/SurveyPage';
import AttendanceRegister from '@pdi/pages/AttendanceRegister';
import { MeetingsDashboard } from '@pdi/pages/MeetingsDashboard';
import { MeetingMoMForm }   from '@pdi/pages/MeetingMoMForm';
import AdminDocumentManagement from '@pdi/pages/AdminDocumentManagement';
import { PortfolioIndex }    from '@pdi/pages/portfolio/PortfolioIndex';
import { TeacherPortfolio }  from '@pdi/pages/portfolio/TeacherPortfolio';
import { LearningFestivalPage } from '@pdi/pages/LearningFestival/LearningFestivalPage';
import { FestivalManagementDashboard } from '@pdi/pages/LearningFestival/FestivalManagementDashboard';
import EventAttendanceView from '@pdi/pages/EventAttendanceView';
// Leader-specific sub-pages
import LeaderGrowthPage from '@pdi/pages/leader/LeaderGrowthPage';
import DanielsonDashboard from '@pdi/pages/leader/DanielsonDashboard';
import DanielsonFrameworkPage from '@pdi/pages/leader/DanielsonFrameworkPage';
import QuickFeedbackDashboard from '@pdi/pages/leader/QuickFeedbackDashboard';
import QuickFeedbackPage from '@pdi/pages/leader/QuickFeedbackPage';
import NotesPage from '@pdi/pages/leader/NotesPage';
import PerformingArtsObsDashboard from '@pdi/pages/leader/PerformingArtsObsDashboard';
import PerformingArtsObsPage from '@pdi/pages/leader/PerformingArtsObsPage';
import LifeSkillsObsDashboard from '@pdi/pages/leader/LifeSkillsObsDashboard';
import LifeSkillsObsPage from '@pdi/pages/leader/LifeSkillsObsPage';
import PEObsDashboard from '@pdi/pages/leader/PEObsDashboard';
import PEObsPage from '@pdi/pages/leader/PEObsPage';
import VAObsDashboard from '@pdi/pages/leader/VAObsDashboard';
import VAObsPage from '@pdi/pages/leader/VAObsPage';
// Admin sub-pages
import AdminGrowthAnalyticsPage from '@pdi/pages/admin/AdminGrowthAnalyticsPage';
// Management sub-pages
import ManagementDashboard from '@pdi/pages/ManagementDashboard';
// Coordinator
import CoordinatorDashboard from '@pdi/pages/CoordinatorDashboard';

import InstitutionalIdentity from "@pdi/pages/educator-hub/InstitutionalIdentity";
import AcademicOperations from "@pdi/pages/educator-hub/AcademicOperations";
import PedagogyLearning from "@pdi/pages/educator-hub/PedagogyLearning";
import ProfessionalDevelopment from "@pdi/pages/educator-hub/ProfessionalDevelopment";
import Interactions from "@pdi/pages/educator-hub/Interactions";
import ManagementSupport from "@pdi/pages/educator-hub/ManagementSupport";
import PhilosophyPage from "@pdi/pages/educator-hub/PhilosophyPage";
import FoundersMessagePage from "@pdi/pages/educator-hub/FoundersMessagePage";
import OurSchoolsPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurSchoolsPage";
import CMRNPSPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CMRNPSPage";
import EkyaByrathiPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaByrathiPage";
import EkyaBtmLayoutPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaBtmLayoutPage";
import EkyaItplPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaItplPage";
import EkyaJpNagarPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaJpNagarPage";
import EkyaNiceRoadPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaNiceRoadPage";
import CmrpuhRbrPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhRbrPage";
import CmrpuhItplPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhItplPage";
import CmrpuhBtmPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhBtmPage";
import LegacyPage from "@pdi/pages/educator-hub/InstitutionalIdentity/LegacyPage";
import TeamsVisionPage from "@pdi/pages/educator-hub/InstitutionalIdentity/TeamsVisionPage";
import SchoolPrayerPage from "@pdi/pages/educator-hub/InstitutionalIdentity/SchoolPrayerPage";
import EduHubIndex from "@pdi/pages/edu-hub/EduHubIndex";
import MyDutiesPage from "@pdi/pages/edu-hub/MyDutiesPage";

// Campus Duties & Info Pages
import CMRNPSInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CMRNPSInfoPage";
import CmrNpsDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrNpsDutiesPage";
import EkyaByrathiInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaByrathiInfoPage";
import EkyaByrathiDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaByrathiDutiesPage";
import EkyaBtmLayoutInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaBtmLayoutInfoPage";
import EkyaBtmLayoutDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaBtmLayoutDutiesPage";
import EkyaItplInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaItplInfoPage";
import EkyaItplDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaItplDutiesPage";
import EkyaJpNagarInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaJpNagarInfoPage";
import EkyaJpNagarDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaJpNagarDutiesPage";
import EkyaNiceRoadInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaNiceRoadInfoPage";
import EkyaNiceRoadDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaNiceRoadDutiesPage";
import CmrpuhRbrInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhRbrInfoPage";
import CmrpuHrbrDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuHrbrDutiesPage";
import CmrpuhItplInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhItplInfoPage";
import CmrpuItplDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuItplDutiesPage";
import CmrpuhBtmInfoPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhBtmInfoPage";
import CmrpuBtmDutiesPage from "@pdi/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuBtmDutiesPage";

import ResourcesHub from "@pdi/pages/hr/ResourcesHub";
import EducatorGuide from "@pdi/pages/hr/EducatorGuide";
import EducatorEssentials from "@pdi/pages/hr/EducatorEssentials";
import WellBeing from "@pdi/pages/hr/WellBeing";
import TechSitesLogin from "@pdi/pages/technology/TechSitesLogin";
import GreytHRPage from "@pdi/pages/technology/GreytHRPage";
import SchoologyPage from "@pdi/pages/technology/SchoologyPage";
import GoogleWorkspacePage from "@pdi/pages/technology/GoogleWorkspacePage";
import GoogleFormsPage from "@pdi/pages/technology/GoogleFormsPage";
import GoogleSlidesPage from "@pdi/pages/technology/GoogleSlidesPage";
import GoogleSheetsPage from "@pdi/pages/technology/GoogleSheetsPage";
import GoogleDocsPage from "@pdi/pages/technology/GoogleDocsPage";
import GoogleCalendarPage from "@pdi/pages/technology/GoogleCalendarPage";
import GoogleMeetPage from "@pdi/pages/technology/GoogleMeetPage";
import GoogleMailPage from "@pdi/pages/technology/GoogleMailPage";
import ZoomPage from "@pdi/pages/technology/ZoomPage";
import SlackPage from "@pdi/pages/technology/SlackPage";
import EmailSignaturePage from "@pdi/pages/technology/EmailSignaturePage";
import EkyaversePage from "@pdi/pages/technology/EkyaversePage";
import InProgress from "@pdi/pages/InProgress";
import { AdminGoalsView } from "@pdi/pages/admin/AdminGoalsView";
import { AdminReportsView } from "@pdi/pages/admin/AdminReportsView";
import { AdminCalendarView } from "@pdi/pages/admin/AdminCalendarView";
import { ManagementGoalsView } from "@pdi/pages/management/ManagementGoalsView";
import { ManagementInsightsView } from "@pdi/pages/management/ManagementInsightsView";
import ManagementGrowthAnalyticsPage from "@pdi/pages/management/ManagementGrowthAnalyticsPage";
import { LearningInsightsView } from "@pdi/pages/leader/LearningInsightsView";
import { PDHoursAnalyticsView } from "@pdi/pages/admin/PDHoursAnalyticsView";
import { MoocManagementView } from "@pdi/pages/admin/MoocManagementView";
import { CourseManagementView } from "@pdi/pages/admin/CourseManagementView";
import { UserManagementView } from "@pdi/pages/admin/UserManagementView";
import { FormTemplatesView } from "@pdi/pages/admin/FormTemplatesView";
import { SystemSettingsView } from "@pdi/pages/admin/SystemSettingsView";
import { SuperAdminView } from "@pdi/pages/admin/SuperAdminView";
import TeacherAttendance from "@pdi/pages/TeacherAttendance";
import { LeaderPerformanceAnalytics } from "@pdi/components/LeaderPerformanceAnalytics";
import TeamMembersPage from "../../pms/pages/TeamMembersPage";

// ---------------------------------------------------------------------------

const pdiQueryClient = new QueryClient();

/** Normalise SchoolOS role → PDI canonical role string */
function normalisePDIRole(role) {
    const r = (role || '').toUpperCase();
    // All teacher variants → TEACHER
    if (r === 'TEACHERSTAFF' || r === 'TEACHER_STAFF' ||
        r === 'TEACHER_CORE' || r === 'TEACHER_SPECIALIST' ||
        r === 'TEACHER_SENIOR' || r === 'TEACHER_PARTTIME' ||
        r === 'LIBRARIAN' || r === 'NURSE' || r === 'SUPPORT_STAFF') return 'TEACHER';
    if (r === 'HOS' || r === 'SCHOOL_LEADER') return 'SCHOOL_LEADER';
    if (r === 'LEADER') return 'LEADER';
    if (r === 'ADMIN') return 'ADMIN';
    if (r === 'SUPERADMIN' || r === 'SUPER_ADMIN') return 'SUPERADMIN';
    if (r === 'MANAGEMENT' || r === 'MANAGEMENTADMIN') return 'MANAGEMENT';
    if (r === 'COORDINATOR') return 'COORDINATOR';
    return 'TEACHER';
}

/** Decide initial sub-path based on role */
function roleDefaultPath(role) {
    if (role === 'TEACHER') return '/departments/pd/teacher';
    if (role === 'MANAGEMENT') return '/departments/pd/management';
    if (role === 'COORDINATOR') return '/departments/pd/coordinator';
    if (role === 'ADMIN' || role === 'SUPERADMIN') return '/departments/pd/admin';
    return '/departments/pd/leader';
}

const PDIShell = ({ role, user }) => (
    <DashboardLayout 
        role={role.toLowerCase()} 
        userName={user?.fullName || 'Educator'}
    >
        <Outlet />
    </DashboardLayout>
);

export default function PDDepartmentHub() {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    const role = normalisePDIRole(user.role);

    const Providers = ({ children }) => (
        <QueryClientProvider client={pdiQueryClient}>
            <TooltipProvider>
                <AIProvider>
                    <PermissionProvider>
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </PermissionProvider>
                </AIProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );

    return (
        <Providers>
            <Routes>
                {/* Default → role-based landing */}
                <Route index element={<Navigate to={roleDefaultPath(role)} replace />} />

                {/* ── Dashboard routes (Internal layout) ── */}
                <Route path="teacher/*" element={<PDIProtectedRoute><TeacherDashboard /></PDIProtectedRoute>} />
                <Route path="leader/*"  element={<PDIProtectedRoute><LeaderDashboard /></PDIProtectedRoute>} />
                <Route path="admin/*"   element={<PDIProtectedRoute><LeaderDashboard /></PDIProtectedRoute>} />
                <Route path="management/*" element={<PDIProtectedRoute><ManagementDashboard /></PDIProtectedRoute>} />
                <Route path="coordinator/*" element={<PDIProtectedRoute><CoordinatorDashboard /></PDIProtectedRoute>} />

                {/* ── Shell-wrapped routes (Need shared layout) ── */}
                <Route element={<PDIShell role={role} user={user} />}>
                    {/* Shared module routes */}
                    <Route path="growth"                      element={<PDIProtectedRoute><GrowthPage /></PDIProtectedRoute>} />
                    <Route path="leader/growth"               element={<PDIProtectedRoute><LeaderGrowthPage /></PDIProtectedRoute>} />
                    <Route path="leader/growth/:teacherId"    element={<PDIProtectedRoute><LeaderGrowthPage /></PDIProtectedRoute>} />
                    <Route path="admin/growth-analytics"      element={<PDIProtectedRoute><AdminGrowthAnalyticsPage /></PDIProtectedRoute>} />
                    
                    {/* Observations (leader) */}
                    <Route path="leader/danielson-framework"          element={<PDIProtectedRoute><DanielsonDashboard /></PDIProtectedRoute>} />
                    <Route path="leader/danielson-framework/new"      element={<PDIProtectedRoute><DanielsonFrameworkPage /></PDIProtectedRoute>} />
                    <Route path="leader/danielson-framework/:teacherId" element={<PDIProtectedRoute><DanielsonFrameworkPage /></PDIProtectedRoute>} />
                    <Route path="leader/quick-feedback"               element={<PDIProtectedRoute><QuickFeedbackDashboard /></PDIProtectedRoute>} />
                    <Route path="leader/quick-feedback/new"           element={<PDIProtectedRoute><QuickFeedbackPage /></PDIProtectedRoute>} />
                    <Route path="leader/quick-feedback/:teacherId"    element={<PDIProtectedRoute><QuickFeedbackPage /></PDIProtectedRoute>} />
                    <Route path="leader/performing-arts-obs"          element={<PDIProtectedRoute><PerformingArtsObsDashboard /></PDIProtectedRoute>} />
                    <Route path="leader/performing-arts-obs/new"      element={<PDIProtectedRoute><PerformingArtsObsPage /></PDIProtectedRoute>} />
                    <Route path="leader/life-skills-obs"              element={<PDIProtectedRoute><LifeSkillsObsDashboard /></PDIProtectedRoute>} />
                    <Route path="leader/life-skills-obs/new"          element={<PDIProtectedRoute><LifeSkillsObsPage /></PDIProtectedRoute>} />
                    <Route path="leader/pe-obs"                       element={<PDIProtectedRoute><PEObsDashboard /></PDIProtectedRoute>} />
                    <Route path="leader/pe-obs/new"                   element={<PDIProtectedRoute><PEObsPage /></PDIProtectedRoute>} />
                    <Route path="leader/va-obs"                       element={<PDIProtectedRoute><VAObsDashboard /></PDIProtectedRoute>} />
                    <Route path="leader/va-obs/new"                   element={<PDIProtectedRoute><VAObsPage /></PDIProtectedRoute>} />
                    <Route path="leader/notes"                        element={<PDIProtectedRoute><NotesPage /></PDIProtectedRoute>} />

                    {/* Meetings */}
                    <Route path="meetings"               element={<PDIProtectedRoute><MeetingsDashboard /></PDIProtectedRoute>} />
                    <Route path="meetings/:meetingId"    element={<PDIProtectedRoute><MeetingMoMForm /></PDIProtectedRoute>} />
                    <Route path="meetings/:meetingId/mom" element={<PDIProtectedRoute><MeetingMoMForm /></PDIProtectedRoute>} />

                    {/* Portfolio */}
                    <Route path="portfolio"              element={<PDIProtectedRoute><PortfolioIndex /></PDIProtectedRoute>} />
                    <Route path="portfolio/:teacherId"   element={<PDIProtectedRoute><TeacherPortfolio /></PDIProtectedRoute>} />
                    <Route path="teacher/portfolio"      element={<PDIProtectedRoute><TeacherPortfolio /></PDIProtectedRoute>} />

                    {/* Announcements / OKR / Survey */}
                    <Route path="announcements"          element={<PDIProtectedRoute><AnnouncementsPage /></PDIProtectedRoute>} />
                    <Route path="okr"                    element={<PDIProtectedRoute><OKRDashboard /></PDIProtectedRoute>} />
                    <Route path="survey"                 element={<PDIProtectedRoute><SurveyPage /></PDIProtectedRoute>} />

                    {/* Learning Festival */}
                    <Route path="festival"               element={<PDIProtectedRoute><FestivalManagementDashboard /></PDIProtectedRoute>} />
                    <Route path="festival/page"          element={<PDIProtectedRoute><LearningFestivalPage /></PDIProtectedRoute>} />

                    {/* Documents & Attendance */}
                    <Route path="documents"              element={<PDIProtectedRoute><AdminDocumentManagement /></PDIProtectedRoute>} />
                    <Route path="attendance"             element={<PDIProtectedRoute><AttendanceRegister /></PDIProtectedRoute>} />
                    <Route path="attendance/:id"         element={<PDIProtectedRoute><EventAttendanceView /></PDIProtectedRoute>} />

                    {/* Leader sub-pages */}
                    <Route path="leader/performance"     element={<PDIProtectedRoute><LeaderPerformanceAnalytics /></PDIProtectedRoute>} />
                    <Route path="leader/goals"           element={<PDIProtectedRoute><AdminGoalsView /></PDIProtectedRoute>} />
                    <Route path="leader/insights"        element={<PDIProtectedRoute><LearningInsightsView /></PDIProtectedRoute>} />
                    <Route path="leader/participation"   element={<PDIProtectedRoute><PDHoursAnalyticsView /></PDIProtectedRoute>} />
                    <Route path="leader/courses"         element={<PDIProtectedRoute><CourseManagementView /></PDIProtectedRoute>} />
                    <Route path="leader/courses/assessments" element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />
                    <Route path="leader/mooc"            element={<PDIProtectedRoute><MoocManagementView /></PDIProtectedRoute>} />
                    <Route path="leader/hours"           element={<PDIProtectedRoute><PDHoursAnalyticsView /></PDIProtectedRoute>} />
                    <Route path="leader/reports"         element={<PDIProtectedRoute><AdminReportsView /></PDIProtectedRoute>} />
                    <Route path="leader/survey"          element={<PDIProtectedRoute><SurveyPage /></PDIProtectedRoute>} />
                    <Route path="leader/meetings"        element={<PDIProtectedRoute><MeetingsDashboard /></PDIProtectedRoute>} />
                    <Route path="leader/meetings/:meetingId" element={<PDIProtectedRoute><MeetingMoMForm /></PDIProtectedRoute>} />
                    <Route path="leader/team"            element={<PDIProtectedRoute><TeamMembersPage /></PDIProtectedRoute>} />
                    <Route path="leader/users"           element={<PDIProtectedRoute><UserManagementView /></PDIProtectedRoute>} />
                    <Route path="leader/forms"           element={<PDIProtectedRoute><FormTemplatesView /></PDIProtectedRoute>} />
                    <Route path="leader/settings"        element={<PDIProtectedRoute><SystemSettingsView /></PDIProtectedRoute>} />
                    <Route path="leader/calendar"        element={<PDIProtectedRoute><AdminCalendarView /></PDIProtectedRoute>} />
                    <Route path="leader/attendance"      element={<PDIProtectedRoute><AttendanceRegister /></PDIProtectedRoute>} />
                    <Route path="leader/festival"        element={<PDIProtectedRoute><LearningFestivalPage /></PDIProtectedRoute>} />

                    {/* Admin sub-pages */}
                    <Route path="admin/goals"            element={<PDIProtectedRoute><AdminGoalsView /></PDIProtectedRoute>} />
                    <Route path="admin/reports"          element={<PDIProtectedRoute><AdminReportsView /></PDIProtectedRoute>} />
                    <Route path="admin/calendar"         element={<PDIProtectedRoute><AdminCalendarView /></PDIProtectedRoute>} />
                    <Route path="admin/hours"            element={<PDIProtectedRoute><PDHoursAnalyticsView /></PDIProtectedRoute>} />
                    <Route path="admin/users"            element={<PDIProtectedRoute><UserManagementView /></PDIProtectedRoute>} />
                    <Route path="admin/forms"            element={<PDIProtectedRoute><FormTemplatesView /></PDIProtectedRoute>} />
                    <Route path="admin/settings"         element={<PDIProtectedRoute><SystemSettingsView /></PDIProtectedRoute>} />
                    <Route path="admin/superadmin"       element={<PDIProtectedRoute><SuperAdminView /></PDIProtectedRoute>} />
                    <Route path="admin/courses"          element={<PDIProtectedRoute><CourseManagementView /></PDIProtectedRoute>} />
                    <Route path="admin/courses/assessments" element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />
                    <Route path="admin/festival"         element={<PDIProtectedRoute><FestivalManagementDashboard /></PDIProtectedRoute>} />
                    <Route path="admin/mooc"             element={<PDIProtectedRoute><MoocManagementView /></PDIProtectedRoute>} />
                    <Route path="admin/meetings"         element={<PDIProtectedRoute><MeetingsDashboard /></PDIProtectedRoute>} />
                    <Route path="admin/meetings/:meetingId" element={<PDIProtectedRoute><MeetingMoMForm /></PDIProtectedRoute>} />
                    <Route path="admin/survey"           element={<PDIProtectedRoute><SurveyPage /></PDIProtectedRoute>} />
                    <Route path="admin/attendance"       element={<PDIProtectedRoute><AttendanceRegister /></PDIProtectedRoute>} />

                    {/* Management sub-pages (shell-wrapped variants) */}
                    <Route path="management/growth-analytics" element={<PDIProtectedRoute><ManagementGrowthAnalyticsPage /></PDIProtectedRoute>} />
                    <Route path="management/goals"       element={<PDIProtectedRoute><ManagementGoalsView /></PDIProtectedRoute>} />
                    <Route path="management/pdi-health"  element={<PDIProtectedRoute><ManagementInsightsView /></PDIProtectedRoute>} />
                    <Route path="management/hours"       element={<PDIProtectedRoute><PDHoursAnalyticsView /></PDIProtectedRoute>} />
                    <Route path="management/meetings"    element={<PDIProtectedRoute><MeetingsDashboard /></PDIProtectedRoute>} />
                    <Route path="management/survey"      element={<PDIProtectedRoute><SurveyPage /></PDIProtectedRoute>} />
                    <Route path="management/attendance"  element={<PDIProtectedRoute><AttendanceRegister /></PDIProtectedRoute>} />
                    <Route path="management/courses/assessments" element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />
                    <Route path="management/campus-performance" element={<PDIProtectedRoute><AdminReportsView /></PDIProtectedRoute>} />
                    <Route path="management/pd-impact"   element={<PDIProtectedRoute><PDHoursAnalyticsView /></PDIProtectedRoute>} />
                    <Route path="management/training-analytics" element={<PDIProtectedRoute><PDHoursAnalyticsView /></PDIProtectedRoute>} />

                    {/* Teacher sub-pages */}
                    <Route path="teacher/observations"  element={<PDIProtectedRoute><GrowthPage /></PDIProtectedRoute>} />
                    <Route path="teacher/goals"         element={<PDIProtectedRoute><AdminGoalsView /></PDIProtectedRoute>} />
                    <Route path="teacher/courses"       element={<PDIProtectedRoute><CourseManagementView /></PDIProtectedRoute>} />
                    <Route path="teacher/courses/assessments" element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />
                    <Route path="teacher/festival"      element={<PDIProtectedRoute><LearningFestivalPage /></PDIProtectedRoute>} />
                    <Route path="teacher/mooc"          element={<PDIProtectedRoute><MoocManagementView /></PDIProtectedRoute>} />
                    <Route path="teacher/calendar"      element={<PDIProtectedRoute><AdminCalendarView /></PDIProtectedRoute>} />
                    <Route path="teacher/hours"         element={<PDIProtectedRoute><PDHoursAnalyticsView /></PDIProtectedRoute>} />
                    <Route path="teacher/meetings"      element={<PDIProtectedRoute><MeetingsDashboard /></PDIProtectedRoute>} />
                    <Route path="teacher/meetings/:meetingId" element={<PDIProtectedRoute><MeetingMoMForm /></PDIProtectedRoute>} />
                    <Route path="teacher/survey"        element={<PDIProtectedRoute><SurveyPage /></PDIProtectedRoute>} />
                    <Route path="teacher/attendance"    element={<PDIProtectedRoute><TeacherAttendance /></PDIProtectedRoute>} />
                    <Route path="teacher/profile"       element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />
                    <Route path="teacher/documents"     element={<PDIProtectedRoute><AdminDocumentManagement /></PDIProtectedRoute>} />

                    {/* Educator Hub & Campus Routes */}
                    <Route path="edu-hub/*"             element={<PDIProtectedRoute><EduHubIndex /></PDIProtectedRoute>} />
                    <Route path="edu-hub/my-duties"     element={<PDIProtectedRoute><MyDutiesPage /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity" element={<PDIProtectedRoute><InstitutionalIdentity /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity/legacy" element={<PDIProtectedRoute><LegacyPage /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity/teams-vision" element={<PDIProtectedRoute><TeamsVisionPage /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity/philosophy" element={<PDIProtectedRoute><PhilosophyPage /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity/prayer" element={<PDIProtectedRoute><SchoolPrayerPage /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity/founders-message" element={<PDIProtectedRoute><FoundersMessagePage /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity/schools" element={<PDIProtectedRoute><OurSchoolsPage /></PDIProtectedRoute>} />
                    <Route path="educator-hub/institutional-identity/our-teams/cmr-nps" element={<PDIProtectedRoute><CMRNPSPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmr-nps/info" element={<PDIProtectedRoute><CMRNPSInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmr-nps/duties" element={<PDIProtectedRoute><CmrNpsDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/ekya-byrathi" element={<PDIProtectedRoute><EkyaByrathiPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-byrathi/info" element={<PDIProtectedRoute><EkyaByrathiInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-byrathi/duties" element={<PDIProtectedRoute><EkyaByrathiDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/ekya-btm-layout" element={<PDIProtectedRoute><EkyaBtmLayoutPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-btm-layout/info" element={<PDIProtectedRoute><EkyaBtmLayoutInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-btm-layout/duties" element={<PDIProtectedRoute><EkyaBtmLayoutDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/ekya-itpl" element={<PDIProtectedRoute><EkyaItplPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-itpl/info" element={<PDIProtectedRoute><EkyaItplInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-itpl/duties" element={<PDIProtectedRoute><EkyaItplDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/ekya-jp-nagar" element={<PDIProtectedRoute><EkyaJpNagarPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-jp-nagar/info" element={<PDIProtectedRoute><EkyaJpNagarInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-jp-nagar/duties" element={<PDIProtectedRoute><EkyaJpNagarDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/ekya-nice-road" element={<PDIProtectedRoute><EkyaNiceRoadPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-nice-road/info" element={<PDIProtectedRoute><EkyaNiceRoadInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/ekya-nice-road/duties" element={<PDIProtectedRoute><EkyaNiceRoadDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/cmrpu-hrbr" element={<PDIProtectedRoute><CmrpuhRbrPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmrpu-hrbr/info" element={<PDIProtectedRoute><CmrpuhRbrInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmrpu-hrbr/duties" element={<PDIProtectedRoute><CmrpuHrbrDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/cmrpu-itpl" element={<PDIProtectedRoute><CmrpuhItplPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmrpu-itpl/info" element={<PDIProtectedRoute><CmrpuhItplInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmrpu-itpl/duties" element={<PDIProtectedRoute><CmrpuItplDutiesPage /></PDIProtectedRoute>} />

                    <Route path="campuses/cmrpu-btm" element={<PDIProtectedRoute><CmrpuhBtmPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmrpu-btm/info" element={<PDIProtectedRoute><CmrpuhBtmInfoPage /></PDIProtectedRoute>} />
                    <Route path="campuses/cmrpu-btm/duties" element={<PDIProtectedRoute><CmrpuBtmDutiesPage /></PDIProtectedRoute>} />

                    <Route path="educator-hub/academic-operations" element={<PDIProtectedRoute><AcademicOperations /></PDIProtectedRoute>} />
                    <Route path="educator-hub/pedagogy-learning" element={<PDIProtectedRoute><PedagogyLearning /></PDIProtectedRoute>} />
                    <Route path="educator-hub/professional-development" element={<PDIProtectedRoute><ProfessionalDevelopment /></PDIProtectedRoute>} />
                    <Route path="educator-hub/interactions" element={<PDIProtectedRoute><Interactions /></PDIProtectedRoute>} />
                    <Route path="educator-hub/management-support" element={<PDIProtectedRoute><ManagementSupport /></PDIProtectedRoute>} />

                    {/* HR & Wellbeing Routes */}
                    <Route path="hr/resources" element={<PDIProtectedRoute><ResourcesHub /></PDIProtectedRoute>} />
                    <Route path="hr/educator-guide" element={<PDIProtectedRoute><EducatorGuide /></PDIProtectedRoute>} />
                    <Route path="hr/educator-essentials" element={<PDIProtectedRoute><EducatorEssentials /></PDIProtectedRoute>} />
                    <Route path="hr/wellbeing" element={<PDIProtectedRoute><WellBeing /></PDIProtectedRoute>} />
                    <Route path="hr/*" element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />

                    {/* Technology Routes */}
                    <Route path="technology/tech-sites-login" element={<PDIProtectedRoute><TechSitesLogin /></PDIProtectedRoute>} />
                    <Route path="technology/greythr" element={<PDIProtectedRoute><GreytHRPage /></PDIProtectedRoute>} />
                    <Route path="technology/schoology" element={<PDIProtectedRoute><SchoologyPage /></PDIProtectedRoute>} />
                    <Route path="technology/google-workspace" element={<PDIProtectedRoute><GoogleWorkspacePage /></PDIProtectedRoute>} />
                    <Route path="technology/google-forms" element={<PDIProtectedRoute><GoogleFormsPage /></PDIProtectedRoute>} />
                    <Route path="technology/google-slides" element={<PDIProtectedRoute><GoogleSlidesPage /></PDIProtectedRoute>} />
                    <Route path="technology/google-sheets" element={<PDIProtectedRoute><GoogleSheetsPage /></PDIProtectedRoute>} />
                    <Route path="technology/google-docs" element={<PDIProtectedRoute><GoogleDocsPage /></PDIProtectedRoute>} />
                    <Route path="technology/google-calendar" element={<PDIProtectedRoute><GoogleCalendarPage /></PDIProtectedRoute>} />
                    <Route path="technology/google-hangouts-meet" element={<PDIProtectedRoute><GoogleMeetPage /></PDIProtectedRoute>} />
                    <Route path="technology/google-mail" element={<PDIProtectedRoute><GoogleMailPage /></PDIProtectedRoute>} />
                    <Route path="technology/zoom" element={<PDIProtectedRoute><ZoomPage /></PDIProtectedRoute>} />
                    <Route path="technology/slack" element={<PDIProtectedRoute><SlackPage /></PDIProtectedRoute>} />
                    <Route path="technology/email-signature-templates" element={<PDIProtectedRoute><EmailSignaturePage /></PDIProtectedRoute>} />
                    <Route path="technology/ekyaverse" element={<PDIProtectedRoute><EkyaversePage /></PDIProtectedRoute>} />
                    <Route path="technology/audit" element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />
                    <Route path="technology/*" element={<PDIProtectedRoute><InProgress /></PDIProtectedRoute>} />

                    {/* Catch-all — must be last */}
                    <Route path="*" element={<InProgress />} />
                </Route>
            </Routes>
        </Providers>
    );
}
