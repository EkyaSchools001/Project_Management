
import cron from 'node-cron';
import prisma from '../database/prisma';
import { emailService } from './emailService';

/**
 * Service to handle scheduled tasks in the background.
 */
class SchedulerService {
    constructor() {
        this.initialize();
    }

    private initialize() {
        // Schedule: 1st day of every month at 09:00 AM
        cron.schedule('0 9 1 * *', async () => {
            console.log('[SCHEDULER] 🕒 Running Monthly PD Hours Snapshot Task...');
            await this.sendMonthlySnapshots();
        });

        // Run every minute to ensure we catch events immediately after midnight
        cron.schedule('* * * * *', async () => {
            await this.checkAndCloseExpiredAttendances();
        }, {
            timezone: "Asia/Kolkata"
        });

        console.log('✅ Scheduler Service Initialized with crons');
    }

    /**
     * Checks all daily events and disables attendance if they have passed.
     */
    async checkAndCloseExpiredAttendances() {
        try {
            const activeEvents = await prisma.trainingEvent.findMany({
                where: {
                    attendanceEnabled: true,
                    attendanceClosed: false
                }
            });

            if (activeEvents.length === 0) return;

            const now = new Date();
            // Compare by Start of Day
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            let updatedAny = false;

            for (const event of activeEvents) {
                if (!event.date) continue;

                let eventDate = new Date(event.date);
                if (isNaN(eventDate.getTime())) continue;

                eventDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

                // If event was yesterday or older, close it
                if (eventDate.getTime() < today.getTime()) {
                    await prisma.trainingEvent.update({
                        where: { id: event.id },
                        data: {
                            attendanceClosed: true,
                            attendanceEnabled: false
                        }
                    });
                    updatedAny = true;
                    console.log(`[SCHEDULER] Automatically closed attendance for passed event: ${event.title} (${event.date})`);
                }
            }

            if (updatedAny) {
                // We use setImmediate or dynamic require to avoid circular dependencies with socket if needed, 
                // but requiring here is safe.
                try {
                    const { getIO } = require('../../core/socket');
                    const io = getIO();
                    if (io) {
                        io.emit('attendance-updated');
                        io.emit('pd:awarded');
                    }
                } catch (e) {
                    console.error('[SCHEDULER] Could not emit socket events:', e);
                }
            }

        } catch (error) {
            console.error('[SCHEDULER] ❌ Error in attendance expiration task:', error);
        }
    }

    /**
     * Sends PD Hours snapshots to all active teachers
     */
    async sendMonthlySnapshots() {
        try {
            const teachers = await prisma.user.findMany({
                where: {
                    role: 'TEACHER',
                    status: 'Active'
                },
                include: {
                    pdHours: true
                }
            });

            console.log(`[SCHEDULER] Found ${teachers.length} teachers to notify.`);

            for (const teacher of teachers) {
                const totalHours = teacher.pdHours.reduce((acc, curr) => acc + curr.hours, 0);

                // Assuming a default target of 20 hours if not specified in metadata or settings
                const targetHours = 20;

                await emailService.sendPDHoursSnapshot(teacher, {
                    totalHours,
                    targetHours
                });
            }

            console.log('[SCHEDULER] ✅ Monthly snapshot task completed.');
        } catch (error) {
            console.error('[SCHEDULER] ❌ Error in monthly snapshot task:', error);
        }
    }
}

export const schedulerService = new SchedulerService();
