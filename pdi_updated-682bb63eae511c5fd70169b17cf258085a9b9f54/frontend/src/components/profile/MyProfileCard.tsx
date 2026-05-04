import React, { useState } from 'react';
import { 
  User, 
  Envelope, 
  MapPin, 
  Buildings, 
  Calendar, 
  IdentificationCard,
  PencilSimple,
  Plus,
  CheckCircle,
  Flag,
  Trophy,
  Rocket,
  ArrowRight,
  X,
  UserGear,
  ShieldCheck,
  TrendUp
} from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface JourneyMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'joining' | 'promotion' | 'achievement' | 'project';
}

interface MyProfileCardProps {
  targetUser?: any; // If viewing another user
  onClose?: () => void;
}

export function MyProfileCard({ targetUser, onClose }: MyProfileCardProps) {
  const { user: currentUser } = useAuth();
  const profileUser = targetUser || currentUser;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profileUser });
  
  // Mock Journey Data
  const [journey, setJourney] = useState<JourneyMilestone[]>([
    { id: '1', date: 'June 2021', title: 'Joined Ekya Schools', description: 'Started as a Primary Educator at JP Nagar Campus.', type: 'joining' },
    { id: '2', date: 'August 2022', title: 'PDI Contributor', description: 'Contributed to the development of the Teacher Portal modules.', type: 'project' },
    { id: '3', date: 'May 2023', title: 'Coordinator Promotion', description: 'Promoted to Stage Coordinator for Grades 3-5.', type: 'promotion' },
    { id: '4', date: 'April 2024', title: 'Excellence Award', description: 'Received the "Innovator of the Year" award at Annual Day.', type: 'achievement' },
  ]);

  const userRole = currentUser?.role?.toUpperCase() || 'TEACHER';
  const isSuperAdmin = userRole === 'SUPERADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  const isManagement = userRole === 'MANAGEMENT';
  const isLeader = userRole === 'LEADER' || userRole === 'SCHOOL_LEADER';
  
  // RBAC logic for editing
  const canEdit = () => {
    if (isSuperAdmin) return true;
    if (isLeader && profileUser?.campusId === currentUser?.campusId && profileUser?.role === 'TEACHER') return true;
    if (profileUser?.id === currentUser?.id) return true;
    return false;
  };

  const canEditRole = isSuperAdmin;
  const isReadOnly = isManagement && profileUser?.id !== currentUser?.id;

  const handleSave = () => {
    // Implement API call here
    setIsEditing(false);
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'joining': return <Flag weight="fill" className="text-blue-500" />;
      case 'promotion': return <TrendUp weight="fill" className="text-emerald-500" />;
      case 'achievement': return <Trophy weight="fill" className="text-amber-500" />;
      case 'project': return <Rocket weight="fill" className="text-purple-500" />;
      default: return <CheckCircle weight="fill" className="text-slate-500" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
      {/* Header Banner */}
      <div className="h-22 bg-gradient-to-r from-primary via-[#EA104A] to-[#B80A37] relative">
        <div className="absolute top-4 right-6 flex gap-3">
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all">
              <X size={18} weight="bold" />
            </button>
          )}
        </div>
      </div>

      <CardContent className="px-6 pb-4 -mt-10 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar & Basic Info */}
          <div className="w-full md:w-[220px] space-y-3">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-22 h-22 rounded-2xl bg-white p-1 shadow-xl relative">
                <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                   {profileUser?.avatarUrl ? (
                     <img src={profileUser.avatarUrl} alt={profileUser.fullName} className="w-full h-full object-cover" />
                   ) : (
                     <User size={44} weight="duotone" className="text-slate-300" />
                   )}
                </div>
                {canEdit() && !isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-white rounded-lg shadow-lg hover:scale-110 transition-all"
                  >
                    <PencilSimple size={12} weight="bold" />
                  </button>
                )}
              </div>
              
              <div className="space-y-0">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">{profileUser?.fullName || profileUser?.name}</h2>
                <div className="flex items-center justify-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[8px]">
                    {profileUser?.role || 'Educator'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3 space-y-2.5 border border-slate-100">
              <div className="flex items-center gap-3 text-slate-500">
                <Envelope size={15} weight="duotone" className="text-primary/60" />
                <span className="text-[10px] font-bold truncate">{profileUser?.email || 'educator@ekyaschools.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Buildings size={15} weight="duotone" className="text-primary/60" />
                <span className="text-[10px] font-bold">{profileUser?.campus || 'Main Campus'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <IdentificationCard size={15} weight="duotone" className="text-primary/60" />
                <span className="text-[10px] font-bold">ID: {profileUser?.employeeId || 'EK-2021-042'}</span>
              </div>
            </div>
          </div>

          {/* Details & Journey */}
          <div className="flex-1 w-full space-y-6 pt-6">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-black">Edit Profile</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8 rounded-lg text-[10px] font-black uppercase px-2 text-slate-500 hover:text-black">Cancel</Button>
                      <Button size="sm" onClick={handleSave} className="h-8 bg-black hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase px-4 transition-colors">Save Changes</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-black pl-1">Full Name</Label>
                      <Input 
                        value={editData.fullName} 
                        onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                        className="h-10 rounded-lg border-slate-200 text-sm text-black focus:border-black focus:ring-black/5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-black pl-1">Campus</Label>
                      <Input 
                        value={editData.campus} 
                        onChange={(e) => setEditData({...editData, campus: e.target.value})}
                        className="h-10 rounded-lg border-slate-200 text-sm text-black focus:border-black focus:ring-black/5"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Bio/Intro Card */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-1.5 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">About Me</h3>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                      Passionately committed to fostering curiosity and critical thinking in early childhood education.
                    </p>
                  </div>

                  {/* My Journey Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">My Journey</h3>
                      {canEdit() && (
                        <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary/5 gap-2 px-4 h-8">
                          <Plus size={14} weight="bold" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Milestone</span>
                        </Button>
                      )}
                    </div>

                    <div className="relative pl-8 space-y-8 border-l-2 border-slate-100 ml-4">
                      {journey.slice(0, 4).map((item, idx) => (
                        <div key={item.id} className="relative">
                          <div className={cn(
                            "absolute -left-[45px] top-0 w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center z-10 transition-transform hover:scale-110"
                          )}>
                            {getMilestoneIcon(item.type)}
                          </div>
                          <div className="space-y-1 group">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                            <h4 className="font-bold text-slate-800">
                              {item.title}
                            </h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-lg">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>

      {/* Footer / Actions */}
      <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Account</span>
        </div>
        <div className="flex gap-4">
          <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Privacy</button>
          <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Support</button>
        </div>
      </div>
    </div>
  );
}
