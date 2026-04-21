import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
    Calendar, 
    Clock, 
    VideoCamera, 
    User, 
    Users, 
    Link, 
    Copy,
    Check
} from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

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

interface MeetingModalProps {
    meeting: Meeting;
    onClose: () => void;
    onJoin: (meetingId: string) => void;
    onEdit?: (meetingId: string) => void;
}

const getStatusBadge = (status: MeetingStatus) => {
    const badges = {
        scheduled: <Badge variant="outline" className="bg-backgroundlue-50 text-blue-700 border-blue-200">Upcoming</Badge>,
        live: <Badge className="bg-red-500 animate-pulse">Live Now</Badge>,
        ended: <Badge variant="secondary">Ended</Badge>,
        cancelled: <Badge variant="destructive">Cancelled</Badge>
    };
    return badges[status];
};

const getProviderName = (type: MeetingProvider) => {
    const names = {
        zoom: 'Zoom',
        google_meet: 'Google Meet',
        microsoft_teams: 'Microsoft Teams',
        internal: 'Internal'
    };
    return names[type];
};

export function MeetingModal({ meeting, onClose, onJoin, onEdit }: MeetingModalProps) {
    const [copied, setCopied] = useState(false);
    
    const startDate = new Date(meeting.startTime);
    const isLive = meeting.status === 'live';
    const canJoin = meeting.status === 'live' || meeting.status === 'scheduled';
    const canEdit = meeting.status === 'scheduled';

    const copyMeetingLink = () => {
        if (meeting.meetingUrl) {
            navigator.clipboard.writeText(meeting.meetingUrl);
            setCopied(true);
            toast.success('Meeting link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl">{meeting.title}</DialogTitle>
                        {getStatusBadge(meeting.status)}
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {meeting.description && (
                        <p className="text-sm text-muted-foreground">{meeting.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{format(startDate, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{format(startDate, 'h:mm a')} ({meeting.duration} min)</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Host: {meeting.hostName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <VideoCamera className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Platform: {getProviderName(meeting.meetingType)}</span>
                        </div>
                    </div>

                    {meeting.meetingUrl && (
                        <div className="space-y-2">
                            <Separator />
                            <div className="flex items-center gap-2">
                                <Link className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Meeting Link:</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={meeting.meetingUrl}
                                    readOnly
                                    className="flex-1 text-sm bg-muted px-3 py-2 rounded-md border"
                                />
                                <Button variant="outline" size="icon" onClick={copyMeetingLink}>
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    )}

                    {meeting.attendees && meeting.attendees.length > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Attendees ({meeting.attendees.length})</span>
                                </div>
                                <ScrollArea className="h-32">
                                    <div className="space-y-2">
                                        {meeting.attendees.map((attendee, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">
                                                        {attendee.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{attendee.name}</span>
                                                {attendee.role === 'host' && (
                                                    <Badge variant="outline" className="text-xs">Host</Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </>
                    )}

                    <Separator />

                    <div className="flex gap-2">
                        {canJoin && (
                            <Button onClick={() => onJoin(meeting.id)} className="flex-1">
                                <VideoCamera className="mr-2 h-4 w-4" />
                                {isLive ? 'Join Now' : 'Join Meeting'}
                            </Button>
                        )}
                        {canEdit && onEdit && (
                            <Button variant="outline" onClick={() => onEdit(meeting.id)}>
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
