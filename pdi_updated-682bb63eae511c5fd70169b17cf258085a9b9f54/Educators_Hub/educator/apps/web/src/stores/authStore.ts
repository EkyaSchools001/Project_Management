import { create } from 'zustand';

export type UserSession = {
  id: string;
  email: string;
  role: 'teacher' | 'hos' | 'admin' | 'management' | 'superadmin';
  campusId?: string;
  teacherId?: string;
  token: string;
};

export type AuthState = {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));
