// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, AlertTriangle, Zap, ArrowRight, UserPlus, UserMinus } from 'lucide-react';
import { aiService } from '../../../services/ai.service';

export default function WorkloadChart({ teamMembers = [], tasks = [] }) {
    const [workloadData, setWorkloadData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkloadData();
    }, [teamMembers, tasks]);

    const loadWorkloadData = async () => {
        try {
            setLoading(true);
            if (teamMembers.length > 0) {
                const data = await aiService.suggestWorkload(teamMembers, tasks);
                setWorkloadData(data);
            } else {
                setWorkloadData(getMockWorkloadData());
            }
        } catch (err) {
            console.error('Failed to load workload data:', err);
            setWorkloadData(getMockWorkloadData());
        } finally {
            setLoading(false);
        }
    };

    const getMockWorkloadData = () => ({
        teamWorkloads: [
            { id: '1', name: 'John Smith', currentLoad: 42, loadCategory: 'overloaded', avatar: 'J' },
            { id: '2', name: 'Sarah Connor', currentLoad: 28, loadCategory: 'optimal', avatar: 'S' },
            { id: '3', name: 'Mike Johnson', currentLoad: 35, loadCategory: 'optimal', avatar: 'M' },
            { id: '4', name: 'Emily Davis', currentLoad: 15, loadCategory: 'underutilized', avatar: 'E' },
            { id: '5', name: 'Tom Wilson', currentLoad: 18, loadCategory: 'underutilized', avatar: 'T' }
        ],
        bottlenecks: ['John Smith'],
        suggestions: [
            { type: 'rebalance', from: 'John Smith', to: 'Emily Davis', description: 'Transfer tasks to balance workload' }
        ],
        summary: {
            overloaded: 1,
            optimal: 2,
            underutilized: 2
        }
    });

    const getLoadColor = (load) => {
        if (load > 40) return 'bg-red-400';
        if (load > 25) return 'bg-[#BAFF00]';
        return 'bg-blue-400';
    };

    const getLoadCategoryBadge = (category) => {
        switch (category) {
            case 'overloaded':
                return { class: 'bg-red-400/20 text-red-400', label: 'Overloaded' };
            case 'underutilized':
                return { class: 'bg-blue-400/20 text-blue-400', label: 'Underutilized' };
            default:
                return { class: 'bg-[#BAFF00]/20 text-[#BAFF00]', label: 'Optimal' };
        }
    };

    if (loading) {
        return (
            <div className="bg-[#161B22] rounded-2xl p-6 border border-white/5">
                <div className="h-6 w-40 bg-white/5 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#161B22] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#BAFF00]" />
                        Team Workload
                    </h3>
                    <p className="text-sm text-white/50">Workload distribution analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-red-400/10 rounded-xl border border-red-400/20 text-center">
                    <p className="text-2xl font-bold text-red-400">{workloadData?.summary?.overloaded || 0}</p>
                    <p className="text-xs text-white/50">Overloaded</p>
                </div>
                <div className="p-4 bg-[#BAFF00]/10 rounded-xl border border-[#BAFF00]/20 text-center">
                    <p className="text-2xl font-bold text-[#BAFF00]">{workloadData?.summary?.optimal || 0}</p>
                    <p className="text-xs text-white/50">Optimal</p>
                </div>
                <div className="p-4 bg-blue-400/10 rounded-xl border border-blue-400/20 text-center">
                    <p className="text-2xl font-bold text-blue-400">{workloadData?.summary?.underutilized || 0}</p>
                    <p className="text-xs text-white/50">Underutilized</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {workloadData?.teamWorkloads?.map((member) => {
                    const badge = getLoadCategoryBadge(member.loadCategory);
                    return (
                        <div key={member.id} className="p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
                                    {member.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white">{member.name}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${badge.class}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${getLoadColor(member.currentLoad)}`}
                                                style={{ width: `${Math.min(member.currentLoad, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-white/60 w-12 text-right">{member.currentLoad}h</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {workloadData?.suggestions?.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-3">AI Suggestions</h4>
                    {workloadData.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#BAFF00]/5 rounded-xl border border-[#BAFF00]/20">
                            <div className="flex items-center gap-2">
                                <UserMinus className="w-4 h-4 text-red-400" />
                                <ArrowRight className="w-4 h-4 text-white/40" />
                                <UserPlus className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-sm text-white/80">
                                Transfer tasks from <strong className="text-white">{suggestion.from}</strong> to <strong className="text-white">{suggestion.to}</strong>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}