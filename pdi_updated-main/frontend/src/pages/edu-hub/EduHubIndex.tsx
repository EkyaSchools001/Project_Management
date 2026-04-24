import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherPortal } from './TeacherPortal';
import { useAuth } from '@/hooks/useAuth';

const pathToSection: Record<string, string> = {
  'home': 'home',
  'who-we-are': 'who',
  'my-campus': 'campus',
  'teaching': 'teaching',
  'my-classroom': 'classroom',
  'interactions': 'interactions',
  'tickets': 'tickets',
  'grow': 'grow',
  'joining': 'joining',
  'work-in-progress': 'wip'
};

function TeacherPortalRoute() {
  const { section: pathSection } = useParams<{ section: string }>();
  // Match path segments to the section keys used in TeacherPortal
  const section = pathSection ? (pathToSection[pathSection] || 'home') : 'home';
  return <TeacherPortal section={section} />;
}

export default function EduHubIndex() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout 
      role={(user?.role?.toLowerCase() as any) || 'teacher'} 
      userName={user?.fullName || 'Educator'}
    >
      <Routes>
        <Route index element={<TeacherPortal section="home" />} />
        <Route path=":section" element={<TeacherPortalRoute />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </DashboardLayout>
  );
}


