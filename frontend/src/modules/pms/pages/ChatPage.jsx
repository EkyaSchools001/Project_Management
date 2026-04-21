import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    Search, 
    Plus, 
    Activity, 
    Globe, 
    Zap, 
    Cpu, 
    Sparkles, 
    Target, 
    ArrowUpRight,
    Shield,
    Workflow,
    Layers,
    Clock,
    MoreVertical
} from 'lucide-react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialChatId = searchParams.get('chatId');
    const [refreshSidebar, setRefreshSidebar] = useState(0);

    const handleChatUpdate = () => {
        setRefreshSidebar(prev => prev + 1);
    };

    const handleBack = () => {
        setSelectedChat(null);
        setSearchParams({});
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col h-[calc(100vh-120px)] max-w-[1800px] mx-auto p-6 sm:p-10 lg:p-12 space-y-10 relative overflow-hidden"
        >
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] -z-10" />

            {/* Vibrant Mission Matrix Header */}
            <header className="relative overflow-hidden p-8 sm:p-12 bg-slate-950 rounded-[3rem] sm:rounded-[4rem] text-foreground shadow-2xl border border-white/5 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-rose-600/10" />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative z-10">
                    <div className="space-y-6 max-w-3xl">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl">
                            <Activity size={14} className="text-emerald-400" />
                            Neural Uplink Protocol: Established
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-2">
                            Communication <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 animate-gradient-shift">Matrix</span>
                        </motion.h1>
                        <div className="flex flex-wrap gap-6">
                            <MetricPill label="Nodes Active" value="128" color="text-indigo-400" bg="bg-indigo-400/10" />
                            <MetricPill label="Encryption" value="AES-256" color="text-emerald-400" bg="bg-backgroundmerald-400/10" />
                        </div>
                    </div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto pb-2">
                        <div className="relative group/search flex-1 sm:w-80">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20 w-5 h-5 group-focus-within/search:text-indigo-400" />
                            <input
                                type="text"
                                placeholder="QUERY ENCRYPTED STREAM..."
                                className="w-full pl-16 pr-8 h-18 bg-white/5 border border-white/10 rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] focus:border-indigo-500 focus:bg-white/10 outline-none transition-all backdrop-blur-3xl"
                            />
                        </div>
                        <button className="h-18 px-10 bg-white text-slate-950 font-black rounded-3xl text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-600 hover:text-foreground hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group/deploy">
                            <Plus size={24} className="group-hover/deploy:rotate-90 transition-transform duration-500" />
                            Initialize
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* Matrix View Layout */}
            <div className="flex-1 flex gap-10 bg-white/40 backdrop-blur-3xl rounded-[3rem] sm:rounded-[4rem] overflow-hidden border border-slate-100 shadow-[0_60px_120px_rgba(0,0,0,0.04)] relative min-h-0">
                <div className={`${selectedChat ? 'hidden lg:block' : 'block'} w-full lg:w-[450px] h-full border-r border-slate-100 relative z-10`}>
                    <ChatSidebar
                        onSelectChat={setSelectedChat}
                        activeChatId={selectedChat?.id}
                        initialChatId={initialChatId}
                        refreshTrigger={refreshSidebar}
                    />
                </div>

                <div className={`${selectedChat ? 'block' : 'hidden lg:flex'} flex-1 h-full bg-slate-50/20 relative z-10`}>
                    <ChatWindow
                        chat={selectedChat}
                        onBack={handleBack}
                        onChatUpdated={handleChatUpdate}
                    />
                </div>
                
                {/* Visual Glitch Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/2 to-transparent pointer-events-none" />
            </div>

            {/* Neural System Log Footer */}
            <div className="py-6 flex flex-col items-center gap-6 shrink-0">
                <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="h-full w-12 bg-indigo-600" 
                    />
                </div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.8em] animate-pulse">End-to-End Quantum Encryption Protocol // SYNC 100%</p>
            </div>
        </motion.div>
    );
};

const MetricPill = ({ label, value, color, bg }) => (
    <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border border-white/5 ${bg} ${color} shadow-lg backdrop-blur-3xl transition-all hover:scale-105`}>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{label}</span>
        <span className="text-lg font-black tracking-tighter leading-none">{value}</span>
    </div>
);

export default ChatPage;
