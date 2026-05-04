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
  Loader2,
  Lock as LockIcon
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
    <div className="space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-white p-10 md:p-20 mb-12 shadow-[0_20px_50px_-20px_rgba(234,16,74,0.15)] border border-primary/5">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-24 translate-x-24 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-8 flex-1">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-white border border-primary/10 shadow-sm backdrop-blur-xl">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase">Elite Educator Platform</span>
              <div className="h-4 w-px bg-primary/10 mx-1" />
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">Growth Loop Active</span>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                Hello, <span className="text-primary">{userName.split(' ')[0]}!</span>
              </h1>
              <p className="text-slate-600 text-2xl font-medium max-w-2xl leading-relaxed">
                Your journey of <span className="text-slate-900 font-black">impact and excellence</span> continues here. Empowering every classroom moment.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <QuickActionButtons role={role as any} />
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {isModuleEnabled('/teacher/observations', role) && (
          <StatCard
            title="Professional Observations"
            value={observations.length}
            subtitle={`${reflectionsCount} Growth Loops Completed`}
            icon={TrendingUp}
            onClick={() => navigate("/teacher/observations")}
          />
        )}
        {isModuleEnabled('/teacher/goals', role) && (
          <StatCard
            title="Strategic Goals"
            value={goals.length}
            subtitle={`${schoolAlignedGoals} Mission Aligned`}
            icon={Target}
            onClick={() => navigate("/teacher/goals")}
          />
        )}
        {isModuleEnabled('/teacher/hours', role) && (
          <StatCard
            title="Academic Credits"
            value={pdHours.total}
            subtitle="Training Hours Accrued"
            icon={Clock}
            trend={pdHours.total > 0 ? { value: 12, isPositive: true } : undefined}
            onClick={() => navigate("/teacher/hours")}
          />
        )}
        {isModuleEnabled('/teacher/calendar', role) && upcomingTrainings > 0 && (
          <StatCard
            title="Next Milestone"
            value={upcomingTrainings}
            subtitle={nextEventSubtitle}
            icon={Calendar}
            onClick={() => navigate("/teacher/calendar")}
          />
        )}
      </div>

      {/* Key Domain Hubs */}
      <div className="space-y-10 mb-16">
        <div className="flex items-center gap-5">
          <div className="w-2.5 h-12 rounded-full bg-primary shadow-[0_0_25px_rgba(234,16,74,0.4)]"></div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Professional Domain Hubs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {isModuleEnabled('/departments/pd/edu-hub/culture-environment', role) && (
            <Card 
              className="group cursor-pointer border border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_30px_70px_rgba(234,16,74,0.08)] hover:-translate-y-2"
              onClick={() => navigate("/departments/pd/edu-hub/culture-environment")}
            >
              <CardContent className="p-12 relative">
                <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/[0.02] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="flex items-start justify-between">
                  <div className="space-y-8">
                    <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 shadow-sm transition-all duration-500">
                      <ShieldCheck className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Culture & Environment</h3>
                      <p className="text-slate-500 font-semibold mt-3 text-lg max-w-sm leading-relaxed">Institutional standards and classroom excellence framework.</p>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary shadow-sm transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isModuleEnabled('/departments/pd/edu-hub/lac', role) && (
            <Card 
              className="group cursor-pointer border border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_30px_70px_rgba(234,16,74,0.08)] hover:-translate-y-2"
              onClick={() => navigate("/departments/pd/edu-hub/lac")}
            >
              <CardContent className="p-12 relative">
                <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/[0.02] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="flex items-start justify-between">
                  <div className="space-y-8">
                    <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:scale-110 group-hover:-rotate-6 shadow-sm transition-all duration-500">
                      <ClipboardCheck className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">LAC Framework</h3>
                      <p className="text-slate-500 font-semibold mt-3 text-lg max-w-sm leading-relaxed">Learning Accountability Checklist & curriculum alignment tracking.</p>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary shadow-sm transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* PD Progress Widget */}
      <Card className="relative overflow-hidden border-none shadow-[0_40px_80px_-20px_rgba(234,16,74,0.15)] rounded-[3.5rem] bg-white mb-16 group">
        <div className="absolute inset-0 bg-primary/[0.01] group-hover:bg-primary/[0.03] transition-colors duration-700" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px]" />

        <CardContent className="p-14 md:p-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            <div className="flex items-center gap-12">
              <div className="w-28 h-28 rounded-[2.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner group-hover:rotate-12 transition-all duration-700">
                <Trophy className="w-14 h-14 text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Development Target</h3>
                <div className="flex items-center gap-4 text-primary font-black text-sm tracking-[0.25em] uppercase bg-primary/5 px-6 py-2 rounded-2xl border border-primary/10 w-fit">
                  <Zap className="w-5 h-5 fill-current" />
                  20-Hour Annual Requirement
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-3xl space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <div className="text-7xl font-black text-slate-900 flex items-baseline gap-4">
                    {pdHours.total}
                    <span className="text-3xl font-bold text-slate-400 tracking-tight">/ 20 hrs</span>
                  </div>
                </div>
                <div className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-[11px] tracking-[0.25em] uppercase shadow-[0_10px_25px_rgba(234,16,74,0.3)] animate-pulse">
                  {Math.max(0, 20 - pdHours.total)} hrs remaining
                </div>
              </div>
              <div className="relative h-8 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-1.5">
                <div
                  className="h-full bg-primary rounded-full shadow-[0_0_25px_rgba(234,16,74,0.4)] transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.min(100, (pdHours.total / 20) * 100)}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                </div>
              </div>
            </div>

            <Button
              className="bg-primary text-white hover:bg-primary/90 font-black px-16 h-20 rounded-[2rem] shadow-[0_20px_40px_rgba(234,16,74,0.2)] transition-all duration-500 hover:scale-105 active:scale-95 group/btn uppercase tracking-widest text-sm"
              onClick={() => navigate("/teacher/calendar")}
            >
              {pdHours.total >= 20 ? "Explore Modules" : pdHours.total > 0 ? "Resume Learning" : "Begin Training"}
              <ArrowUpRight className="ml-4 w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-12">
        {isModuleEnabled('/teacher/observations', role) && (
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 rounded-full bg-primary shadow-[0_0_20px_rgba(234,16,74,0.3)]"></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Recent Observations</h2>
              </div>
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5 text-primary font-black text-xs uppercase tracking-widest px-6">
                <Link to="/teacher/observations">
                  View All
                  <TrendingUp className="ml-3 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="space-y-6">
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
                <Card className="bg-white border border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-16 flex flex-col items-center justify-center text-center space-y-6 rounded-[2.5rem]">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                    <Eye className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-2xl font-black text-slate-900 tracking-tight uppercase">No observations yet</p>
                    <p className="text-slate-500 font-semibold max-w-[320px] mx-auto text-lg">
                      Once your school leader records an observation, you'll see the details and feedback right here.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {isModuleEnabled('/teacher/goals', role) && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 rounded-full bg-primary shadow-[0_0_20px_rgba(234,16,74,0.3)]"></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">My Goals</h2>
              </div>
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5 text-primary font-black text-xs uppercase tracking-widest px-6">
                <Link to="/teacher/goals">View All</Link>
              </Button>
            </div>
            <div className="space-y-6">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))
              ) : (
                <Card className="bg-white border border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-16 flex flex-col items-center justify-center text-center space-y-6 rounded-[2.5rem]">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                    <Target className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-2xl font-black text-slate-900 tracking-tight uppercase">No goals set yet</p>
                    <p className="text-slate-500 font-semibold max-w-[320px] mx-auto text-lg">
                      Work with your school leader to define your development goals for this academic year.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {isModuleEnabled('/teacher/calendar', role) && futureEvents.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="w-2.5 h-12 rounded-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)]"></div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Upcoming Training</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="hover:bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-widest px-8 h-14 rounded-2xl border border-emerald-100">
              <Link to="/teacher/calendar">View Calendar</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-primary/5 bg-white overflow-hidden mb-12 rounded-[2.5rem]">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-10">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Upcoming Scheduled Observations</CardTitle>
                <CardDescription className="text-slate-500 font-semibold text-base mt-1">Scheduled check-ins from school leadership.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="py-6 px-10 font-black uppercase tracking-[0.2em] text-[10px] w-[100px] text-center text-slate-400">S.No.</TableHead>
                  <TableHead className="py-6 px-10 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Observation Title</TableHead>
                  <TableHead className="py-6 px-10 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Type</TableHead>
                  <TableHead className="py-6 px-10 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Schedule</TableHead>
                  <TableHead className="py-6 px-10 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingObservations.length > 0 ? upcomingObservations.map((obs, index) => (
                  <TableRow key={obs.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                    <TableCell className="font-black text-slate-400 text-center text-sm px-10 py-8">{String(index + 1).padStart(2, '0')}</TableCell>
                    <TableCell className="px-10 py-8">
                      <p className="font-black text-slate-900 text-lg tracking-tight">{obs.title}</p>
                    </TableCell>
                    <TableCell className="px-10 py-8">
                      <Badge className="bg-primary/5 text-primary border border-primary/10 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg shadow-sm">
                        Observation
                      </Badge>
                    </TableCell>
                    <TableCell className="px-10 py-8">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 text-sm font-black text-slate-900 uppercase tracking-tight">
                          <Calendar className="w-4 h-4 text-primary" />
                          {obs.date}
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-6">
                          <Clock className="w-3.5 h-3.5" />
                          {obs.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-10 py-8">
                      <div className="flex items-center gap-2.5 text-sm font-bold text-slate-600">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        {obs.location}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-2">
                          <Calendar className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-xl font-black text-slate-900 uppercase tracking-tight">No upcoming observations</p>
                        <p className="text-slate-400 font-semibold max-w-[300px] mx-auto">Check back later or contact your school leader for scheduling.</p>
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
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white overflow-hidden mb-12 rounded-[2.5rem]">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-10">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Observation Score Progression</CardTitle>
                <CardDescription className="text-slate-500 font-semibold text-base mt-1">Visualizing your scores across formal observations over time.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-12 pb-6 px-10">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA104A" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#EA104A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis
                    domain={[0, 5]}
                    tickCount={6}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    dx={-15}
                  />
                  <RechartsTooltip
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: '1px solid rgba(234, 16, 74, 0.1)', 
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
                      padding: '16px'
                    }}
                    labelStyle={{ fontWeight: '900', color: '#0f172a', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    itemStyle={{ color: '#EA104A', fontWeight: 700, fontSize: '14px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#EA104A"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}





      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="w-16 px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">#</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Record Data</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span>Taxonomy</span>
                    <select
                      className="text-[9px] font-black border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-900 cursor-pointer hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 uppercase tracking-widest transition-all"
                      value={learningAreaFilter}
                      onChange={(e) => setLearningAreaFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All Fields</option>
                      {focusAreas.map(f => (
                        <option key={String(f)} value={String(f)}>{String(f)}</option>
                      ))}
                    </select>
                  </div>
                </TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span>Performance</span>
                    <select
                      className="text-[9px] font-black border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-900 cursor-pointer hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 uppercase tracking-widest transition-all"
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All Ranges</option>
                      <option value="highly-effective">Highly Effective</option>
                      <option value="effective">Effective</option>
                      <option value="developing">Developing</option>
                      <option value="basic">Basic</option>
                    </select>
                  </div>
                </TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Index</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loop Status</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObservations.map((obs, index) => (
                <TableRow key={obs.id} className="hover:bg-slate-50/50 transition-all duration-300 group border-b border-slate-50 last:border-0">
                  <TableCell className="px-8 py-8 text-[10px] font-black text-slate-300 uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell className="px-8 py-8">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{obs.date}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Official Academic Record</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">
                        {obs.learningArea || (obs as any).subject || "General Pedagogical Review"}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center border border-primary/10">
                            <User className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                          {obs.observerName || "Campus Leader"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-8">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg">
                        {String((obs as any).moduleType || obs.domain).replace('_', ' ')}
                      </Badge>
                      {(obs.type === "Quick Feedback" || obs.domain === "Quick Feedback" || (obs as any).moduleType === "QUICK_FEEDBACK" || obs.domain === "QUICK_FEEDBACK") && (
                        <Badge className="bg-primary text-white shadow-lg shadow-primary/20 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg gap-1.5">
                          <Zap className="w-3 h-3 fill-current" />
                          Impact
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-8 text-center">
                    {(obs.type === "Quick Feedback" || obs.domain === "Quick Feedback" || (obs as any).moduleType === "QUICK_FEEDBACK" || obs.domain === "QUICK_FEEDBACK") ? (
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 font-black text-[10px] uppercase tracking-widest border border-slate-100">
                        N/A
                      </div>
                    ) : obs.score !== undefined ? (
                      <div className={cn(
                        "inline-flex items-center justify-center w-14 h-14 rounded-2xl font-black text-base shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                        obs.score >= 3.5 ? "bg-emerald-500 text-white shadow-emerald-500/30" :
                        obs.score >= 2.5 ? "bg-amber-500 text-white shadow-amber-500/30" : "bg-primary text-white shadow-primary/30"
                      )}>
                        {obs.score}
                      </div>
                    ) : (
                      <span className="text-slate-200 font-black">--</span>
                    )}
                  </TableCell>
                  <TableCell className="px-8 py-8">
                    {obs.hasReflection ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest gap-2 py-2.5 px-4 rounded-xl shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Loop Closed
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest py-2.5 px-4 rounded-xl shadow-sm">
                        Action Required
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 hover:bg-primary/5 hover:text-primary rounded-2xl border border-transparent hover:border-primary/10 transition-all shadow-sm bg-white"
                        onClick={() => onView(obs.id)}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      {!obs.hasReflection && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 hover:bg-primary/5 hover:text-primary rounded-2xl border border-transparent hover:border-primary/10 transition-all shadow-sm bg-white"
                          onClick={() => onReflect(obs)}
                        >
                          <MessageSquare className="w-5 h-5 text-amber-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredObservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-4 border-dashed border-slate-100">
                        <Eye className="w-12 h-12 text-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">No records identified</p>
                        <p className="text-slate-400 font-semibold text-sm">Refine your strategic filters or search criteria.</p>
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

    <div className="space-y-10 animate-in fade-in duration-500 slide-in-from-bottom-6">
      {selectedReflectGoal && (
        <GoalWorkflowForms
          goal={selectedReflectGoal}
          role={role === 'LEADER' ? 'LEADER' : role === 'ADMIN' ? 'ADMIN' : 'TEACHER'}
          onComplete={() => { setSelectedReflectGoal(null); fetchGoals(); }}
          onClose={() => { setSelectedReflectGoal(null); fetchGoals(); }}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <PageHeader title="Professional Growth Goals" subtitle="Strategic objectives aligned with academic excellence" />

        <div className="flex flex-wrap gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors group-hover:text-primary" />
            <Input
              placeholder="Search growth objectives..."
              className="pl-14 h-16 rounded-[1.5rem] border-primary/5 focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] font-semibold text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-16 px-8 gap-4 rounded-[1.5rem] border-primary/5 hover:border-primary/20 hover:bg-primary/5 font-black text-[11px] uppercase tracking-widest transition-all shadow-sm bg-white">
                <Filter className="w-5 h-5 text-primary" />
                {filter === "all" ? "All Strategic Tracks" :
                  filter === "school" ? "Core Institutional Alignment" :
                    filter === "professional" ? "Professional Practice" :
                      filter === "completed" ? "Successfully Achieved" : "Active Development"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-primary/5 p-3 min-w-[280px]">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 p-4">Filter Dimensions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilter("all")} className="rounded-xl font-black text-[11px] uppercase tracking-widest py-4 px-6 hover:bg-primary/5 hover:text-primary transition-colors">All Strategic Goals</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("school")} className="rounded-xl font-black text-[11px] uppercase tracking-widest py-4 px-6 hover:bg-primary/5 hover:text-primary transition-colors">School Priorities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("professional")} className="rounded-xl font-black text-[11px] uppercase tracking-widest py-4 px-6 hover:bg-primary/5 hover:text-primary transition-colors">Professional Practice</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-2" />
              <DropdownMenuItem onClick={() => setFilter("completed")} className="rounded-xl font-black text-[11px] uppercase tracking-widest py-4 px-6 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Completed Milestones</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("in-progress")} className="rounded-xl font-black text-[11px] uppercase tracking-widest py-4 px-6 hover:bg-amber-50 hover:text-amber-600 transition-colors">Active Development</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isReflectionWindowOpen && !hasExistingReflection && (
            <Button className="h-16 px-10 gap-4 rounded-[1.5rem] bg-primary text-white shadow-[0_20px_40px_rgba(234,16,74,0.2)] hover:scale-105 active:scale-95 transition-all font-black text-[11px] uppercase tracking-widest" onClick={handleInitiateReflection} disabled={isInitiating}>
              {isInitiating ? "Processing Hub..." : "Open Annual Reflection"}
              <Sparkles className="w-5 h-5 animate-pulse" />
            </Button>
          )}

          <Dialog open={showClosedPopup} onOpenChange={setShowClosedPopup}>
            <DialogContent className="rounded-[3rem] p-16 border-none shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden bg-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.03] rounded-full blur-[100px] -translate-y-16 translate-x-16" />
              <DialogHeader>
                <div className="w-20 h-20 rounded-[1.5rem] bg-primary/5 flex items-center justify-center mb-10 border border-primary/10 shadow-inner">
                    <LockIcon className="w-10 h-10 text-primary" />
                </div>
                <DialogTitle className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Access Restricted</DialogTitle>
                <DialogDescription className="pt-6 text-xl font-semibold text-slate-500 leading-relaxed">
                  The strategic reflection window is currently <span className="text-primary font-black">LOCKED</span>. Coordinate with your department lead or notify administration to request an override.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-6 pt-16">
                <Button variant="ghost" onClick={() => setShowClosedPopup(false)} className="rounded-2xl h-16 px-10 font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50">Dismiss</Button>
                <Button
                  className="bg-primary text-white h-16 px-12 rounded-2xl shadow-[0_20px_40px_rgba(234,16,74,0.2)] font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105"
                  onClick={handleNotifyAdmin}
                  disabled={isNotifying}
                >
                  {isNotifying ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Dispatching Alert...
                    </>
                  ) : 'Notify Academic Admin'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="w-16 px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">#</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Strategic Objective</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Alignment Track</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Development Velocity</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Milestone</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Execution</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGoals.map((goal, index) => (
                <TableRow key={goal.id} className="hover:bg-slate-50/50 transition-all duration-300 group border-b border-slate-50 last:border-0">
                  <TableCell className="px-8 py-10 text-[10px] font-black text-slate-300 uppercase">{String(index + 1).padStart(2, '0')}</TableCell>
                  <TableCell className="px-8 py-10 max-w-[320px]">
                    <div className="flex flex-col gap-2.5">
                      <span className="font-black text-slate-900 group-hover:text-primary transition-colors text-base uppercase tracking-tight leading-tight">
                        {goal.title}
                      </span>
                      {goal.description && (
                        <span className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">{goal.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-10">
                    <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-lg border-none shadow-sm",
                        goal.isSchoolAligned ? "bg-primary text-white shadow-primary/20" : "bg-slate-100 text-slate-600"
                    )}>
                      {goal.isSchoolAligned ? "Core Institutional" : "Professional Practice"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-10 w-64">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">{goal.progress || 0}% Mastery</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-100">
                        <Progress value={goal.progress || 0} className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(234,16,74,0.3)]" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-10">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {formatDate(goal.dueDate || goal.endDate)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Strategic Deadline</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-10">
                    {(goal.progress || 0) >= 100 ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest gap-2 py-2.5 px-4 rounded-xl shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Achieved
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest py-2.5 px-4 rounded-xl shadow-sm">
                        In Progress
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-8 py-10 text-right">
                    <Button
                      variant="ghost"
                      className="h-12 px-8 hover:bg-primary/5 hover:text-primary rounded-2xl text-[11px] font-black uppercase tracking-widest border border-transparent hover:border-primary/10 transition-all bg-white shadow-sm"
                      onClick={() => setSelectedReflectGoal(goal)}
                    >
                      {goal.selfReflection ? "Open Journal" : "Reflection"}
                      <ArrowUpRight className="ml-3 w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGoals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-8">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-4 border-dashed border-slate-100">
                        <Target className="w-12 h-12 text-slate-200" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter">No Active Objectives</p>
                        <p className="text-slate-400 font-semibold text-lg">Refine your strategic filters or initiate a new growth objective.</p>
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
    <div className="space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-8">
      <PageHeader
        title="Development Calendar"
        subtitle="Discover and coordinate your professional learning sessions"
      />

      <div className="w-full space-y-12">
        <Card className="shadow-[0_20px_50px_-20px_rgba(234,16,74,0.15)] bg-white overflow-hidden relative border border-primary/5 rounded-[3.5rem]">
          {/* decorative gradient blobs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px] -translate-y-32 translate-x-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/[0.04] rounded-full blur-[100px] translate-y-32 -translate-x-32 pointer-events-none" />

          <CardContent className="p-12 md:p-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
              {/* Left side: Header and Calendar */}
              <div className="lg:col-span-7 space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Academic Schedule</h3>
                    <p className="text-primary text-sm font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        {formatDateStr(new Date())}
                    </p>
                  </div>
                </div>

                <CalendarUI
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-[3rem] border border-slate-100 bg-slate-50/30 p-12 w-full shadow-inner"
                  classNames={{
                    months: "flex flex-col space-y-10",
                    month: "space-y-10 w-full",
                    caption: "flex justify-between items-center mb-12 px-6",
                    caption_label: "text-3xl font-black text-slate-900 uppercase tracking-tighter",
                    nav: "flex items-center gap-4",
                    nav_button: "h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white border border-slate-200 shadow-sm transition-all duration-500 hover:scale-110",
                    nav_button_previous: "",
                    nav_button_next: "",
                    table: "w-full border-collapse",
                    weekdays: "flex w-full mb-6",
                    weekday: "text-slate-400 font-black text-[11px] uppercase tracking-[0.4em] w-full text-center py-6",
                    week: "flex w-full mb-3 last:mb-0",
                    day: "w-full text-center p-0 relative min-h-[90px] flex items-center justify-center",
                    day_button: "h-16 w-16 p-0 mx-auto font-black text-base text-slate-900 hover:bg-primary/5 hover:text-primary rounded-[1.5rem] transition-all duration-300 flex items-center justify-center relative",
                    selected: "bg-primary text-white hover:bg-primary/90 focus:bg-primary shadow-[0_15px_30px_rgba(234,16,74,0.3)] scale-110 rotate-3 z-10",
                    today: "bg-slate-100 text-slate-900 ring-4 ring-primary/10",
                    outside: "text-slate-200 opacity-20",
                  }}
                  modifiers={{
                    hasEvent: events.map(e => parseEventDate(e.date))
                  }}
                  modifiersStyles={{
                    hasEvent: { border: '3px solid #EA104A', color: '#EA104A', fontWeight: '900' }
                  }}
                />
              </div>

              {/* Right side: Legend and Actions */}
              <div className="lg:col-span-5 h-full flex flex-col justify-center">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Professional Streams</h4>
                    <div className="grid gap-5">
                        <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <span className="flex items-center gap-5 text-sm font-black text-slate-900 uppercase tracking-widest">
                            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(234,16,74,0.5)] group-hover:scale-125 transition-transform"></div> Pedagogy
                        </span>
                        <Badge className="bg-primary/5 text-primary border-none px-5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest">
                            {events.filter((t: any) => (t.topic || t.type) === 'Pedagogy').length} Sessions
                        </Badge>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <span className="flex items-center gap-5 text-sm font-black text-slate-900 uppercase tracking-widest">
                            <div className="w-4 h-4 rounded-full bg-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.3)] group-hover:scale-125 transition-transform"></div> Technology
                        </span>
                        <Badge className="bg-slate-50 text-slate-500 border-none px-5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest">
                            {events.filter((t: any) => (t.topic || t.type) === 'Technology').length} Sessions
                        </Badge>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <span className="flex items-center gap-5 text-sm font-black text-slate-900 uppercase tracking-widest">
                            <div className="w-4 h-4 rounded-full bg-slate-200 group-hover:scale-125 transition-transform"></div> Culture
                        </span>
                        <Badge className="bg-slate-50 text-slate-400 border-none px-5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest">
                            {events.filter((t: any) => (t.topic || t.type) === 'Culture').length} Sessions
                        </Badge>
                        </div>
                    </div>
                  </div>

                  <div className="pt-12 space-y-8">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Discovery Filters</h4>
                    <div className="grid gap-6">
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="bg-white border-slate-100 text-slate-900 rounded-[1.5rem] h-16 px-8 text-[11px] font-black uppercase tracking-widest focus:ring-primary/10 shadow-sm hover:border-primary/20 transition-all">
                          <SelectValue placeholder="Select Focus Stream" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-slate-100 p-2">
                          <SelectItem value="all" className="text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">All Learning Streams</SelectItem>
                          {eventTypes.map(type => (
                            <SelectItem key={type} value={type} className="text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="bg-white border-slate-100 text-slate-900 rounded-[1.5rem] h-16 px-8 text-[11px] font-black uppercase tracking-widest focus:ring-primary/10 shadow-sm hover:border-primary/20 transition-all">
                          <SelectValue placeholder="Select Campus" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-slate-100 p-2">
                          <SelectItem value="all" className="text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">All Global Campuses</SelectItem>
                          <SelectItem value="EBTM" className="text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">BTM Layout</SelectItem>
                          <SelectItem value="EJPN" className="text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">JP Nagar</SelectItem>
                          <SelectItem value="EITPL" className="text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">ITPL</SelectItem>
                          <SelectItem value="ENICE" className="text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">NICE Road</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      variant="ghost"
                      className="w-full py-8 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl border border-transparent hover:border-primary/10"
                      onClick={() => {
                        setDate(undefined);
                        setSelectedType("all");
                        setSelectedCampus("all");
                        setSearchQuery("");
                      }}
                      disabled={!date && selectedType === "all" && selectedCampus === "all" && searchQuery === ""}
                    >
                      Reset Discovery Parameters
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
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b hover:bg-transparent">
                  <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Session Title</TableHead>
                  <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Type</TableHead>
                  <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Time</TableHead>
                  <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Location</TableHead>
                  <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70">Status</TableHead>
                  <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-zinc-900/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-muted/10">

                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((session, index) => (
                      <TableRow key={session.id} className="hover:bg-slate-50/50 transition-all duration-300 group border-b border-slate-50 last:border-0">
                        <TableCell className="px-8 py-10">
                          <div className="flex flex-col gap-2">
                            <span className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{session.title}</span>
                            {!date && (
                              <div className="flex items-center gap-2.5">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {session.date}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-10">
                          <Badge className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border-none shadow-sm">
                            {session.entryType === 'Observation' ? 'Strategic Observation' : (session.topic || session.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-10">
                          <div className="text-sm font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                            <Clock className="w-4.5 h-4.5 text-primary" />
                            {session.time}
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-10">
                          <div className="text-xs font-black text-slate-500 flex items-center gap-3 uppercase tracking-widest">
                            <MapPin className="w-4.5 h-4.5 text-slate-300" />
                            {session.location}
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-10">
                          <span className={cn(
                            "inline-flex items-center px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border",
                            session.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                            {session.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-8 py-10 text-right">
                          {session.isRegistered ? (
                            <div className="flex items-center justify-end gap-3 text-emerald-600 font-black text-[11px] uppercase tracking-widest">
                              <CheckCircle2 className="w-5 h-5" />
                              Registration Confirmed
                            </div>
                          ) : (
                            <Button
                              className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-[0_15px_30px_rgba(234,16,74,0.2)] transition-all hover:scale-105 active:scale-95 font-black text-[11px] uppercase tracking-widest"
                              onClick={() => onRegister(session.id)}
                            >
                              Secure Slot
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-40 text-center">
                        <div className="flex flex-col items-center gap-8">
                          <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-4 border-dashed border-slate-100">
                            <Calendar className="w-12 h-12 text-slate-200" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">No Sessions Identified</p>
                            <p className="text-slate-400 font-semibold text-lg italic">Adjust your discovery parameters for broader results.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
    <div className="space-y-12 animate-in fade-in duration-700 slide-in-from-bottom-6">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-8">
        <div className="flex items-center gap-6">
          <div className="relative group w-full md:w-[450px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors group-hover:text-primary" />
            <Input
              className="pl-16 h-16 rounded-[1.5rem] border-primary/5 focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] font-semibold text-lg"
              placeholder="Search academic catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-16 w-16 rounded-[1.5rem] border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all p-0 shadow-sm bg-white">
                <Filter className="w-6 h-6 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-primary/5 p-3 min-w-[240px]">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 p-4">Academic Streams</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedCategory("all")} className="rounded-xl font-black text-[11px] uppercase tracking-widest py-4 px-6 hover:bg-primary/5 hover:text-primary transition-colors">All Disciplines</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-2" />
              {allCategories.map(category => (
                <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)} className="rounded-xl font-black text-[11px] uppercase tracking-widest py-4 px-6 hover:bg-primary/5 hover:text-primary transition-colors">
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-24">
        {/* In Progress */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-2 h-12 rounded-full bg-primary shadow-[0_0_25px_rgba(234,16,74,0.4)]"></div>
            <div className="space-y-1">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Active Curriculum</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Continue your professional development journey</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.filter(c => c.status === 'in-progress').map(course => (
              <CourseCard key={course.id} course={course} onEnrollSuccess={onEnrollSuccess} />
            ))}
            {filteredCourses.filter(c => c.status === 'in-progress').length === 0 && (
                <div className="col-span-full py-16 rounded-[2.5rem] bg-slate-50/50 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                    <p className="text-lg font-black text-slate-300 uppercase tracking-widest">No Active Courses</p>
                    <p className="text-sm text-slate-400 font-semibold italic">Explore the catalogue below to commence your next module.</p>
                </div>
            )}
          </div>
        </section>

        {/* Recommended */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-2 h-12 rounded-full bg-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)]"></div>
            <div className="space-y-1">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Strategic Catalysts</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recommended pathways aligned with institutional goals</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.filter(c => c.status === 'recommended').map(course => (
              <CourseCard key={course.id} course={course} onEnrollSuccess={onEnrollSuccess} />
            ))}
          </div>
        </section>

        {/* Completed */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-2 h-12 rounded-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)]"></div>
            <div className="space-y-1">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Secured Credentials</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Successfully completed professional learning modules</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.filter(c => c.status === 'completed').map(course => (
              <CourseCard key={course.id} course={course} onEnrollSuccess={onEnrollSuccess} />
            ))}
          </div>
        </section>
      </div>
    </div>
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
  const [selectedDraftData, setSelectedDraftData] = useState<any>(null);

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
        await api.patch(`/mooc/${currentDraftMoocId}/draft`, payload);
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader
          title="MOOC Portfolio"
          subtitle="Manage and showcase your certified online learning achievements"
        />
        <Button onClick={() => {
          setCurrentDraftMoocId(null);
          setSelectedDraftData(null);
          setIsMoocFormOpen(true);
        }} className="h-14 px-8 gap-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest group">
          <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
          Log New Certification
        </Button>
      </div>

      <Dialog open={isMoocFormOpen} onOpenChange={setIsMoocFormOpen}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-none rounded-[3rem] p-0">
          <div className="sr-only"><DialogTitle>Submit MOOC Evidence</DialogTitle></div>
          <MoocEvidenceForm
            onCancel={() => {
              setIsMoocFormOpen(false);
              setCurrentDraftMoocId(null);
              setSelectedDraftData(null);
            }}
            onSubmitSuccess={() => {
              setIsMoocFormOpen(false);
              setCurrentDraftMoocId(null);
              setSelectedDraftData(null);
              fetchSubmissions();
            }}
            onAutoSave={handleAutoSave}
            userEmail={user?.email || ""}
            userName={user?.fullName || ""}
            initialData={selectedDraftData}
          />
        </DialogContent>
      </Dialog>

      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="w-16 px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">#</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Certification Details</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>Platform</span>
                    <select
                      className="text-[9px] font-black border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-900 cursor-pointer hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 uppercase tracking-widest transition-all"
                      value={moocPlatformFilter}
                      onChange={(e) => setMoocPlatformFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All Channels</option>
                      {Array.from(new Set(submissions.map(s => s.platform === 'Other' ? s.otherPlatform : s.platform).filter(Boolean))).map(p => (
                        <option key={String(p)} value={String(p)}>{String(p)}</option>
                      ))}
                    </select>
                  </div>
                </TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hours</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Logged On</TableHead>
                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <span>Audit Status</span>
                    <select
                      className="text-[9px] font-black border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-900 cursor-pointer hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 uppercase tracking-widest transition-all"
                      value={moocStatusFilter}
                      onChange={(e) => setMoocStatusFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All States</option>
                      <option value="PENDING">Pending Review</option>
                      <option value="APPROVED">Verified</option>
                      <option value="REJECTED">Flagged</option>
                    </select>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center border-4 border-slate-100 border-t-primary animate-spin" />
                      <p className="text-primary font-black text-xs tracking-[0.3em] uppercase">Syncing Portfolio Records...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-10">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-4 border-dashed border-slate-100">
                        <History className="w-12 h-12 text-slate-200" />
                      </div>
                      <div className="space-y-4">
                        <p className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">No Certifications Logged</p>
                        <p className="text-slate-400 font-semibold text-lg italic max-w-md mx-auto">Upload your MOOC evidence to start accruing professional credits toward your annual target.</p>
                      </div>
                      <Button variant="outline" className="h-14 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest border-primary/10 hover:bg-primary/5 transition-all shadow-sm bg-white" onClick={() => setIsMoocFormOpen(true)}>Initialize First Submission</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : submissions
                  .filter(s => moocPlatformFilter === 'all' || (s.platform === 'Other' ? s.otherPlatform : s.platform) === moocPlatformFilter)
                  .filter(s => moocStatusFilter === 'all' || (s.status || 'PENDING') === moocStatusFilter)
                  .map((sub, idx) => (
                <TableRow 
                  key={sub.id} 
                  className={cn("hover:bg-slate-50/50 transition-all duration-300 group border-b border-slate-50 last:border-0", sub.status === 'DRAFT' && "cursor-pointer")}
                  onClick={() => {
                    if (sub.status === 'DRAFT') {
                      setCurrentDraftMoocId(sub.id);
                      setSelectedDraftData(sub);
                      setIsMoocFormOpen(true);
                    }
                  }}
                >
                  <TableCell className="px-8 py-10 text-[10px] font-black text-slate-300 text-center uppercase">{(idx + 1).toString().padStart(2, '0')}</TableCell>
                  <TableCell className="px-8 py-10">
                    <div className="flex flex-col gap-2.5">
                      <span className="font-black text-slate-900 group-hover:text-primary transition-colors text-base tracking-tight leading-tight uppercase">{sub.courseName}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center border border-primary/10">
                            <Calendar className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(sub.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-10">
                    <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg shadow-sm">
                      {sub.platform === 'Other' ? sub.otherPlatform : sub.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-10">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xl font-black text-slate-900 uppercase tracking-tight">{sub.hours}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Hrs</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-10">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Submission Date</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-10 text-right">
                    <Badge className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.03)] border transition-all group-hover:scale-105",
                      sub.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        sub.status === 'REJECTED' ? "bg-primary text-white border-none shadow-primary/20" :
                          "bg-amber-50 text-amber-600 border-amber-100"
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
    <Card className="group hover:shadow-2xl transition-all duration-500 bg-white border border-primary/5 rounded-[2rem] overflow-hidden flex flex-col h-full hover:-translate-y-2">
      <div className={cn("h-48 w-full relative overflow-hidden", course.thumbnail)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white text-primary border-none shadow-lg font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg">
            {course.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">
                <Clock className="w-3 h-3" />
                {course.duration}
            </div>
        </div>
      </div>
      <CardHeader className="p-8 pb-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-black leading-tight group-hover:text-primary transition-colors cursor-pointer uppercase tracking-tight">
            {course.title}
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-500 bg-amber-500/5 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            {course.rating}
          </div>
        </div>
        <CardDescription className="text-xs font-bold text-muted-foreground pt-1">Academic Facilitator: <span className="text-foreground uppercase tracking-wider">{course.instructor}</span></CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0 flex-1">
        {course.status === 'in-progress' ? (
          <div className="space-y-4 mt-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
              <span>Syllabus Mastery</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden shadow-inner p-0.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(234,16,74,0.3)]"
                style={{ width: `${course.progress}% ` }}
              />
            </div>
          </div>
        ) : course.status === 'completed' ? (
          <div className="flex items-center gap-3 text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-4 bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10">
            <CheckCircle2 className="w-4 h-4" />
            Certification Secured
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-medium leading-relaxed italic">
            "Strategic exploration of {course.title.toLowerCase()} methodologies designed for high-impact educational delivery."
          </p>
        )}
      </CardContent>
      <div className="p-8 pt-0 mt-auto">
        <Button
          className={cn(
            "w-full h-14 rounded-2xl gap-3 group/btn font-black text-[10px] uppercase tracking-widest transition-all",
            course.status === 'in-progress' ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]" : "bg-white text-primary border-primary/20 border-2 hover:bg-primary/5"
          )}
          disabled={enrolling}
          onClick={async () => {
            if (course.isDownloadable && course.url) {
              window.open(course.url, '_blank');
            } else if (course.status === 'recommended') {
              setEnrolling(true);
              try {
                await api.post(`/courses/${course.id}/enroll`);
                toast.success("Academic enrollment confirmed!");
                onEnrollSuccess?.();
              } catch (e: any) {
                toast.error(e.response?.data?.message || "Enrollment failure");
              } finally {
                setEnrolling(false);
              }
            } else {
              toast.info("Curriculum access coming soon!");
            }
          }}
        >
          {enrolling ? 'Processing...' : course.status === 'in-progress' ? 'Continue Practicum' : course.status === 'completed' ? 'Review Synthesis' : 'Commence Learning'}
          {course.isDownloadable ? <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
        </Button>
      </div>
    </Card>
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
      headStyles: { fillColor: [234, 16, 74], textColor: 255, fontStyle: 'bold' },
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
        backgroundColor: "#ffffff"
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader title="Training Hours Protocol" subtitle="Strategic tracking of professional development milestones" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8" id="pd-hours-summary-container">
        {/* Progress Card */}
        <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[2.5rem] border border-primary/5">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-3xl font-black text-foreground uppercase tracking-tight">Annual Target Progress</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Achieved Credits</span>
                  <span className="text-xl font-black text-primary">{pdHours.total}h</span>
              </div>
              <div className="w-px h-10 bg-primary/10" />
              <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target Quota</span>
                  <span className="text-xl font-black text-foreground">{pdHours.target}h</span>
              </div>
              <div className="w-px h-10 bg-primary/10" />
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl">
                {Math.max(0, pdHours.target - pdHours.total)}h Remaining To Goal
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Strategic Completion Velocity</span>
                <span className="text-xl font-black text-primary">{Math.round((pdHours.total / pdHours.target) * 100)}%</span>
              </div>
              <div className="h-6 w-full bg-primary/5 rounded-full overflow-hidden shadow-inner p-1 flex">
                {pdHours.categories.map((cat: any, idx: number) => (
                  <div
                    key={idx}
                    className={cn("h-full transition-all duration-1000 first:rounded-l-full last:rounded-r-full shadow-lg", cat.color.replace('bg-', 'bg-'))}
                    style={{ width: `${(cat.hours / pdHours.target) * 100}%` }}
                    title={`${cat.name}: ${cat.hours}h (${cat.target - cat.hours}h left)`}
                  />
                ))}
              </div>
            </div>
            <div className="pt-10 border-t border-primary/5">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8">Strategic Development Blocks</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {pdHours.categories.map((cat: any, idx: number) => {
                  const hoursLeft = Math.max(0, cat.target - cat.hours);
                  return (
                    <div key={idx} className="space-y-4 p-6 rounded-[2rem] bg-primary/[0.02] border border-primary/5 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px]", cat.color.replace('bg-', 'text-'), "bg-current")} />
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{cat.name}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-3xl font-black text-foreground">{cat.hours}<span className="text-sm font-medium text-muted-foreground ml-1">/{cat.target}h</span></div>
                      </div>
                      <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", cat.color)}
                          style={{ width: `${(cat.hours / cat.target) * 100}%` }}
                        />
                      </div>
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.15em]">{hoursLeft}h required</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="border-none shadow-2xl bg-emerald-500 text-white rounded-[2.5rem] overflow-hidden group">
            <CardContent className="p-10 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-3">
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Verified Credits</p>
                  <p className="text-5xl font-black tracking-tight">{pdHours.total}<span className="text-xl ml-1 opacity-60">Hrs</span></p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden group border border-primary/5">
            <CardContent className="p-10 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-3">
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">Delta to Target</p>
                  <p className="text-5xl font-black text-foreground tracking-tight">{pdHours.target - pdHours.total}<span className="text-xl ml-1 text-primary">Hrs</span></p>
                </div>
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 shadow-inner">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming PDI Trainings */}
      <Card className="border-none shadow-2xl bg-white mt-12 overflow-hidden rounded-[2.5rem] border border-primary/5">
        <CardHeader className="p-10 border-b border-primary/5 flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-black flex items-center gap-4 uppercase tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                </div>
                Upcoming Registrations
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium pl-16 italic">Strategic session alignment for professional quota fulfillment.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-[240px] h-12 rounded-xl border-primary/10 bg-primary/5 font-black text-[10px] uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all">
                <SelectValue placeholder="All Academic Campuses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border-primary/5 p-2">
                <SelectItem value="all" className="rounded-xl font-bold py-3">All Global Campuses</SelectItem>
                {CAMPUS_OPTIONS.map((school: string) => (
                  <SelectItem key={school} value={school} className="rounded-xl font-bold py-3">{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/[0.02] hover:bg-primary/[0.02] border-b border-primary/5">
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Curriculum Session</TableHead>
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Strategic Block</TableHead>
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Schedule</TableHead>
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Campus Location</TableHead>
                <TableHead className="w-[180px] p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground text-right">Execution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-primary/5">
              {filteredUpcoming.length > 0 ? filteredUpcoming.slice(0, 5).map((event: any) => (
                <TableRow key={event.id} className="hover:bg-primary/[0.03] transition-all duration-300 group">
                  <TableCell className="p-8 font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{event.title}</TableCell>
                  <TableCell className="p-8">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-lg">{event.topic || event.type}</Badge>
                  </TableCell>
                  <TableCell className="p-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-foreground uppercase tracking-tight">{event.date}</span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{event.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {event.location}
                    </div>
                  </TableCell>
                  <TableCell className="p-8 text-right">
                    <Button 
                        className="h-10 px-8 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest"
                        onClick={() => onRegister(event.id)}
                    >
                        Register
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-6 grayscale opacity-20">
                        <div className="w-20 h-20 rounded-[2rem] bg-primary/5 flex items-center justify-center border-4 border-dashed border-primary/20">
                            <Calendar className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-xl font-black text-foreground uppercase tracking-tight">No Strategic Sessions Available</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="mt-12" />

      {/* History Table */}
      <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem] border border-primary/5">
        <CardHeader className="p-10 border-b border-primary/5 flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-black flex items-center gap-4 uppercase tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <History className="w-6 h-6 text-primary" />
                </div>
                Academic Engagement History
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium pl-16 italic">Comprehensive audit log of professional development milestones.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 px-6 gap-3 rounded-xl border-primary/10 hover:border-primary hover:bg-primary/5 font-black text-[10px] uppercase tracking-widest transition-all">
                  <Filter className="w-4 h-4 text-primary" />
                  {selectedCategory === "all" ? "All Block Dimensions" : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl shadow-2xl border-primary/5 p-2">
                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground p-3">Filter by Strategic Block</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/5" />
                <DropdownMenuItem onClick={() => setSelectedCategory("all")} className="rounded-xl font-bold py-3">Global View</DropdownMenuItem>
                {categories.map((category: any) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)} className="rounded-xl font-bold py-3">
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="h-12 px-6 gap-3 rounded-xl border-primary/10 hover:border-primary hover:bg-primary/5 font-black text-[10px] uppercase tracking-widest transition-all" onClick={handleExportPDF}>
              <Download className="w-4 h-4 text-primary" />
              Generate Audit PDF
            </Button>
            <Button className="h-12 px-8 gap-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest" onClick={handleEmailReport} disabled={isEmailing}>
              <Mail className="w-4 h-4" />
              {isEmailing ? "Syncing..." : "Transmit Record"}
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/[0.02] hover:bg-primary/[0.02] border-b border-primary/5">
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Logged Activity</TableHead>
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Strategic Block</TableHead>
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Completion Date</TableHead>
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground text-right">Academic Hrs</TableHead>
                <TableHead className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">Validation</TableHead>
                <TableHead className="w-[180px] p-8 text-[10px] font-black uppercase tracking-[0.25em] text-foreground text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-primary/5">
              {filteredHistory.map((row: any) => (
                <TableRow key={row.id} className="group hover:bg-primary/[0.03] transition-all duration-300 border-primary/5">
                  <TableCell className="p-8 font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{row.activity}</TableCell>
                  <TableCell className="p-8">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-lg">{row.category}</Badge>
                  </TableCell>
                  <TableCell className="p-8">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-tight">{row.date}</span>
                  </TableCell>
                  <TableCell className="p-8 text-right text-lg font-black text-foreground uppercase tracking-tight">{row.hours}<span className="text-[10px] ml-1 text-muted-foreground">h</span></TableCell>
                  <TableCell className="p-8">
                    <div className="flex items-center gap-3 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {row.status}
                    </div>
                  </TableCell>
                  <TableCell className="p-8 text-right">
                    <Button
                      variant="outline"
                      className="h-10 px-6 rounded-xl border-primary/10 hover:border-primary hover:bg-primary/5 font-black text-[10px] uppercase tracking-widest transition-all"
                      onClick={() => setSelectedActivity(row)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Activity Detail Dialog */}
      {selectedActivity && (

          <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
            <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-xl  ">
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
                  <Card className="  shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
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

                  <Card className="  shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
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
                    "border-none shadow-lg text-white",
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
                <Card className="shadow-xl bg-background/50 backdrop-blur-sm">
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
    </div>
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
        <Link to="/teacher">Return to Dashboard</Link>
      </Button>
    </div>
  );
}


// Route guard wrapper: wraps an element and checks module access
const ModuleGuard = ({ modulePath, children, role, isModuleEnabled }: { modulePath: string, children: React.ReactNode, role: string, isModuleEnabled: any }) => {
  const baseModulePath = modulePath.split('/')[0];
  const fullPath = `/teacher/${baseModulePath}`;

  if (!isModuleEnabled(fullPath, role)) {
    return <Navigate to="/teacher" replace />;
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
  interface PDHoursState {
    total: number;
    target: number;
    categories: { name: string; hours: number; target: number; color: string; }[];
    history: any[];
  }

  const [pdHours, setPdHours] = useState<PDHoursState>({
    total: 0,
    target: 30, // overall target
    categories: [
      { name: "Early Years", hours: 0, target: 6, color: "bg-rose-500" },
      { name: "Primary", hours: 0, target: 6, color: "bg-amber-500" },
      { name: "Middle School", hours: 0, target: 6, color: "bg-sky-500" },
      { name: "High School", hours: 0, target: 6, color: "bg-indigo-500" },
      { name: "Online Courses", hours: 0, target: 6, color: "bg-emerald-500" }
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
      <DialogContent className="sm:max-w-md bg-background   shadow-2xl">
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
          <Card className="  shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden">
            <div className="h-4 bg-black" />
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
                    ? "bg-slate-100 text-slate-400 border-slate-200"
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
                                      answer === "Yes" && "bg-black text-white hover:bg-black",
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
                            <Badge key={idx} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-[10px] tracking-wider font-bold">
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
                            <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 uppercase text-[10px] tracking-wider font-bold">
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
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-zinc-900 uppercase mb-1">Strengths</span>
                          <p className="font-bold text-sm">{observation.detailedReflection.strengths}</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-zinc-900 uppercase mb-1">Growth Areas</span>
                          <p className="font-bold text-sm">{observation.detailedReflection.improvements}</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
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

