// @ts-nocheck
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { VideoCamera, Calendar as CalendarIcon, Clock, Users, Repeat, X } from '@phosphor-icons/react';

export type MeetingProvider = 'zoom' | 'google_meet' | 'microsoft_teams' | 'internal';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

interface Attendee {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface MeetingSchedulerProps {
    onSubmit: (data: MeetingFormData) => void;
    onCancel?: () => void;
    initialData?: Partial<MeetingFormData>;
    isLoading?: boolean;
}

export interface MeetingFormData {
    title: string;
    description: string;
    startDate: Date;
    startTime: string;
    duration: number;
    meetingType: MeetingProvider;
    timezone: string;
    attendeeIds: string[];
    recurrence?: {
        enabled: boolean;
        frequency: RecurrenceFrequency;
        interval: number;
        endDate?: Date;
    };
}

const DURATION_OPTIONS = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
];

const RECURRENCE_INTERVALS = [1, 2, 3, 4, 5, 6, 7, 8];

const MOCK_ATTENDEES: Attendee[] = [
    { id: '1', name: 'John Doe', email: 'john@schoolos.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@schoolos.com' },
    { id: '3', name: 'Bob Wilson', email: 'bob@schoolos.com' },
    { id: '4', name: 'Alice Brown', email: 'alice@schoolos.com' },
    { id: '5', name: 'Charlie Davis', email: 'charlie@schoolos.com' },
];

export function MeetingScheduler({ onSubmit, onCancel, initialData, isLoading }: MeetingSchedulerProps) {
    const [formData, setFormData] = useState<MeetingFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        startDate: initialData?.startDate || new Date(),
        startTime: initialData?.startTime || '09:00',
        duration: initialData?.duration || 60,
        meetingType: initialData?.meetingType || 'internal',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        attendeeIds: initialData?.attendeeIds || [],
        recurrence: initialData?.recurrence || { enabled: false, frequency: 'weekly', interval: 1 }
    });

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [showRecurrence, setShowRecurrence] = useState(false);

    const handleInputChange = (field: keyof MeetingFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRecurrenceChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            recurrence: prev.recurrence ? { ...prev.recurrence, [field]: value } : { enabled: true, frequency: 'weekly', interval: 1, [field]: value }
        }));
    };

    const toggleAttendee = (attendeeId: string) => {
        setFormData(prev => ({
            ...prev,
            attendeeIds: prev.attendeeIds.includes(attendeeId)
                ? prev.attendeeIds.filter(id => id !== attendeeId)
                : [...prev.attendeeIds, attendeeId]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getProviderBadge = (type: MeetingProvider) => {
        const badges = {
            zoom: <Badge className="bg-backgroundackgroundlue-500">Zoom</Badge>,
            google_meet: <Badge className="bg-green-500">Google Meet</Badge>,
            microsoft_teams: <Badge className="bg-purple-500">MS Teams</Badge>,
            internal: <Badge className="bg-gray-500">Internal</Badge>
        };
        return badges[type];
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Schedule Meeting
                </CardTitle>
                <CardDescription>Create a new meeting or video conference</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Meeting Title *</Label>
                            <Input
                                id="title"
                                placeholder="Enter meeting title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description / Agenda</Label>
                            <Textarea
                                id="description"
                                placeholder="What is this meeting about?"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Date *</Label>
                                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.startDate ? format(formData.startDate, 'PPP') : 'Select date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formData.startDate}
                                            onSelect={(date) => {
                                                if (date) {
                                                    handleInputChange('startDate', date);
                                                    setDatePickerOpen(false);
                                                }
                                            }}
                                            disabled={(date) => date < new Date()}
                                            initialDate={formData.startDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="startTime">Time *</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Select
                                    value={formData.duration.toString()}
                                    onValueChange={(value) => handleInputChange('duration', parseInt(value))}
                                >
                                    <SelectTrigger id="duration">
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DURATION_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value.toString()}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Meeting Type</Label>
                                <Select
                                    value={formData.meetingType}
                                    onValueChange={(value) => handleInputChange('meetingType', value as MeetingProvider)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="internal">Internal</SelectItem>
                                        <SelectItem value="zoom">Zoom</SelectItem>
                                        <SelectItem value="google_meet">Google Meet</SelectItem>
                                        <SelectItem value="microsoft_teams">Microsoft Teams</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Attendees
                            </Label>
                            <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                                {MOCK_ATTENDEES.map(attendee => (
                                    <div key={attendee.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`attendee-${attendee.id}`}
                                            checked={formData.attendeeIds.includes(attendee.id)}
                                            onCheckedChange={() => toggleAttendee(attendee.id)}
                                        />
                                        <Label htmlFor={`attendee-${attendee.id}`} className="cursor-pointer flex-1">
                                            {attendee.name}
                                        </Label>
                                        <span className="text-xs text-muted-foreground">{attendee.email}</span>
                                    </div>
                                ))}
                            </div>
                            {formData.attendeeIds.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {formData.attendeeIds.map(id => {
                                        const attendee = MOCK_ATTENDEES.find(a => a.id === id);
                                        return attendee ? (
                                            <Badge key={id} variant="secondary" className="gap-1">
                                                {attendee.name}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAttendee(id)} />
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label>
                                <Checkbox
                                    checked={showRecurrence}
                                    onCheckedChange={(checked) => setShowRecurrence(checked as boolean)}
                                />
                                <span className="ml-2 flex items-center gap-2">
                                    <Repeat className="h-4 w-4" />
                                    Recurring meeting
                                </span>
                            </Label>
                        </div>

                        {showRecurrence && formData.recurrence && (
                            <div className="border rounded-md p-4 space-y-4 bg-muted/30">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Frequency</Label>
                                        <Select
                                            value={formData.recurrence.frequency}
                                            onValueChange={(value) => handleRecurrenceChange('frequency', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Every</Label>
                                        <Select
                                            value={formData.recurrence.interval.toString()}
                                            onValueChange={(value) => handleRecurrenceChange('interval', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {RECURRENCE_INTERVALS.map(i => (
                                                    <SelectItem key={i} value={i.toString()}>
                                                        {i} {formData.recurrence?.frequency === 'daily' ? 'day(s)' : formData.recurrence?.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading}>
                            <VideoCamera className="mr-2 h-4 w-4" />
                            {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export { MOCK_ATTENDEES };
