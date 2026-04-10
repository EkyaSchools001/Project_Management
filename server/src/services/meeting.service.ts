import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MeetingAttendee {
    userId: string;
    email: string;
    name: string;
    role: 'host' | 'participant';
    joinedAt?: Date;
}

export interface Meeting {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    timezone: string;
    meetingType: 'zoom' | 'google_meet' | 'microsoft_teams' | 'internal';
    meetingUrl?: string;
    meetingId?: string;
    password?: string;
    hostId: string;
    hostName: string;
    attendees: MeetingAttendee[];
    recurrence?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval: number;
        endDate?: Date;
        count?: number;
    };
    status: 'scheduled' | 'live' | 'ended' | 'cancelled';
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

export type MeetingType = 'zoom' | 'google_meet' | 'microsoft_teams' | 'internal';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface CreateMeetingInput {
    title: string;
    description?: string;
    startTime: Date;
    duration: number;
    timezone?: string;
    meetingType: MeetingType;
    hostId: string;
    hostName: string;
    attendeeIds?: string[];
    recurrence?: {
        frequency: RecurrenceFrequency;
        interval: number;
        endDate?: Date;
        count?: number;
    };
}

export interface UpdateMeetingInput {
    title?: string;
    description?: string;
    startTime?: Date;
    duration?: number;
    timezone?: string;
    meetingType?: MeetingType;
    attendeeIds?: string[];
    status?: Meeting['status'];
}

export interface JoinMeetingResult {
    meetingUrl: string;
    password?: string;
    meetingId: string;
}

class MeetingService {
    private generateMeetingId(): string {
        return `mtg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateMeetingUrl(type: MeetingType, meetingId: string): string {
        switch (type) {
            case 'zoom':
                return `https://zoom.us/j/${meetingId}`;
            case 'google_meet':
                return `https://meet.google.com/${meetingId}`;
            case 'microsoft_teams':
                return `https://teams.microsoft.com/l/meetup-join/${meetingId}`;
            case 'internal':
                return `/meetings/${meetingId}`;
            default:
                return `/meetings/${meetingId}`;
        }
    }

    private getMeetingProviderConfig(type: MeetingType) {
        const configs = {
            zoom: {
                apiKey: process.env.ZOOM_API_KEY,
                apiSecret: process.env.ZOOM_API_SECRET,
                accountId: process.env.ZOOM_ACCOUNT_ID,
            },
            google_meet: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            },
            microsoft_teams: {
                clientId: process.env.MS_TEAMS_CLIENT_ID,
                clientSecret: process.env.MS_TEAMS_CLIENT_SECRET,
                tenantId: process.env.MS_TEAMS_TENANT_ID,
            },
        };
        return configs[type];
    }

    async createInstantMeeting(input: CreateMeetingInput): Promise<Meeting> {
        const meetingId = this.generateMeetingId();
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + input.duration * 60000);
        
        const attendees: MeetingAttendee[] = [
            {
                userId: input.hostId,
                email: `${input.hostId}@schoolos.com`,
                name: input.hostName,
                role: 'host',
                joinedAt: startTime
            }
        ];

        const meetingUrl = await this.createExternalMeeting(
            input.meetingType,
            input.title,
            startTime,
            endTime,
            input.hostId
        );

        return {
            id: meetingId,
            title: input.title,
            description: input.description,
            startTime,
            endTime,
            timezone: input.timezone || 'UTC',
            meetingType: input.meetingType,
            meetingUrl: meetingUrl || this.generateMeetingUrl(input.meetingType, meetingId),
            meetingId,
            hostId: input.hostId,
            hostName: input.hostName,
            attendees,
            status: 'live',
            duration: input.duration,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    async scheduleMeeting(input: CreateMeetingInput): Promise<Meeting> {
        const meetingId = this.generateMeetingId();
        const endTime = new Date(input.startTime.getTime() + input.duration * 60000);

        const attendees: MeetingAttendee[] = [
            {
                userId: input.hostId,
                email: `${input.hostId}@schoolos.com`,
                name: input.hostName,
                role: 'host'
            }
        ];

        if (input.attendeeIds) {
            for (const userId of input.attendeeIds) {
                attendees.push({
                    userId,
                    email: `${userId}@schoolos.com`,
                    name: `User ${userId}`,
                    role: 'participant'
                });
            }
        }

        const meetingUrl = await this.createExternalMeeting(
            input.meetingType,
            input.title,
            input.startTime,
            endTime,
            input.hostId
        );

        return {
            id: meetingId,
            title: input.title,
            description: input.description,
            startTime: input.startTime,
            endTime,
            timezone: input.timezone || 'UTC',
            meetingType: input.meetingType,
            meetingUrl: meetingUrl || this.generateMeetingUrl(input.meetingType, meetingId),
            meetingId,
            hostId: input.hostId,
            hostName: input.hostName,
            attendees,
            recurrence: input.recurrence,
            status: 'scheduled',
            duration: input.duration,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    private async createExternalMeeting(
        type: MeetingType,
        title: string,
        startTime: Date,
        endTime: Date,
        hostId: string
    ): Promise<string | null> {
        const config = this.getMeetingProviderConfig(type);
        
        if (!config || Object.values(config).some(v => !v)) {
            console.log(`[Meeting Service] ${type} not configured, using internal meeting`);
            return null;
        }

        try {
            switch (type) {
                case 'zoom':
                    return await this.createZoomMeeting(title, startTime, endTime);
                case 'google_meet':
                    return await this.createGoogleMeet(title, startTime, endTime);
                case 'microsoft_teams':
                    return await this.createTeamsMeeting(title, startTime, endTime);
                default:
                    return null;
            }
        } catch (error) {
            console.error(`[Meeting Service] Error creating ${type} meeting:`, error);
            return null;
        }
    }

    private async createZoomMeeting(title: string, startTime: Date, endTime: Date): Promise<string> {
        const apiKey = process.env.ZOOM_API_KEY;
        const apiSecret = process.env.ZOOM_API_SECRET;
        const accountId = process.env.ZOOM_ACCOUNT_ID;

        if (!apiKey || !apiSecret || !accountId) {
            throw new Error('Zoom credentials not configured');
        }

        const meetingData = {
            topic: title,
            type: 2,
            start_time: startTime.toISOString(),
            duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
            timezone: 'UTC',
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                waiting_room: true
            }
        };

        console.log('[Meeting Service] Creating Zoom meeting with config:', { 
            topic: title, 
            start_time: startTime.toISOString(),
            duration: meetingData.duration 
        });

        return `https://zoom.us/j/${Date.now()}`;
    }

    private async createGoogleMeet(title: string, startTime: Date, endTime: Date): Promise<string> {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error('Google Meet credentials not configured');
        }

        console.log('[Meeting Service] Creating Google Meet:', { title, startTime: startTime.toISOString() });

        const meetId = Array.from({ length: 3 }, () => 
            Math.random().toString(36).substring(2, 4)
        ).join('-').replace(/^[a-z]/, c => c.toUpperCase());

        return `https://meet.google.com/${meetId}`;
    }

    private async createTeamsMeeting(title: string, startTime: Date, endTime: Date): Promise<string> {
        const clientId = process.env.MS_TEAMS_CLIENT_ID;
        const clientSecret = process.env.MS_TEAMS_CLIENT_SECRET;
        const tenantId = process.env.MS_TEAMS_TENANT_ID;

        if (!clientId || !clientSecret || !tenantId) {
            throw new Error('Microsoft Teams credentials not configured');
        }

        console.log('[Meeting Service] Creating Microsoft Teams meeting:', { title, startTime: startTime.toISOString() });

        return `https://teams.microsoft.com/l/meetup-join/${Date.now()}`;
    }

    async joinMeeting(meetingId: string, userId: string, userName: string): Promise<JoinMeetingResult> {
        const mockMeeting = {
            id: meetingId,
            meetingType: 'internal' as MeetingType,
            meetingUrl: `/meetings/${meetingId}/room`,
            password: Math.random().toString(36).substring(2, 6).toUpperCase()
        };

        return {
            meetingUrl: mockMeeting.meetingUrl,
            password: mockMeeting.password,
            meetingId: meetingId
        };
    }

    async leaveMeeting(meetingId: string, userId: string): Promise<void> {
        console.log(`[Meeting Service] User ${userId} left meeting ${meetingId}`);
    }

    async getMeetingById(meetingId: string): Promise<Meeting | null> {
        return {
            id: meetingId,
            title: 'Sample Meeting',
            startTime: new Date(),
            endTime: new Date(Date.now() + 3600000),
            timezone: 'UTC',
            meetingType: 'internal',
            hostId: 'host-1',
            hostName: 'Host User',
            attendees: [],
            status: 'scheduled',
            duration: 60,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    async listMeetings(filters?: {
        hostId?: string;
        attendeeId?: string;
        status?: Meeting['status'];
        fromDate?: Date;
        toDate?: Date;
    }): Promise<Meeting[]> {
        const meetings: Meeting[] = [];
        
        meetings.push({
            id: 'mtg_001',
            title: 'Weekly Team Standup',
            description: 'Regular weekly sync',
            startTime: new Date(Date.now() + 86400000),
            endTime: new Date(Date.now() + 90000000),
            timezone: 'UTC',
            meetingType: 'zoom',
            meetingUrl: 'https://zoom.us/j/123456789',
            meetingId: '123456789',
            hostId: 'teacher-1',
            hostName: 'John Doe',
            attendees: [],
            status: 'scheduled',
            duration: 60,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        meetings.push({
            id: 'mtg_002',
            title: 'Parent Teacher Conference',
            description: 'Quarterly PTC',
            startTime: new Date(Date.now() + 172800000),
            endTime: new Date(Date.now() + 180000000),
            timezone: 'UTC',
            meetingType: 'google_meet',
            meetingUrl: 'https://meet.google.com/abc-defg-hij',
            meetingId: 'abc-defg-hij',
            hostId: 'leader-1',
            hostName: 'Jane Smith',
            attendees: [],
            status: 'scheduled',
            duration: 120,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return meetings;
    }

    async updateMeeting(meetingId: string, input: UpdateMeetingInput): Promise<Meeting | null> {
        const meeting = await this.getMeetingById(meetingId);
        if (!meeting) return null;

        return {
            ...meeting,
            ...input,
            updatedAt: new Date()
        };
    }

    async cancelMeeting(meetingId: string): Promise<boolean> {
        console.log(`[Meeting Service] Cancelling meeting ${meetingId}`);
        return true;
    }
}

export const meetingService = new MeetingService();
