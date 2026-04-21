import { useState, useEffect, useRef } from 'react';
import { 
    Search, 
    ChevronDown, 
    Bot, 
    Send, 
    User, 
    X,
    Activity,
    Shield,
    Cpu,
    Target,
    Sparkles,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  issue: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  createdAt: Date;
  department?: string;
  assignedTo?: string;
  requester?: string;
  resolutionDays?: string;
}

export default function TicketingPortal() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // AI Chat State
  const [messages, setMessages] = useState<{id: string, type: 'user'|'bot', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userUrgency, setUserUrgency] = useState('LOW');
  const [resolutionDays, setResolutionDays] = useState('');
  const [reportDepartment, setReportDepartment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:8888/api/v1/tickets');
      const data = await res.json();
      if (data.tickets) {
        const parsed = data.tickets.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) }));
        setTickets(parsed);
      }
    } catch (err) {
      console.error("Failed fetching tickets:", err);
    }
  };

  useEffect(() => {
    if (isAIModalOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isAIModalOpen]);

  const handleAssignTicket = async (ticketId: string, field: 'department' | 'assignedTo' | 'status', value: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, [field]: value } : t));
    try {
      await fetch(`http://localhost:8888/api/v1/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      toast.success(`Ticket ${ticketId} updated securely!`);
    } catch (err) {
      toast.error(`Sync error: ${ticketId}`);
    }
  };

  const handleSendToAI = async () => {
    if (!inputValue.trim()) return;
    const userEmail = "admin@ekya.edu"; 
    const textToSend = inputValue;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: textToSend }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8888/api/v1/tickets/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          userEmail,
          department: reportDepartment,
          userUrgency,
          resolutionDays
        })
      });
      const data = await response.json();
      setIsTyping(false);

      if (data.ticketCreated) {
        toast.success(`INFRASTRUCTURE TICKET ${data.ticket.id} DEPLOYED!`);
        fetchTickets(); 
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: data.response
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: "CHANNEL INTERFERENCE DETECTED. RETRY PROTOCOL INITIATED."
      }]);
    }
  };

  const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Academics', 'Operations', 'Maintenance'];
  
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'HIGH': return <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 shadow-sm shadow-rose-100/50"><div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse shadow-glow shadow-rose-500"></div>Critical</span>;
      case 'MODERATE': return <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100"><div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>Elevated</span>;
      default: return <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-backgroundmerald-50 text-emerald-600 border border-emerald-100"><div className="w-1.5 h-1.5 rounded-full bg-backgroundmerald-600"></div>Nominal</span>;
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.issue.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-screen flex flex-col font-sans bg-white overflow-hidden relative">
      {/* High-Vibrancy Orbital Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px] animate-orbit pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[120px] animate-orbit-reverse pointer-events-none" />

      {/* Header Strategy */}
      <div className="bg-slate-950 p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shrink-0 border-b border-white/5 relative z-30 group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-slate-950 to-rose-900/20 opacity-60" />
        
        <div className="relative z-10 flex flex-col gap-6 text-center md:text-left max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center justify-center md:justify-start gap-4 px-6 py-2.5 bg-white/5 text-indigo-400 rounded-full border border-white/10 text-[11px] font-black uppercase tracking-[0.4em] backdrop-blur-xl"
          >
            <Shield size={16} /> Secure Triage Protocol Active
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-foreground uppercase tracking-tighter leading-none"
          >
            Support <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400">Terminal</span>
          </motion.h2>
          <p className="text-sm sm:text-lg text-foreground/40 font-medium tracking-tight">Systemic friction point resolution & pedagogical infrastructure orchestration.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full md:w-auto"
        >
          <button 
            onClick={() => {
              setIsAIModalOpen(true);
              if (messages.length === 0) {
                setMessages([{ id: '1', type: 'bot', text: "Neural Link Established. Please state the nature of your operational emergency." }]);
              }
            }}
            className="w-full md:w-auto flex items-center justify-center gap-4 bg-indigo-600 hover:bg-indigo-500 transition-all px-10 h-20 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] text-foreground shadow-2xl shadow-indigo-600/30 border border-white/10 relative group/btn overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            <Bot className="w-6 h-6 animate-pulse" />
            AI Auto-Triage Node
          </button>
        </motion.div>
      </div>

      {/* Toolbar Protocol */}
      <div className="bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-8 shrink-0 relative z-30">
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
          <div className="flex bg-slate-50 rounded-[1.5rem] p-1.5 border border-slate-100 w-full sm:w-auto shadow-inner">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl transition-all ${filterStatus === status ? 'bg-white shadow-2xl text-indigo-600 border border-slate-100' : 'text-muted-foreground hover:text-slate-600'}`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest px-8 border-l border-slate-200">
             <Activity size={18} className="text-indigo-400" />
             ACTIVE LOGS: <span className="text-slate-900">{filteredTickets.length} VECTORS</span>
          </div>
        </div>
        <div className="relative w-full lg:w-[450px] group">
          <Search className="w-5 h-5 text-slate-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN VECT-ID OR SUBJECT PROTOCOL..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-16 pr-8 h-14 bg-slate-50 border border-slate-100 rounded-3xl text-sm w-full focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-8 focus:ring-indigo-600/5 transition-all font-black uppercase tracking-widest placeholder:text-slate-200"
          />
        </div>
      </div>

      {/* Main Data Canvas */}
      <div className="flex-1 overflow-auto p-6 sm:p-12 relative z-10 custom-scrollbar">
        <div className="max-w-[1700px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto w-full no-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">
                    <th className="p-8 w-16 text-center">
                      <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-600" />
                    </th>
                    <th className="p-8">LINK_ID</th>
                    <th className="p-8 w-[25%]">LOGGED_OBJECTIVE</th>
                    <th className="p-8">ORIGINATOR</th>
                    <th className="p-8">SEVERITY</th>
                    <th className="p-8 text-center">RESOLUTION_SLA</th>
                    <th className="p-8">STATE</th>
                    <th className="p-8 text-right">PROTOCOL_OPS</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                      <td className="p-8 text-center">
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </td>
                      <td className="p-8">
                        <span className="font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-8 cursor-pointer tracking-tighter text-lg">{ticket.id}</span>
                      </td>
                      <td className="p-8">
                        <div className="space-y-1">
                          <p className="text-slate-950 font-black truncate max-w-sm text-base uppercase tracking-tight" title={ticket.issue}>
                            {ticket.issue}
                          </p>
                          <div className="flex gap-2">
                             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">{ticket.department || 'GLOBAL'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-black text-xs text-indigo-600 shrink-0 shadow-sm">
                            {ticket.requester ? ticket.requester.charAt(0) : 'A'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-900 text-[11px] font-black uppercase tracking-widest">{ticket.requester || 'Admin Node'}</span>
                            <span className="text-[9px] text-muted-foreground font-bold">LVL_7_AUTH</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        {getSeverityBadge(ticket.severity)}
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${Number(ticket.resolutionDays) <= 1 ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`}>
                            {ticket.resolutionDays || '---'} {ticket.resolutionDays ? (Number(ticket.resolutionDays) === 1 ? 'DAY' : 'DAYS') : 'UNSET'}
                          </span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${Number(ticket.resolutionDays) <= 1 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${Math.max(10, 100 - (Number(ticket.resolutionDays || 0) * 15))}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="relative">
                          <select 
                            className="text-[10px] font-black px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer focus:ring-0 uppercase tracking-widest text-slate-600 hover:bg-white hover:border-indigo-600 transition-all shadow-sm outline-none appearance-none pr-10"
                            value={ticket.status}
                            onChange={(e) => handleAssignTicket(ticket.id, 'status', e.target.value as any)}
                          >
                            <option value="OPEN">LINK_OPEN</option>
                            <option value="IN_PROGRESS">LINK_ACTIVE</option>
                            <option value="RESOLVED">LINK_CLOSED</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-muted-foreground hover:text-indigo-600 hover:shadow-xl transition-all"><Cpu size={20} /></button>
                           <button className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:shadow-xl transition-all"><Trash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTickets.length === 0 && (
              <div className="py-40 text-center bg-white space-y-8">
                <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto border border-slate-100 shadow-inner group">
                   <Target size={64} className="text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Zero-Friction State</h3>
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em]">All operational vectors are clear. No incidents detected.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* AI Assistant Chat Protocol - Mission Control UI */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-6" onClick={() => setIsAIModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.5)] w-full max-w-4xl overflow-hidden flex flex-col h-[850px] border border-white/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Terminal Header */}
              <div className="bg-slate-950 p-12 px-16 flex items-center justify-between shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-rose-600/10" />
                <div className="flex items-center gap-10 relative z-10">
                  <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 border-2 border-white/20 animate-pulse">
                    <Bot className="w-10 h-10 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-black text-4xl text-foreground uppercase tracking-tighter mb-2">Triage Terminal</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-backgroundmerald-500 animate-pulse shadow-glow shadow-emerald-500" />
                      <p className="text-indigo-400 text-[11px] uppercase tracking-[0.5em] font-black">Neural Uplink Synchronized</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsAIModalOpen(false)} className="w-16 h-16 flex items-center justify-center bg-white/10 hover:bg-white text-foreground/40 hover:text-slate-950 rounded-3xl transition-all active:scale-90 border border-white/10">
                  <X size={32} />
                </button>
              </div>
              
              {/* Chat Matrix Body */}
              <div className="flex-1 overflow-y-auto p-12 sm:p-20 bg-slate-50/30 flex flex-col gap-12 custom-scrollbar relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/2 via-transparent to-rose-500/2 pointer-events-none" />
                
                <div className="flex gap-8 max-w-[85%] relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-2xl">
                    <Sparkles className="w-7 h-7 text-indigo-500" />
                  </div>
                  <div className="bg-white border border-slate-100 p-8 rounded-[3rem] rounded-tl-none shadow-2xl shadow-slate-200/20 text-lg text-slate-800 font-medium leading-relaxed">
                    Uplink engaged. Describe the core friction point. I will execute a severity scan and initiate immediate technical escalation if thresholds are exceeded.
                  </div>
                </div>

                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={msg.id} 
                    className={`flex gap-8 max-w-[90%] relative z-10 ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-2xl transition-all ${msg.type === 'user' ? 'bg-backgroundackground border-white/20 text-foreground' : 'bg-white border-slate-50 text-indigo-600'}`}>
                      {msg.type === 'user' ? <User className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
                    </div>
                    <div className={`p-8 rounded-[3rem] text-lg font-medium shadow-2xl ${msg.type === 'user' ? 'bg-indigo-600 text-foreground rounded-tr-none shadow-indigo-600/10' : 'bg-white border border-slate-50 text-slate-800 rounded-tl-none shadow-slate-200/20'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-8 max-w-[80%] relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-50 flex items-center justify-center shrink-0 shadow-2xl">
                      <Bot className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="bg-white border border-slate-50 px-8 py-6 rounded-[2.5rem] rounded-tl-none shadow-2xl flex items-center gap-4">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce shadow-glow shadow-indigo-500/50" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Transmission Footer Protocol */}
              <div className="p-12 sm:p-16 bg-white border-t border-slate-100 shrink-0 flex flex-col gap-10 relative z-30">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1 w-full space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4">Node Context</label>
                    <select 
                      className="w-full h-20 text-[11px] font-black uppercase tracking-[0.2em] px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                      value={reportDepartment}
                      onChange={(e) => setReportDepartment(e.target.value)}
                    >
                      <option value="" disabled>IDENTIFY_VECT_DEPT...</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4">Urgency Vector</label>
                    <select 
                      className="w-full h-20 text-[11px] font-black uppercase tracking-[0.2em] px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                      value={userUrgency}
                      onChange={(e) => setUserUrgency(e.target.value)}
                    >
                      <option value="LOW">LOW_LATENCY</option>
                      <option value="MODERATE">MODERATE_IMPACT</option>
                      <option value="HIGH">CRITICAL_BLOCKER</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-48 space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4">SLA_CYCLES</label>
                    <input 
                      type="number" 
                      placeholder="DAYS" 
                      className="w-full h-20 text-[11px] font-black uppercase tracking-[0.2em] px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none"
                      value={resolutionDays}
                      onChange={(e) => setResolutionDays(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-slate-50 p-3 pl-10 rounded-[3rem] border border-slate-100 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-8 focus-within:ring-indigo-600/5 transition-all group shadow-inner">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 font-bold placeholder:text-slate-200 placeholder:text-[11px] placeholder:font-black placeholder:uppercase placeholder:tracking-[0.5em] text-lg h-20"
                    placeholder="INITIATING_DIAGNOSTIC_PROTOCOL..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendToAI()}
                  />
                  <button 
                    onClick={handleSendToAI}
                    disabled={!inputValue.trim() || isTyping}
                    className="h-20 w-20 bg-indigo-600 text-foreground rounded-[2rem] shadow-2xl shadow-indigo-600/30 disabled:opacity-50 transition-all hover:bg-indigo-500 flex items-center justify-center active:scale-90 group/send"
                  >
                    <Send size={32} className="group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
