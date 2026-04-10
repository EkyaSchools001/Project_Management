import { Request, Response } from 'express';
import { prisma } from '../app';

export const addReaction = async (req: Request, res: Response) => {
    try {
        const { id: roomId, msgId, emoji } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const reaction = await prisma.messageReaction.create({
            data: {
                messageId: msgId,
                userId: userId,
                emoji: decodeURIComponent(emoji)
            }
        });

        const user = await prisma.profile.findUnique({ where: { id: userId } });

        res.status(201).json({
            status: 'success',
            data: { ...reaction, user }
        });
    } catch (error) {
        console.error('Error adding reaction:', error);
        res.status(500).json({ status: 'error', message: 'Failed to add reaction' });
    }
};

export const removeReaction = async (req: Request, res: Response) => {
    try {
        const { msgId, emoji } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        await prisma.messageReaction.deleteMany({
            where: {
                messageId: msgId,
                userId: userId,
                emoji: decodeURIComponent(emoji)
            }
        });

        res.status(200).json({ status: 'success', message: 'Reaction removed' });
    } catch (error) {
        console.error('Error removing reaction:', error);
        res.status(500).json({ status: 'error', message: 'Failed to remove reaction' });
    }
};

export const createThread = async (req: Request, res: Response) => {
    try {
        const { msgId } = req.params;
        const { content, attachments } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const message = await prisma.message.findUnique({ where: { id: msgId } });
        if (!message) {
            return res.status(404).json({ status: 'error', message: 'Parent message not found' });
        }

        const threadMessage = await prisma.message.create({
            data: {
                content,
                senderId: userId,
                roomId: message.roomId,
                parentId: msgId,
                attachments: attachments ? JSON.stringify(attachments) : null
            },
            include: {
                sender: true
            }
        });

        await prisma.message.update({
            where: { id: msgId },
            data: { threadCount: { increment: 1 } }
        });

        res.status(201).json({ status: 'success', data: threadMessage });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create thread' });
    }
};

export const getThread = async (req: Request, res: Response) => {
    try {
        const { msgId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const messages = await prisma.message.findMany({
            where: { parentId: msgId },
            include: {
                sender: true,
                reactions: true
            },
            orderBy: { createdAt: 'asc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });

        const total = await prisma.message.count({ where: { parentId: msgId } });

        res.status(200).json({
            status: 'success',
            data: messages,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error('Error fetching thread:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch thread' });
    }
};

export const uploadMessageFile = async (req: Request, res: Response) => {
    try {
        const { msgId } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }

        const message = await prisma.message.findUnique({ where: { id: msgId } });
        if (!message) {
            return res.status(404).json({ status: 'error', message: 'Message not found' });
        }

        const existingAttachments = message.attachments ? JSON.parse(message.attachments as string) : [];
        const newAttachment = {
            id: `att-${Date.now()}`,
            filename: file.originalname,
            url: `/uploads/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size
        };

        await prisma.message.update({
            where: { id: msgId },
            data: {
                attachments: JSON.stringify([...existingAttachments, newAttachment])
            }
        });

        res.status(200).json({ status: 'success', data: newAttachment });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ status: 'error', message: 'Failed to upload file' });
    }
};

export const searchMessages = async (req: Request, res: Response) => {
    try {
        const { id: roomId } = req.params;
        const { q, page = 1, limit = 50 } = req.query;

        if (!q) {
            return res.status(400).json({ status: 'error', message: 'Search query required' });
        }

        const messages = await prisma.message.findMany({
            where: {
                roomId,
                content: { contains: q as string, mode: 'insensitive' },
                parentId: null
            },
            include: {
                sender: true,
                reactions: true
            },
            orderBy: { createdAt: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });

        const total = await prisma.message.count({
            where: {
                roomId,
                content: { contains: q as string, mode: 'insensitive' },
                parentId: null
            }
        });

        res.status(200).json({
            status: 'success',
            data: messages,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error('Error searching messages:', error);
        res.status(500).json({ status: 'error', message: 'Failed to search messages' });
    }
};

export const editMessage = async (req: Request, res: Response) => {
    try {
        const { msgId } = req.params;
        const { content } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const message = await prisma.message.findUnique({ where: { id: msgId } });
        if (!message) {
            return res.status(404).json({ status: 'error', message: 'Message not found' });
        }

        if (message.senderId !== userId) {
            return res.status(403).json({ status: 'error', message: 'Cannot edit other users messages' });
        }

        const updated = await prisma.message.update({
            where: { id: msgId },
            data: {
                content,
                edited: true,
                editedAt: new Date()
            },
            include: {
                sender: true
            }
        });

        res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ status: 'error', message: 'Failed to edit message' });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { msgId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const message = await prisma.message.findUnique({ where: { id: msgId } });
        if (!message) {
            return res.status(404).json({ status: 'error', message: 'Message not found' });
        }

        if (message.senderId !== userId) {
            return res.status(403).json({ status: 'error', message: 'Cannot delete other users messages' });
        }

        await prisma.message.update({
            where: { id: msgId },
            data: {
                deleted: true,
                deletedAt: new Date(),
                content: null
            }
        });

        res.status(200).json({ status: 'success', message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete message' });
    }
};

export const getTypingStatus = async (req: Request, res: Response) => {
    try {
        const { id: roomId } = req.params;

        const typingUsers = await prisma.typingIndicator.findMany({
            where: {
                roomId,
                expiresAt: { gt: new Date() }
            },
            include: {
                user: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: typingUsers.map(t => ({ userId: t.userId, userName: t.user.name }))
        });
    } catch (error) {
        console.error('Error getting typing status:', error);
        res.status(500).json({ status: 'error', message: 'Failed to get typing status' });
    }
};

export const sendTypingIndicator = async (req: Request, res: Response) => {
    try {
        const { id: roomId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        await prisma.typingIndicator.upsert({
            where: {
                id: `${roomId}-${userId}`
            },
            create: {
                id: `${roomId}-${userId}`,
                roomId,
                userId,
                expiresAt: new Date(Date.now() + 5000)
            },
            update: {
                expiresAt: new Date(Date.now() + 5000)
            }
        });

        res.status(200).json({ status: 'success', message: 'Typing indicator sent' });
    } catch (error) {
        console.error('Error sending typing indicator:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send typing indicator' });
    }
};
