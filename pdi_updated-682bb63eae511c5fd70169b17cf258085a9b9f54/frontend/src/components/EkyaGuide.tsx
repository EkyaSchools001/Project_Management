import React, { useState, useRef, useEffect, useMemo } from "react";
import { MessageCircle, X, Search, ChevronRight, HelpCircle, User, FileText, Calendar, Info, Loader2, Send, Mail, ChevronLeft, Clipboard, Mic, Waves } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { guideArticles, searchGuide, QUICK_TIPS, GuideArticle, PROACTIVE_INSIGHTS, Insight, QUICK_ACTIONS } from "../data/guideContent";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Sparkles, Bell, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAIContext } from "@/contexts/AIContext";
import { GuidedObservationForm } from "./educator-hub/GuidedObservationForm";

import { useVoiceConversation } from "@/hooks/useVoiceConversation";

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
    const navigate = useNavigate();
    
    // Voice & Aira Identity State
    const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(false);
    const [isAiraListening, setIsAiraListening] = useState(false);
    const hasGreetedRef = useRef(false);

    // Unified State
    interface AiraMessage {
        role: 'user' | 'assistant';
        content: string;
        type?: 'TEXT' | 'OBSERVATION_DRAFT' | 'GUIDED_OBSERVATION' | 'NAVIGATE' | 'FORM_CONFIRMATION' | 'NAV_PREVIEW' | 'SEARCH_RESULT';
        payload?: any;
    }

    const [view, setView] = useState<'home' | 'chat' | 'article'>('home');
    const [messages, setMessages] = useState<AiraMessage[]>([
        { role: 'assistant', content: "Hello! I'm Aira, your PDI AI Assistant. How can I help you today?", type: 'TEXT' }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isAILoading, setIsAILoading] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    // Voice Hook Integration
    const { speak, isMobile, interimTranscript, voiceTranscript, isProcessing, isActivelyListening, startListening, stopListening } = useVoiceConversation({
        enabled: isVoiceModeEnabled,
        onWakeWordDetected: () => {
            setIsOpen(true);
            setView('chat');
            setIsAiraListening(true);
        },
        onSpeechDetected: (text) => {
            handleVoiceCommand(text);
        },
        onListeningStateChange: (listening) => {
            // Keep listening overlay active if we are processing a command
            if (!listening && isProcessing) return;
            setIsAiraListening(listening);
        }
    });

    // Push-to-talk: mic button handler — NO full-screen overlay
    const handleMicButtonClick = () => {
        if (isActivelyListening) {
            stopListening();
        } else {
            setView('chat');
            startListening();
        }
    };

    // AIRA: Real-time Transcript Mirroring (Types as you speak)
    useEffect(() => {
        if ((isAiraListening || isActivelyListening) && voiceTranscript.trim()) {
            setChatInput(voiceTranscript);
        }
    }, [voiceTranscript, isAiraListening, isActivelyListening]);

    // AIRA: Personalized greeting when voice mode is activated
    useEffect(() => {
        if (!isOpen) return;
        if (hasGreetedRef.current) return;

        const triggerGreeting = async () => {
            const firstName = user?.fullName?.split(' ')[0] || "Friend";
            try {
                // Fetch proactive insights if this is the start of a session
                const response = await api.get('/ai/proactive-insight');
                const { greeting } = response.data.data;
                const fullGreeting = `Hi ${firstName}! ${greeting}`;
                
                // Add the greeting to the chat
                setMessages([{ role: 'assistant', content: fullGreeting, type: 'TEXT' }]);
                
                // Speak the greeting
                speak(fullGreeting);
                hasGreetedRef.current = true;
            } catch (err) {
                // Fallback to standard greeting
                const standardGreeting = `Hi ${firstName}! I'm Aira, your मास्टर (Master) Assistant. How can I help you today?`;
                setMessages([{ role: 'assistant', content: standardGreeting, type: 'TEXT' }]);
                speak(standardGreeting);
                hasGreetedRef.current = true;
            }
        };

        triggerGreeting();
    }, [isOpen, user?.fullName, speak]);

    useEffect(() => {
        if (!isVoiceModeEnabled) {
            // Aggressive Stop when toggled off manually
            stopListening();
            hasGreetedRef.current = false; // Reset for next time they enable it
        }
    }, [isVoiceModeEnabled, stopListening]);

    const handleFormSubmit = async (formType: string, payload: any) => {
        setIsFormSubmitting(true);
        try {
            let endpoint = '';
            let finalPayload = { ...payload };

            switch (formType) {
                case 'OBSERVATION':
                    endpoint = '/observations';
                    finalPayload = {
                        teacherEmail: payload.teacherEmail || payload.email,
                        date: new Date().toISOString(),
                        score: Number(payload.score || 0),
                        notes: payload.notes || '',
                        strengths: payload.strengths || '',
                        areasOfGrowth: payload.areasOfGrowth || '',
                        domain: payload.domain || 'General Instruction',
                        status: 'SUBMITTED'
                    };
                    break;
                case 'GOAL':
                    endpoint = '/goals';
                    finalPayload = {
                        title: payload.title,
                        description: payload.description,
                        dueDate: payload.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        category: payload.category || 'Professional Growth'
                    };
                    break;
                case 'PD_LOG':
                    endpoint = '/pd-hours';
                    finalPayload = {
                        activity: payload.activity,
                        hours: Number(payload.hours || 0),
                        category: payload.category || 'Professional Development',
                        status: 'APPROVED'
                    };
                    break;
                case 'MEETING_MOM':
                    endpoint = '/meetings/mom/draft'; // Using a draft endpoint if exists, or general mom
                    finalPayload = {
                        meetingTitle: payload.meetingTitle,
                        objective: payload.objective,
                        agendaPoints: payload.agendaPoints,
                        discussionSummary: payload.discussionSummary,
                        decisions: payload.decisions
                    };
                    break;
                default:
                    // Generic fallback for other types
                    endpoint = `/${formType.toLowerCase()}s`;
            }

            const response = await api.post(endpoint, finalPayload);
            if (response.data.status === 'success') {
                toast.success(`${formType.replace('_', ' ')} posted successfully!`);
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: `Done! I've successfully saved that **${formType.toLowerCase().replace('_', ' ')}** to the database for you.`,
                    type: 'TEXT' 
                }]);
            }
        } catch (err: any) {
            console.error("Form submission error:", err);
            toast.error(`Could not submit ${formType}. Please verify the details.`);
        } finally {
            setIsFormSubmitting(false);
        }
    };

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

    const handleSendMessage = async (textOverride?: string) => {
        const userMessage = textOverride || chatInput.trim();
        if (!userMessage.trim()) return;

        setChatInput("");
        const newMessage: AiraMessage = { role: 'user', content: userMessage, type: 'TEXT' };
        setMessages(prev => [...prev, newMessage]);
        setSearchQuery("");
        setChatInput("");

        // FAST-TRACK NAVIGATION: Match direct voice commands locally to skip AI delay
        if (isVoiceModeEnabled) {
            const navMap = {
                "/okr": ["progress dashboard", "progress", "okr", "goals"],
                "/leader/performance": ["performance metrics", "performance dashboard", "kpi"],
                "/leader/growth": ["observations", "feedback", "teacher growth", "growth analytics"],
                "/leader/team": ["team overview", "my team", "team management", "staff list"],
                "/leader/attendance": ["attendance register", "attendance", "records", "present"],
                "/leader/meetings": ["meeting calendar", "schedule", "mom", "minutes"],
                "/teacher/portfolio": ["my portfolio", "achievements", "evidence"],
                "/teacher/mooc": ["mooc", "external courses", "certification"],
                "/educator-hub/institutional-identity": ["institutional identity", "school identity", "philosophy", "vision"],
                "/educator-hub/interactions": ["interactions", "ptil", "parent log"],
                "/educator-hub/academic-operations": ["academic operations", "ops", "school ops"],
                "/educator-hub/pedagogy-learning": ["pedagogy", "learning approach", "curriculum"],
                "/admin/users": ["user management", "manage users", "staff accounts"]
            };

            const lowerMsg = userMessage.toLowerCase();
            for (const [path, keywords] of Object.entries(navMap)) {
                if (keywords.some(k => lowerMsg.includes(k))) {
                    console.log("Aira: Fast-Track Navigation triggered for:", path);
                    const pageName = keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1);
                    const navMessage = `Sure! I'm taking you to **${pageName}** now.`;
                    setMessages(prev => [...prev, { role: 'assistant', content: navMessage, type: 'TEXT' }]);
                    setView('chat');
                    speak(`Sure! I'm taking you to ${pageName} now.`);
                    // Delay navigation so user sees the confirmation message
                    setTimeout(() => {
                        navigate(path);
                        setIsOpen(false);
                    }, 1500);
                    return; // EXIT EARLY - Skip AI call
                }
            }
        }

        setIsAILoading(true);
        setView('chat');

        try {
            // PROJECT KNOWLEDGE: Dynamic navigation map based on role
            const navMap = {
                TEACHER: [
                    { name: "Dashboard Overview", path: "/teacher" },
                    { name: "Progress Dashboard", path: "/okr" },
                    { name: "My Portfolio", path: "/portfolio" },
                    { name: "Observations", path: "/teacher/observations" },
                    { name: "Goals", path: "/teacher/goals" },
                    { name: "Course Catalogue", path: "/teacher/courses" },
                    { name: "Assessments", path: "/teacher/courses/assessments" },
                    { name: "Learning Festival", path: "/teacher/festival" },
                    { name: "MOOC Evidence", path: "/teacher/mooc" },
                    { name: "Training Calendar", path: "/teacher/calendar" },
                    { name: "Training Hours", path: "/teacher/hours" },
                    { name: "Meetings", path: "/teacher/meetings" },
                    { name: "Survey", path: "/teacher/survey" },
                    { name: "Announcements", path: "/announcements" },
                    { name: "Attendance", path: "/teacher/attendance" },
                    { name: "My Profile", path: "/teacher/profile" },
                    { name: "Educator Hub", path: "/educator-hub/institutional-identity" }
                ],
                LEADER: [
                    { name: "Dashboard Overview", path: "/leader" },
                    { name: "Performance", path: "/leader/performance" },
                    { name: "Progress Dashboard", path: "/okr" },
                    { name: "Portfolio", path: "/portfolio" },
                    { name: "Observations", path: "/leader/growth" },
                    { name: "Goals", path: "/leader/goals" },
                    { name: "Team Overview", path: "/leader/team" },
                    { name: "User Management", path: "/leader/users" },
                    { name: "Course Catalogue", path: "/leader/courses" },
                    { name: "Assessments", path: "/leader/courses/assessments" },
                    { name: "Learning Festival", path: "/leader/festival" },
                    { name: "MOOC Evidence", path: "/leader/mooc" },
                    { name: "TD Participation", path: "/leader/participation" },
                    { name: "Learning Insights", path: "/leader/insights" },
                    { name: "Training Calendar", path: "/leader/calendar" },
                    { name: "Attendance Register", path: "/leader/attendance" },
                    { name: "Meetings", path: "/leader/meetings" },
                    { name: "Reports", path: "/leader/reports" },
                    { name: "Survey", path: "/leader/survey" },
                    { name: "Announcements", path: "/announcements" },
                    { name: "Form Templates", path: "/leader/forms" },
                    { name: "Settings", path: "/leader/settings" },
                    { name: "Educator Hub", path: "/educator-hub/institutional-identity" }
                ],
                ADMIN: [
                    { name: "Dashboard Overview", path: "/admin" },
                    { name: "Progress Dashboard", path: "/okr" },
                    { name: "Portfolio", path: "/portfolio" },
                    { name: "Growth Analytics", path: "/admin/growth-analytics" },
                    { name: "Observations", path: "/admin/growth-analytics" },
                    { name: "Goals", path: "/admin/goals" },
                    { name: "User Management", path: "/admin/users" },
                    { name: "Settings", path: "/admin/settings" },
                    { name: "Form Templates", path: "/admin/forms" },
                    { name: "Course Catalogue", path: "/admin/courses" },
                    { name: "Assessments", path: "/admin/courses/assessments" },
                    { name: "Learning Festival", path: "/admin/festival" },
                    { name: "MOOC Evidence", path: "/admin/mooc" },
                    { name: "Training Calendar", path: "/admin/calendar" },
                    { name: "Training Hours", path: "/admin/hours" },
                    { name: "Attendance Register", path: "/admin/attendance" },
                    { name: "Meetings", path: "/admin/meetings" },
                    { name: "Reports", path: "/admin/reports" },
                    { name: "Survey", path: "/admin/survey" },
                    { name: "Announcements", path: "/announcements" },
                    { name: "Educator Hub", path: "/educator-hub/institutional-identity" }
                ],
                MANAGEMENT: [
                    { name: "Overview", path: "/management/overview" },
                    { name: "Observations", path: "/management/growth-analytics" },
                    { name: "Goals", path: "/management/goals" },
                    { name: "Progress Dashboard", path: "/okr" },
                    { name: "Staff Portfolios", path: "/portfolio" },
                    { name: "PDI Health Index", path: "/management/pdi-health" },
                    { name: "Campus Performance", path: "/management/campus-performance" },
                    { name: "Academic TD Impact", path: "/management/pd-impact" },
                    { name: "Training Hours", path: "/management/hours" },
                    { name: "Assessments", path: "/management/courses/assessments" },
                    { name: "Training Analytics", path: "/management/training-analytics" },
                    { name: "Attendance Logs", path: "/management/attendance" },
                    { name: "Meetings", path: "/management/meetings" },
                    { name: "Survey", path: "/management/survey" },
                    { name: "Announcements", path: "/announcements" },
                    { name: "Educator Hub", path: "/educator-hub/institutional-identity" }
                ]
            };

            const context = {
                pageTitle: document.title,
                url: location.pathname,
                role: role,
                navigationMap: navMap[role as keyof typeof navMap] || navMap.TEACHER,
                data: contextData // From context
            };

            const response = await api.post('/ai/chat', {
                message: userMessage,
                history: messages,
                context
            });

            if (response.data?.status === 'success') {
                const aiData = response.data.data;
                
                // Handle Auto-Navigation
                if (aiData.type === 'NAVIGATE') {
                    console.log("Aira: Auto-Navigation detected for target:", aiData.payload.route);
                    const destName = aiData.payload.title || aiData.payload.route;
                    const navConfirm = `I've taken you to **${destName}**. Let me know if you need anything else!`;
                    setMessages(prev => [...prev, { role: 'assistant', content: navConfirm, type: 'TEXT' }]);
                    if (isVoiceModeEnabled) {
                        speak(`I've taken you to ${destName}.`);
                    }
                    // Delay navigation so user sees the confirmation
                    setTimeout(() => {
                        navigate(aiData.payload.route);
                        setIsOpen(false);
                    }, 1500);
                }

                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: aiData.content,
                    type: aiData.type || 'TEXT',
                    payload: aiData.payload
                }]);

                // VOICE RESPONSE: Speak if voice mode is enabled
                if (isVoiceModeEnabled && aiData.content) {
                    speak(aiData.content.replace(/<[^>]*>/g, '')); // Strip HTML for synthesis
                }
            }
        } catch (error: any) {
            console.error("Aira chat error:", error);
            const serverErr = error?.response?.data?.message || 'I\'m sorry, I encountered an error. Please try again later.';
            setMessages(prev => [...prev, { role: 'assistant', content: serverErr, type: 'TEXT' }]);

            if (isVoiceModeEnabled) speak("I encountered an error. Please try again.");
        } finally {
            setIsAILoading(false);
        }
    };

    // 5. Voice Handshake Logic (Confirmations)
    const handleVoiceCommand = (text: string) => {
        const normalized = text.toLowerCase().trim();
        
        // Check for confirmation intent on cards
        const lastMsg = messages[messages.length - 1];
        const isAwaitingConfirmation = lastMsg?.type === 'NAVIGATE' || lastMsg?.type === 'NAV_PREVIEW' || lastMsg?.type === 'SEARCH_RESULT';
        
        if (isAwaitingConfirmation && (normalized.includes('yes') || normalized.includes('go') || normalized.includes('take me') || normalized.includes('open'))) {
            if (lastMsg.payload?.route) {
                speak("Moving to " + (lastMsg.payload.title || "your selection") + " now.");
                setTimeout(() => {
                    setIsOpen(false);
                    navigate(lastMsg.payload.route);
                }, 800);
                return;
            }
        }

        // Mirror text to input box for visual feedback
        setChatInput(text);

        // Default: Send to AI for processing with a tiny delay to allow the "Typing" feel
        setTimeout(() => {
            handleSendMessage(text);
        }, 150);
    };

    const handleReviewDraft = (payload: any) => {
        // Store in sessionStorage for the form to pick up
        sessionStorage.setItem('ai_observation_draft', JSON.stringify(payload));
        
        // Navigate to the observation form
        const route = role === 'TEACHER' ? '/teacher/observations' : '/leader/growth';
        setIsOpen(false);
        navigate(route);
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
          bg-background/95 backdrop-blur-xl border border-muted/50 rounded-2xl shadow-2xl
          flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 pointer-events-none translate-y-10'}
        `}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground shrink-0 rounded-t-2xl shadow-inner border-b border-white/10 relative overflow-hidden z-[110]">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-white p-0.5 rounded-full overflow-hidden shadow-sm shrink-0 w-10 h-10 flex items-center justify-center border border-white/20">
                            <img src="/robot-logo-clean.png" alt="Ekya Robot Guide Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight tracking-tight">Aira AI Assistant</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <p className="text-primary-foreground/80 text-[10px] uppercase font-bold tracking-widest">Unified Global Help</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsVoiceModeEnabled(!isVoiceModeEnabled)}
                            className={`rounded-full transition-all duration-300 ${isVoiceModeEnabled ? 'bg-white/20 text-white shadow-lg shadow-white/20 ring-4 ring-white/10' : 'text-primary-foreground/60 hover:bg-white/10 hover:text-white border border-transparent'}`}
                            title={isVoiceModeEnabled ? "Hands-free active" : "Enable Hands-free (Hey Aira / Aira)"}
                        >
                             {isVoiceModeEnabled ? (
                                <div className="flex items-center gap-0.5 h-4">
                                    <div className="w-1 h-2 bg-white rounded-full animate-[bounce_1s_infinite]" />
                                    <div className="w-1 h-4 bg-white rounded-full animate-[bounce_1.2s_infinite]" />
                                    <div className="w-1 h-2 bg-white rounded-full animate-[bounce_0.8s_infinite]" />
                                </div>
                            ) : (
                                <Mic className="w-5 h-5" />
                            )}
                        </Button>
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
                    {/* AIRA VOICE LISTENING OVERLAY */}
                    {isAiraListening && (
                        <div className="absolute inset-0 z-[100] bg-primary flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 px-8 text-center">
                             <div className="absolute inset-0 overflow-hidden opacity-10">
                                <Waves className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 animate-[spin_10s_linear_infinite] text-white" />
                            </div>
                            
                            <div className="relative mb-8 text-white">
                                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping scale-150" />
                                <div className="relative bg-white text-primary p-6 rounded-full shadow-2xl flex items-center justify-center gap-1.5 h-20 w-20">
                                    <div className={`w-1.5 bg-primary rounded-full ${isProcessing ? 'h-10 animate-pulse' : 'h-6 animate-[bounce_1s_infinite]'}`} />
                                    <div className={`w-1.5 bg-primary/80 rounded-full ${isProcessing ? 'h-6 animate-pulse delay-75' : 'h-10 animate-[bounce_1.2s_infinite]'}`} />
                                    <div className={`w-1.5 bg-primary rounded-full ${isProcessing ? 'h-10 animate-pulse delay-150' : 'h-6 animate-[bounce_0.8s_infinite]'}`} />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-white mb-2 relative z-10">
                                {isProcessing ? "Aira is Thinking..." : "Aira is Listening"}
                            </h3>
                            
                            {/* LIVE TRANSCRIPTION UI */}
                            <div className="min-h-[60px] flex items-center justify-center mb-4 relative z-10 w-full px-4">
                                {isProcessing ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-white/80 text-sm font-bold uppercase tracking-widest animate-pulse">Analyzing High-Precision Audio</p>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                                            <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-100" />
                                            <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                ) : (
                                    interimTranscript || voiceTranscript ? (
                                        <p className="text-white text-lg font-semibold italic animate-in slide-in-from-bottom-2 leading-tight">
                                            "{interimTranscript || voiceTranscript}..."
                                        </p>
                                    ) : (
                                        <p className="text-white/50 text-sm font-medium animate-pulse">
                                            Go ahead, ask me anything...
                                        </p>
                                    )
                                )}
                            </div>
                            
                            {!isProcessing && (
                                <Button 
                                    variant="ghost"
                                    onClick={() => { stopListening(); setIsAiraListening(false); }}
                                    className="mt-8 text-white/40 hover:text-white hover:bg-white/10 rounded-full px-8 text-xs font-bold uppercase tracking-widest border border-white/20"
                                >
                                    Tap to Stop
                                </Button>
                            )}
                        </div>
                    )}
                    {/* HOME VIEW */}
                    {view === 'home' && !activeArticle && (
                        <ScrollArea className="flex-1 bg-gradient-to-b from-primary/5 to-background animate-in fade-in duration-500">
                            <div className="flex flex-col pb-6 min-h-0">
                            {/* Proactive Insights Banner */}
                            {unreadInsight && (
                                <div className="shrink-0 mx-6 mt-6 p-2 pr-4 rounded-full bg-white border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                                    {/* Decorative background element */}
                                    <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                                        <Sparkles className="w-28 h-28 text-primary rotate-12" />
                                    </div>
                                    
                                    <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center shadow-inner ${unreadInsight.type === 'milestone' ? 'bg-yellow-500/10 text-yellow-600' :
                                        unreadInsight.type === 'deadline' ? 'bg-red-500/10 text-red-600' :
                                            'bg-blue-500/10 text-blue-600'
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
                                        className="flex flex-col items-center justify-center p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform group"
                                    >
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold">Ask Aira AI</span>
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
                                        <span className="text-sm font-bold text-foreground">Aira Navigator</span>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="unified-search"
                                        placeholder="Search platform navigation..."
                                        className="pl-9 bg-white border-primary/10 focus-visible:ring-primary shadow-sm h-11 rounded-xl"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {!searchQuery && (
                                <div className="flex-1">
                                    <div className="space-y-4 px-6 pb-12 pt-2">
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
                                </div>
                            )}

                            {/* Search Results / Content logic stays similar but inside view scope */}
                            {isTyping && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-50">Preparing Navigation...</p>
                                </div>
                            )}

                            {searchQuery && (
                                <div className="flex-1 px-6 pb-6">
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
                                                                    <div className="bg-primary p-2 rounded-lg shrink-0 text-white shadow-sm">
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
                                            <Button variant="link" onClick={() => setView('chat')} className="mt-2 text-primary">Ask Aira instead →</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                            </div>
                        </ScrollArea>
                    )}

                    {/* AI CHAT VIEW */}
                    {view === 'chat' && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white animate-in slide-in-from-right duration-500">
                            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((msg, i) => {
                                        return (
                                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                                                    msg.role === 'user' 
                                                    ? 'bg-primary text-white rounded-tr-none' 
                                                    : 'bg-slate-100 text-foreground rounded-tl-none border border-slate-200 shadow-sm'
                                                }`}>
                                                    <div 
                                                        className="text-sm leading-relaxed whitespace-pre-line"
                                                        dangerouslySetInnerHTML={{ 
                                                            __html: msg.content
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                                .replace(/\* (.*?)\n/g, '• $1\n')
                                                                .replace(/\n/g, '<br />')
                                                        }}
                                                    />
                                                </div>

                                                {/* Guided Observation Form Card */}
                                                {msg.type === 'GUIDED_OBSERVATION' && (
                                                    <div className="mt-3 w-[95%] sm:w-full">
                                                        <GuidedObservationForm 
                                                            initialData={msg.payload}
                                                            onCancel={() => {
                                                                setMessages(prev => [...prev, { role: 'assistant', content: "No problem! Let me know if you need help with anything else.", type: 'TEXT' }]);
                                                            }}
                                                            onComplete={(observation) => {
                                                                setMessages(prev => [...prev, { 
                                                                    role: 'assistant', 
                                                                    content: `✅ Observation submitted successfully for **${observation.teacher}**!`, 
                                                                    type: 'TEXT' 
                                                                }]);
                                                                toast.success("Observation Logged!");
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Specialized Draft Card */}
                                                {msg.type === 'OBSERVATION_DRAFT' && msg.payload && (
                                                    <div className="mt-3 w-[90%] bg-white border border-primary/20 rounded-2xl p-4 shadow-xl shadow-primary/5 animate-in slide-in-from-bottom-2 duration-500">
                                                        <div className="flex items-center gap-3 mb-3 border-b border-primary/5 pb-3">
                                                            <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black uppercase tracking-widest text-primary/60">Observation Draft</p>
                                                                <p className="text-sm font-bold text-foreground truncate">{msg.payload.teacherName || 'New Observation'}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-2 mb-4">
                                                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-tight text-muted-foreground">
                                                                <span>Subject</span>
                                                                <span className="text-foreground">{msg.payload.subject || 'Not specified'}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-tight text-muted-foreground">
                                                                <span>Grade</span>
                                                                <span className="text-foreground">{msg.payload.grade || 'Not specified'}</span>
                                                            </div>
                                                        </div>

                                                        <Button 
                                                            onClick={() => handleReviewDraft(msg.payload)}
                                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-between px-4 group"
                                                        >
                                                            Review & Submit
                                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Navigation Preview Card */}
                                                {msg.type === 'NAV_PREVIEW' && msg.payload && (
                                                    <div className="mt-3 w-[95%] bg-white border border-primary/20 rounded-2xl p-4 shadow-xl shadow-primary/5 animate-in slide-in-from-left-2 duration-500 overflow-hidden relative group">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                                            <ArrowRight className="w-16 h-16 text-primary" />
                                                        </div>

                                                        <div className="flex items-center gap-3 mb-3 relative z-10">
                                                            <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                                                                <Search className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">{msg.payload.platformPath || 'Platform Location'}</p>
                                                                <h4 className="text-sm font-bold text-foreground leading-tight">{msg.payload.destinationTitle}</h4>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground mb-4 relative z-10 leading-relaxed">
                                                            {msg.payload.description || "I've located the section you're looking for. Shall we go there?"}
                                                        </p>

                                                        <div className="flex gap-2 relative z-10">
                                                            <Button 
                                                                variant="outline"
                                                                onClick={() => setMessages(prev => [...prev, { role: 'assistant', content: "No problem. Is there anything else I can help you find?", type: 'TEXT' }])}
                                                                className="flex-1 rounded-xl text-[10px] h-9 font-bold"
                                                            >
                                                                Stay Here
                                                            </Button>
                                                            <Button 
                                                                onClick={() => {
                                                                    setIsOpen(false);
                                                                    navigate(msg.payload.route);
                                                                }}
                                                                className="flex-[2] rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] h-9 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                                            >
                                                                LET'S GO
                                                                <ArrowRight className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Conversational Form Confirmation Card */}
                                                {msg.type === 'FORM_CONFIRMATION' && msg.payload && (
                                                    <div className="mt-3 w-[95%] bg-white border-2 border-primary/20 rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 duration-300">
                                                        <div className="flex items-center gap-3 mb-4 border-b pb-4">
                                                            <div className="bg-primary text-white p-2.5 rounded-xl shrink-0 shadow-lg shadow-primary/20">
                                                                <Clipboard className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Verification Required</p>
                                                                <h4 className="text-sm font-bold text-foreground">{msg.payload.formType} SUMMARY</h4>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 mb-6 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                                            {Object.entries(msg.payload.payload).map(([key, value]) => (
                                                                <div key={key} className="flex flex-col gap-1">
                                                                    <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                                    <span className="text-xs font-semibold text-foreground/90 bg-muted/30 px-2 py-1 rounded border border-muted/50">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <Button 
                                                                variant="outline"
                                                                onClick={() => setMessages(prev => [...prev, { role: 'assistant', content: "Cancelled. I haven't saved anything. What would you like to change?", type: 'TEXT' }])}
                                                                className="flex-1 rounded-xl text-xs font-bold"
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button 
                                                                onClick={() => handleFormSubmit(msg.payload.formType, msg.payload.payload)}
                                                                disabled={isFormSubmitting}
                                                                className="flex-[2] rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                                            >
                                                                {isFormSubmitting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Send className="w-3 h-3"/>}
                                                                CONFIRM & POST
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {isAILoading && (
                                        <div className="flex justify-start animate-pulse">
                                            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200">
                                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            
                            {/* PERSISTENT VOICE PREVIEW BAR (Above Input) */}
                            {isVoiceModeEnabled && !isAiraListening && (
                                <div className="px-4 pb-2 relative z-[110]">
                                    <div className="bg-white border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg animate-in slide-in-from-bottom-2">
                                        <div className="flex gap-1 shrink-0 items-center">
                                            {voiceTranscript ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter text-red-500">Listening</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-600">Mic: Ready</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="h-4 w-px bg-slate-200" />
                                        <p className="text-[11px] font-bold text-primary truncate italic leading-none">
                                            {voiceTranscript ? `"${voiceTranscript}..."` : "Watching for 'Aira'..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t relative z-10">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        placeholder={isActivelyListening ? "Listening... speak now" : "Type your question..."}
                                        value={isActivelyListening ? voiceTranscript : chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className={`rounded-xl border-slate-200 focus-visible:ring-primary h-11 ${isActivelyListening ? 'border-primary bg-primary/5 animate-pulse' : ''}`}
                                        readOnly={isActivelyListening}
                                    />
                                    <Button
                                        onClick={handleMicButtonClick}
                                        size="icon"
                                        className={`rounded-xl shrink-0 w-11 h-11 shadow-lg transition-all duration-300 ${
                                            isActivelyListening || isAiraListening
                                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 animate-pulse'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-slate-200/50'
                                        }`}
                                        title={isActivelyListening ? 'Stop listening' : 'Click to speak'}
                                    >
                                        <Mic className={`w-4 h-4 ${isActivelyListening || isAiraListening ? 'text-white' : 'text-slate-600'}`} />
                                    </Button>
                                    <Button
                                        onClick={() => handleSendMessage()}
                                        size="icon"
                                        disabled={isAILoading || !chatInput.trim() || isActivelyListening}
                                        className="rounded-xl bg-primary hover:bg-primary-dark shrink-0 w-11 h-11 shadow-lg shadow-primary/20"
                                    >
                                        <Send className="w-4 h-4 text-white" />
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
                                            Talk to Aira about this
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
