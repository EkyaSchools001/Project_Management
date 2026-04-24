import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  SquaresFour,
  ChartLineUp,
  UsersThree,
  GraduationCap,
  Gear,
  SignOut,
  CaretLeft,
  Student,
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
} from "@phosphor-icons/react";
import { Role, RoleBadge } from "../RoleBadge";
import { Button } from "../ui/button";
import { useAccessControl } from "@/hooks/useAccessControl";
import { SidebarAccordionItem, SidebarModule } from "./SidebarAccordionItem";
import { Input } from "../ui/input";

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
  const location = useLocation();
  const isMobile = useIsMobile();
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [openModule, setOpenModule] = useState<string | null>("Dashboard");

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { announcementService } = await import("@/services/announcementService");
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
      { title: "Home", path: "/edu-hub", icon: House },
      { title: "Who we are", path: "/edu-hub/who-we-are", icon: UsersThree },
      { title: "My campus", path: "/edu-hub/my-campus", icon: Buildings },
      { title: "Teaching", path: "/edu-hub/teaching", icon: GraduationCap },
      { title: "My classroom", path: "/edu-hub/my-classroom", icon: Presentation },
      { title: "Interactions", path: "/edu-hub/interactions", icon: ChatCircleDots },
      { title: "Tickets", path: "/edu-hub/tickets", icon: Ticket },
      { title: "Grow", path: "/edu-hub/grow", icon: ChartLineUp },
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
            { title: "Overview", path: "/teacher" },
            { title: "Progress Dashboard", path: "/okr" },
            { title: "My Portfolio", path: "/portfolio" },
          ],
        },
        {
          title: "Observation",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/teacher/observations" },
            { title: "Goals", path: "/teacher/goals" },
          ],
        },
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/teacher/courses" },
            { title: "Assessments", path: "/teacher/courses/assessments" },
            { title: "Learning Festival", path: "/teacher/festival" },
            { title: "MOOC Evidence", path: "/teacher/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "Training Calendar", path: "/teacher/calendar" },
            { title: "Training Hours", path: "/teacher/hours" },
          ],
        },
        {
          title: "Engagement",
          icon: Bell,
          subModules: [
            { title: "Meetings", path: "/teacher/meetings" },
            { title: "Survey", path: "/teacher/survey" },
            { title: "Announcements", path: "/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "Records",
          icon: ClipboardText,
          subModules: [{ title: "Attendance", path: "/teacher/attendance" }],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/hr/resources" },
            { title: "Educator Essentials", path: "/hr/educator-essentials" },
            { title: "Educator Guide", path: "/hr/educator-guide" },
            { title: "WellBeing", path: "/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/technology/greythr" },
            { title: "Schoology", path: "/technology/schoology" },
            { title: "Google Workspace", path: "/technology/google-workspace" },
            { title: "Zoom", path: "/technology/zoom" },
            { title: "Slack", path: "/technology/slack" },
            { title: "Email Signature Templates", path: "/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/technology/audit" },
          ],
        },
        {
          title: "Profile",
          icon: UsersThree,
          subModules: [{ title: "My Profile", path: "/teacher/profile" }],
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
            { title: "Resources", path: "/hr/resources" },
            { title: "Educator Essentials", path: "/hr/educator-essentials" },
            { title: "Educator Guide", path: "/hr/educator-guide" },
            { title: "WellBeing", path: "/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/technology/greythr" },
            { title: "Schoology", path: "/technology/schoology" },
            { title: "Google Workspace", path: "/technology/google-workspace" },
            { title: "Zoom", path: "/technology/zoom" },
            { title: "Slack", path: "/technology/slack" },
            { title: "Email Signature Templates", path: "/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/technology/audit" },
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
            { title: "Overview", path: "/leader" },
            { title: "Performance", path: "/leader/performance" },
            { title: "Progress Dashboard", path: "/okr" },
            { title: "Portfolio", path: "/portfolio" },
          ],
        },
        {
          title: "Observation & Performance",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/leader/growth" },
            { title: "Goals", path: "/leader/goals" },
          ],
        },
        {
          title: "Team Management",
          icon: UsersThree,
          subModules: [
            { title: "Team Overview", path: "/leader/team" },
            { title: "User Management", path: "/leader/users" },
          ],
        },
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/leader/courses" },
            { title: "Assessments", path: "/leader/courses/assessments" },
            { title: "Learning Festival", path: "/leader/festival" },
            { title: "MOOC Evidence", path: "/leader/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "TD Participation", path: "/leader/participation" },
            { title: "Learning Insights", path: "/leader/insights" },
            { title: "Training Calendar", path: "/leader/calendar" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Attendance Register", path: "/leader/attendance" },
            { title: "Meetings", path: "/leader/meetings" },
            { title: "Reports", path: "/leader/reports" },
            { title: "Survey", path: "/leader/survey" },
            { title: "Announcements", path: "/announcements", badge: unreadAnnouncements },
            { title: "Form Templates", path: "/leader/forms" },
            { title: "Settings", path: "/leader/settings" },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/hr/resources" },
            { title: "Educator Essentials", path: "/hr/educator-essentials" },
            { title: "Educator Guide", path: "/hr/educator-guide" },
            { title: "WellBeing", path: "/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/technology/greythr" },
            { title: "Schoology", path: "/technology/schoology" },
            { title: "Google Workspace", path: "/technology/google-workspace" },
            { title: "Zoom", path: "/technology/zoom" },
            { title: "Slack", path: "/technology/slack" },
            { title: "Email Signature Templates", path: "/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/technology/audit" },
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
            { title: "Overview", path: "/admin" },
            { title: "Progress Dashboard", path: "/okr" },
            { title: "Portfolio", path: "/portfolio" },
          ],
        },
        {
          title: "Observation & Goals",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/admin/growth-analytics" },
            { title: "Goals", path: "/admin/goals" },
          ],
        },
      ];

      if (isSuperAdmin) {
        baseNav.push({
          title: "Administration & Settings",
          icon: ShieldCheck,
          subModules: [
            { title: "User Management", path: "/admin/users" },
            { title: "Settings", path: "/admin/settings" },
            { title: "SuperAdmin Console", path: "/admin/superadmin" },
            { title: "Form Templates", path: "/admin/forms" },
          ],
        });
      } else {
        baseNav.push({
          title: "User & Forms",
          icon: UsersThree,
          subModules: [
            { title: "User Management", path: "/admin/users" },
            { title: "Form Templates", path: "/admin/forms" },
          ],
        });
      }

      baseNav.push(
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/admin/courses" },
            { title: "Assessments", path: "/admin/courses/assessments" },
            { title: "Learning Festival", path: "/admin/festival" },
            { title: "MOOC Evidence", path: "/admin/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "Training Calendar", path: "/admin/calendar" },
            { title: "Training Hours", path: "/admin/hours" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Attendance Register", path: "/admin/attendance" },
            { title: "Meetings", path: "/admin/meetings" },
            { title: "Reports", path: "/admin/reports" },
            { title: "Survey", path: "/admin/survey" },
            { title: "Announcements", path: "/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/hr/resources" },
            { title: "Educator Essentials", path: "/hr/educator-essentials" },
            { title: "Educator Guide", path: "/hr/educator-guide" },
            { title: "WellBeing", path: "/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/technology/greythr" },
            { title: "Schoology", path: "/technology/schoology" },
            { title: "Google Workspace", path: "/technology/google-workspace" },
            { title: "Zoom", path: "/technology/zoom" },
            { title: "Slack", path: "/technology/slack" },
            { title: "Email Signature Templates", path: "/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/technology/audit" },
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
            { title: "Overview", path: "/leader" },
            { title: "Performance", path: "/leader/performance" },
            { title: "Progress Dashboard", path: "/okr" },
            { title: "Portfolio", path: "/portfolio" },
          ],
        },
        {
          title: "Observation & Performance",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/leader/growth" },
            { title: "Goals", path: "/leader/goals" },
          ],
        },
        {
          title: "Team Management",
          icon: UsersThree,
          subModules: [
            { title: "Team Overview", path: "/leader/team" },
          ],
        },
        {
          title: "Courses",
          icon: GraduationCap,
          subModules: [
            { title: "Course Catalogue", path: "/leader/courses" },
            { title: "Assessments", path: "/leader/courses/assessments" },
            { title: "Learning Festival", path: "/leader/festival" },
            { title: "MOOC Evidence", path: "/leader/mooc" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "TD Participation", path: "/leader/participation" },
            { title: "Learning Insights", path: "/leader/insights" },
            { title: "Training Calendar", path: "/leader/calendar" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Attendance Register", path: "/leader/attendance" },
            { title: "Meetings", path: "/leader/meetings" },
            { title: "Reports", path: "/leader/reports" },
            { title: "Survey", path: "/leader/survey" },
            { title: "Announcements", path: "/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/hr/resources" },
            { title: "Educator Essentials", path: "/hr/educator-essentials" },
            { title: "Educator Guide", path: "/hr/educator-guide" },
            { title: "WellBeing", path: "/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/technology/greythr" },
            { title: "Schoology", path: "/technology/schoology" },
            { title: "Google Workspace", path: "/technology/google-workspace" },
            { title: "Zoom", path: "/technology/zoom" },
            { title: "Slack", path: "/technology/slack" },
            { title: "Email Signature Templates", path: "/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/technology/audit" },
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
            { title: "Overview", path: "/management/overview" },
          ],
        },
        {
          title: "Observation & Goals",
          icon: ChartLineUp,
          subModules: [
            { title: "Observations", path: "/management/growth-analytics" },
            { title: "Goals", path: "/management/goals" },
            { title: "Progress Dashboard", path: "/okr" },
            { title: "Staff Portfolios", path: "/portfolio" },
          ],
        },
        {
          title: "Performance Analytics",
          icon: Heartbeat,
          subModules: [
            { title: "PDI Health Index", path: "/management/pdi-health" },
            { title: "Campus Performance", path: "/management/campus-performance" },
            { title: "Academic TD Impact", path: "/management/pd-impact" },
            { title: "Training Hours", path: "/management/hours" },
          ],
        },
        {
          title: "Courses & Assessments",
          icon: GraduationCap,
          subModules: [
            { title: "Assessments", path: "/management/courses/assessments" },
          ],
        },
        {
          title: "Training",
          icon: Clock,
          subModules: [
            { title: "Training Analytics", path: "/management/training-analytics" },
            { title: "Attendance Logs", path: "/management/attendance" },
          ],
        },
        {
          title: "Operations",
          icon: Gear,
          subModules: [
            { title: "Meetings", path: "/management/meetings" },
            { title: "Survey", path: "/management/survey" },
            { title: "Announcements", path: "/announcements", badge: unreadAnnouncements },
          ],
        },
        {
          title: "HR & WellBeing",
          icon: UsersThree,
          subModules: [
            { title: "Resources", path: "/hr/resources" },
            { title: "Educator Essentials", path: "/hr/educator-essentials" },
            { title: "Educator Guide", path: "/hr/educator-guide" },
            { title: "WellBeing", path: "/hr/wellbeing" },
          ],
        },
        {
          title: "Technology",
          icon: Desktop,
          subModules: [
            { title: "Educator Site", path: "/technology/tech-sites-login", icon: Link },
            { title: "GreytHR", path: "/technology/greythr" },
            { title: "Schoology", path: "/technology/schoology" },
            { title: "Google Workspace", path: "/technology/google-workspace" },
            { title: "Zoom", path: "/technology/zoom" },
            { title: "Slack", path: "/technology/slack" },
            { title: "Email Signature Templates", path: "/technology/email-signature-templates" },
            { title: "Ekyaverse-Neverskip", path: "/technology/ekyaverse" },
            { title: "Audit & Reports", path: "/technology/audit" },
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
        const rootPaths = ["/teacher", "/leader", "/admin", "/management"];
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
        "h-screen bg-sidebar shadow-xl print:hidden flex flex-col overflow-hidden",
        isHoverMode
          ? "w-full"
          : cn(
            "fixed left-0 top-0 z-[60] transition-all duration-300 ease-out",
            collapsed
              ? isMobile
                ? "-translate-x-full w-64"
                : "w-16 translate-x-0"
              : "translate-x-0 w-64"
          )
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16 shrink-0 relative">
        {/* Collapsed: just the icon, centered */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 transition-all duration-200",
            collapsed && !isMobile ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
          )}
        >
          <div className="bg-sidebar-primary p-2 rounded-lg">
            <Student className="w-5 h-5 text-sidebar-primary-foreground" weight="fill" />
          </div>
        </div>

        {/* Expanded: logo + platform name */}
        <div
          className={cn(
            "flex items-center gap-2 min-w-0 flex-1 pr-2 transition-all duration-200",
            collapsed && !isMobile
              ? "opacity-0 translate-x-[-8px] pointer-events-none"
              : "opacity-100 translate-x-0 delay-[120ms]"
          )}
        >
          <div className="p-2 rounded-lg bg-sidebar-primary shrink-0">
            <Student className="w-5 h-5 text-sidebar-primary-foreground" weight="fill" />
          </div>
          <span className="font-semibold text-sidebar-foreground truncate text-sm whitespace-nowrap">
            <span className="text-[#EA104A]">Teacher</span> Platform
          </span>
        </div>

        {/* Collapse toggle – only in non-hover mode */}
        {!isHoverMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "text-sidebar-foreground hover:bg-sidebar-accent shrink-0",
              collapsed && !isMobile && "absolute -right-3 top-20 bg-sidebar border border-sidebar-border rounded-full shadow-md z-50 h-6 w-6"
            )}
          >
            {isMobile ? (
              <X className="w-5 h-5" />
            ) : (
              <CaretLeft className={cn("w-4 h-4 transition-transform duration-300", collapsed && "rotate-180")} weight="bold" />
            )}
          </Button>
        )}
      </div>

      {/* User Info – fades in after expansion */}
      <div
        className={cn(
          "border-b border-sidebar-border overflow-hidden transition-all duration-300",
          collapsed && !isMobile || searchQuery
            ? "max-h-0 opacity-0 py-0"
            : "max-h-24 opacity-100 p-4 delay-[140ms]"
        )}
      >
        <p className="font-medium text-sidebar-foreground truncate text-sm">{userName}</p>
        <div className="mt-2">
          <RoleBadge role={role} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
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
      <div className="p-3 border-t border-sidebar-border shrink-0">
        <NavLink
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group overflow-hidden",
            "text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          )}
        >
          <SignOut className="w-5 h-5 shrink-0 group-hover:rotate-180 transition-transform duration-500" weight="bold" />
          <span
            className={cn(
              "text-sm font-medium whitespace-nowrap transition-all duration-200",
              collapsed && !isMobile
                ? "opacity-0 -translate-x-2 w-0"
                : "opacity-100 translate-x-0 delay-[130ms]"
            )}
          >
            Sign Out
          </span>
        </NavLink>
      </div>
    </aside>
  );
}
