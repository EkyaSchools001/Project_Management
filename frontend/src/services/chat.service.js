import api from './api.client';
import { MOCK_CHATS, MOCK_MESSAGES } from '../data/pmsData';

const getStoredChats = () => {
    try {
        const stored = localStorage.getItem('school_chats');
        return stored ? JSON.parse(stored) : MOCK_CHATS;
    } catch {
        return MOCK_CHATS;
    }
};

const getStoredMessages = () => {
    try {
        const stored = localStorage.getItem('school_messages');
        return stored ? JSON.parse(stored) : MOCK_MESSAGES;
    } catch {
        return MOCK_MESSAGES;
    }
};

const saveChats = (chats) => {
    localStorage.setItem('school_chats', JSON.stringify(chats));
};

const saveMessages = (messages) => {
    localStorage.setItem('school_messages', JSON.stringify(messages));
};

export const chatService = {
    async getChatRooms(params = {}) {
        try {
            const response = await api.get('/chat/rooms', { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total
            };
        } catch (error) {
            console.warn('API unavailable, using local storage');
            await new Promise(resolve => setTimeout(resolve, 200));
            let chats = getStoredChats();
            
            if (params.type) {
                chats = chats.filter(c => c.type === params.type);
            }
            
            if (params.unread) {
                chats = chats.filter(c => c.unreadCount > 0);
            }
            
            return { data: chats, total: chats.length };
        }
    },

    async getChatRoom(id) {
        try {
            return await api.get(`/chat/rooms/${id}`);
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 100));
            return getStoredChats().find(c => c.id === id);
        }
    },

    async createChatRoom(data) {
        try {
            return await api.post('/chat/rooms', data);
        } catch (error) {
            const chats = getStoredChats();
            const newChat = {
                ...data,
                id: `chat-${Date.now()}`,
                type: data.type || 'PRIVATE',
                unreadCount: 0,
                messages: [],
                createdAt: new Date().toISOString()
            };
            saveChats([...chats, newChat]);
            return newChat;
        }
    },

    async updateChatRoom(id, data) {
        try {
            return await api.put(`/chat/rooms/${id}`, data);
        } catch (error) {
            const chats = getStoredChats();
            const updated = chats.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c);
            saveChats(updated);
            return updated.find(c => c.id === id);
        }
    },

    async deleteChatRoom(id) {
        try {
            return await api.delete(`/chat/rooms/${id}`);
        } catch (error) {
            const chats = getStoredChats();
            const messages = getStoredMessages();
            const filteredChats = chats.filter(c => c.id !== id);
            const filteredMessages = { ...messages };
            delete filteredMessages[id];
            saveChats(filteredChats);
            saveMessages(filteredMessages);
            return { success: true };
        }
    },

    async addParticipant(roomId, userId) {
        try {
            return await api.post(`/chat/rooms/${roomId}/participants`, { userId });
        } catch (error) {
            return { success: true, roomId, userId };
        }
    },

    async removeParticipant(roomId, userId) {
        try {
            return await api.delete(`/chat/rooms/${roomId}/participants/${userId}`);
        } catch (error) {
            return { success: true };
        }
    },

    async leaveRoom(roomId) {
        const userJson = localStorage.getItem('school_mgmt_user');
        const user = userJson ? JSON.parse(userJson) : null;
        if (user) {
            return this.removeParticipant(roomId, user.id);
        }
        return { success: false };
    },

    async getMessages(roomId, params = {}) {
        try {
            const response = await api.get(`/chat/rooms/${roomId}/messages`, { params });
            return {
                data: response.data.data || response.data,
                total: response.data.total,
                hasMore: response.data.hasMore
            };
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const messages = getStoredMessages()[roomId] || [];
            
            if (params.before) {
                const beforeDate = new Date(params.before);
                return {
                    data: messages.filter(m => new Date(m.createdAt) < beforeDate).slice(-20),
                    total: messages.length,
                    hasMore: messages.length > 20
                };
            }
            
            return {
                data: messages,
                total: messages.length,
                hasMore: false
            };
        }
    },

    async sendMessage(roomId, content, attachments = []) {
        try {
            const response = await api.post(`/chat/rooms/${roomId}/messages`, { 
                content, 
                attachments 
            });
            return response.data;
        } catch (error) {
            const userJson = localStorage.getItem('school_mgmt_user');
            const user = userJson ? JSON.parse(userJson) : null;
            
            const message = {
                id: `m-${Date.now()}`,
                content,
                senderId: user?.id || 'unknown',
                sender: user,
                roomId,
                attachments,
                reactions: [],
                threadCount: 0,
                createdAt: new Date().toISOString()
            };
            
            const messages = getStoredMessages();
            const roomMessages = messages[roomId] || [];
            messages[roomId] = [...roomMessages, message];
            saveMessages(messages);
            
            return message;
        }
    },

    async updateMessage(messageId, content) {
        try {
            return await api.put(`/chat/messages/${messageId}`, { content });
        } catch (error) {
            const messages = getStoredMessages();
            for (const roomId in messages) {
                const index = messages[roomId].findIndex(m => m.id === messageId);
                if (index !== -1) {
                    messages[roomId][index] = {
                        ...messages[roomId][index],
                        content,
                        edited: true,
                        editedAt: new Date().toISOString()
                    };
                    saveMessages(messages);
                    return messages[roomId][index];
                }
            }
            throw new Error('Message not found');
        }
    },

    async deleteMessage(messageId) {
        try {
            return await api.delete(`/chat/messages/${messageId}`);
        } catch (error) {
            const messages = getStoredMessages();
            for (const roomId in messages) {
                const filtered = messages[roomId].filter(m => m.id !== messageId);
                if (filtered.length !== messages[roomId].length) {
                    messages[roomId] = filtered;
                    saveMessages(messages);
                    return { success: true };
                }
            }
            return { success: true };
        }
    },

    async addReaction(messageId, emoji) {
        try {
            return await api.post(`/chat/messages/${messageId}/reactions`, { emoji });
        } catch (error) {
            const userJson = localStorage.getItem('school_mgmt_user');
            const user = userJson ? JSON.parse(userJson) : null;
            
            const messages = getStoredMessages();
            for (const roomId in messages) {
                const index = messages[roomId].findIndex(m => m.id === messageId);
                if (index !== -1) {
                    const reactions = messages[roomId][index].reactions || [];
                    const existingIndex = reactions.findIndex(
                        r => r.emoji === emoji && r.userId === user?.id
                    );
                    
                    if (existingIndex !== -1) {
                        reactions.splice(existingIndex, 1);
                    } else {
                        reactions.push({
                            emoji,
                            userId: user?.id,
                            user: user,
                            createdAt: new Date().toISOString()
                        });
                    }
                    
                    messages[roomId][index].reactions = reactions;
                    saveMessages(messages);
                    return { success: true, reactions };
                }
            }
            return { success: true };
        }
    },

    async removeReaction(messageId, emoji) {
        try {
            return await api.delete(`/chat/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`);
        } catch (error) {
            return this.addReaction(messageId, emoji);
        }
    },

    async createThread(messageId, content) {
        try {
            return await api.post(`/chat/messages/${messageId}/thread`, { content });
        } catch (error) {
            const userJson = localStorage.getItem('school_mgmt_user');
            const user = userJson ? JSON.parse(userJson) : null;
            
            const threadMessage = {
                id: `tm-${Date.now()}`,
                content,
                senderId: user?.id || 'unknown',
                sender: user,
                parentId: messageId,
                reactions: [],
                createdAt: new Date().toISOString()
            };
            
            const messages = getStoredMessages();
            const threads = JSON.parse(localStorage.getItem('school_threads') || '{}');
            const messageThreads = threads[messageId] || [];
            threads[messageId] = [...messageThreads, threadMessage];
            localStorage.setItem('school_threads', JSON.stringify(threads));
            
            for (const roomId in messages) {
                const index = messages[roomId].findIndex(m => m.id === messageId);
                if (index !== -1) {
                    messages[roomId][index].threadCount = (messages[roomId][index].threadCount || 0) + 1;
                    saveMessages(messages);
                    break;
                }
            }
            
            return threadMessage;
        }
    },

    async getThread(messageId, params = {}) {
        try {
            return await api.get(`/chat/messages/${messageId}/thread`, { params });
        } catch (error) {
            const threads = JSON.parse(localStorage.getItem('school_threads') || '{}');
            return threads[messageId] || [];
        }
    },

    async uploadChatFile(roomId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('roomId', roomId);
            
            const response = await api.post('/chat/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return {
                id: `cf-${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                roomId,
                uploadedAt: new Date().toISOString()
            };
        }
    },

    async markAsRead(roomId, messageId) {
        try {
            return await api.post(`/chat/rooms/${roomId}/read`, { messageId });
        } catch (error) {
            const chats = getStoredChats();
            const updated = chats.map(c => c.id === roomId ? { ...c, unreadCount: 0 } : c);
            saveChats(updated);
            return { success: true };
        }
    },

    async searchMessages(query, params = {}) {
        try {
            return await api.get('/chat/search', { params: { q: query, ...params } });
        } catch (error) {
            const messages = getStoredMessages();
            const results = [];
            const search = query.toLowerCase();
            
            for (const roomId in messages) {
                messages[roomId].forEach(m => {
                    if (m.content?.toLowerCase().includes(search)) {
                        results.push({ ...m, roomId });
                    }
                });
            }
            
            return results;
        }
    },

    async getUnreadCount() {
        try {
            const response = await api.get('/chat/unread-count');
            return response.data.count;
        } catch (error) {
            const chats = getStoredChats();
            return chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        }
    },

    async getOnlineUsers() {
        try {
            return await api.get('/chat/online');
        } catch (error) {
            return [];
        }
    },

    async setStatus(status) {
        try {
            return await api.put('/chat/status', { status });
        } catch (error) {
            return { success: true, status };
        }
    },

    async getPinnedMessages(roomId) {
        try {
            return await api.get(`/chat/rooms/${roomId}/pinned`);
        } catch (error) {
            return [];
        }
    },

    async pinMessage(messageId) {
        try {
            return await api.post(`/chat/messages/${messageId}/pin`);
        } catch (error) {
            return { success: true, messageId, pinned: true };
        }
    },

    async unpinMessage(messageId) {
        try {
            return await api.delete(`/chat/messages/${messageId}/pin`);
        } catch (error) {
            return { success: true, messageId, pinned: false };
        }
    },

    async getMentions(userId) {
        try {
            return await api.get('/chat/mentions', { params: { userId } });
        } catch (error) {
            return [];
        }
    },

    async muteRoom(roomId, duration = null) {
        try {
            return await api.post(`/chat/rooms/${roomId}/mute`, { duration });
        } catch (error) {
            const chats = getStoredChats();
            const updated = chats.map(c => c.id === roomId ? { ...c, muted: true, mutedUntil: duration } : c);
            saveChats(updated);
            return { success: true };
        }
    },

    async unmuteRoom(roomId) {
        try {
            return await api.delete(`/chat/rooms/${roomId}/mute`);
        } catch (error) {
            const chats = getStoredChats();
            const updated = chats.map(c => c.id === roomId ? { ...c, muted: false, mutedUntil: null } : c);
            saveChats(updated);
            return { success: true };
        }
    },

    async archiveRoom(roomId) {
        try {
            return await api.post(`/chat/rooms/${roomId}/archive`);
        } catch (error) {
            return this.updateChatRoom(roomId, { archived: true });
        }
    },

    async getArchivedRooms() {
        try {
            return await api.get('/chat/rooms/archived');
        } catch (error) {
            return getStoredChats().filter(c => c.archived);
        }
    },

    async exportChat(roomId, format = 'json') {
        const response = await api.get(`/chat/rooms/${roomId}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    },

    async searchMessagesInRoom(roomId, query, params = {}) {
        try {
            const response = await api.get(`/chat/rooms/${roomId}/search`, {
                params: { q: query, ...params }
            });
            return response.data;
        } catch (error) {
            const messages = getStoredMessages();
            const results = [];
            const search = query.toLowerCase();
            
            const roomMessages = messages[roomId] || [];
            roomMessages.forEach(m => {
                if (m.content?.toLowerCase().includes(search)) {
                    results.push(m);
                }
            });
            
            return { data: results, total: results.length };
        }
    },

    async editMessage(messageId, content) {
        try {
            return await api.put(`/chat/messages/${messageId}/edit`, { content });
        } catch (error) {
            const messages = getStoredMessages();
            for (const roomId in messages) {
                const index = messages[roomId].findIndex(m => m.id === messageId);
                if (index !== -1) {
                    messages[roomId][index] = {
                        ...messages[roomId][index],
                        content,
                        edited: true,
                        editedAt: new Date().toISOString()
                    };
                    saveMessages(messages);
                    return messages[roomId][index];
                }
            }
            throw new Error('Message not found');
        }
    },

    async deleteMessageForUser(messageId) {
        try {
            return await api.delete(`/chat/messages/${messageId}`);
        } catch (error) {
            const messages = getStoredMessages();
            for (const roomId in messages) {
                const filtered = messages[roomId].filter(m => m.id !== messageId);
                if (filtered.length !== messages[roomId].length) {
                    messages[roomId] = filtered;
                    saveMessages(messages);
                    return { success: true };
                }
            }
            return { success: true };
        }
    },

    async getTypingStatus(roomId) {
        try {
            const response = await api.get(`/chat/rooms/${roomId}/typing`);
            return response.data;
        } catch (error) {
            return { data: [] };
        }
    },

    async sendTypingIndicator(roomId) {
        try {
            return await api.post(`/chat/rooms/${roomId}/typing`);
        } catch (error) {
            return { success: true };
        }
    },

    getAllChats: () => getStoredChats(),
    saveAllChats: saveChats,
    getAllMessages: () => getStoredMessages(),
    saveAllMessages: saveMessages
};

export default chatService;
