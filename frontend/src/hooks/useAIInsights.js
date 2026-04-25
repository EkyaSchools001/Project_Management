import { useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/ai.service';
import { useAuth } from '../modules/auth/authContext';

export function useAIInsights(options = {}) {
    const {
        refreshInterval = 30000,
        types = ['task', 'project', 'workload']
    } = options;

    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    const fetchInsights = useCallback(async () => {
        if (!user?.id) return;
        try {
            setError(null);
            const data = await aiService.getSuggestions(user.id, types);
            setInsights(data || []);
        } catch (err) {
            console.error('Failed to fetch AI insights:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [types, user?.id]);

    const dismissInsight = useCallback((id) => {
        setInsights(prev => prev.filter(i => i.id !== id));
    }, []);

    const acceptInsight = useCallback((id) => {
        setInsights(prev => prev.filter(i => i.id !== id));
    }, []);

    useEffect(() => {
        fetchInsights();

        if (refreshInterval > 0) {
            const interval = setInterval(fetchInsights, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchInsights, refreshInterval]);

    return {
        insights,
        loading,
        error,
        refresh: fetchInsights,
        dismissInsight,
        acceptInsight
    };
}

export function useAIChatbot() {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I'm your AI assistant. How can I help you today?",
            timestamp: new Date().toISOString()
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = useCallback(async (message) => {
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await aiService.chatbot(message);
            
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message,
                timestamp: response.timestamp || new Date().toISOString(),
                action: response.action
            };

            setMessages(prev => [...prev, aiMessage]);
            return response;
        } catch (err) {
            console.error('Chatbot error:', err);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: "Hi! I'm your AI assistant. How can I help you today?",
                timestamp: new Date().toISOString()
            }
        ]);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return {
        messages,
        loading,
        isOpen,
        sendMessage,
        clearMessages,
        toggle,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false)
    };
}

export function useAIRiskAnalysis(projectId) {
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeRisk = useCallback(async (project) => {
        try {
            setLoading(true);
            const data = await aiService.analyzeRisk(project);
            setRiskData(data);
            return data;
        } catch (err) {
            console.error('Risk analysis error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearRiskData = useCallback(() => {
        setRiskData(null);
    }, []);

    return {
        riskData,
        loading,
        error,
        analyzeRisk,
        clearRiskData
    };
}

export function useAIWorkload(teamMembers = [], tasks = []) {
    const [workloadData, setWorkloadData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeWorkload = useCallback(async () => {
        try {
            setLoading(true);
            const data = await aiService.suggestWorkload(teamMembers, tasks);
            setWorkloadData(data);
            return data;
        } catch (err) {
            console.error('Workload analysis error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [teamMembers, tasks]);

    useEffect(() => {
        if (teamMembers.length > 0) {
            analyzeWorkload();
        }
    }, [teamMembers, tasks, analyzeWorkload]);

    return {
        workloadData,
        loading,
        error,
        analyzeWorkload
    };
}