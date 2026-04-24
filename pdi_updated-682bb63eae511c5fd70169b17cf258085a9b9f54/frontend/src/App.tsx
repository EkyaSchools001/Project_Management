import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import TeacherDashboard from "./pages/TeacherDashboard";
import LeaderDashboard from "./pages/LeaderDashboard";

import ManagementDashboard from "./pages/ManagementDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import { MeetingsDashboard } from "./pages/MeetingsDashboard";
import { CreateMeetingForm } from "./pages/CreateMeetingForm";
import { MeetingDetailsView } from "./pages/MeetingDetailsView";
import { MeetingMoMForm } from "./pages/MeetingMoMForm";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import GrowthPage from "./pages/GrowthPage";
import LeaderGrowthPage from "./pages/leader/LeaderGrowthPage";
import AdminGrowthAnalyticsPage from "./pages/admin/AdminGrowthAnalyticsPage";
import DanielsonFrameworkPage from "./pages/leader/DanielsonFrameworkPage";
import QuickFeedbackPage from "./pages/leader/QuickFeedbackPage";
import PerformingArtsObsDashboard from "./pages/leader/PerformingArtsObsDashboard";
import PerformingArtsObsPage from "./pages/leader/PerformingArtsObsPage";
import NotesPage from "./pages/leader/NotesPage";
import QuickFeedbackDashboard from "./pages/leader/QuickFeedbackDashboard";
import DanielsonDashboard from "./pages/leader/DanielsonDashboard";
import LifeSkillsObsDashboard from "./pages/leader/LifeSkillsObsDashboard";
import LifeSkillsObsPage from "./pages/leader/LifeSkillsObsPage";
import PEObsDashboard from "./pages/leader/PEObsDashboard";
import PEObsPage from "./pages/leader/PEObsPage";
import VAObsDashboard from "./pages/leader/VAObsDashboard";
import VAObsPage from "./pages/leader/VAObsPage";
import OKRDashboard from "./pages/OKRDashboard";
import PublicSiteView from "./pages/PublicSiteView";
import NotFound from "./pages/NotFound";
import { PortfolioDirectory } from "./pages/portfolio/PortfolioDirectory";
import { TeacherPortfolio } from "./pages/portfolio/TeacherPortfolio";
import { PortfolioIndex } from "./pages/portfolio/PortfolioIndex";
import InstitutionalIdentity from "./pages/educator-hub/InstitutionalIdentity";
import AcademicOperations from "./pages/educator-hub/AcademicOperations";
import PedagogyLearning from "./pages/educator-hub/PedagogyLearning";
import ProfessionalDevelopment from "./pages/educator-hub/ProfessionalDevelopment";
import Interactions from "./pages/educator-hub/Interactions";
import ManagementSupport from "./pages/educator-hub/ManagementSupport";
import PhilosophyPage from "./pages/educator-hub/PhilosophyPage";
import FoundersMessagePage from "./pages/educator-hub/FoundersMessagePage";
import OurSchoolsPage from "./pages/educator-hub/InstitutionalIdentity/OurSchoolsPage";
import CMRNPSPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/CMRNPSPage";
import EkyaByrathiPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaByrathiPage";
import EkyaBtmLayoutPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaBtmLayoutPage";
import EkyaItplPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaItplPage";
import EkyaJpNagarPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaJpNagarPage";
import EkyaNiceRoadPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaNiceRoadPage";
import EkyaNiceRoadDutiesPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaNiceRoadDutiesPage";
import EkyaNiceRoadInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaNiceRoadInfoPage";
import EkyaItplInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaItplInfoPage";
import EkyaJpNagarInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaJpNagarInfoPage";
import EkyaBtmLayoutInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaBtmLayoutInfoPage";
import EkyaByrathiInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaByrathiInfoPage";
import CMRNPSInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CMRNPSInfoPage";
import CmrpuhRbrInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhRbrInfoPage";
import CmrpuhItplInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhItplInfoPage";
import CmrpuhBtmInfoPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhBtmInfoPage";
import EkyaItplDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaItplDutiesPage";
import EkyaJpNagarDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaJpNagarDutiesPage";
import EkyaBtmLayoutDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaBtmLayoutDutiesPage";
import CmrpuhRbrPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhRbrPage";
import CmrpuhItplPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhItplPage";
import CmrpuhBtmPage from "./pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuhBtmPage";
import EkyaByrathiDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaByrathiDutiesPage";
import CmrNpsDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrNpsDutiesPage";
import CmrpuHrbrDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuHrbrDutiesPage";
import CmrpuItplDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuItplDutiesPage";
import CmrpuBtmDutiesPage from "@/pages/educator-hub/InstitutionalIdentity/OurTeams/CmrpuBtmDutiesPage";
import LegacyPage from "./pages/educator-hub/InstitutionalIdentity/LegacyPage";
import TeamsVisionPage from "./pages/educator-hub/InstitutionalIdentity/TeamsVisionPage";
import SchoolPrayerPage from "./pages/educator-hub/InstitutionalIdentity/SchoolPrayerPage";
import InteractionLogPublic from "./pages/public/InteractionLogPublic";
import PTILSuccessPage from "./pages/public/PTILSuccessPage";
import EduHubIndex from "./pages/edu-hub/EduHubIndex";
import MyDutiesPage from "./pages/edu-hub/MyDutiesPage";
import InProgress from "./pages/InProgress";
import ResourcesHub from "./pages/hr/ResourcesHub";
import EducatorGuide from "./pages/hr/EducatorGuide";
import EducatorEssentials from "./pages/hr/EducatorEssentials";
import WellBeing from "./pages/hr/WellBeing";
import TechSitesLogin from "./pages/technology/TechSitesLogin";
import GreytHRPage from "./pages/technology/GreytHRPage";
import SchoologyPage from "./pages/technology/SchoologyPage";
import GoogleWorkspacePage from "./pages/technology/GoogleWorkspacePage";
import GoogleFormsPage from "./pages/technology/GoogleFormsPage";
import GoogleSlidesPage from "./pages/technology/GoogleSlidesPage";
import GoogleSheetsPage from "./pages/technology/GoogleSheetsPage";
import GoogleDocsPage from "./pages/technology/GoogleDocsPage";
import GoogleCalendarPage from "./pages/technology/GoogleCalendarPage";
import GoogleMeetPage from "./pages/technology/GoogleMeetPage";
import GoogleMailPage from "./pages/technology/GoogleMailPage";
import ZoomPage from "./pages/technology/ZoomPage";
import SlackPage from "./pages/technology/SlackPage";
import EmailSignaturePage from "./pages/technology/EmailSignaturePage";
import EkyaversePage from "./pages/technology/EkyaversePage";

import { AuthProvider, useAuth } from "./hooks/useAuth";
import { PermissionProvider } from "@/contexts/PermissionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { EkyaGuide } from "./components/EkyaGuide";
import { AIProvider } from "./contexts/AIContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { TeacherProfileView } from "./components/TeacherProfileView";
const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role?.toUpperCase();
  if (role === 'ADMIN' || role === 'SUPERADMIN') return <Navigate to="/admin" replace />;
  if (role === 'LEADER' || role === 'SCHOOL_LEADER') return <Navigate to="/leader" replace />;
  if (role === 'COORDINATOR') return <Navigate to="/coordinator" replace />;
  if (role === 'MANAGEMENT') return <Navigate to="/management" replace />;
  if (role === 'TESTER') return <Navigate to="/edu-hub" replace />;
  return <Navigate to="/teacher" replace />;
};

const DashboardPage = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return null;
  const role = (user.role?.toLowerCase() || 'teacher') as any;
  return (
    <DashboardLayout role={role} userName={user.fullName}>
      {children}
    </DashboardLayout>
  );
};

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          <AIProvider>
            <AuthProvider>
              <PermissionProvider>
                <ErrorBoundary>
                  <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Auth />} />

                  {/* Human Resource Routes - Moved up to prevent 404 conflicts */}
                  <Route
                    path="/hr"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><InProgress /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/resources"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><ResourcesHub /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/staff-records"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><InProgress /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/leave-management"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><InProgress /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/performance"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><InProgress /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/educator-guide"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><EducatorGuide /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/educator-essentials"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><EducatorEssentials /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hr/wellbeing"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><WellBeing /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/schoology"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><SchoologyPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-forms"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleFormsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-slides"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleSlidesPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-sheets"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleSheetsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-docs"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleDocsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-calendar"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleCalendarPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-hangouts-meet"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleMeetPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-mail"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleMailPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/zoom"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><ZoomPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/slack"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><SlackPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/email-signature-templates"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><EmailSignaturePage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/audit"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><InProgress /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/ekyaverse"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><EkyaversePage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/google-workspace"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GoogleWorkspacePage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/greythr"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><GreytHRPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/tech-sites-login"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><TechSitesLogin /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/technology/*"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><InProgress /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/teacher/*"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN', 'SUPERADMIN']}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/leader/*"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <LeaderDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                        <LeaderDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/management/*"
                    element={
                      <ProtectedRoute allowedRoles={['MANAGEMENT', 'SUPERADMIN']}>
                        <ManagementDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/coordinator/*"
                    element={
                      <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN', 'SUPERADMIN']}>
                        <CoordinatorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/edu-hub/my-duties"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <DashboardPage><MyDutiesPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/edu-hub/*"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'COORDINATOR', 'TESTER']}>
                        <EduHubIndex />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/meetings"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><MeetingsDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings/create"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><CreateMeetingForm /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings/edit/:id"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><CreateMeetingForm /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings/:id"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><MeetingDetailsView /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings/:meetingId/mom"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><MeetingMoMForm /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/growth"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><GrowthPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/growth/feedback"
                    element={<Navigate to="/leader/danielson-framework" replace />}
                  />
                  <Route
                    path="/leader/growth"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><LeaderGrowthPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/growth/:teacherId"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><LeaderGrowthPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/notes"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><NotesPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/danielson-framework"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><DanielsonDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/danielson-framework/new"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><DanielsonFrameworkPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/danielson-framework/:teacherId"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><DanielsonFrameworkPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/quick-feedback"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><QuickFeedbackDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/quick-feedback/new"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><QuickFeedbackPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/quick-feedback/:teacherId"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><QuickFeedbackPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/performing-arts-obs"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><PerformingArtsObsDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/performing-arts-obs/new"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><PerformingArtsObsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/life-skills-obs"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><LifeSkillsObsDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/life-skills-obs/new"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><LifeSkillsObsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/pe-obs"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><PEObsDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/pe-obs/new"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><PEObsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/va-obs"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><VAObsDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leader/va-obs/new"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><VAObsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/growth-analytics"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><AdminGrowthAnalyticsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/announcements"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><AnnouncementsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/okr"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><OKRDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/portfolio"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage>
                          <PortfolioIndex />
                        </DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/portfolio/:teacherId"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><TeacherPortfolio /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/teacher/portfolio"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                        <DashboardPage><TeacherPortfolio /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  {/* Educator Hub Routes */}
                    <Route
                      path="/educator-hub/institutional-identity"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><InstitutionalIdentity /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/educator-hub/institutional-identity/legacy"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><LegacyPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/educator-hub/institutional-identity/teams-vision"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><TeamsVisionPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/educator-hub/institutional-identity/philosophy"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><PhilosophyPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/educator-hub/institutional-identity/prayer"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><SchoolPrayerPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/educator-hub/institutional-identity/founders-message"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><FoundersMessagePage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/educator-hub/institutional-identity/schools"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><OurSchoolsPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/educator-hub/institutional-identity/our-teams/cmr-nps"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CMRNPSPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmr-nps/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CMRNPSInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmr-nps/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrNpsDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-byrathi"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaByrathiPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-byrathi/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaByrathiInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-byrathi/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaByrathiDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-btm-layout"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaBtmLayoutPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-btm-layout/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaBtmLayoutInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-btm-layout/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaBtmLayoutDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-itpl"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaItplPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-itpl/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaItplInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-itpl/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaItplDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-jp-nagar"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaJpNagarPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-jp-nagar/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaJpNagarInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-jp-nagar/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaJpNagarDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-nice-road"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaNiceRoadPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-nice-road/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaNiceRoadDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/ekya-nice-road/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><EkyaNiceRoadInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-hrbr"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuhRbrPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-hrbr/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuhRbrInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-hrbr/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuHrbrDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-itpl"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuhItplPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-itpl/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuhItplInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-itpl/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuItplDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-btm"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuhBtmPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-btm/info"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuhBtmInfoPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/campuses/cmrpu-btm/duties"
                      element={
                        <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                          <DashboardPage><CmrpuBtmDutiesPage /></DashboardPage>
                        </ProtectedRoute>
                      }
                    />
                  <Route
                    path="/educator-hub/academic-operations"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                        <DashboardPage><AcademicOperations /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/educator-hub/pedagogy-learning"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                        <DashboardPage><PedagogyLearning /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/educator-hub/professional-development"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                        <DashboardPage><ProfessionalDevelopment /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/educator-hub/interactions"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                        <DashboardPage><Interactions /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/educator-hub/management-support"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'TESTER']}>
                        <DashboardPage><ManagementSupport /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/site/:id" element={<PublicSiteView />} />

                  {/* Public Support Portal */}
                  <Route path="/support" element={<InteractionLogPublic />} />
                  <Route path="/support/success" element={<PTILSuccessPage />} />

                  <Route path="/dashboard" element={<DashboardRedirect />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <EkyaGuide />
              </ErrorBoundary>
            </PermissionProvider>
          </AuthProvider>
        </AIProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</GoogleOAuthProvider>
  );
};

export default App;
