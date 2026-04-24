import nodemailer, { Transporter } from 'nodemailer';
import { EmailQueueService } from './notification.service';

const getTransporter = (): Transporter => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || 'test@ethereal.email',
            pass: process.env.SMTP_PASS || 'testpass'
        }
    });
};

const FROM_NAME = process.env.EMAIL_FROM_NAME || 'SchoolOS';
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@schoolos.com';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

interface EmailTemplateData {
    name?: string;
    [key: string]: any;
}

const templates: Record<string, (data: EmailTemplateData) => { subject: string; html: string; text: string }> = {
    welcome: (data) => ({
        subject: `Welcome to ${FROM_NAME}!`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to ${FROM_NAME}</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to ${FROM_NAME}!</h1>
                </div>
                <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px;">
                    <p>Hello ${data.name || 'User'},</p>
                    <p>We're thrilled to have you join us! ${FROM_NAME} is your complete school management solution.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${APP_URL}/dashboard" style="background-color: #BAFF00; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Get Started</a>
                    </div>
                    <p>Here's what you can do:</p>
                    <ul>
                        <li>Manage tasks and projects</li>
                        <li>Communicate with your team</li>
                        <li>Track progress and analytics</li>
                        <li>Access your learning resources</li>
                    </ul>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p style="margin-top: 30px; color: #666; font-size: 14px;">Best regards,<br>The ${FROM_NAME} Team</p>
                </div>
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `Welcome to ${FROM_NAME}! We're thrilled to have you join us. Get started by visiting ${APP_URL}/dashboard`
    }),

    passwordReset: (data) => ({
        subject: 'Password Reset Request',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Reset Your Password</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f9f9f9; padding: 40px; border-radius: 10px;">
                    <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
                    <p>Hello ${data.name || 'User'},</p>
                    <p>You requested to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${data.resetUrl}" style="background-color: #BAFF00; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email. Your account is safe.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:<br>${data.resetUrl}</p>
                </div>
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `Reset your password by visiting: ${data.resetUrl}. This link expires in 1 hour.`
    }),

    taskAssigned: (data) => ({
        subject: `New Task Assigned: ${data.taskTitle}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>New Task Assigned</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f9f9f9; padding: 40px; border-radius: 10px;">
                    <h2 style="color: #333; margin-top: 0;">New Task Assigned</h2>
                    <p>Hello ${data.name || 'User'},</p>
                    <p>You have been assigned a new task:</p>
                    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #BAFF00; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #333;">${data.taskTitle}</h3>
                        <p style="color: #666;"><strong>Description:</strong> ${data.taskDescription || 'No description provided'}</p>
                        <p style="color: #666;"><strong>Priority:</strong> <span style="text-transform: uppercase;">${data.priority || 'Medium'}</span></p>
                        ${data.dueDate ? `<p style="color: #666;"><strong>Due Date:</strong> ${data.dueDate}</p>` : ''}
                        ${data.projectName ? `<p style="color: #666;"><strong>Project:</strong> ${data.projectName}</p>` : ''}
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${APP_URL}/tasks/${data.taskId}" style="background-color: #BAFF00; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Task</a>
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `You've been assigned a new task: ${data.taskTitle}. View it at ${APP_URL}/tasks/${data.taskId}`
    }),

    projectUpdate: (data) => ({
        subject: `Project Update: ${data.projectName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Project Update</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f9f9f9; padding: 40px; border-radius: 10px;">
                    <h2 style="color: #333; margin-top: 0;">Project Update</h2>
                    <p>Hello ${data.name || 'User'},</p>
                    <p>There's an update on a project you're involved in:</p>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #333;">${data.projectName}</h3>
                        <p style="color: #666;"><strong>Status:</strong> <span style="text-transform: uppercase;">${data.status}</span></p>
                        <p style="color: #666;"><strong>Update:</strong> ${data.updateMessage}</p>
                        ${data.progress ? `<p style="color: #666;"><strong>Progress:</strong> ${data.progress}%</p>` : ''}
                    </div>
                    ${data.taskChanges?.length ? `
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="margin-top: 0;">Recent Task Changes:</h4>
                        <ul>
                            ${data.taskChanges.map((t: string) => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${APP_URL}/projects/${data.projectId}" style="background-color: #BAFF00; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Project</a>
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `Project "${data.projectName}" has been updated: ${data.updateMessage}. View at ${APP_URL}/projects/${data.projectId}`
    }),

    notificationDigest: (data) => ({
        subject: `Your ${FROM_NAME} Notification Digest`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Notification Digest</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Your Notification Digest</h1>
                </div>
                <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px;">
                    <p>Hello ${data.name || 'User'},</p>
                    <p>Here's a summary of your recent notifications:</p>
                    <div style="margin: 20px 0;">
                        ${data.notifications.map((n: any) => `
                        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${n.type === 'success' ? '#10b981' : n.type === 'warning' ? '#f59e0b' : n.type === 'error' ? '#ef4444' : '#3b82f6'};">
                            <p style="margin: 0; font-weight: bold;">${n.title}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${n.message}</p>
                        </div>
                        `).join('')}
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${APP_URL}/notifications" style="background-color: #BAFF00; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View All Notifications</a>
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>You can update your notification preferences in your profile settings.</p>
                    <p>© ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `You have ${data.notifications.length} new notifications. View them at ${APP_URL}/notifications`
    }),

    twoFactorCode: (data) => ({
        subject: 'Your Verification Code',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Verification Code</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f9f9f9; padding: 40px; border-radius: 10px; text-align: center;">
                    <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
                    <p>Hello ${data.name || 'User'},</p>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 12px; border-radius: 8px; margin: 20px 0; color: #333;">
                        ${data.code}
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">If you didn't request this, please secure your account immediately by changing your password.</p>
                </div>
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `Your verification code is: ${data.code}. This code will expire in 10 minutes.`
    }),

    ticketUpdate: (data) => ({
        subject: `Ticket Update: ${data.ticketId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Ticket Update</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f9f9f9; padding: 40px; border-radius: 10px;">
                    <h2 style="color: #333; margin-top: 0;">Ticket Update</h2>
                    <p>Hello ${data.name || 'User'},</p>
                    <p>Your support ticket has been updated:</p>
                    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #BAFF00; margin: 20px 0;">
                        <p style="color: #666;"><strong>Ticket ID:</strong> ${data.ticketId}</p>
                        <p style="color: #666;"><strong>Subject:</strong> ${data.subject}</p>
                        <p style="color: #666;"><strong>Status:</strong> <span style="text-transform: uppercase;">${data.status}</span></p>
                        <p style="color: #666;"><strong>Update:</strong> ${data.updateMessage}</p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${APP_URL}/support/tickets/${data.ticketId}" style="background-color: #BAFF00; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Ticket</a>
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `Your ticket ${data.ticketId} has been updated: ${data.updateMessage}. View at ${APP_URL}/support/tickets/${data.ticketId}`
    }),
};

export const sendTemplateEmail = async (
    to: string,
    templateName: string,
    data: EmailTemplateData
): Promise<boolean> => {
    const template = templates[templateName];
    if (!template) {
        console.error(`[Email Service] Template "${templateName}" not found`);
        return false;
    }

    const { subject, html, text } = template(data);
    return await sendEmail(to, subject, text, html);
};

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
): Promise<boolean> => {
    try {
        if (!process.env.SMTP_HOST) {
            console.log(`[Email Service Mock] Sending email to ${to}`);
            console.log(`[Email Service Mock] Subject: ${subject}`);
            return true;
        }

        const transporter = getTransporter();
        const info = await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to,
            subject,
            text,
            html: html || `<p>${text}</p>`,
        });

        console.log(`[Email Service] Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[Email Service] Error sending email:', error);
        return false;
    }
};

export const queueEmailNotification = async (
    userId: string,
    to: string,
    templateName: string,
    data: any
): Promise<void> => {
    const template = templates[templateName];
    if (!template) {
        console.error(`[Email Service] Template "${templateName}" not found`);
        return;
    }

    const { subject, html, text } = template(data);
    await EmailQueueService.queueEmail(userId, {
        to,
        subject,
        template: templateName,
        data: { ...data, html, text },
    });
};

export const processEmailQueue = async (): Promise<void> => {
    const pendingEmails = await EmailQueueService.getPendingEmails(50);

    for (const email of pendingEmails) {
        try {
            const success = await sendEmail(
                email.to,
                email.subject,
                email.data.text || '',
                email.data.html
            );

            if (success) {
                await EmailQueueService.markEmailSent(email.id);
            } else {
                await EmailQueueService.markEmailFailed(email.id, 'Failed to send', email.attempts);
            }
        } catch (error: any) {
            await EmailQueueService.markEmailFailed(email.id, error.message, email.attempts);
        }
    }
};

export const sendTicketEmail = async (userEmail: string, issue: string, severity: string) => {
    return sendEmail(
        `support@ekya.edu, ${userEmail}`,
        `[${severity} SEVERITY] New IT Support Ticket`,
        `A new ticket has been raised by ${userEmail}.\n\nIssue Details:\n${issue}\n\nSeverity: ${severity}\n\nPlease take action immediately.`,
        `<b>A new ticket has been raised by ${userEmail}</b><br><br><p><b>Issue Details:</b><br>${issue}</p><p><b>Severity:</b> ${severity}</p><p>Please take action immediately.</p>`
    );
};

export const sendPasswordResetEmail = async (email: string, resetToken: string, name: string) => {
    const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;
    return sendTemplateEmail(email, 'passwordReset', { name, resetUrl });
};

export const sendTwoFactorCodeEmail = async (email: string, code: string, name: string) => {
    return sendTemplateEmail(email, 'twoFactorCode', { name, code });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    return sendTemplateEmail(email, 'welcome', { name });
};

export const sendTaskAssignedEmail = async (
    email: string,
    name: string,
    taskData: {
        taskId: string;
        taskTitle: string;
        taskDescription?: string;
        priority?: string;
        dueDate?: string;
        projectName?: string;
    }
) => {
    return sendTemplateEmail(email, 'taskAssigned', { name, ...taskData });
};

export const sendProjectUpdateEmail = async (
    email: string,
    name: string,
    projectData: {
        projectId: string;
        projectName: string;
        status: string;
        updateMessage: string;
        progress?: number;
        taskChanges?: string[];
    }
) => {
    return sendTemplateEmail(email, 'projectUpdate', { name, ...projectData });
};

export const sendNotificationDigest = async (
    email: string,
    name: string,
    notifications: Array<{ title: string; message: string; type: string }>
) => {
    return sendTemplateEmail(email, 'notificationDigest', { name, notifications });
};

export const sendTicketUpdateEmail = async (
    email: string,
    name: string,
    ticketData: {
        ticketId: string;
        subject: string;
        status: string;
        updateMessage: string;
    }
) => {
    return sendTemplateEmail(email, 'ticketUpdate', { name, ...ticketData });
};

export { templates };
