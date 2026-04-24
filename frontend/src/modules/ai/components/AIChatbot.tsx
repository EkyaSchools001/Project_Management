// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Zap, ChevronRight, Clock, FileText, ListTodo, Calendar } from 'lucide-react';
import { aiService } from '../../../services/ai.service';

const QUICK_ACTIONS = [
    { icon: ListTodo, label: 'Tasks', path: '/pms/tasks' },
    { icon: Calendar, label: 'Calendar', path: '/pms/calendar' },
    { icon: FileText, label: 'Reports', path: '/pms/reports' },
    { icon: Zap, label: 'Projects', path: '/pms/projects' }
];

const SUGGESTED_QUESTIONS = [
    'Show my tasks',
    'Schedule a meeting',
    'Create a project',
    'View reports'
];

export default function AIChatbot({ isOpen, onClose, embedded = false }) {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I'm your AI assistant. I can help you manage tasks, projects, meetings, and more. How can I assist you today?",
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await aiService.chatbot(userMessage.content);
            
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message,
                timestamp: response.timestamp || new Date().toISOString(),
                action: response.action,
                path: response.path
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (path) => {
        window.location.href = path;
    };

    const handleSuggestedQuestion = (question) => {
        setInput(question);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const containerClass = embedded 
        ? 'h-full flex flex-col' 
        : 'fixed bottom-6 right-6 z-50 w-[380px] h-[500px] bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden';

    if (!isOpen && !embedded) return null;

    return (
        <div className={containerClass}>
            {!embedded && (
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161B22]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#ef4444]/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-[#ef4444]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-foreground">AI Assistant</h3>
                            <p className="text-[10px] text-foreground/40">Online</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-foreground/40 hover:text-foreground hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div 
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-xl bg-[#ef4444]/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-[#ef4444]" />
                            </div>
                        )}
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`p-3 rounded-2xl text-sm ${
                                msg.role === 'user' 
                                    ? 'bg-[#ef4444] text-black' 
                                    : 'bg-white/10 text-foreground'
                            }`}>
                                {msg.content}
                            </div>
                            <p className="text-[10px] text-foreground/30 mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-foreground" />
                            </div>
                        )}
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#ef4444]/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-[#ef4444]" />
                        </div>
                        <div className="bg-white/10 rounded-2xl p-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
                <div className="px-4 pb-2">
                    <p className="text-[10px] text-foreground/30 mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestedQuestion(q)}
                                className="px-3 py-1.5 text-xs text-foreground/60 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#ef4444]/50"
                            disabled={loading}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="p-3 bg-[#ef4444] text-black rounded-xl hover:bg-[#ef4444]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function FloatingChatbotButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#ef4444] rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-40"
        >
            <MessageCircle className="w-6 h-6 text-black" />
        </button>
    );
}