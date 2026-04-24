import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../../components/ui/CardLegacy';
import { Button } from '../../../components/ui/ButtonLegacy';
import { ROLES, PERMISSIONS } from '../../../utils/constants';
import { rolePermissions as initialRolePermissions, updateRolePermissions } from '../../../utils/permissions';
import { userService } from '../../../services/userService';
import { useLocation } from 'react-router-dom';
import {
    Trash2, Shield, UserX, UserCheck, Eye, Edit, Files, LayoutDashboard,
    Building2, School, BarChart3, Upload, FileSpreadsheet, Plus, X,
    Save, RotateCcw, Check, Lock, Unlock, AlertTriangle, Database,
    Settings2, ChevronRight, Download, Activity as ActivityIcon, Cog, ShieldCheck, Mail, Target, Users,
    Briefcase, MessageSquare, Calendar, GraduationCap, Star, History as HistoryIcon, ShieldAlert,
    Search, Filter, MoreVertical, Key, Fingerprint, Globe, Cpu
} from 'lucide-react';
import { read, utils } from 'xlsx';
import { AnimatePresence, motion } from 'framer-motion';

const PermissionBadge = ({ permission }) => {
    const config = {
        [PERMISSIONS.ALL]: { label: 'Full Access', color: 'bg-neutral-800 text-foreground border-transparent' },
        [PERMISSIONS.DEPARTMENTS]: { label: 'Departments', color: 'bg-rose-50 text-rose-700 border-rose-100' },
        [PERMISSIONS.SCHOOLS]: { label: 'Schools', color: 'bg-red-50 text-red-700 border-red-100' },
        [PERMISSIONS.ANALYTICS]: { label: 'Analytics', color: 'bg-red-50 text-red-700 border-red-100' },
        [PERMISSIONS.USER_MGMT]: { label: 'Identity', color: 'bg-red-50 text-red-700 border-red-100' },
        [PERMISSIONS.GROWTH_HUB]: { label: 'Growth Hub', color: 'bg-orange-50 text-orange-700 border-orange-100' },
        [PERMISSIONS.GROWTH_ADMIN]: { label: 'GH Admin', color: 'bg-red-50 text-red-700 border-red-100' },
        [PERMISSIONS.GROWTH_LEADER]: { label: 'GH Leader', color: 'bg-amber-50 text-amber-700 border-amber-100' },
        [PERMISSIONS.GROWTH_TEACHER]: { label: 'GH Teacher', color: 'bg-red-50 text-red-700 border-red-100' },
        [PERMISSIONS.PM_TOOLS]: { label: 'PM Suite', color: 'bg-slate-100 text-slate-700 border-slate-200' },
        [PERMISSIONS.PROJECTS]: { label: 'Projects', color: 'bg-rose-50 text-rose-700 border-rose-100' },
        [PERMISSIONS.TASKS]: { label: 'Tasks', color: 'bg-rose-50 text-rose-700 border-rose-100' },
        [PERMISSIONS.CALENDAR]: { label: 'Calendar', color: 'bg-red-50 text-red-700 border-red-100' },
        [PERMISSIONS.CHAT]: { label: 'Chat', color: 'bg-red-50 text-red-700 border-red-100' },
        [PERMISSIONS.REPORTS]: { label: 'Reports', color: 'bg-rose-50 text-rose-700 border-rose-100' },
        [PERMISSIONS.AUDIT_LOGS]: { label: 'Audits', color: 'bg-slate-50 text-slate-700 border-slate-100' },
        [PERMISSIONS.SETTINGS]: { label: 'Settings', color: 'bg-background text-foreground border-transparent' },
    };

    const details = config[permission] || { label: permission, color: 'bg-slate-50 text-muted-foreground border-slate-200' };

    return (
        <span className={`px-3 py-1 border rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${details.color}`}>
            {details.label}
        </span>
    );
};

export default function UserManagement({ initialView = 'users' }) {
    const location = useLocation();
    const queryView = new URLSearchParams(location.search).get('view');

    const [users, setUsers] = useState(userService.getAllUsers());
    const [view, setView] = useState(queryView || initialView);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);
    const [currentPermissions, setCurrentPermissions] = useState(initialRolePermissions);
    const [selectedUserForTools, setSelectedUserForTools] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (queryView) {
            setView(queryView);
        } else if (initialView) {
            setView(initialView);
        }
    }, [queryView, initialView]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const workbook = read(event.target.result, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const jsonData = utils.sheet_to_json(workbook.Sheets[sheetName]);

                const newUsers = jsonData.map((row, index) => ({
                    id: `u-ext-${Date.now()}-${index}`,
                    name: row.Name || 'Unknown',
                    email: row.Email || `user-${index}@ekya.edu`,
                    role: ROLES.TEACHER_STAFF,
                    department: row.Department || 'General',
                    status: 'Active',
                    joinDate: new Date().toISOString().split('T')[0],
                    overrides: null
                }));
                const updated = [...newUsers, ...users];
                setUsers(updated);
                userService.saveAllUsers(updated);
            } catch (err) {
                console.error("Import failed", err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleToggleUserPermission = (userId, permission) => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                const current = u.overrides || currentPermissions[u.role] || [];
                const next = current.includes(permission) ? current.filter(p => p !== permission) : [...current, permission];
                userService.updateUser(userId, { overrides: next });
                return { ...u, overrides: next };
            }
            return u;
        }));
    };

    const handleToggleGlobalPermission = (role, permission) => {
        if (!isEditingPermissions) return;
        setCurrentPermissions(prev => {
            const current = prev[role] || [];
            const next = current.includes(permission) ? current.filter(p => p !== permission) : [...current, permission];
            return { ...prev, [role]: next };
        });
    };

    const handleSaveGlobalPermissions = () => {
        updateRolePermissions(currentPermissions);
        setIsEditingPermissions(false);
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 sm:space-y-12 pb-20 px-4 sm:px-10">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 sm:gap-10 py-6 sm:py-10 border-b border-slate-200">
                <div className="space-y-2 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.3)]"></div>
                        <span className="text-[9px] sm:text-[10px] font-black text-red-600 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Central Intelligence Unit</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Identity Matrix</h1>
                </div>

                <div className="flex bg-slate-100 rounded-[1.5rem] sm:rounded-3xl p-1 sm:p-2 border border-slate-200 shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <div className="flex min-w-max sm:min-w-0 w-full">
                        {[
                            { id: 'users', label: 'Nodes', icon: Users },
                            { id: 'permissions', label: 'Matrix', icon: Shield },
                            { id: 'growth_access', label: 'Growth', icon: Target },
                            { id: 'audit', label: 'Audits', icon: HistoryIcon },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setView(tab.id)}
                                className={`flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 h-10 sm:h-14 text-[9px] sm:text-[11px] font-black transition-all uppercase tracking-[0.1em] sm:tracking-[0.15em] rounded-[1.25rem] sm:rounded-2xl flex-1 sm:flex-none ${view === tab.id ? 'bg-white text-red-600 shadow-lg scale-[1.02] sm:scale-[1.05]' : 'text-muted-foreground hover:text-slate-600 hover:bg-white/50'}`}
                            >
                                <tab.icon size={window.innerWidth < 640 ? 14 : 18} /> <span className="truncate">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {view === 'users' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="users" className="space-y-8 sm:space-y-12">
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                { label: 'Verified Nodes', val: users.length, icon: Users, color: 'text-red-600 bg-red-50' },
                                { label: 'Active Clusters', val: '12', icon: Globe, color: 'text-red-600 bg-red-50' },
                                { label: 'Security Breaches', val: '0', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50' },
                                { label: 'System Uptime', val: '99.9%', icon: ActivityIcon, color: 'text-rose-600 bg-rose-50' },
                            ].map((stat, i) => (stat &&
                                <Card key={i} className="p-6 sm:p-8 flex items-center justify-between group hover:border-red-500 transition-all border border-slate-200 shadow-sm bg-white rounded-[2rem] sm:rounded-[2.5rem]">
                                    <div className="space-y-1">
                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                                    </div>
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={window.innerWidth < 640 ? 20 : 24} />
                                    </div>
                                </Card>
                            ))}
                        </section>

                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
                            <div className="relative w-full lg:max-w-[500px] group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="SEARCH IDENTITY PERIMETER..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-14 sm:h-16 pl-14 sm:pl-16 pr-6 bg-white border border-slate-200 rounded-2xl sm:rounded-[2rem] text-[10px] sm:text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                                <button onClick={() => fileInputRef.current.click()} className="h-14 sm:h-16 px-4 sm:px-10 bg-white border border-slate-200 rounded-2xl sm:rounded-[2rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-red-500 hover:text-red-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3">
                                    <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" /> <span className="truncate">Bulk Import</span>
                                </button>
                                <button className="h-14 sm:h-16 px-4 sm:px-10 bg-background text-foreground text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-slate-900/20 hover:bg-card hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3">
                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="truncate">Provision</span>
                                </button>
                            </div>
                        </div>

                        <Card className="border border-slate-200 shadow-sm rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-white">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                            <th className="px-6 sm:px-12 py-6 sm:py-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Identity Stream</th>
                                            <th className="px-6 sm:px-12 py-6 sm:py-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Deployment Role</th>
                                            <th className="px-6 sm:px-12 py-6 sm:py-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Access Vector</th>
                                            <th className="px-6 sm:px-12 py-6 sm:py-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-right">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-red-50/50 transition-all duration-300 group">
                                                <td className="px-6 sm:px-12 py-6 sm:py-8">
                                                    <div className="flex items-center gap-4 sm:gap-6">
                                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center font-black text-muted-foreground uppercase border border-slate-200 group-hover:bg-red-600 group-hover:text-foreground group-hover:border-transparent group-hover:rotate-6 transition-all duration-500 shadow-sm text-lg sm:text-xl shrink-0">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight truncate">{user.name}</p>
                                                            <div className="flex items-center gap-2 sm:gap-3 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                                <Mail size={12} className="text-red-600 shrink-0" />
                                                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 sm:px-12 py-6 sm:py-8">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-full border border-slate-200 text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                        <Shield size={10} className="text-red-600 shrink-0" />
                                                        {user.role}
                                                    </div>
                                                </td>
                                                <td className="px-6 sm:px-12 py-6 sm:py-8">
                                                    <div className="flex flex-wrap gap-2 max-w-[300px] sm:max-w-[400px]">
                                                        {(user.overrides || currentPermissions[user.role] || []).slice(0, 2).map(p => (
                                                            <PermissionBadge key={p} permission={p} />
                                                        ))}
                                                        {(user.overrides || currentPermissions[user.role] || []).length > 2 && (
                                                            <span className="text-[9px] font-black text-muted-foreground bg-slate-50 px-2 py-1 rounded-full border border-slate-200 uppercase tracking-tighter whitespace-nowrap">+{(user.overrides || currentPermissions[user.role] || []).length - 2}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 sm:px-12 py-6 sm:py-8 text-right">
                                                    <div className="flex justify-end gap-2 sm:gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all lg:translate-x-4 lg:group-hover:translate-x-0">
                                                        <button onClick={() => setSelectedUserForTools(user)} className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-muted-foreground hover:text-red-600 hover:border-red-500 hover:shadow-lg transition-all active:scale-95">
                                                            <Settings2 size={20} />
                                                        </button>
                                                        <button className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-muted-foreground hover:text-rose-600 hover:border-rose-500 hover:shadow-lg transition-all active:scale-95">
                                                            <UserX size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {view === 'permissions' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="permissions" className="space-y-8 sm:space-y-12">
                        <section className="bg-background text-foreground rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-16 relative overflow-hidden shadow-2xl border border-zinc-800">
                            <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.05] animate-spin-slow pointer-events-none">
                                <Cpu size={window.innerWidth < 640 ? 200 : 400} />
                            </div>
                            <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 sm:gap-10">
                                <div className="space-y-4 sm:space-y-6 max-w-2xl text-left">
                                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Hardware Root Access</div>
                                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9]">Global Permission Matrix</h2>
                                    <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">Orchestrate the behavioral heuristics of every identity class within the infrastructure.</p>
                                </div>
                                <button
                                    onClick={() => isEditingPermissions ? handleSaveGlobalPermissions() : setIsEditingPermissions(true)}
                                    className={`w-full sm:w-auto h-16 sm:h-20 px-8 sm:px-16 text-[10px] sm:text-xs font-black rounded-2xl sm:rounded-3xl transition-all shadow-2xl active:scale-95 uppercase tracking-[0.2em] flex items-center justify-center gap-4 ${isEditingPermissions ? 'bg-red-500 text-foreground shadow-red-500/20' : 'bg-white text-slate-900 group-hover:bg-red-50'}`}
                                >
                                    {isEditingPermissions ? <><Save size={20} /> Push Matrix</> : <><Edit size={20} /> Unlock Matrix</>}
                                </button>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
                            {Object.keys(ROLES).map((key) => {
                                const roleName = ROLES[key];
                                return (
                                    <Card key={key} className={`space-y-6 sm:space-y-10 p-6 sm:p-12 border border-slate-100 shadow-sm bg-white rounded-[2rem] sm:rounded-[3rem] transition-all duration-700 ${isEditingPermissions ? 'ring-4 ring-red-500/20 scale-[1.02] z-10 border-red-500' : ''}`}>
                                        <div className="flex items-center justify-between pb-6 sm:pb-10 border-b border-slate-50">
                                            <div className="flex items-center gap-4 sm:gap-8 min-w-0">
                                                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-red-50 text-red-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center font-black text-xl sm:text-3xl border border-red-100 shrink-0">
                                                    {roleName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl sm:text-3xl leading-none truncate">{roleName}</h3>
                                                    <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 truncate">Layer: <span className="text-red-600">{key}</span></p>
                                                </div>
                                            </div>
                                            <div className="hidden xs:flex flex-col items-end gap-2 shrink-0">
                                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-1 rounded-md">Online</span>
                                                <div className="w-8 sm:w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-background w-3/4 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                            {Object.values(PERMISSIONS).map((perm) => (
                                                <button
                                                    key={perm}
                                                    onClick={() => handleToggleGlobalPermission(roleName, perm)}
                                                    disabled={!isEditingPermissions || (key === 'SUPER_ADMIN' && perm === PERMISSIONS.ALL)}
                                                    className={`p-4 sm:p-6 border rounded-[1.5rem] sm:rounded-[2rem] text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-left flex items-center justify-between transition-all duration-500 group/perm ${currentPermissions[roleName]?.includes(perm)
                                                        ? 'bg-background text-foreground border-transparent shadow-lg -translate-y-1'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-red-500 hover:text-red-600'}`}
                                                >
                                                    <span className="truncate pr-2">{perm.split('_').pop()}</span>
                                                    {currentPermissions[roleName]?.includes(perm) ? <Check size={window.innerWidth < 640 ? 14 : 18} className="shrink-0" /> : <Unlock size={14} className="opacity-0 group-hover/perm:opacity-40 shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {view === 'growth_access' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="growth" className="space-y-8 sm:space-y-12">
                        <section className="bg-white text-slate-900 rounded-[2rem] sm:rounded-[4.5rem] p-8 sm:p-16 lg:p-24 relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.06)] border border-slate-100">
                            <div className="absolute top-0 right-0 p-8 sm:p-16 opacity-5 rotate-12 text-red-600 group">
                                <Target size={window.innerWidth < 640 ? 200 : 350} />
                            </div>
                            <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 sm:gap-12">
                                <div className="space-y-10 max-w-4xl text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Growth Hub Sub-System</span>
                                    </div>
                                    <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-slate-900">Provisioning <br /> Headquarters</h2>
                                    <p className="text-sm sm:text-2xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-8">Orchestrating specialized instructional leadership vectors through identity provisioning.</p>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center gap-6 bg-slate-50 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-inner w-full sm:w-auto">
                                    <div className="flex-1 sm:flex-none text-center sm:text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Active Licenses</p>
                                        <p className="text-3xl sm:text-6xl font-black text-slate-900 tabular-nums">429 <span className="text-sm sm:text-2xl font-medium text-slate-300">/ 500</span></p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
                            {users.map((user) => (
                                <Card key={user.id} className="p-8 sm:p-12 space-y-8 sm:space-y-10 group hover:border-red-500 transition-all duration-700 border border-slate-200 shadow-sm relative overflow-hidden bg-white rounded-[2rem] sm:rounded-[3.5rem] border-t-4 sm:border-t-8 border-t-transparent hover:border-t-red-500">
                                    <div className="absolute top-0 right-0 p-8 sm:p-10 opacity-[0.02] group-hover:opacity-[0.1] transition-all duration-700">
                                        <GraduationCap size={window.innerWidth < 640 ? 100 : 180} />
                                    </div>

                                    <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-100 pb-8 sm:pb-10">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 text-red-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center font-black text-2xl sm:text-3xl border border-red-100 shrink-0">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-slate-900 uppercase tracking-tighter text-xl sm:text-2xl leading-none truncate">{user.name}</p>
                                            <p className="text-[9px] sm:text-[10px] font-black text-red-600 uppercase tracking-widest mt-2 sm:mt-3 truncate">{user.role}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 sm:space-y-8">
                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 border-l-4 border-brand-500 pl-4 uppercase tracking-widest">Sub-Roles</p>
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {[
                                                { id: PERMISSIONS.GROWTH_ADMIN, label: 'Orchestrator', icon: Shield, color: 'text-rose-600 bg-rose-50' },
                                                { id: PERMISSIONS.GROWTH_LEADER, label: 'Vanguard', icon: Star, color: 'text-amber-600 bg-amber-50' },
                                                { id: PERMISSIONS.GROWTH_TEACHER, label: 'Practitioner', icon: GraduationCap, color: 'text-red-600 bg-red-50' }
                                            ].map(role => {
                                                const hasRole = (user.overrides || currentPermissions[user.role] || []).includes(role.id);
                                                return (
                                                    <button
                                                        key={role.id}
                                                        onClick={() => handleToggleUserPermission(user.id, role.id)}
                                                        className={`flex items-center justify-between p-5 sm:p-7 rounded-2xl sm:rounded-[2rem] border transition-all duration-500 ${hasRole ? `${role.color} border-transparent font-black shadow-md` : 'bg-white text-slate-600 border-slate-200 hover:border-red-500'}`}
                                                    >
                                                        <div className="flex items-center gap-4 sm:gap-5">
                                                            <role.icon size={window.innerWidth < 640 ? 18 : 22} />
                                                            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-black">{role.label}</span>
                                                        </div>
                                                        {hasRole && <Check size={18} className="shrink-0" />}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-8 sm:pt-10 border-t border-slate-50 flex items-center justify-between gap-4 group/toggle">
                                        <div className="min-w-0">
                                            <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hub License Access</span>
                                            <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1 truncate ${(user.overrides || currentPermissions[user.role] || []).includes(PERMISSIONS.GROWTH_HUB) ? 'text-red-600' : 'text-slate-300'}`}>
                                                Status: {(user.overrides || currentPermissions[user.role] || []).includes(PERMISSIONS.GROWTH_HUB) ? 'AUTHORIZED' : 'DEACTIVATED'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleUserPermission(user.id, PERMISSIONS.GROWTH_HUB)}
                                            className={`w-16 sm:w-20 h-8 sm:h-10 rounded-full transition-all relative shrink-0 ${(user.overrides || currentPermissions[user.role] || []).includes(PERMISSIONS.GROWTH_HUB) ? 'bg-red-600 shadow-xl shadow-red-600/20' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1.5 w-5 sm:w-7 h-5 sm:h-7 bg-white rounded-full transition-all duration-300 ${(user.overrides || currentPermissions[user.role] || []).includes(PERMISSIONS.GROWTH_HUB) ? 'left-9.5 sm:left-11.5 shadow-md' : 'left-1.5'}`}></div>
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {view === 'audit' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="audit" className="space-y-8 sm:space-y-12">
                        <section className="bg-background text-foreground rounded-[2rem] sm:rounded-[4.5rem] p-8 sm:p-20 relative overflow-hidden shadow-2xl border border-zinc-800">
                            <div className="absolute top-0 right-0 p-8 sm:p-16 opacity-[0.05] animate-pulse pointer-events-none">
                                <HistoryIcon size={window.innerWidth < 640 ? 150 : 240} />
                            </div>
                            <div className="relative z-10 space-y-4 sm:space-y-8 text-left">
                                <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.8]">Audit Protocols</h2>
                                <p className="text-sm sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">Full infrastructure-wide immutable record of identity state mutations.</p>
                            </div>
                        </section>

                        <div className="space-y-4 sm:space-y-6">
                            {[
                                { user: 'superadmin@ekya.edu', action: 'Update Matrix', target: 'SuperAdmin Role', time: '12:45:01 PM', status: 'Success', icon: ShieldCheck, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
                                { user: 'tech.manager@ekya.edu', action: 'Identity Purge', target: 'u-temp-429', time: '11:20:15 AM', status: 'Failed', icon: ShieldAlert, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
                                { user: 'principal.btm@ekya.edu', action: 'Node Spawn', target: 'Annual Sports 2026', time: '09:15:33 AM', status: 'Success', icon: ActivityIcon, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
                                { user: 'hr.manager@ekya.edu', action: 'Batch Provision', target: '12 Identities', time: '08:02:44 AM', status: 'Success', icon: Users, color: 'text-brand-500 bg-backgroundrand-500/10 border-brand-500/20' },
                                { user: 'superadmin@ekya.edu', action: 'Core Override', target: 'JP Nagar Node', time: '07:12:11 AM', status: 'Success', icon: Key, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                                { user: 'system.daemon', action: 'Periodic Sync', target: 'Growth Engine', time: '06:00:00 AM', status: 'Success', icon: RotateCcw, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
                            ].map((log, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="bg-white p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-red-500 transition-all duration-500 shadow-sm relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-6 sm:gap-10 w-full md:w-auto">
                                        <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center border-2 ${log.color} shrink-0`}>
                                            <log.icon size={window.innerWidth < 640 ? 20 : 30} />
                                        </div>
                                        <div className="space-y-1 sm:space-y-2 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <p className="font-black text-slate-900 uppercase tracking-tighter text-lg sm:text-2xl leading-none truncate">{log.action}</p>
                                                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${log.status === 'Success' ? 'bg-red-500 text-foreground' : 'bg-rose-500 text-foreground'}`}>
                                                    {log.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] sm:text-sm text-gray-400 font-bold uppercase tracking-widest truncate">{log.user}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 w-full md:w-auto flex items-end justify-between md:flex-col border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter leading-none">{log.time}</p>
                                            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Vector: <span className="text-red-600 truncate inline-block max-w-[100px] align-bottom">{log.target}</span></p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedUserForTools && (
                    <div className="fixed inset-0 bg-background/40 backdrop-blur-md z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-10" onClick={() => setSelectedUserForTools(null)}>
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            className="w-full max-w-4xl bg-white rounded-t-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-16 lg:p-24 relative shadow-2xl border-t sm:border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 sm:h-4 bg-background shrink-0" />
                            <button onClick={() => setSelectedUserForTools(null)} className="absolute top-6 sm:top-12 right-6 sm:right-12 p-3 sm:p-4 text-muted-foreground hover:bg-slate-50 rounded-2xl transition-all shrink-0"><X size={window.innerWidth < 640 ? 24 : 36} /></button>

                            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
                                <div className="mb-12 sm:mb-20 text-center relative pt-4 sm:pt-0">
                                    <div className="w-24 h-24 sm:w-40 sm:h-40 bg-red-50 text-red-600 border border-red-100 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center text-4xl sm:text-7xl font-black mx-auto mb-6 sm:mb-10 shadow-lg relative overflow-hidden">
                                        {selectedUserForTools.name.charAt(0)}
                                    </div>
                                    <h2 className="text-3xl sm:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">{selectedUserForTools.name}</h2>
                                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                                        <div className="flex items-center gap-2 sm:gap-3 bg-red-50 px-4 sm:px-8 py-2 sm:py-3 rounded-full border border-red-100">
                                            <Mail size={14} className="text-red-600" />
                                            <span className="text-[9px] sm:text-xs font-black text-red-700 uppercase tracking-widest">{selectedUserForTools.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 sm:space-y-8">
                                    <p className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-4">
                                        <Fingerprint size={18} className="text-red-600 shrink-0" />
                                        Identity Access Layers
                                    </p>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 py-2">
                                        {Object.values(PERMISSIONS).map(perm => (
                                            <button
                                                key={perm}
                                                onClick={() => handleToggleUserPermission(selectedUserForTools.id, perm)}
                                                className={`p-5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] border text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-left flex items-center justify-between transition-all duration-500 ${selectedUserForTools.overrides?.includes(perm) ? 'bg-background text-foreground border-transparent shadow-lg -translate-y-1' : 'bg-white text-slate-600 border-slate-200 hover:border-red-500'}`}
                                            >
                                                <span className="truncate pr-3">{perm.split('_').pop()}</span>
                                                {selectedUserForTools.overrides?.includes(perm) ? <Check size={20} className="shrink-0" /> : <Unlock size={14} className="opacity-0 group-hover:opacity-40 shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 shrink-0 pb-4 sm:pb-0">
                                <button onClick={() => setSelectedUserForTools(null)} className="flex-1 h-16 sm:h-24 bg-background text-foreground font-black rounded-2xl sm:rounded-3xl shadow-xl hover:bg-card active:scale-95 transition-all uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-3">
                                    Verify Changes
                                </button>
                                <button onClick={() => setSelectedUserForTools(null)} className="h-16 sm:h-24 px-8 sm:px-16 bg-slate-50 text-muted-foreground font-black rounded-2xl sm:rounded-3xl hover:bg-slate-100 active:scale-95 transition-all uppercase tracking-widest text-xs sm:text-sm">Close</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
