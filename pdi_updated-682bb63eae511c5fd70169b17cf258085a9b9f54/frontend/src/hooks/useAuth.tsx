import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'LEADER' | 'SCHOOL_LEADER' | 'TEACHER' | 'MANAGEMENT' | 'SUPERADMIN' | 'COORDINATOR' | 'TESTER';
    avatarUrl?: string;
    department?: string;
    campusId?: string;
    campusAccess?: string;
    multi_campus?: boolean;
    academics?: 'CORE' | 'NON_CORE';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Use sessionStorage so each tab has its own independent session.
        // This allows different users to be logged in simultaneously in different tabs.
        const storedToken = sessionStorage.getItem('auth_token');
        const storedUser = sessionStorage.getItem('user_data');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                // Reconnect socket with stored token
                connectSocket(storedToken);
            } catch (err) {
                console.error("Failed to parse stored user data", err);
                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('user_data');
                setToken(null);
                setUser(null);
            }
        } else {
            setToken(null);
            setUser(null);
        }

        setIsLoading(false);
    }, []);

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        // Store in sessionStorage — tab-scoped, not shared across tabs
        sessionStorage.setItem('auth_token', newToken);
        sessionStorage.setItem('user_data', JSON.stringify(userData));

        // Connect socket with auth token
        connectSocket(newToken);

        // Auto-redirect based on role
        if (userData.role === 'TEACHER') {
            navigate('/teacher');
        } else if (userData.role === 'LEADER' || userData.role === 'SCHOOL_LEADER') {
            navigate('/leader');
        } else if (userData.role === 'ADMIN' || userData.role === 'SUPERADMIN') {
            navigate('/admin');
        } else if (userData.role === 'MANAGEMENT') {
            navigate('/management');
        } else if (userData.role === 'COORDINATOR') {
            navigate('/coordinator');
        }
    };
    const logout = () => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_data');
        disconnectSocket();
        navigate('/login');
    };

    const contextValue = React.useMemo(() => ({
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [user, token, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
