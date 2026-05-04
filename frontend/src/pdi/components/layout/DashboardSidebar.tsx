import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@pdi/lib/utils";
import { useIsMobile } from "@pdi/hooks/use-mobile";
import {
  SquaresFour,
  ChartLineUp,
  UsersThree,
  GraduationCap,
  Gear,
  CaretLeft,
  X,
  Buildings,
  Heartbeat,
  Bell,
  ShieldCheck,
  MagnifyingGlass,
  ClipboardText,
  CalendarBlank,
  ChartBar,
  Lightning,
  BookOpen,
  Clock,
  Target,
  House,
  Presentation,
  ChatCircleDots,
  Globe,
  Ticket,
  Desktop,
  Link,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import { Role, RoleBadge } from "../RoleBadge";
import { Button } from "../ui/button";
import { useAccessControl } from "@pdi/hooks/useAccessControl";
import { SidebarAccordionItem, SidebarModule } from "./SidebarAccordionItem";
import { Input } from "../ui/input";
import { useAuth } from "@pdi/hooks/useAuth";
import { SignOut } from "@phosphor-icons/react";

interface DashboardSidebarProps {
  role: Role;
  userName: string;
  collapsed: boolean;
  onToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isHoverMode?: boolean;
}

export function DashboardSidebar({
  role,
  userName,
  collapsed,
  onToggle,
  searchQuery,
  setSearchQuery,
  isHoverMode = false
}: DashboardSidebarProps) {
  const { isModuleEnabled } = useAccessControl();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [openModule, setOpenModule] = useState<string | null>("Dashboard");

  // Only SUPERADMIN may switch domain; everyone else gets logged out
  const isSuperAdminUser = (user?.role || '').toUpperCase() === 'SUPER_ADMIN' ||
    (user?.role || '').toUpperCase() === 'SUPERADMIN';

  const handleFooterAction = async () => {
    if (isSuperAdminUser) {
      navigate('/', { replace: true });
    } else {
      await logout();
      navigate('/login', { replace: true });
    }
  };



  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { announcementService } = await import("@pdi/services/announcementService");
        const announcements = await announcementService.getAnnouncements();
        setUnreadAnnouncements(announcements.filter(a => !a.isAcknowledged).length);
      } catch (e) {
        // Silently fail if not logged in or error
      }
    };
    fetchUnread();
  }, [location.pathname]);

  // Role-based navigation configuration (Unified into a single 'Leader' style view)
  const getNavByRole = (role: string): SidebarModule[] => {
    const rawRole = (role || "").toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    const isTeacher = rawRole.includes('TEACHER') || rawRole === 'TEACHER';
    const isLeader = rawRole.includes('SCHOOL LEADER') || rawRole === 'LEADER';
    const isManagement = rawRole.includes('MANAGEMENT') || rawRole === 'MANAGEMENT';
    const isCoordinator = rawRole.includes('COORDINATOR') || rawRole === 'COORDINATOR';
    const isAdmin = rawRole.includes('ADMIN') || rawRole.includes('ELC') || rawRole.includes('PDI');
    const isSuperAdmin = rawRole === 'SUPERADMIN';
    const isTester = rawRole === 'TESTER';

    // Unified Sub-modules for Educator Hub
    const eduHubSubModules = [
      { title: "Home", path: "/departments/pd/edu-hub", icon: House },
      { title: "Who we are", path: "/departments/pd/edu-hub/who-we-are", icon: UsersThree },
      { title: "My campus", path: "/departments/pd/edu-hub/my-campus", icon: Buildings },
      { title: "Teaching", path: "/departments/pd/edu-hub/teaching", icon: GraduationCap },
      { title: "My classroom", path: "/departments/pd/edu-hub/my-classroom", icon: Presentation },
      { title: "Interactions", path: "/departments/pd/edu-hub/interactions", icon: ChatCircleDots },
      { title: "Tickets", path: "/departments/pd/edu-hub/tickets", icon: Ticket },
      { title: "Grow", path: "/departments/pd/edu-hub/grow", icon: ChartLineUp },
      { title: "Culture & Environment", path: "/departments/pd/edu-hub/culture-environment", icon: ShieldCheck },
      { title: "LAC", path: "/departments/pd/edu-hub/lac", icon: ClipboardText },
    ];


    if (isTeacher) {
      return [
        {
          title: "Educator Hub",
          icon: Lightning,
          subModules: eduHubSubModules,
        },
        {
          title: "Dashboard",
          icon: SquaresFour,
          subModules: [
            { title: "Overview", path: "/departments/pd/teacher" },
            { title: "Progress Dashboard", path: "/departments/pd/okr" },
            { title: "My Portfolio", path: "/departments/pd/portfolio" },
          ],
        },
        {
          title: "Observation",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/departments/pd/teacher/observations" },
            { title: "Goals", path: "/departments/pd/teacher/goals" },
          ],
        },
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/departments/pd/teacher/courses" },
            { title: "Assessments", path: "/departments/pd/teacher/courses/assessments" },
            { title: "Learning Festival", path: "/departments/pd/teacher/festival" },
            { title: "MOOC Evidence", path: "/departments/pd/teacher/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "Training Calendar", path: "/departments/pd/teacher/calendar" },
            { title: "Training Hours", path: "/departments/pd/teacher/hours" },
          ],
        },
        {
          title: "Engagement",
          icon: Bell,
          subModules: [
            { title: "Meetings", path: "/departments/pd/teacher/meetings" },
            { title: "Survey", path: "/departments/pd/teacher/survey" },
            { title: "Announcements", path: "/departments/pd/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "Records",
          icon: ClipboardText,
          subModules: [{ title: "Attendance", path: "/departments/pd/teacher/attendance" }],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/departments/pd/hr/resources" },
            { title: "Educator Essentials", path: "/departments/pd/hr/educator-essentials" },
            { title: "Educator Guide", path: "/departments/pd/hr/educator-guide" },
            { title: "WellBeing", path: "/departments/pd/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/departments/pd/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/departments/pd/technology/greythr" },
            { title: "Schoology", path: "/departments/pd/technology/schoology" },
            { title: "Google Workspace", path: "/departments/pd/technology/google-workspace" },
            { title: "Zoom", path: "/departments/pd/technology/zoom" },
            { title: "Slack", path: "/departments/pd/technology/slack" },
            { title: "Email Signature Templates", path: "/departments/pd/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/departments/pd/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/departments/pd/technology/audit" },
          ],
        },
        {
          title: "Profile",
          icon: UsersThree,
          subModules: [{ title: "My Profile", path: "/departments/pd/teacher/profile" }],
        },
      ];
    }

    if (isTester) {
      return [
        {
          title: "Educator Hub",
          icon: Lightning,
          subModules: eduHubSubModules,
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/departments/pd/hr/resources" },
            { title: "Educator Essentials", path: "/departments/pd/hr/educator-essentials" },
            { title: "Educator Guide", path: "/departments/pd/hr/educator-guide" },
            { title: "WellBeing", path: "/departments/pd/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/departments/pd/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/departments/pd/technology/greythr" },
            { title: "Schoology", path: "/departments/pd/technology/schoology" },
            { title: "Google Workspace", path: "/departments/pd/technology/google-workspace" },
            { title: "Zoom", path: "/departments/pd/technology/zoom" },
            { title: "Slack", path: "/departments/pd/technology/slack" },
            { title: "Email Signature Templates", path: "/departments/pd/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/departments/pd/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/departments/pd/technology/audit" },
          ],
        },
      ];
    }

    if (isLeader) {
      return [
        {
          title: "Educator Hub",
          icon: Lightning,
          subModules: eduHubSubModules,
        },
        {
          title: "Dashboard",
          icon: SquaresFour,
          subModules: [
            { title: "Overview", path: "/departments/pd/leader" },
            { title: "Performance", path: "/departments/pd/leader/performance" },
            { title: "Progress Dashboard", path: "/departments/pd/okr" },
            { title: "Portfolio", path: "/departments/pd/portfolio" },
          ],
        },
        {
          title: "Observation & Performance",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/departments/pd/leader/growth" },
            { title: "Goals", path: "/departments/pd/leader/goals" },
          ],
        },
        {
          title: "Team Management",
          icon: UsersThree,
          subModules: [
            { title: "Team Overview", path: "/departments/pd/leader/team" },
            { title: "User Management", path: "/departments/pd/leader/users" },
          ],
        },
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/departments/pd/leader/courses" },
            { title: "Assessments", path: "/departments/pd/leader/courses/assessments" },
            { title: "Learning Festival", path: "/departments/pd/leader/festival" },
            { title: "MOOC Evidence", path: "/departments/pd/leader/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "TD Participation", path: "/departments/pd/leader/participation" },
            { title: "Learning Insights", path: "/departments/pd/leader/insights" },
            { title: "Training Calendar", path: "/departments/pd/leader/calendar" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Attendance Register", path: "/departments/pd/leader/attendance" },
            { title: "Meetings", path: "/departments/pd/leader/meetings" },
            { title: "Reports", path: "/departments/pd/leader/reports" },
            { title: "Survey", path: "/departments/pd/leader/survey" },
            { title: "Announcements", path: "/departments/pd/announcements", badge: unreadAnnouncements },
            { title: "Form Templates", path: "/departments/pd/leader/forms" },
            { title: "Settings", path: "/departments/pd/leader/settings" },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/departments/pd/hr/resources" },
            { title: "Educator Essentials", path: "/departments/pd/hr/educator-essentials" },
            { title: "Educator Guide", path: "/departments/pd/hr/educator-guide" },
            { title: "WellBeing", path: "/departments/pd/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/departments/pd/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/departments/pd/technology/greythr" },
            { title: "Schoology", path: "/departments/pd/technology/schoology" },
            { title: "Google Workspace", path: "/departments/pd/technology/google-workspace" },
            { title: "Zoom", path: "/departments/pd/technology/zoom" },
            { title: "Slack", path: "/departments/pd/technology/slack" },
            { title: "Email Signature Templates", path: "/departments/pd/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/departments/pd/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/departments/pd/technology/audit" },
          ],
        },
      ];
    }

    if (isAdmin || isSuperAdmin) {
      const baseNav: SidebarModule[] = [
        {
          title: "Educator Hub",
          icon: Lightning,
          subModules: eduHubSubModules,
        },
        {
          title: "Super Admin Console",
          icon: SquaresFour,
          subModules: [
            { title: "Overview", path: "/departments/pd/admin" },
            { title: "Progress Dashboard", path: "/departments/pd/okr" },
            { title: "Portfolio", path: "/departments/pd/portfolio" },
          ],
        },
        {
          title: "Observation & Goals",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/departments/pd/admin/growth-analytics" },
            { title: "Goals", path: "/departments/pd/admin/goals" },
          ],
        },
      ];

      if (isSuperAdmin) {
        baseNav.push({
          title: "Administration & Settings",
          icon: ShieldCheck,
          subModules: [
            { title: "User Management", path: "/departments/pd/admin/users" },
            { title: "Settings", path: "/departments/pd/admin/settings" },
            { title: "SuperAdmin Console", path: "/departments/pd/admin/superadmin" },
            { title: "Form Templates", path: "/departments/pd/admin/forms" },
          ],
        });
      } else {
        baseNav.push({
          title: "User & Forms",
          icon: UsersThree,
          subModules: [
            { title: "User Management", path: "/departments/pd/admin/users" },
            { title: "Form Templates", path: "/departments/pd/admin/forms" },
          ],
        });
      }

      baseNav.push(
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/departments/pd/admin/courses" },
            { title: "Assessments", path: "/departments/pd/admin/courses/assessments" },
            { title: "Learning Festival", path: "/departments/pd/admin/festival" },
            { title: "MOOC Evidence", path: "/departments/pd/admin/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "Training Calendar", path: "/departments/pd/admin/calendar" },
            { title: "Training Hours", path: "/departments/pd/admin/hours" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Attendance Register", path: "/departments/pd/admin/attendance" },
            { title: "Meetings", path: "/departments/pd/admin/meetings" },
            { title: "Reports", path: "/departments/pd/admin/reports" },
            { title: "Survey", path: "/departments/pd/admin/survey" },
            { title: "Announcements", path: "/departments/pd/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/departments/pd/hr/resources" },
            { title: "Educator Essentials", path: "/departments/pd/hr/educator-essentials" },
            { title: "Educator Guide", path: "/departments/pd/hr/educator-guide" },
            { title: "WellBeing", path: "/departments/pd/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/departments/pd/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/departments/pd/technology/greythr" },
            { title: "Schoology", path: "/departments/pd/technology/schoology" },
            { title: "Google Workspace", path: "/departments/pd/technology/google-workspace" },
            { title: "Zoom", path: "/departments/pd/technology/zoom" },
            { title: "Slack", path: "/departments/pd/technology/slack" },
            { title: "Email Signature Templates", path: "/departments/pd/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/departments/pd/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/departments/pd/technology/audit" },
          ],
        },
      );

      return baseNav;
    }

    if (isCoordinator) {
      return [
        {
          title: "Educator Hub",
          icon: Lightning,
          subModules: eduHubSubModules,
        },
        {
          title: "Dashboard",
          icon: SquaresFour,
          subModules: [
            { title: "Overview", path: "/departments/pd/leader" },
            { title: "Performance", path: "/departments/pd/leader/performance" },
            { title: "Progress Dashboard", path: "/departments/pd/okr" },
            { title: "Portfolio", path: "/departments/pd/portfolio" },
          ],
        },
        {
          title: "Observation & Performance",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/departments/pd/leader/growth" },
            { title: "Goals", path: "/departments/pd/leader/goals" },
          ],
        },
        {
          title: "Team Management",
          icon: UsersThree,
          subModules: [
            { title: "Team Overview", path: "/departments/pd/leader/team" },
          ],
        },
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/departments/pd/leader/courses" },
            { title: "Assessments", path: "/departments/pd/leader/courses/assessments" },
            { title: "Learning Festival", path: "/departments/pd/leader/festival" },
            { title: "MOOC Evidence", path: "/departments/pd/leader/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "TD Participation", path: "/departments/pd/leader/participation" },
            { title: "Learning Insights", path: "/departments/pd/leader/insights" },
            { title: "Training Calendar", path: "/departments/pd/leader/calendar" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Attendance Register", path: "/departments/pd/leader/attendance" },
            { title: "Meetings", path: "/departments/pd/leader/meetings" },
            { title: "Reports", path: "/departments/pd/leader/reports" },
            { title: "Survey", path: "/departments/pd/leader/survey" },
            { title: "Announcements", path: "/departments/pd/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/departments/pd/hr/resources" },
            { title: "Educator Essentials", path: "/departments/pd/hr/educator-essentials" },
            { title: "Educator Guide", path: "/departments/pd/hr/educator-guide" },
            { title: "WellBeing", path: "/departments/pd/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/departments/pd/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/departments/pd/technology/greythr" },
            { title: "Schoology", path: "/departments/pd/technology/schoology" },
            { title: "Google Workspace", path: "/departments/pd/technology/google-workspace" },
            { title: "Zoom", path: "/departments/pd/technology/zoom" },
            { title: "Slack", path: "/departments/pd/technology/slack" },
            { title: "Email Signature Templates", path: "/departments/pd/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/departments/pd/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/departments/pd/technology/audit" },
          ],
        },
      ];
    }

    if (isManagement) {
      return [
        {
          title: "Educator Hub",
          icon: Lightning,
          subModules: eduHubSubModules,
        },
        {
          title: "Dashboard",
          icon: SquaresFour,
          subModules: [
            { title: "Overview", path: "/departments/pd/management/overview" },
          ],
        },
        {
          title: "Observation & Goals",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/departments/pd/management/growth-analytics" },
            { title: "Goals", path: "/departments/pd/management/goals" },
            { title: "Progress Dashboard", path: "/departments/pd/okr" },
            { title: "Staff Portfolios", path: "/departments/pd/portfolio" },
          ],
        },
        {
          title: "Performance Analytics",
          icon: Heartbeat,
          subModules: [
            { title: "PDI Health Index", path: "/departments/pd/management/pdi-health" },
            { title: "Campus Performance", path: "/departments/pd/management/campus-performance" },
            { title: "Academic TD Impact", path: "/departments/pd/management/pd-impact" },
            { title: "Training Hours", path: "/departments/pd/management/hours" },
          ],
        },
        {
          title: "Courses & Assessments",
          icon: GraduationCap,
          subModules: [
            { title: "Assessments", path: "/departments/pd/management/courses/assessments" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "Training Analytics", path: "/departments/pd/management/training-analytics" },
            { title: "Attendance Logs", path: "/departments/pd/management/attendance" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Meetings", path: "/departments/pd/management/meetings" },
            { title: "Survey", path: "/departments/pd/management/survey" },
            { title: "Announcements", path: "/departments/pd/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/departments/pd/hr/resources" },
            { title: "Educator Essentials", path: "/departments/pd/hr/educator-essentials" },
            { title: "Educator Guide", path: "/departments/pd/hr/educator-guide" },
            { title: "WellBeing", path: "/departments/pd/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/departments/pd/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/departments/pd/technology/greythr" },
            { title: "Schoology", path: "/departments/pd/technology/schoology" },
            { title: "Google Workspace", path: "/departments/pd/technology/google-workspace" },
            { title: "Zoom", path: "/departments/pd/technology/zoom" },
            { title: "Slack", path: "/departments/pd/technology/slack" },
            { title: "Email Signature Templates", path: "/departments/pd/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/departments/pd/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/departments/pd/technology/audit" },
          ],
        },
      ];
    }

    return [];
  };

  const fullNav = getNavByRole(role);

  // Filter modules and sub-modules based on access control and search
  const filteredNav = fullNav
    .map((module) => {
      if (module.path) {
        // Direct link module
        const isEnabled = isModuleEnabled(module.path, role);
        const matchesSearch =
          module.title.toLowerCase().includes(searchQuery.toLowerCase());

        return isEnabled && matchesSearch ? module : null;
      }

      // Accordion module
      const filteredSubModules = module.subModules?.filter(
        (sub) =>
          isModuleEnabled(sub.path, role) &&
          (sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (filteredSubModules && filteredSubModules.length > 0) {
        return { ...module, subModules: filteredSubModules };
      }
      return null;
    })
    .filter((module): module is SidebarModule => module !== null);

  // Determine initial open module based on location
  useEffect(() => {
    const activeModule = fullNav.find((m) =>
      m.subModules?.some((s) => {
        const rootPaths = [
          "/departments/pd/teacher", 
          "/departments/pd/leader", 
          "/departments/pd/admin", 
          "/departments/pd/management", 
          "/departments/pd/hr",
          "/teacher",
          "/leader",
          "/admin",
          "/management",
          "/hr"
        ];
        return location.pathname === s.path || (!rootPaths.includes(s.path) && location.pathname.startsWith(s.path));
      })
    );
    if (activeModule) {
      setOpenModule(activeModule.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-primary/5 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.05)] print:hidden flex flex-col overflow-hidden",
        isHoverMode
          ? "w-full"
          : cn(
            "fixed left-0 top-0 z-[60] transition-all duration-300 ease-out",
            collapsed
              ? isMobile
                ? "-translate-x-full w-72"
                : "w-20 translate-x-0"
              : "translate-x-0 w-72"
          )
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 h-24 shrink-0 relative">
        {/* Collapsed: just the icon, centered */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 transition-all duration-300",
            collapsed && !isMobile ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
          )}
        >
          <div className="bg-primary shadow-lg shadow-primary/20 p-2.5 rounded-2xl rotate-3 hover:rotate-0 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" weight={"fill" as any} />
          </div>
        </div>

        {/* Expanded: logo + platform name */}
        <div
          className={cn(
            "flex items-center gap-4 min-w-0 flex-1 transition-all duration-300",
            collapsed && !isMobile
              ? "opacity-0 translate-x-[-20px] pointer-events-none"
              : "opacity-100 translate-x-0 delay-[120ms]"
          )}
        >
          <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/20 shrink-0 rotate-3 group-hover:rotate-0 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" weight={"fill" as any} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-1">Academic</span>
            <span className="font-black text-foreground truncate text-lg tracking-tighter leading-none">
              PLATFORM
            </span>
          </div>
        </div>

        {/* Collapse toggle – only in non-hover mode */}
        {!isHoverMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "text-muted-foreground hover:text-primary hover:bg-primary/5 shrink-0 transition-all rounded-xl",
              collapsed && !isMobile && "absolute -right-3 top-24 bg-white border border-primary/10 rounded-full shadow-xl z-50 h-8 w-8"
            )}
          >
            {isMobile ? (
              <X className="w-6 h-6" />
            ) : (
              <CaretLeft className={cn("w-5 h-5 transition-transform duration-500", collapsed && "rotate-180")} weight={"bold" as any} />
            )}
          </Button>
        )}
      </div>

      {/* User Info – fades in after expansion */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          collapsed && !isMobile || searchQuery
            ? "max-h-0 opacity-0 py-0"
            : "max-h-32 opacity-100 px-8 py-4 delay-[140ms]"
        )}
      >
        <div className="p-4 rounded-3xl bg-primary/[0.03] border border-primary/5">
            <p className="font-black text-foreground truncate text-xs uppercase tracking-widest mb-2">{userName}</p>
            <RoleBadge role={role} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-hide">
        {filteredNav.map((module) => (
          <SidebarAccordionItem
            key={module.title}
            module={module}
            isOpen={openModule === module.title}
            onToggle={() => setOpenModule(openModule === module.title ? null : module.title)}
            collapsed={collapsed && !isMobile}
            role={role}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 shrink-0">
        <button
          onClick={handleFooterAction}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group overflow-hidden text-left",
            isSuperAdminUser
              ? "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:shadow-inner"
              : "text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:shadow-inner"
          )}
        >
          {isSuperAdminUser ? (
            <ArrowUUpLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform duration-300" weight={"bold" as any} />
          ) : (
            <SignOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform duration-300" weight={"bold" as any} />
          )}
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300",
              collapsed && !isMobile
                ? "opacity-0 -translate-x-4 w-0"
                : "opacity-100 translate-x-0 delay-[130ms]"
            )}
          >
            {isSuperAdminUser ? 'Switch Domain' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
}
