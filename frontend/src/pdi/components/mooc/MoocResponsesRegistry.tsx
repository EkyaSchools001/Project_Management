import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, Eye, Link as LinkIcon, Brain } from 'lucide-react';
import { toast } from "sonner";
import { moocService } from "@pdi/services/moocService";
import { Button } from "@pdi/components/ui/button";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { Input } from "@pdi/components/ui/input";
import { Card, CardContent } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@pdi/components/ui/dialog";
import { Label } from "@pdi/components/ui/label";
import { cn } from "@pdi/lib/utils";

interface MoocResponsesViewProps {
  refresh?: () => Promise<void>;
  backPath?: string;
}

export const MoocResponsesView: React.FC<MoocResponsesViewProps> = ({ refresh, backPath = "/leader/calendar" }) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await moocService.getAllSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to load MOOC submissions", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  async function handleUpdateStatus(status: string) {
    if (!selectedSubmission) return;
    try {
      setIsUpdating(true);
      await moocService.updateStatus(selectedSubmission.id, status);
      toast.success(`Submission ${status.toLowerCase()} successfully`);

      // Update local state
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, status } : s));
      setSelectedSubmission(null);

      // Refresh data if needed
      if (refresh) await refresh();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update submission status");
    } finally {
      setIsUpdating(false);
    }
  }

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.courseName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = platformFilter === "all" || (s.platform === 'Other' ? s.otherPlatform : s.platform) === platformFilter;
    const matchesStatus = statusFilter === "all" || (s.status || 'PENDING') === statusFilter;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const platforms = Array.from(new Set(submissions.map(s => s.platform === 'Other' ? s.otherPlatform : s.platform).filter(Boolean)));
  const statuses = Array.from(new Set(submissions.map(s => s.status || 'PENDING')));

  if (loading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          title="Course Evidence Registry"
          subtitle="Review MOOC completions and reflection evidence"
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            className="pl-10 w-[250px] bg-backgroundackgroundackground border-muted-foreground/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-xl bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Teacher Profile</th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Course Details</th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span>Platform</span>
                      <select 
                        className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="all">All</option>
                        {platforms.map(p => (
                          <option key={String(p)} value={String(p)}>{String(p)}</option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Completion</th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Evidence</th>
                  <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      <select 
                        className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="all">All</option>
                        {statuses.map(s => (
                          <option key={String(s)} value={String(s)}>{String(s)}</option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th className="text-right p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-foreground">{sub.name || sub.user?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{sub.email || sub.user?.email}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-medium text-foreground">{sub.courseName}</p>
                      <p className="text-xs text-muted-foreground">{sub.hours} Hours</p>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline">{sub.platform === 'Other' ? sub.otherPlatform : sub.platform}</Badge>
                    </td>
                    <td className="p-6">
                      {new Date(sub.completionDate).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      {sub.hasCertificate === 'yes' ? (
                        <a href={sub.proofLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline font-medium">
                          <LinkIcon className="w-3 h-3" />
                          Certificate
                        </a>
                      ) : (
                        <Badge variant="secondary">Reflection</Badge>
                      )}
                    </td>
                    <td className="p-6">
                      <Badge className={cn(
                        "px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase border-none text-foreground shadow-sm",
                        sub.status === 'APPROVED' ? "bg-backgroundmerald-600" : 
                        sub.status === 'REJECTED' ? "bg-rose-600" : 
                        "bg-amber-500"
                      )}>
                        {sub.status || 'PENDING'}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(sub)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground">
                      No submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && new Date(selectedSubmission.submittedAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Teacher</Label>
                  <p className="font-medium">{selectedSubmission.name || selectedSubmission.user?.fullName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Campus</Label>
                  <p className="font-medium">{selectedSubmission.campus || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Course</Label>
                  <p className="font-medium">{selectedSubmission.courseName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Platform</Label>
                  <p className="font-medium">{selectedSubmission.platform === 'Other' ? selectedSubmission.otherPlatform : selectedSubmission.platform}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hours</Label>
                  <p className="font-medium">{selectedSubmission.hours}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Completion Date</Label>
                  <p className="font-medium">{new Date(selectedSubmission.completionDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="h-px bg-backgroundackgroundorder my-4" />

              {selectedSubmission.hasCertificate === 'yes' ? (
                <div>
                  <Label className="text-muted-foreground block mb-2">Certificate</Label>
                  <a href={selectedSubmission.proofLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline border px-4 py-2 rounded-md bg-primary/5">
                    <LinkIcon className="w-4 h-4" />
                    Open Certificate Link
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2"><Brain className="w-4 h-4" /> Reflection</h4>
                  <div>
                    <Label className="text-muted-foreground">Key Takeaways</Label>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{selectedSubmission.keyTakeaways}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Unanswered Questions</Label>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{selectedSubmission.unansweredQuestions}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Most Enjoyed</Label>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{selectedSubmission.enjoyedMost}</p>
                  </div>
                </div>
              )}

              {selectedSubmission.status === 'PENDING' && (
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleUpdateStatus('REJECTED')}
                    disabled={isUpdating}
                  >
                    Reject Submission
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-foreground"
                    onClick={() => handleUpdateStatus('APPROVED')}
                    disabled={isUpdating}
                  >
                    Approve & Add Hours
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
