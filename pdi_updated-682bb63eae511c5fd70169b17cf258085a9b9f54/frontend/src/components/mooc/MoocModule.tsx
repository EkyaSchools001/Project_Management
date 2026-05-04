import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ChevronLeft, 
  Eye, 
  Link as LinkIcon, 
  Brain, 
  Plus, 
  Grid, 
  List, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Trophy, 
  Zap, 
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Star,
  ExternalLink,
  Loader2,
  Trash2,
  Edit2,
  User as UserIcon
} from 'lucide-react';
import { toast } from "sonner";
import { moocService } from "@/services/moocService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn, formatCampus } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOOC_TRACKS, MOOC_COURSES } from "@/data/moocData";
import { MoocEvidenceForm } from "@/components/MoocEvidenceForm";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function MoocModule() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role || 'TEACHER';
  
  const [activeTab, setActiveTab] = useState('browse');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Permissions based on mooc_rbac.html logic
  const canApprove = ['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'COORDINATOR'].includes(role);
  const canSubmit = !['MANAGEMENT', 'ADMIN_OPS', 'ADMIN_HR', 'ADMIN_IT'].includes(role);
  const isLeader = ['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN', 'MANAGEMENT', 'CLUSTER_HEAD', 'ACADEMIC_DIRECTOR'].includes(role);

  useEffect(() => {
    loadSubmissions();
    // Default tab based on role
    if (isLeader) setActiveTab('registry');
    else if (canSubmit) setActiveTab('mymooc');
  }, [role]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await moocService.getAllSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to load MOOC submissions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setIsUpdating(true);
      await moocService.updateStatus(id, status);
      toast.success(`Submission ${status.toLowerCase()} successfully`);
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      setSelectedSubmission(null);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <PageHeader 
            title="MOOC Evidence Registry" 
            subtitle="Professional growth through massive open online courses"
          />
        </div>
        <div className="flex items-center gap-3">
          <Badge className="h-10 px-4 rounded-xl bg-slate-900/5 text-slate-600 border-none flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Role: {role.replace('_', ' ')}
          </Badge>
          {canSubmit && (
            <Button 
              className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
              onClick={() => setActiveTab('submit')}
            >
              <Plus className="w-5 h-5" />
              Submit Evidence
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-16 w-full md:w-auto overflow-x-auto scrollbar-hide flex justify-start">
          {isLeader && <TabsTrigger value="registry" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Registry</TabsTrigger>}
          {isLeader && <TabsTrigger value="team" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Team Progress</TabsTrigger>}
          {canSubmit && <TabsTrigger value="mymooc" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">My MOOCs</TabsTrigger>}
          <TabsTrigger value="browse" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Browse Courses</TabsTrigger>
          <TabsTrigger value="tracks" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Tracks</TabsTrigger>
          {canSubmit && <TabsTrigger value="submit" className="hidden">Submit</TabsTrigger>}
        </TabsList>

        <div className="mt-8">
          <TabsContent value="registry">
            <MoocRegistry 
              submissions={submissions} 
              loading={loading} 
              onView={setSelectedSubmission}
              canApprove={canApprove}
            />
          </TabsContent>

          <TabsContent value="team">
            <MoocTeamProgress 
              submissions={submissions}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="mymooc">
            <MyMoocs 
              submissions={submissions.filter(s => s.userId === user?.id)} 
              loading={loading} 
              onView={setSelectedSubmission}
            />
          </TabsContent>

          <TabsContent value="browse">
            <MoocBrowse />
          </TabsContent>

          <TabsContent value="tracks">
            <MoocTracksView />
          </TabsContent>

          <TabsContent value="submit">
            <MoocEvidenceForm 
              onCancel={() => setActiveTab('mymooc')} 
              onSubmitSuccess={() => {
                loadSubmissions();
                setActiveTab('mymooc');
              }}
              userEmail={user?.email}
              userName={user?.fullName}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Submission Detail Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          {selectedSubmission && (
            <div className="flex flex-col">
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedSubmission.courseName}</DialogTitle>
                <DialogDescription>Details for MOOC submission: {selectedSubmission.courseName}</DialogDescription>
              </DialogHeader>
              
              <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BookOpen className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <Badge className={cn(
                    "mb-4 px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase border-none text-white",
                    selectedSubmission.status === 'APPROVED' ? "bg-emerald-500" : 
                    selectedSubmission.status === 'REJECTED' ? "bg-rose-500" : 
                    "bg-amber-500"
                  )}>
                    {selectedSubmission.status || 'PENDING'}
                  </Badge>
                  <h2 className="text-3xl font-black tracking-tight mb-2 leading-tight">
                    {selectedSubmission.courseName}
                  </h2>
                  <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="w-4 h-4" />
                      {selectedSubmission.name || selectedSubmission.user?.fullName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {formatCampus(selectedSubmission.campus || selectedSubmission.user?.campusId)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 bg-white">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</Label>
                    <p className="font-bold text-slate-900">{selectedSubmission.platform === 'Other' ? selectedSubmission.otherPlatform : selectedSubmission.platform}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</Label>
                    <p className="font-bold text-slate-900">{selectedSubmission.hours} Hours</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completed On</Label>
                    <p className="font-bold text-slate-900">{new Date(selectedSubmission.completionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-6 rounded-full bg-primary" />
                    <h4 className="text-lg font-black tracking-tight">Evidence & Reflection</h4>
                  </div>
                  
                  {selectedSubmission.hasCertificate === 'yes' ? (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => window.open(selectedSubmission.proofLink, '_blank')}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Verified Certificate</p>
                          <p className="text-xs text-slate-500 font-medium">Click to view official proof</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                          <Brain className="w-4 h-4" /> Key Takeaways
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic font-medium">
                          "{selectedSubmission.keyTakeaways || "No reflection provided."}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {canApprove && selectedSubmission.status === 'PENDING' && (
                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-14 rounded-2xl border-rose-100 text-rose-600 font-bold hover:bg-rose-50 hover:border-rose-200"
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'REJECTED')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reject Evidence"}
                    </Button>
                    <Button 
                      className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20"
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'APPROVED')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Approve & Log Hours"}
                    </Button>
                  </div>
                )}

                <Button 
                  variant="ghost" 
                  className="w-full h-12 rounded-xl text-slate-400 font-bold"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close View
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MoocRegistry({ submissions, loading, onView, canApprove }: any) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = submissions.filter((s: any) => {
    const matchesSearch = s.courseName?.toLowerCase().includes(search.toLowerCase()) || 
                          s.name?.toLowerCase().includes(search.toLowerCase()) ||
                          s.user?.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 border-b border-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search by teacher or course..." 
              className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-base focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              className="rounded-xl h-11 px-5 font-bold"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'PENDING' ? 'default' : 'outline'} 
              className="rounded-xl h-11 px-5 font-bold"
              onClick={() => setFilter('PENDING')}
            >
              Pending
            </Button>
            <Button variant="outline" className="rounded-xl h-11 px-5 font-bold text-primary border-primary/20 hover:bg-primary/5">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Member</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Course & Platform</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                        {(s.name || s.user?.fullName || "??").substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{s.name || s.user?.fullName}</p>
                        <p className="text-xs text-slate-400 font-bold">{formatCampus(s.campus || s.user?.campusId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <p className="font-bold text-slate-900">{s.courseName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[9px] font-black tracking-widest px-2 py-0 h-5 border-slate-200">{s.platform}</Badge>
                      <span className="text-[10px] text-slate-400 font-bold">• {s.hours} Hrs</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <p className="text-sm font-bold text-slate-600">{new Date(s.completionDate).toLocaleDateString('en-GB')}</p>
                  </td>
                  <td className="p-8">
                    <Badge className={cn(
                      "px-3 py-1 rounded-full font-black text-[9px] tracking-widest uppercase border-none text-white",
                      s.status === 'APPROVED' ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : 
                      s.status === 'REJECTED' ? "bg-rose-500 shadow-lg shadow-rose-500/20" : 
                      "bg-amber-500 shadow-lg shadow-amber-500/20"
                    )}>
                      {s.status || 'PENDING'}
                    </Badge>
                  </td>
                  <td className="p-8 text-right">
                    <Button 
                      variant="ghost" 
                      className="h-12 w-12 rounded-2xl bg-slate-100 hover:bg-primary hover:text-white transition-all text-slate-600"
                      onClick={() => onView(s)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <BookOpen className="w-16 h-16 opacity-20" />
                      <p className="text-lg font-bold">No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function MoocTeamProgress({ submissions, loading }: any) {
  const stats = useMemo(() => {
    const total = submissions.length;
    const approved = submissions.filter((s:any) => s.status === 'APPROVED').length;
    const pending = submissions.filter((s:any) => s.status === 'PENDING').length;
    const totalHours = submissions.filter((s:any) => s.status === 'APPROVED').reduce((acc:number, s:any) => acc + (s.hours || 0), 0);
    return { total, approved, pending, totalHours };
  }, [submissions]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatItem label="Total Submissions" value={stats.total} icon={Grid} color="bg-indigo-600" />
        <StatItem label="Approved Entries" value={stats.approved} icon={CheckCircle2} color="bg-emerald-600" />
        <StatItem label="Awaiting Review" value={stats.pending} icon={Clock} color="bg-amber-500" />
        <StatItem label="Total PD Hours" value={stats.totalHours} icon={Trophy} color="bg-primary" />
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1.5 h-8 rounded-full bg-primary" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Learning Tracks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOOC_TRACKS.slice(0, 8).map(track => (
            <div key={track.n} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Badge style={{ background: track.bg, color: track.c }} className="border-none font-black text-[9px] tracking-widest px-3">TRACK</Badge>
                <div className="text-slate-300"><ChevronLeft className="w-4 h-4 rotate-180" /></div>
              </div>
              <h4 className="font-black text-slate-900 mb-1 leading-tight">{track.n}</h4>
              <p className="text-xs text-slate-400 font-bold">{track.cnt} Staff Enrolled</p>
              <div className="mt-4 flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">+5</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatItem({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-transform">
      <CardContent className="p-8 flex items-center gap-6">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MyMoocs({ submissions, loading, onView }: any) {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Your MOOC Journey</h2>
              <p className="text-slate-400 font-medium">Track your course completions and earned PD credits.</p>
            </div>
            <div className="flex gap-4">
               <div className="text-right">
                  <p className="text-4xl font-black text-primary">{submissions.filter((s:any)=>s.status==='APPROVED').reduce((acc:number,s:any)=>acc+s.hours,0)}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Hours Earned</p>
               </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Course Name</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Hours</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {submissions.map((s:any) => (
                   <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-8">
                        <p className="font-bold text-slate-900">{s.courseName}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Completed {new Date(s.completionDate).toLocaleDateString()}</p>
                      </td>
                      <td className="p-8">
                        <Badge variant="secondary" className="rounded-lg px-3 py-1 bg-indigo-50 text-indigo-700 border-none font-bold">{s.platform}</Badge>
                      </td>
                      <td className="p-8 text-center font-black text-slate-700">{s.hours}</td>
                      <td className="p-8">
                         <Badge className={cn(
                            "px-3 py-1 rounded-full font-black text-[9px] tracking-widest uppercase",
                            s.status === 'APPROVED' ? "bg-emerald-100 text-emerald-700" : 
                            s.status === 'REJECTED' ? "bg-rose-100 text-rose-700" : 
                            "bg-amber-100 text-amber-700"
                         )}>
                           {s.status || 'PENDING'}
                         </Badge>
                      </td>
                      <td className="p-8 text-right">
                        <Button variant="ghost" className="h-11 rounded-xl bg-slate-100 text-slate-600 hover:bg-primary hover:text-white" onClick={() => onView(s)}>
                          <Eye className="w-5 h-5" />
                        </Button>
                      </td>
                   </tr>
                 ))}
                 {submissions.length === 0 && (
                   <tr>
                     <td colSpan={5} className="p-20 text-center">
                        <div className="max-w-xs mx-auto space-y-6">
                           <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                              <Star className="w-10 h-10" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-lg font-black text-slate-900">Start Your Journey</p>
                              <p className="text-sm text-slate-400 font-medium leading-relaxed">Submit your first course evidence to start tracking your professional growth.</p>
                           </div>
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
  );
}

function MoocBrowse() {
  const [search, setSearch] = useState('');
  const [activeTrack, setActiveTrack] = useState('All');

  const filtered = MOOC_COURSES.filter(c => {
    const matchesSearch = c.t.toLowerCase().includes(search.toLowerCase()) || c.pl.toLowerCase().includes(search.toLowerCase());
    const matchesTrack = activeTrack === 'All' || c.tr === activeTrack;
    return matchesSearch && matchesTrack;
  });

  const uniqueTracks = ['All', ...Array.from(new Set(MOOC_COURSES.map(c => c.tr)))];

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search by course name or platform..." 
              className="pl-12 h-14 bg-white shadow-xl shadow-slate-200/50 border-none rounded-2xl text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {uniqueTracks.map(t => (
              <Button 
                key={t}
                variant={activeTrack === t ? 'default' : 'ghost'}
                className={cn("rounded-xl h-11 px-5 font-bold whitespace-nowrap", activeTrack !== t && "text-slate-500")}
                onClick={() => setActiveTrack(t)}
              >
                {t}
              </Button>
            ))}
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filtered.map((c, i) => (
           <Card key={i} className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500">
             <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <Badge variant="outline" className="text-[9px] font-black tracking-widest px-3 py-1 border-slate-200 text-slate-400 uppercase">{c.pl}</Badge>
                   <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink className="w-4 h-4" /></div>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 flex-1">
                  {c.t}
                </h3>
                <div className="mt-auto space-y-4">
                   <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase tracking-wider">{c.tr}</span>
                      <span className="text-primary flex items-center gap-1"><Clock className="w-3 h-3" /> {c.h}h</span>
                   </div>
                   <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-primary text-white font-bold transition-all gap-2">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                   </Button>
                </div>
             </div>
           </Card>
         ))}
       </div>
    </div>
  );
}

function MoocTracksView() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {MOOC_TRACKS.map((track, i) => (
        <Card key={i} className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
          <div className="p-10 flex flex-col items-center text-center">
            <div 
              className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl transition-transform group-hover:rotate-12"
              style={{ background: track.bg, color: track.c }}
            >
              <Zap className="w-10 h-10 fill-current" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{track.n}</h3>
            <p className="text-sm font-bold text-slate-400">{track.cnt} Courses Available</p>
            <div className="mt-8 w-full">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">
                  <span>Track Status</span>
                  <span>{Math.floor(Math.random() * 100)}% Enrollment</span>
               </div>
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${Math.floor(Math.random() * 100)}%`, background: track.c }} 
                  />
               </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
