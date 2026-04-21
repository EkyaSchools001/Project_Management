// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, TrendingDown, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { aiService } from '../../../services/ai.service';

export default function RiskAssessment({ project = null }) {
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRiskData();
    }, [project]);

    const loadRiskData = async () => {
        try {
            setLoading(true);
            if (project) {
                const data = await aiService.analyzeRisk(project);
                setRiskData(data);
            } else {
                setRiskData(getMockRiskData());
            }
        } catch (err) {
            console.error('Failed to load risk data:', err);
            setRiskData(getMockRiskData());
        } finally {
            setLoading(false);
        }
    };

    const getMockRiskData = () => ({
        projectId: 'proj-1',
        projectName: 'Website Redesign',
        riskScore: 45,
        overallRisk: 'medium',
        riskFactors: [
            {
                factor: 'Schedule Slippage',
                severity: 'high',
                description: 'Project is behind schedule based on time elapsed',
                mitigation: 'Analyze delays and increase resources'
            },
            {
                factor: 'Resource Constraints',
                severity: 'medium',
                description: 'Limited developer availability',
                mitigation: 'Prioritize critical path items'
            },
            {
                factor: 'Scope Creep',
                severity: 'low',
                description: 'Additional features requested',
                mitigation: 'Review change request process'
            }
        ],
        recommendations: [
            'Schedule weekly status meetings',
            'Review resource allocation',
            'Document scope changes'
        ],
        confidence: 0.85
    });

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'low': return 'text-violet-400 bg-violet-400/10 border-violet-400/30';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'high': return <XCircle className="w-4 h-4" />;
            case 'medium': return <AlertTriangle className="w-4 h-4" />;
            case 'low': return <CheckCircle className="w-4 h-4" />;
            default: return <Shield className="w-4 h-4" />;
        }
    };

    const getRiskScoreColor = (score) => {
        if (score >= 50) return 'text-red-400';
        if (score >= 25) return 'text-yellow-400';
        return 'text-violet-400';
    };

    if (loading) {
        return (
            <div className="bg-[#161B22] rounded-2xl p-6 border border-white/5">
                <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#161B22] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#8b5cf6]" />
                        Risk Assessment
                    </h3>
                    <p className="text-sm text-foreground/50">{riskData?.projectName || 'All Projects'}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-foreground">{riskData?.riskScore || 0}</p>
                    <p className="text-xs text-foreground/40">Risk Score</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getSeverityColor(riskData?.overallRisk)}`}>
                        {riskData?.overallRisk?.toUpperCase()} RISK
                    </div>
                    <span className="text-xs text-foreground/40">
                        Confidence: {Math.round((riskData?.confidence || 0) * 100)}%
                    </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all ${
                            riskData?.riskScore >= 50 ? 'bg-red-400' :
                            riskData?.riskScore >= 25 ? 'bg-yellow-400' : 'bg-violet-400'
                        }`}
                        style={{ width: `${Math.min(riskData?.riskScore || 0, 100)}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">Risk Factors</h4>
                {riskData?.riskFactors?.map((factor, i) => (
                    <div 
                        key={i}
                        className={`p-4 rounded-xl border ${getSeverityColor(factor.severity)}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getSeverityIcon(factor.severity)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-foreground">{factor.factor}</h5>
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${
                                        factor.severity === 'high' ? 'bg-red-400/20 text-red-400' :
                                        factor.severity === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                                        'bg-violet-400/20 text-violet-400'
                                    }`}>
                                        {factor.severity}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/60">{factor.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">Mitigation Suggestions</h4>
                {riskData?.recommendations?.map((rec, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <ChevronRight className="w-4 h-4 text-[#8b5cf6]" />
                        <span className="text-sm text-foreground/80">{rec}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}