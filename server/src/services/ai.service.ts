interface Task {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
    assignee?: string;
    status: string;
    estimatedHours?: number;
}

interface Project {
    id: string;
    name: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed';
    startDate: string;
    endDate: string;
    team: string[];
    budget?: number;
    progress: number;
}

interface Meeting {
    id: string;
    title: string;
    participants: string[];
    duration: number;
    proposedTimes: string[];
}

interface ContentItem {
    id: string;
    title: string;
    description?: string;
    type: 'task' | 'project' | 'note' | 'document';
}

class AIService {
    private static instance: AIService;
    
    private constructor() {}

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    async prioritizeTasks(tasks: Task[], context?: any): Promise<any[]> {
        const now = new Date();
        
        const scoredTasks = tasks.map(task => {
            let score = 0;
            
            if (task.priority === 'urgent') score += 100;
            else if (task.priority === 'high') score += 75;
            else if (task.priority === 'medium') score += 50;
            else score += 25;

            const dueDate = new Date(task.dueDate);
            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilDue <= 0) score += 50;
            else if (daysUntilDue <= 2) score += 30;
            else if (daysUntilDue <= 7) score += 15;

            if (task.estimatedHours && task.estimatedHours > 8) score -= 10;
            if (task.status === 'in-progress') score += 20;

            return { ...task, aiScore: score };
        });

        return scoredTasks
            .sort((a, b) => b.aiScore - a.aiScore)
            .map((task, index) => ({ ...task, suggestedOrder: index + 1 }));
    }

    async analyzeProjectRisk(project: Project, historicalData?: any): Promise<any> {
        const riskFactors: Array<{ factor: string; severity: 'low' | 'medium' | 'high'; description: string; mitigation: string }> = [];
        let riskScore = 0;

        const now = new Date();
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        const progressRatio = Math.min(Math.max(elapsed / totalDuration, 0), 1);

        if (project.status === 'on-hold') {
            riskFactors.push({
                factor: 'Project On Hold',
                severity: 'high',
                description: 'Project is currently on hold',
                mitigation: 'Review hold reasons and create activation plan'
            });
            riskScore += 40;
        }

        if (progressRatio > 0.8 && project.progress < 60) {
            riskFactors.push({
                factor: 'Schedule Slippage',
                severity: 'high',
                description: 'Project is behind schedule based on time elapsed',
                mitigation: 'Analyze delays, increase resources or adjust timeline'
            });
            riskScore += 35;
        }

        if (project.progress > 20 && project.progress < 30) {
            riskFactors.push({
                factor: 'Early Stage Uncertainty',
                severity: 'medium',
                description: 'Project in early phases with high uncertainty',
                mitigation: 'Ensure clear requirements and stakeholder alignment'
            });
            riskScore += 20;
        }

        if (project.team.length > 10) {
            riskFactors.push({
                factor: 'Large Team Coordination',
                severity: 'medium',
                description: 'Large teams increase communication overhead',
                mitigation: 'Implement structured communication protocols'
            });
            riskScore += 15;
        }

        if (project.budget && project.progress > 50 && project.progress < 70) {
            riskFactors.push({
                factor: 'Budget Burn Rate',
                severity: 'low',
                description: 'Monitor budget utilization vs progress',
                mitigation: 'Track burn rate and adjust spending if needed'
            });
            riskScore += 10;
        }

        const overallRisk = riskScore >= 50 ? 'high' : riskScore >= 25 ? 'medium' : 'low';

        return {
            projectId: project.id,
            projectName: project.name,
            riskScore,
            overallRisk,
            riskFactors,
            recommendations: riskFactors.map(f => f.mitigation),
            confidence: 0.85
        };
    }

    async suggestWorkloadBalance(teamMembers: any[], tasks: Task[]): Promise<any> {
        const memberWorkloads: Record<string, number> = {};
        
        teamMembers.forEach(member => {
            memberWorkloads[member.id] = member.currentLoad || 0;
        });

        tasks.forEach(task => {
            if (task.assignee && memberWorkloads[task.assignee] !== undefined) {
                memberWorkloads[task.assignee] += task.estimatedHours || 1;
            }
        });

        const sortedMembers = teamMembers.map(member => ({
            ...member,
            currentLoad: memberWorkloads[member.id] || 0,
            loadCategory: memberWorkloads[member.id] || 0 > 40 ? 'overloaded' : 
                          memberWorkloads[member.id] || 0 > 25 ? 'optimal' : 'underutilized'
        }));

        const overloaded = sortedMembers.filter(m => m.loadCategory === 'overloaded');
        const underutilized = sortedMembers.filter(m => m.loadCategory === 'underutilized');

        const suggestions = [];

        if (overloaded.length > 0 && underutilized.length > 0) {
            overloaded.forEach(over => {
                underutilized.forEach(under => {
                    suggestions.push({
                        type: 'rebalance',
                        from: over.name,
                        to: under.name,
                        description: `Transfer tasks from ${over.name} to ${under.name} to balance workload`
                    });
                });
            });
        }

        return {
            teamWorkloads: sortedMembers,
            bottlenecks: overloaded.map(m => m.name),
            suggestions,
            summary: {
                overloaded: overloaded.length,
                optimal: sortedMembers.filter(m => m.loadCategory === 'optimal').length,
                underutilized: underutilized.length
            }
        };
    }

    async optimizeMeetingSchedule(meetings: Meeting[], constraints?: any): Promise<any> {
        const optimizedSlots: Array<{ meetingId: string; suggestedTime: string; confidence: number }> = [];
        
        const timeSlots = [
            'Monday 9:00 AM', 'Monday 10:00 AM', 'Monday 2:00 PM',
            'Tuesday 9:00 AM', 'Tuesday 10:00 AM', 'Tuesday 2:00 PM',
            'Wednesday 9:00 AM', 'Wednesday 10:00 AM', 'Wednesday 2:00 PM',
            'Thursday 9:00 AM', 'Thursday 10:00 AM', 'Thursday 2:00 PM',
            'Friday 9:00 AM', 'Friday 10:00 AM', 'Friday 2:00 PM'
        ];

        const usedSlots: Record<string, string[]> = {};
        
        meetings.forEach(meeting => {
            let bestSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            let maxAvailable = 0;
            
            timeSlots.forEach(slot => {
                const day = slot.split(' ')[0];
                const hour = parseInt(slot.split(' ')[1]);
                
                let available = 100;
                
                if (usedSlots[day]?.includes(slot)) available -= 50;
                if (hour >= 11 && hour <= 3) available -= 20;
                if (meeting.participants.length > 5) available -= 10;
                
                if (available > maxAvailable) {
                    maxAvailable = available;
                    bestSlot = slot;
                }
            });

            if (!usedSlots[bestSlot.split(' ')[0]]) {
                usedSlots[bestSlot.split(' ')[0]] = [];
            }
            usedSlots[bestSlot.split(' ')[0]].push(bestSlot);

            optimizedSlots.push({
                meetingId: meeting.id,
                suggestedTime: bestSlot,
                confidence: 0.8
            });
        });

        return {
            optimizedSchedule: optimizedSlots,
            recommendations: [
                'Schedule important meetings earlier in the week',
                'Avoid scheduling after 3 PM on Fridays',
                'Keep team meetings to under 60 minutes'
            ]
        };
    }

    async analyzeText(text: string, type: 'sentiment' | 'category' | 'summary'): Promise<any> {
        const keywords = text.toLowerCase().split(/\s+/);
        
        if (type === 'sentiment') {
            const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'success', 'achieved', 'happy', 'exceeded'];
            const negativeWords = ['bad', 'poor', 'failed', 'issue', 'problem', 'concern', 'delay', 'difficult', 'worried'];
            
            let score = 0;
            keywords.forEach(word => {
                if (positiveWords.includes(word)) score += 1;
                if (negativeWords.includes(word)) score -= 1;
            });

            return {
                sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
                score,
                confidence: 0.75
            };
        }

        if (type === 'category') {
            const categories: Record<string, string[]> = {
                'project': ['project', 'deadline', 'milestone', 'deliverable'],
                'task': ['task', 'todo', 'action', 'complete'],
                'meeting': ['meeting', 'schedule', 'discuss', 'agenda'],
                'issue': ['issue', 'bug', 'error', 'problem', 'blocker'],
                'general': []
            };

            for (const [category, words] of Object.entries(categories)) {
                if (words.length === 0) continue;
                if (words.some(word => keywords.includes(word))) {
                    return { category, confidence: 0.8 };
                }
            }

            return { category: 'general', confidence: 0.5 };
        }

        if (type === 'summary') {
            const sentences = text.split(/[.!?]+/).filter(s => s.trim());
            return {
                summary: sentences.slice(0, 3).join('. '),
                keyPoints: keywords.slice(0, 5),
                wordCount: keywords.length
            };
        }

        return { error: 'Unknown analysis type' };
    }

    async autoTagContent(items: ContentItem[]): Promise<any[]> {
        const tagKeywords: Record<string, string[]> = {
            'urgent': ['urgent', 'asap', 'critical', 'emergency'],
            'meeting': ['meeting', 'discuss', 'schedule', 'sync'],
            'documentation': ['doc', 'document', 'write', 'note'],
            'development': ['code', 'implement', 'build', 'feature'],
            'review': ['review', 'check', 'approve', 'validate'],
            'research': ['research', 'investigate', 'analyze', 'explore']
        };

        return items.map(item => {
            const text = `${item.title} ${item.description || ''}`.toLowerCase();
            const tags: string[] = [];

            for (const [tag, keywords] of Object.entries(tagKeywords)) {
                if (keywords.some(keyword => text.includes(keyword))) {
                    tags.push(tag);
                }
            }

            if (tags.length === 0) tags.push('general');

            return {
                ...item,
                tags,
                autoGenerated: true
            };
        });
    }

    async chatbotResponse(message: string, context?: any): Promise<any> {
        const lowerMessage = message.toLowerCase();
        
        const responses: Record<string, { response: string; action?: string; data?: any }> = {
            'task': {
                response: 'I can help you manage tasks. You can create, update, or view tasks in the Task Matrix.',
                action: 'navigate',
                data: { path: '/pms/tasks' }
            },
            'project': {
                response: 'Looking for project information. Check the Global PMO for all projects.',
                action: 'navigate',
                data: { path: '/pms/projects' }
            },
            'meeting': {
                response: 'I can help you schedule or find meetings. Check the calendar for upcoming events.',
                action: 'navigate',
                data: { path: '/pms/calendar' }
            },
            'deadline': {
                response: 'Let me check your upcoming deadlines. Based on your tasks, here are items due soon.',
                action: 'show_tasks'
            },
            'help': {
                response: 'I can help with: tasks, projects, meetings, deadlines, reports, and general questions. What do you need?',
                action: 'help_menu'
            },
            'report': {
                response: 'You can generate reports in the System Reports section.',
                action: 'navigate',
                data: { path: '/pms/reports' }
            }
        };

        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return {
                    message: response.response,
                    action: response.action,
                    ...response.data,
                    timestamp: new Date().toISOString()
                };
            }
        }

        return {
            message: "I'm here to help with tasks, projects, meetings, and more. How can I assist you today?",
            action: 'general',
            timestamp: new Date().toISOString()
        };
    }

    async getSuggestions(userId: string, types: string[] = ['task', 'project', 'workload']): Promise<any[]> {
        const suggestions = [];

        if (types.includes('task')) {
            suggestions.push({
                id: 'sug-1',
                type: 'task',
                title: 'Review overdue tasks',
                description: 'You have tasks that need immediate attention',
                priority: 'high',
                action: { type: 'navigate', path: '/pms/tasks?filter=overdue' }
            });
        }

        if (types.includes('project')) {
            suggestions.push({
                id: 'sug-2',
                type: 'project',
                title: 'Update project status',
                description: 'Several projects haven\'t been updated this week',
                priority: 'medium',
                action: { type: 'navigate', path: '/pms/projects' }
            });
        }

        if (types.includes('workload')) {
            suggestions.push({
                id: 'sug-3',
                type: 'workload',
                title: 'Team workload imbalance detected',
                description: 'Some team members are overloaded while others have capacity',
                priority: 'low',
                action: { type: 'open_modal', modal: 'workload-balancing' }
            });
        }

        return suggestions;
    }

    async predictiveText(prefix: string, options: number = 5): Promise<string[]> {
        const commonCompletions = [
            'task',
            'meeting',
            'project',
            'deadline',
            'report',
            'update',
            'review',
            'completion',
            'discussion',
            'documentation'
        ];

        return commonCompletions
            .filter(c => c.startsWith(prefix.toLowerCase()))
            .slice(0, options);
    }
}

export default AIService.getInstance();