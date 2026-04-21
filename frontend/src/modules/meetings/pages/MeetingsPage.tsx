import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { MeetingCard, MeetingStatus, MeetingProvider } from '../components/MeetingCard';
import { MeetingScheduler, MeetingFormData, MeetingProvider as SchedulerProvider } from '../components/MeetingScheduler';
import { MeetingModal } from '../components/MeetingModal';
import { Plus, Calendar as CalendarIcon, List, VideoCamera, Clock, Users } from '@phosphor-icons/react';

interface Meeting {
    id: string;
    title: string;
    description?: string;
    startTime: string | Date;
    endTime?: string | Date;
    duration: number;
    meetingType: MeetingProvider;
    meetingUrl?: string;
    hostId: string;
    hostName: string;
    attendees: Array<{
        userId: string;
        name: string;
        email?: string;
        role: 'host' | 'participant';
    }>;
    status: MeetingStatus;
}

const MOCK_MEETINGS: Meeting[] = [
    {
        id: 'mtg_001',
        title: 'Weekly Team Standup',
        description: 'Regular weekly sync to discuss progress and blockers',
        startTime: new Date(Date.now() + 86400000),
        duration: 60,
        meetingType: 'zoom',
        meetingUrl: 'https://zoom.us/j/123456789',
        hostId: 'teacher-1',
        hostName: 'John Doe',
        attendees: [
            { userId: 'teacher-1', name: 'John Doe', role: 'host' },
            { userId: 'teacher-2', name: 'Jane Smith', role: 'participant' },
            { userId: 'teacher-3', name: 'Bob Wilson', role: 'participant' },
        ],
        status: 'scheduled'
    },
    {
        id: 'mtg_002',
        title: 'Parent Teacher Conference',
        description: 'Quarterly PTC to discuss student progress',
        startTime: new Date(Date.now() + 172800000),
        duration: 120,
        meetingType: 'google_meet',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        hostId: 'leader-1',
        hostName: 'Jane Smith',
        attendees: [
            { userId: 'leader-1', name: 'Jane Smith', role: 'host' },
        ],
        status: 'scheduled'
    },
    {
        id: 'mtg_003',
        title: 'Department Heads Meeting',
        description: 'Monthly sync with all department heads',
        startTime: new Date(Date.now() - 86400000),
        duration: 90,
        meetingType: 'microsoft_teams',
        hostId: 'admin-1',
        hostName: 'Admin User',
        attendees: [],
        status: 'ended'
    },
    {
        id: 'mtg_004',
        title: 'Quick Sync',
        description: 'Quick standup meeting',
        startTime: new Date(),
        duration: 15,
        meetingType: 'internal',
        hostId: 'teacher-1',
        hostName: 'John Doe',
        attendees: [],
        status: 'live'
    }
];

export function MeetingsPage() {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [showScheduler, setShowScheduler] = useState(false);
    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());

    const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' || m.status === 'live');
    const pastMeetings = meetings.filter(m => m.status === 'ended' || m.status === 'cancelled');
    const liveMeetings = meetings.filter(m => m.status === 'live');

    const handleJoinMeeting = (meetingId: string) => {
        console.log('Joining meeting:', meetingId);
        navigate(`/meetings/${meetingId}/room`);
    };

    const handleViewMeeting = (meetingId: string) => {
        const meeting = meetings.find(m => m.id === meetingId);
        if (meeting) {
            setSelectedMeeting(meeting);
            setShowMeetingModal(true);
        }
    };

    const handleEditMeeting = (meetingId: string) => {
        navigate(`/meetings/edit/${meetingId}`);
    };

    const handleScheduleMeeting = async (data: MeetingFormData) => {
        console.log('Scheduling meeting:', data);
        
        const newMeeting: Meeting = {
            id: `mtg_${Date.now()}`,
            title: data.title,
            description: data.description,
            startTime: new Date(data.startDate.getTime() + parseTime(data.startTime)),
            duration: data.duration,
            meetingType: data.meetingType as MeetingProvider,
            hostId: 'current-user',
            hostName: 'Current User',
            attendees: [],
            status: 'scheduled'
        };

        setMeetings(prev => [...prev, newMeeting]);
        setShowScheduler(false);
    };

    const parseTime = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 3600000 + minutes * 60000;
    };

    const getMeetingsForDate = (date: Date) => {
        return meetings.filter(m => {
            const meetingDate = new Date(m.startTime);
            return meetingDate.toDateString() === date.toDateString();
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Meetings</h1>
                    <p className="text-muted-foreground">Manage your video conferences and meetings</p>
                </div>
                <Button onClick={() => setShowScheduler(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Meeting
                </Button>
            </div>

            {liveMeetings.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <VideoCamera className="h-5 w-5 animate-pulse" />
                            Live Now
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {liveMeetings.map(meeting => (
                                <MeetingCard
                                    key={meeting.id}
                                    meeting={meeting}
                                    onJoin={handleJoinMeeting}
                                    onView={handleViewMeeting}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="upcoming" className="w-full">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
                        <TabsTrigger value="past">Past ({pastMeetings.length})</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4 mr-1" />
                            List
                        </Button>
                        <Button
                            variant={viewMode === 'calendar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('calendar')}
                        >
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Calendar
                        </Button>
                    </div>
                </div>

                <TabsContent value="upcoming" className="space-y-4 mt-4">
                    {upcomingMeetings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No upcoming meetings</p>
                                <Button className="mt-4" onClick={() => setShowScheduler(true)}>
                                    Schedule Meeting
                                </Button>
                            </CardContent>
                        </Card>
                    ) : viewMode === 'list' ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingMeetings.map(meeting => (
                                <MeetingCard
                                    key={meeting.id}
                                    meeting={meeting}
                                    onJoin={handleJoinMeeting}
                                    onView={handleViewMeeting}
                                    onEdit={handleEditMeeting}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-6">
                                <Calendar
                                    mode="single"
                                    selected={calendarDate}
                                    onSelect={(date) => date && setCalendarDate(date)}
                                    className="w-full"
                                />
                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2">
                                        Meetings on {format(calendarDate, 'MMMM d, yyyy')}
                                    </h3>
                                    <div className="space-y-2">
                                        {getMeetingsForDate(calendarDate).map(meeting => (
                                            <div key={meeting.id} className="flex items-center gap-2 p-2 border rounded-md">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{meeting.title}</span>
                                                <Badge variant="outline">{meeting.duration} min</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4 mt-4">
                    {pastMeetings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No past meetings</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pastMeetings.map(meeting => (
                                <MeetingCard
                                    key={meeting.id}
                                    meeting={meeting}
                                    onView={handleViewMeeting}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {showScheduler && (
                <div className="fixed inset-0 bg-backgroundackgroundlack/50 flex items-center justify-center z-50">
                    <div className="bg-backgroundackgroundackground p-6 rounded-lg max-h-[90vh] overflow-y-auto">
                        <MeetingScheduler
                            onSubmit={handleScheduleMeeting}
                            onCancel={() => setShowScheduler(false)}
                        />
                    </div>
                </div>
            )}

            {showMeetingModal && selectedMeeting && (
                <MeetingModal
                    meeting={selectedMeeting}
                    onClose={() => {
                        setShowMeetingModal(false);
                        setSelectedMeeting(null);
                    }}
                    onJoin={handleJoinMeeting}
                />
            )}
        </div>
    );
}
