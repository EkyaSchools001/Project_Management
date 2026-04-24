import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './pages/LoginPage';
import { TeacherPortal } from './pages/TeacherPortal';
import { RoleGuard } from './components/RoleGuard';
import { PortalShell } from './components/PortalShell';
import { PlaceholderView } from './components/PlaceholderView';
import { portalTabs } from '@ekya/config';

const roleHomePath: Record<string, string> = {
  teacher: '/teacher/home',
  hos: '/hos/home',
  admin: '/admin/home',
  management: '/management/home',
  superadmin: '/superadmin/home'
};

// Map kebab-case paths to camelCase section names
const pathToSection: Record<string, string> = {
  'home': 'home',
  'who-we-are': 'whoWeAre',
  'my-campus': 'myCampus',
  'teaching': 'teaching',
  'my-classroom': 'myClassroom',
  'grow': 'grow',
  'joining': 'joining'
};

function TeacherPortalRoute() {
  const { section: pathSection } = useParams<{ section: string }>();
  const section = pathSection ? (pathToSection[pathSection] || 'home') : 'home';
  return <TeacherPortal section={section} />;
}

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/teacher/*"
        element={
          <RoleGuard role="teacher">
            <PortalShell tabs={portalTabs.teacher}>
              <Routes>
                <Route path=":section?" element={<TeacherPortalRoute />} />
              </Routes>
            </PortalShell>
          </RoleGuard>
        }
      />
      <Route
        path="/hos/*"
        element={
          <RoleGuard role="hos">
            <PortalShell tabs={portalTabs.hos}>
              <Routes>
                <Route path="home" element={<PlaceholderView title="HoS Home" />} />
                <Route path="my-campus" element={<PlaceholderView title="HoS My Campus" />} />
                <Route path="student-records" element={<PlaceholderView title="HoS Student Records" />} />
                <Route path="timetable" element={<PlaceholderView title="HoS Timetable Calendar" />} />
                <Route path="policies" element={<PlaceholderView title="HoS Policies Approvals" />} />
                <Route path="ticket" element={<PlaceholderView title="HoS Raise a Ticket" />} />
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </PortalShell>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/*"
        element={
          <RoleGuard role="admin">
            <PortalShell tabs={portalTabs.admin}>
              <Routes>
                <Route path="home" element={<PlaceholderView title="Admin Home" />} />
                <Route path="my-campus" element={<PlaceholderView title="Admin My Campus" />} />
                <Route path="student-records" element={<PlaceholderView title="Admin Student Records" />} />
                <Route path="platform-access" element={<PlaceholderView title="Admin Platform Access" />} />
                <Route path="ticket" element={<PlaceholderView title="Admin Raise a Ticket" />} />
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </PortalShell>
          </RoleGuard>
        }
      />
      <Route
        path="/management/*"
        element={
          <RoleGuard role="management">
            <PortalShell tabs={portalTabs.management}>
              <Routes>
                <Route path="home" element={<PlaceholderView title="Management Home" />} />
                <Route path="all-campuses" element={<PlaceholderView title="All Campuses" />} />
                <Route path="teaching-network" element={<PlaceholderView title="Teaching Network" />} />
                <Route path="people-pdi" element={<PlaceholderView title="People PDI" />} />
                <Route path="reports-analytics" element={<PlaceholderView title="Reports Analytics" />} />
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </PortalShell>
          </RoleGuard>
        }
      />
      <Route
        path="/superadmin/*"
        element={
          <RoleGuard role="superadmin">
            <PortalShell tabs={portalTabs.superadmin}>
              <Routes>
                <Route path="home" element={<PlaceholderView title="Super Admin Home" />} />
                <Route path="user-management" element={<PlaceholderView title="User Management" />} />
                <Route path="content-management" element={<PlaceholderView title="Content Management" />} />
                <Route path="platform-settings" element={<PlaceholderView title="Platform Settings" />} />
                <Route path="campus-management" element={<PlaceholderView title="Campus Management" />} />
                <Route path="reports-analytics" element={<PlaceholderView title="Reports Analytics" />} />
                <Route path="audit-log" element={<PlaceholderView title="Audit Log" />} />
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </PortalShell>
          </RoleGuard>
        }
      />
      <Route path="*" element={<Navigate to={user ? roleHomePath[user.role] : '/login'} replace />} />
    </Routes>
  );
}

export default App;
