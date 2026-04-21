// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../../../services/socketService';
import chatService from '../../../services/chat.service';
import { Send, ArrowLeft, X } from 'lucide-react';
import { format } from 'date-fns';

const ThreadView = ({ message, roomId, onClose }) => {
    const [threadMessages, setThreadMessages] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = getSocket();

    useEffect(() => {
        fetchThread();
        
        if (socket) {
            socket.on('message:thread:created', ({ parentMessageId, threadMessage }) => {
                if (parentMessageId === message.id) {
                    setThreadMessages(prev => [...prev, threadMessage]);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('message:thread:created');
            }
        };
    }, [message.id]);

    const fetchThread = async () => {
        try {
            const result = await chatService.getThread(message.id);
            setThreadMessages(Array.isArray(result) ? result : result.data || []);
        } catch (error) {
            console.error('Error fetching thread:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        try {
            const reply = await chatService.createThread(message.id, newReply);
            setNewReply('');
            
            if (socket) {
                socket.emit('message:thread:created', {
                    parentMessageId: message.id,
                    threadMessage: reply,
                    roomId
                });
            }
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
        >
            <div className="p-6 bg-slate-950 flex items-center gap-4 shrink-0">
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h3 className="text-white font-black uppercase tracking-tighter">Thread Context</h3>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{message.threadCount || 0} replies</p>
                </div>
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-100">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-xl overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${message.sender?.name}&background=EEF2FF&color=4F46E5`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900 uppercase">{message.sender?.name}</p>
                            <p className="text-[9px] text-zinc-400">{format(new Date(message.createdAt), 'HH:mm')}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">{message.content}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : threadMessages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">No replies yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {threadMessages.map((reply, index) => (
                                <motion.div
                                    key={reply.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${reply.sender?.name}&background=EEF2FF&color=4F46E5`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-slate-900 uppercase">{reply.sender?.name}</span>
                                            <span className="text-[9px] text-zinc-400">{format(new Date(reply.createdAt), 'HH:mm')}</span>
                                        </div>
                                        <p className="text-sm text-slate-700">{reply.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-100">
                <form onSubmit={handleSendReply} className="flex gap-3">
                    <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Reply in thread..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newReply.trim()}
                        className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ThreadView;
