// @ts-nocheck
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@pdi/hooks/useAuth";
import { useAccessControl } from "@pdi/hooks/useAccessControl";
import { DashboardLayout } from "@pdi/components/layout/DashboardLayout";
import { CustomDashboardWrapper } from "@pdi/components/CustomDashboardWrapper";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { StatCard } from "@pdi/components/StatCard";
import {
    Users,
    Gear,
    ShieldCheck,
    FileText,
    GraduationCap,
    Calendar,
    UsersThree,
    Layout,
    ChartLineUp,
    Clock,
    Target,
    ChartBar,
    ClipboardText,
    MagnifyingGlass,
    Pulse,
    BookOpen
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";

// Import Admin Specific Views
import { UserManagementView } from "./admin/UserManagementView";
import { SuperAdminView } from "./admin/SuperAdminView";
import { SystemSettingsView } from "./admin/SystemSettingsView";
import { FormTemplatesView } from "./admin/FormTemplatesView";
import AdminGrowthAnalyticsPage from "./admin/AdminGrowthAnalyticsPage";
import { AdminGoalsView } from "./admin/AdminGoalsView";
import { CourseManagementView } from "./admin/CourseManagementView";
import { PDHoursAnalyticsView } from "./admin/PDHoursAnalyticsView";
import { AdminReportsView } from "./admin/AdminReportsView";
import AttendanceRegister from "./AttendanceRegister";
import { AdminCalendarView } from "./admin/AdminCalendarView";
import { MeetingsDashboard } from "./MeetingsDashboard";
import { PortfolioIndex } from "./portfolio/PortfolioIndex";
import { FestivalManagementDashboard } from "./LearningFestival/FestivalManagementDashboard";
import { AssessmentManagementDashboard } from "@pdi/components/assessments/AssessmentManagementDashboard";
import { MoocResponsesView as MoocResponsesRegistry } from "@pdi/components/mooc/MoocResponsesRegistry";
import { MoocManagementView } from "./admin/MoocManagementView";
import OKRDashboard from "./OKRDashboard";
import SurveyPage from "./SurveyPage";
import { LearningInsightsView } from "./leader/LearningInsightsView";
import { ManagementInsightsView } from "./management/ManagementInsightsView";
import { SecurityFeed } from "@pdi/components/SecurityFeed";

import { CAMPUS_OPTIONS } from "@pdi/lib/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@pdi/components/ui/select";
import api from "@pdi/lib/api";
import { getSocket } from "@pdi/lib/socket";

interface DashboardStats {
    users: { total: number; new: number };
    training: { total: number; thisMonth: number };
    forms: { active: number; total: number };
    courses: { total: number; new: number };
    goals?: { total: number; new: number };
}

const AdminOverview = ({ userName }: { userName: string }) => {
    const navigate = useNavigate();
    const [selectedCampus, setSelectedCampus] = useState("all");
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const fetchStats = async () => {
        try {
            const res = await api.get('/stats/admin');
            if (res.data.status === 'success') {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();

        const socket = getSocket();
        const handleSync = () => fetchStats();

        const events = [
            'user:changed', 'training:created', 'training:updated',
            'course:created', 'course:updated', 'pd:awarded'
        ];

        events.forEach(ev => socket.on(ev, handleSync));

        return () => {
            events.forEach(ev => socket.off(ev, handleSync));
        };
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header with Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
                    <p className="text-muted-foreground text-sm">Real-time performance metrics across the network</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Filter by School:</span>
                    <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="w-[200px] h-10 rounded-xl border-slate-200 bg-white">
                            <SelectValue placeholder="All Schools" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Schools</SelectItem>
                            {CAMPUS_OPTIONS.map(campus => (
                                <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 mb-8 shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold tracking-[0.2em] text-foreground/80 uppercase">Platform Admin</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-500/30">
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                <span className="text-[9px] font-black text-violet-400 tracking-widest uppercase">Live Sync</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Welcome, <span className="text-primary">{userName}</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                            {selectedCampus === "all" 
                                ? "Oversee the Teacher Development ecosystem, manage workflows, and configure system-wide parameters from your central command center."
                                : `Reviewing academic performance and teacher development metrics for ${selectedCampus}.`}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => navigate("superadmin")}
                            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                        >
                            <Gear className="w-5 h-5 mr-2" />
                            System Config
                        </Button>
                        <Button
                            onClick={() => navigate("users")}
                            variant="outline"
                            className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-foreground hover:bg-white/10 backdrop-blur-md font-bold transition-all"
                        >
                            <UsersThree className="w-5 h-5 mr-2" />
                            User Directory
                        </Button>
                    </div>
                </div>
            </div>

            {/* Core Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Platform Users"
                    value={stats?.users.total.toLocaleString() || "2,450"}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="PD Programs"
                    value={stats?.courses.total.toLocaleString() || "42"}
                    icon={GraduationCap}
                    trend={{ value: 5, isPositive: true }}
                />
                <StatCard
                    title="System Health"
                    value="Optimal"
                    icon={Pulse}
                    subtitle="All services live"
                />
                <StatCard
                    title="Global Goals"
                    value="890"
                    icon={Target}
                    trend={{ value: 76, isPositive: true }}
                    onClick={() => navigate("goals")}
                />
            </div>

            {/* Workflow Management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-xl bg-white/50 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-2xl font-bold">Platform Management</CardTitle>
                            <p className="text-muted-foreground text-sm">Quick access to essential admin modules</p>
                        </div>
                        <Layout className="w-6 h-6 text-primary opacity-50" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <ModuleActionCard
                            title="Growth Analytics"
                            description="Monitor system-wide teacher growth trends and metrics."
                            icon={ChartLineUp}
                            onClick={() => navigate("growth-analytics")}
                            color="indigo"
                        />
                        <ModuleActionCard
                            title="Form Templates"
                            description="Design and manage evaluation and observation forms."
                            icon={FileText}
                            onClick={() => navigate("forms")}
                            color="rose"
                        />
                        <ModuleActionCard
                            title="Course Management"
                            description="Maintain the course catalogue and manage enrollments."
                            icon={GraduationCap}
                            onClick={() => navigate("courses")}
                            color="cyan"
                        />
                        <ModuleActionCard
                            title="Learning Festival"
                            description="Oversee festival applications and strand selections."
                            icon={BookOpen}
                            onClick={() => navigate("festival")}
                            color="indigo"
                        />
                        <ModuleActionCard
                            title="MOOC Evidence"
                            description="Review and approve teacher MOOC certifications."
                            icon={ShieldCheck}
                            onClick={() => navigate("mooc")}
                            color="emerald"
                        />
                        <ModuleActionCard
                            title="Goals Management"
                            description="Oversee goal setting, reflections, and metrics per campus."
                            icon={Target}
                            onClick={() => navigate("goals")}
                            color="amber"
                        />
                        <ModuleActionCard
                            title="Platform Reports"
                            description="Generate comprehensive system-wide performance reports."
                            icon={ChartBar}
                            onClick={() => navigate("reports")}
                            color="violet"
                        />
                    </CardContent>
                </Card>

                <div className="rounded-[2rem] overflow-hidden shadow-xl bg-background">
                    <SecurityFeed />
                </div>
            </div>
        </div>
    );
};

const ModuleActionCard = ({ title, description, icon: Icon, onClick, color }: any) => {
    const colorMap: any = {
        indigo: "bg-indigo-500/10 text-indigo-600",
        rose: "bg-rose-500/10 text-rose-600",
        amber: "bg-amber-500/10 text-amber-600",
        slate: "bg-slate-500/10 text-slate-600",
        emerald: "bg-violet-500/10 text-violet-600",
        cyan: "bg-cyan-500/10 text-cyan-600",
        violet: "bg-violet-500/10 text-violet-600",
    };

    return (
        <div
            onClick={onClick}
            className="group p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
        >
            <div className={`w-12 h-12 rounded-2xl ${colorMap[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
};

function PlaceholderView({ title, icon: Icon }: { title: string; icon: any }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded-[2rem] min-h-[50vh] border border-dashed border-muted-foreground/20 animate-in fade-in zoom-in duration-500">
            <div className="p-6 rounded-full bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">{title}</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                This administrative module is currently under development.
                It will provide advanced management tools and configuration options in the next update.
            </p>
            <Button variant="outline" className="rounded-2xl" onClick={() => navigate(-1)}>
                Go Back
            </Button>
        </div>
    );
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const userName = user?.fullName || "";
    const role = (user?.role || "ADMIN") as any;

    if (!user) return null;

    return (
        <DashboardLayout role={role.toLowerCase() as any} userName={userName}>
            <Routes>
                <Route index element={
                    <CustomDashboardWrapper role={role}>
                        <AdminOverview userName={userName} />
                    </CustomDashboardWrapper>
                } />
                <Route path="growth-analytics" element={<AdminGrowthAnalyticsPage />} />
                <Route path="goals" element={<AdminGoalsView />} />
                <Route path="users" element={<UserManagementView />} />
                <Route path="settings" element={<SystemSettingsView />} />
                <Route path="superadmin" element={<SuperAdminView />} />
                <Route path="forms" element={<FormTemplatesView />} />
                <Route path="courses" element={<CourseManagementView />} />
                <Route path="courses/assessments" element={
                    <>
                        <PageHeader 
                            title="Assessment Management" 
                            subtitle="Design and deploy professional competency checks"
                        />
                        <AssessmentManagementDashboard hideHeader />
                    </>
                } />
                <Route path="festival" element={<FestivalManagementDashboard />} />
                <Route path="mooc" element={<MoocResponsesRegistry backPath="/admin" />} />
                <Route path="calendar" element={<AdminCalendarView />} />
                <Route path="hours" element={<PDHoursAnalyticsView />} />
                <Route path="attendance" element={<AttendanceRegister />} />
                <Route path="meetings" element={<MeetingsDashboard />} />
                <Route path="reports" element={<AdminReportsView />} />
                <Route path="survey" element={<SurveyPage />} />
                <Route path="portfolio" element={<PortfolioIndex />} />
                <Route path="okr" element={<OKRDashboard />} />
                <Route path="pdi-health" element={<LearningInsightsView />} />
                <Route path="campus-performance" element={<AdminReportsView />} />
                <Route path="pd-impact" element={<PDHoursAnalyticsView />} />
                <Route path="insights" element={<LearningInsightsView />} />
            </Routes>
        </DashboardLayout>
    );
}
