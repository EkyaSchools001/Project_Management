import { Request, Response } from 'express';
import { sendTicketEmail } from '../services/email.service';

// In-Memory Database for Tickets
let ticketsDb: any[] = [
    { id: 'TKT-1092', issue: 'Server cluster timeout on DB query', status: 'IN_PROGRESS', severity: 'HIGH', createdAt: new Date(Date.now() - 3600000), department: 'IT', assignedTo: 'u-sa-1' }
];

export const getTickets = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ tickets: ticketsDb });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while fetching tickets.' });
    }
};

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.i as string;
        const updates = req.body;
        
        const ticketIndex = ticketsDb.findIndex(t => t.id === id);
        if (ticketIndex === -1) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        ticketsDb[ticketIndex] = { ...ticketsDb[ticketIndex], ...updates };
        res.status(200).json({ ticket: ticketsDb[ticketIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while updating ticket.' });
    }
};

export const handleTicketChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, userEmail = 'user@example.com', department = '', userUrgency = 'LOW', resolutionDays = '' } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const lowerText = message.toLowerCase();
        
        // Simple heuristic-based severity scoring mapping basic AI analysis
        const highRiskKeywords = ['crash', 'database', 'server', 'down', 'firewall', 'money', 'payment', 'breach', 'security', 'critical'];
        const moderateRiskKeywords = ['bug', 'error', 'slow', 'timeout', 'sync', 'missing', 'broken'];
        
        const isHigh = highRiskKeywords.some((kw: string) => lowerText.includes(kw));
        const isModerate = moderateRiskKeywords.some((kw: string) => lowerText.includes(kw));
        
        // AI merges user urgency with its own algorithmic severity
        let aiSeverity = 'LOW';
        if (isHigh || userUrgency === 'HIGH') aiSeverity = 'HIGH';
        else if (isModerate || userUrgency === 'MODERATE') aiSeverity = 'MODERATE';

        // Override logic if strict SLA needed
        if (Number(resolutionDays) <= 1 && resolutionDays !== '') {
            aiSeverity = 'HIGH'; // force high severity if SLA is aggressive
        }

        // Evaluate solution based on severity
        if (aiSeverity === 'LOW') {
            let answer = "I've analyzed your issue. Based on similar reports, you might just need to completely restart the application to reset its local state. Give that a try, and if the issue persists, let me know and I'll escalate it!";
            
            if (lowerText.includes('password') || lowerText.includes('login')) {
                answer = "It sounds like you're having trouble logging in. \nExpected Solution:\n1. Go to the login screen and click 'Forgot Password'.\n2. Enter your registered email.\n3. Click the reset link sent to your inbox. Let me know if that doesn't work!";
            } else if (lowerText.includes('cache') || lowerText.includes('load')) {
                answer = "It seems your browser might be holding onto old files.\nExpected Solution:\n1. Press Ctrl + F5 (Windows) or Cmd + Shift + R (Mac).\n2. If that fails, clear your browser cookies for this site via settings.";
            }

            res.status(200).json({
                response: answer,
                severity: 'LOW',
                ticketCreated: false
            });
            return;
        } else {
            // For Moderate and High, we generate a ticket and send an email
            const ticketId = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
            
            const newTicket = {
                id: ticketId,
                issue: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                status: 'OPEN',
                severity: aiSeverity,
                createdAt: new Date(),
                department: department,
                assignedTo: '',
                resolutionDays: resolutionDays
            };
            
            ticketsDb.unshift(newTicket); // Add to our in-memory DB

            // Send email to the support and user
            await sendTicketEmail(userEmail, message, aiSeverity);

            res.status(200).json({
                response: `I've analyzed your request and detected a **${aiSeverity}** severity issue based on your parameters. I cannot safely resolve this automatically.\n\n✅ Escalation Complete: I have automatically created ticket **${ticketId}** and dispatched a high-priority email alert to the technical team with your diagnostic trace. You can track this in your portal.`,
                severity: aiSeverity,
                ticketCreated: true,
                ticket: newTicket
            });
            return;
        }

    } catch (error) {
        console.error("Error processing ticket chat:", error);
        res.status(500).json({ error: 'Internal server error while processing ticket chat.' });
    }
};
