import React from 'react';
import { Card } from '../../../components/ui/CardLegacy';
import { Download, TrendingUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const ReportsDashboard = () => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <Card className="xl:col-span-2 p-10 sm:p-12 bg-white border border-slate-100 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] hover:border-blue-500 transition-all duration-500 group">
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Operational Velocity</h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" size={14} />
                            Completion rate variance / Real-time
                        </p>
                    </div>
                </div>
                <div className="h-[300px] flex items-end justify-between gap-4 px-2">
                    {[45, 78, 52, 92, 68, 85, 58].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1.2, ease: "circOut" }}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden group-hover/bar:bg-backgroundackgroundlue-600 group-hover/bar:border-blue-500 transition-all duration-500 shadow-inner"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600 opacity-0 group-hover/bar:opacity-100 group-hover/bar:text-foreground transition-all tabular-nums">
                                    {h}%
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4 border-t border-slate-50 pt-8">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </Card>

            <div className="space-y-8 flex flex-col">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                        <FileText className="text-blue-600" size={16} />
                        Intelligence Archives
                    </h3>
                </div>
                <div className="space-y-4">
                    {[
                        { title: 'Operational Delta Report', date: 'FEB 01, 2026', type: 'PDF', size: '2.4 MB' },
                        { title: 'Budget Allocation V4', date: 'JAN 28, 2026', type: 'XLS', size: '1.8 MB' },
                        { title: 'Identity Audit Sync', date: 'JAN 25, 2026', type: 'CSV', size: '0.9 MB' },
                        { title: 'Strategy Deployment Logs', date: 'JAN 22, 2026', type: 'DOC', size: '4.2 MB' }
                    ].map((report, i) => (
                        <Card key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/5 group cursor-pointer transition-all duration-300">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 text-muted-foreground border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-backgroundackgroundlue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all duration-500 shadow-sm">
                                    <FileText size={24} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">{report.title}</h4>
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1.5 flex items-center gap-2">
                                        {report.date} <span className="text-slate-200">/</span> {report.type} <span className="text-slate-200">/</span> {report.size}
                                    </p>
                                </div>
                            </div>
                            <button className="w-12 h-12 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-backgroundackgroundlue-600 group-hover:text-foreground transition-all duration-300 flex items-center justify-center active:scale-90">
                                <Download size={18} />
                            </button>
                        </Card>
                    ))}
                </div>
                <button className="w-full mt-auto h-16 border-2 border-dashed border-slate-200 text-[10px] font-black text-muted-foreground uppercase tracking-widest rounded-3xl hover:border-blue-500 hover:text-blue-600 hover:bg-backgroundackgroundlue-50 transition-all">
                    Generate Custom Dataset
                </button>
            </div>
        </div>
    );
};


export default ReportsDashboard;
