import React, { useState, useRef, useEffect, useMemo } from "react";
import { MessageCircle, X, Search, ChevronRight, HelpCircle, User, FileText, Calendar, Info, Loader2, Send, Mail, ChevronLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@pdi/hooks/useAuth";
import { guideArticles, searchGuide, QUICK_TIPS, GuideArticle, PROACTIVE_INSIGHTS, Insight, QUICK_ACTIONS } from "../data/guideContent";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Sparkles, Bell, ArrowRight } from "lucide-react";
import api from "@pdi/lib/api";
import { useAIContext } from "@pdi/contexts/AIContext";

export function EkyaGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeArticle, setActiveArticle] = useState<GuideArticle | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [animateIn, setAnimateIn] = useState(true);
    const [showGreeting, setShowGreeting] = useState(false);
    const [unreadInsight, setUnreadInsight] = useState<Insight | null>(null);
    const { contextData } = useAIContext();
    
    // Unified State
    const [view, setView] = useState<'home' | 'chat' | 'article'>('home');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hello! I'm your PDI AI Assistant. How can I help you today with your instructional growth or data analysis?" }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isAILoading, setIsAILoading] = useState(false);

    // Draggable state
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);
    const isPointerDown = useRef(false);

    useEffect(() => {
        const handleResize = () => {
            setPosition(prev => ({
                x: Math.min(prev.x, window.innerWidth - 80),
                y: Math.min(prev.y, window.innerHeight - 80)
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePointerDown = (e: React.PointerEvent) => {
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        hasMoved.current = false;
        isPointerDown.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isPointerDown.current) return;

        const deltaX = Math.abs(e.clientX - (dragStart.current.x + position.x));
        const deltaY = Math.abs(e.clientY - (dragStart.current.y + position.y));

        // Threshold to distinguish between click and drag (standard 5-8 pixels)
        if (!isDragging && (deltaX > 8 || deltaY > 8)) {
            setIsDragging(true);
            hasMoved.current = true;
        }

        if (isDragging) {
            const newX = e.clientX - dragStart.current.x;
            const newY = e.clientY - dragStart.current.y;
            
            const boundedX = Math.max(10, Math.min(newX, window.innerWidth - 70));
            const boundedY = Math.max(10, Math.min(newY, window.innerHeight - 70));
            
            setPosition({ x: boundedX, y: boundedY });
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isPointerDown.current = false;
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    const handleButtonClick = () => {
        if (!hasMoved.current) {
            setIsOpen(!isOpen);
            setShowGreeting(false);
        }
    };

    // Initial Welcome Animation & Greeting
    useEffect(() => {
        // Find a relevant proactive insight for this role
        const relevantRole = user?.role || "TEACHER";
        const insight = PROACTIVE_INSIGHTS.find(i => i.role.includes(relevantRole as any));
        if (insight) setUnreadInsight(insight);

        const timer = setTimeout(() => {
            setAnimateIn(false);
            setShowGreeting(true);
        }, 2000); // Trigger greeting after a few jumps

        const hideTimer = setTimeout(() => {
            setShowGreeting(false);
        }, 8000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Role & Route-specific tips
    const role = user?.role || "TEACHER";
    const currentPath = location.pathname;

    const tips = useMemo(() => {
        const allTips = QUICK_TIPS[role as keyof typeof QUICK_TIPS] || QUICK_TIPS.TEACHER;
        // Sort tips: put those matching the current route first
        return [...allTips].sort((a, b) => {
            const aMatch = (a as any).route === currentPath;
            const bMatch = (b as any).route === currentPath;
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }, [role, currentPath]);

    // Search Results (Articles)
    const searchResults = searchQuery.trim()
        ? searchGuide(searchQuery, user?.role)
        : [];

    // Quick Actions Search
    const quickActionResults = searchQuery.trim()
        ? QUICK_ACTIONS.filter(action => {
            if (action.roles && user?.role && !action.roles.includes(user.role)) return false;
            const normalizedQuery = searchQuery.toLowerCase().trim();
            return action.title.toLowerCase().includes(normalizedQuery) ||
                action.keywords.some(k => k.toLowerCase().includes(normalizedQuery));
        })
        : [];

    const handleActionExecution = (actionId: string, actionTitle: string) => {
        setIsTyping(true);
        setActiveArticle(null);
        setSearchQuery("");
        setUnreadInsight(null);

        // Simulate execution
        setTimeout(() => {
            // Create a fake article to show success
            setActiveArticle({
                id: "temp-success",
                title: "Action Completed",
                keywords: [],
                content: `
                    <div style="text-align: center; padding: 20px 0;">
                        <div style="background: #e6f4ea; color: #1e8e3e; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h3 style="margin-bottom: 8px;">Success!</h3>
                        <p style="color: #666;">I have successfully completed: <br/><strong>${actionTitle}</strong></p>
                        ${actionId === 'action-form-assistant' ? '<p style="margin-top: 16px; font-size: 13px; color: #EA104A; cursor: pointer; text-decoration: underline;">Click here to view your Application</p>' : ''}
                    </div>
                `
            });
            setIsTyping(false);
        }, 1500);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isAILoading) return;

        const userMessage = chatInput.trim();
        setChatInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsAILoading(true);
        setView('chat');

        try {
            const context = {
                pageTitle: document.title,
                url: location.pathname,
                data: contextData // From context
            };

            const response = await api.post('/ai/chat', {
                message: userMessage,
                history: messages,
                context
            });

            if (response.data?.status === 'success') {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.data.content }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsAILoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: "Chat cleared. How else can I assist you?" }]);
    };

    // Reset view when closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSearchQuery("");
                setActiveArticle(null);
                setView('home');
            }, 300);
        }
    }, [isOpen]);

    const handleOpenArticle = (articleId: string) => {
        const article = guideArticles.find(a => a.id === articleId);
        if (article) {
            setIsTyping(true);
            setActiveArticle(null);
            setSearchQuery("");
            setView('article');

            setTimeout(() => {
                setActiveArticle(article);
                setIsTyping(false);
            }, 800);
        }
    };

    // Typewriter Sub-component
    const TypewriterContent = ({ html }: { html: string }) => {
        const [displayedHtml, setDisplayedHtml] = useState("");
        const fullText = html;

        useEffect(() => {
            let i = 0;
            const interval = setInterval(() => {
                // If we land inside a tag, jump to the end of it
                if (fullText[i] === '<') {
                    const tagEnd = fullText.indexOf('>', i);
                    if (tagEnd !== -1) i = tagEnd;
                }

                setDisplayedHtml(fullText.slice(0, i + 1));
                i += 5; // Slower, smoother speed
                if (i >= fullText.length) clearInterval(interval);
            }, 15);
            return () => clearInterval(interval);
        }, [fullText]);

        return <div dangerouslySetInnerHTML={{ __html: displayedHtml }} />;
    };

    // Don't show on landing or login page
    if (location.pathname === "/" || location.pathname === "/login") return null;

    return (
        <>
            {/* Floating Action Button */}
            <div
                className={`fixed z-[9999] ${isOpen ? 'pointer-events-none' : ''}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    ...(animateIn ? { animation: 'jumpUp 2s ease-in-out' } : {})
                }}
            >
                <style>
                    {`
                        @keyframes jumpUp {
                            0%, 100% { transform: translateY(0); }
                            25% { transform: translateY(-30px); }
                            50% { transform: translateY(0); }
                            75% { transform: translateY(-15px); }
                        }
                    `}
                </style>

                {/* Greeting Bubble */}
                {showGreeting && !isOpen && (
                    <div className="absolute bottom-full right-0 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pointer-events-none">
                        <div className="bg-white text-foreground px-4 py-2 rounded-2xl shadow-2xl border border-primary/20 whitespace-nowrap relative ring-1 ring-black/5">
                            <p className="text-sm font-bold flex items-center gap-2">
                                Hello {role.charAt(0) + role.slice(1).toLowerCase()}! 👋
                            </p>
                            <div className="absolute top-full right-6 w-3 h-3 bg-white border-r border-b border-primary/20 rotate-45 -translate-y-1.5 shadow-sm"></div>
                        </div>
                    </div>
                )}

                <button
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onClick={handleButtonClick}
                    style={{
                        cursor: isDragging ? 'grabbing' : 'grab',
                        touchAction: 'none'
                    }}
                    className={`
            flex items-center justify-center w-14 h-14 transition-all duration-300 ease-in-out
            ${isOpen ? 'rotate-90 scale-90 opacity-0' : 'hover:scale-110 active:scale-95'}
          `}
                    aria-label="Open Ekya AI Assistant"
                >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-xl border border-white/40 flex items-center justify-center hover:shadow-2xl transition-shadow ring-4 ring-primary/10 relative">
                        <img src="/robot-logo-clean.png" alt="Ekya Robot Guide" className="w-full h-full object-cover scale-110" />
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
                    </div>
                    {(unreadInsight || messages.length > 1) && !isOpen && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-primary border-2 border-white rounded-full animate-bounce shadow-sm"></span>
                    )}
                </button>
            </div>

            {/* Chatbot Window */}
            <div
                className={`
          fixed bottom-6 right-6 z-[10000] w-full sm:w-[400px] h-[600px] max-h-[85vh] 
          bg-backgroundackground/95 backdrop-blur-xl border border-muted/50 rounded-2xl shadow-2xl
          flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 pointer-events-none translate-y-10'}
        `}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground shrink-0 rounded-t-2xl shadow-inner border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-white p-0.5 rounded-full overflow-hidden shadow-sm shrink-0 w-10 h-10 flex items-center justify-center border border-white/20">
                            <img src="/robot-logo-clean.png" alt="Ekya Robot Guide Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight tracking-tight">Ekya AI Assistant</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <p className="text-primary-foreground/80 text-[10px] uppercase font-bold tracking-widest">Unified Global Help</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                        {(view !== 'home' || searchQuery) && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (view !== 'home') setView('home');
                                    setSearchQuery("");
                                    setActiveArticle(null);
                                }}
                                className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                                aria-label="Go back"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full h-10 w-10 flex items-center justify-center shrink-0"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-h-0 relative">
                    
                    {/* HOME VIEW */}
                    {view === 'home' && !activeArticle && (
                        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-primary/5 to-background animate-in fade-in duration-500">
                            {/* Proactive Insights Banner */}
                            {unreadInsight && (
                                <div className="mx-6 mt-6 p-2 pr-4 rounded-full bg-white border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                                    {/* Decorative background element */}
                                    <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                                        <Sparkles className="w-28 h-28 text-primary rotate-12" />
                                    </div>
                                    
                                    <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center shadow-inner ${unreadInsight.type === 'milestone' ? 'bg-yellow-500/10 text-yellow-600' :
                                        unreadInsight.type === 'deadline' ? 'bg-red-500/10 text-red-600' :
                                            'bg-backgroundlue-500/10 text-blue-600'
                                        }`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 py-2">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                                            {unreadInsight.title}
                                        </p>
                                        <p className="text-sm text-foreground/80 font-bold leading-snug">
                                            {unreadInsight.description}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setUnreadInsight(null)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/10 hover:text-foreground transition-colors shrink-0 relative z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="p-6 shrink-0">
                                <h4 className="text-2xl font-black tracking-tight mb-1">
                                    Morning Briefing ☀️
                                </h4>
                                <p className="text-muted-foreground text-xs font-medium mb-6">
                                    Hi {user?.fullName?.split(' ')[0] || 'Educator'}, how can I assist you?
                                </p>

                                {/* Central Action Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button 
                                        onClick={() => setView('chat')}
                                        className="flex flex-col items-center justify-center p-4 bg-primary text-foreground rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform group"
                                    >
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold">Ask AI Mentor</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const searchInput = document.getElementById('unified-search') as HTMLInputElement;
                                            if (searchInput) searchInput.focus();
                                        }}
                                        className="flex flex-col items-center justify-center p-4 bg-white border border-primary/10 rounded-2xl shadow-sm hover:border-primary/30 transition-all hover:bg-primary/5"
                                    >
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2 text-primary">
                                            <HelpCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-foreground">Platform Navigation</span>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="unified-search"
                                        placeholder="Search platform navigation..."
                                        className="pl-9 bg-white border-primary/10 focus-visible:ring-primary shadow-sm h-11 rounded-xl"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {!searchQuery && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Suggested for You</h5>
                                            <div className="h-px flex-1 bg-muted/30 ml-3" />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {tips.map((tip, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleOpenArticle(tip.articleId)}
                                                    className="bg-white border border-muted hover:border-primary/50 hover:bg-primary/5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    {tip.label}
                                                    <ChevronRight className="w-3 h-3 text-primary" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Results / Content logic stays similar but inside view scope */}
                            {isTyping && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-50">Preparing Navigation...</p>
                                </div>
                            )}

                            {searchQuery && (
                                <ScrollArea className="flex-1 px-6 pb-6">
                                    {(searchResults.length > 0 || quickActionResults.length > 0) ? (
                                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                                            {quickActionResults.length > 0 && (
                                                <div>
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-3 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4" />
                                                        Automations
                                                    </h5>
                                                    <div className="space-y-2">
                                                        {quickActionResults.map(action => (
                                                            <button
                                                                key={action.id}
                                                                onClick={() => handleActionExecution(action.id, action.title)}
                                                                className="w-full bg-white border border-primary/10 p-4 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all text-left group flex items-start justify-between shadow-sm"
                                                            >
                                                                <div className="flex items-start gap-4">
                                                                    <div className="bg-primary p-2 rounded-lg shrink-0 text-foreground shadow-sm">
                                                                        <Sparkles className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-sm leading-tight text-foreground mb-1">{action.title}</p>
                                                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Run with Assistant</p>
                                                                    </div>
                                                                </div>
                                                                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Help Articles Render logic */}
                                            {searchResults.length > 0 && (
                                                <div>
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Help Articles</h5>
                                                    <div className="space-y-2">
                                                        {searchResults.map((article) => (
                                                            <button
                                                                key={article.id}
                                                                onClick={() => handleOpenArticle(article.id)}
                                                                className="w-full bg-white border border-muted/50 p-4 rounded-xl hover:border-primary hover:shadow-md transition-all text-left flex items-start gap-4"
                                                            >
                                                                <div className="bg-primary/5 p-2 rounded-full shrink-0 text-primary">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <p className="font-bold text-sm leading-tight text-foreground">{article.title}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Fallback / Support form logic */
                                        <div className="text-center py-6 opacity-50 flex flex-col items-center">
                                            <Search className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-xs font-bold italic">No exact matches for "{searchQuery}"</p>
                                            <Button variant="link" onClick={() => setView('chat')} className="mt-2 text-primary">Ask the AI Mentor instead →</Button>
                                        </div>
                                    )}
                                </ScrollArea>
                            )}
                        </div>
                    )}

                    {/* AI CHAT VIEW */}
                    {view === 'chat' && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white animate-in slide-in-from-right duration-500">
                            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                                                msg.role === 'user' 
                                                ? 'bg-primary text-foreground rounded-tr-none' 
                                                : 'bg-slate-100 text-foreground rounded-tl-none border border-slate-200 shadow-sm'
                                            }`}>
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isAILoading && (
                                        <div className="flex justify-start animate-pulse">
                                            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200">
                                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            
                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        placeholder="Type your question..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="rounded-xl border-slate-200 focus-visible:ring-primary h-11"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        size="icon"
                                        disabled={isAILoading || !chatInput.trim()}
                                        className="rounded-xl bg-primary hover:bg-primary-dark shrink-0 w-11 h-11 shadow-lg shadow-primary/20"
                                    >
                                        <Send className="w-4 h-4 text-foreground" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between mt-3 px-1">
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">AI may produce inaccuracies</p>
                                    <button onClick={clearChat} className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Clear Chat</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ARTICLE VIEW */}
                    {view === 'article' && activeArticle && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white animate-in zoom-in-95 duration-300">
                            <div className="p-4 border-b border-muted/30 bg-muted/5 shrink-0 flex items-center justify-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Platform Article</span>
                            </div>

                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black tracking-tight leading-tight uppercase underline decoration-primary/20 decoration-4 underline-offset-4">
                                        {activeArticle.title}
                                    </h2>
                                    <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed font-medium">
                                        <TypewriterContent html={activeArticle.content} />
                                    </div>
                                    <div className="pt-8 mt-8 border-t border-dashed border-muted flex flex-col items-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Still stuck?</p>
                                        <Button 
                                            onClick={() => {
                                                setChatInput(`I need more help with: ${activeArticle.title}`);
                                                setView('chat');
                                            }}
                                            className="w-full rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-bold"
                                        >
                                            Talk to AI Mentor about this
                                        </Button>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
