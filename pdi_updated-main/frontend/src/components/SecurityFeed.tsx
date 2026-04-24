import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/api';
import { connectSocket } from '@/lib/socket';
import { useNavigate } from 'react-router-dom';

interface UserRequest {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  campusId?: string;
  department?: string;
}

export function SecurityFeed({ styles }: { styles?: any }) {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();

    const token = sessionStorage.getItem('auth_token');
    const socket = connectSocket(token || undefined);

    const handleUpdate = () => {
      fetchRequests();
    };

    socket.on('user:changed', handleUpdate);
    socket.on('security:access_request_resolved', handleUpdate);

    return () => {
      socket.off('user:changed', handleUpdate);
      socket.off('security:access_request_resolved', handleUpdate);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/users/unverified/list');
      if (res.data.status === 'success') {
        setRequests(res.data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch unverified users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, name: string) => {
    try {
      await api.patch(`/users/${id}/verify`);
      toast.success(`Access granted for ${name}`);
      // fetchRequests is called via socket
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleDeny = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deny access for ${name}? This will remove their application.`)) return;
    try {
      await api.delete(`/users/${id}/deny`);
      toast.warning(`Access denied for ${name}`);
      // fetchRequests is called via socket
    } catch (error) {
      toast.error('Failed to deny request');
    }
  };

  return (
    <div style={{ ...styles, height: '100%', overflow: 'hidden' }} className="bg-slate-900 p-6 flex flex-col gap-4 shadow-2xl rounded-[24px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-white/40">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          <span className="text-xs font-bold uppercase tracking-widest">Security Overview</span>
        </div>
        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] font-black tracking-widest">
          LIVE SYNC ACTIVE
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {/* Access Requests Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="w-3 h-3" /> Access Requests
            </span>
            <Badge className="bg-amber-500/20 text-amber-500 border-none font-bold text-[10px]">
              {requests.length} Pending
            </Badge>
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {requests.length === 0 ? (
              <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl border-dashed">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-white/40 font-medium">All clear! No pending access requests.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors capitalize">{req.fullName}</h4>
                      <p className="text-[10px] text-white/40 font-medium truncate max-w-[150px]">{req.email}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] bg-white/10 border-white/10 text-white/60 font-bold uppercase">
                      {req.role}
                    </Badge>
                  </div>

                  <div className="px-3 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl mb-3">
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Requesting <span className="text-indigo-400 font-bold">{req.role}</span> access 
                      {req.department ? <span> for <span className="text-white/80 font-semibold">{req.department}</span></span> : ""} 
                      {req.campusId ? <span> at the <span className="text-white/80 font-semibold">{req.campusId}</span> campus</span> : ""}.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-8 bg-emerald-600/90 hover:bg-emerald-500 text-white border-none text-[10px] font-bold rounded-xl"
                      onClick={() => handleVerify(req.id, req.fullName)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Accept
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-8 bg-white/5 hover:bg-red-900/40 text-white/60 hover:text-red-400 border border-white/10 text-[10px] font-bold rounded-xl"
                      onClick={() => handleDeny(req.id, req.fullName)}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" /> Deny
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {requests.length > 5 && (
            <Button 
                variant="ghost" 
                className="w-full text-[10px] text-white/30 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest h-8 rounded-xl"
                onClick={() => navigate('/admin/users')}
            >
                View all {requests.length} requests
            </Button>
          )}
        </div>

        {/* Audit Status Section (Simplified Static for now) */}
        <div className="pt-2">
          <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Audit Status
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-500 border-none font-bold text-[10px]">
              Clean
            </Badge>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
                <p className="text-xs text-white/70 font-bold">System Integrity</p>
                <p className="text-[10px] text-white/40 font-medium whitespace-nowrap">Last checked: Just now</p>
             </div>
          </div>
        </div>
      </div>

      <Button 
        className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl group"
        onClick={() => navigate('/admin/superadmin')}
      >
        Launch SuperAdmin Console
        <Search className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
