import { Toaster } from "@pdi/components/ui/toaster";
import { Toaster as Sonner } from "@pdi/components/ui/sonner";
import { TooltipProvider } from "@pdi/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CustomCursor } from "./components/CustomCursor";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import TeacherDashboard from "./pages/TeacherDashboard";
import LeaderDashboard from "./pages/LeaderDashboard";

import ManagementDashboard from "./pages/ManagementDashboard";
import { MeetingsDashboard } from "./pages/MeetingsDashboard";
import { CreateMeetingForm } from "./pages/CreateMeetingForm";
import { MeetingDetailsView } from "./pages/MeetingDetailsView";
import { MeetingMoMForm } from "./pages/MeetingMoMForm";
import { MeetingsPage } from "../modules/meetings/pages/MeetingsPage";
import { VideoConference } from "../modules/meetings/components/VideoConference";
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
import { TeacherPortfolio } from "./pages/portfolio/TeacherPortfolio";
import { PortfolioIndex } from "./pages/portfolio/PortfolioIndex";

import { IoTDashboardPage } from "../modules/iot/pages/IoTDashboardPage";
import { AttendancePage } from "../modules/iot/pages/AttendancePage";
import { RoomBookingPage } from "../modules/iot/pages/RoomBookingPage";
import { VisitorPage } from "../modules/iot/pages/VisitorPage";
import { MaintenancePage } from "../modules/iot/pages/MaintenancePage";

import { AuthProvider, useAuth } from "./hooks/useAuth";
import { PermissionProvider } from "@pdi/contexts/PermissionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { EkyaGuide } from "./components/EkyaGuide";
import { AIProvider } from "./contexts/AIContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role?.toUpperCase();
  if (role === 'ADMIN' || role === 'SUPERADMIN') return <Navigate to="/admin" replace />;
  if (role === 'LEADER' || role === 'SCHOOL_LEADER') return <Navigate to="/leader" replace />;
  if (role === 'MANAGEMENT') return <Navigate to="/management" replace />;
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
        <CustomCursor />
        <BrowserRouter>
          <AIProvider>
            <AuthProvider>
              <PermissionProvider>
                <ErrorBoundary>
                  <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Auth />} />

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
                    path="/meetings"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><MeetingsDashboard /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings/new"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><MeetingsPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings/room/:id"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <VideoConference
                          meetingId="room-1"
                          meetingType="internal"
                          currentUser={{ id: 'user-1', name: 'Current User' }}
                          participants={[]}
                        />
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
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><TeacherPortfolio /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/site/:id" element={<PublicSiteView />} />

                  <Route
                    path="/iot"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><IoTDashboardPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/iot/attendance"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><AttendancePage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/iot/rooms"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><RoomBookingPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/iot/visitors"
                    element={
                      <ProtectedRoute allowedRoles={['TEACHER', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT']}>
                        <DashboardPage><VisitorPage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/iot/maintenance"
                    element={
                      <ProtectedRoute allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                        <DashboardPage><MaintenancePage /></DashboardPage>
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/dashboard" element={<DashboardRedirect />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary >
            </PermissionProvider >
            <EkyaGuide />
          </AuthProvider >
        </AIProvider>
      </BrowserRouter >
    </TooltipProvider >
  </QueryClientProvider >
</GoogleOAuthProvider>
  );
};

export default App;
