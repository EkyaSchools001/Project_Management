import { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useAccessControl } from "@/hooks/useAccessControl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomDashboardWrapper } from "@/components/CustomDashboardWrapper";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAMPUS_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

// Import Management Specific Views
import { ManagementGoalsView } from "./management/ManagementGoalsView";
import ManagementGrowthAnalyticsPage from "./management/ManagementGrowthAnalyticsPage";
import { ManagementInsightsView } from "./management/ManagementInsightsView";
import { MeetingsDashboard } from "./MeetingsDashboard";
import MoocAdminPage from "./admin/MoocAdminPage";
import { AssessmentManagementDashboard } from "@/components/assessments/AssessmentManagementDashboard";
import { PDHoursAnalyticsView } from "./admin/PDHoursAnalyticsView";
import SurveyPage from "./SurveyPage";
import { PortfolioIndex } from "./portfolio/PortfolioIndex";
import OKRDashboard from "./OKRDashboard";
import { analyticsService } from "@/services/analyticsService";
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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 mb-8 shadow-2xl">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">Management Console</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase">Live Sync</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">{userName.split(' ')[0]}</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                            A strategic overview of Teacher Development progress across the organization.
                        </p>
                    </div>
                    <div className="flex gap-4">
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Executive Campus KPIs</h2>
                    <p className="text-zinc-900 text-sm font-medium">Real-time performance metrics across the network</p>
                </div>
                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                    <SelectTrigger className="w-[200px] bg-white border-slate-200 shadow-sm h-11 rounded-xl">
                        <SelectValue placeholder="All Campuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Campuses</SelectItem>
                        {CAMPUS_OPTIONS.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 gap-8 pb-12">
                {filteredCampusData.map((data, idx) => (
                    <Card key={idx} className="shadow-2xl overflow-hidden rounded-[2.5rem] bg-white border-transparent hover:shadow-primary/10 transition-shadow duration-500">
                        <CardHeader className="bg-slate-50/50 border-b pb-6 px-8">
                            <CardTitle className="text-2xl flex items-center justify-between text-slate-800">
                                <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">{data.campus}</span>
                                <Badge className="bg-white border text-primary shadow-sm hover:bg-white">{data.campus} Performance</Badge>
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                View Details <TrendingUp className="w-4 h-4 ml-2" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* Metric 1 */}
                                <div className="space-y-2 p-4 rounded-3xl bg-amber-50/50 border border-amber-100/50 hover:bg-amber-100/50 transition-colors">
                                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5"><Book className="w-3 h-3" /> Post-Orientation</div>
                                    <div className="text-3xl font-black text-amber-950">{data.postOrientation}%</div>
                                    <div className="text-xs text-amber-950 font-bold">Avg Assessment Score</div>
                                </div>

                                {/* Metric 2 */}
                                <div className="space-y-2 p-4 rounded-3xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-100/50 transition-colors">
                                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1.5"><Target className="w-3 h-3" /> Instr. Tools</div>
                                    <div className="text-3xl font-black text-blue-950">{data.instructionalTools}%</div>
                                    <div className="text-xs text-blue-950 font-bold">Avg Implementation Score</div>
                                </div>

                                {/* Metric 3 */}
                                <div className="space-y-2 p-4 rounded-3xl bg-purple-50/50 border border-purple-100/50 hover:bg-purple-100/50 transition-colors">
                                    <div className="text-[10px] font-bold text-purple-700 uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3 h-3" /> PD Feedback</div>
                                    <div className="text-3xl font-black text-purple-950">{data.pdFeedback}/5</div>
                                    <div className="text-xs text-purple-950 font-bold">Avg Training Rating</div>
                                </div>

                                {/* Metric 4 */}
                                <div className="space-y-2 p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 hover:bg-emerald-100/50 transition-colors">
                                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5"><BarChart2 className="w-3 h-3" /> Observations</div>
                                    <div className="text-3xl font-black text-emerald-950">{data.obsCompletion}%</div>
                                    <div className="text-xs text-emerald-950 font-bold">Completion Rate</div>
                                </div>

                                {/* Metric 5 */}
                                <div className="space-y-2 p-4 rounded-3xl bg-rose-50/50 border border-rose-100/50 hover:bg-rose-100/50 transition-colors">
                                    <div className="text-[10px] font-bold text-rose-700 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-3 h-3" /> Leadership</div>
                                    <div className="text-3xl font-black text-rose-950">{data.surveySupport}/5</div>
                                    <div className="text-xs text-rose-950 font-bold">PD Survey Support Score</div>
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
                <Route path="mooc" element={<MoocAdminPage />} />

                <Route path="meetings" element={<MeetingsDashboard />} />
                <Route path="survey" element={<SurveyPage />} />
                <Route path="portfolio" element={<PortfolioIndex />} />
                <Route path="okr" element={<OKRDashboard />} />
            </Routes>
        </DashboardLayout>
    );
}
