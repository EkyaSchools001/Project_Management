import { Request, Response } from 'express';
import { prisma } from '../app';

// Helper to get string param safely
const param = (v: string | string[]): string => Array.isArray(v) ? v[0] : v;

export const addReaction = async (req: Request, res: Response) => {
    res.status(501).json({ status: 'error', message: 'Reactions not yet implemented' });
};

export const removeReaction = async (req: Request, res: Response) => {
    res.status(501).json({ status: 'error', message: 'Reactions not yet implemented' });
};

export const createThread = async (req: Request, res: Response) => {
    try {
        const msgId = param(req.params.msgI as string);
        const { content } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const parent = await prisma.message.findUnique({ where: { id: msgId } });
        if (!parent) return res.status(404).json({ status: 'error', message: 'Parent message not found' });

        const threadMessage = await prisma.message.create({
            data: {
                content,
                senderId: userId,
                chatRoomId: parent.chatRoomId,
            },
            include: { sender: true }
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
    res.status(501).json({ status: 'error', message: 'Thread view not yet implemented' });
};

export const uploadMessageFile = async (req: Request, res: Response) => {
    res.status(501).json({ status: 'error', message: 'Message file upload not yet implemented' });
};

export const searchMessages = async (req: Request, res: Response) => {
    try {
        const roomId = param(req.params.i as string);
        const { q, page = 1, limit = 50 } = req.query;

        if (!q) return res.status(400).json({ status: 'error', message: 'Search query required' });

        const messages = await prisma.message.findMany({
            where: {
                chatRoomId: roomId,
                content: { contains: q as string, mode: 'insensitive' },
            },
            include: { sender: true },
            orderBy: { createdAt: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });

        const total = await prisma.message.count({
            where: { chatRoomId: roomId, content: { contains: q as string, mode: 'insensitive' } }
        });

        res.status(200).json({ status: 'success', data: messages, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        console.error('Error searching messages:', error);
        res.status(500).json({ status: 'error', message: 'Failed to search messages' });
    }
};

export const editMessage = async (req: Request, res: Response) => {
    try {
        const msgId = param(req.params.msgI as string);
        const { content } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const message = await prisma.message.findUnique({ where: { id: msgId } });
        if (!message) return res.status(404).json({ status: 'error', message: 'Message not found' });
        if (message.senderId !== userId) return res.status(403).json({ status: 'error', message: 'Cannot edit other users messages' });

        const updated = await prisma.message.update({
            where: { id: msgId },
            data: { content },
            include: { sender: true }
        });

        res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ status: 'error', message: 'Failed to edit message' });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const msgId = param(req.params.msgI as string);
        const userId = (req as any).user?.id;

        if (!userId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const message = await prisma.message.findUnique({ where: { id: msgId } });
        if (!message) return res.status(404).json({ status: 'error', message: 'Message not found' });
        if (message.senderId !== userId) return res.status(403).json({ status: 'error', message: 'Cannot delete other users messages' });

        await prisma.message.delete({ where: { id: msgId } });

        res.status(200).json({ status: 'success', message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete message' });
    }
};

export const getTypingStatus = async (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: [] });
};

export const sendTypingIndicator = async (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'Typing indicator sent' });
};
