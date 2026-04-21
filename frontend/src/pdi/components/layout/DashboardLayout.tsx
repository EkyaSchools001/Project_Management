import { ReactNode, useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Role } from "../RoleBadge";
import { cn } from "@pdi/lib/utils";
import { useIsMobile } from "@pdi/hooks/use-mobile";
import { Menu, Search, Cpu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { NotificationBell } from "../notifications/NotificationBell";
import { Input } from "../ui/input";

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
  userName: string;
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const [hovered, setHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setHovered(false);
  }, [location.pathname]);

  const getDocumentsPath = () => {
    const r = role.toLowerCase();
    if (r === 'teacher') return '/teacher/documents';
    if (r === 'admin' || r === 'superadmin') return '/admin/documents';
    return '/leader/documents';
  };

  const sidebarExpanded = isMobile ? mobileMenuOpen : hovered;
  const mainOffset = "ml-0";

  return (
    <div className="min-h-screen bg-[#18181b] text-foreground flex flex-col md:flex-row overflow-x-hidden font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0f0f0f] h-16 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#8b5cf6]" />
          <span className="font-bold text-sm tracking-tight">Veidence <span className="text-[#8b5cf6]">Pro</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6 text-[#00f0ff]" />
          </Button>
        </div>
      </div>

      {/* Sidebar Zone */}
      <div
        className="hidden md:block fixed left-0 top-0 z-[60] h-screen bg-[#0d1117] border-r border-white/5 shadow-2xl"
        style={{
          width: hovered ? "16rem" : "15px",
          transition: "width 350ms cubic-bezier(0.32, 0.72, 0, 1)",
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

      {/* Content Main */}
      <main className={cn("flex-1 transition-all duration-300 min-h-screen flex flex-col relative", mainOffset)}>
        {!isMobile && (
          <header className="h-16 border-b border-white/5 bg-[#18181b]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40 w-full gap-8">
            <div className="flex items-center gap-3 font-semibold text-[11px] tracking-tight text-foreground/60">
              <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
              <span>Project Ecosystem // Active Hub</span>
            </div>

            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/30" />
              <Input
                placeholder="EXECUTE_SEARCH..."
                className="pl-10 h-10 bg-white/5 border-white/10 rounded-lg text-xs focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/20 placeholder:text-foreground/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="rounded-lg text-foreground/60 font-semibold text-xs hover:text-[#8b5cf6] hover:bg-white/5 transition-all" asChild>
                <Link to={getDocumentsPath()}>Storage</Link>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg text-foreground/60 font-semibold text-xs hover:text-[#8b5cf6] hover:bg-white/5 transition-all" onClick={() => window.open('https://pdi.ekyaschools.com/education-blogs/', '_blank')}>
                Intel
              </Button>
              <div className="w-px h-6 bg-white/10" />
              <NotificationBell />
            </div>
          </header>
        )}

        <div className="p-2 md:p-4 lg:p-4 w-full flex-1 animate-fade-in relative transition-all duration-300">
          {/* Subtle Technical Decorations */}
          <div className="absolute top-2 right-4 font-mono text-[7px] text-foreground/5 uppercase select-none pointer-events-none">
            STREAM_ENCRYPTED // {new Date().toISOString()}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

