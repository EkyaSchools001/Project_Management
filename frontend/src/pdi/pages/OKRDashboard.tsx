import React, { useEffect, useState } from 'react';
import { useAuth } from '@pdi/hooks/useAuth';
import { DashboardLayout } from '@pdi/components/layout/DashboardLayout';
import { PageHeader } from '@pdi/components/layout/PageHeader';
import { okrService, OKRResponse, TeacherOKRData, HOSOKRData, AdminOKRData } from '@pdi/services/okrService';
import { TeacherOKRView } from '@pdi/components/okr/TeacherOKRView';
import { HOSOKRView } from '@pdi/components/okr/HOSOKRView';
import { AdminOKRView } from '@pdi/components/okr/AdminOKRView';
import { Loader2, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent } from '@pdi/components/ui/card';
import { getSocket } from '@pdi/lib/socket';

export default function OKRDashboard() {
    const { user } = useAuth();
    const [okrData, setOkrData] = useState<OKRResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOKRData = async () => {
        try {
            const result = await okrService.getOKRData();
            setOkrData(result);
        } catch (err) {
            console.error('Failed to fetch OKR data:', err);
            setError('Failed to load OKR data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOKRData();

        const socket = getSocket();
        const refreshEvents = [
            'goal:created', 'goal:updated',
            'observation:created', 'observation:updated',
            'mooc:created', 'mooc:updated',
            'attendance:toggled', 'attendance:submitted',
            'course:created', 'course:updated', 'course:deleted',
            'training:created', 'training:updated', 'training:deleted',
            'assessment:submitted', 'survey:submitted'
        ];

        refreshEvents.forEach(event => {
            socket.on(event, fetchOKRData);
        });

        return () => {
            refreshEvents.forEach(event => {
                socket.off(event, fetchOKRData);
            });
        };
    }, []);

    if (!user) return null;

    const role = user.role;
    const layoutRole = (
        role === 'TEACHER' ? 'teacher' :
            role === 'SCHOOL_LEADER' || role === 'LEADER' ? 'leader' :
                role === 'MANAGEMENT' ? 'management' :
                    role === 'SUPERADMIN' ? 'superadmin' : 'admin'
    ) as any;

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-zinc-400 text-sm font-medium">Loading your OKR data...</p>
                </div>
            );
        }

        if (error || !okrData) {
            return (
                <Card className="  shadow-xl rounded-2xl">
                    <CardContent className="py-16 text-center">
                        <BarChart3 className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-500 font-medium">{error || 'No data available.'}</p>
                    </CardContent>
                </Card>
            );
        }

        if (okrData.role === 'TEACHER') {
            return <TeacherOKRView data={okrData.data as TeacherOKRData} />;
        }
        if (okrData.role === 'HOS') {
            return <HOSOKRView data={okrData.data as HOSOKRData} />;
        }
        if (okrData.role === 'ADMIN' || okrData.role === 'MANAGEMENT' || okrData.role === 'SUPERADMIN') {
            return (
                <AdminOKRView
                    data={okrData.data as AdminOKRData}
                    isManagement={okrData.role === 'MANAGEMENT'}
                />
            );
        }

        return (
            <Card className="p-12 text-center shadow-xl rounded-2xl bg-white/50 backdrop-blur-sm border-dashed border-2 border-slate-200">
                <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">No dashboard available</h3>
                <p className="text-slate-500 mt-2">
                    Your role ({okrData.role || 'Unknown'}) does not have a specialized OKR view, or the data format was not recognized.
                </p>
                <div className="mt-6 p-4 bg-slate-50 rounded-lg text-left text-[10px] font-mono text-slate-400 overflow-auto max-h-40">
                    <p>Debug Info:</p>
                    <pre>{JSON.stringify({ role: okrData.role, hasData: !!okrData.data }, null, 2)}</pre>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Progress Dashboard"
                subtitle="Objectives & Key Results"
            />
            {renderContent()}
        </div>
    );
}
