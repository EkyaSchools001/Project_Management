import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@pdi/components/layout/DashboardLayout';
import { TeacherPortal } from './TeacherPortal';
import { useAuth } from '@pdi/hooks/useAuth';

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
  return (
    <Routes>
      <Route index element={<TeacherPortal section="home" />} />
      <Route path=":section" element={<TeacherPortalRoute />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}


