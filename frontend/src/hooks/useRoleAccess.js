import { useAuth } from '../modules/auth/authContext';
import { hasPermission, canAccessRoute } from '../utils/permissions';

export const useRoleAccess = () => {
    const { user } = useAuth();

    const checkPermission = (permission) => {
        if (!user) return false;
        return hasPermission(user.role, permission, user.overrides);
    };

    const checkRouteAccess = (routePermissions) => {
        if (!user) return false;
        return canAccessRoute(user.role, routePermissions, user.overrides);
    };

    return {
        user,
        role: user?.role,
        checkPermission,
        checkRouteAccess,
        isAdmin: user?.role === 'SuperAdmin' || user?.role === 'ManagementAdmin'
    };
};
