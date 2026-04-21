import React from 'react'; // Analytics Module Entry

import { Card } from '../../../components/ui/CardLegacy';
import {
    TrendingUp,
    Users,
    Activity,
    School,
    Building2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Download
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const performanceData = [
    { name: 'Jan', value: 4000, active: 2400 },
    { name: 'Feb', value: 3000, active: 1398 },
    { name: 'Mar', value: 2000, active: 9800 },
    { name: 'Apr', value: 2780, active: 3908 },
    { name: 'May', value: 1890, active: 4800 },
    { name: 'Jun', value: 2390, active: 3800 },
    { name: 'Jul', value: 3490, active: 4300 },
];

const distributionData = [
    { name: 'Engineering', value: 400 },
    { name: 'Medical', value: 300 },
    { name: 'Arts', value: 300 },
    { name: 'Science', value: 200 },
];

const COLORS = ['#2563eb', '#059669', '#7c3aed', '#db2777', '#dc2626', '#ea580c'];

const StatCard = ({ title, value, change, trend, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
    >
        <Card className="p-8 sm:p-10 relative overflow-hidden group border border-slate-100 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-blue-500 transition-all duration-500 hover:-translate-y-2">
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">{title}</p>
                    <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none tabular-nums">{value}</h3>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'bg-backgroundmerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {change}
                        </div>
                        <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Global Variance</span>
                    </div>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-backgroundlue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-backgroundlue-600 group-hover:text-foreground transition-all duration-500 shadow-xl shadow-blue-600/5 group-hover:shadow-blue-600/20 group-hover:rotate-6">
                    <Icon size={28} />
                </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
                <Icon size={200} />
            </div>
        </Card>
    </motion.div>
);

export default function AnalyticsPage() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-12 sm:space-y-16 p-6 lg:p-12 pb-32">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 pb-12 border-b border-slate-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-backgroundlue-600 animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Core Infrastructure Intelligence</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-[calc(-0.05em)] uppercase leading-[0.9]">System <br className="hidden sm:block" /> Performance HQ</h1>
                    <p className="text-sm sm:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">Real-time heuristic performance metrics and node distribution mapping for the entire Growth Hub ecosystem.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <button className="h-16 px-8 bg-white border border-slate-200 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95">
                        <Calendar size={18} className="text-blue-600" /> Last 30 Operational Cycles
                    </button>
                    <button className="h-16 px-10 bg-backgroundackground text-foreground rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-backgroundlack transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 leading-none">
                        <Download size={18} /> Export Intelligence
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                <StatCard
                    title="Active Cloud States"
                    value="12,482"
                    change="+12.5%"
                    trend="up"
                    icon={Activity}
                    delay={0.1}
                />
                <StatCard
                    title="Pedagogical Velocity"
                    value="94.2%"
                    change="+2.4%"
                    trend="up"
                    icon={School}
                    delay={0.2}
                />
                <StatCard
                    title="Identity Nodes"
                    value="842"
                    change="-5.1%"
                    trend="down"
                    icon={Users}
                    delay={0.3}
                />
                <StatCard
                    title="Network Latency"
                    value="124ms"
                    change="+8%"
                    trend="up"
                    icon={TrendingUp}
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
                <Card className="p-10 sm:p-12 space-y-12 border border-slate-100 bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                        <TrendingUp size={300} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">System Trajectory</h3>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Node interaction across the ecosystem</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-backgroundlue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" />
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Standby</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] sm:h-[450px] w-full relative z-10 mt-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', padding: '24px', backgroundColor: '#fff' }}
                                    itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', tracking: 'widest' }}
                                />
                                <Area
                                    type="step"
                                    dataKey="active"
                                    stroke="#2563eb"
                                    strokeWidth={6}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-10 sm:p-12 space-y-12 border border-slate-100 bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                        <Users size={300} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Sector Distribution</h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Resource allocation by instructional HQ</p>
                    </div>
                    <div className="h-[350px] sm:h-[450px] w-full flex items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={window.innerWidth < 640 ? 100 : 130}
                                    outerRadius={window.innerWidth < 640 ? 140 : 180}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={12} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', padding: '24px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center pointer-events-none translate-y-1">
                            <span className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none tabular-nums">1,200</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-3">Total Units</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        {distributionData.map((dept, idx) => (
                            <div key={dept.name} className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-500 transition-all duration-300 group/item">
                                <div className="w-4 h-4 rounded-full shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.05)] transition-transform group-hover/item:scale-125" style={{ backgroundColor: COLORS[idx] }} />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter truncate">{dept.name}</span>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em] mt-1">{dept.value} Operational Nodes</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card className="p-10 sm:p-20 bg-backgroundackground text-foreground relative overflow-hidden rounded-[3rem] sm:rounded-[4.5rem] shadow-2xl shadow-slate-900/30 border-none group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                    <Activity size={300} />
                </div>
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-12 sm:gap-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 sm:gap-16">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-backgroundlue-600 text-foreground rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.4)] shrink-0 group-hover:rotate-12 transition-all duration-500">
                            <Activity size={40} />
                        </div>
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 text-blue-400 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl">Recalibration Alert</div>
                            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95]">Adaptive Threshold <br className="hidden lg:block" /> Breach Detected</h3>
                            <p className="text-sm sm:text-2xl text-foreground/40 font-medium leading-relaxed max-w-2xl italic pr-12">Heuristic analysis indicates 3 node clusters are performing below target threshold in the Engineering sector. Action required.</p>
                        </div>
                    </div>
                    <button className="w-full xl:w-auto h-20 px-16 bg-white text-slate-900 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] rounded-2xl sm:rounded-3xl hover:bg-backgroundlue-50 shadow-2xl shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-4 group-hover:gap-8 whitespace-nowrap">
                        Execute Recalibration <ArrowUpRight size={24} />
                    </button>
                </div>
            </Card>
        </div>
    );
}

