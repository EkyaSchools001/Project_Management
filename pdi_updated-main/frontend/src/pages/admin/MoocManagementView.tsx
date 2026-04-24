import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye, CheckCircle, XCircle, ShieldCheck, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MoocEvidenceForm } from "@/components/MoocEvidenceForm";
import { useAuth } from "@/hooks/useAuth";

// Mock data for MOOC submissions
const mockSubmissions = [
    {
        id: "1",
        teacherName: "Sarah Jenkins",
        courseName: "Introduction to Child Psychology",
        platform: "Coursera",
        date: "2023-10-25",
        status: "Pending",
        certificateUrl: "https://example.com/cert1.pdf"
    },
    {
        id: "2",
        teacherName: "Michael Chen",
        courseName: "Advanced Excel for Educators",
        platform: "edX",
        date: "2023-10-24",
        status: "Approved",
        certificateUrl: "https://example.com/cert2.pdf"
    },
    {
        id: "3",
        teacherName: "Emily Rodriguez",
        courseName: "Teaching English as a Second Language",
        platform: "FutureLearn",
        date: "2023-10-22",
        status: "Rejected",
        certificateUrl: "https://example.com/cert3.pdf"
    },
    {
        id: "4",
        teacherName: "David Kim",
        courseName: "Digital Transformation in Education",
        platform: "Coursera",
        date: "2023-10-20",
        status: "Pending",
        certificateUrl: "https://example.com/cert4.pdf"
    }
];

export function MoocManagementView() {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState(mockSubmissions);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isMoocFormOpen, setIsMoocFormOpen] = useState(false);

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = sub.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.courseName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleApprove = (id: string) => {
        setSubmissions(submissions.map(sub => 
            sub.id === id ? { ...sub, status: "Approved" } : sub
        ));
        toast.success("MOOC submission approved successfully");
    };

    const handleReject = (id: string) => {
        setSubmissions(submissions.map(sub => 
            sub.id === id ? { ...sub, status: "Rejected" } : sub
        ));
        toast.success("MOOC submission rejected");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="MOOC Submission Management"
                    subtitle="Review and approve teacher MOOC certifications and external training evidence"
                />
                <Button onClick={() => setIsMoocFormOpen(true)} className="gap-2 rounded-xl group shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
                    <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    Submit New Evidence
                </Button>
            </div>

            <Dialog open={isMoocFormOpen} onOpenChange={setIsMoocFormOpen}>
                <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl shadow-2xl">
                    <MoocEvidenceForm
                        onCancel={() => setIsMoocFormOpen(false)}
                        onSubmitSuccess={() => {
                            setIsMoocFormOpen(false);
                            // Real app would refetch
                        }}
                        userEmail={user?.email || ""}
                        userName={user?.fullName || ""}
                    />
                </DialogContent>
            </Dialog>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by teacher or course..."
                        className="pl-8 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] rounded-xl bg-background border-muted/20">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="shadow-md border-slate-100">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        Certification Submissions
                    </CardTitle>
                    <CardDescription>
                        Manage external course completions submitted by your faculty.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Teacher Name</TableHead>
                                <TableHead>Course Details</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Submitted On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubmissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No submissions found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSubmissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">
                                            {submission.teacherName}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[250px] truncate font-medium" title={submission.courseName}>
                                                {submission.courseName}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                                                {submission.platform}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(submission.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={submission.status === 'Approved' ? 'default' : submission.status === 'Pending' ? 'secondary' : 'destructive'}
                                                className={submission.status === 'Approved' ? 'bg-black text-white hover:bg-black cursor-default' : submission.status === 'Pending' ? 'bg-amber-500 text-amber-950' : ''}
                                            >
                                                {submission.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="h-8 group"
                                                    onClick={() => window.open(submission.certificateUrl, '_blank')}
                                                >
                                                    <Eye className="w-4 h-4 group-hover:text-primary transition-colors mr-1" /> View
                                                </Button>
                                                
                                                {submission.status === 'Pending' && (
                                                    <>
                                                        <Button 
                                                            variant="default" 
                                                            size="icon"
                                                            className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700"
                                                            title="Approve"
                                                            onClick={() => handleApprove(submission.id)}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            title="Reject"
                                                            onClick={() => handleReject(submission.id)}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
