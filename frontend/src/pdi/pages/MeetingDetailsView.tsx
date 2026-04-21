import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    Video,
    Users,
    FileText,
    CheckCircle2,
    Link as LinkIcon,
    User,
    Info,
    History,
    ArrowLeft,
    Share2,
    PenTool,
    PlusCircle,
    Play,
    FileCheck,
    Target,
    ClipboardList,
    Download,
    Paperclip
} from 'lucide-react';
import { Button } from '@pdi/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Badge } from '@pdi/components/ui/badge';
import { PageHeader } from '@pdi/components/layout/PageHeader';
import { meetingService, Meeting } from '@pdi/services/meetingService';
import { useAuth } from '@pdi/hooks/useAuth';
import { format } from 'date-fns';
import { Role } from '@pdi/components/RoleBadge';
import { toast } from 'sonner';
import { cn } from '@pdi/lib/utils';
import { ScrollArea } from '@pdi/components/ui/scroll-area';

export function MeetingDetailsView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchMeetingDetails();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchMeetingDetails = async () => {
        try {
            setLoading(true);
            const data = await meetingService.getMeetingById(id!);
            setMeeting(data);
        } catch (error) {
            console.error('Failed to fetch meeting details', error);
            toast.error('Failed to load meeting details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            // Check if meetingService has updateStatus, else fallback to completeMeeting if status is COMPLETED
            if (status === "Completed") {
                await meetingService.completeMeeting(id!);
            }
            toast.success(`Meeting status updated to ${status}`);
            fetchMeetingDetails();
        } catch (error) {
            console.error('Failed to update status', error);
            toast.error('Failed to update meeting status');
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClass = "px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase border-none text-white shadow-sm";
        switch (status) {
            case 'Completed':
                return <Badge className={cn(baseClass, "bg-slate-600")}>Completed</Badge>;
            case 'Ongoing':
                return <Badge className={cn(baseClass, "bg-emerald-600")}>Ongoing</Badge>;
            case 'Scheduled':
                return <Badge className={cn(baseClass, "bg-blue-600")}>Scheduled</Badge>;
            case 'Draft':
                return <Badge className={cn(baseClass, "bg-amber-500")}>Draft</Badge>;
            default:
                return <Badge className={cn(baseClass, "bg-slate-400")}>{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <History className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Meeting Not Found</h2>
                <p className="text-gray-500 mt-2">The meeting you are looking for does not exist or has been removed.</p>
                <Button onClick={() => navigate('/meetings')} className="mt-6">
                    Back to Meetings
                </Button>
            </div>
        );
    }

    const isCreator = meeting.createdById === user?.id;
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
    const canManage = isCreator || isAdmin;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                            <Calendar className="w-4 h-4" />
                            {meeting.meetingDate ? format(new Date(meeting.meetingDate), 'EEEE, MMMM do, yyyy') : (meeting as any).date}
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                            <Clock className="w-4 h-4" />
                            {meeting.startTime} - {meeting.endTime}
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                            <MapPin className="w-4 h-4" />
                            {meeting.locationLink || (meeting.mode === 'Online' ? 'Online' : 'Main Office')}
                        </span>
                        {getStatusBadge(meeting.status)}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Meeting link copied to clipboard!");
                        }}>
                            <Share2 className="w-4 h-4" />
                            Share Link
                        </Button>
                        {isCreator && (
                            <Button size="sm" onClick={() => navigate(`/meetings/edit/${meeting.id}`)} className="gap-2">
                                <PenTool className="w-4 h-4" />
                                Edit Meeting
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Meeting Content */}
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50">
                            <CardTitle className="text-xl">Agenda & Description</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {meeting.description || "No description provided."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* MoM Section */}
                    {meeting.status === "Completed" && (
                        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="border-b bg-emerald-50/50 flex flex-row items-center justify-between space-y-0">
                                <div className="flex flex-col gap-1">
                                    <CardTitle className="text-xl text-emerald-900 flex items-center gap-2">
                                        Minutes of Meeting (MoM)
                                        {(user?.role === 'MANAGEMENT' || canManage) && (
                                            <Button variant="outline" size="sm" className="ml-4 h-7 text-xs bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 border-emerald-200 shadow-sm" onClick={() => {
                                                const momText = `MoM: ${meeting.title}\n\nSummary:\n${(meeting as any).mom.summary}\n\nMeeting Link: ${window.location.href}`;
                                                navigator.clipboard.writeText(momText);
                                                toast.success("MoM copied to clipboard for sharing!");
                                            }}>
                                                <Share2 className="w-3 h-3 mr-1" /> Share MoM
                                            </Button>
                                        )}
                                    </CardTitle>
                                    <CardDescription>Official record of decisions and updates from this meeting</CardDescription>
                                </div>
                                <FileCheck className="w-6 h-6 text-emerald-600" />
                            </CardHeader>
                            <CardContent className="p-6">
                                {(meeting as any).mom ? (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-5 border border-emerald-100/50 shadow-sm">
                                            <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                                <History className="w-4 h-4" />
                                                Meeting Summary
                                            </h4>
                                            <p className="text-emerald-800/80 leading-relaxed whitespace-pre-wrap">
                                                {(meeting as any).mom.summary}
                                            </p>
                                        </div>

                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm">
                                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                    <Target className="w-4 h-4 text-primary" />
                                                    Key Decisions
                                                </h4>
                                                <ul className="space-y-2">
                                                    {(meeting as any).mom.decisions.map((decision: string, i: number) => (
                                                        <li key={i} className="flex gap-2 text-sm text-slate-600">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                            {decision}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm">
                                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                    <ClipboardList className="w-4 h-4 text-indigo-600" />
                                                    Action Items
                                                </h4>
                                                <ul className="space-y-3">
                                                    {(meeting as any).mom.actionItems.map((item: any, i: number) => (
                                                        <li key={i} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                            <p className="text-sm font-medium text-slate-900 mb-1">{item.task}</p>
                                                            <div className="flex items-center justify-between text-[11px]">
                                                                <span className="text-slate-500 font-medium">{item.assignee}</span>
                                                                <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                                                                    {item.dueDate}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-4 shadow-sm">
                                            <FileText className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">MoM hasn't been added for this meeting yet.</p>
                                        {isCreator && (
                                            <Button
                                                variant="outline"
                                                className="mt-4 gap-2 rounded-xl"
                                                onClick={() => navigate(`/meetings/${meeting.id}/mom`)}
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                                Create MoM
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {!(meeting as any).mom && meeting.status !== "Completed" && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
                            <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                                <FileCheck className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 mb-1">Upcoming Meeting</h4>
                                <p className="text-sm text-indigo-700 leading-relaxed">
                                    MoM can be generated once the meeting is completed. Use this page to track the agenda and attendees in the meantime.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Interaction Buttons */}
                    {isCreator && meeting.status !== "Completed" && (
                        <Card className="border-none shadow-xl shadow-indigo-500/10 bg-indigo-600 text-white overflow-hidden group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Lead Meeting</CardTitle>
                                <CardDescription className="text-indigo-100">Quick actions for the meeting lead</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                <Button
                                    className="w-full bg-white text-indigo-600 hover:bg-white/90 gap-2 font-bold h-11 rounded-xl"
                                    onClick={() => navigate(`/meetings/${meeting.id}/mom`)}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Generate MoM
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-white/20 hover:bg-white/10 text-white gap-2 h-11 rounded-xl"
                                    onClick={() => handleUpdateStatus("Completed")}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mark as Completed
                                </Button>
                                {meeting.status === 'Scheduled' && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/20 hover:bg-white/10 text-white gap-2 h-11 rounded-xl"
                                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                                    >
                                        <Play className="w-4 h-4" />
                                        Start Meeting
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Attendees */}
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between pb-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg">Attendees</CardTitle>
                            </div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none">
                                {meeting.attendees?.length || 0}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[400px]">
                                <div className="divide-y divide-slate-100">
                                    {(meeting.attendees || []).map((attendee: any, i: number) => (
                                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                    {attendee.fullName ? attendee.fullName.split(' ').map((n: any) => n[0]).join('') : attendee.user?.fullName?.split(' ').map((n: any) => n[0]).join('') || "A"}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{attendee.fullName || attendee.user?.fullName || attendee.email}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium truncate">{attendee.role || attendee.user?.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={cn(
                                                    "px-2 py-0.5 rounded-full font-black text-[8px] tracking-widest uppercase border-none text-white shadow-sm",
                                                    attendee.status === "PRESENT" ? "bg-emerald-600" : "bg-amber-500"
                                                )}>
                                                    {attendee.status || "INVITED"}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Resources */}
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-4 text-primary" />
                                <CardTitle className="text-lg">Resources</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {((meeting as any).attachments && (meeting as any).attachments.length > 0) ? (
                                <div className="space-y-3">
                                    {(meeting as any).attachments.map((file: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 group hover:border-primary/30 transition-all bg-slate-50/30">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 rounded-lg bg-white shadow-sm">
                                                    <Paperclip className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 truncate">{file.name || file.fileName}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary shadow-none">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-zinc-400 italic">No resources attached.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
