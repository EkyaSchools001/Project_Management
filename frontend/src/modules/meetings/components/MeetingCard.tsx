import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VideoCamera, Clock, Users, ArrowRight } from '@phosphor-icons/react';

export type MeetingStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';
export type MeetingProvider = 'zoom' | 'google_meet' | 'microsoft_teams' | 'internal';

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

interface MeetingCardProps {
    meeting: Meeting;
    onJoin?: (meetingId: string) => void;
    onView?: (meetingId: string) => void;
    onEdit?: (meetingId: string) => void;
}

const getStatusBadge = (status: MeetingStatus) => {
    const badges = {
        scheduled: <Badge variant="outline" className="bg-violet-50 text-blue-700 border-blue-200">Upcoming</Badge>,
        live: <Badge className="bg-red-500 animate-pulse">Live Now</Badge>,
        ended: <Badge variant="secondary">Ended</Badge>,
        cancelled: <Badge variant="destructive">Cancelled</Badge>
    };
    return badges[status];
};

const getProviderIcon = (type: MeetingProvider) => {
    const icons = {
        zoom: '📹',
        google_meet: '📹',
        microsoft_teams: '📹',
        internal: '🏠'
    };
    return icons[type];
};

export function MeetingCard({ meeting, onJoin, onView, onEdit }: MeetingCardProps) {
    const startDate = new Date(meeting.startTime);
    const isLive = meeting.status === 'live';
    const canJoin = meeting.status === 'live' || meeting.status === 'scheduled';
    const canEdit = meeting.status === 'scheduled';

    return (
        <Card className={`transition-all hover:shadow-md ${isLive ? 'border-red-300 bg-red-50/50' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg line-clamp-1">{meeting.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {meeting.description || 'No description provided'}
                        </CardDescription>
                    </div>
                    {getStatusBadge(meeting.status)}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(startDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-medium">{format(startDate, 'h:mm a')}</span>
                        <span className="text-xs">({meeting.duration} min)</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Host:</span>
                    <span className="text-sm font-medium">{meeting.hostName}</span>
                    <span className="ml-2 text-lg">{getProviderIcon(meeting.meetingType)}</span>
                </div>

                {meeting.attendees && meeting.attendees.length > 0 && (
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <div className="flex -space-x-2">
                                {meeting.attendees.slice(0, 4).map((attendee, idx) => (
                                    <Tooltip key={attendee.userId || idx}>
                                        <TooltipTrigger>
                                            <Avatar className="h-8 w-8 border-2 border-background">
                                                <AvatarFallback className="text-xs">
                                                    {attendee.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{attendee.name}</p>
                                            <p className="text-xs text-muted-foreground">{attendee.role}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                {meeting.attendees.length > 4 && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Avatar className="h-8 w-8 border-2 border-background bg-muted">
                                                <AvatarFallback className="text-xs">
                                                    +{meeting.attendees.length - 4}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{meeting.attendees.length - 4} more attendees</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </TooltipProvider>
                        <span className="text-xs text-muted-foreground">
                            {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                <div className="flex gap-2 pt-2">
                    {canJoin && onJoin && (
                        <Button onClick={() => onJoin(meeting.id)} className="flex-1">
                            <VideoCamera className="mr-2 h-4 w-4" />
                            Join
                        </Button>
                    )}
                    {onView && (
                        <Button variant="outline" onClick={() => onView(meeting.id)}>
                            View Details
                        </Button>
                    )}
                    {canEdit && onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(meeting.id)}>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
