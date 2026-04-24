import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Button } from '@pdi/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PTILSuccessPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-green-100">
            <Card className="max-w-[500px] w-full text-center shadow-2xl border-none rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="pt-12 bg-emerald-500 text-white pb-10 px-8 relative overflow-hidden">
                    {/* Decorative Blur */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">Request Received!</CardTitle>
                        <CardDescription className="text-emerald-100 text-lg mt-2 opacity-90">
                            Your support ticket has been raised successfully.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <p className="text-slate-500 font-medium leading-relaxed mb-10">
                        Thank you for reaching out to Ekya Schools. Our support team and relevant staff members have been notified of your request and will get back to you shortly.
                    </p>
                    <Button 
                      className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
                      onClick={() => navigate('/support')}
                    >
                        Back to Support Portal
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
