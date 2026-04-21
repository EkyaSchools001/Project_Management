import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Layout, Shield, Target, Activity, Terminal, AlertTriangle, Cpu, Command, ChevronRight } from 'lucide-react';
// import api from '../../../services/api';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingChatbot = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState(() => {
        const saved = localStorage.getItem('chatbot-position');
        return saved ? JSON.parse(saved) : { x: window.innerWidth - 100, y: window.innerHeight - 100 };
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasDragged, setHasDragged] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! I am your AI System Assistant. How can I help you navigate the hub today?', sender: 'bot', type: 'options' }
    ]);
    const [inputText, setInputText] = useState('');
    const [mode, setMode] = useState('OPTIONS');
    // const [ticketForm, setTicketForm] = useState({ title: '', description: '', campus: '', category: '', priority: 'LOW' });
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('chatbot-position', JSON.stringify(position));
    }, [position]);

    const handlePointerDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        setHasDragged(false);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const boundedX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 80));
        const boundedY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 80));
        setPosition({ x: boundedX, y: boundedY });
        setHasDragged(true);
    };

    const handlePointerUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        } else {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging]);

    const addMessage = (text, sender = 'bot', type = 'text') => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender, type }]);
    };

    const handleOptionClick = async (option) => {
        addMessage(option, 'user');
        if (option.includes('Status')) {
            setMode('TICKET_LOOKUP');
            setTimeout(() => addMessage('I can find the status for you. Please enter the ticket ID or reference code:', 'bot', 'status-choice'), 500);
        } else if (option.includes('New Ticket')) {
            setMode('RAISING_TICKET_TITLE');
            setTimeout(() => addMessage('Understood. What is the main subject or title for this ticket?', 'bot'), 500);
        } else {
            setTimeout(() => addMessage('Connecting you to a specialized support node...', 'bot'), 500);
        }
    };

    const handleStatusChoice = (choice) => {
        if (choice === 'ID') {
            setMode('AWAITING_ID');
            addMessage('Please enter your 8-digit alpha-numeric ticket ID:', 'bot');
        } else {
            addMessage('Accessing your recent interaction ledger...', 'bot');
            setTimeout(() => addMessage('I could not find any active tickets associated with your current session.', 'bot'), 1000);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        const text = inputText;
        setInputText('');
        addMessage(text, 'user');

        if (mode === 'AWAITING_ID') {
            addMessage(`Querying database for session ID ${text.toUpperCase()}...`, 'bot');
            setTimeout(() => addMessage('Verification failed. The specified ID does not exist in the active registry. Try again?', 'bot'), 1500);
        } else if (mode === 'RAISING_TICKET_TITLE') {
            // setTicketForm(prev => ({ ...prev, title: text }));
            setMode('RAISING_TICKET_DESC');
            setTimeout(() => addMessage('Perfect. Now, please provide a detailed description of the issue:', 'bot'), 500);
        } else if (mode === 'RAISING_TICKET_DESC') {
            // setTicketForm(prev => ({ ...prev, description: text }));
            setMode('SUBMITTING');
            addMessage('Committing your report to the global support queue...', 'bot');
            setTimeout(() => {
                addMessage('Submission successful. Your interaction is logged as ID BT-8892.', 'bot');
                setMode('OPTIONS');
                setTimeout(() => addMessage('How else can I assist you with your operations?', 'bot', 'options'), 500);
            }, 2000);
        }
    };

    return (
        <>
            <motion.div
                onPointerDown={handlePointerDown}
                onClick={() => !hasDragged && setIsOpen(!isOpen)}
                style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: 9999, position: 'fixed', touchAction: 'none' }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                className={clsx(
                    "w-16 h-16 rounded-3xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all border border-white/20 bg-neutral-800 text-foreground shadow-2xl shadow-brand-500/30",
                    isDragging && "scale-110 opacity-70 rotate-0"
                )}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
                        className="fixed bottom-24 right-8 w-96 h-[600px] bg-[#111c2a] rounded-3xl border border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[9998] overflow-hidden flex flex-col"
                    >
                        <header className="p-6 flex items-center justify-between border-b border-gray-50 bg-[#111c2a]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-backgroundackgroundrand-50 text-brand-600 rounded-xl flex items-center justify-center border border-brand-100">
                                    <Cpu size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-neutral-300 uppercase tracking-tight leading-none mb-1">System Assistant</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-backgroundmerald-500 animate-pulse"></div>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Link</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:bg-[#0f172a] rounded-lg transition-all"><X size={20} /></button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#0f172a]/30">
                            {messages.map((m) => (
                                <div key={m.id} className={clsx("flex flex-col", m.sender === 'user' ? "items-end" : "items-start")}>
                                    <div className={clsx(
                                        "max-w-[85%] p-4 text-xs font-medium leading-relaxed rounded-2xl shadow-sm transition-all",
                                        m.sender === 'user'
                                            ? "bg-neutral-800 text-foreground rounded-tr-none"
                                            : "bg-[#111c2a] text-neutral-300 rounded-tl-none border border-neutral-800"
                                    )}>
                                        {m.text}
                                    </div>
                                    {m.type === 'options' && !isDragging && (
                                        <div className="mt-4 flex flex-col gap-2 w-full">
                                            {['Raise New Support Ticket', 'Check Global Status', 'Personnel Inquiry'].map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleOptionClick(opt)}
                                                    className="w-full p-4 bg-[#111c2a] border border-neutral-800 rounded-xl hover:border-brand-500 hover:bg-backgroundackgroundrand-50 hover:text-brand-600 transition-all text-left text-[10px] font-black uppercase tracking-widest flex items-center justify-between group shadow-sm"
                                                >
                                                    {opt}
                                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-500 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {m.type === 'status-choice' && (
                                        <div className="mt-4 flex flex-col gap-2 w-full">
                                            <button onClick={() => handleStatusChoice('ID')} className="w-full p-4 bg-[#111c2a] border border-neutral-800 rounded-xl hover:border-brand-500 hover:bg-backgroundackgroundrand-50 hover:text-brand-600 text-left text-[10px] font-black uppercase tracking-widest shadow-sm">Enter Reference ID</button>
                                            <button onClick={() => handleStatusChoice('RECENT')} className="w-full p-4 bg-[#111c2a] border border-neutral-800 rounded-xl hover:border-brand-500 hover:bg-backgroundackgroundrand-50 hover:text-brand-600 text-left text-[10px] font-black uppercase tracking-widest shadow-sm">Recall Latest Session</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="p-4 border-t border-gray-50 bg-[#111c2a] flex gap-3">
                            <div className="flex-1 relative flex items-center">
                                <Command className="absolute left-4 text-gray-300 w-4 h-4" />
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full pl-11 pr-4 h-12 bg-[#0f172a] rounded-xl border border-neutral-800 text-xs font-bold focus:bg-[#111c2a] focus:border-brand-500 outline-none transition-all"
                                />
                            </div>
                            <button type="submit" className="w-12 h-12 bg-neutral-800 text-foreground rounded-xl flex items-center justify-center hover:bg-backgroundackgroundrand-700 shadow-lg shadow-brand-500/20 active:scale-90 transition-all">
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingChatbot;
