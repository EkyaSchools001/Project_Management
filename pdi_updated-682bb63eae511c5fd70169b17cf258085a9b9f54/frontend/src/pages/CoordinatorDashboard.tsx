import { useState, useEffect, useMemo } from "react";
import { format, parse, isBefore, endOfDay } from "date-fns";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useAccessControl } from "@/hooks/useAccessControl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { CAMPUS_OPTIONS } from "@/lib/constants";
import { QuickActionButtons } from "@/components/QuickActionButtons";
import { Observation } from "@/types/observation";
import { useNavigate, Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import { CustomDashboardWrapper } from "@/components/CustomDashboardWrapper";
import { AssessmentManagementDashboard } from "@/components/assessments/AssessmentManagementDashboard";
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
    const caps = [];
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
           <div className="space-y-8 animate-in fade-in duration-700">
             {/* Header Section */}
             <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 mb-8 shadow-2xl">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">Coordinator Dashboard</span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live Sync</span>
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                      Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">{user.fullName.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl">
                      Monitoring teacher development and campus activities for <span className="text-white font-bold">{selectedCampus === 'all' ? "All Campus" : selectedCampus}</span>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {user.multi_campus && availableCampuses.length > 1 && (
                      <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="w-[200px] h-14 rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl text-white font-bold">
                          <SelectValue placeholder="Select Campus" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl bg-slate-900 text-white border-white/10">
                          <SelectItem value="all">All Campuses</SelectItem>
                          {availableCampuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                   <CardHeader className="p-8 border-b bg-zinc-50/50">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                               <Eye className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                               <CardTitle className="text-xl font-black">Observation Summary</CardTitle>
                               <CardDescription className="font-bold text-zinc-500">Recent activities and history</CardDescription>
                            </div>
                         </div>
                          <Button variant="ghost" size="sm" className="text-primary font-bold group" onClick={() => navigate('/leader/growth/observations')}>
                             View All <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </Button>
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      <div className="p-8 space-y-6">
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                             <Button variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 hover:bg-zinc-50 border-2" onClick={() => navigate('/leader/growth/observations/new')}>
                                <Plus className="w-5 h-5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Start New</span>
                             </Button>
                            <Button variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 hover:bg-zinc-50 border-2" onClick={() => navigate('/leader/calendar')}>
                               <Calendar className="w-5 h-5 text-indigo-500" />
                               <span className="text-[10px] font-black uppercase tracking-wider">Schedule</span>
                            </Button>
                            <Button variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 hover:bg-zinc-50 border-2" onClick={() => navigate('/leader/quick-feedback/new')}>
                               <Zap className="w-5 h-5 text-amber-500" />
                               <span className="text-[10px] font-black uppercase tracking-wider">Quick Feed</span>
                            </Button>
                             <Button variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 hover:bg-zinc-50 border-2" onClick={() => navigate('/leader/growth/observations/audit')}>
                                <ClipboardList className="w-5 h-5 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Audit</span>
                             </Button>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Recent Activity</h4>
                            <div className="space-y-3">
                               {observations.slice(0, 5).map((obs: any) => (
                                 <div key={obs.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 hover:border-zinc-200 transition-all group">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-primary border shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                          {obs.teacher?.charAt(0) || 'T'}
                                       </div>
                                       <div>
                                          <p className="text-sm font-black">{obs.teacher || 'Unknown'}</p>
                                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{obs.domain || 'Observation'}</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-xs font-bold">{obs.date}</p>
                                       <Badge variant="secondary" className="text-[8px] h-4 font-black uppercase tracking-tighter">
                                          {obs.status}
                                       </Badge>
                                    </div>
                                 </div>
                               ))}
                               {observations.length === 0 && (
                                 <div className="text-center py-8">
                                    <AlertCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-zinc-400">No recent observations</p>
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                {/* WIDGET 2: CAMPUS TRAINING TRACKER */}
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white overflow-hidden">
                   <CardHeader className="p-8 pb-4">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                         </div>
                         <div>
                            <CardTitle className="text-xl font-black">Campus Training Tracker</CardTitle>
                            <CardDescription className="text-white/60 font-bold">PDI Participation Progress</CardDescription>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-8 space-y-8">
                      <div className="flex items-baseline gap-3">
                         <span className="text-6xl font-black">15</span>
                         <span className="text-xl font-medium opacity-60">/ 25 hrs avg per teacher</span>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="flex justify-between items-end">
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Campus Training Completion</span>
                            <span className="text-sm font-black">60% On Track</span>
                         </div>
                         <div className="relative h-6 rounded-full bg-black/20 overflow-hidden border border-white/10 p-1">
                            <div className="absolute top-1 left-1 bottom-1 bg-gradient-to-r from-yellow-300 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(250,204,21,0.5)]" style={{ width: '60%' }} />
                         </div>
                         <div className="flex gap-4 pt-4">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-400" />
                               <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">&gt; 80% Green</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-yellow-400" />
                               <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">50-80% Yellow</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-rose-400" />
                               <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">&lt; 50% Red</span>
                            </div>
                         </div>
                      </div>

                      <Button className="w-full h-14 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-white/90 shadow-xl transition-all" onClick={() => navigate('/analytics/attendance')}>
                         View Participation Insights
                      </Button>
                   </CardContent>
                </Card>

                {/* WIDGET 3: ASSESSMENT MONITORING */}
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden lg:col-span-2">
                   <CardHeader className="p-8 border-b">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                               <ClipboardList className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                               <CardTitle className="text-xl font-black">Assessment Monitoring</CardTitle>
                               <CardDescription className="font-bold text-zinc-500">Teacher participation status</CardDescription>
                            </div>
                         </div>
                         <div className="flex gap-2">
                           <Select defaultValue="all">
                             <SelectTrigger className="w-[140px] rounded-xl border-zinc-100">
                               <SelectValue placeholder="Department" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">All Depts</SelectItem>
                               <SelectItem value="academic">Academic</SelectItem>
                               <SelectItem value="cca">CCA</SelectItem>
                             </SelectContent>
                           </Select>
                           <Button className="border-none bg-emerald-50 text-emerald-600 font-black px-6 rounded-xl hover:bg-emerald-100" onClick={() => navigate('/leader/courses/assessments')}>
                             Assessment Builder
                           </Button>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      <Table>
                         <TableHeader>
                            <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50">
                               <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest text-zinc-400">Teacher Name</TableHead>
                               <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest text-zinc-400">Department</TableHead>
                               <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest text-zinc-400">Orientation Status</TableHead>
                               <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest text-zinc-400">Academic Status</TableHead>
                               <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest text-zinc-400 text-right">Completion %</TableHead>
                            </TableRow>
                         </TableHeader>
                         <TableBody>
                            {teachers.slice(0, 5).map((teacher: any) => (
                              <TableRow key={teacher.id} className="hover:bg-emerald-50/30 transition-all group">
                                 <TableCell className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs">
                                          {teacher.fullName.charAt(0)}
                                       </div>
                                       <span className="font-black text-sm">{teacher.fullName}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="px-8 py-6">
                                    <span className="text-xs font-bold text-zinc-500 uppercase">{teacher.department || 'General'}</span>
                                 </TableCell>
                                 <TableCell className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                       <span className="text-xs font-bold text-emerald-600">Completed</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                                       <span className="text-xs font-bold text-amber-600">Pending</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="px-8 py-6 text-right">
                                    <span className="font-black text-sm">85%</span>
                                 </TableCell>
                              </TableRow>
                            ))}
                         </TableBody>
                      </Table>
                   </CardContent>
                </Card>

                {/* WIDGET 4: GOAL SETTING STATUS */}
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden lg:col-span-1">
                   <CardHeader className="p-8 border-b">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                            <Target className="w-6 h-6 text-amber-600" />
                         </div>
                         <div>
                            <CardTitle className="text-xl font-black">Goal Setting Status</CardTitle>
                            <CardDescription className="font-bold text-zinc-500">Submission visualizing</CardDescription>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-8">
                      <div className="h-[250px] w-full relative">
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
                                 innerRadius={60}
                                 outerRadius={80}
                                 paddingAngle={5}
                                 dataKey="value"
                               >
                                 {COLORS.map((color, index) => (
                                   <Cell key={`cell-${index}`} fill={color} />
                                 ))}
                               </Pie>
                               <RechartsTooltip />
                               <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-10 text-center">
                             <p className="text-3xl font-black text-zinc-900">{stats?.teachers?.total || 0}</p>
                             <p className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter">Campus Teachers</p>
                         </div>
                      </div>
                      <div className="mt-8 pt-8 border-t">
                         <Button className="w-full bg-zinc-900 text-white font-black h-14 rounded-2xl hover:bg-zinc-800" onClick={() => navigate('/leader/goals')}>
                            Review Goal Submissions
                         </Button>
                      </div>
                   </CardContent>
                </Card>

                {/* SUMMARY STATS (Optional extra) */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="rounded-[2rem] border-none shadow-lg bg-zinc-50 p-6 flex flex-col justify-between">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Total Teachers</span>
                       <span className="text-3xl font-black">{stats?.teachers?.total || 0}</span>
                    </Card>
                    <Card className="rounded-[2rem] border-none shadow-lg bg-zinc-50 p-6 flex flex-col justify-between">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Obs This Month</span>
                       <span className="text-3xl font-black">{stats?.observations?.thisMonth || 0}</span>
                    </Card>
                    <Card className="rounded-[2rem] border-none shadow-lg bg-zinc-50 p-6 flex flex-col justify-between">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Campus Events</span>
                       <span className="text-3xl font-black">{stats?.training?.totalEvents || 0}</span>
                    </Card>
                    <Card className="rounded-[2rem] border-none shadow-lg bg-zinc-50 p-6 flex flex-col justify-between">
                       <span className="text-[10px] font-black uppercase text-zinc-400">PDI Points avg.</span>
                       <span className="text-3xl font-black">{stats?.pdiPoints || 0}</span>
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
