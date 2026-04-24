import { ReactNode, useState, useCallback, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Role } from "../RoleBadge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, GraduationCap, Book, FileCheck, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { NotificationBell } from "../notifications/NotificationBell";
import { Input } from "../ui/input";
import { useAuth } from "@/hooks/useAuth";


interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
  userName: string;
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const { user, token, login } = useAuth();

  // Desktop: sidebar always starts collapsed (w-16 icon rail)
  // It expands to w-64 only while the user hovers over the sidebar zone.
  const [hovered, setHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const location = useLocation();



  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    // Also collapse hover state on navigation (user left the sidebar)
    setHovered(false);
  }, [location.pathname]);

  const getDocumentsPath = () => {
    const r = role.toLowerCase();
    if (r === 'teacher') return '/teacher/documents';
    if (r === 'admin' || r === 'superadmin') return '/admin/documents';
    return '/leader/documents';
  };

  // Whether sidebar is visually expanded
  const sidebarExpanded = isMobile ? mobileMenuOpen : hovered;
  // Width the main content should offset by (pushes content on hover)
  const mainOffset = isMobile ? "ml-0" : hovered ? "ml-64" : "ml-16";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar h-16 sticky top-0 z-50">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <div className="p-2 rounded-lg bg-sidebar-primary shrink-0">
            <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground truncate text-sm">Teacher Platform</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-sidebar-border"
            asChild
          >
            <Link to={getDocumentsPath()}>
              <FileCheck className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-sidebar-border"
            onClick={() => window.open('https://pdi.ekyaschools.com/education-blogs/', '_blank')}
          >
            <Book className="w-4 h-4" />
          </Button>
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-sidebar-foreground"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Sidebar hover zone – always rendered as w-16 rail, expands on hover */}
      <div
        className="hidden md:block fixed left-0 top-0 z-[60] h-screen sidebar-hover-rail group"
        style={{
          width: hovered ? "16rem" : "4rem",
          transition: "width 350ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "width",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <DashboardSidebar
          role={role}
          userName={userName}
          collapsed={!sidebarExpanded}
          onToggle={() => { }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isHoverMode
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <DashboardSidebar
          role={role}
          userName={userName}
          collapsed={!mobileMenuOpen}
          onToggle={() => setMobileMenuOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen overflow-x-hidden print:ml-0 flex flex-col",
          mainOffset
        )}
      >
        {!isMobile && (
          <header className="h-14 border-b border-white/10 bg-white/40 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40 w-full shrink-0 shadow-sm transition-all duration-300 gap-4">
            <div className="flex-1" />

            <div className="flex-[2] max-w-md relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search navigation..."
                className="pl-9 h-9 bg-white/50 border-muted/20 text-xs focus-visible:ring-primary shadow-sm w-full transition-all focus-visible:ring-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 flex items-center justify-end gap-3">


              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9 border-muted/20 hover:bg-white/50"
                asChild
              >
                <Link to={getDocumentsPath()}>
                  <FileCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Documents</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9 border-muted/20 hover:bg-white/50"
                onClick={() => window.open('https://pdi.ekyaschools.com/education-blogs/', '_blank')}
              >
                <Book className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Blogs</span>
              </Button>
              <NotificationBell />
            </div>
          </header>
        )}
        <div className="p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 3xl:p-16 w-full mx-auto max-w-[2000px] 3xl:max-w-full flex-1 transition-all duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
