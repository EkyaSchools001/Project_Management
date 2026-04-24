import React, { useState, useMemo } from 'react';
import { 
  ClipboardText, 
  CheckCircle, 
  Clock, 
  TrendUp, 
  Funnel, 
  MagnifyingGlass,
  CaretRight,
  User,
  Buildings,
  BookOpen,
  Calendar,
  CloudArrowUp,
  DownloadSimple,
  PencilLine,
  Eye,
  X,
  Plus,
  CheckSquare
} from '@phosphor-icons/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
}

interface LacTask {
  id: string;
  subjectId: string;
  unit: string;
  task: string;
  type: string;
  mode: string;
  week: number;
  weekCheck: boolean;
  subject: Subject;
  statuses: any[];
}

const LACModule = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedWeek, setSelectedWeek] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'dashboard' | 'checklist' | 'subjects' | 'teachers'>('dashboard');
  const [selectedSubjectOverview, setSelectedSubjectOverview] = useState<string>('All');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string | null>(null);
  // Assign Task Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTeacherId, setAssignTeacherId] = useState('');
  const [assignTaskId, setAssignTaskId] = useState('');
  const [assignSubjectFilter, setAssignSubjectFilter] = useState('All');
  const [selectedTeacherName, setSelectedTeacherName] = useState<string | null>(null);

  const isCoordinator = ['COORDINATOR', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPERADMIN'].includes(user?.role || '');

  // Fetch Data
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['lac-tasks', selectedSubject, selectedWeek, selectedStatus, selectedCampus, isCoordinator, selectedTeacherFilter],
    queryFn: async () => {
      const params: any = {};
      if (selectedSubject !== 'All') params.subject = selectedSubject;
      if (selectedWeek !== 'All') params.week = selectedWeek;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedCampus && selectedCampus !== 'All') params.campusId = selectedCampus;
      if (selectedTeacherFilter) params.teacherId = selectedTeacherFilter;

      if (isCoordinator) {
        const response = await api.get('/lac/tasks', { params });
        return response.data.data;
      } else {
        const response = await api.get('/lac/my-tasks', { params });
        return response.data.data.map((statusObj: any) => ({
           ...statusObj.task,
           statuses: [statusObj]
        }));
      }
    }
  });

  const { data: campusesData } = useQuery({
    queryKey: ['lac-campuses'],
    queryFn: async () => {
      const response = await api.get('/lac/campuses');
      return response.data.data;
    },
    enabled: isCoordinator
  });

  const { data: teachersData } = useQuery({
    queryKey: ['lac-teachers', selectedCampus],
    queryFn: async () => {
      const response = await api.get('/lac/teachers', { params: { campusId: selectedCampus !== 'All' ? selectedCampus : '' } });
      return response.data.data;
    },
    enabled: isCoordinator && (viewMode === 'teachers' || showAssignModal)
  });

  const { data: subjectsData } = useQuery({
    queryKey: ['lac-subjects'],
    queryFn: async () => {
      const response = await api.get('/lac/subjects');
      return response.data.data;
    }
  });

  // Fetch all available tasks (for the assign modal)
  const { data: allTasksData } = useQuery({
    queryKey: ['lac-all-tasks-for-assign'],
    queryFn: async () => {
      const response = await api.get('/lac/tasks');
      return response.data.data;
    },
    enabled: isCoordinator && showAssignModal
  });

  // Assign task mutation
  const assignTaskMutation = useMutation({
    mutationFn: async (payload: { taskId: string; teacherId: string; campusId: string }) => {
      const response = await api.post('/lac/assign-task', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Task assigned successfully!');
      queryClient.invalidateQueries({ queryKey: ['lac-teachers'] });
      queryClient.invalidateQueries({ queryKey: ['lac-tasks'] });
      setShowAssignModal(false);
      setAssignTeacherId('');
      setAssignTaskId('');
      setAssignSubjectFilter('All');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to assign task');
    }
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['lac-dashboard', selectedCampus],
    queryFn: async () => {
      const params: any = {};
      if (selectedCampus && selectedCampus !== 'All') params.campusId = selectedCampus;
      const response = await api.get('/lac/dashboard-summary', { params });
      return response.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.patch(`/lac/task/${payload.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lac-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lac-dashboard'] });
      toast.success('Status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const handleUpdateStatus = (taskId: string, newStatus: string, teacherId: string, campusId: string, field: string = 'status') => {
    updateStatusMutation.mutate({
      id: taskId,
      [field]: newStatus,
      teacherId,
      campusId
    });
    setEditingTaskId(null);
  };

  const filteredTasks = useMemo(() => {
    if (!tasksData) return [];
    return tasksData.filter((task: LacTask) => {
      const matchesSearch = task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.unit.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (selectedStatus !== 'All') {
        const myStatus = task.statuses.find(s => s.teacherId === user?.id) || { status: 'Pending' };
        matchesStatus = myStatus.status === selectedStatus;
      }
      return matchesSearch && matchesStatus;
    });
  }, [tasksData, searchQuery, selectedStatus, user?.id]);

  const stats = useMemo(() => {
    if (!dashboardData) return { total: 0, completed: 0, inProgress: 0, pending: 0, graded: 0, teachers: 0 };
    const counts = dashboardData.statusCounts || [];
    return {
      total: dashboardData.totalTasks || 0,
      completed: counts.find((c: any) => c.status === 'Complete')?._count || 0,
      inProgress: counts.find((c: any) => c.status === 'In Progress')?._count || 0,
      pending: counts.find((c: any) => c.status === 'Pending')?._count || 0,
      graded: dashboardData.gradedTasks || 0,
      teachers: dashboardData.teacherCount || 0,
    };
  }, [dashboardData]);

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/20">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ClipboardText size={24} weight="duotone" />
             </div>
             <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">LAC Checklist</h1>
          </div>
          <p className="text-slate-500 font-medium">Learning Accountability Checklist — 2025-26 Term 1</p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => setViewMode('dashboard')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'dashboard' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setViewMode('checklist')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'checklist' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Checklist
          </button>
          <button 
            onClick={() => setViewMode('subjects')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'subjects' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Subject Overview
          </button>
          {isCoordinator && (
            <button 
              onClick={() => setViewMode('teachers')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'teachers' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Teachers
            </button>
          )}
        </div>

        {/* Assign Task Button — Coordinator / Leader only */}
        {isCoordinator && (
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 shrink-0"
          >
            <Plus size={18} weight="bold" />
            Assign Task
          </button>
        )}
      </div>

      {/* ── Assign Task Modal ───────────────────────────────────── */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAssignModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CheckSquare size={22} className="text-primary" weight="duotone" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">Assign LAC Task</h2>
                  <p className="text-xs text-slate-400 font-medium">Assign a task to a teacher in your campus</p>
                </div>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Step 1: Select Teacher */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 1 — Select Teacher</label>
              <select
                value={assignTeacherId}
                onChange={(e) => setAssignTeacherId(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">-- Choose a Teacher --</option>
                {(teachersData || []).map((t: any) => (
                  <option key={t.teacherId} value={t.teacherId}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Step 2: Filter by Subject */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 2 — Filter by Subject (optional)</label>
              <select
                value={assignSubjectFilter}
                onChange={(e) => { setAssignSubjectFilter(e.target.value); setAssignTaskId(''); }}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="All">All Subjects</option>
                {(subjectsData || []).map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Step 3: Select Task */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 3 — Select Task</label>
              <select
                value={assignTaskId}
                onChange={(e) => setAssignTaskId(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">-- Choose a Task --</option>
                {(allTasksData || [])
                  .filter((t: any) => assignSubjectFilter === 'All' || t.subjectId === assignSubjectFilter)
                  .map((t: any) => (
                    <option key={t.id} value={t.id}>[Wk {t.week}] {t.unit} — {t.task}</option>
                  ))
                }
              </select>
              {(allTasksData || []).filter((t: any) => assignSubjectFilter === 'All' || t.subjectId === assignSubjectFilter).length === 0 && (
                <p className="text-xs text-slate-400 font-medium px-1">No tasks found for this subject.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 h-12 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!assignTeacherId || !assignTaskId || assignTaskMutation.isPending}
                onClick={() => {
                  const teacher = (teachersData || []).find((t: any) => t.teacherId === assignTeacherId);
                  if (!teacher) return;
                  assignTaskMutation.mutate({
                    taskId: assignTaskId,
                    teacherId: assignTeacherId,
                    campusId: teacher.campusId
                  });
                }}
                className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {assignTaskMutation.isPending ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                ) : (
                  <CheckSquare size={18} weight="bold" />
                )}
                {assignTaskMutation.isPending ? 'Assigning...' : 'Assign Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'dashboard' ? (
        <div className="space-y-6">
          {/* Campus filter for overview */}
          {isCoordinator && (
            <div className="flex items-center gap-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter by Campus:</label>
              <div className="relative">
                <Buildings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="pl-9 pr-4 h-10 bg-white border border-primary/20 rounded-xl text-sm font-medium text-slate-600 outline-none appearance-none cursor-pointer focus:border-primary/50 transition-colors"
                >
                  <option value="All">All Campuses</option>
                  {campusesData?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 5 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Completed" value={stats.completed} sub={`of ${stats.total} tasks`} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-200" />
            <StatCard title="In Progress" value={stats.inProgress} sub="tasks ongoing" color="text-blue-600" bg="bg-blue-50" border="border-blue-200" />
            <StatCard title="Pending" value={stats.pending} sub="yet to start" color="text-amber-600" bg="bg-amber-50" border="border-amber-200" />
            <StatCard title="Graded Tasks" value={stats.graded} sub="assessment items" color="text-violet-600" bg="bg-violet-50" border="border-violet-200" />
            <StatCard title="Teachers" value={stats.teachers} sub="learning areas" color="text-slate-600" bg="bg-slate-50" border="border-slate-200" />
          </div>

          {/* Subject Breakdown Cards */}
          {dashboardData?.subjectBreakdown?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {dashboardData.subjectBreakdown.map((subject: any, idx: number) => {
                const colors = [
                  { bar: 'bg-indigo-500', badge: 'bg-indigo-500', border: 'border-indigo-200', light: 'bg-indigo-50', text: 'text-indigo-700' },
                  { bar: 'bg-blue-500', badge: 'bg-blue-500', border: 'border-blue-200', light: 'bg-blue-50', text: 'text-blue-700' },
                  { bar: 'bg-emerald-500', badge: 'bg-emerald-500', border: 'border-emerald-200', light: 'bg-emerald-50', text: 'text-emerald-700' },
                  { bar: 'bg-amber-500', badge: 'bg-amber-400', border: 'border-amber-200', light: 'bg-amber-50', text: 'text-amber-700' },
                  { bar: 'bg-violet-500', badge: 'bg-violet-500', border: 'border-violet-200', light: 'bg-violet-50', text: 'text-violet-700' },
                  { bar: 'bg-rose-500', badge: 'bg-rose-500', border: 'border-rose-200', light: 'bg-rose-50', text: 'text-rose-700' },
                  { bar: 'bg-teal-500', badge: 'bg-teal-500', border: 'border-teal-200', light: 'bg-teal-50', text: 'text-teal-700' },
                ];
                const c = colors[idx % colors.length];
                return (
                  <div key={subject.subjectId} className={`bg-white rounded-2xl p-5 border ${c.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md ${c.light} flex items-center justify-center`}>
                          <BookOpen size={14} className={c.text} weight="bold" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{subject.subjectName}</h3>
                      </div>
                      <span className={`${c.badge} text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0`}>{subject.percentage}%</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={12} className="shrink-0" />
                      <span className="truncate">{subject.teacherName}</span>
                    </div>

                    <div className="space-y-1.5 mt-auto">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>{subject.completedTasks} done</span>
                        <span>{subject.totalTasks} total</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Per-Campus Breakdown */}
          {isCoordinator && dashboardData?.campusBreakdown?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Buildings size={18} className="text-primary" weight="duotone" />
                Per-Campus Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.campusBreakdown.map((campus: any, idx: number) => {
                  const campusColors = [
                    { bar: 'bg-primary', border: 'border-primary/20', badge: 'text-primary', bg: 'bg-primary/5', ring: 'ring-primary/10' },
                    { bar: 'bg-indigo-500', border: 'border-indigo-200', badge: 'text-indigo-600', bg: 'bg-indigo-50', ring: 'ring-indigo-100' },
                    { bar: 'bg-emerald-500', border: 'border-emerald-200', badge: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
                    { bar: 'bg-amber-500', border: 'border-amber-200', badge: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-100' },
                    { bar: 'bg-violet-500', border: 'border-violet-200', badge: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-100' },
                    { bar: 'bg-teal-500', border: 'border-teal-200', badge: 'text-teal-600', bg: 'bg-teal-50', ring: 'ring-teal-100' },
                    { bar: 'bg-rose-500', border: 'border-rose-200', badge: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-100' },
                    { bar: 'bg-blue-500', border: 'border-blue-200', badge: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
                    { bar: 'bg-orange-500', border: 'border-orange-200', badge: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-100' },
                    { bar: 'bg-cyan-500', border: 'border-cyan-200', badge: 'text-cyan-600', bg: 'bg-cyan-50', ring: 'ring-cyan-100' },
                  ];
                  const cc = campusColors[idx % campusColors.length];
                  return (
                    <div key={campus.campusId} className={`bg-white rounded-2xl p-5 border ${cc.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${cc.bg} ring-4 ${cc.ring} flex items-center justify-center`}>
                            <Buildings size={18} className={cc.badge} weight="duotone" />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-800 text-sm leading-tight">{campus.campusName}</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{campus.teacherCount} teacher{campus.teacherCount !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <span className={`text-2xl font-black ${cc.badge}`}>{campus.percentage}%</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${cc.bar} rounded-full transition-all duration-700`}
                            style={{ width: `${campus.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>{campus.completedTasks} completed</span>
                          <span>{campus.totalTasks} total tasks</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : viewMode === 'subjects' ? (
        <div className="space-y-6">
          {/* Subject filter dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">Filter by Subject:</label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select
                value={selectedSubjectOverview}
                onChange={(e) => setSelectedSubjectOverview(e.target.value)}
                className="pl-9 pr-10 h-10 bg-white border border-primary/20 rounded-xl text-sm font-semibold text-slate-600 outline-none appearance-none cursor-pointer focus:border-primary/50 hover:border-primary/40 transition-colors shadow-sm min-w-[200px]"
              >
                <option value="All">All Subjects</option>
                {subjectsData?.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* Subject cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(dashboardData?.subjectBreakdown || []).filter((s: any) =>
              selectedSubjectOverview === 'All' || s.subjectId === selectedSubjectOverview
            ).map((subject: any, idx: number) => {
              const colors = [
                { bar: 'bg-indigo-500', badge: 'bg-indigo-500', border: 'border-indigo-200', light: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-100' },
                { bar: 'bg-blue-500', badge: 'bg-blue-500', border: 'border-blue-200', light: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-100' },
                { bar: 'bg-emerald-500', badge: 'bg-emerald-500', border: 'border-emerald-200', light: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' },
                { bar: 'bg-amber-500', badge: 'bg-amber-400', border: 'border-amber-200', light: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-100' },
                { bar: 'bg-violet-500', badge: 'bg-violet-500', border: 'border-violet-200', light: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-100' },
                { bar: 'bg-rose-500', badge: 'bg-rose-500', border: 'border-rose-200', light: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-100' },
                { bar: 'bg-teal-500', badge: 'bg-teal-500', border: 'border-teal-200', light: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-100' },
              ];
              const c = colors[idx % colors.length];
              return (
                <div key={subject.subjectId} className={`bg-white rounded-2xl p-6 border ${c.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5`}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${c.light} flex items-center justify-center ring-4 ${c.ring}`}>
                        <BookOpen size={18} className={c.text} weight="bold" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-sm leading-tight">{subject.subjectName}</h3>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Subject</p>
                      </div>
                    </div>
                    <span className={`${c.badge} text-white text-xs font-black px-3 py-1 rounded-full shrink-0 shadow-sm`}>{subject.percentage}%</span>
                  </div>

                  {/* Teacher */}
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl ${c.light}`}>
                    <div className={`w-7 h-7 rounded-full ${c.badge} flex items-center justify-center text-white shrink-0`}>
                      <User size={14} weight="bold" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Teacher</p>
                      <p className="text-xs font-bold text-slate-700 leading-tight">{subject.teacherName}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mt-auto">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[11px] font-bold text-slate-500">{subject.completedTasks} done</span>
                      <span className="text-[11px] font-bold text-slate-400">{subject.totalTasks} total</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {(dashboardData?.subjectBreakdown || []).filter((s: any) =>
              selectedSubjectOverview === 'All' || s.subjectId === selectedSubjectOverview
            ).length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold">No subject data available</p>
              </div>
            )}
          </div>
        </div>
      ) : viewMode === 'teachers' ? (
        <div className="space-y-6">
          {/* Teachers Header + Filters */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-800">Teacher Progress Directory</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {['SUPERADMIN','MANAGEMENT','ADMIN'].includes(user?.role || '') ? 'All campuses' : 'Your campus only'}
                {' · '}{teachersData?.length || 0} teachers
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Campus filter — admins only */}
              {['SUPERADMIN','MANAGEMENT','ADMIN'].includes(user?.role || '') && (
                <div className="relative">
                  <Buildings className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="pl-9 pr-8 h-10 bg-white border border-primary/20 rounded-xl text-sm font-semibold text-slate-600 outline-none appearance-none cursor-pointer focus:border-primary/50 transition-colors min-w-[180px]"
                  >
                    <option value="All">All Campuses</option>
                    {campusesData?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Search */}
              <div className="relative">
                <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="text"
                  placeholder="Search teacher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-10 bg-white border border-primary/20 rounded-xl text-sm font-medium text-slate-600 outline-none focus:border-primary/50 transition-colors min-w-[200px]"
                />
              </div>
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(teachersData || [])
              .filter((t: any) =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.campus.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((teacher: any) => {
                const pct = teacher.completionPercentage;
                const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : pct >= 20 ? 'bg-amber-500' : 'bg-rose-400';
                const badgeColor = pct >= 80 ? 'text-emerald-600 bg-emerald-50' : pct >= 50 ? 'text-blue-600 bg-blue-50' : pct >= 20 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
                return (
                  <div 
                    key={teacher.teacherId} 
                    onClick={() => {
                        setSelectedTeacherFilter(teacher.teacherId);
                        setSelectedTeacherName(teacher.name);
                        setViewMode('checklist');
                    }}
                    className="bg-white p-5 border border-primary/20 hover:border-primary/50 hover:shadow-md transition-all duration-200 rounded-2xl flex flex-col gap-4 cursor-pointer relative group"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary/10 text-primary p-1.5 rounded-full">
                        <CaretRight size={14} weight="bold" />
                      </div>
                    </div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <User size={20} weight="bold" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm leading-tight">{teacher.name}</h3>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[160px]">{teacher.subject}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shrink-0 ${badgeColor}`}>
                        {pct}%
                      </span>
                    </div>

                    {/* Campus badge */}
                    <div className="flex items-center gap-2">
                      <Buildings size={12} className="text-slate-400 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{teacher.campus}</span>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-emerald-50 rounded-xl p-2">
                        <p className="text-base font-black text-emerald-600">{teacher.completedTasks}</p>
                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Done</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-2">
                        <p className="text-base font-black text-blue-600">{teacher.inProgressTasks}</p>
                        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">In Progress</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2">
                        <p className="text-base font-black text-slate-600">{teacher.totalTasks}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1 mt-auto">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            {(teachersData || []).filter((t: any) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.campus.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <User size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold">No teachers found</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Active Filters */}
          {selectedTeacherFilter && selectedTeacherName && (
            <div className="mb-4 flex items-center">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl">
                <User size={16} weight="bold" />
                <span className="text-sm font-semibold">Viewing Progress For: <span className="font-black">{selectedTeacherName}</span></span>
                <button 
                  onClick={() => {
                    setSelectedTeacherFilter(null);
                    setSelectedTeacherName(null);
                  }}
                  className="ml-2 hover:bg-primary/20 p-1 rounded-full transition-colors"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 items-end">
            <div className={`md:col-span-6 lg:col-span-${isCoordinator ? '3' : '4'} space-y-2`}>
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Search</label>
               <div className="relative group">
                 <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                 <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-14 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-600"
                 />
               </div>
            </div>

            {isCoordinator && (
              <div className="md:col-span-2 lg:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Campus</label>
                 <div className="relative">
                   <Buildings className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <select 
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none appearance-none cursor-pointer font-medium text-slate-600"
                   >
                     <option value="All">All Campuses</option>
                     {campusesData?.map((c: any) => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                 </div>
              </div>
            )}

            <div className={`md:col-span-3 lg:col-span-${isCoordinator ? '2' : '3'} space-y-2`}>
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Subject</label>
               <div className="relative">
                 <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none appearance-none cursor-pointer font-medium text-slate-600"
                 >
                   <option value="All">All Subjects</option>
                   {subjectsData?.map((s: Subject) => (
                     <option key={s.id} value={s.id}>{s.name}</option>
                   ))}
                 </select>
               </div>
            </div>

            <div className="md:col-span-2 lg:col-span-2 space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Week</label>
               <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <select 
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none appearance-none cursor-pointer font-medium text-slate-600"
                 >
                   <option value="All">All</option>
                   {[...Array(12)].map((_, i) => (
                     <option key={i+1} value={i+1}>Week {i+1}</option>
                   ))}
                 </select>
               </div>
            </div>

            <div className="md:col-span-2 lg:col-span-2 space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Status</label>
               <div className="relative">
                 <Funnel className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none appearance-none cursor-pointer font-medium text-slate-600"
                 >
                   <option value="All">All</option>
                   <option value="Pending">Pending</option>
                   <option value="In Progress">In Progress</option>
                   <option value="Complete">Complete</option>
                 </select>
               </div>
            </div>

            <div className={`md:col-span-6 lg:col-span-1`}>
               <button className="w-full h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center hover:bg-slate-900 transition-colors shadow-lg active:scale-95 duration-200">
                  <DownloadSimple size={20} />
               </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Details</th>
                    <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Week</th>
                    <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type / Mode</th>
                    <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Published</th>
                    <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score Entered</th>
                    <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Evidence</th>
                    {!isCoordinator && (
                      <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Assigned On</th>
                    )}
                    <th className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTasks.map((task: LacTask) => {
                    const myStatus = task.statuses.find(s => isCoordinator ? s.campusId === selectedCampus || selectedCampus === 'All' : s.teacherId === user?.id) || { status: 'Pending', published: false, scoreEntered: false, evidence: false };
                    const actualTeacherId = isCoordinator && task.statuses.length > 0 ? task.statuses[0].teacherId : user?.id;
                    const actualCampusId = isCoordinator && task.statuses.length > 0 ? task.statuses[0].campusId : user?.campusId;
                    
                    return (
                      <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                               <BookOpen size={20} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-slate-800 tracking-tight leading-tight">{task.task}</h4>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">{task.subject?.name || 'Subject'}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[150px]" title={task.unit}>{task.unit}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-6 text-center">
                          <span className="text-sm font-bold text-slate-600">Week {task.week}</span>
                        </td>
                        <td className="px-4 py-6 text-center">
                           <div className="flex flex-col items-center gap-1">
                             <span className="text-xs font-bold text-slate-600">{task.type}</span>
                             <span className="text-[10px] text-slate-400 uppercase">{task.mode}</span>
                           </div>
                        </td>
                        <td className="px-4 py-6">
                          <div className="flex justify-center">
                            {editingTaskId === task.id ? (
                               <input type="checkbox" checked={myStatus.published} onChange={(e) => handleUpdateStatus(task.id, e.target.checked as any, actualTeacherId, actualCampusId, 'published')} className="w-4 h-4 rounded text-primary" />
                            ) : myStatus.published ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><CheckCircle size={16} weight="fill" /></div>
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center"><Clock size={16} /></div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-6">
                          <div className="flex justify-center">
                            {editingTaskId === task.id ? (
                               <input type="checkbox" checked={myStatus.scoreEntered} onChange={(e) => handleUpdateStatus(task.id, e.target.checked as any, actualTeacherId, actualCampusId, 'scoreEntered')} className="w-4 h-4 rounded text-primary" />
                            ) : myStatus.scoreEntered ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><CheckCircle size={16} weight="fill" /></div>
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center"><Clock size={16} /></div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-6">
                          <div className="flex justify-center">
                            <StatusBadge status={myStatus.status} />
                          </div>
                        </td>
                        <td className="px-4 py-6">
                           <div className="flex justify-center">
                              {editingTaskId === task.id ? (
                                 <input type="checkbox" checked={myStatus.evidence} onChange={(e) => handleUpdateStatus(task.id, e.target.checked as any, actualTeacherId, actualCampusId, 'evidence')} className="w-4 h-4 rounded text-primary" />
                              ) : myStatus.evidence ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                  <CheckCircle size={16} weight="fill" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center">
                                  <Clock size={16} />
                                </div>
                              )}
                           </div>
                        </td>
                        {!isCoordinator && (
                           <td className="px-4 py-6 text-center">
                             {myStatus.createdAt ? (
                               <div className="flex flex-col items-center gap-0.5">
                                 <span className="text-xs font-bold text-slate-700">
                                   {new Date(myStatus.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                 </span>
                                 <span className="text-[10px] text-slate-400 font-medium">
                                   {new Date(myStatus.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                 </span>
                               </div>
                             ) : (
                               <span className="text-[10px] text-slate-300 font-medium">—</span>
                             )}
                           </td>
                         )}
                        <td className="px-4 py-6 text-right">
                           {isCoordinator ? (
                             editingTaskId === task.id ? (
                               <select 
                                 className="text-xs border border-slate-200 rounded-md p-1 outline-none text-slate-600"
                                 value={myStatus.status}
                                 onChange={(e) => handleUpdateStatus(task.id, e.target.value, actualTeacherId, actualCampusId)}
                                 onBlur={() => setEditingTaskId(null)}
                                 autoFocus
                               >
                                 <option value="Pending">Pending</option>
                                 <option value="In Progress">In Progress</option>
                                 <option value="Complete">Complete</option>
                               </select>
                             ) : (
                               <button 
                                 onClick={() => setEditingTaskId(task.id)}
                                 className="p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-primary border border-transparent hover:border-slate-100"
                               >
                                 <PencilLine size={20} weight="bold" />
                               </button>
                             )
                           ) : (
                             <button className="p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-primary border border-transparent hover:border-slate-100">
                               <Eye size={20} weight="bold" />
                             </button>
                           )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, sub, color, bg, border }: any) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border ${border || 'border-primary/20'} space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
    <h3 className={`text-4xl font-black tracking-tight ${color}`}>{value}</h3>
    {sub && <p className="text-xs text-slate-400 font-medium">{sub}</p>}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'Complete': 'bg-emerald-50 text-emerald-600',
    'In Progress': 'bg-blue-50 text-blue-600',
    'Pending': 'bg-amber-50 text-amber-600',
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

export default LACModule;
