import { ROLES, PERMISSIONS } from './constants';

export const INITIAL_ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: [PERMISSIONS.ALL],
    [ROLES.MANAGEMENT_ADMIN]: [
        PERMISSIONS.DEPARTMENTS,
        PERMISSIONS.SCHOOLS,
        PERMISSIONS.ANALYTICS,
        PERMISSIONS.REPORTS,
        PERMISSIONS.GROWTH_HUB,
        PERMISSIONS.GROWTH_ADMIN,
        PERMISSIONS.PM_TOOLS,
        PERMISSIONS.PROJECTS,
        PERMISSIONS.TASKS,
        PERMISSIONS.CALENDAR,
        PERMISSIONS.CHAT,
        PERMISSIONS.USER_MGMT
    ],
    [ROLES.ADMIN]: [
        PERMISSIONS.DEPARTMENTS,
        PERMISSIONS.SCHOOLS,
        PERMISSIONS.PROJECTS,
        PERMISSIONS.TASKS,
        PERMISSIONS.REPORTS,
        PERMISSIONS.CALENDAR,
        PERMISSIONS.CHAT,
        PERMISSIONS.PM_TOOLS,
        PERMISSIONS.GROWTH_HUB,
        PERMISSIONS.GROWTH_LEADER,
        PERMISSIONS.USER_MGMT
    ],
    [ROLES.TEACHER_STAFF]: [
        PERMISSIONS.SCHOOLS,
        PERMISSIONS.PROJECTS,
        PERMISSIONS.TASKS,
        PERMISSIONS.CALENDAR,
        PERMISSIONS.CHAT,
        PERMISSIONS.GROWTH_HUB,
        PERMISSIONS.GROWTH_TEACHER,
        PERMISSIONS.PM_TOOLS
    ],
    [ROLES.GUEST]: [
        PERMISSIONS.VIEW_ONLY,
        PERMISSIONS.SCHOOLS
    ]
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
