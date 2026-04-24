
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Service to handle automated email snapshots.
 * Supports standard SMTP (for now) but structured to easily swap for Google OAuth2.
 */
class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initialize();
    }

    private initialize() {
        // Only initialize if we have the necessary environment variables
        if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            console.log('✅ Email Service Initialized');
        } else {
            console.warn('⚠️ Email Service not initialized: Missing environment variables');
        }
    }

    /**
     * Sends an automated snapshot email
     * @param to Recipient email
     * @param subject Email subject
     * @param html HTML content of the email
     * @param attachments Optional array of attachments (e.g., PDF snapshots)
     */
    async sendEmail(to: string, subject: string, html: string, attachments: any[] = []) {
        if (!this.transporter) {
            console.error('❌ Cannot send email: Transporter not initialized');
            return false;
        }

        try {
            const info = await this.transporter.sendMail({
                from: `"PDI Platform" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
                attachments
            });
            console.log(`📧 Email sent to ${to}: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return false;
        }
    }

    /**
     * Sends a monthly PD Hours snapshot to a teacher
     */
    async sendPDHoursSnapshot(user: any, pdSummary: any) {
        const subject = `[Automated] Your PD Hours Snapshot - ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`;

        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 24px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Professional Development Snapshot</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9;">${user.fullName}</p>
                </div>
                <div style="padding: 32px;">
                    <p style="font-size: 16px; color: #475569;">Hello ${user.fullName.split(' ')[0]},</p>
                    <p style="font-size: 16px; color: #475569;">Here is your monthly progress report for the current academic year.</p>
                    
                    <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0;">
                        <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">TD Hours Summary</h2>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="color: #64748b;">Total Hours Logged:</span>
                            <span style="font-weight: bold; font-size: 20px; color: #4f46e5;">${pdSummary.totalHours} hrs</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="color: #64748b;">Annual Target:</span>
                            <span style="font-weight: bold;">${pdSummary.targetHours} hrs</span>
                        </div>
                        <div style="margin-top: 16px; height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
                            <div style="width: ${Math.min(100, (pdSummary.totalHours / pdSummary.targetHours) * 100)}%; height: 100%; background: #4f46e5;"></div>
                        </div>
                        <p style="margin-top: 8px; font-size: 12px; color: #94a3b8; text-align: right;">
                            ${Math.round((pdSummary.totalHours / pdSummary.targetHours) * 100)}% of annual target reached
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${process.env.FRONTEND_URL || 'https://pdi.ekyaschools.com'}/teacher/hours" 
                           style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            View Full History
                        </a>
                    </div>
                </div>
                <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
                    This is an automated message from the PDI Platform. No reply is needed.
                </div>
            </div>
        `;

        return this.sendEmail(user.email, subject, html);
    }
}

export const emailService = new EmailService();
