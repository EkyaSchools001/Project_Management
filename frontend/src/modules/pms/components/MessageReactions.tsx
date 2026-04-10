// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../../../services/socketService';
import chatService from '../../../services/chat.service';

const EMOJI_LIST = ['❤️', '👍', '😂', '😮', '😢', '🔥', '👏', '🎉'];

const MessageReactions = ({ message, roomId }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [reactions, setReactions] = useState(message.reactions || []);
    const [hoveredReaction, setHoveredReaction] = useState(null);
    const socket = getSocket();

    const groupedReactions = reactions.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction);
        return acc;
    }, {});

    const handleAddReaction = async (emoji) => {
        try {
            const result = await chatService.addReaction(message.id, emoji);
            if (result.reactions) {
                setReactions(result.reactions);
            }
            
            if (socket) {
                socket.emit('message:reaction:added', {
                    messageId: message.id,
                    reaction: { emoji, userId: result.userId },
                    roomId
                });
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
        setShowPicker(false);
    };

    const handleRemoveReaction = async (emoji) => {
        try {
            await chatService.removeReaction(message.id, emoji);
            
            setReactions(prev => prev.filter(r => r.emoji !== emoji || r.userId !== message.userId));
            
            if (socket) {
                socket.emit('message:reaction:removed', {
                    messageId: message.id,
                    emoji,
                    userId: message.userId,
                    roomId
                });
            }
        } catch (error) {
            console.error('Error removing reaction:', error);
        }
    };

    React.useEffect(() => {
        if (!socket) return;

        const handleReactionAdded = ({ messageId, reaction }) => {
            if (messageId === message.id) {
                setReactions(prev => {
                    const exists = prev.find(r => r.emoji === reaction.emoji && r.userId === reaction.userId);
                    if (exists) return prev;
                    return [...prev, reaction];
                });
            }
        };

        const handleReactionRemoved = ({ messageId, emoji, userId }) => {
            if (messageId === message.id) {
                setReactions(prev => prev.filter(r => r.emoji !== emoji || r.userId !== userId));
            }
        };

        socket.on('message:reaction:added', handleReactionAdded);
        socket.on('message:reaction:removed', handleReactionRemoved);

        return () => {
            socket.off('message:reaction:added', handleReactionAdded);
            socket.off('message:reaction:removed', handleReactionRemoved);
        };
    }, [socket, message.id]);

    return (
        <div className="relative">
            <div className="flex -space-x-1">
                {Object.entries(groupedReactions).map(([emoji, users]) => (
                    <motion.button
                        key={emoji}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onMouseEnter={() => setHoveredReaction(emoji)}
                        onMouseLeave={() => setHoveredReaction(null)}
                        onClick={() => handleRemoveReaction(emoji)}
                        className="relative bg-white rounded-xl px-2.5 py-1 text-[14px] shadow-lg border border-slate-100 hover:scale-110 transition-transform"
                    >
                        {emoji}
                        <span className="ml-1 text-[10px] text-slate-500">{users.length}</span>
                        
                        <AnimatePresence>
                            {hoveredReaction === emoji && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded-lg whitespace-nowrap z-50"
                                >
                                    <div className="flex gap-1">
                                        {users.map((u, i) => (
                                            <div key={i} className="w-5 h-5 rounded-full overflow-hidden border border-white/30">
                                                <img src={`https://ui-avatars.com/api/?name=${u.user?.name || 'User'}&background=random`} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-1 opacity-70">{users.map(u => u.user?.name || 'User').join(', ')}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
                
                <button
                    onClick={() => setShowPicker(!showPicker)}
                    className="w-8 h-8 flex items-center justify-center bg-white/80 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white transition-all border border-slate-100"
                >
                    +
                </button>
            </div>

            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-2 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 flex gap-1 z-50"
                    >
                        {EMOJI_LIST.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => handleAddReaction(emoji)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all hover:scale-125 text-xl"
                            >
                                {emoji}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessageReactions;
