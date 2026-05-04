import React, { useState, useEffect } from 'react';
import { 
  Shield, Search, Users, Lock, ChevronRight, Globe, Building, UserCheck, History,
  LayoutDashboard, Key, Bot, Tags, Layers, TableProperties, UserPlus, Database, FileText, CheckCircle2,
  Save, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { RF, AGENTS, MODULES, TEACH_TAGS, NONTEACH_TAGS, USERS, MX_DATA, PRINCIPLES, SCOPES } from './rbacData';

const TABS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'roles', name: 'Role families', icon: Key },
  { id: 'agents', name: 'Agents', icon: Bot },
  { id: 'subtags', name: 'Sub-tags & mapping', icon: Tags },
  { id: 'modules', name: '45 ERP modules', icon: Layers },
  { id: 'matrix', name: 'Access matrix', icon: TableProperties },
  { id: 'users', name: 'User directory', icon: Users },
  { id: 'assign', name: 'Assign role', icon: UserPlus },
  { id: 'schema', name: 'DB schema', icon: Database },
  { id: 'principles', name: 'Architecture principles', icon: FileText }
];

export default function RBACDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [campusFilter, setCampusFilter] = useState('ALL');
  const [mxGroupFilter, setMxGroupFilter] = useState('All modules');
  const [matrixData, setMatrixData] = useState(MX_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch matrix from backend on mount
  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const response = await api.get('/settings/access_matrix_config');
        if (response.data?.data?.setting) {
          const val = JSON.parse(response.data.data.setting.value);
          if (val.accessMatrix && Object.keys(val.accessMatrix).length > 0) {
            setMatrixData(val.accessMatrix);
          }
        }
      } catch (err) {
        console.error('Failed to fetch matrix:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatrix();
  }, []);

  const saveMatrix = async (newData) => {
    setIsSaving(true);
    try {
      await api.post('/settings', {
        key: 'access_matrix_config',
        value: { accessMatrix: newData }
      });
    } catch (err) {
      console.error('Failed to save matrix:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCell = (mod, col) => {
    const nextMatrix = { ...matrixData };
    const currentVal = nextMatrix[mod][col] || "—";
    let newVal = "—";
    
    if (currentVal.startsWith("✓")) newVal = "◆scoped";
    else if (currentVal.startsWith("◆")) newVal = "—";
    else newVal = "✓";
    
    nextMatrix[mod] = {
      ...nextMatrix[mod],
      [col]: newVal
    };
    
    setMatrixData(nextMatrix);
    saveMatrix(nextMatrix); // Auto-save on matrix change
  };

  const renderDashboard = () => (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-12 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: 'Role families', value: 4 },
          { label: 'Total roles', value: 16 },
          { label: 'ERP modules', value: 45 },
          { label: 'Agent types', value: 8 },
          { label: 'Campuses', value: 5 }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-primary/5 rounded-[2rem] p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-default">
            <div className="text-4xl font-black text-foreground mb-2 tracking-tighter group-hover:text-primary transition-colors">{stat.value}</div>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <div className="bg-white border border-primary/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em] border-l-2 border-primary/30 pl-4">Role Family Hierarchy</h3>
                <div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
                    <Key className="w-5 h-5 text-primary" />
                </div>
            </div>
            <div className="space-y-4">
              {Object.values(RF).flatMap(f => f.roles).map((r, i) => (
                <div key={i} className="flex items-center gap-5 py-4 px-6 rounded-2xl hover:bg-primary/[0.01] transition-all border border-transparent hover:border-primary/5 group/item" style={{ marginLeft: `${(r.level-1)*16}px` }}>
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm group-hover/item:scale-125 transition-transform" style={{ backgroundColor: Object.values(RF).find(f => f.roles.includes(r))?.color }} />
                  <span className={`text-sm tracking-tight uppercase ${r.level <= 3 ? 'font-black text-foreground group-hover/item:text-primary' : 'font-bold text-muted-foreground'} transition-colors`}>{r.name}</span>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border border-primary/10" style={{ backgroundColor: Object.values(RF).find(f => f.roles.includes(r))?.bg, color: Object.values(RF).find(f => f.roles.includes(r))?.tc }}>L{r.level}</span>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{r.scope}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-primary/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-10 border-l-2 border-primary/30 pl-4">Architectural Scope Model</h3>
            <div className="space-y-4">
              {SCOPES.map((s, i) => (
                <div key={i} className="flex items-center gap-6 py-5 px-6 rounded-2xl bg-primary/[0.01] border border-primary/5">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: s.c }} />
                  <span className="text-[11px] font-black text-foreground uppercase tracking-widest w-24">{s.s}</span>
                  <span className="text-[13px] font-medium text-muted-foreground tracking-tight leading-relaxed">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white border border-primary/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] h-full">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em] border-l-2 border-primary/30 pl-4">ERP Module Distribution</h3>
                <div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
                    <Layers className="w-5 h-5 text-primary" />
                </div>
            </div>
            <div className="space-y-8">
              {MODULES.map((g, i) => (
                <div key={i} className="group/mod">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-md shadow-sm" style={{ backgroundColor: g.gc }} />
                        <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{g.g}</span>
                    </div>
                    <span className="text-[11px] font-black text-primary tracking-widest">{g.mods.length} Modules</span>
                  </div>
                  <div className="h-2.5 bg-primary/[0.03] rounded-full overflow-hidden border border-primary/5 p-0.5">
                    <div className="h-full rounded-full transition-all duration-1000 group-hover/mod:brightness-110 shadow-[0_0_10px_rgba(0,0,0,0.05)]" style={{ width: `${Math.round(g.mods.length/8*100)}%`, backgroundColor: g.gc }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderRoles = () => (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-12 pb-12">
      {Object.entries(RF).map(([fid, f]) => (
        <div key={fid}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">{f.label}</h3>
            <div className="flex-1 h-px bg-primary/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {f.roles.map((r, i) => (
              <div key={i} className="bg-white border border-primary/5 rounded-[2rem] overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-pointer relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.01] rounded-full blur-2xl -translate-y-12 translate-x-12 group-hover:bg-primary/[0.03] transition-colors" />
                <div className="p-8 flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner shrink-0 transition-transform group-hover:scale-110 duration-500" style={{ backgroundColor: f.bg, color: f.tc }}>
                    {r.short}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-black text-foreground uppercase tracking-tight truncate group-hover:text-primary transition-colors">{r.name}</div>
                    <div className="text-[10px] font-bold text-muted-foreground leading-tight mt-1.5 line-clamp-1 opacity-60">{r.desc}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border border-primary/10" style={{ backgroundColor: f.bg, color: f.tc }}>L{r.level}</span>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{r.scope}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );

  const renderMatrix = () => {
    const cols = ["super_admin", "management", "hos", "coordinator", "teacher_core", "nonteach", "librarian", "medical", "parent", "student"];
    const colLabels = ["Super admin", "Management", "HoS", "Coordinator", "Teacher", "Non-teaching", "Librarian", "Medical", "Parent", "Student"];
    const colColors = ["#EA104A", "#1D9E75", "#D85A30", "#639922", "#888780", "#378ADD", "#444441", "#085041", "#D4537E", "#BA7517"];

    let filteredRows = Object.entries(matrixData);
    if (mxGroupFilter !== 'All modules') {
      const group = MODULES.find(m => m.g === mxGroupFilter);
      if (group) {
        filteredRows = filteredRows.filter(([k]) => group.mods.some(m => k.toLowerCase().includes(m.toLowerCase().split(' ')[0])));
      }
    }

    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-10 pb-12">
        <div className="flex flex-wrap gap-3 mb-4">
          <button onClick={() => setMxGroupFilter('All modules')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${mxGroupFilter === 'All modules' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-muted-foreground border-primary/10 hover:border-primary/30 hover:bg-primary/5'}`}>All modules</button>
          {MODULES.map(g => (
            <button key={g.g} onClick={() => setMxGroupFilter(g.g)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${mxGroupFilter === g.g ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-muted-foreground border-primary/10 hover:border-primary/30 hover:bg-primary/5'}`}>{g.g}</button>
          ))}
        </div>
        <div className="bg-white border border-primary/5 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-primary/[0.01] border-b border-primary/5">
                <tr>
                  <th className="px-10 py-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] sticky left-0 bg-white/95 backdrop-blur-md z-10 border-r border-primary/5">Module Registry</th>
                  {cols.map((c, i) => (
                    <th key={c} className="px-6 py-8 text-center min-w-[120px]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: colColors[i] }} />
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{colLabels[i].split(' ')[0]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={cols.length + 1} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                            <Shield className="absolute inset-0 m-auto w-6 h-6 text-primary opacity-50" />
                        </div>
                        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em] animate-pulse">Compiling Enterprise Permission Matrix...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRows.map(([mod, vals]) => (
                  <tr key={`row-${mod}`} className="hover:bg-primary/[0.01] transition-all group">
                    <td className="px-10 py-6 font-black text-foreground uppercase tracking-tight sticky left-0 bg-white/95 backdrop-blur-md group-hover:bg-primary/[0.01] z-10 border-r border-primary/5 transition-colors">{vals.label || mod}</td>
                    {cols.map((c, colIdx) => {
                      const v = vals[c] || "—";
                      return (
                        <td key={`${mod}-${c}`} className="px-6 py-6 text-center">
                          <button 
                            onClick={() => toggleCell(mod, c)}
                            disabled={isSaving}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all mx-auto shadow-sm ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95 bg-primary/5 border border-primary/10 hover:border-primary/40 hover:bg-primary/10'}`}
                            title={v}
                          >
                            {v.startsWith("✓") ? <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                            : v.startsWith("◆") ? <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
                            : <span className="text-muted-foreground/30 font-black tracking-tighter opacity-20">—</span>}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderUsers = () => {
    const q = searchQuery.toLowerCase();
    const filteredUsers = USERS.filter(u => {
      if(campusFilter !== 'ALL' && u.camp !== campusFilter && u.camp !== 'ALL') return false;
      if(q && !`${u.name}${u.email}${u.subj}${u.role}${u.tag}`.toLowerCase().includes(q)) return false;
      return true;
    });

    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, role, or campus credentials..."
              className="w-full bg-white border border-primary/10 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="bg-white border border-primary/10 rounded-2xl px-8 py-4 text-[11px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all cursor-pointer shadow-sm appearance-none min-w-[200px]"
          >
            <option value="ALL">Strategic Campus: ALL</option>
            <option value="CMRNPS">Campus: CMRNPS</option>
            <option value="EITPL">Campus: EITPL</option>
            <option value="EBYR">Campus: EBYR</option>
            <option value="EBTM">Campus: EBTM</option>
            <option value="ENICE">Campus: ENICE</option>
          </select>
        </div>
        <div className="bg-white border border-primary/5 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-primary/[0.01] border-b border-primary/5">
                <tr>
                  <th className="px-10 py-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Educator Credentials</th>
                  <th className="px-6 py-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Role Family</th>
                  <th className="px-6 py-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">System Role</th>
                  <th className="px-6 py-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Sub-tag Mapping</th>
                  <th className="px-6 py-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Strategic Hub</th>
                  <th className="px-6 py-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Domain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredUsers.map((u, i) => {
                  const rf = Object.values(RF).find(fv => fv.label.toLowerCase() === u.fam || fv.roles.some(r => r.name === u.role)) || {color:'#EA104A',bg:'#EA104A/5',tc:'#EA104A'};
                  return (
                    <tr key={`user-${u.email}-${i}`} className="hover:bg-primary/[0.01] transition-all group">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: rf.bg, color: rf.tc }}>
                            {u.name.split(' ').slice(0,2).map(w=>w[0]).join('')}
                          </div>
                          <div>
                            <p className="font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{u.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold tracking-widest opacity-60 mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-7"><span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border border-primary/10" style={{backgroundColor: rf.bg, color: rf.tc}}>{u.fam}</span></td>
                      <td className="px-6 py-7 text-muted-foreground font-black text-[10px] uppercase tracking-widest opacity-80">{u.role}</td>
                      <td className="px-6 py-7">{u.tag !== '—' ? <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm" style={{backgroundColor: rf.bg, color: rf.tc, borderColor: rf.color}}>{u.tag}</span> : <span className="text-muted-foreground/30 font-black tracking-tighter opacity-20">—</span>}</td>
                      <td className="px-6 py-7"><span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border border-primary/10 shadow-sm">{u.camp}</span></td>
                      <td className="px-6 py-7 text-muted-foreground font-black text-[10px] uppercase tracking-widest opacity-80">{u.subj}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderAssignRole = () => (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-3xl mx-auto space-y-12 py-16 pb-32">
      <div className="bg-white border border-primary/5 rounded-[3rem] p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.06)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-primary via-rose-500 to-primary/40" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/[0.02] rounded-full blur-[100px] group-hover:bg-primary/[0.05] transition-colors duration-1000" />
        
        <div className="flex items-center gap-6 mb-16 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm group-hover:scale-110 transition-transform duration-700">
                <UserPlus className="text-primary" size={32} />
            </div>
            <div>
                <h3 className="text-4xl font-black text-foreground tracking-tighter uppercase">Assign Strategic Role</h3>
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-2 opacity-60">Provisioning Enterprise Access Privileges</p>
            </div>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1 opacity-80">Target Educator Identity</label>
            <select className="w-full bg-primary/[0.02] border border-primary/10 rounded-2xl py-5 px-8 text-[13px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all cursor-pointer shadow-sm appearance-none">
              <option value="">Search by institutional email or identity...</option>
              {USERS.map(u => <option key={u.email} value={u.email}>{u.name} ({u.email})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1 opacity-80">Role Family Cluster</label>
                <select className="w-full bg-primary/[0.02] border border-primary/10 rounded-2xl py-5 px-8 text-[13px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all cursor-pointer shadow-sm appearance-none">
                  <option value="">Select organizational family...</option>
                  {Object.entries(RF).map(([k,f]) => <option key={k} value={k}>{f.label}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1 opacity-80">Designated System Role</label>
                <select className="w-full bg-primary/[0.02] border border-primary/10 rounded-2xl py-5 px-8 text-[13px] font-black text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all cursor-pointer shadow-sm appearance-none">
                  <option value="">Select authority level...</option>
                  {Object.values(RF).flatMap(f=>f.roles).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
          </div>

          <div className="space-y-6">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1 opacity-80">Domain / Subject-Matter Mapping</label>
            <div className="flex flex-wrap gap-4">
              {TEACH_TAGS.map((t, i) => (
                <button key={i} className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/5 hover:border-primary/40 transition-all bg-white text-muted-foreground shadow-sm hover:scale-105 active:scale-95 hover:bg-primary/5 hover:text-primary">
                  {t.tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-primary/5 flex flex-col sm:flex-row gap-6">
            <button className="flex-1 py-6 bg-primary text-white text-[12px] font-black uppercase tracking-[0.25em] rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-4 active:scale-[0.98] group/btn">
              <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Finalize System Assignment
            </button>
            <button className="px-12 py-6 bg-white border border-primary/10 text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary active:scale-[0.98]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'roles': return renderRoles();
      case 'matrix': return renderMatrix();
      case 'users': return renderUsers();
      case 'assign': return renderAssignRole();
      default: return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center h-[50vh] space-y-8 bg-white border border-primary/5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-center p-12">
          <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm animate-pulse">
            <Lock className="w-10 h-10 text-primary opacity-40" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Module Restricted</h3>
            <p className="text-muted-foreground text-sm font-medium mt-2 max-w-md mx-auto leading-relaxed">
              The <span className="text-primary font-black">{TABS.find(t=>t.id===activeTab)?.name}</span> administrative sector is currently undergoing infrastructure upgrades.
            </p>
          </div>
          <button onClick={() => setActiveTab('dashboard')} className="px-8 py-3 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm">Return to Hub</button>
        </motion.div>
      );
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen bg-[#FAFAFA] text-foreground font-sans relative overflow-hidden selection:bg-primary/10 selection:text-primary">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.01] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-10 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-[0_10px_20px_rgba(0,0,0,0.02)] transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500">
                <Shield size={28} className="text-primary" />
            </div>
            <div>
                <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">
                  Access Matrix <span className="text-primary">Control</span>
                </h1>
                <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">Role-Based Architecture Hub</span>
                    <div className="w-1 h-1 rounded-full bg-primary/30" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Enterprise v1.2</span>
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-primary/5 rounded-2xl border border-primary/10 shadow-sm transition-all text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary active:scale-95 group">
            <History className="w-5 h-5 text-primary opacity-60 group-hover:rotate-[-30deg] transition-transform" />
            <span>Audit Trail Registry</span>
          </button>
          <button 
            onClick={() => saveMatrix(matrixData)}
            disabled={isSaving}
            className="flex items-center gap-3 px-10 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all disabled:opacity-50 active:scale-95 group"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            <span>{isSaving ? 'Synchronizing...' : 'Commit System Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10 relative z-10">
        <div className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-white border border-primary/5 rounded-[2.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-8">
            <div className="px-6 py-4 border-b border-primary/5 mb-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Management Sectors</span>
            </div>
            <div className="space-y-1.5">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all group relative overflow-hidden ${
                    activeTab === tab.id 
                    ? 'bg-primary text-white font-black shadow-[0_15px_30px_rgba(234,16,74,0.25)]' 
                    : 'hover:bg-primary/5 text-muted-foreground hover:text-primary'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 transition-transform duration-500 ${activeTab === tab.id ? 'text-white' : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'}`} />
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">{tab.name}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTabIndicator" className="ml-auto">
                        <ChevronRight className="w-4 h-4 opacity-70" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-9 min-h-[70vh]">
          <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
