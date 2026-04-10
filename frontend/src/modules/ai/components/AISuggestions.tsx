// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Lightbulb, Check, X, Clock, AlertCircle } from 'lucide-react';
import { aiService } from '../../../services/ai.service';

export default function AISuggestions({ types = ['task', 'project', 'workload'] }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(new Set());

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        try {
            setLoading(true);
            const data = await aiService.getSuggestions('current-user', types);
            setSuggestions(data || []);
        } catch (err) {
            console.error('Failed to load suggestions:', err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = (id) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    const handleDismiss = (id) => {
        setDismissed(prev => new Set([...prev, id]));
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    const getPriorityIndicator = (priority) => {
        switch (priority) {
            case 'high':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'medium':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'low':
                return <Lightbulb className="w-4 h-4 text-green-400" />;
            default:
                return <Lightbulb className="w-4 h-4 text-gray-400" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'task': return 'border-blue-500/30 bg-blue-500/10';
            case 'project': return 'border-purple-500/30 bg-purple-500/10';
            case 'workload': return 'border-orange-500/30 bg-orange-500/10';
            default: return 'border-gray-500/30 bg-gray-500/10';
        }
    };

    const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id));

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (visibleSuggestions.length === 0) {
        return (
            <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50 text-sm">No active suggestions</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {visibleSuggestions.map((suggestion) => (
                <div
                    key={suggestion.id}
                    className={`p-4 rounded-xl border ${getTypeColor(suggestion.type)} transition-all hover:scale-[1.01]`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getPriorityIndicator(suggestion.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white">{suggestion.title}</h4>
                            <p className="text-xs text-white/60 mt-1">{suggestion.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] uppercase tracking-wider text-white/40 bg-white/5 px-2 py-0.5 rounded">
                                    {suggestion.type}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleAccept(suggestion.id)}
                                className="p-1.5 rounded-lg bg-[#BAFF00]/20 text-[#BAFF00] hover:bg-[#BAFF00]/30 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDismiss(suggestion.id)}
                                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}