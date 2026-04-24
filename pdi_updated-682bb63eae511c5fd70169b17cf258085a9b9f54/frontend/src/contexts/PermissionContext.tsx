import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { connectSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface PermissionSetting {
    moduleId: string;
    moduleName: string;
    roles: {
        SUPERADMIN: boolean;
        ADMIN: boolean;
        LEADER: boolean;
        MANAGEMENT: boolean;
        COORDINATOR: boolean;
        TEACHER: boolean;
        TESTER: boolean;
    };
}

export interface FormFlowConfig {
    id: string;
    formName: string;
    senderRole: string;
    targetDashboard: string;
    targetLocation: string;
}

interface PermissionContextType {
    matrix: PermissionSetting[];
    formFlows: FormFlowConfig[];
    isLoading: boolean;
    isModuleEnabled: (modulePath: string, role: string) => boolean;
    refreshConfig: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// ─── Default Access Matrix ───────────────────────────────────────────────────
// Used as fallback if the DB config hasn't been saved yet.
// Module IDs must match both the backend API_MODULE_MAP and the SuperAdmin UI.
// eslint-disable-next-line react-refresh/only-export-components
export const defaultAccessMatrix: PermissionSetting[] = [
    // ── Core Administration ──────────────────────────────────────────────────
    { moduleId: 'users', moduleName: 'User Management', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: false, TEACHER: false, TESTER: false } },
    { moduleId: 'team', moduleName: 'Team Overview', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'forms', moduleName: 'Form Templates', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: false, TEACHER: false, TESTER: false } },
    { moduleId: 'settings', moduleName: 'System Settings', roles: { SUPERADMIN: true, ADMIN: false, LEADER: false, MANAGEMENT: false, COORDINATOR: false, TEACHER: false, TESTER: false } },

    // ── Learning & Development ───────────────────────────────────────────────
    { moduleId: 'courses', moduleName: 'Course Catalogue', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'calendar', moduleName: 'Training Calendar', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'hours', moduleName: 'Training Hours Tracking', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'festival', moduleName: 'Learning Festival', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

    // ── Observations & Growth ────────────────────────────────────────────────
    { moduleId: 'observations', moduleName: 'Observations (General)', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: false } },
    { moduleId: 'danielson', moduleName: 'Danielson Framework Obs.', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'quick-feedback', moduleName: 'Quick Feedback Obs.', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'performing-arts', moduleName: 'Performing Arts Obs.', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'life-skills', moduleName: 'Life Skills Obs.', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'pe-obs', moduleName: 'Physical Education Obs.', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'va-obs', moduleName: 'Visual Arts Obs.', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: false, TESTER: false } },

    // ── Analytics & Goals ────────────────────────────────────────────────────
    { moduleId: 'growth-analytics', moduleName: 'Growth Analytics', roles: { SUPERADMIN: true, ADMIN: true, LEADER: false, MANAGEMENT: true, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'goals', moduleName: 'Goal Management', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'okr', moduleName: 'OKR / Progress Dashboard', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'portfolio', moduleName: 'Portfolio', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'reports', moduleName: 'Reports & Analytics', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: false, TESTER: false } },
    { moduleId: 'insights', moduleName: 'Data Insights', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'assessments', moduleName: 'Assessments', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

    // ── Operations & Engagement ──────────────────────────────────────────────
    { moduleId: 'attendance', moduleName: 'Attendance', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'meetings', moduleName: 'Meetings', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'announcements', moduleName: 'Announcements', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'survey', moduleName: 'Surveys', roles: { SUPERADMIN: true, ADMIN: true, LEADER: false, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'documents', moduleName: 'Documents', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'ai_assistant', moduleName: 'Ekya AI Assistant', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

    // ── Educator Hub ──────────────────────────────────────────────────────────
    { moduleId: 'edu-hub', moduleName: 'Home (Edu Hub)', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'who-we-are', moduleName: 'Who we are', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'my-campus', moduleName: 'My campus', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'teaching', moduleName: 'Teaching', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'my-classroom', moduleName: 'My classroom', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'interactions', moduleName: 'Interactions', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'tickets', moduleName: 'Tickets', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'grow', moduleName: 'Grow', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'culture-environment', moduleName: 'Culture & Environment', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'co-curricular', moduleName: 'Co-Curricular', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

    // ── HR & WellBeing ────────────────────────────────────────────────────────
    { moduleId: 'resources', moduleName: 'Resources', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'educator-essentials', moduleName: 'Educator Essentials', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'educator-guide', moduleName: 'Educator Guide', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'wellbeing', moduleName: 'WellBeing', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

    // ── Technology ────────────────────────────────────────────────────────────
    { moduleId: 'tech-sites-login', moduleName: 'Educator Site', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'greythr', moduleName: 'GreytHR', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'schoology', moduleName: 'Schoology', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'google-workspace', moduleName: 'Google Workspace', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'zoom', moduleName: 'Zoom', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'slack', moduleName: 'Slack', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'email-signature', moduleName: 'Email Signature Templates', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'ekyaverse', moduleName: 'Ekyaverse-Neverskip', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    { moduleId: 'audit-reports', moduleName: 'Audit & Reports', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
];

// ─── Frontend Path → Module ID Mapping ───────────────────────────────────────
// Maps sidebar/route path segments to the moduleId in the matrix.
// Must cover ALL path segments used by DashboardSidebar + ModuleGuard.
const FRONTEND_MODULE_MAP: Record<string, string> = {
    // ── Core Modules (1:1 with Matrix Module IDs) ────────────────────────────
    'users': 'users',
    'team': 'team',
    'forms': 'forms',
    'settings': 'settings',
    'courses': 'courses',
    'calendar': 'calendar',
    'documents': 'documents',
    'reports': 'reports',
    'attendance': 'attendance',
    'observations': 'observations',
    'goals': 'goals',
    'hours': 'hours',
    'insights': 'insights',
    'meetings': 'meetings',
    'announcements': 'announcements',
    'survey': 'survey',
    'festival': 'festival',
    'okr': 'okr',
    'portfolio': 'portfolio',
    'growth-analytics': 'growth-analytics',
    'assessments': 'assessments',
    'danielson': 'danielson',
    'quick-feedback': 'quick-feedback',
    'performing-arts': 'performing-arts',
    'life-skills': 'life-skills',
    'pe-obs': 'pe-obs',
    'va-obs': 'va-obs',

    // ── Alias Routes → Unified Module ID ─────────────────────────────────────
    'mooc': 'courses',
    'participation': 'courses',
    'training': 'calendar',
    'festivals': 'festival',
    'analytics': 'reports',
    'stats': 'reports',
    'performance': 'reports',
    'campus-performance': 'reports',
    'pd': 'hours',
    'pd-impact': 'hours',
    'templates': 'forms',
    'growth': 'observations',
    'observe': 'observations',
    'risk': 'observations',
    'danielson-framework': 'danielson',
    'performing-arts-obs': 'performing-arts',
    'life-skills-obs': 'life-skills',
    'pdi-health': 'insights',
    'pillars': 'goals',
    'leadership': 'team',
    'superadmin': 'settings',
    'profile': 'users',
    'assessment-analytics': 'reports',
    'edu-hub': 'edu-hub',
    'work-in-progress': 'edu-hub',
    'culture-environment': 'culture-environment',
    'co-curricular': 'co-curricular',
    'who-we-are': 'who-we-are',
    'my-campus': 'my-campus',
    'teaching': 'teaching',
    'my-classroom': 'my-classroom',
    'interactions': 'interactions',
    'tickets': 'tickets',
    'grow': 'grow',
    'resources': 'resources',
    'educator-essentials': 'educator-essentials',
    'educator-guide': 'educator-guide',
    'wellbeing': 'wellbeing',
    'tech-sites-login': 'tech-sites-login',
    'greythr': 'greythr',
    'schoology': 'schoology',
    'google-workspace': 'google-workspace',
    'zoom': 'zoom',
    'slack': 'slack',
    'email-signature': 'email-signature',
    'email-signature-templates': 'email-signature',
    'ekyaverse': 'ekyaverse',
    'audit': 'audit-reports',
    'audit-reports': 'audit-reports',
    'ai-assistant': 'ai_assistant',
    'chat': 'ai_assistant',
};

// ─── Role Normalization ──────────────────────────────────────────────────────
// Must stay in sync with backend accessControl.ts normalizeRole()
const normalizeRole = (raw: string | null | undefined): keyof PermissionSetting['roles'] | '' => {
    if (!raw) return 'TEACHER'; // Default to TEACHER if role is null/undefined/empty

    const role = raw.toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    if (role.includes('SCHOOL LEADER') || role === 'LEADER') return 'LEADER';
    if (role.includes('MANAGEMENT') || role === 'MANAGEMENT') return 'MANAGEMENT';
    if (role.includes('COORDINATOR') || role === 'COORDINATOR') return 'COORDINATOR';
    if (role.includes('TEACHER') || role === 'TEACHER') return 'TEACHER';
    if (role.includes('ADMIN') || role.includes('ELC') || role.includes('PDI')) {
        if (role !== 'SUPERADMIN') return 'ADMIN';
    }
    if (role === 'SUPERADMIN') return 'SUPERADMIN';
    if (role.includes('TESTER') || role === 'TESTER') return 'TESTER';

    return 'TEACHER';
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function PermissionProvider({ children }: { children: React.ReactNode }) {
    const { token, isLoading: authLoading, isAuthenticated } = useAuth();
    const [matrix, setMatrix] = useState<PermissionSetting[]>(defaultAccessMatrix);
    const [formFlows, setFormFlows] = useState<FormFlowConfig[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const isSyncing = React.useRef(false);
    const lastSyncedToken = React.useRef<string | null>(null);

    const syncPermissions = useCallback(async (authToken?: string | null) => {
        if (isSyncing.current) return;
        
        const activeToken = authToken || token || sessionStorage.getItem('auth_token');
        if (!activeToken) return;

        try {
            isSyncing.current = true;
            console.log('[PERMISSIONS] Fetching latest access matrix...');
            const response = await api.get('/settings/access_matrix_config');
            
            if (response.data.status === 'success' && response.data.data.setting) {
                const valueData = response.data.data.setting.value;
                let value: any = null;

                try {
                    value = typeof valueData === 'string' ? JSON.parse(valueData) : valueData;
                } catch (e) {
                    console.error('[PERMISSIONS] Failed to parse matrix configuration:', e);
                    return; 
                }

                if (value && value.accessMatrix) {
                    const mergedMatrix = defaultAccessMatrix.map(defaultItem => {
                        const loadedItem = value.accessMatrix.find((item: any) => item.moduleId === defaultItem.moduleId);
                        if (loadedItem) {
                            return {
                                ...defaultItem,
                                ...loadedItem,
                                roles: {
                                    SUPERADMIN: loadedItem.roles?.SUPERADMIN ?? defaultItem.roles.SUPERADMIN,
                                    ADMIN: loadedItem.roles?.ADMIN ?? defaultItem.roles.ADMIN,
                                    LEADER: loadedItem.roles?.LEADER ?? defaultItem.roles.LEADER,
                                    MANAGEMENT: loadedItem.roles?.MANAGEMENT ?? defaultItem.roles.MANAGEMENT,
                                    COORDINATOR: loadedItem.roles?.COORDINATOR ?? defaultItem.roles.COORDINATOR,
                                    TEACHER: loadedItem.roles?.TEACHER ?? defaultItem.roles.TEACHER,
                                    TESTER: loadedItem.roles?.TESTER ?? (defaultItem.roles as any).TESTER ?? false,
                                }
                            };
                        }
                        return defaultItem;
                    });

                    setMatrix(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(mergedMatrix)) return prev;
                        console.log('[PERMISSIONS] Matrix synced successfully');
                        return mergedMatrix;
                    });
                }
                
                if (value && value.formFlows) {
                    setFormFlows(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(value.formFlows)) return prev;
                        return value.formFlows;
                    });
                }
                
                // Track successful sync for this token
                lastSyncedToken.current = activeToken;
            }
        } catch (error: any) {
            if (error?.response?.status !== 401 && error?.response?.status !== 404) {
                console.error('[PERMISSIONS] Sync failed:', error);
            }
        } finally {
            setIsLoading(false);
            isSyncing.current = false;
        }
    }, [token]); // token is now a dependency to keep closure somewhat fresh, though we mostly use argument

    useEffect(() => {
        // Initial sync when token becomes available
        if (!authLoading && token && lastSyncedToken.current !== token) {
            syncPermissions(token);
        } else if (!authLoading && !token) {
            setIsLoading(false);
            lastSyncedToken.current = null;
        }

        // ── Real-time sync via Socket.io ──
        const socket = connectSocket(token || undefined);
        const handleSettingsUpdate = (data: { key: string }) => {
            if (data.key === 'access_matrix_config') {
                console.log('[PERMISSIONS] Socket update → reloading matrix...', data);
                toast.info("System configuration updated. Reloading interface...", {
                    duration: 3000,
                    icon: '🔄'
                });
                syncPermissions(token);
            }
        };
        socket.on('SETTINGS_UPDATED', handleSettingsUpdate);

        // ── Tab visibility fallback ──
        const handleVisibility = () => {
            if (document.visibilityState === 'visible' && token) {
                syncPermissions(token);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // ── Polling fallback (60s) ──
        const pollInterval = setInterval(() => {
            if (token) syncPermissions(token);
        }, 60_000);

        return () => {
            socket.off('SETTINGS_UPDATED', handleSettingsUpdate);
            document.removeEventListener('visibilitychange', handleVisibility);
            clearInterval(pollInterval);
        };
    }, [syncPermissions, authLoading, token]);

    // ─── Core Permission Check ───────────────────────────────────────────
    const isModuleEnabled = useCallback((modulePath: string, role: string): boolean => {
        if (!role) return false;

        const normalizedRole = normalizeRole(role);
        if (!normalizedRole) return false;

        // SuperAdmin always has access to everything
        if (normalizedRole === 'SUPERADMIN') return true;

        // Extract module ID from path segments (deepest-first for specificity)
        const segments = modulePath.split('/').filter(Boolean).reverse();
        let moduleId: string | undefined;

        for (const segment of segments) {
            if (FRONTEND_MODULE_MAP[segment]) {
                moduleId = FRONTEND_MODULE_MAP[segment];
                break;
            } else if (matrix.some(m => m.moduleId === segment)) {
                moduleId = segment;
                break;
            }
        }

        // Path doesn't map to any controlled module → allow (e.g. /teacher, /dashboard)
        if (!moduleId) return true;

        // Look up in active matrix
        const moduleEntry = matrix.find(m => m.moduleId === moduleId);

        if (!moduleEntry) {
            // Module exists in code but not yet in the matrix → allow
            return true;
        }

        return moduleEntry.roles[normalizedRole] === true;
    }, [matrix]);

    const contextValue = React.useMemo(() => ({
        matrix,
        formFlows,
        isLoading,
        isModuleEnabled,
        refreshConfig: syncPermissions
    }), [matrix, formFlows, isLoading, isModuleEnabled, syncPermissions]);

    return (
        <PermissionContext.Provider value={contextValue}>
            {children}
        </PermissionContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAccessControl() {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('useAccessControl must be used within a PermissionProvider');
    }
    return context;
}
