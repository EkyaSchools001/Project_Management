import { ROLES, PERMISSIONS } from './constants';

export const INITIAL_ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: [PERMISSIONS.ALL],
    [ROLES.MANAGEMENT]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.FINANCE,
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.ADMISSIONS,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ANALYTICS_BI,
        PERMISSIONS.AUDIT_LOG,
        PERMISSIONS.CANTEEN,
        PERMISSIONS.ASSET_MAINT,
        PERMISSIONS.REPORTS // legacy fallback
    ],
    [ROLES.HOS]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.FINANCE,
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.ADMISSIONS,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.LIBRARY,
        PERMISSIONS.TRANSPORT,
        PERMISSIONS.HEALTH_RECORDS,
        PERMISSIONS.ANALYTICS_BI,
        PERMISSIONS.SYSTEM_CONFIG,
        PERMISSIONS.AUDIT_LOG,
        PERMISSIONS.CANTEEN,
        PERMISSIONS.ASSET_MAINT,
        PERMISSIONS.REPORTS, // legacy fallback
        PERMISSIONS.GROWTH_LEADER // legacy fallback
    ],
    [ROLES.COORDINATOR]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ANALYTICS_BI,
        PERMISSIONS.GROWTH_HUB // legacy fallback
    ],
    [ROLES.TEACHER_CORE]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.LIBRARY,
        PERMISSIONS.HEALTH_RECORDS,
        PERMISSIONS.ASSET_MAINT,
        PERMISSIONS.GROWTH_TEACHER // legacy fallback
    ],
    [ROLES.TEACHER_SPECIALIST]: [
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.TEACHER_SENIOR]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.LIBRARY,
        PERMISSIONS.HEALTH_RECORDS,
        PERMISSIONS.ASSET_MAINT,
        PERMISSIONS.ANALYTICS_BI,
        PERMISSIONS.GROWTH_TEACHER // legacy fallback
    ],
    [ROLES.TEACHER_PARTTIME]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.ADMIN_OPS]: [
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.ADMISSIONS,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.ADMIN_FINANCE]: [
        PERMISSIONS.FINANCE
    ],
    [ROLES.ADMIN_HR]: [
        PERMISSIONS.HR_PAYROLL
    ],
    [ROLES.ADMIN_IT]: [
        PERMISSIONS.SYSTEM_CONFIG,
        PERMISSIONS.AUDIT_LOG
    ],
    [ROLES.LIBRARIAN]: [
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.LIBRARY,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.NURSE]: [
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.HEALTH_RECORDS,
        PERMISSIONS.CANTEEN,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.TRANSPORT_MGR]: [
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.TRANSPORT,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.CANTEEN_MGR]: [
        PERMISSIONS.HR_PAYROLL,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.CANTEEN,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.SECURITY]: [
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.SUPPORT_STAFF]: [
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ASSET_MAINT
    ],
    [ROLES.PARENT]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.FINANCE,
        PERMISSIONS.ADMISSIONS,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.TRANSPORT,
        PERMISSIONS.HEALTH_RECORDS,
        PERMISSIONS.CANTEEN
    ],
    [ROLES.STUDENT]: [
        PERMISSIONS.ACADEMICS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.FINANCE,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.LIBRARY,
        PERMISSIONS.TRANSPORT,
        PERMISSIONS.HEALTH_RECORDS,
        PERMISSIONS.CANTEEN
    ],
    [ROLES.AGENT]: [
        PERMISSIONS.ALL // Agents have scopes managed by endpoints, but at permission level they have ALL to enable whatever action they need
    ],

    // Legacy compatibility fallbacks
    [ROLES.MANAGEMENT_ADMIN]: [PERMISSIONS.ALL],
    [ROLES.ADMIN]: [PERMISSIONS.ACADEMICS, PERMISSIONS.ATTENDANCE, PERMISSIONS.HR_PAYROLL, PERMISSIONS.FINANCE, PERMISSIONS.SYSTEM_CONFIG],
    [ROLES.TEACHER_STAFF]: [PERMISSIONS.ACADEMICS, PERMISSIONS.ATTENDANCE, PERMISSIONS.HR_PAYROLL],
    [ROLES.GUEST]: [PERMISSIONS.VIEW_ONLY]
};

// Runtime permissions that can be modified by Super Admin
const getStoredPermissions = () => {
    try {
        const stored = localStorage.getItem('role_permissions');
        return stored ? JSON.parse(stored) : INITIAL_ROLE_PERMISSIONS;
    } catch {
        return INITIAL_ROLE_PERMISSIONS;
    }
};

export let rolePermissions = getStoredPermissions();

export const updateRolePermissions = (newPermissions) => {
    rolePermissions = newPermissions;
    localStorage.setItem('role_permissions', JSON.stringify(newPermissions));
    // In a real app, this would be an API call
};

export const hasPermission = (userRole, permission, userOverrides = null) => {
    // Check overrides first
    if (userOverrides && Array.isArray(userOverrides) && userOverrides.length > 0) {
        if (userOverrides.includes(PERMISSIONS.ALL)) return true;
        return userOverrides.includes(permission);
    }

    const permissions = rolePermissions[userRole] || [];
    if (permissions.includes(PERMISSIONS.ALL)) return true;
    return permissions.includes(permission);
};

export const canAccessRoute = (userRole, routePermissions, userOverrides = null) => {
    if (!routePermissions || routePermissions.length === 0) return true;

    // Check if user has ALL permission first (covers both overrides and role defaults)
    if (hasPermission(userRole, PERMISSIONS.ALL, userOverrides)) return true;

    if (typeof routePermissions === 'string') {
        return hasPermission(userRole, routePermissions, userOverrides);
    }

    return routePermissions.some(p => hasPermission(userRole, p, userOverrides));
};
