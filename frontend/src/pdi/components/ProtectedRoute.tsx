import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@pdi/hooks/useAuth';
import { useAccessControl } from '@pdi/hooks/useAccessControl';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'SUPERADMIN', 'ADMIN_OPS', 'ADMIN_FINANCE', 'ADMIN_HR', 'ADMIN_IT'];
const LEADER_ROLES = ['HOS', 'LEADER', 'SCHOOL_LEADER', 'COORDINATOR'];

const getDefaultPath = (role: string) => {
    if (ADMIN_ROLES.includes(role)) return '/departments/pd/admin';
    if (LEADER_ROLES.includes(role)) return '/departments/pd/leader';
    if (role === 'MANAGEMENT') return '/departments/pd/management';
    if (role === 'COORDINATOR') return '/departments/pd/coordinator';
    return '/departments/pd/teacher';
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { isModuleEnabled, isLoading: isMatrixLoading } = useAccessControl();
    const location = useLocation();

    if (isAuthLoading || isMatrixLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to={getDefaultPath(user.role)} replace />;
    }

    // Dynamic Access Matrix Check
    if (user && !isModuleEnabled(location.pathname, user.role)) {
        console.warn(`Access denied by SuperAdmin Matrix: ${location.pathname} for role ${user.role}`);
        return <Navigate to={getDefaultPath(user.role)} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
