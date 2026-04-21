// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { Routes, Route, Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "@pdi/lib/api";
import { getSocket } from "@pdi/lib/socket";
import { useAuth } from "@pdi/hooks/useAuth";
import { useAccessControl } from "@pdi/hooks/useAccessControl";
import { DashboardLayout } from "@pdi/components/layout/DashboardLayout";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { StatCard } from "@pdi/components/StatCard";
import { ObservationCard } from "@pdi/components/ObservationCard";
import { GoalCard } from "@pdi/components/GoalCard";
import { TrainingEventCard } from "@pdi/components/TrainingEventCard";
import {
  Clock,
  Eye,
  Target,
  Calendar,
  TrendingUp,
  Book,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Search,
  Play,
  Filter,
  Star,
  Trophy,
  History,
  FileCheck,
  PlusCircle,
  MoreVertical,
  Download,
  Brain,
  Zap,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Flag,
  MessageSquare,
  Users,
  FileText,
  User,
  Share2,
  ExternalLink,
  Plus,
  ChevronLeft,
  Save,
  Mail,
  Phone,
  MapPin,
  Award,
  CheckCircle,
  Printer,
  Rocket,
  History as HistoryIcon,
  Link as LinkIcon,
  Paperclip,
  ClipboardCheck,
  Tag,
  ClipboardList,
  ArrowLeft,
  PenTool,
  Palette,
  Loader2
} from "lucide-react";
import { ScrollToTop } from "@pdi/components/ui/ScrollToTop";
import { GoalWorkflowForms } from "@pdi/components/GoalWorkflowForms";
import { CustomDashboardWrapper } from "@pdi/components/CustomDashboardWrapper";
import { Button } from "@pdi/components/ui/button";
import { AcknowledgementsView } from "@pdi/components/documents/AcknowledgementsView";
import { AIAnalysisModal } from "@pdi/components/AIAnalysisModal";
import { Input } from "@pdi/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Calendar as CalendarUI } from "@pdi/components/ui/calendar";
import { Badge } from "@pdi/components/ui/badge";
import { ScrollArea } from "@pdi/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@pdi/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@pdi/components/ui/dialog";
import { Textarea } from "@pdi/components/ui/textarea";
import { Label } from "@pdi/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pdi/components/ui/tabs";
import { format, parse, isSameDay, isBefore, endOfDay } from "date-fns";
import { cn } from "@pdi/lib/utils";
import { toast } from "sonner";

import { DynamicForm } from "@pdi/components/DynamicForm";
import { trainingService } from "@pdi/services/trainingService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pdi/components/ui/select";
import { CAMPUS_OPTIONS } from "@pdi/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@pdi/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Progress } from "@pdi/components/ui/progress";


import { Observation, DetailedReflection } from "@pdi/types/observation";
import { ReflectionForm } from "@pdi/components/ReflectionForm";
import { MoocEvidenceForm } from "@pdi/components/MoocEvidenceForm";

import { TeacherProfileView } from "@pdi/components/TeacherProfileView";
import { TeacherAssessmentsView } from "@pdi/components/assessments/TeacherAssessmentsView";
import { AssessmentAttemptView } from "@pdi/components/assessments/AssessmentAttemptView";
import AttendanceForm from "@pdi/pages/AttendanceForm";
import { QuickActionButtons } from "@pdi/components/QuickActionButtons";
import { MeetingsDashboard } from './MeetingsDashboard';
import { CreateMeetingForm } from './CreateMeetingForm';
import { MeetingMoMForm } from './MeetingMoMForm';
import TeacherAttendance from "@pdi/pages/TeacherAttendance";
import SurveyPage from "@pdi/pages/SurveyPage";
import { LearningFestivalPage } from './LearningFestival/LearningFestivalPage';
import { FestivalApplicationForm } from './LearningFestival/FestivalApplicationForm';

// Removed local Observation interface in favor of shared type



// Mock data removed in favor of API calls


const DashboardOverview = ({
  goals,
  events,
  observations,
  onRegister,
  onView,
  onReflect,
  userName,
  pdHours,
  role,
  surveyStatus
}: {
  goals: any[],
  events: any[],
  observations: Observation[],
  onRegister: (id: string) => void,
  onView: (id: string) => void,
  onReflect: (obs: Observation) => void,
  userName: string,
  pdHours: any,
  role: string,
  surveyStatus: { active: boolean; completed: boolean; title?: string } | null

}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isModuleEnabled } = useAccessControl();
  const schoolAlignedGoals = goals.filter(g => g.isSchoolAligned).length;
  const reflectionsCount = observations.filter(o => o.hasReflection).length;
  const totalScore = observations.reduce((acc, o) => acc + (o.score || 0), 0);
  const avgScore = observations.length > 0 ? (totalScore / observations.length).toFixed(1) : "0.0";

  const isPastEvent = (dateStr: string) => {
    try {
      const eventDate = parse(dateStr, "MMM d, yyyy", new Date());
      return isBefore(endOfDay(eventDate), new Date());
    } catch (e) {
      return false;
    }
  };

  const futureEvents = events.filter(e => 
    !isPastEvent(e.date) && 
    (!e.entryType || !e.entryType.toLowerCase().includes('observation')) &&
    (!e.type || !e.type.toLowerCase().includes('observation'))
  ).sort((a, b) => {
    try {
      return parse(a.date, "MMM d, yyyy", new Date()).getTime() - parse(b.date, "MMM d, yyyy", new Date()).getTime();
    } catch (e) {
      return 0;
    }
  });
  const upcomingTrainings = futureEvents.filter(e => !e.isRegistered).length;
  const nextEvent = futureEvents[0];
  const nextEventSubtitle = nextEvent ? `Next: ${nextEvent.date}` : "No sessions found";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="relative overflow-hidden border border-white/10 bg-backgroundackgroundlack p-6 md:p-10 mb-8 shadow-2xl industrial-grid">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-[#ff0055]/5 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-foreground/80 uppercase mr-1">Teacher Platform</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-backgroundmerald-500/20 border border-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-backgroundmerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">Live Sync Active</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">{(userName || "Educator").split(' ')[0]}!</span>
            </h1>
            <p className="text-zinc-100 text-lg font-bold max-w-xl leading-relaxed">
              Your professional journey starts here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <QuickActionButtons role={role as any} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {isModuleEnabled('/teacher/observations', role) && (
          <StatCard
            title="Observations"
            value={observations.length}
            subtitle={`${reflectionsCount} Reflected • Avg ${avgScore}`}
            icon={TrendingUp}
            onClick={() => navigate("/teacher/observations")}
          />
        )}
        {isModuleEnabled('/teacher/goals', role) && (
          <StatCard
            title="Active Goals"
            value={goals.length}
            subtitle={`${schoolAlignedGoals} School-Aligned`}
            icon={Target}
            onClick={() => navigate("/teacher/goals")}
          />
        )}
        {isModuleEnabled('/teacher/hours', role) && (
          <StatCard
            title="Training Hours"
            value={pdHours.total}
            subtitle="Current Academic Year"
            icon={Clock}
            trend={pdHours.total > 0 ? { value: 12, isPositive: true } : undefined}
            onClick={() => navigate("/teacher/hours")}
          />
        )}
        {isModuleEnabled('/teacher/calendar', role) && upcomingTrainings > 0 && (
          <StatCard
            title="Upcoming Training"
            value={upcomingTrainings}
            subtitle={nextEventSubtitle}
            icon={Calendar}
            onClick={() => navigate("/teacher/calendar")}
          />
        )}
      </div>

      {/* PD Progress Widget */}
      <Card className="relative overflow-hidden border border-white/10 shadow-2xl rounded-none bg-[#050505] text-foreground mb-10 group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00f0ff]/5 rounded-full blur-[80px]" />

        <CardContent className="p-8 md:p-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:rotate-6 transition-transform">
                <Trophy className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Annual Development Target</h3>
                <div className="flex items-center gap-2 text-indigo-100/80 font-bold text-sm tracking-wider">
                  <Zap className="w-4 h-4 fill-current" />
                  20-Hour Mandatory Requirement
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="text-5xl font-black flex items-baseline gap-2">
                    {pdHours.total}
                    <span className="text-xl font-medium opacity-60 italic">/ 20 hrs</span>
                  </div>
                </div>
                <Badge className="bg-white/20 hover:bg-white/30 text-foreground border-none py-1.5 px-4 rounded-xl backdrop-blur-md font-black text-sm tracking-widest animate-pulse">
                  {Math.max(0, 20 - pdHours.total)} hrs to go
                </Badge>
              </div>
              <div className="relative h-2 w-full bg-white/5 border border-white/10 shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00f0ff] to-[#ff0055] transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, (pdHours.total / 20) * 100)}%` }}
                />
              </div>
            </div>

            <Button
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-black px-10 h-14 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 group/btn"
              onClick={() => navigate("/teacher/calendar")}
            >
              {pdHours.total >= 20 ? "Browse Trainings" : pdHours.total > 0 ? "Continue Training" : "Start Training"}
              <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {isModuleEnabled('/teacher/observations', role) && (
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 rounded-full bg-primary shadow-[0_0_15px_rgba(234,16,74,0.3)]"></div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Recent Observations</h2>
              </div>
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5 text-primary font-bold">
                <Link to="/departments/pd/teacher/observations">
                  View All
                  <TrendingUp className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {observations.length > 0 ? (
                observations.slice(0, 3).map((obs) => (
                  <ObservationCard
                    key={obs.id}
                    observation={{
                      ...obs,
                      domain: (obs as any).moduleType ? String((obs as any).moduleType).replace('_', ' ') : obs.domain
                    }}
                    onView={() => onView(obs.id)}
                    onReflect={() => onReflect(obs)}
                  />
                ))
              ) : (
                <Card className="bg-backgroundackgroundlack/40 border border-white/5 p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-none">
                  <div className="w-16 h-16 rounded-none bg-white/5 flex items-center justify-center border border-white/10">
                    <Eye className="w-8 h-8 text-foreground/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground uppercase tracking-tighter">No observations yet</p>
                    <p className="text-[10px] text-foreground/40 font-mono tracking-widest uppercase max-w-[280px] mx-auto">
                      Wait for leader verification.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {isModuleEnabled('/teacher/goals', role) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 rounded-none bg-[#fff600] shadow-[0_0_15px_rgba(255,246,0,0.3)]"></div>
                <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">My Goals</h2>
              </div>
              <Button variant="ghost" size="sm" asChild className="hover:bg-white/5 text-[#fff600] font-mono text-[10px] uppercase tracking-widest">
                <Link to="/departments/pd/teacher/goals">View All</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))
              ) : (
                <Card className="bg-backgroundackgroundlack/40 border border-white/5 p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-none">
                  <div className="w-16 h-16 rounded-none bg-white/5 flex items-center justify-center border border-white/10">
                    <Target className="w-8 h-8 text-foreground/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground uppercase tracking-tighter">No goals set yet</p>
                    <p className="text-[10px] text-foreground/40 font-mono tracking-widest uppercase max-w-[280px] mx-auto">
                      Coordinate with school leadership.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {isModuleEnabled('/teacher/calendar', role) && futureEvents.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-none bg-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]"></div>
              <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">Upcoming Training</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/5 text-[#00f0ff] font-mono text-[10px] uppercase tracking-widest">
              <Link to="/departments/pd/teacher/calendar">View Calendar</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureEvents.slice(0, 3).map((event) => (
              <TrainingEventCard
                key={event.id}
                event={event}
                onRegister={() => onRegister(event.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

}


function ObservationsView({
  observations,
  events = [],
  onReflect,
  onView
}: {
  observations: Observation[],
  events?: any[],
  onReflect: (obs: Observation) => void,
  onView: (id: string) => void
}) {
  const { user } = useAuth();
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [learningAreaFilter, setLearningAreaFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(false);

  const domains = Array.from(new Set(observations.map(o => String((o as any).moduleType || o.domain)).filter(Boolean)));

  const isPastEvent = (dateStr: string) => {
    try {
      // Handles "MMM d, yyyy"
      const eventDate = parse(dateStr, "MMM d, yyyy", new Date());
      return isBefore(endOfDay(eventDate), new Date());
    } catch (e) {
      return false;
    }
  };

  const upcomingObservations = useMemo(() => {
    return events.filter(e => {
      // Match sessions where entryType OR type indicates this is an observation
      const isObservationType =
        (e.entryType && e.entryType.toLowerCase() === 'observation') ||
        (e.type && (e.type.toLowerCase() === 'observation' || e.type.toLowerCase() === 'scheduled observations'));
      if (!isObservationType) return false;
      if (isPastEvent(e.date)) return false;
      // Show if the event is for this teacher specifically, or if no teacher is assigned
      if (e.teacherId && user?.id && e.teacherId !== user.id) return false;
      return true;
    }).sort((a, b) => {
      try {
        return parse(a.date, "MMM d, yyyy", new Date()).getTime() - parse(b.date, "MMM d, yyyy", new Date()).getTime();
      } catch (e) {
        return 0;
      }
    });
  }, [events, user?.id]);

  const filteredObservations = observations.filter(obs => {
    const matchesModule = moduleFilter === "all" || String((obs as any).moduleType || obs.domain) === moduleFilter;
    const matchesYear = yearFilter === "all" || (obs as any).academicYear === yearFilter;
    const matchesRating = ratingFilter === "all" ||
      (ratingFilter === "highly-effective" && (obs.score || 0) >= 3.5) ||
      (ratingFilter === "effective" && (obs.score || 0) >= 2.5 && (obs.score || 0) < 3.5) ||
      (ratingFilter === "developing" && (obs.score || 0) >= 1.5 && (obs.score || 0) < 2.5) ||
      (ratingFilter === "basic" && (obs.score || 0) < 1.5);

    // Fallbacks if data doesn't perfectly match fields
    const matchesType = filterType === "all" ||
      (filterType === "quick" && (
        obs.type === "Quick Feedback" ||
        obs.domain === "Quick Feedback" ||
        (obs as any).moduleType === "QUICK_FEEDBACK" ||
        obs.domain === "QUICK_FEEDBACK" ||
        (obs as any).status === "Pending Quick Feedback" ||
        (obs as any).feedbackType === "quick"
      ));

    const isReflected = obs.isReflected || (obs as any).status === "Completed" || (obs as any).status === "Reflected";
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "pending" && !isReflected) ||
      (statusFilter === "reflected" && isReflected);

    const matchesLearningArea = learningAreaFilter === "all" || 
      (obs.learningArea || (obs as any).subject || "General") === learningAreaFilter;

    const matchesSearch = !searchQuery ||
      (obs.learningArea || (obs as any).subject || obs.domain || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (obs.observerName || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesYear && matchesRating && matchesType && matchesStatus && matchesSearch && matchesLearningArea;
  });

  const modules = Array.from(new Set(observations.map(o => (o as any).moduleType).filter(Boolean)));
  const years = Array.from(new Set(observations.map(o => (o as any).academicYear).filter(Boolean)));
  const focusAreas = Array.from(new Set(observations.map(o => o.learningArea || (o as any).subject || "General").filter(Boolean)));

  const chartData = useMemo(() => {
    return observations
      .filter(obs => obs.score !== undefined && obs.score !== null && obs.type !== 'Quick Feedback' && obs.domain !== 'Quick Feedback' && (obs as any).moduleType !== 'QUICK_FEEDBACK')
      .sort((a, b) => {
        try {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        } catch (e) {
          return 0;
        }
      })
      .map(obs => ({
        date: obs.date,
        score: obs.score,
        domain: String((obs as any).moduleType || obs.domain).replace('_', ' ')
      }));
  }, [observations]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Observation" subtitle="Manage and reflect on your classroom observations" />
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-900" />
            <Input
              placeholder="Search Subject/Observer..."
              className="pl-9 h-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant={showUpcoming ? "default" : "outline"}
            size="sm"
            className="h-10 gap-2 rounded-xl"
            onClick={() => setShowUpcoming(prev => !prev)}
          >
            <Calendar className="w-4 h-4" />
            Upcoming Observation
            {upcomingObservations.length > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {upcomingObservations.length}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-2 rounded-xl">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Module Type</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setModuleFilter("all")} className={moduleFilter === "all" ? "bg-muted" : ""}>All Modules</DropdownMenuItem>
              {modules.map(m => (
                <DropdownMenuItem key={String(m)} onClick={() => setModuleFilter(m as string)} className={moduleFilter === m ? "bg-muted" : ""}>
                  {String(m).replace('_', ' ')}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Academic Year</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setYearFilter("all")} className={yearFilter === "all" ? "bg-muted" : ""}>All Years</DropdownMenuItem>
              {years.map(y => (
                <DropdownMenuItem key={String(y)} onClick={() => setYearFilter(y as string)} className={yearFilter === y ? "bg-muted" : ""}>
                  {String(y)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Rating</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setRatingFilter("all")} className={ratingFilter === "all" ? "bg-muted" : ""}>Any Rating</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRatingFilter("highly-effective")} className={ratingFilter === "highly-effective" ? "bg-muted" : ""}>Highly Effective (3.5+)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRatingFilter("effective")} className={ratingFilter === "effective" ? "bg-muted" : ""}>Effective (2.5 - 3.4)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRatingFilter("developing")} className={ratingFilter === "developing" ? "bg-muted" : ""}>Developing (1.5 - 2.4)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRatingFilter("basic")} className={ratingFilter === "basic" ? "bg-muted" : ""}>Basic (&lt; 1.5)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(showUpcoming || upcomingObservations.length > 0) && (
        <Card className="shadow-xl bg-backgroundackgroundackground/50 backdrop-blur-sm overflow-hidden mb-8">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Upcoming Scheduled Observations</CardTitle>
                <CardDescription>Scheduled check-ins from school leadership.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] w-[60px] text-center text-zinc-900">S.No.</TableHead>
                  <TableHead className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] text-zinc-900">Observation Title</TableHead>
                  <TableHead className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] text-zinc-900">Type</TableHead>
                  <TableHead className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] text-zinc-900">Date</TableHead>
                  <TableHead className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] text-zinc-900">Time</TableHead>
                  <TableHead className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] text-zinc-900">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-muted-foreground/10">
                {upcomingObservations.length > 0 ? upcomingObservations.map((obs, index) => (
                  <TableRow key={obs.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="font-medium text-slate-500 text-center">{index + 1}</TableCell>
                    <TableCell className="p-6">
                      <p className="font-bold text-foreground">{obs.title}</p>
                    </TableCell>
                    <TableCell className="p-6">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-wider">
                        Observation
                      </Badge>
                    </TableCell>
                    <TableCell className="p-6">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-zinc-900" />
                        {obs.date}
                      </div>
                    </TableCell>
                    <TableCell className="p-6">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-zinc-900" />
                        {obs.time}
                      </div>
                    </TableCell>
                    <TableCell className="p-6">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-primary" />
                        {obs.location}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2 text-zinc-900">
                        <Calendar className="w-8 h-8 opacity-30" />
                        <p className="text-sm font-medium">No upcoming observations scheduled</p>
                        <p className="text-xs opacity-70">Check back later or contact your school leader.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {chartData.length > 0 && (
        <Card className="border-none shadow-xl bg-white overflow-hidden mb-8">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Observation Score Progression</CardTitle>
                <CardDescription>Visualizing your scores across formal observations over time.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2 px-6">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      try {
                        const d = new Date(value);
                        return format(d, 'MMM d');
                      } catch (e) {
                        return value;
                      }
                    }}
                    tick={{ fontSize: 12, fill: '#888888' }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 5]}
                    tickCount={6}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#888888' }}
                    dx={-10}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                    itemStyle={{ color: '#EA104A', fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#EA104A"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#EA104A', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}



      <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2rem]">
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80 border-b border-zinc-100">
                <TableHead className="w-16 p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">#</TableHead>
                <TableHead className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Date & Session</TableHead>
                <TableHead className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>Focus Area</span>
                    <select
                      className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                      value={learningAreaFilter}
                      onChange={(e) => setLearningAreaFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      {focusAreas.map(f => (
                        <option key={String(f)} value={String(f)}>{String(f)}</option>
                      ))}
                    </select>
                  </div>
                </TableHead>
                <TableHead className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>Performance</span>
                    <select
                      className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      <option value="highly-effective">Highly Eff</option>
                      <option value="effective">Effective</option>
                      <option value="developing">Developing</option>
                      <option value="basic">Basic</option>
                    </select>
                  </div>
                </TableHead>
                <TableHead className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Observer</TableHead>
                <TableHead className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 text-center">Score</TableHead>
                <TableHead className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-100">
              {filteredObservations.map((obs, index) => (
                <TableRow key={obs.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="p-6 text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900">{obs.date}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">Recorded</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 group-hover:text-primary transition-colors">
                        {obs.learningArea || (obs as any).subject || "General"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        {obs.observerName || "Leader"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-200 font-bold text-[10px] uppercase tracking-wider">
                        {String((obs as any).moduleType || obs.domain).replace('_', ' ')}
                      </Badge>
                      {(obs.type === "Quick Feedback" || obs.domain === "Quick Feedback" || (obs as any).moduleType === "QUICK_FEEDBACK" || obs.domain === "QUICK_FEEDBACK") && (
                        <Badge className="bg-indigo-500 text-foreground border-none font-bold text-[10px] uppercase tracking-wider gap-1">
                          <Zap className="w-3 h-3 fill-current" />
                          Quick
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-6 max-w-[250px]">
                    {(obs.type === "Quick Feedback" || obs.domain === "Quick Feedback" || (obs as any).moduleType === "QUICK_FEEDBACK" || obs.domain === "QUICK_FEEDBACK") ? (
                      <p className="text-xs text-muted-foreground font-medium italic">NA</p>
                    ) : (
                      <p className="text-xs text-zinc-500 line-clamp-2 italic leading-relaxed">
                        "{obs.notes || "No summary notes provided."}"
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="p-6 text-center">
                    {(obs.type === "Quick Feedback" || obs.domain === "Quick Feedback" || (obs as any).moduleType === "QUICK_FEEDBACK" || obs.domain === "QUICK_FEEDBACK") ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-muted-foreground font-black text-xs border border-zinc-200 shadow-sm">
                        NA
                      </div>
                    ) : obs.score !== undefined ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-backgroundmerald-50 text-emerald-700 font-black text-xs border border-emerald-100 shadow-sm">
                        {obs.score}
                      </div>
                    ) : (
                      <span className="text-zinc-300">--</span>
                    )}
                  </TableCell>
                  <TableCell className="p-6">
                    {obs.hasReflection ? (
                      <Badge className="bg-backgroundmerald-50 text-emerald-700 border-emerald-100 text-[10px] font-black uppercase tracking-widest gap-1 border h-6">
                        <CheckCircle2 className="w-3 h-3" />
                        Reflected
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] font-black uppercase tracking-widest border h-6">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-primary">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-xl"
                        onClick={() => onView(obs.id)}
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!obs.hasReflection && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-xl"
                          onClick={() => onReflect(obs)}
                          title="Add Comment"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredObservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 grayscale opacity-40">
                      <Eye className="w-16 h-16" />
                      <div className="space-y-1">
                        <p className="text-xl font-bold text-zinc-300">No observations found</p>
                        <p className="text-zinc-900 font-bold text-sm">Try adjusting your filters or search query</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div >
  );
}

function GoalsView({ goals, fetchGoals, userName, role }: { goals: any[], fetchGoals: () => void, userName: string, role?: any }) {
  const [selectedReflectGoal, setSelectedReflectGoal] = useState<any>(null);
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [windows, setWindows] = useState<any[]>([]);
  const [isInitiating, setIsInitiating] = useState(false);
  const [showClosedPopup, setShowClosedPopup] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const fetchWindows = async () => {
    try {
      const res = await api.get('/goal-windows');
      if (res.data.status === 'success') {
        const fetchedWindows = res.data.data.windows;
        setWindows(fetchedWindows);
        const isReflectionOpen = fetchedWindows.find((w: any) => w.phase === 'SELF_REFLECTION')?.status === 'OPEN';
        const isGoalReviewOpen = fetchedWindows.find((w: any) => w.phase === 'GOAL_REVIEW')?.status === 'OPEN';

        if (!isReflectionOpen && !isGoalReviewOpen) {
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

  const isReflectionWindowOpen = windows.find(w => w.phase === 'SELF_REFLECTION')?.status === 'OPEN';

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

  const currentYear = new Date().getFullYear();

  const hasExistingReflection = goals.some(g =>

    g.title?.includes("Annual Professional Growth Reflection " + currentYear)

  );



  const handleInitiateReflection = async () => {

    try {

      setIsInitiating(true);

      const res = await api.post('/goals/initiate-self-reflection');

      if (res.data.status === 'success') {

        toast.success("Reflection process initiated!");

        fetchGoals();

        setSelectedReflectGoal(res.data.data.goal);

      }

    } catch (err) {

      toast.error("Failed to initiate reflection.");

    } finally {

      setIsInitiating(false);

    }

  };



  const filteredGoals = goals.filter(goal => {

    const matchesFilter =

      filter === "all" ? true :

        filter === "school" ? goal.isSchoolAligned :

          filter === "professional" ? !goal.isSchoolAligned :

            filter === "completed" ? goal.progress === 100 :

              filter === "in-progress" ? (goal.progress || 0) < 100 : true;



    const matchesSearch = !searchQuery ||

      (goal.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||

      (goal.description || "").toLowerCase().includes(searchQuery.toLowerCase());



    return matchesFilter && matchesSearch;

  });



  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return format(date, "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };



  return (

    <div className="space-y-6">

      {selectedReflectGoal && (

        <GoalWorkflowForms
          goal={selectedReflectGoal}
          role={role === 'LEADER' ? 'LEADER' : role === 'ADMIN' ? 'ADMIN' : 'TEACHER'}
          onComplete={() => { setSelectedReflectGoal(null); fetchGoals(); }}
          onClose={() => { setSelectedReflectGoal(null); fetchGoals(); }}
        />

      )}



      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <PageHeader title="Professional Goals" subtitle="Track your growth and align with school priorities" />

        <div className="flex flex-wrap gap-2">

          <div className="relative w-full md:w-64">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-900" />

            <Input

              placeholder="Search goals..."

              className="pl-9 h-10 rounded-xl"

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

            />

          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-2 rounded-xl">
                <Filter className="w-4 h-4" />
                {filter === "all" ? "All Goals" :
                  filter === "school" ? "School Priorities" :
                    filter === "professional" ? "Professional Practice" :
                      filter === "completed" ? "Completed" : "In Progress"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Goals</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilter("all")} className={filter === "all" ? "bg-muted" : ""}>All Goals</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("school")} className={filter === "school" ? "bg-muted" : ""}>School Priorities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("professional")} className={filter === "professional" ? "bg-muted" : ""}>Professional Practice</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("completed")} className={filter === "completed" ? "bg-muted" : ""}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("in-progress")} className={filter === "in-progress" ? "bg-muted" : ""}>In Progress</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isReflectionWindowOpen && !hasExistingReflection && (
            <Button size="sm" className="h-10 gap-2 rounded-xl bg-backgroundmerald-600 hover:bg-backgroundmerald-700 text-foreground" onClick={handleInitiateReflection} disabled={isInitiating}>
              {isInitiating ? "Initiating..." : "Start Annual Reflection"}
            </Button>
          )}

          <Dialog open={showClosedPopup} onOpenChange={setShowClosedPopup}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Goal Window Closed</DialogTitle>
                <DialogDescription className="pt-2 text-base text-zinc-600">
                  Goal window is closed. Ask your administrator to open the goal self-reflection window or click notify below.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowClosedPopup(false)}>Got it</Button>
                <Button
                  className="bg-primary text-foreground"
                  onClick={handleNotifyAdmin}
                  disabled={isNotifying}
                >
                  {isNotifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Notifying...
                    </>
                  ) : 'Notify Admin'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

      </div>



      <Card className="border-none shadow-xl bg-white overflow-hidden">

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">

                <TableHead className="w-12 p-6 text-xs font-bold uppercase tracking-wider text-zinc-900">#</TableHead>

                <TableHead className="p-6 text-xs font-bold uppercase tracking-wider text-zinc-900">
                  <div className="flex items-center gap-2">
                    <span>Goal</span>
                    <input 
                      type="text"
                      className="text-[10px] font-bold border border-zinc-200 rounded-md px-2 py-0.5 bg-white text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary w-20 normal-case tracking-normal"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </TableHead>

                <TableHead className="p-6 text-xs font-bold uppercase tracking-wider text-zinc-900">
                  <div className="flex items-center gap-1.5">
                    <span>Track</span>
                    <select
                      className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      <option value="school">Core Track</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                </TableHead>

                <TableHead className="p-6 text-xs font-bold uppercase tracking-wider text-zinc-900">Progress</TableHead>

                <TableHead className="p-6 text-xs font-bold uppercase tracking-wider text-zinc-900">Due Date</TableHead>

                <TableHead className="p-6 text-xs font-bold uppercase tracking-wider text-zinc-900">
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <select
                      className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      value={filter === 'completed' || filter === 'in-progress' ? filter : 'all'}
                      onChange={(e) => setFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                </TableHead>

                <TableHead className="p-6 text-xs font-bold uppercase tracking-wider text-zinc-900 text-right">Actions</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody className="divide-y divide-zinc-100">

              {filteredGoals.map((goal, index) => (

                <TableRow key={goal.id} className="hover:bg-primary/5 transition-colors group">

                  <TableCell className="p-6 text-xs font-bold text-muted-foreground">{index + 1}</TableCell>

                  <TableCell className="p-6 max-w-[280px]">

                    <div className="flex flex-col gap-0.5">

                      <span className="font-bold text-zinc-900 group-hover:text-primary transition-colors text-sm leading-snug">

                        {goal.title}

                      </span>

                      {goal.description && (

                        <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{goal.description}</span>

                      )}

                    </div>

                  </TableCell>

                  <TableCell className="p-6">

                    <Badge variant="outline" className={goal.isSchoolAligned

                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold text-[10px] uppercase tracking-wider"

                      : "bg-zinc-50 text-zinc-600 border-zinc-200 font-bold text-[10px] uppercase tracking-wider"}>

                      {goal.isSchoolAligned ? "Core Track" : "Professional"}

                    </Badge>

                  </TableCell>

                  <TableCell className="p-6 w-40">

                    <div className="flex flex-col gap-1">

                      <span className="text-xs text-zinc-500 font-medium">{goal.progress || 0}%</span>

                      <Progress value={goal.progress || 0} className="h-1.5" />

                    </div>

                  </TableCell>

                  <TableCell className="p-6">

                    <span className="text-sm font-medium text-zinc-700">

                      {formatDate(goal.dueDate || goal.endDate)}

                    </span>

                  </TableCell>

                  <TableCell className="p-6">

                    {(goal.progress || 0) >= 100 ? (

                      <Badge className="bg-backgroundmerald-50 text-emerald-700 border-emerald-100 text-[10px] font-black uppercase tracking-widest gap-1 border h-6">

                        <CheckCircle2 className="w-3 h-3" />

                        Completed

                      </Badge>

                    ) : (

                      <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] font-black uppercase tracking-widest border h-6">

                        In Progress

                      </Badge>

                    )}

                  </TableCell>

                  <TableCell className="p-6 text-right">

                    <div className="flex items-center justify-end gap-2">

                      <Button

                        variant="ghost"

                        size="sm"

                        className="h-8 px-3 hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold"

                        onClick={() => setSelectedReflectGoal(goal)}

                      >

                        {goal.selfReflection ? "View Reflection" : "Reflect"}

                      </Button>

                    </div>

                  </TableCell>

                </TableRow>

              ))}

              {filteredGoals.length === 0 && (

                <TableRow>

                  <TableCell colSpan={7} className="p-20 text-center">

                    <div className="flex flex-col items-center justify-center space-y-4 grayscale opacity-40">

                      <Target className="w-16 h-16" />

                      <div className="space-y-1">

                        <p className="text-xl font-bold text-zinc-300">No goals found</p>

                        <p className="text-zinc-900 font-bold text-sm">Try adjusting your filters or search query</p>

                      </div>

                    </div>

                  </TableCell>

                </TableRow>

              )}

            </TableBody>

          </Table>

        </div>

      </Card>

    </div>

  );

}

function CalendarView({
  events,
  onRegister
}: {
  events: any[],
  onRegister: (id: string) => void
}) {
  const [date, setDate] = useState<Date | undefined>(new Date()); // Set a default date to today
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | "all">("all");
  const [selectedCampus, setSelectedCampus] = useState<string | "all">("all");

  const parseEventDate = (dateStr: string) => {
    try {
      return parse(dateStr, "MMM d, yyyy", new Date());
    } catch (e) {
      return new Date();
    }
  };

  const eventTypes = Array.from(new Set(events.map(e => e.topic || e.type).filter(Boolean)));
  const eventCampuses = Array.from(new Set(events.map(e => e.schoolId || e.campusId || e.location).filter(Boolean)));
  const filteredEvents = events.filter(e => {
    // Exclude observations from sessions list
    const isObservation = 
        (e.entryType && e.entryType.toLowerCase().includes('observation')) || 
        (e.type && e.type.toLowerCase().includes('observation'));
    
    if (isObservation) return false;

    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.topic || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || (e.topic || e.type) === selectedType;
    const matchesCampus = selectedCampus === "all" || (e.schoolId || e.campusId || e.location) === selectedCampus;

    if (!date) return matchesSearch && matchesType && matchesCampus;

    const eventDate = parseEventDate(e.date);
    return isSameDay(eventDate, date) && matchesSearch && matchesType && matchesCampus;
  });

  const formatDateStr = (d: Date | string) => {
    if (typeof d === 'string') return d;
    return format(d, "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Calendar"
        subtitle="Discover and register for Teacher Development sessions"
      />

      <div className="w-full space-y-6">
        <Card className="  shadow-2xl bg-zinc-950 text-foreground overflow-hidden relative">
          {/* decorative gradient blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-info/20 rounded-full blur-3xl translate-y-10 -translate-x-10 pointer-events-none" />

          <CardContent className="p-6 md:p-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left side: Header and Calendar */}
              <div className="lg:col-span-7 space-y-6">
                <div className="text-left w-full">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                    Activity Summary
                  </h3>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
                    {formatDateStr(new Date())}
                  </p>
                </div>

                <CalendarUI
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-2xl border-none bg-backgroundackgroundackground/50 p-6 w-full"
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4 w-full",
                    caption: "flex justify-center pt-1 relative items-center mb-6",
                    caption_label: "text-base font-bold text-foreground",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 text-muted-foreground hover:text-foreground border-zinc-700 hover:bg-card",
                    nav_button_previous: "absolute left-2",
                    nav_button_next: "absolute right-2",
                    table: "w-full border-collapse",
                    head_row: "flex w-full mt-2",
                    head_cell: "text-muted-foreground rounded-md w-10 font-bold text-[0.85rem] uppercase tracking-wider flex items-center justify-center",
                    row: "flex w-full mt-3",
                    cell: "h-10 w-10 text-center text-base p-0 relative [&:has([aria-selected])]:bg-card first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-semibold aria-selected:opacity-100 text-foreground hover:bg-card rounded-full transition-all flex items-center justify-center",
                    day_selected: "bg-primary text-foreground hover:bg-primary/90 focus:bg-primary shadow-lg shadow-primary/30",
                    day_today: "bg-card text-foreground font-black ring-2 ring-zinc-700",
                    day_outside: "text-zinc-500 opacity-40",
                  }}
                  modifiers={{
                    hasEvent: events.map(e => parseEventDate(e.date))
                  }}
                  modifiersStyles={{
                    hasEvent: { border: '2px solid hsl(var(--primary))', color: 'white' }
                  }}
                />
              </div>

              {/* Right side: Legend and Actions */}
              <div className="lg:col-span-5 h-full flex flex-col justify-center pt-10">
                <div className="space-y-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Legend</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <span className="flex items-center gap-3 text-sm text-zinc-300">
                        <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.6)]"></span> Pedagogy
                      </span>
                      <span className="font-mono text-foreground text-sm bg-primary/20 px-2 py-0.5 rounded-md">
                        {events.filter((t: any) => (t.topic || t.type) === 'Pedagogy').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-info/5 border border-info/10">
                      <span className="flex items-center gap-3 text-sm text-zinc-300">
                        <span className="w-3 h-3 rounded-full bg-info shadow-[0_0_10px_rgba(var(--info),0.6)]"></span> Technology
                      </span>
                      <span className="font-mono text-foreground text-sm bg-info/20 px-2 py-0.5 rounded-md">
                        {events.filter((t: any) => (t.topic || t.type) === 'Technology').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <span className="flex items-center gap-3 text-sm text-zinc-300">
                        <span className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--accent),0.6)]"></span> Culture
                      </span>
                      <span className="font-mono text-foreground text-sm bg-accent/20 px-2 py-0.5 rounded-md">
                        {events.filter((t: any) => (t.topic || t.type) === 'Culture').length}
                      </span>
                    </div>
                  </div>

                  <div className="pt-8 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="bg-backgroundackgroundackground border-zinc-800 text-foreground rounded-xl focus:ring-primary h-12">
                          <SelectValue placeholder="Topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Topics</SelectItem>
                          {eventTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="bg-backgroundackgroundackground border-zinc-800 text-foreground rounded-xl focus:ring-primary h-12">
                          <SelectValue placeholder="Campus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Campuses</SelectItem>
                          <SelectItem value="EBTM">BTM Layout</SelectItem>
                          <SelectItem value="EJPN">JP Nagar</SelectItem>
                          <SelectItem value="EITPL">ITPL</SelectItem>
                          <SelectItem value="ENICE">NICE Road</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <Input
                        placeholder="Search sessions..."
                        className="pl-10 bg-backgroundackgroundackground border-zinc-800 text-foreground rounded-xl focus:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full py-6 bg-backgroundackgroundackground border-zinc-800 text-muted-foreground hover:bg-card hover:text-foreground transition-all text-base rounded-xl"
                      onClick={() => {
                        setDate(undefined);
                        setSelectedType("all");
                        setSelectedCampus("all");
                        setSearchQuery("");
                      }}
                      disabled={!date && selectedType === "all" && selectedCampus === "all" && searchQuery === ""}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-10">
        <Card className="border-none shadow-2xl bg-white rounded-[2rem] overflow-hidden border border-muted/20">
          <CardHeader className="px-8 py-8 border-b bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-2xl font-black text-foreground tracking-tight">
                  {date ? `Sessions for ${formatDateStr(date)}` : "Upcoming Training Sessions"}
                </CardTitle>
                <p className="text-sm font-medium text-zinc-900 mt-1">
                  {filteredEvents.length} session{filteredEvents.length !== 1 && 's'} identified for this period
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filter Sessions
                      {(selectedType !== "all" || selectedCampus !== "all") && (
                        <span className="ml-1 w-2 h-2 rounded-full bg-primary" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 overflow-y-auto max-h-[70vh]">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">By Type</span>
                      {selectedType !== "all" && (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px]" onClick={(e) => { e.stopPropagation(); setSelectedType("all"); }}>Clear</Button>
                      )}
                    </div>
                    <DropdownMenuItem onClick={() => setSelectedType("all")} className={selectedType === "all" ? "bg-muted" : ""}>
                      All Types
                    </DropdownMenuItem>
                    {eventTypes.map(type => (
                      <DropdownMenuItem key={`type - ${type} `} onClick={() => setSelectedType(type as string)} className={selectedType === type ? "bg-muted" : ""}>
                        {type as string}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">By Campus</span>
                      {selectedCampus !== "all" && (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px]" onClick={(e) => { e.stopPropagation(); setSelectedCampus("all"); }}>Clear</Button>
                      )}
                    </div>
                    <DropdownMenuItem onClick={() => setSelectedCampus("all")} className={selectedCampus === "all" ? "bg-muted" : ""}>
                      All Campuses
                    </DropdownMenuItem>
                    {eventCampuses.map(campus => (
                      <DropdownMenuItem key={`campus - ${campus} `} onClick={() => setSelectedCampus(campus as string)} className={selectedCampus === campus ? "bg-muted" : ""}>
                        {campus as string}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b">
                    <th className="text-left px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Session Title</th>
                    <th className="text-left px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Type</th>
                    <th className="text-left px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Time</th>
                    <th className="text-left px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Location</th>
                    <th className="text-left px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Status</th>
                    <th className="text-right px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((session) => (
                      <tr key={session.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-8 py-7">
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{session.title}</span>
                            {!date && (
                              <span className="text-xs font-bold text-zinc-900 mt-1 flex items-center gap-1.5 uppercase tracking-wide">
                                <Calendar className="w-3 h-3" /> {session.date}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-7">
                          <Badge variant="outline" className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                            {session.entryType === 'Observation' ? 'Observation' : (session.topic || session.type)}
                          </Badge>
                        </td>
                        <td className="px-8 py-7">
                          <div className="text-sm font-bold text-foreground flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-zinc-900" />
                            {session.time}
                          </div>
                        </td>
                        <td className="px-8 py-7">
                          <div className="text-sm font-medium text-zinc-900 flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-primary" />
                            {session.location}
                          </div>
                        </td>
                        <td className="px-8 py-7">
                          <span className={cn(
                            "inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border shadow-sm",
                            session.status === "Approved"
                              ? "bg-backgroundmerald-500/5 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                          )}>
                            {session.status}
                          </span>
                        </td>
                        <td className="px-8 py-7 text-right">
                          {session.isRegistered ? (
                            <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-5 h-5" />
                              Registered
                            </div>
                          ) : (
                            <Button
                              className="h-10 px-6 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-foreground shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] font-bold"
                              onClick={() => onRegister(session.id)}
                            >
                              Register Now
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center text-zinc-900">
                            <Calendar className="w-8 h-8" />
                          </div>
                          <p className="text-zinc-900 font-bold italic">No sessions found for this selection.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CoursesView({ courses = [], enrolledCourses = [], onEnrollSuccess }: { courses?: any[], enrolledCourses?: any[], onEnrollSuccess?: () => void }) {
  const { user } = useAuth();
  const userName = user?.fullName || "Teacher";
  const userEmail = user?.email || "";
  const [isMoocFormOpen, setIsMoocFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const navigate = useNavigate();

  // Merge courses with enrollment status
  const allCourses = courses.map(course => {
    const enrollment = enrolledCourses.find(e => e.courseId === course.id);
    return {
      ...course,
      status: enrollment ? (enrollment.progress === 100 ? 'completed' : 'in-progress') : 'recommended',
      progress: enrollment?.progress || 0
    };
  });

  const categories = Array.from(new Set(allCourses.map(c => c.category).filter(Boolean)));
  const allCategories = categories;

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-900" />
            <Input
              className="pl-9 w-[200px] lg:w-[300px]"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className={selectedCategory !== "all" ? "bg-accent text-accent-foreground border-accent" : ""}>
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                All Categories
              </DropdownMenuItem>
              {allCategories.map(category => (
                <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>





      <div className="space-y-8">
        {/* In Progress */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-primary fill-primary" />
            <h3 className="text-xl font-bold">Continue Learning</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => c.status === 'in-progress').map(course => (
              <CourseCard key={course.id} course={course} onEnrollSuccess={onEnrollSuccess} />
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h3 className="text-xl font-bold">Recommended for You</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => c.status === 'recommended').map(course => (
              <CourseCard key={course.id} course={course} onEnrollSuccess={onEnrollSuccess} />
            ))}
          </div>
        </section>

        {/* Completed */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-bold">Completed Courses</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => c.status === 'completed').map(course => (
              <CourseCard key={course.id} course={course} onEnrollSuccess={onEnrollSuccess} />
            ))}
          </div>
        </section>
      </div>
    </div >
  );
}

function CoursesModule({ courses, enrolledCourses }: { courses: any[], enrolledCourses: any[] }) {
  return (
    <div className="space-y-6">
      <Routes>
        <Route index element={
          <>
            <PageHeader
              title="Course Catalogue"
              subtitle="Manage your learning journey"
            />
            <CoursesView courses={courses} enrolledCourses={enrolledCourses} onEnrollSuccess={() => window.dispatchEvent(new Event('courses-refresh'))} />
          </>
        } />
        <Route path="assessments" element={
          <>
            <PageHeader
              title="My Assessments"
              subtitle="Manage your professional evaluations"
            />
            <TeacherAssessmentsView />
          </>
        } />
      </Routes>
    </div>
  );
}

function MoocEvidencePage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isMoocFormOpen, setIsMoocFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moocPlatformFilter, setMoocPlatformFilter] = useState('all');
  const [moocStatusFilter, setMoocStatusFilter] = useState('all');
  const [moocSearchQuery, setMoocSearchQuery] = useState('');
  const [currentDraftMoocId, setCurrentDraftMoocId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mooc/user');
      if (res.data?.status === 'success') {
        setSubmissions(res.data.data.submissions || []);
      }
    } catch (e) {
      toast.error("Failed to fetch MOOC history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleAutoSave = async (data: any) => {
    try {
      const payload = { ...data, status: 'DRAFT' };
      if (currentDraftMoocId) {
        await api.patch(`/mooc/${currentDraftMoocId}/status`, payload);
      } else {
        const res = await api.post('/mooc/submit', payload);
        if (res.data?.status === 'success' && res.data?.data?.submission?.id) {
          setCurrentDraftMoocId(res.data.data.submission.id);
        }
      }
    } catch (error) {
      console.error('Failed to auto-save Mooc Evidence', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="MOOC Evidence"
          subtitle="Submit and track your Massive Open Online Course certifications"
        />
        <Button onClick={() => {
          setCurrentDraftMoocId(null);
          setIsMoocFormOpen(true);
        }} className="gap-2 rounded-xl group shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
          <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
          Submit New Evidence
        </Button>
      </div>

      <Dialog open={isMoocFormOpen} onOpenChange={setIsMoocFormOpen}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-backgroundackgroundackground/95 backdrop-blur-xl shadow-2xl">
          <MoocEvidenceForm
            onCancel={() => {
              setIsMoocFormOpen(false);
              setCurrentDraftMoocId(null);
            }}
            onSubmitSuccess={() => {
              setIsMoocFormOpen(false);
              setCurrentDraftMoocId(null);
              fetchSubmissions();
            }}
            onAutoSave={handleAutoSave}
            userEmail={user?.email || ""}
            userName={user?.fullName || ""}
          />
        </DialogContent>
      </Dialog>

      <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80 border-b border-zinc-100">
                <TableHead className="w-16 p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 text-center">#</TableHead>
                <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">Course Details</TableHead>
                <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">
                  <div className="flex items-center gap-1.5">
                    <span>Platform</span>
                    <select
                      className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                      value={moocPlatformFilter}
                      onChange={(e) => setMoocPlatformFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      {Array.from(new Set(submissions.map(s => s.platform === 'Other' ? s.otherPlatform : s.platform).filter(Boolean))).map(p => (
                        <option key={String(p)} value={String(p)}>{String(p)}</option>
                      ))}
                    </select>
                  </div>
                </TableHead>
                <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">Hours</TableHead>
                <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">Submission Date</TableHead>
                <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Status</span>
                    <select
                      className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                      value={moocStatusFilter}
                      onChange={(e) => setMoocStatusFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-50">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-primary animate-spin opacity-20" />
                      <p className="text-muted-foreground font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center">
                        <History className="w-10 h-10 text-zinc-200" />
                      </div>
                      <p className="text-zinc-500 font-bold">No MOOC submissions found.</p>
                      <Button variant="outline" size="sm" onClick={() => setIsMoocFormOpen(true)}>Submit your first evidence</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : submissions
                  .filter(s => moocPlatformFilter === 'all' || (s.platform === 'Other' ? s.otherPlatform : s.platform) === moocPlatformFilter)
                  .filter(s => moocStatusFilter === 'all' || (s.status || 'PENDING') === moocStatusFilter)
                  .map((sub, idx) => (
                <TableRow key={sub.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <TableCell className="p-8 text-xs font-black text-zinc-300 text-center">{(idx + 1).toString().padStart(2, '0')}</TableCell>
                  <TableCell className="p-8">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-zinc-900 group-hover:text-primary transition-colors text-base tracking-tight leading-tight">{sub.courseName}</span>
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                        <Calendar className="w-3 h-3" />
                        Completed: {new Date(sub.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-8">
                    <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                      {sub.platform === 'Other' ? sub.otherPlatform : sub.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-8">
                    <div className="flex flex-col">
                      <span className="text-base font-black text-zinc-900">{sub.hours}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hours</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-8">
                    <span className="text-sm font-bold text-zinc-500">
                      {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="p-8 text-right">
                    <Badge className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] border px-4 py-1.5 rounded-xl shadow-sm",
                      sub.status === 'APPROVED' ? "bg-backgroundmerald-500/10 text-emerald-600 border-emerald-500/20" :
                        sub.status === 'REJECTED' ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                          "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    )}>
                      {sub.status || 'PENDING'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}



function CourseCard({ course, onEnrollSuccess }: { course: any, onEnrollSuccess?: () => void }) {
  const [enrolling, setEnrolling] = useState(false);
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300   bg-backgroundackgroundackground/50 backdrop-blur-sm overflow-hidden flex flex-col">
      <div className={cn("h-32 w-full relative", course.thumbnail)}>
        <div className="absolute inset-0 bg-backgroundackgroundlack/20 group-hover:bg-backgroundackgroundlack/10 transition-colors" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-black border-none backdrop-blur-sm">
            {course.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer">
            {course.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
            <Star className="w-3 h-3 fill-yellow-600" />
            {course.rating}
          </div>
        </div>
        <CardDescription className="text-xs">By {course.instructor} • {course.duration}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        {course.status === 'in-progress' ? (
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${course.progress}% ` }}
              />
            </div>
          </div>
        ) : course.status === 'completed' ? (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mt-2">
            <CheckCircle2 className="w-4 h-4" />
            Course Completed
          </div>
        ) : (
          <p className="text-sm text-zinc-900 mt-2 line-clamp-2">
            Master the essentials of {course.title.toLowerCase()} in this comprehensive guide.
          </p>
        )}
      </CardContent>
      <div className="p-4 pt-0">
        <Button
          className="w-full gap-2 group/btn"
          variant={course.status === 'in-progress' ? 'default' : 'outline'}
          disabled={enrolling}
          onClick={async () => {
            if (course.isDownloadable && course.url) {
              window.open(course.url, '_blank');
            } else if (course.status === 'recommended') {
              setEnrolling(true);
              try {
                await api.post(`/courses/${course.id}/enroll`);
                toast.success("Enrolled in course!");
                onEnrollSuccess?.();
              } catch (e: any) {
                toast.error(e.response?.data?.message || "Failed to enroll");
              } finally {
                setEnrolling(false);
              }
            } else {
              toast.info("Course access coming soon!");
            }
          }}
        >
          {enrolling ? 'Enrolling...' : course.status === 'in-progress' ? 'Continue Lesson' : course.status === 'completed' ? 'Review Course' : 'Start Learning'}
          {course.isDownloadable ? <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
        </Button >
      </div >
    </Card >
  );
}

function PDHoursView({ pdHours, upcomingEvents, onRegister }: { pdHours: any, upcomingEvents: any[], onRegister: (id: string) => void }) {
  const { user } = useAuth();
  const userName = user?.fullName || "Teacher";
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [isEmailing, setIsEmailing] = useState(false);

  const categories = Array.from(new Set(pdHours.history.map((h: any) => h.category).filter(Boolean)));

  const filteredHistory = pdHours.history.filter((item: any) => {
    return selectedCategory === "all" || item.category === selectedCategory;
  });

  const filteredUpcoming = useMemo(() => {
    return upcomingEvents.filter(e => {
      const isNotRegistered = !e.isRegistered;
      const matchesCampus = selectedCampus === "all" || e.campusId === selectedCampus || (e.location && e.location.includes(selectedCampus));
      return isNotRegistered && matchesCampus;
    });
  }, [upcomingEvents, selectedCampus]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Teacher Development Activity Log", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "MMM d, yyyy")}`, 14, 30);
    doc.text(`Teacher: ${userName}`, 14, 38);
    const tableColumn = ["Activity", "Category", "Date", "Hours", "Status"];
    const tableRows = filteredHistory.map((item: any) => [
      item.activity,
      item.category,
      item.date,
      `${item.hours}h`,
      item.status
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    });
    doc.save("activity_history.pdf");
  };

  const handleEmailReport = async () => {
    try {
      setIsEmailing(true);
      const pdHoursElement = document.getElementById("pd-hours-summary-container");
      if (!pdHoursElement) {
        toast.error("Could not capture the PD Hours summary.");
        return;
      }
      const canvas = await html2canvas(pdHoursElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fdfbf7"
      });
      const imageDataUrl = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `PD_Hours_Snapshot_${format(new Date(), 'MMM_dd_yyyy')}.png`;
      link.href = imageDataUrl;
      link.click();
      toast.success("Snapshot downloaded! You can now attach it to an email.");
      const subject = encodeURIComponent(`Training Hours Record - ${userName}`);
      const body = encodeURIComponent(`Please find attached my Training Hours Record snapshot generated on ${format(new Date(), 'MMM d, yyyy')}.`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error("Failed to generate email snapshot:", error);
      toast.error("Failed to generate email snapshot.");
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Training Hours Tracking" subtitle="" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6" id="pd-hours-summary-container">
        {/* Progress Card */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Annual Target Progress</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Achieved hours: <span className="font-bold text-foreground">{pdHours.total}h</span></span>
              <span className="text-zinc-900">|</span>
              <span>Target: <span className="font-bold text-foreground">{pdHours.target}h</span></span>
              <span className="text-zinc-900">|</span>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {Math.max(0, pdHours.target - pdHours.total)}h Remaining
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Completion Status</span>
                <span>{Math.round((pdHours.total / pdHours.target) * 100)}%</span>
              </div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
                {pdHours.categories.map((cat: any, idx: number) => (
                  <div
                    key={idx}
                    className={cn("h-full transition-all duration-500", cat.color)}
                    style={{ width: `${(cat.hours / pdHours.target) * 100}%` }}
                    title={`${cat.name}: ${cat.hours}h (${cat.target - cat.hours}h left)`}
                  />
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3">Targets by Block</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pdHours.categories.map((cat: any, idx: number) => {
                  const hoursLeft = Math.max(0, cat.target - cat.hours);
                  return (
                    <div key={idx} className="space-y-2 p-3 rounded-lg bg-white border">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                        {cat.name}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-2xl font-black">{cat.hours}<span className="text-sm font-normal text-zinc-900">/{cat.target}h</span></div>
                        <div className="text-xs font-medium text-zinc-900 whitespace-nowrap">{hoursLeft}h left</div>
                      </div>
                      <Progress value={(cat.hours / cat.target) * 100} className="h-1"
                        style={{ '--progress-background': 'var(--muted)', '--progress-foreground': `var(--${(cat.color || 'blue-500').split('-')[1]})` } as any}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="shadow-lg bg-backgroundmerald-500 text-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-50/80 text-sm font-medium">Achieved hours</p>
                  <p className="text-3xl font-bold">{pdHours.total}h</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FileCheck className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-zinc-900 text-sm font-medium">Target</p>
                  <p className="text-3xl font-bold">{pdHours.target - pdHours.total}h</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming PDI Trainings */}
      <Card className="border-none shadow-xl bg-white mt-8 overflow-hidden">
        <CardHeader className="border-b border-muted/50 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Trainings
            </CardTitle>
            <CardDescription>Register for upcoming Teacher Development sessions to meet your targets.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl border-muted/50">
                <SelectValue placeholder="All schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All schools</SelectItem>
                {CAMPUS_OPTIONS.map((school: string) => (
                  <SelectItem key={school} value={school}>{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/50">
                <TableHead className="text-zinc-900 font-bold">Training Session</TableHead>
                <TableHead className="text-zinc-900 font-bold">Block / Category</TableHead>
                <TableHead className="text-zinc-900 font-bold">Date & Time</TableHead>
                <TableHead className="text-zinc-900 font-bold">Location</TableHead>
                <TableHead className="w-[150px] text-zinc-900 font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUpcoming.length > 0 ? filteredUpcoming.slice(0, 5).map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell className="font-bold">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.topic || event.type}</Badge>
                  </TableCell>
                  <TableCell className="text-zinc-900 text-sm flex flex-col">
                    <span>{event.date}</span>
                    <span className="text-xs">{event.time}</span>
                  </TableCell>
                  <TableCell className="text-zinc-900 text-sm">{event.location}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => onRegister(event.id)}>Register</Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-zinc-900">No upcoming trainings available for this selection.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="mt-8" />

      {/* History Table */}
      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-muted/50 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Activity History</CardTitle>
            <CardDescription>A detailed log of all your PD activities</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {selectedCategory === "all" ? "All Categories" : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category: any) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-foreground" onClick={handleEmailReport} disabled={isEmailing}>
              <Mail className="w-4 h-4" />
              {isEmailing ? "Preparing..." : "Email Record"}
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/50">
                <TableHead className="w-[300px] text-zinc-900 font-bold">Activity</TableHead>
                <TableHead className="text-zinc-900 font-bold">Category</TableHead>
                <TableHead className="text-zinc-900 font-bold">Date</TableHead>
                <TableHead className="text-right text-zinc-900 font-bold">Hours</TableHead>
                <TableHead className="text-zinc-900 font-bold">Status</TableHead>
                <TableHead className="w-[150px] text-zinc-900 font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((row: any) => (
                <TableRow key={row.id} className="group hover:bg-muted/30 border-muted/50 transition-colors">
                  <TableCell className="font-medium">{row.activity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs">{row.category}</Badge>
                  </TableCell>
                  <TableCell className="text-zinc-900 text-sm">{row.date}</TableCell>
                  <TableCell className="text-right font-bold">{row.hours}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {row.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setSelectedActivity(row)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Activity Detail Dialog */}
      {
        selectedActivity && (
          <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
            <DialogContent className="max-w-4xl bg-backgroundackgroundackground/95 backdrop-blur-xl  ">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Book className="w-6 h-6 text-primary" />
                  Activity Details
                </DialogTitle>
                <DialogDescription>
                  Comprehensive overview of your Teacher Development activity
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Header Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="  shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-foreground">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-50/80 text-xs font-medium mb-1">Training Hours</p>
                          <p className="text-2xl font-bold">{selectedActivity.hours}h</p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-50/50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="  shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-foreground">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-50/80 text-xs font-medium mb-1">Enrolled</p>
                          <p className="text-2xl font-bold">{selectedActivity.enrolled || 'N/A'}</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-50/50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    "border-none shadow-lg text-foreground",
                    selectedActivity.status === "Approved"
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                      : "bg-gradient-to-br from-amber-500 to-amber-600"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn(
                            "text-xs font-medium mb-1",
                            selectedActivity.status === "Approved" ? "text-emerald-50/80" : "text-amber-50/80"
                          )}>Status</p>
                          <p className="text-xl font-bold">{selectedActivity.status}</p>
                        </div>
                        <ShieldCheck className={cn(
                          "w-8 h-8",
                          selectedActivity.status === "Approved" ? "text-emerald-50/50" : "text-amber-50/50"
                        )} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Details */}
                <Card className="shadow-xl bg-backgroundackgroundackground/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Course Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-zinc-900 font-semibold uppercase tracking-wider">Course Title</Label>
                        <p className="text-lg font-bold text-foreground">{selectedActivity.activity}</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-zinc-900 font-semibold uppercase tracking-wider">Category</Label>
                        <div>
                          <Badge className="text-sm py-1 px-3">{selectedActivity.category}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-zinc-900 font-semibold uppercase tracking-wider">Instructor</Label>
                        <p className="text-base font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-zinc-900" />
                          {selectedActivity.instructor || 'Not Specified'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-zinc-900 font-semibold uppercase tracking-wider">Date Completed</Label>
                        <p className="text-base font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-900" />
                          {selectedActivity.date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </Button>
                  <Button className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }
    </div >
  );
}

function AttendanceView() {
  return <PlaceholderView title="My Attendance" icon={ClipboardList} />;
}

function InsightsView() {
  return <PlaceholderView title="Identified Strengths" icon={ShieldCheck} />;
}



function PlaceholderView({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="p-4 rounded-3xl bg-primary/10 mb-6">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-zinc-900 max-w-md mx-auto mb-8">
        We're working hard to bring you the best {title.toLowerCase()} experience.
        This module will be available in the next platform update.
      </p>
      <Button asChild>
        <Link to="/departments/pd/teacher">Return to Dashboard</Link>
      </Button>
    </div>
  );
}


// Route guard wrapper: wraps an element and checks module access
const ModuleGuard = ({ modulePath, children, role, isModuleEnabled }: { modulePath: string, children: React.ReactNode, role: string, isModuleEnabled: any }) => {
  const baseModulePath = modulePath.split('/')[0];
  const fullPath = `/teacher/${baseModulePath}`;

  if (!isModuleEnabled(fullPath, role)) {
    return <Navigate to="/departments/pd/teacher" replace />;
  }
  return <>{children}</>;
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { isModuleEnabled } = useAccessControl();

  const userName = user?.fullName || "";
  const userEmail = user?.email || "";
  const role = user?.role || "TEACHER";

  const navigate = useNavigate();
  const [goals, setGoals] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [pdHours, setPdHours] = useState({
    total: 0,
    target: 30, // overall target
    categories: [
      { name: "Early Years", hours: 0, target: 6, color: "bg-rose-500" },
      { name: "Primary", hours: 0, target: 6, color: "bg-amber-500" },
      { name: "Middle School", hours: 0, target: 6, color: "bg-sky-500" },
      { name: "High School", hours: 0, target: 6, color: "bg-indigo-500" },
      { name: "Online Courses", hours: 0, target: 6, color: "bg-backgroundmerald-500" }
    ],
    history: []
  });
  const [selectedReflectObs, setSelectedReflectObs] = useState<Observation | null>(null);
  const [surveyStatus, setSurveyStatus] = useState<{ active: boolean; completed: boolean; title?: string } | null>(null);


  // Centralized fetcher for all dashboard data
  const fetchAllData = async () => {
    await Promise.all([
      fetchObservations(),
      fetchGoals(),
      fetchCourses(),
      fetchEnrollments(),
      fetchMoocsAndPdHours(),
      fetchSurveyStatus(),
      fetchEvents()
    ]);
  };

  const fetchObservations = async () => {
    try {
      const response = await api.get('/growth/observations');
      if (response.data?.status === 'success') {
        const apiObservations = (response.data?.data?.observations || []).map((obs: any) => {
          let formPayload = obs.formPayload;
          if (typeof formPayload === 'string') {
            try {
              formPayload = JSON.parse(formPayload);
            } catch (e) {
              formPayload = {};
            }
          }

          let parsedReflection = obs.detailedReflection;
          if (typeof obs.detailedReflection === 'string') {
            try {
              parsedReflection = JSON.parse(obs.detailedReflection);
            } catch (e) {
              // ignore
            }
          }

          const safeDate = (dateStr: any) => {
            if (!dateStr) return "N/A";
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? "N/A" : format(d, "MMM d, yyyy");
          };

          return {
            ...obs,
            ...formPayload,
            id: obs.id,
            teacher: obs.teacher?.fullName || formPayload?.teacherName,
            date: safeDate(obs.observationDate),
            observerName: obs.observer?.fullName || formPayload?.observer,
            observerRole: obs.observer?.role || formPayload?.observerRole,
            domain: obs.moduleType ? String(obs.moduleType).replace('_', ' ') : (obs.subject || 'Observation'),
            score: obs.overallRating || formPayload?.score || 0,
            learningArea: obs.subject || obs.learningArea || formPayload?.learningArea,
            teachingStrategies: formPayload?.teachingStrategies || [],
            glows: obs.status === 'SUBMITTED' ? (obs.strengths || formPayload?.glows || formPayload?.strengths) : '',
            grows: obs.status === 'SUBMITTED' ? (obs.areasOfGrowth || formPayload?.grows || formPayload?.areasOfGrowth) : '',
            detailedReflection: parsedReflection || {}
          };
        });
        setObservations(apiObservations);
      }
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
      setGoals([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      if (response.data?.status === 'success') {
        setCourses(response.data.data.courses || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/courses/user/enrollments');
      if (response.data?.status === 'success') {
        setEnrolledCourses(response.data.data.enrollments || []);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    }
  };

  const fetchMoocsAndPdHours = async () => {
    try {
      const [moocRes, pdRes] = await Promise.all([
        api.get('/mooc/user'),
        api.get('/pd')
      ]);

      let moocHours = 0;
      let trainingHours = 0;
      const history: any[] = [];

      if (moocRes.data?.status === 'success') {
        const moocSubmissions = moocRes.data.data.submissions || [];
        const approvedMoocs = moocSubmissions.filter((m: any) => m.status === 'APPROVED');
        moocHours = approvedMoocs.reduce((sum: number, m: any) => sum + (Number(m.hours) || Number(m.duration) || 0), 0);
        approvedMoocs.forEach((m: any) => {
          history.push({
            id: m.id,
            activity: m.courseName,
            hours: Number(m.hours) || Number(m.duration) || 0,
            date: m.date || m.endDate,
            category: 'MOOC'
          });
        });
      }

      if (pdRes.data?.status === 'success') {
        const pdHistory = pdRes.data.data.pdHistory || [];
        trainingHours = pdHistory.filter((p: any) => p.status === 'APPROVED').reduce((sum: number, p: any) => sum + (Number(p.hours) || 0), 0);
        pdHistory.forEach((p: any) => {
          history.push({
            id: p.id,
            activity: p.activity,
            hours: Number(p.hours) || 0,
            date: p.date,
            category: p.category
          });
        });
      }

      const totalHours = moocHours + trainingHours;
      setPdHours(prev => ({
        ...prev,
        total: totalHours,
        history: history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        categories: prev.categories.map(c => {
          if (c.name === 'Online Courses') return { ...c, hours: moocHours };
          const categoryHours = history.filter(h => h.category === c.name).reduce((sum, h) => sum + h.hours, 0);
          return { ...c, hours: categoryHours };
        })
      }));
    } catch (error) {
      console.error("Failed to fetch PD Hours:", error);
    }
  };

  const fetchSurveyStatus = async () => {
    try {
      const res = await api.get('/surveys/active');
      if (res.data?.status === 'success' && res.data?.data?.survey) {
        const s = res.data.data.survey;
        setSurveyStatus({
          active: true,
          completed: s.completedBy?.includes(user?.id) || false,
          title: s.title
        });
      }
    } catch (e) {
      // ignore
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await trainingService.getAllEvents();
      const enrichedEvents = eventsData.map(e => {
        const isRegistered = e.registrants?.some((r: any) =>
          r.id === user?.id ||
          (r.userId && r.userId === user?.id) ||
          (r.email && r.email.toLowerCase() === userEmail?.toLowerCase())
        );

        return {
          ...e,
          time: e.time || "09:00 AM",
          type: e.type || e.modality,
          participants: e.registered || 0,
          isRegistered: isRegistered || false,
          progress: 0,
          mandatory: e.modality === 'Offline'
        };
      });
      setEvents(enrichedEvents);
    } catch (error) {
      console.error("Failed to fetch events from database", error);
    }
  };

  useEffect(() => {
    fetchAllData();

    const onCoursesRefresh = () => {
      fetchCourses();
      fetchEnrollments();
    };
    window.addEventListener('courses-refresh', onCoursesRefresh);

    const socket = getSocket();
    if (user?.id) {
      socket.emit('join_room', `user:${user.id}`);
      if (user.campusId) {
        socket.emit('join_room', `campus:${user.campusId}`);
      }
    } else {
      socket.emit('join_room', userName);
    }

    const handleSync = () => {
      console.log("[SOCKET] Syncing teacher dashboard data...");
      fetchAllData();
    };

    const listeners = [
      'user:changed', 'observation:created', 'observation:updated',
      'goal:created', 'goal:updated', 'course:created', 'course:updated',
      'course:deleted', 'mooc:created', 'mooc:updated', 'pd:awarded',
      'attendance:toggled', 'training:created', 'training:updated',
      'training:deleted', 'growth-observation:created'
    ];

    listeners.forEach(event => socket.on(event, handleSync));

    socket.on('survey:triggered', (data: any) => {
      setSurveyStatus({ active: true, completed: false, title: data.title });
      toast.info(`New PD Survey: ${data.title}`, {
        action: { label: "View", onClick: () => navigate("/teacher/survey") }
      });
    });

    socket.on('survey:closed', () => {
      setSurveyStatus(prev => prev?.title ? { ...prev, active: false } : null);
      toast.warning("The PD Survey has been closed.");
    });

    return () => {
      window.removeEventListener('courses-refresh', onCoursesRefresh);
      listeners.forEach(event => socket.off(event, handleSync));
      socket.off('survey:triggered');
      socket.off('survey:closed');
      socket.emit('leave_room', user?.id || userName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, userEmail, user?.id]);

  const handleReflect = (id: string, reflection: DetailedReflection) => {
    // In a real app, this would be an API call
    setObservations(prev => prev.map(obs =>
      obs.id === id ? { ...obs, hasReflection: true, reflection: reflection.comments } : obs
    ));
    setSelectedReflectObs(null);
    toast.success("Reflection saved successfully!");
  };

  const handleReflectionSubmit = async (comment: string) => {
    if (!selectedReflectObs) return;
    try {
      // Patch observation with reflection status
      await api.patch(`/growth/observations/${selectedReflectObs.id}`, {
        hasReflection: true,
        teacherReflection: comment,
        status: "SUBMITTED" // Keep enum casing
      });

      setObservations(prev => prev.map(obs =>
        obs.id === selectedReflectObs.id
          ? { ...obs, hasReflection: true, teacherReflection: comment, status: "SUBMITTED" as const }
          : obs
      ));
      setSelectedReflectObs(null);
      toast.success("Reflection submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit reflection");
    }
  };

  const handleViewReport = (id: string) => {
    navigate(`/teacher/observations/${id}`);
  };









  const handleRegister = async (id: string) => {
    try {
      await trainingService.registerForEvent(id);
      setEvents(prev => prev.map(event =>
        event.id === id
          ? {
            ...event,
            isRegistered: true,
            registered: (event.registered || 0) + 1,
            spotsLeft: (event.spotsLeft || 1) - 1
          }
          : event
      ));
      toast.success("Successfully registered for the training session!");
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error("Failed to register for event");
    }
  };

  // Filtered data for current user
  const userObservations = useMemo(() => {
    return observations.filter(o =>
      o.teacherId === user?.id ||
      o.teacher?.toLowerCase() === userName.toLowerCase() ||
      o.teacherEmail?.toLowerCase() === userEmail?.toLowerCase()
    );
  }, [observations, user?.id, userName, userEmail]);

  const userGoals = useMemo(() => {
    return goals.filter(g =>
      g.teacherId === user?.id ||
      g.teacher?.toLowerCase() === userName.toLowerCase()
    );
  }, [goals, user?.id, userName]);

  const [reflectionTemplate, setReflectionTemplate] = useState<any>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await api.get('/templates');
        if (response.data?.status === 'success') {
          const templates = response.data.data.templates || [];
          const active = templates.find((t: any) => t.type === 'Reflection' && t.status === 'Active');
          if (active) setReflectionTemplate(active);
        }
      } catch (error) {
        console.error("Failed to fetch reflection template", error);
      }
    };
    fetchTemplate();
  }, []);

  if (!user) return null;

  return (
    <DashboardLayout role={role.toLowerCase() as any} userName={userName}>
      <Routes>
        <Route index element={
          <CustomDashboardWrapper role={role}>
            <DashboardOverview
              goals={userGoals}
              events={events}
              observations={userObservations}
              onRegister={handleRegister}
              onView={handleViewReport}
              onReflect={setSelectedReflectObs}
              userName={userName}
              pdHours={pdHours}
              role={role}
              surveyStatus={surveyStatus}
            />
          </CustomDashboardWrapper>
        } />
        <Route path="observations" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="observations"><ObservationsView observations={userObservations} events={events} onReflect={setSelectedReflectObs} onView={handleViewReport} /></ModuleGuard>} />
        <Route path="growth" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="observations"><ObservationsView observations={userObservations} events={events} onReflect={setSelectedReflectObs} onView={handleViewReport} /></ModuleGuard>} />
        <Route path="performance" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="observations"><ObservationsView observations={userObservations} events={events} onReflect={setSelectedReflectObs} onView={handleViewReport} /></ModuleGuard>} />
        <Route path="observations/:id" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="observations"><ObservationDetailView observations={userObservations} /></ModuleGuard>} />
        <Route path="goals" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="goals"><GoalsView goals={goals} fetchGoals={fetchGoals} userName={userName} role={role} /></ModuleGuard>} />
        <Route path="calendar" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="calendar"><CalendarView events={events} onRegister={handleRegister} /></ModuleGuard>} />
        <Route path="participation" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="hours"><PDHoursView pdHours={pdHours} upcomingEvents={events} onRegister={handleRegister} /></ModuleGuard>} />
        <Route path="hours" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="hours"><PDHoursView pdHours={pdHours} upcomingEvents={events} onRegister={handleRegister} /></ModuleGuard>} />
        <Route path="attendance" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="attendance"><TeacherAttendance /></ModuleGuard>} />
        <Route path="attendance/:eventId" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="attendance"><AttendanceForm /></ModuleGuard>} />
        <Route path="meetings" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="meetings"><MeetingsDashboard /></ModuleGuard>} />
        <Route path="meetings/:meetingId/mom" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="meetings"><MeetingMoMForm /></ModuleGuard>} />
        <Route path="meetings/:meetingId" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="meetings"><MeetingMoMForm /></ModuleGuard>} />
        <Route path="courses/*" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="courses"><CoursesModule courses={courses} enrolledCourses={enrolledCourses} /></ModuleGuard>} />
        <Route path="mooc" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="courses"><MoocEvidencePage /></ModuleGuard>} />
        <Route path="festival" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="festival"><LearningFestivalPage /></ModuleGuard>} />
        <Route path="festival/:id/apply" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="festival"><FestivalApplicationForm /></ModuleGuard>} />
        <Route path="festival/:id/application" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="festival"><FestivalApplicationForm /></ModuleGuard>} />
        <Route path="documents" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="documents"><AcknowledgementsView teacherId={user?.id || "unknown"} /></ModuleGuard>} />
        <Route path="courses/assessments/attempt/:assessmentId" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="courses"><AssessmentAttemptView /></ModuleGuard>} />
        <Route path="insights" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="insights"><InsightsView /></ModuleGuard>} />
        <Route path="survey" element={<ModuleGuard role={role} isModuleEnabled={isModuleEnabled} modulePath="survey"><SurveyPage /></ModuleGuard>} />
        <Route path="profile" element={
          <TeacherProfileView
            teacher={{
              id: user?.id || "unknown",
              name: userName,
              role: user?.department ? `${user.department} Teacher` : "Teacher",
              observations: userObservations.length,
              lastObserved: userObservations[0]?.date || "N/A",
              avgScore: userObservations.length > 0
                ? Number((userObservations.reduce((acc, o) => acc + (o.score || 0), 0) / userObservations.length).toFixed(1))
                : 0,
              pdHours: pdHours.total,
              completionRate: userGoals.length > 0
                ? Math.round(userGoals.filter(g => g.progress === 100).length / userGoals.length * 100)
                : 0,
              email: userEmail,
              campus: user?.campusId || "Main Campus"
            }}
            observations={userObservations}
            goals={userGoals}
            userRole="teacher"
          />
        } />
      </Routes>

      {/* Reflection Dialog */}
      {selectedReflectObs && (
        <ReflectionDialog
          isOpen={!!selectedReflectObs}
          onClose={() => setSelectedReflectObs(null)}
          onSubmit={handleReflectionSubmit}
          observation={selectedReflectObs}
        />
      )}


      <ScrollToTop />
    </DashboardLayout>
  );
}

function ReflectionDialog({
  isOpen,
  onClose,
  onSubmit,
  observation
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  observation: any;
}) {
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    onSubmit(comments);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-backgroundackgroundackground   shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Add Comment
          </DialogTitle>
          <DialogDescription>
            Share your thoughts and reflections on this observation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Textarea
            placeholder="Type your comment or reflection here..."
            className="min-h-[120px] resize-none"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!comments.trim()}>Submit Reflection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ObservationDetailView({ observations }: { observations: Observation[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const observation = observations.find(o => o.id === id);

  if (!observation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <FileCheck className="w-16 h-16 text-zinc-900 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold">Observation not found</h2>
        <Button onClick={() => navigate("/growth")} className="mt-4">Back to Observations</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/observations")} className="print:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 gap-4">
          <PageHeader
            title="Observation Report"
          />
          <div className="flex items-center gap-2">
            <AIAnalysisModal
              isOpen={isAIModalOpen}
              onClose={() => setIsAIModalOpen(false)}
              data={{ observation }}
              type="observation"
              title="Instructional Insight Analysis"
            />
            <Button
              onClick={() => setIsAIModalOpen(true)}
              size="sm"
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 font-bold border-none"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              AI Smart Analysis
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Assessment Card - Similar to Leader View but read-only for teacher */}
          <Card className="  shadow-2xl bg-backgroundackgroundackground/50 backdrop-blur-sm overflow-hidden">
            <div className="h-4 bg-backgroundackgroundlack" />
            <CardHeader className="bg-muted/10 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {observation.domain}
                    </span>
                    <span className="text-zinc-900 text-sm">•</span>
                    <span className="text-zinc-900 text-sm font-medium">{observation.date}</span>
                  </div>
                  <CardTitle className="text-3xl font-bold">Instructional Assessment</CardTitle>
                  {observation.learningArea && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 gap-1.5 pl-2 pr-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        <Book className="w-3.5 h-3.5" />
                        Subject: {observation.learningArea}
                      </Badge>
                      {observation.classroom && (
                        <>
                          <Badge variant="outline" className="text-zinc-900 gap-1.5 font-medium">
                            <span className="font-bold text-foreground">Grade:</span> {observation.classroom.grade}
                          </Badge>
                          <Badge variant="outline" className="text-zinc-900 gap-1.5 font-medium">
                            <span className="font-bold text-foreground">Section:</span> {observation.classroom.section}
                          </Badge>
                          <Badge variant="outline" className="text-zinc-900 gap-1.5 font-medium">
                            <span className="font-bold text-foreground">Block:</span> {observation.classroom.block}
                          </Badge>
                        </>
                      )}
                    </div>
                  )}
                  {/* Domain Description */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-zinc-900 border border-muted-foreground/10">
                    <p className="flex gap-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span>
                        <strong>About {observation.domain}:</strong> This domain evaluates the effectiveness of teaching strategies,
                        classroom engagement, and the alignment of activities with learning objectives.
                      </span>
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black border-4 shadow-xl",
                  (observation.type === "Quick Feedback" || String(observation.domain).toUpperCase() === "QUICK FEEDBACK" || String(observation.domain).toUpperCase() === "QUICK_FEEDBACK")
                    ? "bg-slate-100 text-muted-foreground border-slate-200"
                    : observation.score >= 4
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-warning/10 text-warning border-warning/20"
                )}>
                  <span className="text-3xl leading-none">
                    {(observation.type === "Quick Feedback" || String(observation.domain).toUpperCase() === "QUICK FEEDBACK" || String(observation.domain).toUpperCase() === "QUICK_FEEDBACK")
                      ? "NA"
                      : observation.score}
                  </span>
                  <span className="text-[10px] uppercase opacity-60">Score</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid md:grid-cols-2 gap-8 border-b border-border/60 pb-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-zinc-900 tracking-widest">Observer</p>
                  <p className="text-lg font-bold">{observation.observerName || "School Leader"}</p>
                  <p className="text-sm text-zinc-900">{observation.observerRole || "Administrator"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-zinc-900 tracking-widest">Teacher</p>
                  <p className="text-lg font-bold">{observation.teacher || "Teacher One"}</p>
                </div>
              </div>

              {/* Power BI Style Data Visualization Section */}
              {observation.strengths && (
                <Card className="bg-success/5 border-success/20 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-success flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {observation.type === "Quick Feedback" ? "Quick Feedback Glows" : "Strengths Observed"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium leading-relaxed text-foreground/90">
                      {observation.strengths}
                    </p>
                  </CardContent>
                </Card>
              )}

              {observation.areasOfGrowth && (
                <Card className="bg-orange-500/5 border-orange-500/20 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-orange-600 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {observation.type === "Quick Feedback" ? "Quick Feedback Grows" : "Areas for Growth"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium leading-relaxed text-foreground/90">
                      {observation.areasOfGrowth}
                    </p>
                  </CardContent>
                </Card>
              )}

              {observation.teachingStrategies && observation.teachingStrategies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase text-zinc-900 tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Strategies Observed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {observation.teachingStrategies.map((strategy, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}


              {/* Domain Specific Evidence */}
              {observation.domains && observation.domains.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    <ClipboardCheck className="w-5 h-5" />
                    Domain Evidence & Indicator Ratings
                  </h3>
                  <div className="grid gap-6">
                    {observation.domains.map((dom) => (
                      <Card key={dom.domainId} className="border-muted/30 shadow-sm overflow-hidden">
                        <div className="bg-muted/10 p-4 border-b">
                          <h4 className="font-bold flex items-center justify-between">
                            {dom.title}
                            <Badge variant="outline" className="text-[10px] font-black uppercase">Domain {dom.domainId}</Badge>
                          </h4>
                        </div>
                        <CardContent className="p-5 space-y-4">
                          <div className="grid gap-2">
                            {dom.indicators.map((ind, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-dashed last:border-0">
                                <span className="text-sm font-medium text-foreground/80">{ind.name}</span>
                                <Badge variant={ind.rating === "Highly Effective" ? "default" : ind.rating === "Effective" ? "secondary" : ind.rating === "Basic" ? "outline" : "outline"} className={cn(
                                  "text-[10px] font-bold",
                                  ind.rating === "Not Observed" && "opacity-40"
                                )}>
                                  {ind.rating}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          {dom.evidence && (
                            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                              <p className="text-xs font-bold uppercase text-primary mb-2 tracking-widest">Evidence Observed</p>
                              <p className="text-sm italic text-foreground/80 leading-relaxed">"{dom.evidence}"</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialist Form Sections (Dynamically detect sections like Section A, B1 etc.) */}
              {Object.keys(observation).some(key => /^section[A-Z]/.test(key)) && (
                <div className="space-y-6 pt-6 border-t border-border/60">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    <ClipboardCheck className="w-5 h-5" />
                    Detailed Observation Criteria
                  </h3>
                  <div className="grid gap-6">
                    {Object.keys(observation)
                      .filter(key => /^section[A-Z](\d+)?$/.test(key) && typeof (observation as any)[key] === 'object')
                      .sort()
                      .map(sectionKey => {
                        const sectionData = (observation as any)[sectionKey];
                        const evidenceKey = `${sectionKey}Evidence`;
                        const evidence = (observation as any)[evidenceKey];
                        // Convert "sectionA" to "Section A", "sectionB1" to "Section B1"
                        const sectionTitle = sectionKey.replace(/section([A-Z])(\d+)?/, (_, char, num) => `Section ${char}${num || ''}`);

                        return (
                          <Card key={sectionKey} className="border-muted/30 shadow-sm overflow-hidden">
                            <div className="bg-muted/10 p-4 border-b">
                              <h4 className="font-bold flex items-center justify-between text-sm uppercase tracking-wider text-zinc-900">
                                {sectionTitle}
                              </h4>
                            </div>
                            <CardContent className="p-0 divide-y divide-border/60">
                              {Object.entries(sectionData).map(([question, answer], idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
                                  <span className="text-sm font-medium text-foreground/80 leading-relaxed pr-4">{question}</span>
                                  <Badge
                                    variant={answer === "Yes" ? "default" : answer === "No" ? "destructive" : "outline"}
                                    className={cn(
                                      "flex-shrink-0 font-bold px-3",
                                      answer === "Yes" && "bg-backgroundmerald-500 hover:bg-backgroundmerald-600",
                                      answer === "No" && "bg-rose-500 hover:bg-rose-600"
                                    )}
                                  >
                                    {String(answer)}
                                  </Badge>
                                </div>
                              ))}
                              {evidence && (
                                <div className="p-4 bg-primary/5">
                                  <p className="text-[10px] font-bold uppercase text-primary mb-1 tracking-widest">Section Evidence</p>
                                  <p className="text-sm italic text-foreground/80 leading-relaxed">"{evidence}"</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })
                    }
                  </div>
                </div>
              )}

              {/* Specialist Tools and Routines */}
              {((observation as any).cultureTools?.length > 0 ||
                (observation as any).learningTools?.length > 0 ||
                (observation as any).routinesObserved?.length > 0 ||
                (observation as any).routines?.length > 0 ||
                (observation as any).studioHabits?.length > 0 ||
                (observation as any).instructionalTools?.length > 0 ||
                (observation as any).tools?.length > 0
              ) && (
                  <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border/60">
                    {/* Culture Tools */}
                    {(observation as any).cultureTools?.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-600">
                          <Zap className="w-5 h-5" />
                          Culture Tools
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(observation as any).cultureTools.map((tool: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-backgroundmerald-50 text-emerald-700 border-emerald-100 uppercase text-[10px] tracking-wider font-bold">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Tools */}
                    {(observation as any).learningTools?.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-blue-600">
                          <Book className="w-5 h-5" />
                          Learning Tools
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(observation as any).learningTools.map((tool: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-backgroundackgroundlue-50 text-blue-700 border-blue-100 uppercase text-[10px] tracking-wider font-bold">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unified Routines Observed */}
                    {((observation as any).routinesObserved?.length > 0 || (observation as any).routines?.length > 0) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                          <ClipboardList className="w-5 h-5" />
                          Routines Observed
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set([
                            ...((observation as any).routinesObserved || []),
                            ...((observation as any).routines || [])
                          ])).map((routine: any, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100 uppercase text-[10px] tracking-wider font-bold">
                              {String(routine)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Studio Habits */}
                    {(observation as any).studioHabits?.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-amber-600">
                          <Palette className="w-5 h-5" />
                          Studio Habits
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(observation as any).studioHabits.map((habit: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100 uppercase text-[10px] tracking-wider font-bold">
                              {habit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unified Instructional Tools */}
                    {((observation as any).instructionalTools?.length > 0 || (observation as any).tools?.length > 0) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                          <PenTool className="w-5 h-5" />
                          Tools in Action
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set([
                            ...((observation as any).instructionalTools || []),
                            ...((observation as any).tools || [])
                          ])).map((tool: any, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border-primary/10 uppercase text-[10px] tracking-wider font-bold">
                              {String(tool)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Action Steps & Feedback Section */}
              {observation.actionStep && (
                <div className="space-y-4 pt-4 border-t border-border/60">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                    <Target className="w-5 h-5" />
                    Action Step
                  </h3>
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 font-medium leading-relaxed">
                    {observation.actionStep}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <FileCheck className="w-5 h-5" />
                  General Feedback & Notes
                </h3>
                <div className="p-6 rounded-2xl bg-muted/20 border border-muted-foreground/10 text-foreground leading-relaxed italic">
                  "{observation.notes || "No additional feedback provided."}"
                </div>
              </div>

              {/* Meta Tags / Focus Areas */}
              {observation.metaTags && (Array.isArray(observation.metaTags) ? observation.metaTags : []).length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900">
                    <Tag className="w-5 h-5" />
                    Focus Areas for Improvement
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(observation.metaTags) ? observation.metaTags : []).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="px-3 py-1.5 rounded-xl border-primary/20 bg-primary/5 text-primary text-xs font-bold">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Comments (Quick Feedback) */}
              {observation.type === "Quick Feedback" && observation.otherComment && (
                <div className="space-y-4 pt-4 border-t border-border/60">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900">
                    <MessageSquare className="w-5 h-5" />
                    Additional Comments
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 italic">
                    "{observation.otherComment}"
                  </div>
                </div>
              )}

              {/* Teacher's Own Reflection Section */}
              {observation.detailedReflection && typeof observation.detailedReflection === 'object' && Object.keys(observation.detailedReflection).length > 2 ? (
                <div className="space-y-6 pt-6 border-t-[3px] border-border/60">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-info/10">
                      <MessageSquare className="w-6 h-6 text-info" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Your Reflection</h3>
                      <p className="text-sm text-zinc-900">Self-assessment based on Ekya Danielson Framework</p>
                    </div>
                  </div>

                  <Card className="border-info/20 shadow-sm overflow-hidden bg-info/5">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 gap-4 p-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-backgroundackgroundackground rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-zinc-900 uppercase mb-1">Strengths</span>
                          <p className="font-bold text-sm">{observation.detailedReflection.strengths}</p>
                        </div>
                        <div className="p-4 bg-backgroundackgroundackground rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-zinc-900 uppercase mb-1">Growth Areas</span>
                          <p className="font-bold text-sm">{observation.detailedReflection.improvements}</p>
                        </div>
                        <div className="p-4 bg-backgroundackgroundackground rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-zinc-900 uppercase mb-1">Goal</span>
                          <p className="font-bold text-sm">{observation.detailedReflection.goal}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (observation.hasReflection || observation.teacherReflection || observation.reflection) && (
                <div className="space-y-4 pt-6 border-t border-border/60">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-info">
                    <MessageSquare className="w-5 h-5" />
                    Your Reflection
                  </h3>
                  <div className="p-6 rounded-2xl bg-info/5 border border-info/10 text-foreground leading-relaxed">
                    "{observation.teacherReflection || observation.reflection || "Teacher form reflection submitted."}"
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Sidebar with Actions / Stats */}
          <Card className="  shadow-lg sticky top-6 print:hidden">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2" variant="outline" onClick={() => window.print()}>
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <div className="p-4 rounded-xl bg-muted/50 text-sm text-zinc-900">
                If you have questions about this observation, please schedule a debrief with your observer.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}

