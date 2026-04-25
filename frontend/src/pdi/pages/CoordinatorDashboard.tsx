import { useState, useEffect, useMemo } from "react";
import { format, parse, isBefore, endOfDay } from "date-fns";
import api from "@pdi/lib/api";
import { useAuth } from "@pdi/hooks/useAuth";
import { useAccessControl } from "@pdi/hooks/useAccessControl";
import { DashboardLayout } from "@pdi/components/layout/DashboardLayout";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { StatCard } from "@pdi/components/StatCard";
import {
  Users,
  Eye,
  TrendingUp,
  Target,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Input } from "@pdi/components/ui/input";
import { Badge } from "@pdi/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@pdi/components/ui/table";
import { Progress } from "@pdi/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pdi/components/ui/select";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { CAMPUS_OPTIONS } from "@pdi/lib/constants";
import { QuickActionButtons } from "@pdi/components/QuickActionButtons";
import { Observation } from "@pdi/types/observation";
import { useNavigate, Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import { CustomDashboardWrapper } from "@pdi/components/CustomDashboardWrapper";
import { AssessmentManagementDashboard } from "@pdi/components/assessments/AssessmentManagementDashboard";
import { CourseManagementView } from "./admin/CourseManagementView";

const COLORS = ['#ef4444', '#f59e0b', '#10b981']; // Pending, Submitted, Reviewed

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isModuleEnabled } = useAccessControl();

  const [selectedCampus, setSelectedCampus] = useState<string>(user?.campusId || "all");
  const [observations, setObservations] = useState<Observation[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const availableCampuses = useMemo(() => {
    if (user?.multi_campus) {
      return CAMPUS_OPTIONS;
    }
    const caps: string[] = [];
    if (user?.campusId) caps.push(user.campusId);
    if (user?.campusAccess) {
      caps.push(...user.campusAccess.split(',').filter(Boolean));
    }
    return Array.from(new Set(caps.filter(Boolean)));
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCampus]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const params = selectedCampus !== 'all' ? { campusId: selectedCampus } : {};
      
      const [obsRes, teacherRes, statsRes] = await Promise.all([
        api.get(`/growth/observations`, { params }),
        api.get(`/users/teachers`, { params }),
        api.get(`/stats/coordinator`, { params })
      ]);

      if (obsRes.data.status === 'success') {
        setObservations(obsRes.data.data.observations.slice(0, 10));
      }
      
      if (teacherRes.data.status === 'success') {
        setTeachers(teacherRes.data.data.teachers);
      }

      if (statsRes.data.status === 'success') {
        setStats(statsRes.data.data);
      }

    } catch (error) {
      console.error("Dashboard fetching failed:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout role="coordinator" userName={user.fullName}>
      <Routes>
        <Route index element={
            <div className="space-y-8 animate-in fade-in duration-700 pb-12">
              {/* Header Section */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-10 md:p-14 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-primary/5">
                 <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/[0.03] rounded-full blur-[100px]" />
                 <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-primary/[0.02] rounded-full blur-[80px]" />

                 <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                   <div className="space-y-6">
                     <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
                       <ShieldCheck className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Coordinator Command Center</span>
                       <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Session</span>
                       </div>
                     </div>
                     <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight">
                       Welcome, <span className="text-primary">{user.fullName.split(' ')[0]}</span>
                     </h1>
                     <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
                       Orchestrating professional growth and instructional excellence for <span className="text-primary font-black uppercase tracking-widest">{selectedCampus === 'all' ? "Strategic Campus Group" : selectedCampus}</span>.
                     </p>
                   </div>

                   <div className="flex flex-col sm:flex-row items-center gap-4">
                     {user.multi_campus && availableCampuses.length > 1 && (
                       <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                         <SelectTrigger className="w-[220px] h-16 rounded-2xl border-primary/10 bg-white text-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/5">
                           <SelectValue placeholder="Select Campus" />
                         </SelectTrigger>
                         <SelectContent className="rounded-2xl bg-white border-primary/10 p-2 shadow-2xl">
                           <SelectItem value="all" className="rounded-xl font-black text-xs uppercase tracking-widest focus:bg-primary/5 focus:text-primary py-3">All Campuses</SelectItem>
                           {availableCampuses.map(c => <SelectItem key={c} value={c} className="rounded-xl font-black text-xs uppercase tracking-widest focus:bg-primary/5 focus:text-primary py-3">{c}</SelectItem>)}
                         </SelectContent>
                       </Select>
                     )}
                     <QuickActionButtons role="coordinator" />
                   </div>
                 </div>
              </div>

              {/* Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* WIDGET 1: OBSERVATION SUMMARY */}
                 <Card className="rounded-[2.5rem] border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/[0.01]">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                                <Eye className="w-7 h-7 text-primary" />
                             </div>
                             <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tight">Observation Intel</CardTitle>
                                <CardDescription className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Real-time instructional mapping</CardDescription>
                             </div>
                          </div>
                           <Button variant="ghost" size="sm" className="h-10 rounded-xl text-primary font-black text-[10px] uppercase tracking-widest group/btn hover:bg-primary/5 px-4" onClick={() => navigate('/leader/growth/observations')}>
                              Global View <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                           </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="p-10 space-y-10">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <Button variant="outline" className="h-28 rounded-2xl flex flex-col gap-3 hover:bg-primary/5 border-primary/10 bg-white transition-all group/action active:scale-95 shadow-sm" onClick={() => navigate('/leader/growth/observations/new')}>
                                 <Plus className="w-6 h-6 text-primary group-hover/action:rotate-90 transition-transform" />
                                 <span className="text-[9px] font-black uppercase tracking-[0.15em]">New Observation</span>
                              </Button>
                             <Button variant="outline" className="h-28 rounded-2xl flex flex-col gap-3 hover:bg-primary/5 border-primary/10 bg-white transition-all group/action active:scale-95 shadow-sm" onClick={() => navigate('/leader/calendar')}>
                                <Calendar className="w-6 h-6 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Schedule Trail</span>
                             </Button>
                             <Button variant="outline" className="h-28 rounded-2xl flex flex-col gap-3 hover:bg-primary/5 border-primary/10 bg-white transition-all group/action active:scale-95 shadow-sm" onClick={() => navigate('/leader/quick-feedback/new')}>
                                <Zap className="w-6 h-6 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Fast Response</span>
                             </Button>
                              <Button variant="outline" className="h-28 rounded-2xl flex flex-col gap-3 hover:bg-primary/5 border-primary/10 bg-white transition-all group/action active:scale-95 shadow-sm" onClick={() => navigate('/leader/growth/observations/audit')}>
                                 <ClipboardList className="w-6 h-6 text-primary" />
                                 <span className="text-[9px] font-black uppercase tracking-[0.15em]">Audit Log</span>
                              </Button>
                          </div>

                          <div className="space-y-6">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 border-l-2 border-primary/30 pl-4">Live Activity Stream</h4>
                             <div className="space-y-4">
                                {observations.slice(0, 5).map((obs: any) => (
                                  <div key={obs.id} className="flex items-center justify-between p-6 rounded-3xl bg-primary/[0.01] border border-primary/5 hover:bg-primary/[0.02] hover:border-primary/10 transition-all group/item cursor-pointer">
                                     <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-primary border border-primary/5 shadow-sm group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                                           {obs.teacher?.charAt(0) || 'T'}
                                        </div>
                                        <div>
                                           <p className="text-sm font-black text-foreground group-hover/item:text-primary transition-colors">{obs.teacher || 'Unknown'}</p>
                                           <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">{obs.domain || 'Core Observation'}</p>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{obs.date}</p>
                                        <Badge className="bg-primary/5 text-primary border-primary/10 text-[8px] h-5 px-2 mt-2 font-black uppercase tracking-widest">
                                           {obs.status}
                                        </Badge>
                                     </div>
                                  </div>
                                ))}
                                {observations.length === 0 && (
                                  <div className="text-center py-16 bg-primary/[0.01] rounded-[2rem] border border-dashed border-primary/10">
                                     <AlertCircle className="w-10 h-10 text-primary/20 mx-auto mb-4" />
                                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Synchronizing observation data...</p>
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 {/* WIDGET 2: CAMPUS TRAINING TRACKER */}
                 <Card className="rounded-[2.5rem] border-none shadow-[0_30px_60px_rgba(234,16,74,0.15)] bg-primary text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.05] rounded-full blur-[100px] -translate-y-20 translate-x-20" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/[0.05] rounded-full blur-[80px] translate-y-20 -translate-x-20" />
                    
                    <CardHeader className="p-10 pb-6 relative z-10">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                             <Clock className="w-7 h-7 text-white" />
                          </div>
                          <div>
                             <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">Campus Growth Pulse</CardTitle>
                             <CardDescription className="text-white/60 font-black text-[10px] uppercase tracking-widest mt-1">Professional Development Velocity</CardDescription>
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-12 relative z-10">
                       <div className="flex items-baseline gap-4">
                          <span className="text-8xl font-black tracking-tighter">15</span>
                          <div className="space-y-1">
                             <span className="text-2xl font-black block">HOURS AVG.</span>
                             <span className="text-[10px] font-black uppercase tracking-widest opacity-60">TARGET: 25 HRS PER FACULTY</span>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Institutional Completion</span>
                             <span className="text-sm font-black bg-white/20 px-3 py-1 rounded-lg backdrop-blur-md">60% COMPLIANCE</span>
                          </div>
                          <div className="relative h-10 rounded-2xl bg-black/10 overflow-hidden border border-white/10 p-2 shadow-inner">
                             <div className="absolute top-2 left-2 bottom-2 bg-white rounded-xl transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.4)]" style={{ width: '60%' }} />
                          </div>
                          <div className="flex flex-wrap gap-6 pt-6">
                             <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">&gt; 80% OPTIMAL</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">50-80% WARNING</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">&lt; 50% CRITICAL</span>
                             </div>
                          </div>
                       </div>

                       <Button className="w-full h-16 rounded-[1.5rem] bg-white text-primary font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/90 shadow-2xl transition-all active:scale-95 group" onClick={() => navigate('/analytics/attendance')}>
                          Global Performance Insights <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                       </Button>
                    </CardContent>
                 </Card>

                 {/* WIDGET 3: ASSESSMENT MONITORING */}
                 <Card className="rounded-[2.5rem] border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden lg:col-span-2 group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/[0.01]">
                       <div className="flex items-center justify-between flex-wrap gap-6">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                                <ClipboardList className="w-7 h-7 text-primary" />
                             </div>
                             <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tight">Competency Monitoring</CardTitle>
                                <CardDescription className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Faculty assessment velocity</CardDescription>
                             </div>
                          </div>
                          <div className="flex gap-3">
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[180px] h-12 rounded-xl border-primary/10 bg-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                                <SelectValue placeholder="Department" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-primary/10 p-2">
                                <SelectItem value="all" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5">All Departments</SelectItem>
                                <SelectItem value="academic" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5">Academic</SelectItem>
                                <SelectItem value="cca" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5">CCA</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button className="h-12 border-none bg-primary text-white font-black text-[10px] uppercase tracking-widest px-8 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95" onClick={() => navigate('/leader/courses/assessments')}>
                              Assessment Studio
                            </Button>
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-0">
                       <Table>
                          <TableHeader>
                             <TableRow className="bg-primary/[0.01] hover:bg-primary/[0.01] border-b border-primary/5">
                                <TableHead className="px-10 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Educator Registry</TableHead>
                                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Department</TableHead>
                                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Orientation Status</TableHead>
                                <TableHead className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Academic Status</TableHead>
                                <TableHead className="px-10 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground text-right">Completion Index</TableHead>
                             </TableRow>
                          </TableHeader>
                          <TableBody className="divide-y divide-primary/5">
                             {teachers.slice(0, 5).map((teacher: any) => (
                               <TableRow key={teacher.id} className="hover:bg-primary/[0.01] transition-all group/row cursor-pointer">
                                  <TableCell className="px-10 py-8">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-xs border border-primary/10 shadow-sm group-hover/row:scale-110 transition-transform">
                                           {teacher.fullName.charAt(0)}
                                        </div>
                                        <span className="font-black text-sm text-foreground group-hover/row:text-primary transition-colors">{teacher.fullName}</span>
                                     </div>
                                  </TableCell>
                                  <TableCell className="px-8 py-8">
                                     <Badge className="bg-muted/50 text-muted-foreground border-none text-[8px] font-black uppercase tracking-widest px-3 h-5">
                                        {teacher.department || 'General Faculty'}
                                     </Badge>
                                  </TableCell>
                                  <TableCell className="px-8 py-8">
                                     <div className="flex items-center gap-2.5">
                                        <div className="p-1 rounded-full bg-emerald-50 border border-emerald-100">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Certified</span>
                                     </div>
                                  </TableCell>
                                  <TableCell className="px-8 py-8">
                                     <div className="flex items-center gap-2.5">
                                        <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">In Progress</span>
                                     </div>
                                  </TableCell>
                                  <TableCell className="px-10 py-8 text-right">
                                     <div className="flex flex-col items-end gap-1.5">
                                        <span className="font-black text-lg text-foreground tracking-tighter">85%</span>
                                        <div className="w-24 h-1.5 bg-primary/[0.05] rounded-full overflow-hidden">
                                           <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(234,16,74,0.3)]" style={{ width: '85%' }} />
                                        </div>
                                     </div>
                                  </TableCell>
                               </TableRow>
                             ))}
                          </TableBody>
                       </Table>
                    </CardContent>
                 </Card>

                 {/* WIDGET 4: GOAL SETTING STATUS */}
                 <Card className="rounded-[2.5rem] border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden lg:col-span-1 group">
                    <CardHeader className="p-10 border-b border-primary/5 bg-primary/[0.01]">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                             <Target className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                             <CardTitle className="text-2xl font-black uppercase tracking-tight">Strategic Goals</CardTitle>
                             <CardDescription className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Institutional objective mapping</CardDescription>
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-10">
                       <div className="h-[280px] w-full relative">
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Pending', value: stats?.goals?.pending || 0 },
                                    { name: 'Submitted', value: stats?.goals?.submitted || 0 },
                                    { name: 'Reviewed', value: stats?.goals?.reviewed || 0 }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={75}
                                  outerRadius={95}
                                  paddingAngle={8}
                                  dataKey="value"
                                  stroke="none"
                                >
                                  {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip 
                                  contentStyle={{ 
                                    borderRadius: '16px', 
                                    border: '1px solid #primary/10', 
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    fontSize: '10px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase'
                                  }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                             </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 text-center">
                              <p className="text-5xl font-black text-foreground tracking-tighter">{stats?.teachers?.total || 0}</p>
                              <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mt-1">Registry Size</p>
                          </div>
                       </div>
                       <div className="mt-10 pt-10 border-t border-primary/5">
                          <Button className="w-full bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] h-16 rounded-[1.5rem] hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all active:scale-95" onClick={() => navigate('/leader/goals')}>
                             Review Strategic Submissions
                          </Button>
                       </div>
                    </CardContent>
                 </Card>

                 {/* SUMMARY STATS (Optional extra) */}
                 <div className="grid grid-cols-2 gap-4">
                    <Card className="rounded-[2.5rem] border-primary/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] bg-white p-8 flex flex-col justify-between hover:scale-105 transition-all cursor-default border border-primary/5 group">
                       <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">Faculty Registry</span>
                       <span className="text-4xl font-black text-foreground mt-4 group-hover:text-primary transition-colors">{stats?.teachers?.total || 0}</span>
                    </Card>
                    <Card className="rounded-[2.5rem] border-primary/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] bg-white p-8 flex flex-col justify-between hover:scale-105 transition-all cursor-default border border-primary/5 group">
                       <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">Monthly Insights</span>
                       <span className="text-4xl font-black text-foreground mt-4 group-hover:text-primary transition-colors">{stats?.observations?.thisMonth || 0}</span>
                    </Card>
                    <Card className="rounded-[2.5rem] border-primary/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] bg-white p-8 flex flex-col justify-between hover:scale-105 transition-all cursor-default border border-primary/5 group">
                       <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] uppercase">PDI Events</span>
                       <span className="text-4xl font-black text-foreground mt-4 group-hover:text-primary transition-colors">{stats?.training?.totalEvents || 0}</span>
                    </Card>
                    <Card className="rounded-[2.5rem] border-primary/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] bg-white p-8 flex flex-col justify-between hover:scale-105 transition-all cursor-default border border-primary/5 group">
                       <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">Growth Index</span>
                       <span className="text-4xl font-black text-foreground mt-4 group-hover:text-primary transition-colors">{stats?.pdiPoints || 0}</span>
                    </Card>
              </div>
            </div>
          </div>
         } />
         <Route path="courses/*" element={<CoordinatorCoursesModule />} />
       </Routes>
    </DashboardLayout>
  );
}

function CoordinatorCoursesModule() {
  const { user } = useAuth();
  const role = user?.role || 'COORDINATOR';
  
  return (
    <div className="space-y-6">
      <Routes>
        <Route index element={
          <>
            <PageHeader
               title="Coordinator: Course Catalogue"
               subtitle="Review school curriculum and programs"
            />
            <CourseManagementView hideHeader />
          </>
        } />
        <Route path="assessments" element={
          <>
            <PageHeader
               title="Assessment Management"
               subtitle="Manage teacher evaluations and professional competency checks"
            />
            <AssessmentManagementDashboard hideHeader />
          </>
        } />
      </Routes>
    </div>
  );
}
