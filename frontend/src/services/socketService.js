import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket = null;

export function getSocket() {
    if (!socket) {
        socket = io(SOCKET_URL, { autoConnect: false });
    }
    return socket;
}

export function joinChat(chatId) {
    const s = getSocket();
    if (s.connected) s.emit('join_chat', { chatId });
}

export function subscribeToMessages(callback) {
    const s = getSocket();
    s.on('new_message', callback);
    return () => s.off('new_message', callback);
}

export function subscribeToMessageUpdates(callback) {
    const s = getSocket();
    s.on('message_updated', callback);
    return () => s.off('message_updated', callback);
}

export function subscribeToChatFeatures(callback) {
    const s = getSocket();
    s.on('chat_feature', callback);
    return () => s.off('chat_feature', callback);
}

export function emitTyping(chatId) {
    const s = getSocket();
    if (s.connected) s.emit('typing', { chatId });
}

export function emitStopTyping(chatId) {
    const s = getSocket();
    if (s.connected) s.emit('stop_typing', { chatId });
}

export function emitMarkAsRead(chatId, messageId) {
    const s = getSocket();
    if (s.connected) s.emit('mark_read', { chatId, messageId });
}

export function emitAddReaction(messageId, reaction) {
    const s = getSocket();
    if (s.connected) s.emit('add_reaction', { messageId, reaction });
}
