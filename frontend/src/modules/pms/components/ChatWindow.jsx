import React, { useEffect, useState, useRef } from 'react';
import api from '../../../services/api';
import { joinChat, subscribeToMessages, subscribeToMessageUpdates, subscribeToChatFeatures, emitTyping, emitStopTyping, emitMarkAsRead, emitAddReaction, getSocket } from '../../../services/socketService';
import { useAuth } from '../../auth/authContext';
import chatService from '../../../services/chat.service';
import MessageReactions from './MessageReactions';
import ThreadView from './ThreadView';
import MessageComposer from './MessageComposer';
import { 
    Send, 
    Paperclip, 
    MoreVertical, 
    Search, 
    Phone, 
    Video, 
    ArrowLeft, 
    Edit2, 
    Trash2, 
    XCircle, 
    CheckCircle, 
    ChevronDown, 
    MessageSquare, 
    Reply, 
    Smile, 
    X, 
    Mic, 
    Square, 
    Play, 
    Pause,
    Zap,
    Activity,
    Globe,
    Cpu,
    Sparkles,
    Target,
    Shield,
    Workflow,
    Layers,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const ChatWindow = ({ chat, onBack, onChatUpdated }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const userId = user?.id;

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const currentUser = user || {};

    // Voice Memo State
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedAudio, setRecordedAudio] = useState(null); 
    const [audioBlob, setAudioBlob] = useState(null); 
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const audioPreviewRef = useRef(null);
    const audioChunks = useRef([]);

    // Message Management State
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [localDeletedIds, setLocalDeletedIds] = useState([]); 

    // Advanced Features State
    const [typingUsers, setTypingUsers] = useState({});
    const [replyTo, setReplyTo] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null); 
    const [activeThread, setActiveThread] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [readReceipts, setReadReceipts] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchMessagesInternal = async () => {
            try {
                const response = await api.get(`chats/${chat?.id}/messages`);
                setMessages(response.data);
                scrollToBottom();
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (chat) {
            fetchMessagesInternal();
            joinChat(chat.id);
        }
    }, [chat]);

    useEffect(() => {
        const socketUnsubs = [];
        subscribeToMessages((message) => {
            if (chat && message.chatId === chat.id) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
                emitMarkAsRead(chat.id);
            }
        });

        subscribeToMessageUpdates(
            (updatedMessage) => {
                if (chat && updatedMessage.chatId === chat.id) {
                    setMessages(prev => prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg));
                }
            },
            ({ messageId, chatId }) => {
                if (chat && chatId === chat.id) {
                    setMessages(prev => prev.map(msg =>
                        msg.id === messageId
                            ? { ...msg, content: 'This message was deleted', deletedAt: new Date(), attachments: null }
                            : msg
                    ));
                }
            }
        );

        subscribeToChatFeatures({
            onTyping: ({ userId: tUserId, userName, chatId: tChatId }) => {
                if (chat && tChatId === chat.id && tUserId !== userId) {
                    setTypingUsers(prev => ({ ...prev, [tUserId]: userName }));
                }
            },
            onStopTyping: ({ userId: tUserId, chatId: tChatId }) => {
                if (chat && tChatId === chat.id) {
                    setTypingUsers(prev => {
                        const newUsers = { ...prev };
                        delete newUsers[tUserId];
                        return newUsers;
                    });
                }
            },
            onReaction: ({ messageId, reaction, chatId: rChatId }) => {
                if (chat && rChatId === chat.id) {
                    setMessages(prev => prev.map(msg => {
                        if (msg.id === messageId) {
                            const newReactions = [...(msg.reactions || [])];
                            const existingIndex = newReactions.findIndex(r => r.userId === reaction.userId && r.emoji === reaction.emoji);
                            if (existingIndex > -1) {
                                newReactions[existingIndex] = reaction;
                            } else {
                                newReactions.push(reaction);
                            }
                            return { ...msg, reactions: newReactions };
                        }
                        return msg;
                    }));
                }
            }
        });

        const socket = getSocket();
        if (socket) {
            socket.on('user:online', ({ userId: onlineUserId }) => {
                setOnlineUsers(prev => [...prev, onlineUserId]);
            });
            socket.on('user:offline', ({ userId: offlineUserId }) => {
                setOnlineUsers(prev => prev.filter(id => id !== offlineUserId));
            });
            socket.on('users:online:list', (users) => {
                setOnlineUsers(users);
            });
            socket.on('message:read', ({ messageId, userId: readerUserId }) => {
                setReadReceipts(prev => ({
                    ...prev,
                    [messageId]: [...(prev[messageId] || []), readerUserId]
                }));
            });
        }

        if (chat) emitMarkAsRead(chat.id);
    }, [chat, userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() && !isUploading) return;

        const content = newMessage;
        const replyToId = replyTo?.id;

        setNewMessage('');
        setReplyTo(null);
        emitStopTyping(chat.id);

        try {
            await api.post('chats/message', {
                chatId: chat.id,
                content,
                replyToId
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        emitTyping(chat.id, currentUser.name);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            emitStopTyping(chat.id);
        }, 3000);
    };

    const handleAddReaction = (msgId, emoji) => {
        emitAddReaction(msgId, emoji, chat.id);
        setShowEmojiPicker(null);
    };

    const formatMessageContent = (content) => {
        if (!content) return '';
        const escaped = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        return escaped
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/~(.*?)~/g, '<del>$1</del>')
            .replace(/\n/g, '<br />');
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await api.post('chats/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await api.post('chats/message', {
                chatId: chat.id,
                content: '',
                attachments: [uploadRes.data]
            });
        } catch (error) {
            console.error('Error uploading/sending file:', error);
            alert('Failed to upload file');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCancelRecording = () => {
        setRecordedAudio(null);
        setAudioBlob(null);
        setIsPlayingPreview(false);
    };

    const handleSendAudio = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        const audioFile = new File([audioBlob], `voice-memo-${Date.now()}.webm`, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioFile);

        try {
            const uploadRes = await api.post('chats/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await api.post('chats/message', {
                chatId: chat.id,
                content: '',
                attachments: [uploadRes.data]
            });
            handleCancelRecording();
        } catch (error) {
            console.error('Error uploading voice memo:', error);
            alert('Failed to send voice memo');
        } finally {
            setIsUploading(false);
        }
    };

    const toggleAudioPreview = () => {
        if (audioPreviewRef.current) {
            if (isPlayingPreview) {
                audioPreviewRef.current.pause();
            } else {
                audioPreviewRef.current.play();
            }
            setIsPlayingPreview(!isPlayingPreview);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunks.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudio(audioUrl);
                setAudioBlob(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleEditMessage = async (msgId) => {
        if (!editContent.trim()) return;
        try {
            await api.put(`chats/message/${msgId}`, { content: editContent });
            setEditingMessageId(null);
            setEditContent('');
        } catch (error) {
            console.error('Error editing message:', error);
            alert('Failed to edit message');
        }
    };

    const handleDeleteMessage = async (msgId, forEveryone = true) => {
        if (forEveryone) {
            try {
                await api.delete(`chats/message/${msgId}`);
            } catch (error) {
                console.error('Error deleting message:', error);
                alert('Failed to delete message for everyone');
            }
        } else {
            setLocalDeletedIds(prev => [...prev, msgId]);
        }
        setShowDeleteOptions(false);
        setDeleteTargetId(null);
    };

    const handleClearChat = async () => {
        if (!window.confirm('WIPE TERMINAL SESSION?')) return;
        try {
            await api.post(`chats/${chat.id}/clear`, { forEveryone: true });
            setMessages([]);
            setActiveMenuId(null);
            if (onChatUpdated) onChatUpdated();
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    const handleDeleteChat = async () => {
        if (!window.confirm('TERMINATE CHANNEL?')) return;
        try {
            await api.delete(`chats/${chat.id}`, { data: { forEveryone: true } });
            if (onChatUpdated) onChatUpdated();
            onBack();
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const getChatName = () => {
        if (chat?.type === 'PRIVATE') {
            const other = chat.participants?.find(p => p.user.id !== userId);
            return other ? other.user.name : 'Unknown Operator';
        }
        return chat?.name || 'Mission Control';
    };

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const results = await chatService.searchMessages(searchQuery, { roomId: chat.id });
            setSearchResults(Array.isArray(results) ? results : results.data || []);
        } catch (error) {
            console.error('Error searching messages:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleOpenThread = (message) => {
        setActiveThread(message);
    };

    if (!chat) return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50/20 backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="text-center space-y-10 max-w-lg relative z-10"
            >
                <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center mx-auto transition-all hover:scale-110 hover:shadow-indigo-500/10 group/icon">
                    <MessageSquare size={56} className="text-slate-300 group-hover/icon:text-indigo-400 transition-colors" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter">Archives Unlinked</h2>
                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] leading-relaxed">Select an active neural node to begin <br />secure synchronization protocol.</p>
                </div>
                <div className="flex justify-center flex-wrap gap-4">
                    <div className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-3">
                        <Activity size={14} /> System Latency: 0.2ms
                    </div>
                    <div className="px-6 py-2 bg-backgroundmerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-3">
                        <Shield size={14} /> Encryption: Layer 7
                    </div>
                </div>
            </motion.div>
        </div>
    );

    const renderAttachment = (attachment) => {
        const isImage = attachment.mimetype.startsWith('image/');
        const isAudio = attachment.mimetype.startsWith('audio/');
        const fileUrl = `http://localhost:5000${attachment.url}`;

        if (isImage) {
            return (
                <div className="mb-4 overflow-hidden rounded-3xl border border-white/20 shadow-2xl group/img relative">
                    <img src={fileUrl} alt="" className="max-w-full cursor-pointer transition-transform duration-500 group-hover/img:scale-105" onClick={() => window.open(fileUrl, '_blank')} />
                    <div className="absolute inset-0 bg-backgroundackgroundlack/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <ArrowUpRight size={32} className="text-foreground" />
                    </div>
                </div>
            );
        }

        if (isAudio) {
            return (
                <div className="mb-4 p-5 bg-backgroundackgroundlack/5 rounded-3xl border border-white/10 backdrop-blur-xl min-w-[280px]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-xl">
                            <Mic size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Voice Data Packet</p>
                            <div className="w-full h-1 bg-white/20 rounded-full mt-2" />
                        </div>
                    </div>
                    <audio src={fileUrl} controls className="w-full h-10 opacity-80" />
                </div>
            );
        }

        return (
            <div className="flex items-center gap-5 bg-white/10 p-5 rounded-3xl mb-4 border border-white/20 hover:bg-white/20 transition-all group/file shadow-2xl">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-2xl group-hover/file:scale-110 transition-transform">
                    <Paperclip size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-foreground text-xs uppercase tracking-tight truncate mb-1">{attachment.filename}</p>
                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black text-foreground/40 hover:text-foreground uppercase tracking-widest transition-colors">Download Matrix Unit</a>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            {/* Header Strategy */}
            <div className="h-24 bg-slate-950 px-8 flex items-center justify-between shrink-0 border-b border-white/5 relative z-30 group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-rose-600/10 opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <button onClick={onBack} className="lg:hidden w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-2xl text-foreground transition-all active:scale-90 border border-white/10">
                        <ArrowLeft size={24} className="stroke-[3]" />
                    </button>
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <img src={`https://ui-avatars.com/api/?name=${getChatName()}&background=random&color=fff&bold=true`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-backgroundmerald-400 rounded-full border-4 border-slate-950 animate-pulse shadow-glow shadow-emerald-400/50" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tighter leading-none mb-2">{getChatName()}</h2>
                        <div className="flex items-center gap-3">
                            {Object.keys(typingUsers).length > 0 ? (
                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] animate-pulse">Synchronizing Data Node...</p>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-backgroundmerald-500 shadow-glow shadow-emerald-500/50 animate-pulse" />
                                    <p className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.5em]">Direct Link Active</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button 
                        onClick={() => setShowSearch(!showSearch)}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-foreground/40 hover:text-foreground transition-all active:scale-90 border border-white/5"
                    >
                        <Search size={20} />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-foreground/40 hover:text-foreground transition-all active:scale-90 border border-white/5">
                        <Phone size={20} />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-foreground/40 hover:text-foreground transition-all active:scale-90 border border-white/5">
                        <Video size={20} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setActiveMenuId(activeMenuId === 'chat-options' ? null : 'chat-options')}
                            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-foreground/40 hover:text-foreground transition-all active:scale-90 border border-white/5"
                        >
                            <MoreVertical size={24} />
                        </button>
                        <AnimatePresence>
                            {activeMenuId === 'chat-options' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-full mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-3 z-50 min-w-[240px] overflow-hidden"
                                >
                                    <OptionButton onClick={handleClearChat} icon={XCircle} label="Purge History" color="text-slate-900" />
                                    <OptionButton onClick={handleDeleteChat} icon={Trash2} label="Terminate Vector" color="text-rose-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Neural Streams Canvas */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar bg-slate-50/20 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/2 via-transparent to-rose-500/2 pointer-events-none" />
                <div className="flex flex-col gap-12 max-w-5xl mx-auto relative z-10">
                    <AnimatePresence initial={false}>
                        {messages.filter(m => !localDeletedIds.includes(m.id)).map((msg, index) => {
                            const isSelf = msg.senderId === userId;
                            const isMenuOpen = activeMenuId === msg.id;
                            let attachments = [];
                            try {
                                if (msg.attachments) attachments = typeof msg.attachments === 'string' ? JSON.parse(msg.attachments) : msg.attachments;
                            } catch (e) { }

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: isSelf ? 20 : -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    className={`flex ${isSelf ? 'justify-end' : 'justify-start'} group items-end gap-5`}
                                >
                                    {!isSelf && (
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-xl group-hover:scale-110 transition-transform hidden sm:block">
                                            <img src={`https://ui-avatars.com/api/?name=${msg.sender?.name}&background=EEF2FF&color=4F46E5&bold=true`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                                        <div className={`
                                            group/bubble relative p-6 rounded-[2.5rem] text-sm leading-relaxed transition-all duration-500 border border-transparent shadow-xl
                                            ${isSelf
                                                ? 'bg-slate-950 text-foreground rounded-br-none hover:shadow-indigo-500/20 translate-z-0'
                                                : 'bg-white text-slate-950 border-slate-100 rounded-bl-none hover:shadow-slate-200'
                                            }
                                            ${attachments.length > 0 ? 'p-3' : ''}
                                        `}>
                                            {msg.replyTo && (
                                                <div className={`mb-4 p-4 rounded-2xl border-l-4 text-[10px] ${isSelf ? 'bg-white/5 border-indigo-400/50 text-indigo-100' : 'bg-slate-50 border-indigo-600 text-muted-foreground'}`}>
                                                    <p className="font-black uppercase tracking-widest mb-1">{msg.replyTo.sender.name}</p>
                                                    <p className="opacity-60 truncate italic">{msg.replyTo.content}</p>
                                                </div>
                                            )}

                                            {attachments.length > 0 && (
                                                <div className="mb-2">
                                                    {attachments.map((att, i) => <div key={i}>{renderAttachment(att)}</div>)}
                                                </div>
                                            )}

                                            <div className="break-words font-medium text-base sm:text-lg">
                                                {msg.deletedAt ? (
                                                    <span className="flex items-center gap-3 opacity-30 italic text-sm">
                                                        <Shield size={16} /> DATA STREAM PURGED
                                                    </span>
                                                ) : (
                                                    <span dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }} />
                                                )}
                                            </div>

                                            <div className={`text-[9px] mt-4 flex items-center gap-3 font-black uppercase tracking-[0.2em] ${isSelf ? 'text-foreground/30' : 'text-slate-300'}`}>
                                                {format(new Date(msg.createdAt), 'HH:mm')}
                                                {isSelf && !msg.deletedAt && (
                                                    <CheckCircle size={12} className={msg.isRead ? 'text-emerald-400' : 'text-foreground/20'} />
                                                )}
                                            </div>

                                            {/* Reactions Node */}
                                            {msg.reactions && msg.reactions.length > 0 && (
                                                <div className={`absolute -bottom-4 ${isSelf ? 'right-6' : 'left-6'} flex -space-x-1 filter drop-shadow-2xl`}>
                                                    {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => (
                                                        <div key={emoji} className="bg-white rounded-xl px-2.5 py-1 text-[14px] shadow-2xl border border-slate-50 transition-all hover:scale-125 hover:z-10">{emoji}</div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Bubble Actions Matrix */}
                                            {!msg.deletedAt && (
                                                <div className={`flex gap-2 opacity-0 group-hover/bubble:opacity-100 transition-all duration-300 absolute top-1/2 -translate-y-1/2 ${isSelf ? '-left-40' : '-right-40'}`}>
                                                    <BubbleAction icon={Smile} onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)} />
                                                    <BubbleAction icon={Reply} onClick={() => setReplyTo(msg)} />
                                                    {(msg.threadCount > 0 || msg.parentId) && (
                                                        <BubbleAction icon={MessageSquare} onClick={() => handleOpenThread(msg)} />
                                                    )}
                                                    <BubbleAction icon={MoreVertical} onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)} />
                                                </div>
                                            )}

                                            <AnimatePresence>
                                                {showEmojiPicker === msg.id && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className={`absolute bottom-full mb-6 ${isSelf ? 'right-0' : 'left-0'} bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 flex gap-1 z-50`}
                                                    >
                                                        {['❤️', '👍', '😂', '😮', '😢', '🔥'].map(emoji => (
                                                            <button key={emoji} onClick={() => handleAddReaction(msg.id, emoji)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all hover:scale-125 text-xl">{emoji}</button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <AnimatePresence>
                                                {isMenuOpen && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                                        className={`absolute top-full mt-4 ${isSelf ? 'right-0' : 'left-0'} bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 min-w-[180px] overflow-hidden`}
                                                    >
                                                        {isSelf && <OptionButton icon={Edit2} label="Modify Link" onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); setActiveMenuId(null); }} />}
                                                        <OptionButton icon={Trash2} label="Purge Unit" color="text-rose-600" onClick={() => { setDeleteTargetId(msg.id); setShowDeleteOptions(true); setActiveMenuId(null); }} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Neural Uplink Input Terminal */}
            <div className="bg-white px-8 py-8 border-t border-slate-100 relative z-40">
                <div className="max-w-5xl mx-auto flex items-end gap-6">
                    <button onClick={handleFileSelect} className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-50 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 transition-all active:scale-90 shadow-sm shrink-0">
                        <Paperclip size={24} className={isUploading ? 'animate-pulse' : ''} />
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    </button>

                    <div className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-100 focus-within:bg-white focus-within:ring-8 focus-within:ring-indigo-600/5 focus-within:border-indigo-600/20 transition-all overflow-hidden flex flex-col shadow-inner">
                        <AnimatePresence>
                            {replyTo && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-indigo-50/50 border-b border-indigo-100 px-8 py-4 flex items-center justify-between">
                                    <div className="border-l-4 border-indigo-600 pl-4">
                                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Targeting Node: {replyTo.sender.name}</p>
                                        <p className="text-xs text-slate-500 truncate font-medium">{replyTo.content}</p>
                                    </div>
                                    <button onClick={() => setReplyTo(null)} className="w-8 h-8 flex items-center justify-center hover:bg-indigo-100 rounded-xl text-indigo-600 transition-all active:scale-90"><X size={18} /></button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {recordedAudio ? (
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-6">
                                    <button onClick={toggleAudioPreview} className="w-14 h-14 flex items-center justify-center bg-indigo-600 text-foreground rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95">
                                        {isPlayingPreview ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                                    </button>
                                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em] animate-pulse">Uplink Packet Ready for Transmission</div>
                                    <audio ref={audioPreviewRef} src={recordedAudio} onEnded={() => setIsPlayingPreview(false)} className="hidden" />
                                </div>
                                <button onClick={handleCancelRecording} className="w-12 h-12 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><X size={24} /></button>
                            </div>
                        ) : (
                            <textarea
                                value={newMessage}
                                onChange={handleTyping}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder={isRecording ? "Capturing Waveform..." : "Transmit Signal Protocol..."}
                                disabled={isRecording}
                                rows={1}
                                className="w-full bg-transparent py-6 px-10 text-base font-medium text-slate-900 placeholder:text-[10px] placeholder:font-black placeholder:uppercase placeholder:tracking-[0.4em] placeholder:text-slate-300 focus:outline-none resize-none max-h-40 no-scrollbar"
                            />
                        )}
                    </div>

                    <button
                        onClick={recordedAudio ? handleSendAudio : (isRecording ? stopRecording : (newMessage.trim() ? handleSend : startRecording))}
                        className={`w-16 h-16 flex items-center justify-center rounded-[1.8rem] transition-all shadow-2xl shrink-0 ${isRecording ? 'bg-rose-600 text-foreground animate-pulse' : (newMessage.trim() || recordedAudio ? 'bg-indigo-600 text-foreground hover:bg-indigo-700' : 'bg-slate-950 text-foreground hover:bg-backgroundackgroundlack')}`}
                    >
                        {isRecording ? <Square size={20} fill="currentColor" /> : (newMessage.trim() || recordedAudio ? <Send size={24} /> : <Mic size={24} />)}
                    </button>
                </div>
            </div>

            {/* Matrix Modals */}
            <AnimatePresence>
                {showDeleteOptions && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-3xl flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[4rem] p-12 w-full max-w-sm text-center space-y-10 border border-white/20 shadow-2xl">
                            <div className="w-24 h-24 bg-rose-50 rounded-[3rem] flex items-center justify-center mx-auto text-rose-600 border border-rose-100/50 shadow-2xl shadow-rose-600/10"><Trash2 size={40} /></div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Purge Data Unit</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">This action will permanently un-sync this packet from the neural network.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <ModalButton onClick={() => handleDeleteMessage(deleteTargetId, true)} label="Purge Globally" color="bg-rose-600" />
                                <button onClick={() => setShowDeleteOptions(false)} className="py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Abort Sequence</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Thread View */}
            <AnimatePresence>
                {activeThread && (
                    <ThreadView 
                        message={activeThread} 
                        roomId={chat.id} 
                        onClose={() => setActiveThread(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-3xl flex items-start justify-center p-6 pt-24">
                        <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[70vh] flex flex-col shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <form onSubmit={handleSearch} className="flex gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search messages..."
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none"
                                        />
                                    </div>
                                    <button type="submit" className="px-8 bg-indigo-600 text-foreground rounded-2xl font-black uppercase">
                                        Search
                                    </button>
                                    <button type="button" onClick={() => setShowSearch(false)} className="px-4 text-muted-foreground">
                                        <X size={24} />
                                    </button>
                                </form>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                {isSearching ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground font-black uppercase tracking-wider">No results found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {searchResults.map(result => (
                                            <div key={result.id} className="p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                                                        <img src={`https://ui-avatars.com/api/?name=${result.sender?.name}&background=random`} alt="" className="w-full h-full" />
                                                    </div>
                                                    <span className="font-black text-slate-900">{result.sender?.name}</span>
                                                    <span className="text-muted-foreground text-sm">{new Date(result.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-slate-700">{result.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const OptionButton = ({ icon: Icon, label, onClick, color = "text-slate-900" }) => (
    <button onClick={onClick} className={`w-full text-left px-6 py-3.5 hover:bg-slate-50 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-colors ${color}`}>
        <Icon size={16} /> {label}
    </button>
);

const BubbleAction = ({ icon: Icon, onClick }) => (
    <button onClick={onClick} className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-xl text-muted-foreground hover:text-indigo-600 hover:shadow-xl transition-all active:scale-90 border border-slate-100">
        <Icon size={18} />
    </button>
);

const ModalButton = ({ onClick, label, color }) => (
    <button onClick={onClick} className={`w-full h-16 rounded-[1.5rem] text-foreground text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${color} hover:brightness-110 shadow-lg`}>
        {label}
    </button>
);

export default ChatWindow;
