// @ts-nocheck
import React, { useState } from 'react';
import { Brain, MessageCircle, BarChart3, AlertTriangle, Clock, Zap, TrendingUp, Users } from 'lucide-react';
import AIInsights from '../components/AIInsights';
import AISuggestions from '../components/AISuggestions';
import AIChatbot from '../components/AIChatbot';
import RiskAssessment from '../components/RiskAssessment';
import WorkloadChart from '../components/WorkloadChart';

export default function AICenterPage() {
    const [activeTab, setActiveTab] = useState('insights');
    const [chatOpen, setChatOpen] = useState(false);

    const tabs = [
        { id: 'insights', label: 'Insights', icon: Brain },
        { id: 'suggestions', label: 'Suggestions', icon: Zap },
        { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
        { id: 'workload', label: 'Workload', icon: Users },
        { id: 'chat', label: 'Chatbot', icon: MessageCircle }
    ];

    return (
        <div className="min-h-screen bg-[#18181b] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-[#8b5cf6]" />
                            </div>
                            AI Center
                        </h1>
                        <p className="text-sm text-foreground/50 mt-1">Smart insights and assistance powered by AI</p>
                    </div>
                    <button
                        onClick={() => setChatOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] text-black font-bold rounded-xl hover:bg-[#8b5cf6]/90 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Open Chatbot
                    </button>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                activeTab === tab.id
                                    ? 'bg-[#8b5cf6] text-black'
                                    : 'bg-white/5 text-foreground/60 hover:bg-white/10'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeTab === 'insights' && (
                        <>
                            <div className="lg:col-span-2">
                                <AIInsights />
                            </div>
                            <div className="lg:col-span-2">
                                <div className="bg-[#161B22] rounded-2xl p-6 border border-white/5">
                                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
                                        AI Analytics Overview
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Tasks Analyzed', value: '156', icon: Clock },
                                            { label: 'Projects Monitored', value: '23', icon: Zap },
                                            { label: 'Risk Alerts', value: '4', icon: AlertTriangle },
                                            { label: 'Suggestions', value: '12', icon: Brain }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-xl">
                                                <stat.icon className="w-5 h-5 text-[#8b5cf6] mb-2" />
                                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                                <p className="text-xs text-foreground/40">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'suggestions' && (
                        <div className="lg:col-span-2">
                            <div className="bg-[#161B22] rounded-2xl p-6 border border-white/5">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#8b5cf6]" />
                                    AI Suggestions
                                </h3>
                                <AISuggestions />
                            </div>
                        </div>
                    )}

                    {activeTab === 'risk' && (
                        <div className="lg:col-span-2">
                            <RiskAssessment />
                        </div>
                    )}

                    {activeTab === 'workload' && (
                        <div className="lg:col-span-2">
                            <WorkloadChart />
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="lg:col-span-2 h-[600px]">
                            <AIChatbot embedded />
                        </div>
                    )}
                </div>
            </div>

            {chatOpen && (
                <div className="fixed inset-0 z-50">
                    <AIChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
                </div>
            )}
        </div>
    );
}