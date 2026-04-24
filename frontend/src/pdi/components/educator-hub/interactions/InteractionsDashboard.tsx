import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Button } from '@pdi/components/ui/button';
import { Badge } from '@pdi/components/ui/badge';
import { Plus, DownloadSimple, MagnifyingGlass, FileX, LinkSimple, Copy, Check, ArrowSquareOut } from '@phosphor-icons/react';
import { Input } from '@pdi/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pdi/components/ui/select';
import { PTILWizardModal } from './PTILWizardModal';
import api from '@pdi/lib/api';
import { useAuth } from '@pdi/hooks/useAuth';
import { Skeleton } from '@pdi/components/ui/skeleton';
import { toast } from 'sonner';

export function InteractionsDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  const role = user?.role ? user.role.toUpperCase() : 'TEACHER';
  const hasGlobalAccess = ['LEADER', 'MANAGEMENT', 'ADMIN', 'SUPERADMIN'].includes(role);

  const publicUrl = `${window.location.origin}/support`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== 'ALL') query.append('status', statusFilter);
      if (gradeFilter !== 'ALL') query.append('grade', gradeFilter);
      if (search) query.append('search', search);

      const [recordsRes, analyticsRes] = await Promise.all([
        api.get(`/ptil?${query.toString()}`),
        hasGlobalAccess ? api.get('/ptil/analytics') : Promise.resolve({ data: { data: null } }),
      ]);
      
      const allRecords = recordsRes.data.data.records;
      
      // EXCLUDE support tickets from Interactions dashboard
      const filteredRecords = allRecords.filter((r: any) => 
        r.meetingRequestedBy !== 'SUPPORT_PORTAL' && 
        r.remarks !== 'Raised via Public Support Portal'
      );

      setData(filteredRecords);
      if (hasGlobalAccess && analyticsRes.data.data) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to load interactions data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, gradeFilter, search]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PARKED': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'UNRESOLVED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportToCSV = () => {
    if (!data.length) return toast.info('No data to export');
    
    const headers = ['Meeting Date', 'Parent Name', 'Parent Email', 'Section Name', 'Grade', 'Category', 'Status', 'Teacher'];
    const csvContent = [
      headers.join(','),
      ...data.map(r => [
        new Date(r.meetingDate).toLocaleDateString(),
        `"${r.parentName}"`,
        `"${r.parentEmail}"`,
        `"${r.studentName}"`,
        `"${r.grade}"`,
        `"${r.concernCategory}"`,
        r.status,
        `"${r.teacherEmail}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ptil_export_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Public Interaction Link Card */}
      <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 via-white to-orange-50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#EA104A] flex items-center justify-center text-white shadow-md">
            <LinkSimple weight="bold" size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Ekya Support Form</p>
            <p className="text-xs text-slate-500">Share this link with parents to raise support requests</p>
          </div>
        </div>
        <div className="flex-1 w-full sm:w-auto flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-inner">
          <code className="text-xs text-red-600 font-mono truncate flex-1">{publicUrl}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
            title="Copy link"
          >
            {copied ? <Check size={16} weight="bold" className="text-green-500" /> : <Copy size={16} weight="bold" />}
          </button>
        </div>
        <a 
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm"
        >
          <ArrowSquareOut weight="bold" size={14} />
          Open
        </a>
      </div>
      {/* Analytics Hook for Admins/Leaders */}
      {hasGlobalAccess && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Interactions</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analytics.total}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">Resolved</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analytics.statusCounts.resolved}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analytics.statusCounts.inProgress}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-600">Unresolved</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{analytics.statusCounts.unresolved}</div></CardContent>
          </Card>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="PARKED">Parked</SelectItem>
              <SelectItem value="UNRESOLVED">Unresolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Grade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Grades</SelectItem>
              <SelectItem value="Early Years">Early Years</SelectItem>
              <SelectItem value="Grade 1">Grade 1</SelectItem>
              <SelectItem value="Grade 5">Grade 5</SelectItem>
              <SelectItem value="Grade 10">Grade 10</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-[200px]">
            <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search parent/section..." 
              className="pl-8" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={exportToCSV} className="gap-2 shrink-0">
            <DownloadSimple weight="bold" /> Export CSV
          </Button>
          <Button onClick={() => setIsWizardOpen(true)} className="gap-2 shrink-0">
            <Plus weight="bold" /> New Interaction
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Parent & Section</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium">Concern Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Logged By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={6} className="p-4"><Skeleton className="h-10 w-full" /></td></tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <FileX size={32} className="text-muted-foreground/50" />
                       <p>No interactions found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="bg-card border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {new Date(row.meetingDate).toLocaleDateString('en-GB')}
                      <div className="text-xs text-muted-foreground font-normal">{row.meetingTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{row.parentName}</div>
                      <div className="text-xs text-muted-foreground">Section: {row.studentName}</div>
                    </td>
                    <td className="px-6 py-4">{row.grade}</td>
                    <td className="px-6 py-4">
                      <span className="truncate max-w-[200px] block" title={row.concernCategory}>{row.concernCategory}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={getStatusColor(row.status)}>
                        {row.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {row.teacherEmail}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Wizard Dialog */}
      {isWizardOpen && user && (
        <PTILWizardModal 
          open={isWizardOpen} 
          onOpenChange={setIsWizardOpen} 
          onSuccess={fetchData} 
          currentUserRole={role}
          currentUserId={user.id}
          currentUserEmail={user.email}
        />
      )}
    </div>
  );
}
