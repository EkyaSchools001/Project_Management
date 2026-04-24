import React from 'react';
import { useAuth as useSchoolOSAuth } from '@/modules/auth/authContext';
import { tokenService } from '@/services/token.service';

interface PDIUser {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'LEADER' | 'SCHOOL_LEADER' | 'TEACHER' | 'MANAGEMENT' | 'SUPERADMIN' | 'COORDINATOR' | 'TEACHERSTAFF' | 'TESTER';
    avatarUrl?: string;
    department?: string;
    campusId?: string;
    multi_campus?: boolean;
    campusAccess?: string;
    academics?: 'CORE' | 'NON_CORE';
}

/**
 * Bridge from SchoolOS auth → PDI auth shape.
 * All PDI pages import this hook. We normalise the role so existing
 * PDI role-guards continue to work correctly.
 */
export const useAuth = () => {
    const schoolOSAuth = useSchoolOSAuth() as any;
    const token = tokenService.getToken();

    // Sync token to sessionStorage for axios instances to pick up
    React.useEffect(() => {
        if (token) {
            sessionStorage.setItem('auth_token', token);
            // Also sync user data if possible
            if (schoolOSAuth?.user) {
                sessionStorage.setItem('user_data', JSON.stringify(schoolOSAuth.user));
            }
        }
    }, [token, schoolOSAuth?.user]);

    const schoolOSUser = schoolOSAuth?.user ?? null;

    // Normalise SchoolOS role names → PDI canonical role names
    const normaliseRole = (role?: string): PDIUser['role'] => {
        const r = (role || '').toUpperCase();
        if (r === 'TEACHERSTAFF' || r === 'TEACHER_STAFF') return 'TEACHER';
        if (r === 'SCHOOL_LEADER') return 'SCHOOL_LEADER';
        if (r === 'LEADER') return 'LEADER';
        if (r === 'ADMIN') return 'ADMIN';
        if (r === 'SUPERADMIN' || r === 'SUPER_ADMIN') return 'SUPERADMIN';
        if (r === 'MANAGEMENT' || r === 'MANAGEMENTADMIN') return 'MANAGEMENT';
        if (r === 'COORDINATOR') return 'COORDINATOR';
        if (r === 'TESTER') return 'TESTER';
        return 'TEACHER';
    };

    const pdiUser: PDIUser | null = schoolOSUser
        ? {
            id: schoolOSUser.id ?? '',
            fullName: (schoolOSUser as any).fullName ?? schoolOSUser.name ?? 'User',
            email: schoolOSUser.email ?? '',
            role: normaliseRole(schoolOSUser.role),
            avatarUrl: (schoolOSUser as any).avatarUrl ?? undefined,
            department: (schoolOSUser as any).department ?? undefined,
            campusId: (schoolOSUser as any).campusId ?? undefined,
            campusAccess: (schoolOSUser as any).campusAccess ?? undefined,
            multi_campus: (schoolOSUser as any).multi_campus ?? false,
            academics: (schoolOSUser as any).academics ?? undefined,
        }
        : null;

    // Provide no-op stubs for login/logout (handled by SchoolOS)
    return {
        user: pdiUser,
        token: (schoolOSAuth as any)?.token ?? sessionStorage.getItem('auth_token') ?? null,
        login: (_token: string, _user: PDIUser) => { /* managed by SchoolOS */ },
        logout: () => { (schoolOSAuth as any)?.logout?.(); },
        isAuthenticated: !!pdiUser,
        isLoading: (schoolOSAuth as any)?.loading ?? false,
    };
};

// Re-export AuthProvider as a passthrough (SchoolOS already provides auth)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <>{children}</>
);
