import { Request, Response } from 'express';
import { meetingService, CreateMeetingInput, UpdateMeetingInput, MeetingType } from '../services/meeting.service';

export const createInstantMeeting = async (req: Request, res: Response) => {
    try {
        const { title, description, duration, meetingType, hostId, hostName, attendeeIds } = req.body;

        if (!title || !duration || !hostId || !hostName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const input: CreateMeetingInput = {
            title,
            description,
            duration,
            startTime: new Date(),
            meetingType: (meetingType as MeetingType) || 'internal',
            hostId,
            hostName,
            attendeeIds
        };

        const meeting = await meetingService.createInstantMeeting(input);
        res.status(201).json({ data: meeting });
    } catch (error) {
        console.error('[Meeting Controller] Error creating instant meeting:', error);
        res.status(500).json({ error: 'Failed to create meeting' });
    }
};

export const scheduleMeeting = async (req: Request, res: Response) => {
    try {
        const { 
            title, 
            description, 
            startTime, 
            duration, 
            meetingType, 
            hostId, 
            hostName, 
            attendeeIds,
            recurrence,
            timezone 
        } = req.body;

        if (!title || !startTime || !duration || !hostId || !hostName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const input: CreateMeetingInput = {
            title,
            description,
            startTime: new Date(startTime),
            duration,
            timezone,
            meetingType: (meetingType as MeetingType) || 'internal',
            hostId,
            hostName,
            attendeeIds,
            recurrence
        };

        const meeting = await meetingService.scheduleMeeting(input);
        res.status(201).json({ data: meeting });
    } catch (error) {
        console.error('[Meeting Controller] Error scheduling meeting:', error);
        res.status(500).json({ error: 'Failed to schedule meeting' });
    }
};

export const listMeetings = async (req: Request, res: Response) => {
    try {
        const { hostId, attendeeId, status, fromDate, toDate } = req.query;

        const filters = {
            hostId: hostId as string,
            attendeeId: attendeeId as string,
            status: status as any,
            fromDate: fromDate ? new Date(fromDate as string) : undefined,
            toDate: toDate ? new Date(toDate as string) : undefined
        };

        const meetings = await meetingService.listMeetings(filters);
        res.json({ data: meetings });
    } catch (error) {
        console.error('[Meeting Controller] Error listing meetings:', error);
        res.status(500).json({ error: 'Failed to list meetings' });
    }
};

export const getMeetingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const meeting = await meetingService.getMeetingById(id);

        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.json({ data: meeting });
    } catch (error) {
        console.error('[Meeting Controller] Error getting meeting:', error);
        res.status(500).json({ error: 'Failed to get meeting' });
    }
};

export const updateMeeting = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const input: UpdateMeetingInput = req.body;

        const meeting = await meetingService.updateMeeting(id, input);

        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.json({ data: meeting });
    } catch (error) {
        console.error('[Meeting Controller] Error updating meeting:', error);
        res.status(500).json({ error: 'Failed to update meeting' });
    }
};

export const cancelMeeting = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const success = await meetingService.cancelMeeting(id);

        if (!success) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.json({ message: 'Meeting cancelled successfully' });
    } catch (error) {
        console.error('[Meeting Controller] Error cancelling meeting:', error);
        res.status(500).json({ error: 'Failed to cancel meeting' });
    }
};

export const joinMeeting = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const { userId, userName } = req.body;

        if (!userId || !userName) {
            return res.status(400).json({ error: 'Missing user information' });
        }

        const result = await meetingService.joinMeeting(id, userId, userName);
        res.json({ data: result });
    } catch (error) {
        console.error('[Meeting Controller] Error joining meeting:', error);
        res.status(500).json({ error: 'Failed to join meeting' });
    }
};

export const leaveMeeting = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing user ID' });
        }

        await meetingService.leaveMeeting(id, userId);
        res.json({ message: 'Left meeting successfully' });
    } catch (error) {
        console.error('[Meeting Controller] Error leaving meeting:', error);
        res.status(500).json({ error: 'Failed to leave meeting' });
    }
};
