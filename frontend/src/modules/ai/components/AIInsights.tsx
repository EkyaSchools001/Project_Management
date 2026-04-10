// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Brain, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { aiService } from '../../../services/ai.service';

export default function AIInsights({ tasks = [], project = null }) {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadInsights();
    }, [tasks, project]);

    const loadInsights = async () => {
        try {
            setLoading(true);
            const suggestions = await aiService.getSuggestions('current-user');
            setInsights(suggestions || []);
        } catch (err) {
            console.error('Failed to load AI insights:', err);
            setError('Unable to load insights');
            setInsights(getDefaultInsights());
        } finally {
            setLoading(false);
        }
    };

    const getDefaultInsights = () => [
        {
            id: 'default-1',
            type: 'task',
            title: 'Review your tasks',
            description: 'Check your task list for items needing attention',
            priority: 'medium',
            action: { type: 'navigate', path: '/pms/tasks' }
        }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-amber-600 bg-amber-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'task': return <Clock className="w-4 h-4" />;
            case 'project': return <TrendingUp className="w-4 h-4" />;
            case 'workload': return <AlertTriangle className="w-4 h-4" />;
            default: return <Brain className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">AI Insights</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">AI Insights</h3>
                    <p className="text-xs text-muted-foreground">Smart recommendations</p>
                </div>
                {insights.length > 0 && (
                    <span className="ml-auto px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded-lg">
                        {insights.length} new
                    </span>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <div className="space-y-3">
                {insights.slice(0, 4).map((insight) => (
                    <div
                        key={insight.id}
                        className="p-4 bg-muted/30 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group border border-transparent hover:border-primary/10"
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPriorityColor(insight.priority)}`}>
                                {getTypeIcon(insight.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                    {insight.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {insight.description}
                                </p>
                            </div>
                            {insight.priority === 'high' && (
                                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {insights.length > 4 && (
                <button className="w-full mt-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors">
                    View all {insights.length} insights
                </button>
            )}
        </div>
    );
}