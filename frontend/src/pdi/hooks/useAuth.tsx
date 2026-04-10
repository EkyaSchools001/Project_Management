// @ts-nocheck
import React, { useContext } from 'react';
// Import from the main project's auth context
import { useAuth as useMainAuth } from '../../modules/auth/authContext';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'LEADER' | 'SCHOOL_LEADER' | 'TEACHER' | 'MANAGEMENT' | 'SUPERADMIN';
    avatarUrl?: string;
    department?: string;
    campusId?: string;
    campusAccess?: string;
    academics?: 'CORE' | 'NON_CORE';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const useAuth = (): AuthContextType => {
    const mainAuth = useMainAuth();
    
    return {
        user: mainAuth.user,
        token: localStorage.getItem('school_mgmt_token'),
        login: mainAuth.login,
        logout: mainAuth.logout,
        isAuthenticated: !!mainAuth.user,
        isLoading: mainAuth.loading,
    };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};
