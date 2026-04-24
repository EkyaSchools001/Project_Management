import { useAuth } from '../modules/auth/authContext';
import { hasPermission, canAccessRoute } from '../utils/permissions';

export const useRoleAccess = () => {
    const { user } = useAuth();

    const checkPermission = (permission) => {
        if (!user) return false;
        const normalizedRole = user.role?.toUpperCase().replace(/\s+/g, '_');
        return hasPermission(normalizedRole, permission, user.overrides);
    };

    const checkRouteAccess = (routePermissions) => {
        if (!user) return false;
        const normalizedRole = user.role?.toUpperCase().replace(/\s+/g, '_');
        return canAccessRoute(normalizedRole, routePermissions, user.overrides);
    };

    const normalizedRole = user?.role?.toUpperCase().replace(/\s+/g, '_');

    return {
        user,
        role: normalizedRole,
        checkPermission,
        checkRouteAccess,
        isAdmin: normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'MANAGEMENT'
    };
};
