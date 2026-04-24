import { useState, useEffect, useMemo } from "react";
import { CAMPUS_OPTIONS } from "@pdi/lib/constants";
import { format } from "date-fns";
// react-timekeeper removed - using native <input type="time"> instead
import api from "@pdi/lib/api";
import { getSocket } from "@pdi/lib/socket";
import { useAuth } from "@pdi/hooks/useAuth";
import { AssessmentManagementDashboard } from "@pdi/components/assessments/AssessmentManagementDashboard";
import { useAccessControl } from "@pdi/hooks/useAccessControl";
import { DashboardLayout } from "@pdi/components/layout/DashboardLayout";
import { formatRole } from "@pdi/lib/utils";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { QuickActionButtons } from "@pdi/components/QuickActionButtons";
import { StatCard } from "@pdi/components/StatCard";
import { TIME_SLOTS } from "@pdi/lib/constants";

import { Users, Eye, TrendingUp, Calendar, FileText, Target, Plus, ChevronLeft, ChevronRight, Save, Star, Search, Filter, Mail, Phone, MapPin, Award, CheckCircle, Download, Printer, Share2, Rocket, Clock, CheckCircle2, Map, Users as Users2, History as HistoryIcon, MessageSquare, Book, Link as LinkIcon, Brain, Paperclip, Sparkles, ClipboardCheck, Tag, Edit, ClipboardList, Trash2, Lock, FileCheck, RefreshCw, AlertCircle, Trophy, Bell, Zap, Loader2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@pdi/components/ui/tabs";
import { Button } from "@pdi/components/ui/button";
import { Progress } from "@pdi/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pdi/components/ui/card";

import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { Textarea } from "@pdi/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@pdi/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@pdi/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@pdi/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@pdi/components/ui/popover";
import { Badge } from "@pdi/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@pdi/components/ui/table";
import { Switch } from "@pdi/components/ui/switch";
import { ScrollArea } from "@pdi/components/ui/scroll-area";
import { Link, useNavigate, Routes, Route, useParams, useLocation, useSearchParams } from "react-router-dom";



import { Observation } from "@pdi/types/observation";
import { Goal } from "@pdi/types/goal";
import { GoalSettingForm } from "@pdi/components/GoalSettingForm";
import { TeacherAnalyticsReport } from "@pdi/components/TeacherAnalyticsReport";
import { LeaderPerformanceAnalytics } from "@pdi/components/LeaderPerformanceAnalytics";
import { AIAnalysisModal } from "@pdi/components/AIAnalysisModal";
import { toast } from "sonner";
import { cn } from "@pdi/lib/utils";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";

import { DynamicForm } from "@pdi/components/DynamicForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { UnifiedObservationForm } from "@pdi/components/UnifiedObservationForm";
import { TeacherProfileView } from "@pdi/components/TeacherProfileView";
import { GoalWorkflowForms } from "@pdi/components/GoalWorkflowForms";
import { moocService } from "@pdi/services/moocService";
import { courseService } from "@pdi/services/courseService";
import { trainingService } from "@pdi/services/trainingService";
import { userService } from "@pdi/services/userService";
import { MeetingsDashboard } from './MeetingsDashboard';
import { CreateMeetingForm } from './CreateMeetingForm';
import { MeetingMoMForm } from './MeetingMoMForm';
import { LearningInsightsView } from './leader/LearningInsightsView';
import { PDHoursAnalyticsView } from './admin/PDHoursAnalyticsView';
import { AdminGoalsView } from './admin/AdminGoalsView';
import { AdminReportsView } from './admin/AdminReportsView';
import { CustomDashboardWrapper } from "@pdi/components/CustomDashboardWrapper";

// Admin Components
import AdminGrowthAnalyticsPage from "./admin/AdminGrowthAnalyticsPage";
import { UserManagementView } from "./admin/UserManagementView";
import { FormTemplatesView } from "./admin/FormTemplatesView";
import { SystemSettingsView } from "./admin/SystemSettingsView";
import { CourseManagementView } from "./admin/CourseManagementView";
import { SuperAdminView } from "./admin/SuperAdminView";
import AdminDocumentManagement from "./AdminDocumentManagement";
import SurveyPage from "./SurveyPage";
import AttendanceRegister from "./AttendanceRegister";
import EventAttendanceView from "./EventAttendanceView";

// Management Components
import ManagementGrowthAnalyticsPage from "./management/ManagementGrowthAnalyticsPage";
import { ManagementInsightsView } from "./management/ManagementInsightsView";
import { ManagementGoalsView } from "./management/ManagementGoalsView";
import { FestivalManagementDashboard } from "./LearningFestival/FestivalManagementDashboard";
import { LearningFestivalPage } from "./LearningFestival/LearningFestivalPage";
import { MoocResponsesView as MoocResponsesRegistry } from "@pdi/components/mooc/MoocResponsesRegistry";

export default function LeaderDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const userName = user.fullName;
  const role = user.role;


  const [team, setTeam] = useState<any[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [training, setTraining] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [trainingTargets, setTrainingTargets] = useState<Record<string, number>>({
    'IN_SERVICE': 20
  });

  const [currentDraftGoalId, setCurrentDraftGoalId] = useState<string | null>(null);

  const availableCampuses = useMemo(() => {
    if (['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      return CAMPUS_OPTIONS;
    }
    const caps: string[] = [];
    if (user.campusId) caps.push(user.campusId);
    if (user.campusAccess) {
      caps.push(...user.campusAccess.split(',').filter(Boolean));
    }
    return Array.from(new Set(caps.filter(Boolean)));
  }, [user]);

  // Computed Stats
  const domainAverages = useMemo(() => {
    const domains = ["Pedagogy", "Technology", "Assessment", "Curriculum"];
    return domains.map(domainName => {
      const domainObs = observations.filter(o => o.domain === domainName);
      const avg = domainObs.length > 0
        ? Number((domainObs.reduce((acc, o) => acc + (o.score || 0), 0) / domainObs.length).toFixed(1))
        : 0;
      return {
        domain: domainName,
        average: avg,
        count: domainObs.length
      };
    });
  }, [observations]);

  const systemAvgScore = useMemo(() => {
    if (observations.length === 0) return "0.0";
    const total = observations.reduce((acc, o) => acc + (o.score || 0), 0);
    return (total / observations.length).toFixed(1);
  }, [observations]);


  // Centralized fetcher for all leader dashboard data
  const fetchAllData = async () => {
    await Promise.all([
      fetchObservations(),
      fetchGoals(),
      fetchTraining(),
      fetchTeachers(),
      fetchMoocSubmissions(),
      fetchSettings()
    ]);
  };

  const fetchObservations = async () => {
    try {
      const response = await api.get('/observations');
      let legacyObservations: any[] = [];
      if (response.data?.status === 'success') {
        legacyObservations = (response.data?.data?.observations || []).map((obs: any) => {
          let parsedReflection = obs.detailedReflection;
          if (typeof obs.detailedReflection === 'string') {
            try { parsedReflection = JSON.parse(obs.detailedReflection); } catch (e) { /* ignore */ }
          }
          return {
            ...obs,
            teacher: obs.teacher?.fullName || obs.teacherEmail || 'Unknown Teacher',
            classroom: obs.classroom || {
              block: obs.block, grade: obs.grade, section: obs.section, learningArea: obs.learningArea
            },
            detailedReflection: parsedReflection || {},
            strengths: obs.strengths || parsedReflection?.strengths || "",
            improvements: obs.improvements || parsedReflection?.improvements || "",
            teachingStrategies: obs.teachingStrategies || parsedReflection?.teachingStrategies || [],
            date: obs.date ? new Date(obs.date).toLocaleDateString() : 'N/A',
            _source: 'legacy'
          };
        });
      }

      let growthObservations: any[] = [];
      try {
        const growthResponse = await api.get('/growth/observations');
        if (growthResponse.data?.status === 'success') {
          growthObservations = (growthResponse.data?.data?.observations || []).map((obs: any) => {
            const fp = obs.formPayload || {};
            return {
              id: obs.id,
              teacher: obs.teacher?.fullName || fp.teacher || 'Unknown Teacher',
              teacherId: obs.teacherId,
              teacherEmail: obs.teacher?.email || fp.teacherEmail || '',
              observerName: obs.observer?.fullName || '',
              date: obs.observationDate ? new Date(obs.observationDate).toLocaleDateString() : 'N/A',
              domain: obs.moduleType || obs.subject || 'General',
              score: obs.overallRating || fp.score || 0,
              status: obs.status || 'SUBMITTED',
              strengths: obs.strengths || fp.strengths || '',
              improvements: obs.areasOfGrowth || fp.areasOfGrowth || '',
              notes: obs.notes || fp.notes || '',
              actionStep: obs.actionStep || fp.actionStep || '',
              hasReflection: !!(obs.teacherReflection),
              detailedReflection: fp.detailedReflection || {},
              teachingStrategies: [],
              classroom: {
                block: obs.block || fp.block || '', grade: obs.grade || fp.grade || '', section: obs.section || fp.section || '', learningArea: obs.subject || fp.learningArea || ''
              },
              metaTags: obs.metaTags,
              campus: obs.campusId || fp.campus || '',
              _source: 'growth'
            };
          });
        }
      } catch (e) { /* ignore */ }

      const legacyIds = new Set(legacyObservations.map((o: any) => o.id));
      const uniqueGrowth = growthObservations.filter(o => !legacyIds.has(o.id));
      const merged = [...legacyObservations, ...uniqueGrowth].sort((a, b) => {
        const da = a.date !== 'N/A' ? new Date(a.date).getTime() : 0;
        const db = b.date !== 'N/A' ? new Date(b.date).getTime() : 0;
        return db - da;
      });
      setObservations(merged);
    } catch (error) {
      console.error("Failed to fetch observations:", error);
      setObservations([]);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      if (response.data?.status === 'success') {
        setGoals(response.data.data.goals || []);
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };

  const fetchTraining = async () => {
    try {
      const events = await trainingService.getAllEvents();
      if (events) setTraining(events);
    } catch (error) {
      console.error("Failed to fetch training events:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data?.status === 'success') {
        const settings = response.data.data.settings;
        const newTargets = { ...trainingTargets };
        settings.forEach((s: any) => {
          let val;
          try { val = JSON.parse(s.value); } catch (e) { val = s.value; }
          if (s.key === 'training_target_new_joiner') newTargets['NEW_JOINER'] = parseFloat(val) || 40;
          if (s.key === 'training_target_in_service') newTargets['IN_SERVICE'] = parseFloat(val) || 20;
        });
        setTrainingTargets(newTargets);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  // Raw Data States
  const [teachers, setTeachers] = useState<any[]>([]);
  const [moocSubmissions, setMoocSubmissions] = useState<any[]>([]);

  // Fetch Raw Teachers
  const fetchTeachers = async () => {
    try {
      const apiTeachers = await userService.getTeachers();
      if (apiTeachers) setTeachers(apiTeachers);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  // Fetch Raw MOOC Submissions
  const fetchMoocSubmissions = async () => {
    try {
      const allMoocs = await moocService.getAllSubmissions();
      if (allMoocs) setMoocSubmissions(allMoocs);
    } catch (error) {
      console.error("Failed to fetch MOOC submissions:", error);
    }
  };

  // Derive Team Stats Dynamically
  useEffect(() => {
    if (teachers.length === 0) return;

    const mappedTeam = teachers
      .filter(t => !t.fullName?.toLowerCase().includes('test') && !t.email?.toLowerCase().includes('test'))
      .map(teacher => {
        // 1. Calculate Observation Stats from Real-time State
        // Match by teacherId, teacherEmail, or teacher name as fallback
        const teacherObs = observations.filter(o =>
          (o.teacherId && o.teacherId === teacher.id) ||
          (o.teacherEmail && teacher.email && o.teacherEmail.toLowerCase() === teacher.email.toLowerCase()) ||
          (o.teacher && typeof o.teacher === 'string' && teacher.fullName && o.teacher.toLowerCase() === teacher.fullName.toLowerCase())
        );

        const obsCount = teacherObs.length;

        const lastObsDate = teacherObs.length > 0 && teacherObs.some(o => o.date)
          ? new Date(Math.max(...teacherObs
            .map(o => new Date(o.date).getTime())
            .filter(time => !isNaN(time))
          )).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'N/A';

        const avgScore = teacherObs.length > 0
          ? (teacherObs.reduce((acc, o) => acc + (o.score || 0), 0) / teacherObs.length).toFixed(1)
          : "0";

        // 2. Calculate PD Stats
        const teacherSubmissions = moocSubmissions.filter((s: any) =>
          (s.userId === teacher.id || s.email === teacher.email || s.teacherEmail === teacher.email) && s.status === 'APPROVED'
        );

        const pdHours = teacherSubmissions.reduce((acc: number, s: any) => acc + Number(s.hours || 0), 0);

        const category = teacher.category || 'IN_SERVICE';
        const targetHours = trainingTargets[category] || 20;
        const completionRate = Math.min(100, Math.round((pdHours / targetHours) * 100));

        return {
          id: teacher.id,
          name: teacher.fullName,
          email: teacher.email,
          role: teacher.role || 'Teacher',
          observations: obsCount,
          lastObserved: lastObsDate,
          avgScore: Number(avgScore),
          pdHours: pdHours,
          pdTarget: targetHours,
          completionRate: completionRate,
          category: category,
          academics: teacher.academics,
          campusId: teacher.campusId,
          campus: teacher.campusId
        };
      });

    // Filter by selected campus
    const finalTeam = selectedCampus === "all"
      ? mappedTeam
      : mappedTeam.filter(t => t.campusId === selectedCampus || t.campus === selectedCampus);

    setTeam(finalTeam);

  }, [teachers, observations, moocSubmissions, selectedCampus, trainingTargets]);

  useEffect(() => {
    fetchAllData();

    const socket = getSocket();
    socket.emit('join_room', `user:${user?.id}`);
    if (user?.campusId) {
      socket.emit('join_room', `campus:${user.campusId}`);
    }
    socket.emit('join_room', 'leaders');

    const handleSync = () => {
      console.log("[SOCKET] Syncing leader dashboard...");
      fetchAllData();
    };

    const listeners = [
      'user:changed', 'observation:created', 'observation:updated',
      'growth-observation:created', 'goal:created', 'goal:updated',
      'training:created', 'training:updated', 'training:deleted',
      'mooc:created', 'mooc:updated', 'pd:awarded', 'attendance:submitted',
      'course:created', 'course:updated', 'course:deleted'
    ];

    listeners.forEach(ev => socket.on(ev, handleSync));

    // Special handlers for specific UI events
    socket.on('announcement:new', () => window.dispatchEvent(new Event('announcements-updated')));
    socket.on('announcement:updated', () => window.dispatchEvent(new Event('announcements-updated')));
    socket.on('announcement:deleted', () => window.dispatchEvent(new Event('announcements-updated')));
    socket.on('window:updated', () => window.dispatchEvent(new Event('goal-windows-updated')));

    return () => {
      listeners.forEach(ev => socket.off(ev, handleSync));
      socket.off('announcement:new');
      socket.off('announcement:updated');
      socket.off('announcement:deleted');
      socket.off('window:updated');
      socket.emit('leave_room', 'leaders');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.campusId]);


  useEffect(() => {
    window.dispatchEvent(new Event('local-goals-update'));
  }, [goals]);






  return (
    <DashboardLayout role={role.toLowerCase() as any} userName={userName}>
      <Routes>
        <Route index element={
          role === 'MANAGEMENT' ? (
            <LearningFestivalPage />
          ) : (
            <CustomDashboardWrapper role={role}>
              <DashboardOverview
                team={team}
                observations={observations}
                userName={userName}
                systemAvgScore={systemAvgScore}
                domainAverages={domainAverages}
                role={role}
                selectedCampus={selectedCampus}
                setSelectedCampus={setSelectedCampus}
                availableCampuses={availableCampuses}
                goals={goals}
              />
            </CustomDashboardWrapper>
          )
        } />
        <Route path="overview" element={
          role === 'MANAGEMENT' ? (
            <LearningFestivalPage />
          ) : (
            <CustomDashboardWrapper role={role}>
              <DashboardOverview
                team={team}
                observations={observations}
                userName={userName}
                systemAvgScore={systemAvgScore}
                domainAverages={domainAverages}
                role={role}
                selectedCampus={selectedCampus}
                setSelectedCampus={setSelectedCampus}
                availableCampuses={availableCampuses}
                goals={goals}
              />
            </CustomDashboardWrapper>
          )
        } />
        <Route path="growth-analytics" element={role === 'MANAGEMENT' ? <ManagementGrowthAnalyticsPage /> : <AdminGrowthAnalyticsPage />} />
        <Route path="pdi-health" element={role === 'MANAGEMENT' ? <ManagementInsightsView /> : <LearningInsightsView />} />
        <Route path="campus-performance" element={role === 'MANAGEMENT' ? <ManagementInsightsView /> : role === 'ADMIN' ? <AdminReportsView /> : <ReportsView team={team} observations={observations} />} />
        <Route path="pd-impact" element={role === 'MANAGEMENT' ? <ManagementInsightsView /> : <PDHoursAnalyticsView />} />
        <Route path="festival" element={<FestivalManagementDashboard />} />
        <Route path="team" element={<TeamManagementView team={team} observations={observations} goals={goals} systemAvgScore={systemAvgScore} availableCampuses={availableCampuses} selectedCampus={selectedCampus} setSelectedCampus={setSelectedCampus} />} />
        <Route path="team/:teacherId" element={<TeacherDetailsView team={team} observations={observations} goals={goals} />} />

        <Route path="goals" element={
          role === 'MANAGEMENT' 
            ? <ManagementGoalsView />
            : ['ADMIN', 'SUPERADMIN'].includes(role)
              ? <AdminGoalsView simplified={false} /> 
              : <TeacherGoalsView goals={goals} />
        } />
        <Route path="goals/assign" element={<AssignGoalView setGoals={setGoals} team={team} currentDraftGoalId={currentDraftGoalId} setCurrentDraftGoalId={setCurrentDraftGoalId} />} />
        <Route path="performance" element={<LeaderPerformanceAnalytics team={team} observations={observations} goals={goals} />} />
        <Route path="hours" element={<PDHoursAnalyticsView />} />
        <Route path="calendar" element={<PDCalendarView training={training} setTraining={setTraining} team={team} role={role} />} />
        <Route path="calendar/propose" element={<ProposeCourseView setTraining={setTraining} />} />
        <Route path="calendar/responses" element={<MoocResponsesRegistry refresh={fetchMoocSubmissions} backPath={['ADMIN', 'SUPERADMIN'].includes(role) ? '/admin' : '/leader/calendar'} />} />
        <Route path="mooc" element={<MoocResponsesRegistry refresh={fetchMoocSubmissions} backPath={['ADMIN', 'SUPERADMIN'].includes(role) ? '/admin' : '/leader/calendar'} />} />
        
        <Route path="meetings" element={<MeetingsDashboard />} />
        <Route path="meetings/create" element={<CreateMeetingForm />} />
        <Route path="meetings/:meetingId/mom" element={<MeetingMoMForm />} />
        <Route path="meetings/:meetingId" element={<MeetingMoMForm />} />
        <Route path="calendar/events/:eventId" element={<PlaceholderView title="PD Event Details" icon={Book} />} />
        <Route path="attendance" element={<AttendanceRegister />} />
        <Route path="attendance/:id" element={<EventAttendanceView />} />
        <Route path="insights" element={<LearningInsightsView />} />
        <Route path="participation" element={<PDParticipationView team={team} training={training} />} />
        <Route path="reports" element={['ADMIN', 'SUPERADMIN'].includes(role) ? <AdminReportsView /> : <ReportsView team={team} observations={observations} />} />
        <Route path="users" element={<UserManagementView />} />
        <Route path="forms" element={<FormTemplatesView />} />
        <Route path="courses/*" element={<LeaderCoursesModule />} />
        <Route path="documents" element={<AdminDocumentManagement />} />
        <Route path="survey" element={<SurveyPage />} />
        <Route path="settings" element={<SystemSettingsView />} />
        <Route path="superadmin" element={<SuperAdminView />} />
      </Routes>
    </DashboardLayout>
  );
}

function LeaderCoursesModule() {
  const { user } = useAuth();
  const role = user?.role || 'LEADER';
  
  return (
    <div className="space-y-6">
      <Routes>
        <Route index element={
          <>
            <PageHeader
               title={['ADMIN', 'SUPERADMIN'].includes(role) ? "Admin: Course Catalogue" : "School Leader: Course Catalogue"}
               subtitle={['ADMIN', 'SUPERADMIN'].includes(role) ? "System-wide program management" : "Review curriculum"}
            />
            <CourseManagementView hideHeader />
          </>
        } />
        <Route path="assessments" element={
          <>
            <PageHeader
               title={['ADMIN', 'SUPERADMIN', 'COORDINATOR'].includes(role) ? "Assessment Management" : "Assessments"}
               subtitle={['ADMIN', 'SUPERADMIN', 'COORDINATOR'].includes(role) ? "Design and deploy professional competency checks" : "Manage teacher evaluations"}
            />
            <AssessmentManagementDashboard hideHeader />
          </>
        } />
      </Routes>
    </div>
  );
}

function DashboardOverview({
  team,
  observations,
  userName,
  systemAvgScore,
  domainAverages,
  role,
  selectedCampus,
  setSelectedCampus,
  availableCampuses,
  goals
}: {
  team: any[],
  observations: Observation[],
  userName: string,
  systemAvgScore: string,
  domainAverages: any,
  role: string,
  selectedCampus: string,
  setSelectedCampus: (val: string) => void,
  availableCampuses: string[],
  goals: any[]
}) {
  const navigate = useNavigate();
  const { isModuleEnabled } = useAccessControl();

  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredTeamOverview = useMemo(() => {
    return team.filter(m => {
      const matchesCampus = selectedCampus === "all" || m.campusId === selectedCampus;
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      return matchesCampus && matchesRole;
    });
  }, [team, selectedCampus, roleFilter]);

  const allRoles = Array.from(new Set(team.map(m => m.role).filter(Boolean)));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 mb-8 shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/80">Leadership Dashboard</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase">Live Sync</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">{(userName || "").split(' ')[0]}!</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
              {selectedCampus === 'all' ? "Oversee team performance across respective campus." : `Performance overview for ${selectedCampus}.`}
              <span className="text-white font-bold ml-1">Track growth, mentor teachers, and drive excellence.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {availableCampuses.length > 1 && (
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger className="w-full sm:w-[220px] h-14 rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl text-white font-bold text-base hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Select Campus" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/10 bg-slate-900/95 backdrop-blur-2xl text-white">
                  <SelectItem value="all" className="focus:bg-white/10 focus:text-white">All Assigned Schools</SelectItem>
                  {availableCampuses.map(c => (
                    <SelectItem key={c} value={c} className="focus:bg-white/10 focus:text-white">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <QuickActionButtons role={role as any} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {isModuleEnabled('/leader/team', role) && (
          <StatCard
            title="Team Members"
            value={team.length}
            subtitle="Active Educators"
            icon={Users}
            onClick={() => navigate("/leader/team")}
          />
        )}
        {isModuleEnabled('/leader/observations', role) && (
          <StatCard
            title="Observations"
            value={observations.length}
            subtitle="This Month (Target: 24)"
            icon={Eye}
            trend={{ value: 15, isPositive: true }}
            onClick={() => navigate("/leader/growth/target-analytics")}
          />
        )}
        {isModuleEnabled('/leader/performance', role) && (
          <StatCard
            title="Avg Score"
            value={systemAvgScore}
            subtitle="Campus-wide Average"
            icon={TrendingUp}
            onClick={() => navigate("/leader/performance")}
          />
        )}
        {isModuleEnabled('/leader/hours', role) && (
          <StatCard
            title="Training Hours"
            value={`${team.length > 0 ? Math.round(team.reduce((acc, m) => acc + (m.pdHours || 0), 0) / team.length) : 0}h`}
            subtitle="Avg per Staff Member"
            icon={Clock}
            onClick={() => navigate("/leader/participation")}
          />
        )}
        {isModuleEnabled('/leader/goals', role) && (
          <StatCard
            title="Active Goals"
            value={goals.filter(g => g.status !== 'GOAL_COMPLETED').length}
            subtitle="Pending Completion"
            icon={Target}
            onClick={() => navigate("/leader/goals")}
          />
        )}
      </div>

      {isModuleEnabled('/leader/team', role) && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full bg-primary shadow-[0_0_15px_rgba(234,16,74,0.3)]"></div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">Team Performance Overview</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/leader/team")} className="text-primary font-bold hover:bg-primary/5">
              View All Members
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
            <ScrollArea className="h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/80 hover:bg-zinc-50/80 border-b border-zinc-100">
                      <th className="p-6 text-[10px] font-black tracking-[0.2em] text-zinc-900 w-16 uppercase">#</th>
                      <th className="p-6 text-[10px] font-black tracking-[0.2em] text-zinc-900 uppercase">
                        <div className="flex items-center gap-1.5">
                          <span>Teacher Profile</span>
                          <select 
                            className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="all">All Roles</option>
                            {allRoles.map(r => (
                              <option key={String(r)} value={String(r)}>{formatRole(String(r))}</option>
                            ))}
                          </select>
                        </div>
                      </th>
                      <th className="p-6 text-[10px] font-black tracking-[0.2em] text-zinc-900 text-center uppercase">Observations</th>
                      <th className="p-6 text-[10px] font-black tracking-[0.2em] text-zinc-900 uppercase">Last Seen</th>
                      <th className="p-6 text-[10px] font-black tracking-[0.2em] text-zinc-900 text-center uppercase">Growth Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredTeamOverview.map((member, index) => (
                      <tr key={member.id} className="group hover:bg-primary/5 transition-all duration-300">
                        <td className="p-6 text-xs font-bold text-zinc-600">{index + 1}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xl shadow-sm group-hover:scale-105 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                              {(member.name || "?").charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-zinc-900 text-lg group-hover:text-primary transition-colors">{member.name}</p>
                              <p className="text-xs text-zinc-600 font-bold tracking-wider">{formatRole(member.role)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <span className="inline-flex items-center justify-center min-w-[3rem] h-10 px-4 rounded-xl bg-zinc-50 text-zinc-900 font-black text-sm border border-zinc-100 group-hover:bg-white group-hover:border-primary/20 transition-all">
                            {member.observations}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-zinc-900 font-bold">{member.lastObserved}</span>
                            <span className="text-[10px] text-zinc-600 font-bold capitalize tracking-wider">Formal Cycle</span>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <div className={cn(
                            "inline-flex items-center justify-center w-14 h-14 rounded-2xl font-black text-base border shadow-sm transition-transform group-hover:scale-110",
                            member.avgScore >= 4
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100"
                              : member.avgScore >= 3
                                ? "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100"
                                : "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100"
                          )}>
                            {member.avgScore}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
}

function TeamManagementView({ 
  team, 
  observations, 
  goals, 
  systemAvgScore,
  availableCampuses,
  selectedCampus,
  setSelectedCampus
}: { 
  team: any[], 
  observations: Observation[], 
  goals: Goal[], 
  systemAvgScore: string,
  availableCampuses: string[],
  selectedCampus: string,
  setSelectedCampus: (val: string) => void
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [inputValue, setInputValue] = useState(searchQuery);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  const filteredTeam = team.filter(member =>
    (member.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.role || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leader")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="Team Management"
            subtitle="Oversee teacher performance and professional growth"
          />
        </div>
        <div className="flex items-center gap-3">
          {availableCampuses.length > 1 && (
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-[180px] h-10 border-muted-foreground/20 bg-background/50">
                <SelectValue placeholder="All Campuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                {availableCampuses.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input
              placeholder="Search teachers..."
              className="pl-10 w-[250px] bg-background/50 border-muted-foreground/20"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} className="h-10 px-6 font-bold">
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Staff"
          value={team.length}
          subtitle="Active educators"
          icon={Users}
          onClick={() => navigate("/leader/team")}
        />
        <StatCard
          title="Observations"
          value={observations.length}
          subtitle="This quarter"
          icon={Eye}
          onClick={() => navigate("/leader/growth")}
        />
        <StatCard
          title="Avg Performance"
          value={systemAvgScore}
          subtitle="Across all domains"
          icon={TrendingUp}
          onClick={() => navigate("/leader/performance")}
        />
        <StatCard
          title="Active Goals"
          value={goals.filter(g => g.status !== 'GOAL_COMPLETED').length}
          subtitle="Pending completion"
          icon={Target}
          onClick={() => navigate("/leader/goals")}
        />
      </div>

      <Card className="  shadow-xl bg-white">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle>Teacher Registry</CardTitle>
          <CardDescription>Comprehensive list of teaching staff and their current standing.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="text-left p-6 text-sm font-bold tracking-wider text-zinc-900 uppercase w-16">#</th>
                    <th className="text-left p-6 text-sm font-bold tracking-wider text-zinc-900 uppercase">Teacher Profile</th>
                    <th className="text-left p-6 text-sm font-bold tracking-wider text-zinc-900 uppercase">Specialization</th>
                    <th className="text-left p-6 text-sm font-bold tracking-wider text-zinc-900 uppercase">Observation Cycle</th>
                    <th className="text-left p-6 text-sm font-bold tracking-wider text-zinc-900 uppercase">Score</th>
                    <th className="text-right p-6 text-sm font-bold tracking-wider text-zinc-900 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted-foreground/10">
                  {filteredTeam.map((member, index) => (
                    <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-6 text-sm font-bold text-zinc-600">
                        {index + 1}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shadow-inner">
                            {(member.name || "?").charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-muted text-zinc-600 border border-muted-foreground/10">
                          {member.role}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-zinc-600 font-bold">Progress</span>
                            <span className="text-primary">{Math.round((member.observations / 10) * 100)}%</span>
                          </div>
                          <Progress value={(member.observations / 10) * 100} className="h-1.5 w-32" />
                          <p className="text-xs text-zinc-900 font-bold mt-1">Last: <span className="font-bold text-zinc-950">{member.lastObserved}</span></p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold border shadow-sm",
                            member.avgScore >= 4 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                          )}>
                            <span className="text-lg">{member.avgScore}</span>
                            <span className="text-[10px] capitalize opacity-60">Avg</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-10 px-4 gap-2 hover:bg-primary/10 hover:text-primary" onClick={() => navigate(`/leader/team/${member.id}`)}>
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTeam.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 grayscale opacity-40">
                          <Users className="w-16 h-16" />
                          <div className="space-y-1">
                            <p className="text-xl font-bold">No teachers found</p>
                            <p className="text-zinc-900 font-bold">Try adjusting your search query</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherDetailsView({ team, observations, goals }: { team: any[], observations: Observation[], goals: Goal[] }) {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const teacher = team.find(t => t.id === teacherId);

  if (!teacher) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Users className="w-16 h-16 text-zinc-600 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold">Teacher not found</h2>
        <Button onClick={() => navigate("/leader/team")} className="mt-4">Back to Team Registry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeacherProfileView
        teacher={teacher}
        observations={observations}
        goals={goals}
        onBack={() => navigate("/leader/team")}
        userRole="leader"
      />
    </div>
  );
}

function PDParticipationView({ team, training }: { team: any[], training: any[] }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Exclude Super Admin from PD Participation tracking
  const pdTeam = team.filter(m => m.role !== "Super Admin");

  const filteredTeam = pdTeam.filter(m => {
    const matchesSearch = (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.role || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "Certified" && m.pdHours >= 20) || // Assuming 20 is target
      (statusFilter === "In Progress" && m.pdHours < 20);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const uniqueRoles = Array.from(new Set(pdTeam.map(m => m.role)));

  const totalHours = pdTeam.reduce((acc, m) => acc + (m.pdHours || 0), 0);
  const avgCompletion = pdTeam.length > 0
    ? Math.round(totalHours / pdTeam.length)
    : 0;

  const missingTargetCount = pdTeam.filter(m => (m.pdHours || 0) < 20).length; // Target is 20

  // Calculate attendance averages
  const pastTrainings = training.filter(t => 
    new Date(t.date) < new Date() && 
    (!t.entryType || !t.entryType.toLowerCase().includes('observation')) &&
    (!t.type || !t.type.toLowerCase().includes('observation'))
  );
  const upcomingTrainings = training.filter(t => 
    new Date(t.date) >= new Date() && 
    (!t.entryType || !t.entryType.toLowerCase().includes('observation')) &&
    (!t.type || !t.type.toLowerCase().includes('observation'))
  );

  const avgAttendance = pastTrainings.length > 0
    ? Math.round(pastTrainings.reduce((acc, t) => acc + ((t.registrants?.length || 0) / (t.capacity || pdTeam.length)) * 100, 0) / pastTrainings.length)
    : 0;

  const activeFiltersCount = (roleFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const handleExportParticipation = () => {
    const headers = ["Name", "Role", "Training Hours", "Progress (%)"];
    const rows = filteredTeam.map(t => [
      t.name,
      t.role,
      t.pdHours,
      `${Math.min(100, Math.round((t.pdHours / (t.pdTarget || 20)) * 100))}%`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pd_participation_registry_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Participation data exported successfully");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="TD Participation Tracking"
        subtitle="Monitor Teacher Development hours and compliance"
        actions={
          <Button onClick={() => navigate("/leader/calendar")}>
            <Calendar className="mr-2 w-4 h-4" />
            Manage Training
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Training Hours"
          value={totalHours}
          subtitle="Accrued across all staff"
          icon={Clock}
        />
        <StatCard
          title="Avg. Training Hours"
          value={`${avgCompletion}h`}
          subtitle="Hours per teacher"
          icon={TrendingUp}
        />
        <StatCard
          title="Missing Target"
          value={missingTargetCount}
          subtitle="Staff < 20 hours"
          icon={AlertCircle}
          className="border-l-4 border-warning"
        />
        <StatCard
          title="Campus Rank"
          value="#1"
          subtitle="Regional PDI standing"
          icon={Award}
          className="border-l-4 border-primary"
        />
      </div>

      {/* Leaderboard & Upcoming Trainings Data Split */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white overflow-hidden relative border-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
          <CardHeader className="border-b border-white/10 pb-4 relative z-10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Teacher Leaderboard
            </CardTitle>
            <CardDescription className="text-slate-400">Top performers by Training hours completed.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            <div className="divide-y divide-white/10">
              {pdTeam.sort((a, b) => (b.pdHours || 0) - (a.pdHours || 0)).slice(0, 5).map((member, idx) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-offset-2 ring-offset-slate-900",
                      idx === 0 ? "bg-yellow-500 text-white ring-yellow-500/50" :
                        idx === 1 ? "bg-slate-300 text-slate-800 ring-slate-300/50" :
                          idx === 2 ? "bg-amber-700 text-white ring-amber-700/50" : "bg-slate-800 text-slate-400 ring-slate-800/20"
                    )}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{member.name}</p>
                      <p className="text-[10px] text-zinc-900 capitalize font-black">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary tracking-tighter">{member.pdHours}h</p>
                    <p className="text-[10px] text-zinc-900 font-bold capitalize whitespace-nowrap">Completed</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/5 flex justify-center">
              <Button variant="link" className="text-slate-400 hover:text-white text-xs gap-2" onClick={() => {
                // Focus on the registry table
                const element = document.getElementById('staff-td-registry');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}>
                View All Community Ranks
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="  shadow-xl bg-white">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle>Upcoming Trainings (Whole School)</CardTitle>
              <CardDescription>Scheduled TD training sessions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="py-4 px-6 text-xs font-bold capitalize tracking-wider text-zinc-900">Training</TableHead>
                      <TableHead className="py-4 px-6 text-xs font-bold capitalize tracking-wider text-zinc-900">Date</TableHead>
                      <TableHead className="py-4 px-6 text-xs font-bold capitalize tracking-wider text-zinc-900">Registrants</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-muted-foreground/10">
                    {upcomingTrainings.length > 0 ? upcomingTrainings.slice(0, 5).map(event => (
                      <TableRow key={event.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="p-6 font-bold text-foreground">{event.title}</TableCell>
                        <TableCell className="p-6 text-zinc-600 whitespace-nowrap">{event.date}</TableCell>
                        <TableCell className="p-6">
                          <Badge variant="secondary" className="font-bold">{event.registrants?.length || 0} Registered</Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-zinc-900 font-bold">No upcoming trainings.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="  shadow-xl bg-white">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle>Campus Training Attendance</CardTitle>
              <CardDescription>Attendance percentage for past sessions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="py-4 px-6 text-xs font-bold capitalize tracking-wider text-zinc-900">Training Session</TableHead>
                      <TableHead className="py-4 px-6 text-xs font-bold capitalize tracking-wider text-zinc-900">Date</TableHead>
                      <TableHead className="py-4 px-6 text-xs font-bold capitalize tracking-wider text-right text-zinc-900">Registrants</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-muted-foreground/10">
                    {pastTrainings.length > 0 ? pastTrainings.slice(0, 5).map(event => {
                      const count = event.registrants?.length || 0;
                      return (
                        <TableRow key={event.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="p-6 font-bold text-foreground">{event.title}</TableCell>
                          <TableCell className="p-6 text-zinc-600 whitespace-nowrap">{event.date}</TableCell>
                          <TableCell className="p-6 text-right font-black text-primary text-lg">
                            {count}
                          </TableCell>
                        </TableRow>
                      );
                    }) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-zinc-900 font-bold">No past trainings recorded.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="  shadow-xl bg-white" id="staff-td-registry">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Staff TD Registry</CardTitle>
              <CardDescription>Track individual Teacher Development progress and hours.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  placeholder="Search staff..."
                  className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl gap-2 font-bold" onClick={handleExportParticipation}>
                <Download className="w-4 h-4" />
                Export CSV
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={activeFiltersCount > 0 ? "default" : "outline"}
                    size="icon"
                    className="rounded-xl relative"
                  >
                    <Filter className="w-4 h-4" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-6 rounded-2xl shadow-2xl border-primary/10" align="end">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground">Filters</h4>
                      {(roleFilter !== "all" || statusFilter !== "all") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRoleFilter("all");
                            setStatusFilter("all");
                          }}
                          className="h-8 text-xs text-primary font-bold hover:bg-primary/5"
                        >
                          Reset All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold capitalize tracking-wider text-zinc-900">Staff Role</Label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                          <SelectTrigger className="rounded-xl bg-muted/30 border-none">
                            <SelectValue placeholder="All Roles" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-primary/10">
                            <SelectItem value="all">All Roles</SelectItem>
                            {uniqueRoles.map(role => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold capitalize tracking-wider text-zinc-900">Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="rounded-xl bg-muted/30 border-none">
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-primary/10">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Certified">Certified (=90%)</SelectItem>
                            <SelectItem value="In Progress">In Progress (&lt;90%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-900 uppercase">Teacher</th>
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-900 uppercase">Role</th>
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-900 uppercase">Training Hours</th>
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-900 uppercase w-1/4">Progress</th>
                    <th className="text-right p-6 text-sm font-bold capitalize tracking-wider text-zinc-900 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted-foreground/10">
                  {filteredTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-6">
                        <p className="font-bold text-foreground">{member.name}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold text-zinc-900">{member.role}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {member.pdHours}
                          </div>
                          <span className="text-xs font-bold capitalize text-zinc-900">Hours</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{member.pdHours}h / {member.pdTarget || 20}h</span>
                            <span className={cn(
                              (member.pdHours || 0) >= (member.pdTarget || 20) ? "text-success" : (member.pdHours || 0) >= ((member.pdTarget || 20) / 2) ? "text-primary" : "text-warning"
                            )}>
                              {(member.pdHours || 0) >= (member.pdTarget || 20) ? "Certified" : "In Progress"}
                            </span>
                          </div>
                          <Progress value={Math.min(100, ((member.pdHours || 0) / (member.pdTarget || 20)) * 100)} className="h-2" />
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 px-4 gap-2 border-primary/20 hover:bg-primary/5 text-primary font-bold"
                            onClick={() => {
                              toast.success(`Manual PD credit awarded to ${member.name}`);
                            }}
                          >
                            <Award className="w-4 h-4" />
                            Award Hours
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 px-4 gap-2 hover:bg-primary/10 hover:text-primary"
                            onClick={() => navigate(`/leader/team/${member.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function PDCalendarView({
  training,
  setTraining,
  team = [],
  role
}: {
  training: any[],
  setTraining: React.Dispatch<React.SetStateAction<any[]>>,
  team?: any[],
  role: string
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );

  // Advanced Filters
  const [typeFilter, setTypeFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (date) params.set("date", date.toISOString().split('T')[0]);
    else params.delete("date");

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, date]);

  // Edit & Creation State
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRegistrantsOpen, setIsRegistrantsOpen] = useState(false);
  const [selectedRegistrants, setSelectedRegistrants] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "Pedagogy",
    entryType: "Training Event",
    teacherId: "",
    teacherName: "",
    date: new Date(),
    time: "09:00 AM",
    location: "",
    capacity: 30,
    description: "",
    objectives: ""
  });

  // Helper to parse "MMM d, yyyy" string to Date object
  const parseEventDate = (dateStr: string) => {
    try {
      // Handle both "MMM d, yyyy" and potential legacy "MMM d"
      const parts = dateStr.includes(',') ? dateStr : `${dateStr}, 2026`;
      return new Date(parts);
    } catch (e) {
      return new Date();
    }
  };

  // Helper to format Date object to "MMM d, yyyy" string
  const formatDateStr = (d: Date) => {
    return format(d, "MMM d, yyyy");
  };

  const safeTraining = Array.isArray(training) ? training.filter(e => e && typeof e.title === 'string') : [];

  const upcomingTrainings = safeTraining.filter(t => 
    new Date(t.date) >= new Date() && 
    (!t.entryType || !t.entryType.toLowerCase().includes('observation')) &&
    (!t.type || !t.type.toLowerCase().includes('observation'))
  );

  const filteredEvents = safeTraining.filter((e) => {
    // Exclude observations from sessions list
    const isObservation = 
        (e.entryType && e.entryType.toLowerCase().includes('observation')) || 
        (e.type && e.type.toLowerCase().includes('observation'));
    
    if (isObservation) return false;

    const matchesSearch = (e.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.topic || e.type || "").toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (date) {
      matchesDate = e.date === formatDateStr(date);
    }

    const matchesType = typeFilter === "All" || (e.topic || e.type || "").toLowerCase() === typeFilter.toLowerCase();
    const matchesTime = !timeFilter || (e.time || "").toLowerCase().includes(timeFilter.toLowerCase());
    const matchesLocation = !locationFilter || (e.location || "").toLowerCase().includes(locationFilter.toLowerCase());
    const matchesStatus = statusFilter === "All" || (e.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDate && matchesType && matchesTime && matchesLocation && matchesStatus;
  });

  // Get dates that have events for highlighting
  const eventDates = safeTraining.map(e => parseEventDate(e.date));

  const handleToggleAttendance = async (eventId: string, action: 'enable' | 'close') => {
    try {
      const updatedEvent = await trainingService.toggleAttendance(eventId, action);
      setTraining(prev => prev.map(ev => ev.id === eventId ? { ...ev, ...updatedEvent } : ev));
      if (editingEvent && editingEvent.id === eventId) {
        setEditingEvent({ ...editingEvent, ...updatedEvent });
      }
      toast.success(`Attendance ${action === 'enable' ? 'enabled' : 'closed'} successfully`);
    } catch (error) {
      console.error(`Failed to ${action} attendance:`, error);
      toast.error(`Failed to ${action} attendance`);
    }
  };

  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const eventData = {
        title: newEvent.title,
        type: newEvent.type,
        topic: newEvent.type,
        entryType: newEvent.entryType,
        teacherId: newEvent.entryType === 'Observation' ? newEvent.teacherId : undefined,
        teacherName: newEvent.entryType === 'Observation' ? newEvent.teacherName : undefined,
        date: formatDateStr(newEvent.date),
        time: newEvent.time,
        location: newEvent.location,
        capacity: newEvent.capacity,
        description: newEvent.description,
        objectives: newEvent.objectives,
        status: "Approved"
      };

      const response = await trainingService.createEvent(eventData);
      setTraining(prev => [...prev, response]);
      setIsScheduleOpen(false);
      setNewEvent({
        title: "",
        type: "Pedagogy",
        entryType: "Training Event",
        teacherId: "",
        teacherName: "",
        date: new Date(),
        time: "09:00 AM",
        location: "",
        capacity: 30,
        description: "",
        objectives: ""
      });
      toast.success("Event scheduled successfully");
    } catch (error) {
      console.error("Error scheduling event:", error);
      toast.error("Failed to schedule event.");
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const updatedData = {
        ...editingEvent,
        date: typeof editingEvent.date === 'string' ? editingEvent.date : formatDateStr(editingEvent.date),
        topic: editingEvent.type || editingEvent.topic
      };

      const savedEvent = await trainingService.updateEvent(editingEvent.id, updatedData);
      setTraining(prev => prev.map(ev => ev.id === editingEvent.id ? savedEvent : ev));
      setIsEditOpen(false);
      setEditingEvent(null);
      toast.success("Event details updated successfully");
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
    try {
      await trainingService.deleteEvent(editingEvent.id);
      setTraining(prev => prev.filter(t => t.id !== editingEvent.id));
      setIsDeleteOpen(false);
      setIsEditOpen(false);
      setEditingEvent(null);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event.");
    }
  };



  const handleViewRegistrants = (event: any) => {
    setSelectedRegistrants(event.registrants || []);
    setEditingEvent(event);
    setIsRegistrantsOpen(true);
    setIsEditOpen(false);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEditOpen(true);
  };

  const handleRegister = async (eventId: string) => {
    try {
      await trainingService.registerForEvent(eventId);

      setTraining(prev => prev.map(event => {
        if (event.id === eventId) {
          toast.success(`Successfully registered for ${event.title}`);
          return {
            ...event,
            isRegistered: true,
            registered: (event.registered || 0) + 1,
            spotsLeft: (event.spotsLeft || 1) - 1,
          };
        }
        return event;
      }));
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error("Failed to register for the event.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Calendar"
        subtitle="Schedule and manage Teacher Development sessions"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsScheduleOpen(true)}>
              <Plus className="mr-2 w-4 h-4" />
              Schedule Event/Observations
            </Button>
            <Button onClick={() => navigate("/leader/calendar/propose")}>
              <Plus className="mr-2 w-4 h-4" />
              Propose New Course
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <StatCard
          title="Upcoming Sessions"
          value={upcomingTrainings.length}
          subtitle="Scheduled this month"
          icon={Calendar}
        />
        <StatCard
          title="Total Registrations"
          value={training.reduce((acc, e) => acc + (e.registrants?.length || 0), 0)}
          subtitle="Staff enrolled"
          icon={Users2}
        />
      </div>

      <div className="space-y-8">
        {/* Calendar Widget */}
        <div className="w-full space-y-6">
          <Card className="  shadow-2xl bg-zinc-950 text-white overflow-hidden relative">
            {/* decorative gradient blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-10 -translate-x-10 pointer-events-none" />

            <CardContent className="p-6 md:p-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left side: Header and Calendar */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="text-left w-full">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                      Activity Summary
                    </h3>
                    <p className="text-zinc-400 text-xs capitalize tracking-wider font-medium">
                      {formatDateStr(new Date())}
                    </p>
                  </div>

                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-2xl border-none bg-zinc-900/50 p-6 w-full"
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center mb-6",
                      caption_label: "text-base font-bold text-white",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-transparent p-0 text-zinc-400 hover:text-white border-zinc-700 hover:bg-zinc-800",
                      nav_button_previous: "absolute left-2",
                      nav_button_next: "absolute right-2",
                      table: "w-full border-collapse",
                      head_row: "flex w-full mt-2",
                      head_cell: "text-zinc-400 rounded-md w-10 font-bold text-[0.85rem] capitalize tracking-wider flex items-center justify-center",
                      row: "flex w-full mt-3",
                      cell: "h-10 w-10 text-center text-base p-0 relative [&:has([aria-selected])]:bg-zinc-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-10 w-10 p-0 font-bold aria-selected:opacity-100 text-white hover:bg-zinc-800 rounded-full transition-all flex items-center justify-center",
                      day_selected: "bg-gradient-to-br from-pink-500 to-red-600 text-white hover:bg-red-600 focus:bg-red-600 shadow-lg shadow-red-500/30",
                      day_today: "bg-zinc-800 text-white font-black ring-2 ring-zinc-700",
                      day_outside: "text-zinc-500 opacity-40",
                    }}
                    modifiers={{
                      pedagogy: training.filter((e: any) => (e.topic || e.type) === "Pedagogy").map((e: any) => parseEventDate(e.date)),
                      technology: training.filter((e: any) => (e.topic || e.type) === "Technology").map((e: any) => parseEventDate(e.date)),
                      assessment: training.filter((e: any) => (e.topic || e.type) === "Assessment").map((e: any) => parseEventDate(e.date)),
                      other: training.filter((e: any) => !["Pedagogy", "Technology", "Assessment"].includes(e.topic || e.type)).map((e: any) => parseEventDate(e.date)),
                    }}
                    modifiersStyles={{
                      pedagogy: { border: '2px solid #3b82f6', color: 'white' }, // Blue
                      technology: { border: '2px solid #10b981', color: 'white' }, // Green
                      assessment: { border: '2px solid #f43f5e', color: 'white' }, // Red
                      other: { border: '2px solid #eab308', color: 'white' } // Yellow
                    }}
                  />
                </div>

                {/* Right side: Legend and Actions */}
                <div className="lg:col-span-5 h-full flex flex-col justify-center pt-10">
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-zinc-400 capitalize tracking-widest mb-4">Legend</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <span className="flex items-center gap-3 text-sm text-zinc-300">
                          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span> Pedagogy
                        </span>
                        <span className="font-mono text-white text-sm bg-blue-500/20 px-2 py-0.5 rounded-md">
                          {training.filter((t: any) => (t.topic || t.type) === 'Pedagogy').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                        <span className="flex items-center gap-3 text-sm text-zinc-300">
                          <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"></span> Technology
                        </span>
                        <span className="font-mono text-white text-sm bg-green-500/20 px-2 py-0.5 rounded-md">
                          {training.filter((t: any) => (t.topic || t.type) === 'Technology').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                        <span className="flex items-center gap-3 text-sm text-zinc-300">
                          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span> Assessment
                        </span>
                        <span className="font-mono text-white text-sm bg-rose-500/20 px-2 py-0.5 rounded-md">
                          {training.filter((t: any) => (t.topic || t.type) === 'Assessment').length}
                        </span>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button
                        variant="outline"
                        className="w-full py-6 bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all text-base rounded-xl"
                        onClick={() => setDate(undefined)}
                        disabled={!date}
                      >
                        Clear Selection Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event List */}
        <div className="w-full">
          <Card className="  shadow-xl bg-white h-full">
            <CardHeader className="border-b bg-muted/20 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>
                    {date ? `Sessions for ${formatDateStr(date)}` : "All Upcoming Sessions"}
                  </CardTitle>
                  <CardDescription>
                    {filteredEvents.length} session{filteredEvents.length !== 1 && 's'} scheduled
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <Input
                      placeholder="Search sessions..."
                      className="pl-10 w-[200px] bg-background border-muted-foreground/20 rounded-xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-xl border-dashed gap-2",
                      (typeFilter !== "All" || statusFilter !== "All" || timeFilter || locationFilter) && "bg-primary/5 border-primary text-primary"
                    )}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  {(typeFilter !== "All" || statusFilter !== "All" || timeFilter || locationFilter || searchQuery || date) && (
                    <Button
                      variant="ghost"
                      className="text-zinc-600 text-xs hover:text-primary h-9"
                      onClick={() => {
                        setTypeFilter("All");
                        setStatusFilter("All");
                        setTimeFilter("");
                        setLocationFilter("");
                        setSearchQuery("");
                        setDate(undefined);
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {showFilters && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] capitalize font-bold text-zinc-600 ml-1">Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="rounded-xl bg-background border-muted-foreground/10 h-10">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Assessment">Assessment</SelectItem>
                        <SelectItem value="Observation">Observation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] capitalize font-bold text-zinc-600 ml-1">Time</Label>
                    <Input
                      placeholder="e.g. 09:00 AM"
                      className="rounded-xl bg-background border-muted-foreground/10 h-10"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] capitalize font-bold text-zinc-600 ml-1">Location</Label>
                    <Input
                      placeholder="Search location..."
                      className="rounded-xl bg-background border-muted-foreground/10 h-10"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] capitalize font-bold text-zinc-600 ml-1">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="rounded-xl bg-background border-muted-foreground/10 h-10">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {filteredEvents.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/30 border-b">
                        <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600 w-16">#</th>
                        <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Session Title</th>
                        <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Type</th>
                        <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Time</th>
                        <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Location</th>
                        <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Status</th>
                        <th className="text-right p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted-foreground/10">
                      {filteredEvents.map((session, index) => (
                        <tr key={session.id} className="hover:bg-primary/5 transition-colors group">
                          <td className="p-6 text-sm font-bold text-zinc-600">
                            {index + 1}
                          </td>
                          <td className="p-6">
                            <p className="font-bold text-foreground">{session.title}</p>
                            {!date && <p className="text-xs text-zinc-600 mt-1">{session.date}</p>}
                          </td>
                          <td className="p-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary capitalize tracking-wider">
                              {session.topic || session.type}
                            </span>
                          </td>
                          <td className="p-6">
                            <p className="text-sm font-bold text-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4 text-zinc-600" />
                              {session.time}
                            </p>
                          </td>
                          <td className="p-6">
                            <p className="text-sm text-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              {session.location}
                            </p>
                          </td>
                          <td className="p-6">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              session.status === "Approved"
                                ? "bg-success/10 text-success border-success/20"
                                : (session.status === "Completed" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-warning/10 text-warning border-warning/20")
                            )}>
                              {session.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            {(session as any).isRegistered ? (
                              <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                Registered
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-4 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold flex items-center gap-2"
                                  onClick={() => handleViewRegistrants(session)}
                                >
                                  <Users2 className="w-4 h-4" />
                                  Registrants
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-4 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold flex items-center gap-2"
                                  onClick={() => handleEditEvent(session)}
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Button>
                                {['ADMIN', 'SUPERADMIN', 'LEADER', 'COORDINATOR'].includes(role) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-4 rounded-xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 font-bold flex items-center gap-2"
                                    onClick={() => handleToggleAttendance(session.id, session.attendanceOpen ? 'close' : 'enable')}
                                  >
                                    <ClipboardCheck className="w-4 h-4" />
                                    {session.attendanceOpen ? "Close Attendance" : "Mark Attendance"}
                                  </Button>
                                )}
                                <Button
                                  className="h-10 px-6 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] font-black capitalize tracking-tighter text-xs"
                                  onClick={() => handleRegister(session.id)}
                                >
                                  Register Now
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-zinc-600">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No sessions scheduled for this date.</p>
                    <Button variant="link" onClick={() => setDate(undefined)} className="mt-2">
                      View all sessions
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => !open && setIsEditOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event Details</DialogTitle>
            <DialogDescription>Update the schedule or details for this Teacher Development session.</DialogDescription>
          </DialogHeader>

          {editingEvent && (
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={editingEvent.type || editingEvent.topic}
                    onValueChange={(val) => setEditingEvent({ ...editingEvent, type: val, topic: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Assessment">Assessment</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingEvent.status}
                    onValueChange={(val) => setEditingEvent({ ...editingEvent, status: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date (MMM DD)</Label>
                  <Input
                    id="edit-date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Select
                    value={editingEvent.time}
                    onValueChange={(val) => setEditingEvent({ ...editingEvent, time: val })}
                  >
                    <SelectTrigger id="edit-time" className="rounded-xl border-muted-foreground/10 h-10">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                />
              </div>


              {/* Attendance Control Section */}
              {(!editingEvent.entryType || !editingEvent.entryType.toLowerCase().includes('observation')) && 
               (!editingEvent.type || !editingEvent.type.toLowerCase().includes('observation')) && (
                <div className="pt-4 border-t border-muted/20">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/20">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-primary" />
                        Attendance Control
                      </h4>
                      <p className="text-xs text-zinc-600">
                        Enable staff to mark their presence for this session.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[10px] font-black capitalize tracking-tighter transition-colors",
                          (editingEvent.attendanceEnabled && !editingEvent.attendanceClosed) ? "text-primary" : "text-zinc-600"
                        )}>
                          {(editingEvent.attendanceEnabled && !editingEvent.attendanceClosed) ? "Live" : "Disabled"}
                        </span>
                        <Switch
                          checked={editingEvent.attendanceEnabled && !editingEvent.attendanceClosed}
                          onCheckedChange={(checked) => handleToggleAttendance(editingEvent.id, checked ? 'enable' : 'close')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
                  <Trash2 className="mr-2 w-4 h-4" />
                  Delete Event
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Event Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Training Event/Observations</DialogTitle>
            <DialogDescription>Add a new session to the training calendar for your campus.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleEvent} className="space-y-4">
            <div className="space-y-3">
              <Label>Entry Type</Label>
              <RadioGroup
                value={newEvent.entryType}
                onValueChange={(val) => setNewEvent({ ...newEvent, entryType: val, type: val === 'Observation' ? 'Scheduled Observations' : 'Pedagogy' })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Training Event" id="type-event" />
                  <Label htmlFor="type-event" className="cursor-pointer">Training Event</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Observation" id="type-obs" />
                  <Label htmlFor="type-obs" className="cursor-pointer">Observation</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-title">{newEvent.entryType === 'Observation' ? 'Observation Title' : 'Event Title'}</Label>
              <Input
                id="event-title"
                placeholder={newEvent.entryType === 'Observation' ? 'e.g. Peer Observation' : 'Workshop Name'}
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </div>

            {newEvent.entryType === 'Observation' && (
              <div className="space-y-2">
                <Label>Select Teacher</Label>
                <Select
                  value={newEvent.teacherId}
                  onValueChange={(val) => {
                    const teacher = team.find(t => t.id === val);
                    setNewEvent({ ...newEvent, teacherId: val, teacherName: teacher?.name || "" });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a teacher to observe" />
                  </SelectTrigger>
                  <SelectContent>
                    {team.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(val) => setNewEvent({ ...newEvent, type: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {newEvent.entryType === 'Observation' ? (
                      <SelectItem value="Scheduled Observations">Scheduled Observations</SelectItem>
                    ) : (
                      <>
                        <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Assessment">Assessment</SelectItem>
                        <SelectItem value="Culture">Culture</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newEvent.date && "text-zinc-600"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newEvent.date ? formatDateStr(newEvent.date) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newEvent.date}
                      onSelect={(d) => d && setNewEvent({ ...newEvent, date: d })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Select
                value={newEvent.time}
                onValueChange={(val) => setNewEvent({ ...newEvent, time: val })}
              >
                <SelectTrigger id="event-time" className="rounded-xl bg-background border-muted-foreground/10 h-10">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="Room/Lab Name"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
              <Button type="submit">Schedule Event</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{editingEvent?.title}</strong>? This action cannot be undone and will remove it from the calendar for all staff members.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Registrants Dialog */}
      <Dialog open={isRegistrantsOpen} onOpenChange={setIsRegistrantsOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[2rem] overflow-hidden   shadow-2xl p-0">
          <div className="bg-zinc-950 text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Registered Participants
              </h2>
              <p className="text-zinc-400 font-bold text-sm mt-1 capitalize tracking-[0.2em]">
                {editingEvent?.title}
              </p>
            </div>
          </div>
          <div className="p-8 bg-background">
            <div className="rounded-2xl border border-muted/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-black capitalize tracking-widest text-[10px] py-4 text-zinc-900">Participant Name</TableHead>
                    <TableHead className="font-black capitalize tracking-widest text-[10px] py-4 text-zinc-900">Contact Detail</TableHead>
                    <TableHead className="font-black capitalize tracking-widest text-[10px] py-4 text-right text-zinc-900">Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRegistrants.length > 0 ? (
                    selectedRegistrants.map((registrant) => (
                      <TableRow key={registrant.id} className="hover:bg-primary/5 transition-colors group">
                        <TableCell className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-white transition-all">
                              {(registrant.name || "?").split(' ').map((n: string) => n ? n[0] : "").join('')}
                            </div>
                            <span className="font-bold text-foreground">{registrant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-600">{registrant.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-right font-medium text-zinc-600">
                          {registrant.dateRegistered}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-zinc-600">
                          <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center">
                            <Users2 className="w-8 h-8 opacity-20" />
                          </div>
                          <p className="font-bold italic">No registrations for this event yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                className="h-12 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black capitalize tracking-widest text-xs"
                onClick={() => setIsRegistrantsOpen(false)}
              >
                Close View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}

function ProposeCourseView({ setTraining }: { setTraining: React.Dispatch<React.SetStateAction<any[]>> }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    capacity: 20,
    description: "",
    objectives: ""
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.type) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await courseService.createCourse({
        title: formData.title,
        category: formData.type,
        hours: 2, // Default
        instructor: "School Leader",
        status: "PENDING_APPROVAL",
        description: `${formData.description}\n\nProposed Details:\nDate: ${formData.date}\nTime: ${formData.time}\nLocation: ${formData.location}`,
        isDownloadable: false
      });

      // Do NOT update local training state as per requirements
      // setTraining(prev => [...prev, newSession]); 

      toast.success("Course proposal submitted for admin approval!");
      navigate("/leader/calendar");
    } catch (error) {
      console.error("Failed to propose course:", error);
      toast.error("Failed to submit course proposal.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leader/calendar")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propose New Course</h1>
          <p className="text-zinc-600">Submit a Teacher Development session for administrative approval</p>
        </div>
      </div>

      <Card className="shadow-xl bg-card">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Session Details
          </CardTitle>
          <CardDescription>All proposals are reviewed within 48 hours.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Advanced Pedagogy"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Session Type *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Pedagogy", "Technology", "Assessment", "Culture"].map(type => (
                    <div
                      key={type}
                      className={cn(
                        "cursor-pointer rounded-lg border p-2 text-center text-sm font-medium transition-all",
                        formData.type === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setFormData({ ...formData, type })}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })} // Note: In real app, format this to "MMM DD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Select
                  value={formData.time}
                  onValueChange={(val) => setFormData({ ...formData, time: val })}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Proposed Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Conference Room B"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the learning objectives and outcomes..."
                className="min-h-[100px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate("/leader/calendar")}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Proposal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsView({ team, observations }: { team: any[], observations: Observation[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Filter State
  const [selectedRole, setSelectedRole] = useState(searchParams.get("role") || "all");
  const [performanceFilter, setPerformanceFilter] = useState(searchParams.get("perf") || "all");

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (selectedRole !== "all") params.set("role", selectedRole);
    else params.delete("role");

    if (performanceFilter !== "all") params.set("perf", performanceFilter);
    else params.delete("perf");

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedRole, performanceFilter]);

  const roles = Array.from(new Set(team.map(t => t.role)));

  const filteredTeam = team.filter(t => {
    const matchesSearch = (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.role || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || t.role === selectedRole;

    const matchesPerformance = performanceFilter === "all" ||
      (performanceFilter === "high" && t.avgScore >= 4.0) ||
      (performanceFilter === "proficient" && t.avgScore >= 3.0 && t.avgScore < 4.0) ||
      (performanceFilter === "support" && (t.avgScore > 0 && t.avgScore < 3.0));

    return matchesSearch && matchesRole && matchesPerformance;
  });

  const handleEmailReport = (teacher: any) => {
    setSendingId(teacher.id);
    const email = `${teacher.name.toLowerCase().replace(' ', '.')}@school.edu`;

    // Simulate API call
    setTimeout(() => {
      setSendingId(null);
      toast.success(`Performance report has been emailed to ${email}`, {
        description: "The teacher will receive a PDF summary of their observations and PD progress."
      });
    }, 1500);
  };

  const resetFilters = () => {
    setSelectedRole("all");
    setPerformanceFilter("all");
    setSearchQuery("");
  }

  const handleExportReports = () => {
    const headers = ["Name", "Role", "Avg Score", "Training Hours", "Completion Rate", "Last Observed"];
    const rows = filteredTeam.map(t => [
      t.name,
      t.role,
      t.avgScore,
      t.pdHours,
      `${t.completionRate}%`,
      t.lastObserved
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `staff_performance_registry_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Registry exported successfully", { description: "The staff performance data has been downloaded as a CSV file." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Reports"
        subtitle="Generate and share teacher performance summaries"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <StatCard
          title="Reports Generated"
          value={observations.length}
          subtitle="Total observations"
          icon={FileText}
        />
        <StatCard
          title="Pending Reviews"
          value={observations.filter(o => !o.hasReflection).length}
          subtitle="Require reflection"
          icon={Clock}
        />
        <StatCard
          title="Shared Reports"
          value={observations.filter(o => o.status === 'REVIEWED' || o.status === 'PUBLISHED').length}
          subtitle="Sent to teachers"
          icon={Mail}
        />
      </div>

      <Card className="  shadow-xl bg-white">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Staff Reports Registry</CardTitle>
              <CardDescription>Select a teacher to preview or email their comprehensive report.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <AIAnalysisModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                data={team}
                type="admin"
                title="Staff Performance AI Analysis"
              />
              <Button
                onClick={() => setIsAIModalOpen(true)}
                variant="outline"
                className="gap-2 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 font-bold rounded-full px-5"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI Smart Insights
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  placeholder="Search staff..."
                  className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl gap-2 font-bold border-muted-foreground/20" onClick={handleExportReports}>
                <Download className="w-4 h-4" />
                Export CSV
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className={cn("rounded-xl", (selectedRole !== "all" || performanceFilter !== "all") && "border-primary text-primary bg-primary/10")}>
                    <Filter className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filter Reports</h4>
                      <p className="text-sm text-zinc-600">Narrow down the list by role or performance.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {roles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Performance Band</Label>
                      <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Performance Levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Performance Levels</SelectItem>
                          <SelectItem value="high">High Performing (4.0+)</SelectItem>
                          <SelectItem value="proficient">Proficient (3.0-3.9)</SelectItem>
                          <SelectItem value="support">Needs Support (&lt;3.0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={resetFilters} className="text-zinc-600 hover:text-foreground">
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600 w-16">#</th>
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Teacher</th>
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Performance Impact</th>
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">PD Progress</th>
                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Last Updated</th>
                    <th className="text-right p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted-foreground/10">
                  {filteredTeam.length > 0 ? (
                    filteredTeam.map((member, index) => (
                      <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-6 text-sm font-bold text-zinc-600">
                          {index + 1}
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {(member.name || "?").split(' ').map(n => n ? n[0] : "").join('')}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{member.name}</p>
                              <p className="text-xs text-zinc-600">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <Star className={cn("w-4 h-4", member.avgScore >= 4.0 ? "text-yellow-500 fill-yellow-500" : "text-zinc-600")} />
                            <span className="font-bold">{member.avgScore}</span>
                            <span className="text-xs text-zinc-600">/ 5.0</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-1.5 max-w-[140px]">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">{member.pdHours}h</span>
                              <span className="text-zinc-600">{member.completionRate}%</span>
                            </div>
                            <Progress value={member.completionRate} className="h-1.5 [&>div]:bg-success" />
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-sm text-foreground">
                            {member.lastObserved === 'N/A' || member.lastObserved === 'Invalid Date'
                              ? member.lastObserved
                              : `${member.lastObserved}`}
                          </p>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 gap-2"
                              onClick={() => {
                                setSelectedTeacher(member);
                                setIsReportOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="h-9 gap-2 min-w-[100px]"
                              onClick={() => handleEmailReport(member)}
                              disabled={sendingId === member.id}
                            >
                              {sendingId === member.id ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Mail className="w-4 h-4" />
                                  Send Report
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 grayscale opacity-40">
                          <FileText className="w-16 h-16" />
                          <div className="space-y-1">
                            <p className="text-xl font-bold">No reports found</p>
                            <p className="text-zinc-600">Try adjusting your filters</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      {/* Report Preview Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl   shadow-2xl">
          {selectedTeacher && (
            <TeacherAnalyticsReport teacher={selectedTeacher} observations={observations} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeacherGoalsView({ goals }: { goals: Goal[] }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("cat") || "All");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All");
  const [teacherFilter, setTeacherFilter] = useState(searchParams.get("teacher") || "All");
  const [progressFilter, setProgressFilter] = useState(searchParams.get("prog") || "All");

  const [windows, setWindows] = useState<any[]>([]);
  const [showClosedPopup, setShowClosedPopup] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const fetchWindows = async () => {
    try {
      const res = await api.get('/goal-windows');
      if (res.data.status === 'success') {
        const fetchedWindows = res.data.data.windows || [];
        setWindows(fetchedWindows);
        const isGoalSettingOpen = fetchedWindows.find((w: any) => w.phase === 'GOAL_SETTING')?.status === 'OPEN';
        const isGoalCompletionOpen = fetchedWindows.find((w: any) => w.phase === 'GOAL_COMPLETION')?.status === 'OPEN';
        if (!isGoalSettingOpen && !isGoalCompletionOpen) {
          setShowClosedPopup(true);
        } else {
          setShowClosedPopup(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch windows", err);
    }
  };

  useEffect(() => {
    fetchWindows();

    const socket = getSocket();
    socket.on('window:updated', fetchWindows);

    return () => {
      socket.off('window:updated', fetchWindows);
    };
  }, []);

  const handleNotifyAdmin = async () => {
    try {
      setIsNotifying(true);
      await api.post('/goals/request-window-open');
      toast.success("Notification sent to administrators!");
    } catch (err) {
      console.error("Failed to notify admin:", err);
      toast.error("Failed to send notification.");
    } finally {
      setIsNotifying(false);
    }
  };

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (categoryFilter !== "All") params.set("cat", categoryFilter);
    else params.delete("cat");

    if (statusFilter !== "All") params.set("status", statusFilter);
    else params.delete("status");

    if (teacherFilter !== "All") params.set("teacher", teacherFilter);
    else params.delete("teacher");

    if (progressFilter !== "All") params.set("prog", progressFilter);
    else params.delete("prog");

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryFilter, statusFilter, teacherFilter, progressFilter]);

  // Ensure goals is an array and filter out invalid entries to prevent crashes
  const safeGoals = Array.isArray(goals) ? (goals as Goal[]).filter((g): g is Goal & { teacher: string; title: string } => !!(g && typeof g.teacher === 'string' && typeof g.title === 'string')) : [];

  // Get unique teachers, categories, and statuses for filter
  const uniqueTeachers = Array.from(new Set(safeGoals.map(g => g.teacher)));
  const uniqueCategories = Array.from(new Set(safeGoals.map(g => g.category).filter(Boolean)));
  const uniqueStatuses = Array.from(new Set(safeGoals.map(g => g.status).filter(Boolean)));

  // Apply all filters
  const filteredGoals = safeGoals.filter(g => {
    const matchesSearch = g.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || g.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || g.status === statusFilter;
    const matchesTeacher = teacherFilter === "All" || g.teacher === teacherFilter;

    let matchesProgress = true;
    if (progressFilter === "<50%") matchesProgress = g.progress < 50;
    else if (progressFilter === "50-79%") matchesProgress = g.progress >= 50 && g.progress < 80;
    else if (progressFilter === "=80%") matchesProgress = g.progress >= 80;

    return matchesSearch && matchesCategory && matchesStatus && matchesTeacher && matchesProgress;
  });

  // Count active filters
  const activeFilterCount = [categoryFilter, statusFilter, teacherFilter, progressFilter].filter(f => f !== "All").length;

  const clearAllFilters = () => {
    setCategoryFilter("All");
    setStatusFilter("All");
    setTeacherFilter("All");
    setProgressFilter("All");
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Professional Goals"
        subtitle="Manage and track performance targets for your staff"
        actions={
          <Button className="hidden" onClick={() => navigate("/leader/goals/assign")}>
            <Plus className="mr-2 w-4 h-4" />
            Assign New Goal
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <StatCard
          title="Active Goals"
          value={goals.length}
          subtitle="Total in progress"
          icon={Target}
        />
        <StatCard
          title="Pending Reflection"
          value={goals.filter(g => g.status === 'SELF_REFLECTION_PENDING' || g.status === 'IN_PROGRESS' || !g.selfReflectionForm).length}
          subtitle="Awaiting teacher action"
          icon={Clock}
          className="border-l-2 border-warning"
        />
        <StatCard
          title="Pending Goal Setting"
          value={goals.filter(g => g.status === 'SELF_REFLECTION_SUBMITTED').length}
          subtitle="Awaiting HOS action"
          icon={ClipboardList}
          className="border-l-2 border-info"
        />
      </div>

      {/* Window Closed Popup */}
      <Dialog open={showClosedPopup} onOpenChange={setShowClosedPopup}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lock className="w-24 h-24" />
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black mb-2 capitalize tracking-tight">Goal Window Closed</h2>
            <p className="text-amber-50 opacity-90 text-sm leading-relaxed max-w-[300px] mx-auto">
              The goal setting and completion windows are currently closed. Please contact your administrator to open the window.
            </p>
          </div>
          <div className="p-8 bg-white space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-amber-200">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900 leading-tight">Instant Notification</p>
                <p className="text-xs text-amber-700/70 mt-1">Click below to send an automated request to the admin dashboard.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleNotifyAdmin}
                disabled={isNotifying}
                className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-black capitalize tracking-widest text-sm rounded-2xl shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98] group"
              >
                {isNotifying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="mr-2 w-5 h-5 fill-white group-hover:animate-pulse" />
                    Notify Admin to Open
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowClosedPopup(false)}
                className="w-full h-12 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all"
              >
                I'll check later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="  shadow-xl bg-white">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Goal Registry</CardTitle>
              <CardDescription>Comprehensive list of all teacher development targets.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  placeholder="Search goals..."
                  className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-9 px-3 text-xs bg-muted/50 hover:bg-muted font-bold rounded-xl flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600 w-16">#</th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600 min-w-[150px]">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>Teacher</span>
                      <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                        <SelectTrigger className="h-6 w-[24px] p-0 bg-transparent border-none shadow-none hover:bg-muted focus:ring-0">
                          <Filter className="w-3 h-3 text-zinc-600/50" />
                        </SelectTrigger>
                        <SelectContent align="start">
                          <SelectItem value="All" className="text-xs">All Teachers</SelectItem>
                          {uniqueTeachers.map(teacher => (
                            <SelectItem key={teacher} value={teacher} className="text-xs">{teacher}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Email</th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Goal Target</th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600 min-w-[150px]">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>Category</span>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="h-6 w-[24px] p-0 bg-transparent border-none shadow-none hover:bg-muted focus:ring-0">
                          <Filter className="w-3 h-3 text-zinc-600/50" />
                        </SelectTrigger>
                        <SelectContent align="start">
                          <SelectItem value="All" className="text-xs">All Categories</SelectItem>
                          {uniqueCategories.map(cat => (
                            <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600 w-1/4">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>Progress</span>
                      <Select value={progressFilter} onValueChange={setProgressFilter}>
                        <SelectTrigger className="h-6 w-[24px] p-0 bg-transparent border-none shadow-none hover:bg-muted focus:ring-0">
                          <Filter className="w-3 h-3 text-zinc-600/50" />
                        </SelectTrigger>
                        <SelectContent align="start">
                          <SelectItem value="All" className="text-xs">All Levels</SelectItem>
                          <SelectItem value="<50%" className="text-xs">Below 50%</SelectItem>
                          <SelectItem value="50-79%" className="text-xs">50% - 79%</SelectItem>
                          <SelectItem value="=80%" className="text-xs">80% +</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600 min-w-[150px]">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>Status</span>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-6 w-[24px] p-0 bg-transparent border-none shadow-none hover:bg-muted focus:ring-0">
                          <Filter className="w-3 h-3 text-zinc-600/50" />
                        </SelectTrigger>
                        <SelectContent align="start">
                          <SelectItem value="All" className="text-xs">All Statuses</SelectItem>
                          {uniqueStatuses.map(status => (
                            <SelectItem key={status} value={status} className="text-xs">
                              {status.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Due Date</th>
                  <th className="text-right p-6 text-sm font-bold capitalize tracking-wider text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredGoals.map((goal, index) => (
                  <tr key={goal.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6 text-sm font-bold text-zinc-600">
                      {index + 1}
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-foreground">{goal.teacher}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm text-foreground">{goal.teacherEmail || "-"}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold">{goal.title}</p>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary capitalize tracking-wider">
                        {goal.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold capitalize tracking-wider",
                        goal.progress >= 80 ? "bg-success/10 text-success" : goal.progress >= 50 ? "bg-info/10 text-info" : "bg-warning/10 text-warning"
                      )}>
                        {goal.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Clock className="w-4 h-4" />
                        {goal.dueDate && !isNaN(new Date(goal.dueDate).getTime())
                          ? format(new Date(goal.dueDate), "MMM d, yyyy")
                          : goal.dueDate}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 hover:bg-primary/10 hover:text-primary font-bold"
                        onClick={() => setSelectedGoal(goal)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card >

      {selectedGoal && (
        <GoalWorkflowForms
          goal={selectedGoal}
          role="LEADER"
          onComplete={async () => {
            setSelectedGoal(null);
            window.location.reload();
          }}
          onClose={() => setSelectedGoal(null)}
        />
      )
      }
    </div >
  );
}




function AssignGoalView({ setGoals, team, currentDraftGoalId, setCurrentDraftGoalId }: { 
  setGoals: React.Dispatch<React.SetStateAction<any[]>>, 
  team: any[], 
  currentDraftGoalId: string | null, 
  setCurrentDraftGoalId: (id: string | null) => void 
}) {
  const navigate = useNavigate();
  // We don't need to fetch a dynamic template if we are strictly embedding the static form

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leader/goals")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="Assign New Goal"
            subtitle="Set academic year goals for educators"
          />
        </div>
      </div>

      <GoalSettingForm
        teachers={team}
        defaultCoachName="Rohit"
        onCancel={() => navigate("/leader/goals")}
        onAutoSave={async (data) => {
          const targetTeacher = team.find(t => t.name === data.educatorName);
          if (!targetTeacher) return;

          const payload = {
            teacherId: targetTeacher.id,
            teacherEmail: data.teacherEmail || targetTeacher.email,
            title: data.goalForYear,
            description: data.reasonForGoal,
            dueDate: data.goalEndDate,
            category: data.pillarTag,
            status: "DRAFT",
            academicType: data.academicType,
            actionStep: data.actionStep,
            pillar: data.pillarTag,
            campus: data.campus,
            ay: "25-26"
          };

          try {
            if (currentDraftGoalId) {
              await api.patch(`/goals/${currentDraftGoalId}`, payload);
            } else {
              const res = await api.post('/goals', payload);
              if (res.data?.data?.goal?.id) {
                setCurrentDraftGoalId(res.data.data.goal.id);
              }
            }
          } catch (error) {
            console.error("Goal auto-save failed", error);
          }
        }}
        onSubmit={async (data) => {
          const targetTeacher = team.find(t => t.name === data.educatorName);

          if (!targetTeacher) {
            toast.error("Selected teacher not found in team records.");
            return;
          }

          const emailToSave = data.teacherEmail || targetTeacher.email;

          if (!emailToSave) {
            toast.error("Selected teacher is missing an email address.");
            return;
          }

          const newGoal = {
            teacher: data.educatorName,
            teacherEmail: emailToSave,
            title: data.goalForYear,
            category: data.pillarTag,
            progress: 0,
            status: "Assigned",
            dueDate: format(data.goalEndDate, "MMM dd, yyyy"),
            assignedBy: data.coachName,
            description: data.reasonForGoal,
            actionStep: data.actionStep,
            pillar: data.pillarTag,
            campus: data.campus,
            ay: "25-26",
            isSchoolAligned: true,
            assignedDate: new Date().toISOString(),
            reflectionCompleted: true,
          };

          try {
            if (currentDraftGoalId) {
              await api.patch(`/goals/${currentDraftGoalId}`, { ...newGoal, status: "Assigned" });
            } else {
              await api.post('/goals', newGoal);
            }
            toast.success("Goal successfully assigned.");
            setCurrentDraftGoalId(null);
            navigate("/leader/goals");
          } catch (error) {
            console.error(error);
            toast.error("Failed to assign goal");
          }
        }}
      />
    </div>
  );
}

function PlaceholderView({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="p-4 rounded-3xl bg-primary/10 mb-6">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-zinc-600 max-w-md mx-auto mb-8">
        This management module is currently in development.
        It will provide deep insights and powerful tools for school leaders once released.
      </p>
      <Button asChild>
        <Link to="/leader">Return to Overview</Link>
      </Button>
    </div>
  );
}

// MoocResponsesView local definition removed and moved to @/components/mooc/MoocResponsesRegistry
