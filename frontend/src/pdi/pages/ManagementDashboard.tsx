import { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import api from "@pdi/lib/api";
import { useAuth } from "@pdi/hooks/useAuth";
import { useAccessControl } from "@pdi/hooks/useAccessControl";
import { DashboardLayout } from "@pdi/components/layout/DashboardLayout";
import { CustomDashboardWrapper } from "@pdi/components/CustomDashboardWrapper";
import { getSocket } from "@pdi/lib/socket";
import { toast } from "sonner";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { StatCard } from "@pdi/components/StatCard";
import {
    Users,
    TrendingUp,
    Target,
    Book,
    ShieldCheck,
    Zap,
    BarChart2,
    Building2,
    Calendar,
} from "lucide-react";
import { Badge } from "@pdi/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { CAMPUS_OPTIONS } from "@pdi/lib/constants";
import { Button } from "@pdi/components/ui/button";

// Import Management Specific Views
import { ManagementGoalsView } from "./management/ManagementGoalsView";
import ManagementGrowthAnalyticsPage from "./management/ManagementGrowthAnalyticsPage";
import { ManagementInsightsView } from "./management/ManagementInsightsView";
import { MeetingsDashboard } from "./MeetingsDashboard";
import { MoocResponsesView as MoocResponsesRegistry } from "@pdi/components/mooc/MoocResponsesRegistry";
import { AssessmentManagementDashboard } from "@pdi/components/assessments/AssessmentManagementDashboard";
import { PDHoursAnalyticsView } from "./admin/PDHoursAnalyticsView";
import SurveyPage from "./SurveyPage";
import { PortfolioIndex } from "./portfolio/PortfolioIndex";
import OKRDashboard from "./OKRDashboard";
import { analyticsService } from "@pdi/services/analyticsService";
import { Loader2 } from "lucide-react";

const DashboardOverview = ({ stats, userName }: { stats: any, userName: string }) => {
    const navigate = useNavigate();
    const [selectedCampus, setSelectedCampus] = useState<string>("all");

    // Initialize data for all campuses ensuring 0s are shown if missing
    const campusData = useMemo(() => {
        const campusMap: Record<string, any> = {};
        
        CAMPUS_OPTIONS.forEach(c => {
            campusMap[c] = {
                campus: c,
                postOrientation: 0,
                instructionalTools: 0,
                pdFeedback: 0,
                obsCompletion: 0,
                surveySupport: 0
            };
        });

        // Map extended KPIs (if any data is coming from the backend properly)
        if (stats?.extendedKpis?.campusMetrics) {
            stats.extendedKpis.campusMetrics.forEach((m: any) => {
               if (campusMap[m.campus]) {
                   campusMap[m.campus] = { ...campusMap[m.campus], ...m };
               }
            });
        }

        return Object.values(campusMap);
    }, [stats]);

    const filteredCampusData = useMemo(() => {
        if (selectedCampus === 'all') return campusData;
        return campusData.filter(d => d.campus === selectedCampus);
    }, [selectedCampus, campusData]);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-10 md:p-14 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-primary/5">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/[0.03] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-primary/[0.02] rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Management Command Console</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-600 tracking-widest uppercase">Live Intelligence</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight">
                            Hi, <span className="text-primary">{userName.split(' ')[0]}</span>
                        </h1>
                        <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
                            A strategic overview of Teacher Development progress and instructional excellence across the strategic network.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="h-16 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 group" onClick={() => navigate('growth-analytics')}>
                            <TrendingUp className="w-5 h-5 mr-3 group-hover:translate-y-[-2px] transition-transform" />
                            Executive Analytics
                        </Button>
                        <Button variant="outline" className="h-16 px-10 rounded-[1.5rem] border-primary/10 bg-white text-primary font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary/5 transition-all shadow-xl shadow-primary/5 active:scale-95" onClick={() => navigate('pdi-health')}>
                            <BarChart2 className="w-5 h-5 mr-3" />
                            Network Health
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Executive Campus KPIs</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Real-time performance metrics across the institutional network</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-primary/5">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Selected Hub</span>
                    <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="w-[220px] h-12 rounded-xl border-none bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest">
                            <SelectValue placeholder="All Campuses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/10 shadow-2xl p-2">
                            <SelectItem value="all" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary py-3">All Campuses</SelectItem>
                            {CAMPUS_OPTIONS.map(c => (
                                <SelectItem key={c} value={c} className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary py-3">{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {filteredCampusData.map((data, idx) => (
                    <Card key={idx} className="rounded-[2.5rem] border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden group hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] transition-all duration-700">
                        <CardHeader className="p-10 border-b border-primary/5 bg-primary/[0.01]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                                        <Building2 className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black uppercase tracking-tight text-foreground">{data.campus}</CardTitle>
                                        <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Operational Excellence Score</p>
                                    </div>
                                </div>
                                <Badge className="bg-primary/5 text-primary border-primary/10 text-[9px] h-7 px-4 font-black uppercase tracking-widest rounded-lg">
                                    {data.campus} Performance Index
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* Metric 1 */}
                                <div className="p-6 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:border-primary/20 hover:bg-primary/[0.01] transition-all group/metric">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                                            <Book className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Orientation</span>
                                    </div>
                                    <div className="text-4xl font-black text-foreground tracking-tighter group-hover/metric:text-primary transition-colors">{data.postOrientation}%</div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Avg Assessment</p>
                                </div>
                                
                                {/* Metric 2 */}
                                <div className="p-6 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:border-primary/20 hover:bg-primary/[0.01] transition-all group/metric">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                                            <Target className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Instructional</span>
                                    </div>
                                    <div className="text-4xl font-black text-foreground tracking-tighter group-hover/metric:text-primary transition-colors">{data.instructionalTools}%</div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Implementation</p>
                                </div>

                                {/* Metric 3 */}
                                <div className="p-6 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:border-primary/20 hover:bg-primary/[0.01] transition-all group/metric">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">PD Feedback</span>
                                    </div>
                                    <div className="text-4xl font-black text-foreground tracking-tighter group-hover/metric:text-primary transition-colors">{data.pdFeedback}/5</div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Avg Rating</p>
                                </div>

                                {/* Metric 4 */}
                                <div className="p-6 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:border-primary/20 hover:bg-primary/[0.01] transition-all group/metric">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                                            <BarChart2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Observations</span>
                                    </div>
                                    <div className="text-4xl font-black text-foreground tracking-tighter group-hover/metric:text-primary transition-colors">{data.obsCompletion}%</div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Completion Rate</p>
                                </div>

                                {/* Metric 5 */}
                                <div className="p-6 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:border-primary/20 hover:bg-primary/[0.01] transition-all group/metric">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Leadership</span>
                                    </div>
                                    <div className="text-4xl font-black text-foreground tracking-tighter group-hover/metric:text-primary transition-colors">{data.surveySupport}/5</div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Support Score</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};


function PlaceholderView({ title, icon: Icon }: { title: string; icon: any }) {
    const navigate = useNavigate();
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 animate-in fade-in zoom-in duration-500">
            <div className="p-6 rounded-3xl bg-primary/10 mb-8 group-hover:rotate-12 transition-transform">
                <Icon className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">{title}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                This strategic management module is currently being finalized.
                It will provide deep insights and powerful cross-campus analytics once live.
            </p>
            <Button size="lg" className="rounded-2xl px-8 h-14 font-bold shadow-xl shadow-primary/20" onClick={() => navigate(-1)}>
                Go Back
            </Button>
        </div>
    );
}

export default function ManagementDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await analyticsService.getManagementOverview();
            if (response.status === 'success') {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching management stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // Socket.IO sync
        const socket = getSocket();
        const handleSync = () => {
            console.log("[SOCKET] Syncing management dashboard...");
            fetchStats();
        };

        const events = [
            'user:changed', 'observation:created', 'observation:updated',
            'goal:created', 'goal:updated', 'training:created', 'training:updated',
            'mooc:updated', 'pd:awarded'
        ];

        events.forEach(ev => socket.on(ev, handleSync));

        return () => {
            events.forEach(ev => socket.off(ev, handleSync));
        };
    }, []);

    if (!user) return null;

    const userName = user.fullName || "";
    const role = (user.role || "MANAGEMENT") as any;

    if (loading) {
        return (
            <DashboardLayout role={role.toLowerCase() as any} userName={userName}>
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role={role.toLowerCase() as any} userName={userName}>
            <Routes>
                <Route index element={
                    <CustomDashboardWrapper role={role}>
                        <DashboardOverview stats={stats || {}} userName={userName} />
                    </CustomDashboardWrapper>
                } />
                <Route path="overview" element={
                    <CustomDashboardWrapper role={role}>
                        <DashboardOverview stats={stats || {}} userName={userName} />
                    </CustomDashboardWrapper>
                } />
                <Route path="growth-analytics" element={<ManagementGrowthAnalyticsPage />} />
                <Route path="goals" element={<ManagementGoalsView />} />
                <Route path="pdi-health" element={<ManagementInsightsView />} />
                <Route path="campus-performance" element={<ManagementInsightsView />} />
                <Route path="pd-impact" element={<ManagementInsightsView />} />
                <Route path="training-analytics" element={<ManagementInsightsView />} />
                <Route path="hours" element={<PDHoursAnalyticsView />} />
                
                <Route path="courses/assessments" element={<AssessmentManagementDashboard />} />
                <Route path="mooc" element={<MoocResponsesRegistry backPath="/management" />} />
                
                <Route path="meetings" element={<MeetingsDashboard />} />
                <Route path="survey" element={<SurveyPage />} />
                <Route path="portfolio" element={<PortfolioIndex />} />
                <Route path="okr" element={<OKRDashboard />} />
            </Routes>
        </DashboardLayout>
    );
}
