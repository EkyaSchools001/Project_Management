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
    if (r === 'TEACHERSTAFF' || r === 'TEACHER_STAFF') return 'TEACHER';
    if (r === 'SCHOOL_LEADER') return 'SCHOOL_LEADER';
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
                <Route path="teacher/*" element={<TeacherDashboard />} />
                <Route path="leader/*"  element={<LeaderDashboard />} />
                <Route path="admin/*"   element={<LeaderDashboard />} />
                <Route path="management/*" element={<ManagementDashboard />} />
                <Route path="coordinator/*" element={<CoordinatorDashboard />} />

                {/* ── Shell-wrapped routes (Need shared layout) ── */}
                <Route element={<PDIShell role={role} user={user} />}>
                    {/* Shared module routes */}
                    <Route path="growth"                      element={<GrowthPage />} />
                    <Route path="leader/growth"               element={<LeaderGrowthPage />} />
                    <Route path="leader/growth/:teacherId"    element={<LeaderGrowthPage />} />
                    <Route path="admin/growth-analytics"      element={<AdminGrowthAnalyticsPage />} />
                    
                    {/* Observations (leader) */}
                    <Route path="leader/danielson-framework"          element={<DanielsonDashboard />} />
                    <Route path="leader/danielson-framework/new"      element={<DanielsonFrameworkPage />} />
                    <Route path="leader/danielson-framework/:teacherId" element={<DanielsonFrameworkPage />} />
                    <Route path="leader/quick-feedback"               element={<QuickFeedbackDashboard />} />
                    <Route path="leader/quick-feedback/new"           element={<QuickFeedbackPage />} />
                    <Route path="leader/quick-feedback/:teacherId"    element={<QuickFeedbackPage />} />
                    <Route path="leader/performing-arts-obs"          element={<PerformingArtsObsDashboard />} />
                    <Route path="leader/performing-arts-obs/new"      element={<PerformingArtsObsPage />} />
                    <Route path="leader/life-skills-obs"              element={<LifeSkillsObsDashboard />} />
                    <Route path="leader/life-skills-obs/new"          element={<LifeSkillsObsPage />} />
                    <Route path="leader/pe-obs"                       element={<PEObsDashboard />} />
                    <Route path="leader/pe-obs/new"                   element={<PEObsPage />} />
                    <Route path="leader/va-obs"                       element={<VAObsDashboard />} />
                    <Route path="leader/va-obs/new"                   element={<VAObsPage />} />
                    <Route path="leader/notes"                        element={<NotesPage />} />

                    {/* Meetings */}
                    <Route path="meetings"               element={<MeetingsDashboard />} />
                    <Route path="meetings/:meetingId"    element={<MeetingMoMForm />} />
                    <Route path="meetings/:meetingId/mom" element={<MeetingMoMForm />} />

                    {/* Portfolio */}
                    <Route path="portfolio"              element={<PortfolioIndex />} />
                    <Route path="portfolio/:teacherId"   element={<TeacherPortfolio />} />
                    <Route path="teacher/portfolio"      element={<TeacherPortfolio />} />

                    {/* Announcements / OKR / Survey */}
                    <Route path="announcements"          element={<AnnouncementsPage />} />
                    <Route path="okr"                    element={<OKRDashboard />} />
                    <Route path="survey"                 element={<SurveyPage />} />

                    {/* Learning Festival */}
                    <Route path="festival"               element={<FestivalManagementDashboard />} />
                    <Route path="festival/page"          element={<LearningFestivalPage />} />

                    {/* Documents & Attendance */}
                    <Route path="documents"              element={<AdminDocumentManagement />} />
                    <Route path="attendance"             element={<AttendanceRegister />} />
                    <Route path="attendance/:id"         element={<EventAttendanceView />} />

                    {/* Leader sub-pages */}
                    <Route path="leader/performance"     element={<LeaderPerformanceAnalytics />} />
                    <Route path="leader/goals"           element={<AdminGoalsView />} />
                    <Route path="leader/insights"        element={<LearningInsightsView />} />
                    <Route path="leader/participation"   element={<PDHoursAnalyticsView />} />
                    <Route path="leader/courses"         element={<CourseManagementView />} />
                    <Route path="leader/courses/assessments" element={<InProgress />} />
                    <Route path="leader/mooc"            element={<MoocManagementView />} />
                    <Route path="leader/hours"           element={<PDHoursAnalyticsView />} />
                    <Route path="leader/reports"         element={<AdminReportsView />} />
                    <Route path="leader/survey"          element={<SurveyPage />} />
                    <Route path="leader/meetings"        element={<MeetingsDashboard />} />
                    <Route path="leader/meetings/:meetingId" element={<MeetingMoMForm />} />
                    <Route path="leader/team"            element={<TeamMembersPage />} />
                    <Route path="leader/users"           element={<UserManagementView />} />
                    <Route path="leader/forms"           element={<FormTemplatesView />} />
                    <Route path="leader/settings"        element={<SystemSettingsView />} />
                    <Route path="leader/calendar"        element={<AdminCalendarView />} />
                    <Route path="leader/attendance"      element={<AttendanceRegister />} />
                    <Route path="leader/festival"        element={<LearningFestivalPage />} />

                    {/* Admin sub-pages */}
                    <Route path="admin/goals"            element={<AdminGoalsView />} />
                    <Route path="admin/reports"          element={<AdminReportsView />} />
                    <Route path="admin/calendar"         element={<AdminCalendarView />} />
                    <Route path="admin/hours"            element={<PDHoursAnalyticsView />} />
                    <Route path="admin/users"            element={<UserManagementView />} />
                    <Route path="admin/forms"            element={<FormTemplatesView />} />
                    <Route path="admin/settings"         element={<SystemSettingsView />} />
                    <Route path="admin/superadmin"       element={<SuperAdminView />} />
                    <Route path="admin/courses"          element={<CourseManagementView />} />
                    <Route path="admin/courses/assessments" element={<InProgress />} />
                    <Route path="admin/festival"         element={<FestivalManagementDashboard />} />
                    <Route path="admin/mooc"             element={<MoocManagementView />} />
                    <Route path="admin/meetings"         element={<MeetingsDashboard />} />
                    <Route path="admin/meetings/:meetingId" element={<MeetingMoMForm />} />
                    <Route path="admin/survey"           element={<SurveyPage />} />
                    <Route path="admin/attendance"       element={<AttendanceRegister />} />

                    {/* Management sub-pages (shell-wrapped variants) */}
                    <Route path="management/growth-analytics" element={<ManagementGrowthAnalyticsPage />} />
                    <Route path="management/goals"       element={<ManagementGoalsView />} />
                    <Route path="management/pdi-health"  element={<ManagementInsightsView />} />
                    <Route path="management/hours"       element={<PDHoursAnalyticsView />} />
                    <Route path="management/meetings"    element={<MeetingsDashboard />} />
                    <Route path="management/survey"      element={<SurveyPage />} />
                    <Route path="management/attendance"  element={<AttendanceRegister />} />
                    <Route path="management/courses/assessments" element={<InProgress />} />
                    <Route path="management/campus-performance" element={<AdminReportsView />} />
                    <Route path="management/pd-impact"   element={<PDHoursAnalyticsView />} />
                    <Route path="management/training-analytics" element={<PDHoursAnalyticsView />} />

                    {/* Teacher sub-pages */}
                    <Route path="teacher/observations"  element={<GrowthPage />} />
                    <Route path="teacher/goals"         element={<AdminGoalsView />} />
                    <Route path="teacher/courses"       element={<CourseManagementView />} />
                    <Route path="teacher/courses/assessments" element={<InProgress />} />
                    <Route path="teacher/festival"      element={<LearningFestivalPage />} />
                    <Route path="teacher/mooc"          element={<MoocManagementView />} />
                    <Route path="teacher/calendar"      element={<AdminCalendarView />} />
                    <Route path="teacher/hours"         element={<PDHoursAnalyticsView />} />
                    <Route path="teacher/meetings"      element={<MeetingsDashboard />} />
                    <Route path="teacher/meetings/:meetingId" element={<MeetingMoMForm />} />
                    <Route path="teacher/survey"        element={<SurveyPage />} />
                    <Route path="teacher/attendance"    element={<TeacherAttendance />} />
                    <Route path="teacher/profile"       element={<InProgress />} />
                    <Route path="teacher/documents"     element={<AdminDocumentManagement />} />

                    {/* Educator Hub & Campus Routes */}
                    <Route path="edu-hub/*"             element={<EduHubIndex />} />
                    <Route path="edu-hub/my-duties"     element={<MyDutiesPage />} />
                    <Route path="educator-hub/institutional-identity" element={<InstitutionalIdentity />} />
                    <Route path="educator-hub/institutional-identity/legacy" element={<LegacyPage />} />
                    <Route path="educator-hub/institutional-identity/teams-vision" element={<TeamsVisionPage />} />
                    <Route path="educator-hub/institutional-identity/philosophy" element={<PhilosophyPage />} />
                    <Route path="educator-hub/institutional-identity/prayer" element={<SchoolPrayerPage />} />
                    <Route path="educator-hub/institutional-identity/founders-message" element={<FoundersMessagePage />} />
                    <Route path="educator-hub/institutional-identity/schools" element={<OurSchoolsPage />} />
                    <Route path="educator-hub/institutional-identity/our-teams/cmr-nps" element={<CMRNPSPage />} />
                    <Route path="campuses/cmr-nps/info" element={<CMRNPSInfoPage />} />
                    <Route path="campuses/cmr-nps/duties" element={<CmrNpsDutiesPage />} />

                    <Route path="campuses/ekya-byrathi" element={<EkyaByrathiPage />} />
                    <Route path="campuses/ekya-byrathi/info" element={<EkyaByrathiInfoPage />} />
                    <Route path="campuses/ekya-byrathi/duties" element={<EkyaByrathiDutiesPage />} />

                    <Route path="campuses/ekya-btm-layout" element={<EkyaBtmLayoutPage />} />
                    <Route path="campuses/ekya-btm-layout/info" element={<EkyaBtmLayoutInfoPage />} />
                    <Route path="campuses/ekya-btm-layout/duties" element={<EkyaBtmLayoutDutiesPage />} />

                    <Route path="campuses/ekya-itpl" element={<EkyaItplPage />} />
                    <Route path="campuses/ekya-itpl/info" element={<EkyaItplInfoPage />} />
                    <Route path="campuses/ekya-itpl/duties" element={<EkyaItplDutiesPage />} />

                    <Route path="campuses/ekya-jp-nagar" element={<EkyaJpNagarPage />} />
                    <Route path="campuses/ekya-jp-nagar/info" element={<EkyaJpNagarInfoPage />} />
                    <Route path="campuses/ekya-jp-nagar/duties" element={<EkyaJpNagarDutiesPage />} />

                    <Route path="campuses/ekya-nice-road" element={<EkyaNiceRoadPage />} />
                    <Route path="campuses/ekya-nice-road/info" element={<EkyaNiceRoadInfoPage />} />
                    <Route path="campuses/ekya-nice-road/duties" element={<EkyaNiceRoadDutiesPage />} />

                    <Route path="campuses/cmrpu-hrbr" element={<CmrpuhRbrPage />} />
                    <Route path="campuses/cmrpu-hrbr/info" element={<CmrpuhRbrInfoPage />} />
                    <Route path="campuses/cmrpu-hrbr/duties" element={<CmrpuHrbrDutiesPage />} />

                    <Route path="campuses/cmrpu-itpl" element={<CmrpuhItplPage />} />
                    <Route path="campuses/cmrpu-itpl/info" element={<CmrpuhItplInfoPage />} />
                    <Route path="campuses/cmrpu-itpl/duties" element={<CmrpuItplDutiesPage />} />

                    <Route path="campuses/cmrpu-btm" element={<CmrpuhBtmPage />} />
                    <Route path="campuses/cmrpu-btm/info" element={<CmrpuhBtmInfoPage />} />
                    <Route path="campuses/cmrpu-btm/duties" element={<CmrpuBtmDutiesPage />} />

                    <Route path="educator-hub/academic-operations" element={<AcademicOperations />} />
                    <Route path="educator-hub/pedagogy-learning" element={<PedagogyLearning />} />
                    <Route path="educator-hub/professional-development" element={<ProfessionalDevelopment />} />
                    <Route path="educator-hub/interactions" element={<Interactions />} />
                    <Route path="educator-hub/management-support" element={<ManagementSupport />} />

                    {/* HR & Wellbeing Routes */}
                    <Route path="hr/resources" element={<ResourcesHub />} />
                    <Route path="hr/educator-guide" element={<EducatorGuide />} />
                    <Route path="hr/educator-essentials" element={<EducatorEssentials />} />
                    <Route path="hr/wellbeing" element={<WellBeing />} />
                    <Route path="hr/*" element={<InProgress />} />

                    {/* Technology Routes */}
                    <Route path="technology/tech-sites-login" element={<TechSitesLogin />} />
                    <Route path="technology/greythr" element={<GreytHRPage />} />
                    <Route path="technology/schoology" element={<SchoologyPage />} />
                    <Route path="technology/google-workspace" element={<GoogleWorkspacePage />} />
                    <Route path="technology/google-forms" element={<GoogleFormsPage />} />
                    <Route path="technology/google-slides" element={<GoogleSlidesPage />} />
                    <Route path="technology/google-sheets" element={<GoogleSheetsPage />} />
                    <Route path="technology/google-docs" element={<GoogleDocsPage />} />
                    <Route path="technology/google-calendar" element={<GoogleCalendarPage />} />
                    <Route path="technology/google-hangouts-meet" element={<GoogleMeetPage />} />
                    <Route path="technology/google-mail" element={<GoogleMailPage />} />
                    <Route path="technology/zoom" element={<ZoomPage />} />
                    <Route path="technology/slack" element={<SlackPage />} />
                    <Route path="technology/email-signature-templates" element={<EmailSignaturePage />} />
                    <Route path="technology/ekyaverse" element={<EkyaversePage />} />
                    <Route path="technology/audit" element={<InProgress />} />
                    <Route path="technology/*" element={<InProgress />} />

                    {/* Catch-all — must be last */}
                    <Route path="*" element={<InProgress />} />
                </Route>
            </Routes>
        </Providers>
    );
}
