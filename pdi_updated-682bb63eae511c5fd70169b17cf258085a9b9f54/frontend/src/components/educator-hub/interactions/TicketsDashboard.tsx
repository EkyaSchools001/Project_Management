import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MagnifyingGlass, 
  FileX, 
  UserPlus, 
  PencilSimple, 
  CheckCircle, 
  Clock, 
  Warning, 
  ChartBar, 
  ListBullets,
  ArrowRight
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export function TicketsDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  
  // Modals
  const [assignTicket, setAssignTicket] = useState<any>(null);
  const [takeActionTicket, setTakeActionTicket] = useState<any>(null);
  const [isAssignLoading, setIsAssignLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Take Action Form State
  const [newStatus, setNewStatus] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [campusFilter, setCampusFilter] = useState('ALL');

  const role = user?.role ? user.role.toUpperCase() : 'TEACHER';
  const isAdmin = ['ADMIN', 'SUPERADMIN', 'LEADER'].includes(role);
  const isManagement = role === 'MANAGEMENT' || isAdmin;
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ptil');
      const allRecords = res.data.data.records;
      
      // Filter for SUPPORT_PORTAL tickets only
      const supportTickets = allRecords.filter((r: any) => 
        r.meetingRequestedBy === 'SUPPORT_PORTAL' || 
        r.remarks === 'Raised via Public Support Portal'
      );
      
      setTickets(supportTickets);

      // Fetch staff for assignment dropdown if admin
      if (isAdmin) {
        const staffRes = await api.get('/users');
        setStaff(staffRes.data.data.users);
      }
    } catch (err) {
      toast.error('Failed to load tickets data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAssign = async (targetTeacherId: string) => {
    if (!assignTicket) return;
    try {
      setIsAssignLoading(true);
      const selectedStaff = staff.find(s => s.id === targetTeacherId);
      if (!selectedStaff) return;

      await api.patch(`/ptil/${assignTicket.id}`, {
        teacherId: selectedStaff.id,
        teacherEmail: selectedStaff.email,
        status: 'IN_PROGRESS' // Automatically move to in-progress on assignment
      });

      toast.success(`Ticket assigned to ${selectedStaff.fullName}`);
      setAssignTicket(null);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to assign ticket');
    } finally {
      setIsAssignLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    if (!takeActionTicket) return;
    try {
      setIsActionLoading(true);
      await api.patch(`/ptil/${takeActionTicket.id}`, {
        status: newStatus,
        remarks: remarks
      });

      toast.success('Ticket updated successfully');
      setTakeActionTicket(null);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update ticket');
    } finally {
      setIsActionLoading(false);
    }
  };

  const openTakeAction = (ticket: any) => {
    setTakeActionTicket(ticket);
    setNewStatus(ticket.status);
    setRemarks(ticket.remarks || '');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Resolved</Badge>;
      case 'IN_PROGRESS': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'UNRESOLVED': return <Badge className="bg-rose-100 text-rose-700 border-rose-200">Unresolved</Badge>;
      case 'PARKED': return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Parked</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredData = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = !search || t.parentName.toLowerCase().includes(search.toLowerCase()) || t.studentName.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesCampus = campusFilter === 'ALL' || t.team === campusFilter;
      return matchesSearch && matchesStatus && matchesCampus;
    });
  }, [tickets, search, statusFilter, campusFilter]);

  // Analytics derived data
  const ticketStats = useMemo(() => {
    if (!tickets.length) return [];
    const categories = tickets.reduce((acc: any, curr: any) => {
      acc[curr.concernCategory] = (acc[curr.concernCategory] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ListBullets weight="bold" />
            Tickets List
          </button>
          {isManagement && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ChartBar weight="bold" />
              Analytics
            </button>
          )}
        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Filters */}
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-[2.5rem]">
            <CardContent className="p-4 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[240px]">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                        placeholder="Search by Parent, Student, or Ticket ID..." 
                        className="pl-10 h-11 rounded-full border-slate-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] h-11 rounded-full border-slate-200">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="UNRESOLVED">Unresolved</SelectItem>
                        <SelectItem value="PARKED">Parked</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={campusFilter} onValueChange={setCampusFilter}>
                    <SelectTrigger className="w-[180px] h-11 rounded-full border-slate-200">
                        <SelectValue placeholder="All Campuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Campuses</SelectItem>
                        {Array.from(new Set(tickets.map(t => t.team))).filter(Boolean).map(campus => (
                            <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Date & ID</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Parent & Student</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Campus / School</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Category</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-wider text-slate-400">Assigned To</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={7} className="p-4"><Skeleton className="h-12 w-full rounded-xl" /></td></tr>
                    ))
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                        <FileX size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-lg">No tickets found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-800 text-sm">{new Date(ticket.meetingDate).toLocaleDateString()}</p>
                          <p className="text-[10px] font-mono text-slate-400">#{ticket.id.slice(-6).toUpperCase()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-800 text-sm">{ticket.parentName}</p>
                          <p className="text-xs text-slate-500">{ticket.studentName} ({ticket.grade})</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{ticket.team}</span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600">{ticket.concernCategory}</td>
                        <td className="px-6 py-5">{getStatusBadge(ticket.status)}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {ticket.teacherEmail?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-slate-600 truncate max-w-[120px]" title={ticket.teacherEmail}>{ticket.teacherEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isAdmin && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 rounded-lg hover:bg-slate-900 hover:text-white"
                                onClick={() => setAssignTicket(ticket)}
                              >
                                <UserPlus size={16} weight="bold" />
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 rounded-lg hover:border-blue-200 hover:bg-blue-50 text-blue-600"
                              onClick={() => openTakeAction(ticket)}
                            >
                              <PencilSimple size={16} weight="bold" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        /* Analytics View for Management */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
          <Card className="border-none shadow-premium rounded-[2.5rem] bg-white p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-black">Tickets by Category</CardTitle>
              <CardDescription className="text-sm font-medium">Distribution of support requests across areas</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#EA104A" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-premium rounded-[2.5rem] bg-white p-8">
             <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-black">Ticket Resolution Metrics</CardTitle>
              <CardDescription className="text-sm font-medium">Overview of response efficacy</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Tickets', value: tickets.length, color: 'bg-slate-50 text-slate-600', icon: ListBullets },
                { label: 'Resolved', value: tickets.filter(t => t.status === 'RESOLVED').length, color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
                { label: 'In Progress', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'bg-blue-50 text-blue-600', icon: Clock },
                { label: 'Pending', value: tickets.filter(t => t.status === 'UNRESOLVED').length, color: 'bg-rose-50 text-rose-600', icon: Warning }
              ].map(stat => (
                <div key={stat.label} className={`p-6 rounded-[2rem] ${stat.color} flex flex-col gap-2 shadow-sm`}>
                  <stat.icon size={24} weight="bold" />
                  <div>
                    <p className="text-2xl font-black">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assignment Dialog */}
      <Dialog open={!!assignTicket} onOpenChange={() => setAssignTicket(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black tracking-tight">Assign Ticket</DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-500">
                Select a staff member to handle the request from <span className="font-bold text-slate-900">{assignTicket?.parentName}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Staff Member</Label>
              <Select onValueChange={handleAssign}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200">
                  <SelectValue placeholder="Choose an educator..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{s.fullName}</span>
                        <span className="text-[10px] font-medium text-slate-400">{s.email} • {s.role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-primary/20 italic text-xs text-slate-500 flex gap-3">
               <Warning size={18} className="shrink-0 text-slate-400" weight="bold" />
               Once assigned, the staff member will receive a notification and the ticket status will change to "In Progress".
            </div>
          </div>
          <DialogFooter className="mt-8 flex gap-3">
            <Button variant="ghost" onClick={() => setAssignTicket(null)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Take Action Dialog */}
      <Dialog open={!!takeActionTicket} onOpenChange={() => setTakeActionTicket(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8 border-none shadow-2xl overflow-hidden">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <PencilSimple className="text-blue-600" size={32} weight="bold" />
              Take Action
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-500">
              Update the status and add resolution remarks for ticket <span className="font-bold text-slate-900">#{takeActionTicket?.id.slice(-6).toUpperCase()}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-primary/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Parent</p>
                <p className="font-bold text-slate-800 text-sm">{takeActionTicket?.parentName}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-primary/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Student</p>
                <p className="font-bold text-slate-800 text-sm">{takeActionTicket?.studentName}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Update Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200">
                  <SelectValue placeholder="Update status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNRESOLVED">Unresolved / New</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved / Completed</SelectItem>
                  <SelectItem value="PARKED">On Hold / Parked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Action Remarks</Label>
              <textarea
                className="w-full min-h-[120px] rounded-2xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                placeholder="Describe actions taken or resolution details..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-8 flex gap-3">
            <Button variant="ghost" onClick={() => setTakeActionTicket(null)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
            <Button 
              disabled={isActionLoading} 
              onClick={handleUpdateTicket}
              className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg transition-all active:scale-95"
            >
              {isActionLoading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
