import React, { useState } from 'react';
import { User } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MyProfileCard } from './MyProfileCard';

export function ProfileTrigger() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-11 w-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-primary/20 transition-all shadow-sm overflow-hidden group">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
              <User size={20} weight="duotone" className="text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
        <MyProfileCard onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
