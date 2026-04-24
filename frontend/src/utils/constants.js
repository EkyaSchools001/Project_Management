export const ROLE_FAMILIES = {
    ACADEMIC: 'academic',
    NON_TEACHING: 'nonteaching',
    LEADERSHIP: 'leadership',
    STAKEHOLDER: 'stakeholder',
    AGENT: 'agent'
};

export const ROLES = {
    // Leadership
    SUPER_ADMIN: 'SUPER_ADMIN',
    MANAGEMENT: 'MANAGEMENT',
    HOS: 'HOS',
    COORDINATOR: 'COORDINATOR',
    
    // Academic
    TEACHER_CORE: 'TEACHER_CORE',
    TEACHER_SPECIALIST: 'TEACHER_SPECIALIST',
    TEACHER_SENIOR: 'TEACHER_SENIOR',
    TEACHER_PARTTIME: 'TEACHER_PARTTIME',
    
    // Non-teaching
    ADMIN_OPS: 'ADMIN_OPS',
    ADMIN_FINANCE: 'ADMIN_FINANCE',
    ADMIN_HR: 'ADMIN_HR',
    ADMIN_IT: 'ADMIN_IT',
    LIBRARIAN: 'LIBRARIAN',
    NURSE: 'NURSE',
    TRANSPORT_MGR: 'TRANSPORT_MGR',
    CANTEEN_MGR: 'CANTEEN_MGR',
    SECURITY: 'SECURITY',
    SUPPORT_STAFF: 'SUPPORT_STAFF',
    
    // Stakeholder
    PARENT: 'PARENT',
    STUDENT: 'STUDENT',

    // Agents
    AGENT: 'AGENT',

    // Legacy roles mapping for backward compatibility
    MANAGEMENT_ADMIN: 'MANAGEMENT',
    ADMIN: 'HOS',
    TEACHER_STAFF: 'TEACHER_CORE',
    GUEST: 'PARENT'
};

export const PERMISSIONS = {
    ALL: '*',
    ACADEMICS: 'academics',
    ATTENDANCE: 'attendance',
    FINANCE: 'finance',
    HR_PAYROLL: 'hr_payroll',
    ADMISSIONS: 'admissions',
    COMMUNICATION: 'communication',
    LIBRARY: 'library',
    TRANSPORT: 'transport',
    HEALTH_RECORDS: 'health_records',
    ANALYTICS_BI: 'analytics_bi',
    SYSTEM_CONFIG: 'system_config',
    AUDIT_LOG: 'audit_log',
    CANTEEN: 'canteen',
    ASSET_MAINT: 'asset_maint',

    // PDI/Legacy fallbacks mapped to standard ones where possible
    DEPARTMENTS: 'departments',
    SCHOOLS: 'schools',
    ANALYTICS: 'analytics_bi',
    MANAGEMENT: 'management',
    USER_MGMT: 'system_config',
    GROWTH_HUB: 'academics',
    GROWTH_ADMIN: 'academics',
    GROWTH_LEADER: 'academics',
    GROWTH_TEACHER: 'academics',
    FORMS: 'academics',
    OBSERVATIONS: 'academics',
    FEEDBACK: 'communication',
    PM_TOOLS: 'academics',
    PROJECTS: 'academics',
    TASKS: 'academics',
    REPORTS: 'analytics_bi',
    CALENDAR: 'academics',
    CHAT: 'communication',
    AUDIT_LOGS: 'audit_log',
    DATA_ENGINE: 'analytics_bi',
    SETTINGS: 'system_config',
    VIEW_ONLY: 'viewOnly'
};
