// @ts-nocheck
import { useAuth } from '../modules/auth/authContext';

export const useAuthHook = () => {
    const {
        user,
        login,
        logout,
        loading,
        requires2FA,
        tempToken,
        verify2FA,
        updateUser,
        sessionWarning,
        refreshSession
    } = useAuth();

    return {
        user,
        isAuthenticated: !!user,
        isLoading: loading,
        login,
        logout,
        requires2FA,
        tempToken,
        verify2FA,
        updateUser,
        sessionWarning,
        refreshSession,
        hasPermission: (permission) => {
            if (!user) return false;
            if (user.role === 'SuperAdmin') return true;
            return user.permissions?.includes(permission) || false;
        },
        hasAnyPermission: (permissions) => {
            if (!user) return false;
            if (user.role === 'SuperAdmin') return true;
            return permissions.some(p => user.permissions?.includes(p)) || false;
        },
        hasAllPermissions: (permissions) => {
            if (!user) return false;
            if (user.role === 'SuperAdmin') return true;
            return permissions.every(p => user.permissions?.includes(p)) || false;
        },
        isRole: (role) => {
            return user?.role === role;
        },
        isAdmin: () => {
            return ['SuperAdmin', 'ManagementAdmin', 'Admin'].includes(user?.role);
        },
        isTeacher: () => {
            return user?.role === 'TeacherStaff';
        },
        isGuest: () => {
            return user?.role === 'Guest';
        }
    };
};

export default useAuthHook;
