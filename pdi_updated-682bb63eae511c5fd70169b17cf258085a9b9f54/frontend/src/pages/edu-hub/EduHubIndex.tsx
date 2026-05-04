import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherPortal } from './TeacherPortal';
import { useAuth } from '@/hooks/useAuth';
import SchoolAssemblyPage from './culture-practices/SchoolAssemblyPage';
import TeacherResponsibilitiesPage from './culture-practices/TeacherResponsibilitiesPage';
import StudentResponsibilitiesAwardsPage from './culture-practices/StudentResponsibilitiesAwardsPage';
import StudentConsequencesPage from './culture-practices/StudentConsequencesPage';
import MorningMeetingsPage from './culture-practices/MorningMeetingsPage';
import CircleTimePage from './culture-practices/CircleTimePage';
import LaunchPage from './culture-practices/LaunchPage';
import GreetingsPage from './culture-practices/GreetingsPage';
import GoodThingsPage from './culture-practices/GoodThingsPage';
import SocialContractPage from './culture-practices/SocialContractPage';
import ParentInteractionsPage from './culture-practices/ParentInteractionsPage';
import DaysOfWonderPage from './culture-practices/DaysOfWonderPage';
import HousePointsPage from './culture-practices/HousePointsPage';
import AffirmationsPage from './culture-practices/AffirmationsPage';
import UniformsPage from './culture-practices/UniformsPage';
import BulletinBoardsPage from './culture-practices/BulletinBoardsPage';
import ClassroomLayoutPage from './culture-practices/ClassroomLayoutPage';
import InClassShelvesPage from './culture-practices/InClassShelvesPage';
import InClassLibraryPage from './culture-practices/InClassLibraryPage';
import EkyaMirrorPage from './culture-practices/EkyaMirrorPage';
import AnnualDayPage from './culture-practices/AnnualDayPage';
import FireSafetyPage from './culture-practices/FireSafetyPage';
import NaturalDisasterPage from './culture-practices/NaturalDisasterPage';
import AnimalManagementPage from './culture-practices/AnimalManagementPage';
import CSAssessmentPracticesPage from './learning-areas/cs/CSAssessmentPracticesPage';
import { CSCurriculumOverviewPage } from './learning-areas/cs/CSCurriculumOverviewPage';
import HASSAssessmentPracticesPage from './learning-areas/hass/HASSAssessmentPracticesPage';
import HASSCurriculumOverviewPage from './learning-areas/hass/HASSCurriculumOverviewPage';
import LanguagesAssessmentPracticesPage from './learning-areas/languages/LanguagesAssessmentPracticesPage';
import LanguagesCurriculumOverviewPage from './learning-areas/languages/LanguagesCurriculumOverviewPage';
import MathAssessmentPracticesPage from './learning-areas/math/MathAssessmentPracticesPage';
import MathCurriculumOverviewPage from './learning-areas/math/MathCurriculumOverviewPage';
import ScienceAssessmentPracticesPage from './learning-areas/science/ScienceAssessmentPracticesPage';
import { ScienceCurriculumOverviewPage } from './learning-areas/science/ScienceCurriculumOverviewPage';
import LifeSkillsCurriculumOverviewPage from './learning-areas/specialists/LifeSkillsCurriculumOverviewPage';
import PerformingArtsCurriculumOverviewPage from './learning-areas/specialists/PerformingArtsCurriculumOverviewPage';
import PECurriculumOverviewPage from './learning-areas/specialists/PECurriculumOverviewPage';
import VisualArtsCurriculumOverviewPage from './learning-areas/specialists/VisualArtsCurriculumOverviewPage';
import GlobalTeacherHandoutsPage from './learning-areas/general/GlobalTeacherHandoutsPage';
import EarlyYearsResourcePage from './early-years/EarlyYearsResourcePage';

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
  'culture-environment': 'culture',
  'co-curricular': 'co-curricular',
  'lac': 'lac',
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
        <Route path="culture/school-assembly" element={<SchoolAssemblyPage />} />
        <Route path="culture/teacher-responsibilities" element={<TeacherResponsibilitiesPage />} />
        <Route path="culture/student-responsibilities-awards" element={<StudentResponsibilitiesAwardsPage />} />
        <Route path="culture/student-consequences" element={<StudentConsequencesPage />} />
        <Route path="culture/morning-meetings" element={<MorningMeetingsPage />} />
        <Route path="culture/circle-time" element={<CircleTimePage />} />
        <Route path="culture/launch" element={<LaunchPage />} />
        <Route path="culture/greetings" element={<GreetingsPage />} />
        <Route path="culture/good-things" element={<GoodThingsPage />} />
        <Route path="culture/social-contract" element={<SocialContractPage />} />
        <Route path="culture/parent-interactions" element={<ParentInteractionsPage />} />
        <Route path="culture/days-of-wonder" element={<DaysOfWonderPage />} />
        <Route path="culture/house-points" element={<HousePointsPage />} />
        <Route path="culture/affirmations" element={<AffirmationsPage />} />
        <Route path="culture/uniforms" element={<UniformsPage />} />
        <Route path="culture/bulletin-boards" element={<BulletinBoardsPage />} />
        <Route path="culture/classroom-layout" element={<ClassroomLayoutPage />} />
        <Route path="culture/in-class-shelves" element={<InClassShelvesPage />} />
        <Route path="culture/in-class-library" element={<InClassLibraryPage />} />
        <Route path="culture/ekya-mirror" element={<EkyaMirrorPage />} />
        <Route path="culture/annual-day" element={<AnnualDayPage />} />
        <Route path="culture/fire-safety" element={<FireSafetyPage />} />
        <Route path="culture/natural-disaster" element={<NaturalDisasterPage />} />
        <Route path="culture/animal-management" element={<AnimalManagementPage />} />
        <Route path="learning/cs/assessment" element={<CSAssessmentPracticesPage />} />
        <Route path="learning/cs/curriculum" element={<CSCurriculumOverviewPage />} />
        <Route path="learning/hass/assessment" element={<HASSAssessmentPracticesPage />} />
        <Route path="learning/hass/curriculum" element={<HASSCurriculumOverviewPage />} />
        <Route path="learning/languages/assessment" element={<LanguagesAssessmentPracticesPage />} />
        <Route path="learning/languages/curriculum" element={<LanguagesCurriculumOverviewPage />} />
        <Route path="learning/math/assessment" element={<MathAssessmentPracticesPage />} />
        <Route path="learning/math/curriculum" element={<MathCurriculumOverviewPage />} />
        <Route path="learning/science/assessment" element={<ScienceAssessmentPracticesPage />} />
        <Route path="learning/science/curriculum" element={<ScienceCurriculumOverviewPage />} />
        <Route path="learning/specialists/lifeskills/curriculum" element={<LifeSkillsCurriculumOverviewPage />} />
        <Route path="learning/specialists/performingarts/curriculum" element={<PerformingArtsCurriculumOverviewPage />} />
        <Route path="learning/specialists/pe/curriculum" element={<PECurriculumOverviewPage />} />
        <Route path="learning/specialists/visualarts/curriculum" element={<VisualArtsCurriculumOverviewPage />} />
        <Route path="learning/general/teacher-handouts" element={<GlobalTeacherHandoutsPage />} />
        <Route path="early-years/:slug" element={<EarlyYearsResourcePage />} />
        <Route path=":section" element={<TeacherPortalRoute />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </DashboardLayout>
  );
}


