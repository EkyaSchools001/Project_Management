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
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Header with Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 px-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">System Command Center</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Real-time performance metrics across the institutional network</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-primary/5">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Filter by School</span>
                    <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="w-[220px] h-12 rounded-xl border-none bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest">
                            <SelectValue placeholder="All Schools" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/10 shadow-2xl p-2">
                            <SelectItem value="all" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary py-3">All Strategic Hubs</SelectItem>
                            {CAMPUS_OPTIONS.map(campus => (
                                <SelectItem key={campus} value={campus} className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary py-3">{campus}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-10 md:p-14 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-primary/5">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/[0.03] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-primary/[0.02] rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Platform Administrator</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-600 tracking-widest uppercase">Systems Active</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight">
                            Welcome, <span className="text-primary">{userName}</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-xl font-medium leading-relaxed">
                            {selectedCampus === "all" 
                                ? "Oversee the Teacher Development ecosystem, manage enterprise workflows, and configure system-wide parameters from your central command center."
                                : `Reviewing academic performance and teacher development metrics for ${selectedCampus}.`}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button
                            onClick={() => navigate("superadmin")}
                            className="h-16 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 group"
                        >
                            <Gear className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                            System Config
                        </Button>
                        <Button
                            onClick={() => navigate("users")}
                            variant="outline"
                            className="h-16 px-10 rounded-[1.5rem] border-primary/10 bg-white text-primary font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary/5 transition-all shadow-xl shadow-primary/5 active:scale-95"
                        >
                            <UsersThree className="w-5 h-5 mr-3" />
                            User Directory
                        </Button>
                    </div>
                </div>
            </div>

            {/* Core Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Platform Users"
                    value={stats?.users.total.toLocaleString() || "2,450"}
                    icon={Users}
                    color="bg-primary"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="PD Programs"
                    value={stats?.courses.total.toLocaleString() || "42"}
                    icon={GraduationCap}
                    color="bg-primary"
                    trend={{ value: 5, isPositive: true }}
                />
                <StatCard
                    title="System Health"
                    value="Optimal"
                    icon={Pulse}
                    color="bg-primary"
                    subtitle="All services live"
                />
                <StatCard
                    title="Global Goals"
                    value="890"
                    icon={Target}
                    color="bg-primary"
                    trend={{ value: 76, isPositive: true }}
                    onClick={() => navigate("goals")}
                />
            </div>

            {/* Workflow Management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 rounded-[2.5rem] border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/[0.01]">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tight">Platform Management</CardTitle>
                                <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest mt-1">Quick access to essential admin modules</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10">
                                <Layout className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-10">
                        <ModuleActionCard
                            title="Growth Analytics"
                            description="Monitor system-wide teacher growth trends and metrics."
                            icon={ChartLineUp}
                            onClick={() => navigate("growth-analytics")}
                        />
                        <ModuleActionCard
                            title="Form Templates"
                            description="Design and manage evaluation and observation forms."
                            icon={FileText}
                            onClick={() => navigate("forms")}
                        />
                        <ModuleActionCard
                            title="Course Management"
                            description="Maintain the course catalogue and manage enrollments."
                            icon={GraduationCap}
                            onClick={() => navigate("courses")}
                        />
                        <ModuleActionCard
                            title="Learning Festival"
                            description="Oversee festival applications and strand selections."
                            icon={BookOpen}
                            onClick={() => navigate("festival")}
                        />
                        <ModuleActionCard
                            title="MOOC Evidence"
                            description="Review and approve teacher MOOC certifications."
                            icon={ShieldCheck}
                            onClick={() => navigate("mooc")}
                        />
                        <ModuleActionCard
                            title="Goals Management"
                            description="Oversee goal setting, reflections, and metrics per campus."
                            icon={Target}
                            onClick={() => navigate("goals")}
                        />
                        <ModuleActionCard
                            title="Platform Reports"
                            description="Generate comprehensive system-wide performance reports."
                            icon={ChartBar}
                            onClick={() => navigate("reports")}
                        />
                        <ModuleActionCard
                            title="System Settings"
                            description="Configure security, notifications, and platform variables."
                            icon={Gear}
                            onClick={() => navigate("settings")}
                        />
                    </CardContent>
                </Card>

                <div className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white border border-primary/5">
                    <SecurityFeed />
                </div>
            </div>
        </div>
    );
};

const ModuleActionCard = ({ title, description, icon: Icon, onClick }: any) => {
    return (
        <div
            onClick={onClick}
            className="group p-8 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:border-primary/20 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.02] rounded-full blur-2xl -translate-y-12 translate-x-12 group-hover:bg-primary/[0.05] transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-black text-xl mb-2 group-hover:text-primary transition-colors tracking-tight uppercase">{title}</h3>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">{description}</p>
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
