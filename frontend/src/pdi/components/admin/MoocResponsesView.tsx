import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ChevronLeft, Search, Eye, Link as LinkIcon, Brain, 
    Paperclip, Star, Download 
} from "lucide-react";
import { moocService } from "@pdi/services/moocService";
import { toast } from "sonner";
import { cn } from "@pdi/lib/utils";
import { Button } from "@pdi/components/ui/button";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { Input } from "@pdi/components/ui/input";
import { Card, CardContent } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { 
    Dialog, DialogContent, DialogDescription, DialogHeader, 
    DialogTitle 
} from "@pdi/components/ui/dialog";
import { Label } from "@pdi/components/ui/label";

interface MoocResponsesViewProps {
    refreshTeam?: () => Promise<void>;
    onBack?: () => void;
}

export function MoocResponsesView({ refreshTeam, onBack }: MoocResponsesViewProps) {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
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
        loadSubmissions();
    }, []);

    async function handleUpdateStatus(status: string) {
        if (!selectedSubmission) return;
        try {
            setIsUpdating(true);
            await moocService.updateStatus(selectedSubmission.id, status);
            toast.success(`Submission ${status.toLowerCase()} successfully`);

            // Update local state
            setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, status } : s));
            setSelectedSubmission(null);

            // Refresh team data if callback provided
            if (refreshTeam) {
                await refreshTeam();
            }
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update submission status");
        } finally {
            setIsUpdating(false);
        }
    }

    const filteredSubmissions = submissions.filter(s =>
        (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.courseName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <Button variant="ghost" size="icon" onClick={() => onBack ? onBack() : navigate(-1)}>
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
                        className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
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
                                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Teacher</th>
                                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Course</th>
                                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Platform</th>
                                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Completion Date</th>
                                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Evidence</th>
                                    <th className="text-left p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Status</th>
                                    <th className="text-right p-6 text-sm font-bold capitalize tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted-foreground/10">
                                {filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-6">
                                            <p className="font-bold text-foreground">{sub.name}</p>
                                            <p className="text-xs text-muted-foreground">{sub.email}</p>
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
                                                sub.status === 'APPROVED' ? "bg-violet-600" : 
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
                                    <p className="font-medium">{selectedSubmission.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Campus</Label>
                                    <p className="font-medium">{selectedSubmission.campus}</p>
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

                            <div className="h-px bg-backgroundorder my-4" />

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
                                        <Label className="text-muted-foreground">Self-Assessment</Label>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-4 h-4 text-primary fill-primary" />
                                            <span className="font-bold">{selectedSubmission.effectivenessRating}/10</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(selectedSubmission.supportingDocType || selectedSubmission.supportingDocLink || selectedSubmission.supportingDocFile) && (
                                <div>
                                    <div className="h-px bg-backgroundorder my-4" />
                                    <h4 className="font-bold flex items-center gap-2 mb-3">
                                        <Paperclip className="w-4 h-4" /> Supporting Documents
                                    </h4>

                                    {selectedSubmission.supportingDocType === 'link' && selectedSubmission.supportingDocLink && (
                                        <div>
                                            <Label className="text-muted-foreground block mb-2">External Link</Label>
                                            <a
                                                href={selectedSubmission.supportingDocLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:underline border px-4 py-2 rounded-md bg-primary/5"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                Open Attached Document
                                            </a>
                                        </div>
                                    )}

                                    {selectedSubmission.supportingDocType === 'file' && selectedSubmission.supportingDocFile && (
                                        <div>
                                            <Label className="text-muted-foreground block mb-2">Attached File</Label>
                                            <a
                                                href={selectedSubmission.supportingDocFile}
                                                download={selectedSubmission.supportingDocFileName || "supporting-document"}
                                                className="inline-flex items-center gap-2 text-primary hover:underline border px-4 py-2 rounded-md bg-primary/5"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download {selectedSubmission.supportingDocFileName || "Document"}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="h-px bg-backgroundorder my-4" />

                            <div>
                                <Label className="text-muted-foreground">Effectiveness Rating</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <div key={i} className={cn("w-2 h-2 rounded-full", i < (Array.isArray(selectedSubmission.effectivenessRating) ? selectedSubmission.effectivenessRating[0] : selectedSubmission.effectivenessRating) ? "bg-primary" : "bg-muted")} />
                                        ))}
                                    </div>
                                    <span className="font-bold">{(Array.isArray(selectedSubmission.effectivenessRating) ? selectedSubmission.effectivenessRating[0] : selectedSubmission.effectivenessRating)}/10</span>
                                </div>
                            </div>

                            {selectedSubmission.additionalFeedback && (
                                <div>
                                    <Label className="text-muted-foreground">Additional Feedback</Label>
                                    <p className="mt-1 text-sm italic">{selectedSubmission.additionalFeedback}</p>
                                </div>
                            )}

                            {selectedSubmission.status !== 'APPROVED' && selectedSubmission.status !== 'REJECTED' && (
                                <div className="flex gap-3 pt-6 border-t mt-6">
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-destructive hover:bg-destructive/10"
                                        onClick={() => handleUpdateStatus('REJECTED')}
                                        disabled={isUpdating}
                                    >
                                        Reject Submission
                                    </Button>
                                    <Button
                                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                                        onClick={() => handleUpdateStatus('APPROVED')}
                                        disabled={isUpdating}
                                    >
                                        Approve Submission
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
