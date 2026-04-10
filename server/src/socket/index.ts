import { Server, Socket } from 'socket.io';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeSocket = (io: Server) => {
    const onlineUsers = new Map<string, string>();

    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        socket.on('user:connect', async (userId: string) => {
            onlineUsers.set(userId, socket.id);
            socket.join('online_users');
            
            io.emit('user:online', { userId, socketId: socket.id });
            
            const allOnlineUsers = Array.from(onlineUsers.keys());
            socket.emit('users:online:list', allOnlineUsers);
        });

        socket.on('join_room', async (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('leave_room', (roomId: string) => {
            socket.leave(roomId);
        });

        socket.on('send_message', async (data: any) => {
            io.to(data.roomId).emit('receive_message', data);
        });

        socket.on('message:reaction:added', (data: { messageId: string; reaction: any; roomId: string }) => {
            io.to(data.roomId).emit('message:reaction:added', {
                messageId: data.messageId,
                reaction: data.reaction
            });
        });

        socket.on('message:reaction:removed', (data: { messageId: string; emoji: string; userId: string; roomId: string }) => {
            io.to(data.roomId).emit('message:reaction:removed', {
                messageId: data.messageId,
                emoji: data.emoji,
                userId: data.userId
            });
        });

        socket.on('message:thread:created', async (data: { parentMessageId: string; threadMessage: any; roomId: string }) => {
            io.to(data.roomId).emit('message:thread:created', {
                parentMessageId: data.parentMessageId,
                threadMessage: data.threadMessage
            });
            
            try {
                await prisma.message.update({
                    where: { id: data.parentMessageId },
                    data: { threadCount: { increment: 1 } }
                });
            } catch (error) {
                console.error('Error updating thread count:', error);
            }
        });

        socket.on('user:typing:start', (data: { roomId: string; userId: string; userName: string }) => {
            socket.to(data.roomId).emit('user:typing:start', {
                userId: data.userId,
                userName: data.userName
            });
            
            prisma.typingIndicator.upsert({
                where: { id: `${data.roomId}-${data.userId}` },
                create: {
                    id: `${data.roomId}-${data.userId}`,
                    roomId: data.roomId,
                    userId: data.userId,
                    expiresAt: new Date(Date.now() + 5000)
                },
                update: {
                    expiresAt: new Date(Date.now() + 5000)
                }
            }).catch(console.error);
        });

        socket.on('user:typing:stop', (data: { roomId: string; userId: string }) => {
            socket.to(data.roomId).emit('user:typing:stop', {
                userId: data.userId
            });
            
            prisma.typingIndicator.deleteMany({
                where: {
                    roomId: data.roomId,
                    userId: data.userId
                }
            }).catch(console.error);
        });

        socket.on('message:read', async (data: { roomId: string; messageId: string; userId: string }) => {
            try {
                await prisma.messageReadReceipt.create({
                    data: {
                        messageId: data.messageId,
                        userId: data.userId,
                        roomId: data.roomId
                    }
                });
            } catch (error) {
                console.error('Error creating read receipt:', error);
            }
            
            io.to(data.roomId).emit('message:read', {
                messageId: data.messageId,
                userId: data.userId
            });
        });

        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
            
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit('user:offline', { userId });
                    break;
                }
            }
        });
    });

    return io;
};
