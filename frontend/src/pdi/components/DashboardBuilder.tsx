import React, { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { Textarea } from "@pdi/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@pdi/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Badge } from "@pdi/components/ui/badge";
import { Separator } from "@pdi/components/ui/separator";
import { toast } from "sonner";
import { Slider } from "@pdi/components/ui/slider";
import {
  LayoutDashboard, Plus, Trash2, GripVertical, Eye,
  BarChart3, List, Calendar, Users, Target, Clock, Activity,
  FileText, CreditCard, TrendingUp, PieChart, Check, X,
  AlertCircle, Lightbulb, BookOpen, ClipboardList, Bell,
  Type, AlignLeft, MousePointerClick, Image as ImageIcon, Video, Minus, Palette, Copy,
  Sparkles, Layers, Box, Info, ExternalLink, ArrowUpRight, Trophy, ShieldCheck, MessageSquare,
  Settings, ArrowUp, ArrowDown, ChevronRight, Bookmark
} from "lucide-react";
import { dashboardService, Dashboard, DashboardWidget } from "@pdi/services/dashboardService";
import { getSocket } from "@pdi/lib/socket";
import { SecurityFeed } from './SecurityFeed';

interface CanvasWidget {
  id: string;
  type: string;
  name: string;
  content: string;
  width: number;
  height: number;
  x: number;
  y: number;
  styles?: Record<string, any>;
  icon?: string;
  subtitle?: string;
}

const WIDGET_OPTIONS = [
  // UI Builder
  { id: 'heading', type: 'heading', name: 'Heading', icon: Type, color: 'bg-card', defaultContent: 'Heading Text', category: 'UI Elements' },
  { id: 'hero', type: 'hero', name: 'Hero Section', icon: Sparkles, color: 'bg-indigo-600', defaultContent: 'Premium Title', category: 'UI Elements' },
  { id: 'card', type: 'card', name: 'Feature Card', icon: Layers, color: 'bg-white border border-slate-200', defaultContent: 'Feature Name', category: 'UI Elements' },
  { id: 'text', type: 'text', name: 'Paragraph', icon: AlignLeft, color: 'bg-slate-700', defaultContent: 'Add your custom text here...', category: 'UI Elements' },
  { id: 'button', type: 'button', name: 'Button', icon: MousePointerClick, color: 'bg-violet-600', defaultContent: 'Click Me', category: 'UI Elements' },
  { id: 'image', type: 'image', name: 'Image', icon: ImageIcon, color: 'bg-violet-500', defaultContent: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80', category: 'UI Elements' },
  { id: 'video', type: 'video', name: 'Video', icon: Video, color: 'bg-red-600', defaultContent: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'UI Elements' },
  { id: 'divider', type: 'divider', name: 'Divider', icon: Minus, color: 'bg-slate-400', defaultContent: '', category: 'UI Elements' },
  { id: 'spacer', type: 'spacer', name: 'Spacer', icon: Box, color: 'bg-slate-200', defaultContent: '', category: 'UI Elements' },

  // Stats Cards
  { id: 'stats', type: 'stats', name: 'Stats Card', icon: Activity, color: 'bg-violet-500', defaultContent: '0', category: 'Stats' },
  { id: 'stats_mini', type: 'stats_mini', name: 'Mini Stat', icon: Activity, color: 'bg-indigo-400', defaultContent: '12', category: 'Stats' },
  { id: 'stats_premium', type: 'stats_premium', name: 'Premium Stat', icon: Activity, color: 'bg-white text-red-500 border border-slate-200', defaultContent: '2,450', category: 'Stats' },
  { id: 'progress_card', type: 'progress_card', name: 'Progress Card', icon: TrendingUp, color: 'bg-violet-500', defaultContent: '60', category: 'Stats' },
  { id: 'users', type: 'stats', name: 'User Count', icon: Users, color: 'bg-cyan-500', defaultContent: '0', category: 'Stats' },
  { id: 'goals', type: 'stats', name: 'Goals', icon: Target, color: 'bg-red-500', defaultContent: '0', category: 'Goals' },
  { id: 'attendance', type: 'stats', name: 'Attendance', icon: Users, color: 'bg-fuchsia-500', defaultContent: '0%', category: 'Stats' },

  // Charts
  { id: 'chart_bar', type: 'chart_bar', name: 'Bar Chart', icon: BarChart3, color: 'bg-violet-500', defaultContent: 'chart', category: 'Charts' },
  { id: 'chart_line', type: 'chart_line', name: 'Line Chart', icon: TrendingUp, color: 'bg-purple-500', defaultContent: 'chart', category: 'Charts' },
  { id: 'chart_pie', type: 'chart_pie', name: 'Pie Chart', icon: PieChart, color: 'bg-orange-500', defaultContent: 'chart', category: 'Charts' },

  // Lists & Tables
  { id: 'list', type: 'list', name: 'List', icon: List, color: 'bg-pink-500', defaultContent: '5 items', category: 'Lists & Tables' },
  { id: 'table', type: 'table', name: 'Table', icon: FileText, color: 'bg-indigo-500', defaultContent: 'data', category: 'Lists & Tables' },

  // Calendar
  { id: 'calendar', type: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-yellow-500', defaultContent: 'calendar', category: 'Calendar' },

  // Special
  { id: 'observation', type: 'observation', name: 'Observation', icon: Eye, color: 'bg-purple-500', defaultContent: 'obs', category: 'Special' },
  { id: 'growth', type: 'growth', name: 'Growth', icon: TrendingUp, color: 'bg-violet-500', defaultContent: 'growth', category: 'Special' },
  { id: 'security_feed', type: 'security_feed', name: 'Security Center', icon: ShieldCheck, color: 'bg-background text-foreground', defaultContent: 'Active Logs', category: 'Special' },
  { id: 'chat_mini', type: 'chat_mini', name: 'Chat Widget', icon: MessageSquare, color: 'bg-indigo-50 text-indigo-600', defaultContent: 'Hello Admin!', category: 'Special' },
  { id: 'sparkline', type: 'sparkline', name: 'Growth Sparkline', icon: TrendingUp, color: 'bg-white', defaultContent: '82%', category: 'Charts' },
  { id: 'file_grid', type: 'file_grid', name: 'Document Hub', icon: BookOpen, color: 'bg-white', defaultContent: 'Resource Library', category: 'Lists & Tables' },
];

const ROLE_OPTIONS = [
  { id: 'TEACHER', name: 'TEACHER', displayName: 'Teacher', color: '#8b5cf6' },
  { id: 'LEADER', name: 'LEADER', displayName: 'Leader / Manager', color: '#7c3aed' },
  { id: 'SCHOOL_LEADER', name: 'SCHOOL_LEADER', displayName: 'School Leader', color: '#0ea5e9' },
  { id: 'ADMIN', name: 'ADMIN', displayName: 'Campus Admin', color: '#3b82f6' },
  { id: 'MANAGEMENT', name: 'MANAGEMENT', displayName: 'Management', color: '#f97316' },
  { id: 'SUPERADMIN', name: 'SUPERADMIN', displayName: 'Super Admin', color: '#ef4444' },
  { id: 'HOS', name: 'HOS', displayName: 'HOS', color: '#8b5cf6' },
  { id: 'COORDINATOR', name: 'COORDINATOR', displayName: 'Coordinator', color: '#ec4899' },
];

const ROLE_TEMPLATES: Record<string, { name: string; description: string; widgets: any[] }> = {
  TEACHER: {
    name: "Teacher Professional Dashboard",
    description: "Standard view for classroom excellence and self-reflection",
    widgets: [
      { id: 't1', type: 'hero', name: 'Teacher Header', content: 'Welcome back, Mentor!', x: 0, y: 0, width: 12, height: 4, 
        styles: { backgroundGradient: 'linear-gradient(to right, #0f172a, #1e293b)', color: '#ffffff', textAlign: 'left', borderRadius: '24px', badge: 'PROFESSIONAL' } 
      },
      { id: 't2', type: 'stats_premium', name: 'Total Observations', content: '24', x: 0, y: 4, width: 4, height: 3, 
        styles: { trendValue: '+4 this term', trendUp: true, icon: 'Eye', borderRadius: '20px' } },
      { id: 't3', type: 'stats_premium', name: 'PD Hours', content: '42.5', x: 4, y: 4, width: 4, height: 3, 
        styles: { trendValue: 'Target: 50h', trendUp: true, icon: 'Clock', borderRadius: '20px' } },
      { id: 't4', type: 'stats_premium', name: 'Active Goals', content: '6', x: 8, y: 4, width: 4, height: 3, 
        styles: { trendValue: '2 completed', trendUp: true, icon: 'Target', borderRadius: '20px' } },
      { id: 't5', type: 'list', name: 'Action Items', content: 'Teacher Tasks', x: 0, y: 7, width: 12, height: 8, styles: { borderRadius: '24px' } },
    ]
  },
  LEADER: {
    name: "Team Lead Command Center",
    description: "Strategic oversight for department heads and team lead roles",
    widgets: [
      { id: 'l1', type: 'hero', name: 'Leader Console', content: 'Empower Your Team, Impact', x: 0, y: 0, width: 12, height: 4, 
        styles: { backgroundGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '24px', badge: 'TEAM LEAD' } },
      { id: 'l2', type: 'stats', name: 'Team Count', content: '12', x: 0, y: 4, width: 4, height: 3, styles: { icon: 'Users', borderRadius: '16px' } },
      { id: 'l3', type: 'stats', name: 'Reviews Done', content: '85%', x: 4, y: 4, width: 4, height: 3, styles: { icon: 'CheckCircle', borderRadius: '16px' } },
      { id: 'l4', type: 'stats', name: 'Growth Rate', content: '4.2', x: 8, y: 4, width: 4, height: 3, styles: { icon: 'TrendingUp', borderRadius: '16px' } },
      { id: 'l5', type: 'chart_line', name: 'Departmental Progress', content: 'data', x: 0, y: 7, width: 12, height: 9, styles: { borderRadius: '20px' } },
    ]
  },
  SCHOOL_LEADER: {
    name: "Principal Excellence Dashboard",
    description: "School-wide achievement and institutional health tracking",
    widgets: [
       { id: 'sl1', type: 'hero', name: 'Principal Header', content: 'Lead with Excellence, Campus', x: 0, y: 0, width: 12, height: 5, 
         styles: { backgroundGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', color: '#ffffff', textAlign: 'left', borderRadius: '32px', badge: 'CAMPUS PRINCIPAL' } },
       { id: 'sl2', type: 'stats_premium', name: 'Mean Student GPA', content: '3.9', x: 0, y: 5, width: 4, height: 3, styles: { borderRadius: '20px', trendValue: '+0.1', trendUp: true } },
       { id: 'sl3', type: 'stats_premium', name: 'Staff Retention', content: '98%', x: 4, y: 5, width: 4, height: 3, styles: { borderRadius: '20px', trendValue: 'Industry Leading', trendUp: true } },
       { id: 'sl4', type: 'stats_premium', name: 'Safety Audit', content: 'Pass', x: 8, y: 5, width: 4, height: 3, styles: { borderRadius: '20px', trendValue: 'Verified', trendUp: true } },
       { id: 'sl5', type: 'chart_bar', name: 'Academic Trends by Grade', content: 'results', x: 0, y: 8, width: 12, height: 8, styles: { borderRadius: '24px' } },
    ]
  },
  ADMIN: {
    name: "Campus Operations Console",
    description: "Daily administrative and operational monitoring dashboard",
    widgets: [
      { id: 'a1', type: 'hero', name: 'Campus Command', content: 'Operational Resilience, Active', x: 0, y: 0, width: 12, height: 4, 
        styles: { backgroundGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#ffffff', textAlign: 'left', borderRadius: '24px', badge: 'ADMINISTRATOR' } },
      { id: 'a2', type: 'stats', name: 'Facility Usage', content: '92%', x: 0, y: 4, width: 4, height: 3, styles: { icon: 'Box', borderRadius: '16px' } },
      { id: 'a3', type: 'stats', name: 'Budget Status', content: 'On-Track', x: 4, y: 4, width: 4, height: 3, styles: { icon: 'DollarSign', borderRadius: '16px' } },
      { id: 'a4', type: 'stats', name: 'Incident Logs', content: '0', x: 8, y: 4, width: 4, height: 3, styles: { icon: 'Activity', borderRadius: '16px' } },
      { id: 'a5', type: 'table', name: 'Resource Distribution', content: 'logs', x: 0, y: 7, width: 12, height: 10, styles: { borderRadius: '20px' } },
    ]
  },
  MANAGEMENT: {
    name: "Executive Strategy Board",
    description: "High-level institutional performance and corporate overview",
    widgets: [
      { id: 'm1', type: 'hero', name: 'Governance Hub', content: 'Executive Insights, Global', x: 0, y: 0, width: 12, height: 5, 
        styles: { backgroundGradient: 'linear-gradient(135deg, #312e81 0%, #6d28d9 100%)', color: '#ffffff', textAlign: 'left', borderRadius: '24px', badge: 'CORPORATE BOARD' } },
      { id: 'm2', type: 'chart_line', name: 'Multi-Year Revenue Matrix', content: 'Revenue', x: 0, y: 5, width: 12, height: 10, styles: { borderRadius: '20px' } },
      { id: 'm3', type: 'stats_premium', name: 'Group ROI', content: '+24%', x: 0, y: 15, width: 6, height: 4, styles: { borderRadius: '24px', trendValue: '+3.2%', trendUp: true } },
      { id: 'm4', type: 'stats_premium', name: 'Global Enrollment', content: '48k', x: 6, y: 15, width: 6, height: 4, styles: { borderRadius: '24px', trendValue: '+8.5%', trendUp: true } },
    ]
  },
  SUPERADMIN: {
    name: "Global Platform Governance",
    description: "Multi-campus oversight and core system configuration",
    widgets: [
      { id: 'sa1', type: 'hero', name: 'System Command Center', content: 'Control Everything, Here', x: 0, y: 0, width: 12, height: 5, 
        styles: { 
          backgroundGradient: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', 
          color: '#ffffff', textAlign: 'left', borderRadius: '32px', padding: '60px', badge: 'ROOT ADMIN',
          description: 'Global control pane for user directories, security protocols, and platform health.',
          button1: 'Security Audit', button2: 'Global Sync'
        } 
      },
      { id: 'sa2', type: 'stats_premium', name: 'Nodes Active', content: '12', x: 0, y: 5, width: 3, height: 3, 
        styles: { trendValue: 'All Online', trendUp: true, icon: 'Server', borderRadius: '24px' } },
      { id: 'sa3', type: 'stats_premium', name: 'Total Accounts', content: '4,890', x: 3, y: 5, width: 3, height: 3, 
        styles: { trendValue: '+142 today', trendUp: true, icon: 'Users', borderRadius: '24px' } },
      { id: 'sa4', type: 'stats_premium', name: 'API Latency', content: '42ms', x: 6, y: 5, width: 3, height: 3, 
        styles: { trendValue: 'Stable', trendUp: true, icon: 'Zap', borderRadius: '24px' } },
      { id: 'sa5', type: 'stats_premium', name: 'System Security', content: 'Level 5', x: 9, y: 5, width: 3, height: 3, 
        styles: { trendValue: 'Shield Active', trendUp: true, icon: 'Shield', borderRadius: '24px' } },
      { id: 'sa6', type: 'security_feed', name: 'Real-time Security Logs', content: 'Live Feed', x: 0, y: 8, width: 12, height: 8, 
        styles: { borderRadius: '24px', backgroundColor: '#0f172a', color: '#ffffff' } }
    ]
  },
  HOS: {
    name: "HOS Quality Assurance View",
    description: "Multi-campus academic quality and head of school monitoring",
    widgets: [
      { id: 'h1', type: 'hero', name: 'Academic Control', content: 'Nurturing Quality, Standard', x: 0, y: 0, width: 12, height: 4, 
        styles: { backgroundGradient: 'linear-gradient(to right, #4c1d95, #5b21b6)', borderRadius: '24px', badge: 'H.O.S' } },
      { id: 'h2', type: 'stats', name: 'Campus Index', content: '4.9', x: 0, y: 4, width: 6, height: 3, styles: { icon: 'Award', borderRadius: '16px' } },
      { id: 'h3', type: 'stats', name: 'Faculty Engagement', content: 'Active', x: 6, y: 4, width: 6, height: 3, styles: { icon: 'Users', borderRadius: '16px' } },
      { id: 'h4', type: 'chart_pie', name: 'Subject Distribution', content: 'data', x: 0, y: 7, width: 12, height: 10, styles: { borderRadius: '20px' } },
    ]
  },
  COORDINATOR: {
    name: "Coordinator Support Console",
    description: "Curriculum tracking and team coordination services",
    widgets: [
      { id: 'c1', type: 'hero', name: 'Coordination Hub', content: 'Scaling Impact, Direct', x: 0, y: 0, width: 12, height: 4, 
        styles: { backgroundGradient: 'linear-gradient(to right, #be185d, #db2777)', borderRadius: '24px', badge: 'COORDINATOR' } },
      { id: 'c2', type: 'sparkline', name: 'Student Growth', content: '82%', x: 0, y: 4, width: 6, height: 3, styles: { borderRadius: '20px' } },
      { id: 'c3', type: 'sparkline', name: 'Teacher Progress', content: '94%', x: 6, y: 4, width: 6, height: 3, styles: { borderRadius: '20px' } },
      { id: 'c4', type: 'file_grid', name: 'Curriculum Hub', content: 'Resources', x: 0, y: 7, width: 12, height: 8, styles: { borderRadius: '24px' } },
    ]
  }
};

export interface DashboardBuilderProps {
  initialRole?: string;
}

export function DashboardBuilder({ initialRole }: DashboardBuilderProps) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(!!initialRole);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAutoCreating, setIsAutoCreating] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<any>(null);
  const [selectedWidget, setSelectedWidget] = useState<CanvasWidget | null>(null);

  const [newDashboard, setNewDashboard] = useState({ name: "", description: "", role: "TEACHER" });

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialRole) setIsEditing(true);
  }, [initialRole]);

  useEffect(() => {
    loadData();

    // Register socket listener for real-time dashboard updates
    const socket = getSocket();
    const handleDashboardUpdate = (data: any) => {
      // Refresh the list to see changes from other admins
      loadData();
      if (data && data.name) {
        toast.info(`Dashboard "${data.name}" was updated by another administrator.`);
      }
    };

    socket.on('DASHBOARD_UPDATED', handleDashboardUpdate);

    return () => {
      socket.off('DASHBOARD_UPDATED', handleDashboardUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync selection when initialRole changes (e.g. from SuperAdmin buttons)
  useEffect(() => {
    const syncRole = async () => {
      if (initialRole && dashboards.length > 0 && !isAutoCreating) {
        const searchRole = initialRole.toUpperCase();
        const roleMatches = dashboards.filter(d => d.role === searchRole);
        
        if (roleMatches.length > 0) {
          // Prefer default dashboard for that role
          const target = roleMatches.find(d => d.isDefault) || roleMatches[0];
          setSelectedDashboard(target);
          loadCanvasWidgets(target);
          setIsEditing(true);
        } else if (ROLE_TEMPLATES[searchRole]) {
           // No custom dashboard exists for this role, SILENTLY clone from system
           setIsAutoCreating(true);
           toast.loading(`Cloning ${searchRole} system dashboard...`, { id: 'auto-clone' });
           
           try {
             const res = await dashboardService.create({
               name: ROLE_TEMPLATES[searchRole].name,
               description: ROLE_TEMPLATES[searchRole].description,
               role: searchRole,
               isDefault: true
             });
             
             if (res.status === 'success') {
               const newDbId = res.data.id;
               // Add template widgets
               for (const tw of ROLE_TEMPLATES[searchRole].widgets) {
                 await dashboardService.addWidget(newDbId, {
                   widgetType: tw.type,
                   title: tw.name,
                   dataSource: tw.content,
                   width: tw.width,
                   height: tw.height,
                   positionX: tw.x,
                   positionY: tw.y,
                   config: JSON.stringify(tw.styles || {})
                 });
               }
               
               toast.success(`${searchRole} dashboard successfully cloned from system!`, { id: 'auto-clone' });
               loadData(); // Re-fetch all to get the full object with widgets
             }
           } catch (e) {
             console.error("Auto-clone failed", e);
             toast.error("Failed to initialize dashboard from template", { id: 'auto-clone' });
           } finally {
             setIsAutoCreating(false);
           }
        }
      }
    };
    syncRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRole, dashboards, isAutoCreating]);

  const loadData = async () => {
    try {
      const res = await dashboardService.getAll();
      if (res.status === 'success') {
        const allDashboards = res.data;
        setDashboards(allDashboards);
        
        let startingDashboard = null;
        
        if (allDashboards.length > 0) {
          if (initialRole) {
            const upRole = initialRole.toUpperCase();
            const roleMatches = allDashboards.filter((d: Dashboard) => d.role === upRole);
            if (roleMatches.length > 0) {
              startingDashboard = roleMatches.find((d: any) => d.isDefault) || roleMatches[0];
            }
          }
          
          if (!startingDashboard && !initialRole) {
            startingDashboard = allDashboards[0];
          }
          
          if (startingDashboard) {
            setSelectedDashboard(startingDashboard);
            loadCanvasWidgets(startingDashboard);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCanvasWidgets = (dashboard: Dashboard) => {
    if (dashboard.widgets && dashboard.widgets.length > 0) {
      const widgets = dashboard.widgets.map((w: DashboardWidget) => {
        let parsedStyles = {};
        try {
          if (w.config) parsedStyles = JSON.parse(w.config);
        } catch (e) {
          console.warn("Failed to parse widget config", e);
        }

        return {
          id: w.id,
          type: w.widgetType,
          name: w.title,
          content: w.dataSource || '',
          width: w.width,
          height: w.height,
          x: w.positionX,
          y: w.positionY,
          styles: parsedStyles
        };
      });
      setCanvasWidgets(widgets);
    } else {
      // Check for template first
      const upRole = dashboard.role?.toUpperCase();
      if (upRole && ROLE_TEMPLATES[upRole]) {
         const templateWidgets = ROLE_TEMPLATES[upRole].widgets.map(w => ({
           ...w,
           id: `temp_${Math.random().toString(36).substr(2, 5)}`
         }));
         setCanvasWidgets(templateWidgets);
      } else {
        setCanvasWidgets([
          {
            id: 'welcome_hero',
            type: 'hero',
            name: 'Hero Section',
            content: 'Excellence in Education',
            width: 12,
            height: 4,
            x: 0,
            y: 0,
            styles: {
              fontSize: "48px",
              color: "#ffffff",
              backgroundColor: "#1e293b",
              backgroundGradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }
          }
        ]);
      }
    }
  };

  const handleSelectDashboard = (dashboard: Dashboard) => {
    setSelectedDashboard(dashboard);
    loadCanvasWidgets(dashboard);
    setSelectedWidget(null);
  };

  const handleCreateDashboard = async () => {
    if (!newDashboard.name.trim()) {
      toast.error("Enter dashboard name");
      return;
    }
    try {
      const res = await dashboardService.create(newDashboard);
      if (res.status === 'success') {
        toast.success("Dashboard created with system baseline!");
        
        // Auto-clone widgets from template if it exists
        const upRole = newDashboard.role.toUpperCase();
        if (ROLE_TEMPLATES[upRole]) {
          const template = ROLE_TEMPLATES[upRole];
          for (const tw of template.widgets) {
            await dashboardService.addWidget(res.data.id, {
              widgetType: tw.type,
              title: tw.name,
              dataSource: tw.content,
              width: tw.width,
              height: tw.height,
              positionX: tw.x,
              positionY: tw.y,
              config: JSON.stringify(tw.styles || {})
            });
          }
        }

        const freshRes = await dashboardService.getById(res.data.id);
        const savedDb = freshRes.status === 'success' ? freshRes.data : res.data;
        
        setDashboards([...dashboards, savedDb]);
        setSelectedDashboard(savedDb);
        loadCanvasWidgets(savedDb);
        setIsCreateOpen(false);
        setNewDashboard({ name: "", description: "", role: "TEACHER" });
      }
    } catch (error) {
      toast.error("Failed to create dashboard");
    }
  };

  const handleCloneDashboard = async () => {
    if (!selectedDashboard) return;
    try {
      toast.loading("Cloning dashboard...", { id: 'manual-clone' });
      const cloneData = {
        name: `${selectedDashboard.name} (Copy)`,
        description: selectedDashboard.description,
        role: selectedDashboard.role,
        isActive: true
      };
      
      const res = await dashboardService.create(cloneData);
      if (res.status === 'success') {
        const newDashboard = res.data;
        // Copy widgets
        for (const w of canvasWidgets) {
          await dashboardService.addWidget(newDashboard.id, {
            widgetType: w.type,
            title: w.name,
            dataSource: w.content,
            width: w.width,
            height: w.height,
            positionX: w.x,
            positionY: w.y,
            config: JSON.stringify(w.styles || {})
          });
        }
        
        toast.success("Dashboard successfully cloned and ready for edits!", { id: 'manual-clone' });
        
        // Refresh and select the new one
        const resList = await dashboardService.getAll();
        if (resList.status === 'success') {
          const updatedList = resList.data;
          setDashboards(updatedList);
          const cloned = updatedList.find((d: Dashboard) => d.id === newDashboard.id);
          if (cloned) {
            handleSelectDashboard(cloned);
          }
        }
      }
    } catch (error) {
      toast.error("Cloning failed", { id: 'manual-clone' });
    }
  };

  const handleResetToDefault = async () => {
    if (!selectedDashboard || !ROLE_TEMPLATES[selectedDashboard.role]) {
      toast.error("No official system default found for this role.");
      return;
    }
    
    if (!confirm(`Are you sure you want to reset "${selectedDashboard.name}" to the system default layout? This will delete all your current widgets.`)) {
      return;
    }

    try {
      toast.loading("Resetting to system default...", { id: 'reset' });
      
      // Delete all current widgets
      for (const w of selectedDashboard.widgets || []) {
        await dashboardService.deleteWidget(selectedDashboard.id, w.id);
      }

      // Load template widgets
      const template = ROLE_TEMPLATES[selectedDashboard.role];
      for (const tw of template.widgets) {
        await dashboardService.addWidget(selectedDashboard.id, {
          widgetType: tw.type,
          title: tw.name,
          dataSource: tw.content,
          width: tw.width,
          height: tw.height,
          positionX: tw.x,
          positionY: tw.y,
          config: JSON.stringify(tw.styles || {})
        });
      }

      toast.success("Reset to system baseline successful!", { id: 'reset' });
      loadData();
    } catch (e) {
      toast.error("Failed to reset dashboard", { id: 'reset' });
    }
  };

  const handleDeleteDashboard = async (id: string) => {
    try {
      await dashboardService.delete(id);
      toast.success("Deleted");
      const updated = dashboards.filter(d => d.id !== id);
      setDashboards(updated);
      if (selectedDashboard?.id === id) {
        setSelectedDashboard(updated[0] || null);
        setCanvasWidgets([]);
      }
    } catch (error) {
      toast.error("Failed");
    }
  };

  const handleDragStart = (widget: any) => {
    setDraggedWidget(widget);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedWidget || !selectedDashboard) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x = Math.floor((e.clientX - rect.left) / 100);
    let y = Math.floor((e.clientY - rect.top) / 80);

    // Prevent overlapping with quick hack layout calculations
    x = Math.max(0, x);
    y = Math.max(0, y);

    const newW: CanvasWidget = {
      id: 'widget_' + Date.now(),
      type: draggedWidget.id,
      name: draggedWidget.name,
      content: draggedWidget.defaultContent,
      width: ['heading', 'text', 'divider', 'image'].includes(draggedWidget.id) ? 4 : 2,
      height: ['text', 'image', 'video'].includes(draggedWidget.id) ? 3 : 2,
      x: x,
      y: y,
      styles: {
        fontSize: draggedWidget.id === 'hero' ? "48px" : "16px",
        color: draggedWidget.id === 'hero' ? "#ffffff" : "#0f172a",
        backgroundColor: draggedWidget.id === 'hero' ? "#1e293b" : "transparent",
        backgroundGradient: draggedWidget.id === 'hero' ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "",
        padding: draggedWidget.id === 'hero' ? "40px" : "16px",
        borderRadius: "8px",
        textAlign: draggedWidget.id === 'hero' ? "center" : "left",
        boxShadow: draggedWidget.id === 'card' ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
      }
    };

    setCanvasWidgets([...canvasWidgets, newW]);
    setSelectedWidget(newW);
    setDraggedWidget(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleWidgetClick = (e: React.MouseEvent, widget: CanvasWidget) => {
    e.stopPropagation();
    if (isEditing) {
      setSelectedWidget(widget);
    }
  };

  const handleDeleteWidget = (widgetId: string) => {
    setCanvasWidgets(canvasWidgets.filter(w => w.id !== widgetId));
    if (selectedWidget?.id === widgetId) setSelectedWidget(null);
    toast.success("Removed");
  };

  const handleUpdateWidgetProperty = (key: string, value: any) => {
    if (!selectedWidget) return;

    const updated = canvasWidgets.map(w => {
      if (w.id === selectedWidget.id) {
        if (key === 'content' || key === 'name' || key === 'width' || key === 'height') {
          return { ...w, [key]: value };
        } else {
          return { ...w, styles: { ...w.styles, [key]: value } };
        }
      }
      return w;
    });

    setCanvasWidgets(updated);
    setSelectedWidget(updated.find(w => w.id === selectedWidget.id) || null);
  };

  const handleSaveDashboard = async () => {
    if (!selectedDashboard) return;
    try {
      for (const w of selectedDashboard.widgets || []) {
        await dashboardService.deleteWidget(selectedDashboard.id, w.id);
      }

      for (let i = 0; i < canvasWidgets.length; i++) {
        const w = canvasWidgets[i];
        await dashboardService.addWidget(selectedDashboard.id, {
          widgetType: w.type,
          title: w.name,
          dataSource: w.content,
          width: w.width,
          height: w.height,
          positionX: w.x,
          positionY: w.y,
          config: JSON.stringify(w.styles || {})
        });
      }
      toast.success("Page published live!");
      loadData();
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  const handleSetDefault = async () => {
    if (!selectedDashboard) return;
    try {
      await dashboardService.setDefault(selectedDashboard.role, selectedDashboard.id);
      toast.success(`${selectedDashboard.name} set as default for ${selectedDashboard.role}`);
      loadData();
    } catch (error) {
      toast.error("Failed to set default");
    }
  };

  const getWidgetOption = (type: string) => {
    return WIDGET_OPTIONS.find(w => w.id === type) || WIDGET_OPTIONS.find(w => w.type === type) || WIDGET_OPTIONS[0];
  };

  const renderWidgetPreview = (widget: CanvasWidget) => {
    const isUIElement = ['heading', 'text', 'button', 'image', 'video', 'divider'].includes(widget.type);

    if (isUIElement) {
      switch (widget.type) {
        case 'heading':
          return <h2 style={{ ...widget.styles, margin: 0, fontWeight: 'bold' }}>{widget.content}</h2>;
        case 'hero': {
          const isPremiumHero = !!widget.styles?.badge || !!widget.styles?.button1;
          if (isPremiumHero) {
            const badgeText = widget.styles?.badge;
            const descriptionText = widget.styles?.description;
            
            return (
              <div style={{
                ...widget.styles,
                background: (widget.styles?.backgroundGradient as string) || (widget.styles?.backgroundColor as string),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                padding: widget.styles?.padding || '60px',
                position: 'relative',
                borderRadius: widget.styles?.borderRadius || '32px'
              }} className="hero-widget shadow-2xl group transition-all duration-500 hover:shadow-indigo-500/10">
                <div className="flex-1 flex flex-col items-start gap-4 z-10">
                  {badgeText && (
                    <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-bold text-foreground/80 tracking-widest uppercase flex items-center gap-2 mb-2 backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      {badgeText}
                    </div>
                  )}
                  <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#ffffff' }}>
                    {widget.content.split(',')[0]}, <span className="text-red-500">{widget.content.split(',')[1] || ''}</span>
                  </h1>
                  <p className="max-w-md text-foreground/60 text-lg leading-relaxed font-medium mt-2">
                    {descriptionText || 'Oversee the ecosystem, manage workflows, and configure system-wide parameters from your central command center.'}
                  </p>
                </div>
                <div className="flex gap-4 z-10 pr-8">
                  {widget.styles?.button1 && (
                    <Button className="bg-red-500 hover:bg-red-600 text-foreground border-none h-14 px-8 rounded-2xl font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 transform active:scale-95 transition-all">
                      <Settings className="w-5 h-5" /> {widget.styles.button1}
                    </Button>
                  )}
                  {widget.styles?.button2 && (
                    <Button variant="outline" className="bg-white/5 border-white/10 text-foreground hover:bg-white/10 h-14 px-8 rounded-2xl font-bold flex items-center gap-2 transform active:scale-95 transition-all backdrop-blur-md">
                      <Users className="w-5 h-5" /> {widget.styles.button2}
                    </Button>
                  )}
                </div>
                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
              </div>
            );
          }
          return (
            <div style={{
              ...widget.styles,
              background: (widget.styles?.backgroundGradient as string) || (widget.styles?.backgroundColor as string),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: widget.styles?.textAlign === 'center' ? 'center' : widget.styles?.textAlign === 'right' ? 'flex-end' : 'flex-start',
              height: '100%',
              width: '100%',
              overflow: 'hidden'
            }} className="hero-widget shadow-xl">
              <h1 style={{ margin: 0, fontSize: '1em', lineHeight: 1.2 }}>{widget.content}</h1>
              <p className="mt-4 opacity-80" style={{ fontSize: '0.4em' }}>Transforming the future of learning through innovation and commitment to excellence.</p>
              <Button className="mt-6 bg-white text-slate-900 border-none hover:bg-slate-100" size="lg">Explore More</Button>
            </div>
          );
        }
        case 'card': {
          const CardIcon = (widget.styles?.icon && (LucideIcons as any)[widget.styles.icon]) || Sparkles;
          return (
            <div style={{
              ...widget.styles,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderRadius: widget.styles?.borderRadius || '24px'
            }} className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-foreground transition-colors duration-500">
                <CardIcon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 m-0 mt-2">{widget.content}</h3>
              <p className="text-sm text-slate-500 m-0 leading-relaxed font-medium">
                {widget.styles?.subtitle || 'Detailed insights and performance tracking for academic excellence.'}
              </p>
              <div className="mt-auto pt-4 flex items-center text-indigo-600 text-[13px] font-bold group-hover:gap-2 transition-all">
                Quick Access <ChevronRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          );
        }
        case 'text':
          return <p style={{ ...widget.styles, margin: 0, whiteSpace: 'pre-wrap' }}>{widget.content}</p>;
        case 'button':
          return <button style={{
            ...widget.styles,
            cursor: isEditing ? 'default' : 'pointer',
            border: 'none',
          }} className="shadow-sm font-medium hover:opacity-90 transition-opacity">
            {widget.content}
          </button>;
        case 'image':
          return <div style={{ width: '100%', height: '100%', overflow: 'hidden', padding: widget.styles?.padding, backgroundColor: widget.styles?.backgroundColor as any, borderRadius: widget.styles?.borderRadius }}>
            <img src={widget.content} alt={widget.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: widget.styles?.borderRadius }} />
          </div>;
        case 'video':
          return <div style={{ width: '100%', height: '100%', padding: widget.styles?.padding, backgroundColor: widget.styles?.backgroundColor as any, borderRadius: widget.styles?.borderRadius }}>
            <video src={widget.content} controls style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: widget.styles?.borderRadius }} />
          </div>;
        case 'divider':
          return <hr style={{
            marginTop: widget.styles?.padding || '1rem',
            marginBottom: widget.styles?.padding || '1rem',
            borderColor: (widget.styles?.color || '#e2e8f0') as any,
            borderWidth: '2px'
          }} />;
        case 'spacer':
          return <div style={{ height: widget.styles?.padding || '20px' }}></div>;
      }
    }

    // Default System Widgets
    const option = getWidgetOption(widget.type);
    const IconComponent = (widget.styles?.icon && (LucideIcons as any)[widget.styles.icon]) || (option as any)?.icon || Activity;

    if (widget.type === 'stats_premium') {
      const Icon = (widget.styles?.icon && (LucideIcons as any)[widget.styles.icon]) || Activity;
      const isUp = widget.styles?.trendUp ?? true;
      return (
        <div style={{ ...widget.styles, height: '100%' }} className="bg-slate-50 border border-slate-100 p-6 flex flex-col justify-between group hover:bg-white hover:shadow-2xl transition-all duration-300 rounded-[24px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">{widget.name}</span>
              <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tight">{widget.content}</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-500 border border-slate-100 group-hover:scale-110 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-500">
              <Icon className="w-7 h-7" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex items-center text-[12px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'text-violet-600 bg-violet-50' : 'text-slate-500 bg-slate-100'}`}>
              {isUp ? <ArrowUp className="w-3 h-3 mr-1" /> : null}
              {widget.styles?.trendValue || 'Stable trend'}
            </div>
          </div>
        </div>
      );
    }
    if (widget.type === 'security_feed') {
      return <SecurityFeed styles={widget.styles} />;
    }

    if (widget.type === 'chat_mini') {
      return (
        <div className="absolute bottom-6 right-6 z-50 animate-bounce cursor-pointer">
          <div className="bg-white px-4 py-2 rounded-full shadow-2xl border border-slate-100 flex items-center gap-3">
            <div className="text-xs font-bold text-slate-900">{widget.content} 🤙</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-400 to-indigo-500 flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=AI+Bot&background=6366f1&color=fff" alt="Bot" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (widget.type === 'progress_card') {
      return (
        <div style={{ ...widget.styles, height: '100%', overflow: 'hidden' }} className="p-8 flex flex-col justify-center relative group">
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold opacity-90">{widget.name}</h3>
              <div className="text-4xl font-black flex items-baseline gap-2">
                {widget.content}
                <span className="text-sm font-medium opacity-60">/ 20 hrs</span>
              </div>
            </div>
            <Trophy className="w-12 h-12 text-yellow-300 animate-bounce" />
          </div>
          <div className="h-4 w-full bg-backgroundlack/20 rounded-full overflow-hidden border border-white/10 relative z-10">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 to-violet-400 transition-all duration-1000 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
              style={{ width: `${Math.min(100, (Number(widget.content) / 20) * 100)}%` }}
            />
          </div>
        </div>
      );
    }

    if (widget.type === 'sparkline') {
      return (
        <div style={{ ...widget.styles, height: '100%' }} className="bg-white p-6 flex items-center justify-between group hover:shadow-xl transition-all rounded-[24px] border border-slate-100">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{widget.name}</span>
            <span className="text-2xl font-black text-slate-800">{widget.content}</span>
          </div>
          <div className="w-24 h-12 relative overflow-hidden">
             {/* SVG Sparkline Placeholder */}
             <svg className="w-full h-full text-indigo-500 overflow-visible" viewBox="0 0 100 30">
               <path d="M0 20 Q 20 5, 40 25 T 80 15 T 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
             </svg>
          </div>
        </div>
      );
    }

    if (widget.type === 'file_grid') {
      return (
        <div style={{ ...widget.styles, height: '100%' }} className="bg-slate-50 p-6 flex flex-col gap-4 rounded-[24px] border border-slate-100 overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{widget.name}</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1">
            {['Strategy_Q1.pdf', 'Teacher_Handbook.docx', 'Campus_Map_v2.png'].map((file, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3 hover:border-indigo-300 transition-colors group cursor-pointer shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold text-[10px] group-hover:bg-indigo-600 group-hover:text-foreground transition-all">Doc</div>
                <div className="text-xs font-bold text-slate-700 truncate">{file}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        className="h-full flex flex-col items-center justify-center p-6 bg-white shadow-sm transition-all hover:shadow-md"
        style={{ borderRadius: (widget.styles?.borderRadius as string) || '12px', ...widget.styles } as any}
      >
        <div className={`p-3 rounded-2xl mb-3 ${(option as any)?.color || 'bg-violet-500'} text-foreground shadow-lg`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="text-center font-black text-3xl tracking-tight leading-none mb-1">{widget.content || '0'}</div>
        <div className="text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-1">{widget.name}</div>
          {widget.styles?.subtitle && (
            <div className="text-[10px] font-bold text-indigo-500/80 tracking-wide bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
              {widget.styles.subtitle}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top Navbar / Super Admin Panel */}
      <div className="bg-background text-foreground px-6 py-3 flex items-center justify-between shadow-md z-20 relative">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <LayoutDashboard className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Website Editor</h1>
            <p className="text-xs text-muted-foreground font-medium">Super Admin Control Panel</p>
          </div>
          <Separator orientation="vertical" className="h-8 bg-slate-700 mx-2" />
          <div className="flex gap-1 bg-card p-1 rounded-lg">
            <Button variant={!isEditing ? "secondary" : "ghost"} size="sm" onClick={() => { setIsEditing(false); setSelectedWidget(null); }} className={!isEditing ? "bg-white text-slate-900 hover:bg-white" : "text-slate-300 hover:text-foreground"}>
              <Eye className="w-4 h-4 mr-1.5" /> Preview Live
            </Button>
            <Button variant={isEditing ? "secondary" : "ghost"} size="sm" onClick={() => setIsEditing(true)} className={isEditing ? "bg-white text-slate-900 hover:bg-white" : "text-slate-300 hover:text-foreground"}>
              <Palette className="w-4 h-4 mr-1.5" /> Site Builder
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing && selectedDashboard && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-card border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={handleCloneDashboard}
              >
                <Copy className="w-4 h-4 mr-2" /> Clone
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-card border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={() => { loadData(); toast.info("Changes discarded."); }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Discard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-red-900/20 border-red-900/50 text-red-400 hover:bg-red-900/40"
                onClick={handleResetToDefault}
              >
                <Activity className="w-4 h-4 mr-2" /> Restore System Default
              </Button>
              <Separator orientation="vertical" className="h-6 bg-slate-700 mx-2" />
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-card border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={handleSetDefault} 
                disabled={selectedDashboard.isDefault}
              >
                {selectedDashboard.isDefault ? "Current Default" : "Set as Default"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-card border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={() => window.open(`/${selectedDashboard.role.toLowerCase()}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" /> View Site
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-indigo-600 hover:bg-indigo-500 shadow-lg font-bold"
                onClick={handleSaveDashboard}
              >
                <ArrowUpRight className="w-4 h-4 mr-2" /> Publish Live
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Pages & Components */}
        <div className={`w-64 bg-white border-r flex flex-col shadow-sm z-10 ${!isEditing ? 'hidden' : ''}`}>
          <div className="p-4 border-b bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-800 capitalize tracking-widest flex items-center gap-2">
                <Copy className="w-4 h-4 text-indigo-500" /> Pages
              </h3>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Select
              value={selectedDashboard?.id || ""}
              onValueChange={(v) => {
                const db = dashboards.find(d => d.id === v);
                if (db) handleSelectDashboard(db);
              }}
            >
              <SelectTrigger className="w-full bg-white font-medium shadow-sm">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                {dashboards.map(d => (
                  <SelectItem key={d.id} value={d.id}>
                    <div className="flex items-center justify-between w-full min-w-[200px]">
                      <span>{d.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase ml-4">
                        {d.role}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <h3 className="font-bold text-xs text-slate-500 capitalize tracking-widest mb-3">Elements Library</h3>
            <p className="text-xs text-muted-foreground mb-4 font-medium italic">Drag elements onto the canvas</p>

            <div className="space-y-5">
              {['UI Elements', 'Stats', 'Charts', 'Lists & Tables'].map(category => {
                const widgets = WIDGET_OPTIONS.filter(w => w.category === category);
                if (widgets.length === 0) return null;
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="text-[10px] font-bold text-muted-foreground capitalize tracking-wider">{category}</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {widgets.map(widget => {
                        const Icon = widget.icon;
                        return (
                          <div
                            key={widget.id}
                            draggable
                            onDragStart={() => handleDragStart(widget)}
                            className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-indigo-400 hover:shadow-md transition-all active:cursor-grabbing group"
                          >
                            <div className={`p-2 rounded-md ${widget.color} text-foreground shrink-0 mb-1.5 shadow-sm group-hover:scale-110 transition-transform`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 text-center leading-tight">{widget.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 overflow-auto bg-slate-100 flex justify-center p-8 custom-scrollbar relative custom-grid-bg" onClick={() => setSelectedWidget(null)}>
          {!selectedDashboard ? (
            <div className="m-auto text-center p-10 bg-white rounded-xl shadow-sm border border-slate-200 max-w-sm">
              <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h2 className="text-xl font-bold text-slate-800">No Page Selected</h2>
              <p className="text-sm text-slate-500 mt-2 mb-6">Create a new page to start building your website or dashboard.</p>
              <Button onClick={() => setIsCreateOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Create New Page
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-6xl">
              <div
                ref={canvasRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => setSelectedWidget(null)}
                className={`min-h-[800px] w-full rounded-none transition-all ${isEditing ? 'border-2 border-dashed border-indigo-300 bg-white/50 backdrop-blur-sm' : 'bg-transparent'}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gridAutoRows: '80px',
                  gap: '16px',
                  paddingBottom: '200px'
                }}
              >
                {canvasWidgets.length === 0 && isEditing ? (
                  <div className="col-span-12 flex flex-col items-center justify-center text-muted-foreground py-32 h-full border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 mt-4 mr-4 ml-4">
                    <MousePointerClick className="w-16 h-16 mb-4 opacity-50 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-slate-600">Drag Elements Here</h2>
                    <p className="text-sm mt-2 text-slate-500 max-w-sm text-center">Start dragging text, images, buttons or components from the left panel onto this canvas to build your page.</p>
                  </div>
                ) : (
                  canvasWidgets.map(widget => {
                    const isSelected = selectedWidget?.id === widget.id;
                    const isUIElement = ['heading', 'text', 'button', 'image', 'video', 'divider'].includes(widget.type);

                    return (
                      <div
                        key={widget.id}
                        onClick={(e) => handleWidgetClick(e, widget)}
                        className={`
                          relative group transition-all
                          ${isSelected && isEditing ? 'ring-2 ring-indigo-500 shadow-xl z-10' : ''}
                          ${isEditing ? 'cursor-pointer hover:ring-2 hover:ring-indigo-300/50' : ''}
                          ${!isUIElement && !isEditing ? 'hover:shadow-md' : ''}
                        `}
                        style={{
                          gridColumn: `span ${widget.width}`,
                          gridRow: `span ${widget.height}`,
                          outline: isEditing && !isSelected ? '1px dashed #cbd5e1' : 'none',
                        }}
                      >
                        {isEditing && (
                          <div className={`absolute -top-3 -right-3 flex gap-1 z-20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            <div className="bg-indigo-600 text-foreground text-[10px] font-bold px-2 py-1 rounded shadow-md truncate max-w-[100px]">
                              {widget.type}
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 rounded-full shadow-md hover:scale-110 transition-transform"
                              onClick={(e) => { e.stopPropagation(); handleDeleteWidget(widget.id); }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        <div className="w-full h-full text-slate-800">
                          {renderWidgetPreview(widget)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties Editor */}
        {isEditing && (
          <div className="w-80 bg-white border-l shadow-sm z-10 flex flex-col">
            <div className="p-4 border-b bg-slate-50">
              <h3 className="font-bold text-sm text-slate-800 capitalize tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" /> Style Editor
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {!selectedWidget ? (
                <div className="text-center py-10 opacity-50">
                  <MousePointerClick className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">Select an element on the canvas to edit its properties, content, and styling.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 capitalize tracking-wider text-[10px] font-bold">
                      {selectedWidget.type}
                    </Badge>
                  </div>

                  {/* Content Settings */}
                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 capitalize tracking-wider mb-2">Content & Labels</h4>

                    <div className="space-y-1.5 text-indigo-600">
                      <Label className="text-xs font-bold">Widget Label (Display Title)</Label>
                      <Input
                        value={selectedWidget.name}
                        onChange={(e) => handleUpdateWidgetProperty('name', e.target.value)}
                        className="text-sm bg-white border-indigo-100"
                        placeholder="e.g. Total Students"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Main Value / URL / Data</Label>
                      {['text', 'heading'].includes(selectedWidget.type) ? (
                        <Textarea
                          value={selectedWidget.content}
                          onChange={(e) => handleUpdateWidgetProperty('content', e.target.value)}
                          className="min-h-[100px] text-sm font-mono bg-white resize-none"
                        />
                      ) : (
                        <Input
                          value={selectedWidget.content}
                          onChange={(e) => handleUpdateWidgetProperty('content', e.target.value)}
                          className="text-sm bg-white"
                        />
                      )}
                    </div>
                  </div>

                  {/* Grid / Layout Settings */}
                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 capitalize tracking-wider mb-2">Layout & Size</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Width (Columns)</Label>
                        <Select value={String(selectedWidget.width)} onValueChange={(v) => handleUpdateWidgetProperty('width', Number(v))}>
                          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 Cols (16%)</SelectItem>
                            <SelectItem value="3">3 Cols (25%)</SelectItem>
                            <SelectItem value="4">4 Cols (33%)</SelectItem>
                            <SelectItem value="6">6 Cols (50%)</SelectItem>
                            <SelectItem value="8">8 Cols (66%)</SelectItem>
                            <SelectItem value="9">9 Cols (75%)</SelectItem>
                            <SelectItem value="12">12 Cols (100%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Height (Rows)</Label>
                        <Select value={String(selectedWidget.height)} onValueChange={(v) => handleUpdateWidgetProperty('height', Number(v))}>
                          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Row x 1</SelectItem>
                            <SelectItem value="2">Row x 2</SelectItem>
                            <SelectItem value="3">Row x 3</SelectItem>
                            <SelectItem value="4">Row x 4</SelectItem>
                            <SelectItem value="6">Row x 6</SelectItem>
                            <SelectItem value="8">Row x 8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Appearance / Styling */}
                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 capitalize tracking-wider mb-2">Appearance</h4>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Font Size</Label>
                      <Select value={String(selectedWidget.styles?.fontSize || '16px')} onValueChange={(v) => handleUpdateWidgetProperty('fontSize', v)}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12px">Small (12px)</SelectItem>
                          <SelectItem value="14px">Base (14px)</SelectItem>
                          <SelectItem value="16px">Normal (16px)</SelectItem>
                          <SelectItem value="20px">Large (20px)</SelectItem>
                          <SelectItem value="24px">Heading 3 (24px)</SelectItem>
                          <SelectItem value="32px">Heading 2 (32px)</SelectItem>
                          <SelectItem value="48px">Heading 1 (48px)</SelectItem>
                          <SelectItem value="64px">Display (64px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Text Align</Label>
                        <Select value={String(selectedWidget.styles?.textAlign || 'left')} onValueChange={(v) => handleUpdateWidgetProperty('textAlign', v)}>
                          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="justify">Justify</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Text Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            value={String(selectedWidget.styles?.color || '#000000')}
                            onChange={(e) => handleUpdateWidgetProperty('color', e.target.value)}
                          />
                          <Input
                            value={String(selectedWidget.styles?.color || '#000000')}
                            onChange={(e) => handleUpdateWidgetProperty('color', e.target.value)}
                            className="bg-white text-xs h-8 capitalize font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Background Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          value={String(selectedWidget.styles?.backgroundColor || '#ffffff')}
                          onChange={(e) => handleUpdateWidgetProperty('backgroundColor', e.target.value)}
                        />
                        <Input
                          value={String(selectedWidget.styles?.backgroundColor || 'transparent')}
                          onChange={(e) => handleUpdateWidgetProperty('backgroundColor', e.target.value)}
                          className="bg-white text-xs h-8 font-mono"
                          placeholder="transparent or #hex"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Padding</Label>
                        <Input
                          value={String(selectedWidget.styles?.padding || '0px')}
                          onChange={(e) => handleUpdateWidgetProperty('padding', e.target.value)}
                          className="bg-white text-xs font-mono"
                          placeholder="e.g. 16px"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Border Radius</Label>
                        <Input
                          value={String(selectedWidget.styles?.borderRadius || '0px')}
                          onChange={(e) => handleUpdateWidgetProperty('borderRadius', e.target.value)}
                          className="bg-white text-xs font-mono"
                          placeholder="e.g. 8px"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Bg Color</Label>
                        <Input
                          type="color"
                          value={String(selectedWidget.styles?.backgroundColor || '#ffffff')}
                          onChange={(e) => handleUpdateWidgetProperty('backgroundColor', e.target.value)}
                          className="h-8 p-1 bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Text Color</Label>
                        <Input
                          type="color"
                          value={String(selectedWidget.styles?.color || '#000000')}
                          onChange={(e) => handleUpdateWidgetProperty('color', e.target.value)}
                          className="h-8 p-1 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Background Gradient</Label>
                      <Input
                        value={String(selectedWidget.styles?.backgroundGradient || '')}
                        onChange={(e) => handleUpdateWidgetProperty('backgroundGradient', e.target.value)}
                        className="bg-white text-xs font-mono"
                        placeholder="linear-gradient(...)"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Box Shadow</Label>
                      <Select value={String(selectedWidget.styles?.boxShadow || 'none')} onValueChange={(v) => handleUpdateWidgetProperty('boxShadow', v)}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="0 1px 3px 0 rgba(0, 0, 0, 0.1)">Small</SelectItem>
                          <SelectItem value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Medium</SelectItem>
                          <SelectItem value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Large</SelectItem>
                          <SelectItem value="0 20px 25px -5px rgba(0, 0, 0, 0.1)">X-Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Border Style</Label>
                      <Select value={String(selectedWidget.styles?.border || 'none')} onValueChange={(v) => handleUpdateWidgetProperty('border', v)}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="1px solid #e2e8f0">Solid Low</SelectItem>
                          <SelectItem value="1px solid #cbd5e1">Solid Mid</SelectItem>
                          <SelectItem value="2px solid #8b5cf6">Solid Indigo</SelectItem>
                          <SelectItem value="1px dashed #cbd5e1">Dashed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Premium Controls */}
                  {(['hero', 'stats_premium', 'card'].includes(selectedWidget.type)) && (
                    <div className="space-y-4 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="text-xs font-bold text-indigo-600 capitalize tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Premium Config
                      </h4>
                      
                      {selectedWidget.type === 'hero' && (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-600">Badge Text</Label>
                            <Input
                              value={selectedWidget.styles?.badge || ''}
                              onChange={(e) => handleUpdateWidgetProperty('badge', e.target.value)}
                              className="bg-white text-xs"
                              placeholder="e.g. FEATURED"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-600">Description Text</Label>
                            <Textarea
                              value={selectedWidget.styles?.description || ''}
                              onChange={(e) => handleUpdateWidgetProperty('description', e.target.value)}
                              className="bg-white text-xs min-h-[60px]"
                              placeholder="Hero subtitle description..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600">Button 1 Label</Label>
                                <Input
                                  value={selectedWidget.styles?.button1 || ''}
                                  onChange={(e) => handleUpdateWidgetProperty('button1', e.target.value)}
                                  className="bg-white text-xs"
                                />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600">Button 2 Label</Label>
                                <Input
                                  value={selectedWidget.styles?.button2 || ''}
                                  onChange={(e) => handleUpdateWidgetProperty('button2', e.target.value)}
                                  className="bg-white text-xs"
                                />
                             </div>
                          </div>
                        </>
                      )}

                      {selectedWidget.type === 'stats_premium' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-600">Trend Text</Label>
                            <Input
                              value={selectedWidget.styles?.trendValue || ''}
                              onChange={(e) => handleUpdateWidgetProperty('trendValue', e.target.value)}
                              className="bg-white text-xs"
                              placeholder="+12% monthly"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-600">Trend Vector</Label>
                            <Select 
                              value={selectedWidget.styles?.trendUp === false ? 'down' : 'up'} 
                              onValueChange={(v) => handleUpdateWidgetProperty('trendUp', v === 'up')}
                            >
                              <SelectTrigger className="bg-white text-xs h-8"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="up">Trending Up (Green)</SelectItem>
                                <SelectItem value="down">Trending Down (Neutral)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {selectedWidget.type === 'card' && (
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-600">Card Subtitle</Label>
                          <Input
                            value={selectedWidget.styles?.subtitle || ''}
                            onChange={(e) => handleUpdateWidgetProperty('subtitle', e.target.value)}
                            className="bg-white text-xs"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Widget Icon (Lucide name)</Label>
                        <Input
                          value={selectedWidget.styles?.icon || ''}
                          onChange={(e) => handleUpdateWidgetProperty('icon', e.target.value)}
                          className="bg-white text-xs font-mono"
                          placeholder="Users, Star, Activity, etc."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Dashboard Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page / Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={newDashboard.name}
                onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                placeholder="e.g. Landing Page, Admin Analytics"
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug / Description</Label>
              <Input
                value={newDashboard.description}
                onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                placeholder="e.g. /home, /dashboard"
              />
            </div>
            <div className="space-y-2">
              <Label>Access Role</Label>
              <Select value={newDashboard.role} onValueChange={(v) => setNewDashboard({ ...newDashboard, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.displayName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDashboard}>Create Page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Background Pattern Style for Edit Mode */}
      <style>{`
        .custom-grid-bg {
          background-image: radial-gradient(#cbd5e1 1px, transparent 0);
          background-size: 20px 20px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default DashboardBuilder;
