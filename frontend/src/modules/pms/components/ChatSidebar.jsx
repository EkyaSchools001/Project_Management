import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { getSocket, subscribeToChatFeatures } from '../../../services/socketService';
import chatService from '../../../services/chat.service';
import { 
    Plus, 
    MessageSquare, 
    X, 
    Search, 
    MoreVertical, 
    CheckCheck, 
    Send, 
    Paperclip, 
    Phone, 
    Video, 
    ArrowLeft, 
    Edit2, 
    Trash2, 
    XCircle, 
    CheckCircle, 
    ChevronDown, 
    Reply, 
    Smile,
    Activity,
    Globe,
    Zap,
    Cpu,
    Sparkles,
    Target,
    Shield,
    Workflow,
    Layers,
    Clock,
    Users,
    BellOff
} from 'lucide-react';
import { useAuth } from '../../auth/authContext';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSidebar = ({ onSelectChat, activeChatId, initialChatId, refreshTrigger }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [typingChats, setTypingChats] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const { user } = useAuth();
    const userId = user?.id;

    useEffect(() => {
        fetchChats();

        const socket = getSocket();
        if (socket) {
            subscribeToChatFeatures({
                onTyping: ({ chatId }) => {
                    setTypingChats(prev => ({ ...prev, [chatId]: true }));
                },
                onStopTyping: ({ chatId }) => {
                    setTypingChats(prev => {
                        const next = { ...prev };
                        delete next[chatId];
                        return next;
                    });
                }
            });
            
            socket.on('user:online', ({ userId: onlineUserId }) => {
                setOnlineUsers(prev => [...prev, onlineUserId]);
            });
            
            socket.on('user:offline', ({ userId: offlineUserId }) => {
                setOnlineUsers(prev => prev.filter(id => id !== offlineUserId));
            });
            
            socket.on('users:online:list', (users) => {
                setOnlineUsers(users);
            });
            
            socket.on('receive_message', () => fetchChats());
            socket.on('chat_deleted', () => fetchChats());
            socket.on('chat_cleared', () => fetchChats());

            return () => {
                socket.off('chat_deleted');
                socket.off('chat_cleared');
                socket.off('user:online');
                socket.off('user:offline');
                socket.off('users:online:list');
            };
        }
    }, [refreshTrigger]);

    useEffect(() => {
        if (chats.length > 0 && initialChatId) {
            const chatToSelect = chats.find(c => c.id === initialChatId);
            if (chatToSelect) {
                onSelectChat(chatToSelect);
            }
        }
    }, [chats, initialChatId]);

    const fetchChats = async () => {
        try {
            const response = await api.get('chats');
            setChats(response.data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setError(null);
        try {
            const response = await api.get('users');
            const currentUserId = user?.id;
            const otherUsers = response.data.filter(u => u.id !== currentUserId);
            setUsers(otherUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleNewChatClick = () => {
        setShowNewChatModal(true);
        fetchUsers();
    };

    const handleCreateChat = async (targetUserId) => {
        try {
            const response = await api.post('chats/private', { targetUserId });
            setShowNewChatModal(false);
            await fetchChats();
            onSelectChat(response.data);
        } catch (error) {
            console.error('Error creating chat:', error);
            alert('Failed to create chat');
        }
    };

    const getChatName = (chat) => {
        if (chat.type === 'PRIVATE') {
            const other = chat.participants.find(p => p.user.id !== userId);
            return other ? other.user.name : 'Unknown User';
        }
        return chat.name;
    };

    const getLastMessage = (chat) => {
        if (chat.messages && chat.messages.length > 0) {
            const lastMsg = chat.messages[0];
            return {
                content: lastMsg.content,
                time: new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        }
        return { content: 'No messages yet', time: '' };
    };

    const filteredChats = chats.filter(chat => {
        const matchesSearch = getChatName(chat).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = roomTypeFilter === 'ALL' || chat.type === roomTypeFilter;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="w-full bg-white/20 h-full flex flex-col items-center justify-center gap-8 backdrop-blur-2xl border-r border-white/10">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-rose-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-rose-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400 animate-pulse">Syncing Neural Streams...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">
            {/* Header Strategy */}
            <div className="p-8 sm:p-10 bg-slate-950 border-b border-white/5 shrink-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-transparent to-rose-600/10 opacity-50 transition-opacity duration-1000 group-hover:opacity-100" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse-glow shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-foreground">Archives</h2>
                        </div>
                        <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.3em]">Operational Matrix Active</p>
                    </div>
                    <button
                        onClick={handleNewChatClick}
                        className="w-14 h-14 bg-white/10 hover:bg-white text-foreground hover:text-slate-950 rounded-2xl transition-all shadow-2xl active:scale-90 flex items-center justify-center group/add"
                    >
                        <Plus size={24} className="group-hover/add:rotate-90 transition-transform duration-500 stroke-[3]" />
                    </button>
                </div>
            </div>

            {/* Search Protocol */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 shadow-sm relative z-10">
                <div className="relative group/search">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground group-focus-within/search:text-rose-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="IDENTIFY CHANNEL..."
                        className="w-full pl-16 pr-8 h-14 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-wider focus:ring-8 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 mt-3">
                    {['ALL', 'PRIVATE', 'GROUP'].map(type => (
                        <button
                            key={type}
                            onClick={() => setRoomTypeFilter(type)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                                roomTypeFilter === type 
                                    ? 'bg-rose-600 text-foreground' 
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Matrix Streams */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    {filteredChats.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center mx-auto text-slate-200">
                                <Search size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground leading-relaxed">No signals detected in <br />current temporal slice</p>
                        </motion.div>
                    ) : (
                        filteredChats.map((chat, i) => {
                            const lastMsg = getLastMessage(chat);
                            const isActive = activeChatId === chat.id;
                            const name = getChatName(chat);
                            return (
                                <motion.div
                                    key={chat.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => onSelectChat(chat)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setSelectedChat(chat);
                                        setShowSettingsModal(true);
                                    }}
                                    className={`group relative p-5 cursor-pointer rounded-[2rem] transition-all duration-500 overflow-hidden ${isActive 
                                        ? 'bg-slate-950 text-foreground shadow-2xl scale-102 translate-x-2' 
                                        : 'hover:bg-white hover:shadow-xl hover:border-slate-100 border border-transparent'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 via-transparent to-transparent opacity-50" />
                                    )}
                                    
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="relative shrink-0">
                                            <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-500 ${isActive ? 'border-white/40 scale-110 rotate-3 shadow-rose-500/20' : 'border-slate-100 grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105'}`}>
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff&bold=true`}
                                                    alt={name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-4 ${isActive ? 'border-slate-950' : 'border-white'} ${
                                                chat.type === 'PRIVATE' && chat.participants?.some(p => p.user?.id && onlineUsers.includes(p.user.id)) 
                                                    ? 'bg-red-400 animate-pulse' 
                                                    : 'bg-slate-300'
                                            }`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <h3 className={`text-sm font-black truncate tracking-tighter uppercase leading-none ${isActive ? 'text-foreground' : 'text-slate-950 group-hover:text-rose-600'}`}>
                                                    {name}
                                                </h3>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-foreground/40' : 'text-muted-foreground'}`}>
                                                    {lastMsg.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className={`text-[11px] font-black truncate flex items-center gap-2 uppercase tracking-wide ${isActive ? 'text-foreground/60' : 'text-slate-500'}`}>
                                                    {typingChats[chat.id] ? (
                                                        <span className={isActive ? 'text-red-400' : 'text-rose-600 animate-pulse'}>SYNCHRONIZING...</span>
                                                    ) : (
                                                        <>
                                                            {chat.messages?.[0]?.senderId === userId && (
                                                                <CheckCheck size={14} className={isActive ? 'text-red-400' : 'text-rose-500'} />
                                                            )}
                                                            <span className="truncate opacity-80">{lastMsg.content}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {chat.unreadCount > 0 && (
                                                    <span className={`h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center rounded-lg text-[9px] font-black transition-all ${isActive ? 'bg-white text-slate-950' : 'bg-rose-600 text-foreground shadow-lg shadow-rose-500/20'}`}>
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Initiation Protocol Overlay */}
            <AnimatePresence>
                {showNewChatModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-3xl z-[200] flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 40, opacity: 0 }}
                            className="bg-white rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.4)] w-full max-w-2xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh]"
                        >
                            <div className="bg-slate-950 p-12 flex items-center justify-between shrink-0 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/30 via-transparent to-rose-600/10" />
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-rose-400">
                                            <Zap size={32} />
                                        </div>
                                        <h3 className="text-foreground text-4xl font-black uppercase tracking-tighter">Initiation</h3>
                                    </div>
                                    <p className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.5em]">Establishing Direct Neural Link // Vector Alpha</p>
                                </div>
                                <button onClick={() => setShowNewChatModal(false)} className="w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-white text-foreground/40 hover:text-slate-950 rounded-3xl transition-all active:scale-90 relative z-10">
                                    <X size={32} className="stroke-[3]" />
                                </button>
                            </div>

                            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-12 bg-white">
                                {loadingUsers ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-8">
                                        <div className="w-20 h-20 relative">
                                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-transparent border-t-rose-600 rounded-full animate-spin"></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Scanning Network Operators...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        {['ADMIN', 'MANAGER', 'TEAM_MEMBER'].map((role, groupIdx) => {
                                            const roleUsers = users.filter(u => u.role === role);
                                            if (roleUsers.length === 0) return null;
                                            return (
                                                <div key={role} className="space-y-6">
                                                    <div className="flex items-center gap-6 px-4">
                                                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.6em] shrink-0">{role} Units</span>
                                                        <div className="h-1 bg-slate-50 flex-1 rounded-full overflow-hidden">
                                                            <div className="h-full bg-rose-100 w-1/4 rounded-full" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {roleUsers.map((user, i) => (
                                                            <motion.button
                                                                key={user.id}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.05 }}
                                                                onClick={() => handleCreateChat(user.id)}
                                                                className="flex items-center gap-5 p-5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-rose-200 hover:shadow-2xl rounded-3xl transition-all group text-left active:scale-[0.98]"
                                                            >
                                                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                                                                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&bold=true`} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 min-w-0 pr-2">
                                                                    <div className="font-black text-slate-950 text-sm uppercase tracking-tighter truncate leading-none mb-1.5">{user.name}</div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate">Node ID: {user.id.slice(0, 8)}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-rose-600 group-hover:text-foreground transition-all shadow-sm">
                                                                    <ArrowLeft size={18} className="rotate-180 stroke-[3]" />
                                                                </div>
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Members Modal */}
            <AnimatePresence>
                {showMembersModal && selectedChat && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-3xl z-[200] flex items-center justify-center p-6"
                        onClick={() => setShowMembersModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-slate-950 p-8 flex items-center justify-between">
                                <h3 className="text-foreground text-xl font-black uppercase">Members</h3>
                                <button onClick={() => setShowMembersModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-foreground">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 max-h-96 overflow-y-auto">
                                {selectedChat.participants?.map(p => (
                                    <div key={p.user.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden">
                                                <img src={`https://ui-avatars.com/api/?name=${p.user.name}&background=random`} alt="" className="w-full h-full" />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${onlineUsers.includes(p.user.id) ? 'bg-red-400' : 'bg-slate-300'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900">{p.user.name}</p>
                                            <p className="text-[9px] text-muted-foreground uppercase">{p.user.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettingsModal && selectedChat && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-3xl z-[200] flex items-center justify-center p-6"
                        onClick={() => setShowSettingsModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-slate-950 p-8 flex items-center justify-between">
                                <h3 className="text-foreground text-xl font-black uppercase">Settings</h3>
                                <button onClick={() => setShowSettingsModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-foreground">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <button onClick={() => { setShowSettingsModal(false); setShowMembersModal(true); }} className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-4 text-left">
                                    <Users size={20} className="text-rose-600" />
                                    <span className="font-black text-slate-900 uppercase text-sm">View Members</span>
                                </button>
                                <button className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-4 text-left">
                                    <Search size={20} className="text-rose-600" />
                                    <span className="font-black text-slate-900 uppercase text-sm">Search Messages</span>
                                </button>
                                <button className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-4 text-left">
                                    <BellOff size={20} className="text-amber-600" />
                                    <span className="font-black text-slate-900 uppercase text-sm">Mute Notifications</span>
                                </button>
                                <button className="w-full p-4 bg-rose-50 hover:bg-rose-100 rounded-2xl flex items-center gap-4 text-left">
                                    <Trash2 size={20} className="text-rose-600" />
                                    <span className="font-black text-rose-600 uppercase text-sm">Delete Chat</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatSidebar;
