import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Video,
    Plus,
    Calendar,
    Clock,
    MapPin,
    User,
    Users,
    FileText,
    MoreVertical,
    Filter,
    CheckCircle2,
    PlayCircle,
    History,
    FileEdit
} from 'lucide-react';
import { Button } from '@pdi/components/ui/button';
import { Card } from '@pdi/components/ui/card';
import { Badge } from '@pdi/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pdi/components/ui/tabs';
import { PageHeader } from '@pdi/components/layout/PageHeader';
import { meetingService, Meeting } from '@pdi/services/meetingService';
import { format, isBefore, endOfDay } from 'date-fns';
import { useAuth } from '@pdi/hooks/useAuth';
import { toast } from 'sonner';
import { Role } from '@pdi/components/RoleBadge';
import { getSocket } from '@pdi/lib/socket';
import { formatRole, cn } from "@pdi/lib/utils";

export function MeetingsDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchMeetings();

        const socket = getSocket();

        // Listen to meeting events
        socket.on('meeting:created', () => { fetchMeetings(); });
        socket.on('meeting:updated', () => { fetchMeetings(); });
        socket.on('meeting:deleted', () => { fetchMeetings(); });

        return () => {
            socket.off('meeting:created');
            socket.off('meeting:updated');
            socket.off('meeting:deleted');
        };
    }, []);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const data = await meetingService.getAllMeetings();
            setMeetings(data);
        } catch (error) {
            console.error('Failed to fetch meetings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (meetingId: string) => {
        try {
            await meetingService.completeMeeting(meetingId);
            toast.success('Meeting marked as completed');
            fetchMeetings();
        } catch (error) {
            console.error('Failed to complete meeting', error);
            toast.error('Failed to mark meeting as completed');
        }
    };

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'Draft': return 'secondary';
            case 'Scheduled': return 'outline';
            case 'Ongoing': return 'default';
            case 'Completed': return 'default';
            case 'Archived': return 'outline';
            default: return 'default';
        }
    };

    const upcomingMeetings = meetings.filter(m =>
        (m.status === 'Scheduled' || m.status === 'Ongoing') &&
        !isBefore(endOfDay(new Date(m.meetingDate)), new Date())
    );
    const completedMeetings = meetings.filter(m => m.status === 'Completed');
    const draftMeetings = meetings.filter(m => m.status === 'Draft');

    const canCreateMeeting = ['ADMIN', 'LEADER', 'COORDINATOR', 'HOS', 'SUPERADMIN'].includes(user?.role || '');
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

    const renderMeetingCard = (meeting: Meeting) => {
        const isCreator = meeting.createdById === user?.id;
        const canManage = isCreator || isAdmin;

        return (
            <Card key={meeting.id} className="p-8 hover:shadow-lg transition-all border-l-4 border-l-primary/20">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Badge className={cn(
                            "px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase border-none text-foreground shadow-sm mb-2",
                            meeting.status === 'Scheduled' ? "bg-violet-600" :
                            meeting.status === 'Ongoing' ? "bg-violet-600" :
                            meeting.status === 'Completed' ? "bg-slate-600" :
                            meeting.status === 'Draft' ? "bg-amber-500" :
                            "bg-slate-400"
                        )}>
                            {meeting.status}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{meeting.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{meeting.meetingType} • {meeting.campusId || 'All Campuses'}</p>
                    </div>
                    <div className="flex gap-2">
                        {canManage && meeting.status === 'Draft' && (
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/meetings/edit/${meeting.id}`)}>
                                <FileEdit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {format(new Date(meeting.meetingDate), 'PPP')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        {meeting.startTime} - {meeting.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span className="line-clamp-1">{meeting.mode === 'Online' ? 'Microsoft Teams' : meeting.locationLink || 'Main Office'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2 text-primary" />
                        <span className="line-clamp-1">By {meeting.createdBy?.fullName}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                    <div className="flex -space-x-2 shrink-0">
                        {meeting.attendees?.slice(0, 3).map((a, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-xs font-medium text-primary" title={a.user.fullName}>
                                {a.user.fullName.charAt(0)}
                            </div>
                        ))}
                        {(meeting.attendees?.length || 0) > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                +{(meeting.attendees?.length || 0) - 3}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end items-center w-full sm:w-auto">
                        {meeting.status === 'Completed' ? (
                            (canManage || meeting.momStatus === 'Published') ? (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => navigate(`/meetings/${meeting.id}/mom`)}
                                    className={`shadow-sm transition-all duration-300 ${meeting.momStatus === 'Published' ? 'bg-backgroundlack hover:bg-backgroundlack/90 text-foreground' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {meeting.momStatus === 'Published'
                                        ? 'View MoM'
                                        : canManage
                                            ? (meeting.momStatus === 'Draft' ? 'Edit Draft MoM' : 'Create MoM')
                                            : 'MoM Published'}
                                </Button>
                            ) : (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled
                                    title="MoM is still being drafted by the creator."
                                >
                                    MoM Drafted
                                </Button>
                            )
                        ) : (
                            <div className="flex flex-wrap gap-2 justify-end items-center">
                                {canManage && (meeting.status === 'Scheduled' || meeting.status === 'Ongoing') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleComplete(meeting.id)}
                                        className="border-primary text-primary hover:bg-primary/5"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Mark Completed
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    className="text-gray-400 cursor-not-allowed opacity-50 bg-gray-50"
                                    title="Minutes of Meeting can only be created after completion."
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    MoM Inactive
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Meetings & Virtual Sessions"
                    subtitle="Manage schedules, conduct meetings, and track Minutes of Meeting (MoM)."
                />
                {canCreateMeeting && (
                    <Button onClick={() => navigate('/meetings/create')} className="bg-primary hover:bg-primary/90">
                        <Plus className="w-5 h-5 mr-2" />
                        Schedule New Meeting
                    </Button>
                )}
            </div>

            <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
                    <TabsTrigger value="upcoming" className="flex items-center">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Upcoming
                        {upcomingMeetings.length > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                                {upcomingMeetings.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center">
                        <History className="w-4 h-4 mr-2" />
                        History
                    </TabsTrigger>
                    <TabsTrigger value="drafts" className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        My Drafts
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <Card key={i} className="h-64 animate-pulse bg-gray-50" />)}
                        </div>
                    ) : upcomingMeetings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingMeetings.map(renderMeetingCard)}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No upcoming meetings</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">You don't have any meetings scheduled at the moment.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="completed">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedMeetings.map(renderMeetingCard)}
                    </div>
                </TabsContent>

                <TabsContent value="drafts">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {draftMeetings.map(renderMeetingCard)}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
