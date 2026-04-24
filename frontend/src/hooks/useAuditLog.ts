import { useCallback } from 'react';
import { useAuth } from '../modules/auth/authContext';
import api from '../pdi/lib/api';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'GRANT' | 'REVOKE' | 'AGENT_RUN';
export type AuditModule = 'ACADEMICS' | 'ATTENDANCE' | 'FINANCE' | 'HR_PAYROLL' | 'ADMISSIONS' | 'COMMUNICATION' | 'LIBRARY' | 'TRANSPORT' | 'HEALTH_RECORDS' | 'ANALYTICS_BI' | 'SYSTEM_CONFIG' | 'AUDIT_LOG' | 'CANTEEN' | 'ASSET_MAINT' | 'AUTH' | 'PDI' | 'AGENT';

export interface AuditLogData {
    action: AuditAction;
    module: AuditModule;
    resourceId?: string;
    details?: Record<string, any>;
    status?: 'SUCCESS' | 'FAILURE' | 'PENDING';
}

export const useAuditLog = () => {
    const { user, sessionId } = useAuth();

    const logAction = useCallback(async (data: AuditLogData) => {
        try {
            const payload = {
                ...data,
                userId: (user as any)?.id,
                userRole: (user as any)?.role,
                sessionId: sessionId,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            // Non-blocking fire-and-forget for UI performance
            api.post('/audit-logs', payload).catch(err => {
                console.error('[Audit Log] Failed to record action:', err);
            });
        } catch (error) {
            console.error('[Audit Log] Serialization error:', error);
        }
    }, [user, sessionId]);

    return { logAction };
};
