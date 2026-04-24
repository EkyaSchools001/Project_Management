import { Request, Response, NextFunction } from 'express';
import prisma from '../../infrastructure/database/prisma';
import jwt from 'jsonwebtoken';



// ─── Cache Management ────────────────────────────────────────────────────────
// Short-lived cache to avoid DB lookup on every request
let cachedMatrix: any[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 10_000; // 10 seconds

/**
 * Immediately bust the cached matrix so the next request re-fetches from DB.
 * Called from settingsController when access_matrix_config is saved.
 */
export function invalidateAccessMatrixCache() {
    cachedMatrix = null;
    lastFetchTime = 0;
    console.log('[ACCESS-MATRIX] Cache invalidated — next request will re-fetch from DB');
}

// ─── Role Normalization ──────────────────────────────────────────────────────
// Must stay in sync with PermissionContext.tsx on the frontend
function normalizeRole(raw: string): string {
    if (!raw) return 'TEACHER';
    let role = raw.toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    if (role.includes('SCHOOL LEADER') || role === 'LEADER') return 'LEADER';
    if (role.includes('MANAGEMENT') || role === 'MANAGEMENT') return 'MANAGEMENT';
    if (role.includes('TEACHER') || role === 'TEACHER') return 'TEACHER';
    if (role.includes('ADMIN') || role.includes('ELC') || role.includes('PDI')) {
        if (role !== 'SUPERADMIN') return 'ADMIN';
    }
    if (role.includes('SUPERADMIN') || role === 'SUPERADMIN') return 'SUPERADMIN';
    if (role.includes('COORDINATOR') || role === 'COORDINATOR') return 'COORDINATOR';
    if (role.includes('TESTER') || role === 'TESTER') return 'TESTER';

    return 'TEACHER'; // Safe default
}

// ─── API Path → Module ID Mapping ────────────────────────────────────────────
// Maps the first recognizable path segment to its parent module ID.
// Module IDs match the moduleId column in the access matrix exactly.
const API_MODULE_MAP: Record<string, string> = {
    // ── Core Modules (1:1 with Matrix Module IDs) ────────────────────────────
    'users': 'users',
    'team': 'team',
    'forms': 'forms',
    'courses': 'courses',
    'calendar': 'calendar',
    'documents': 'documents',
    'reports': 'reports',
    'settings': 'settings',
    'attendance': 'attendance',
    'observations': 'observations',
    'observation': 'observations',
    'goals': 'goals',
    'hours': 'hours',
    'insights': 'insights',
    'meetings': 'meetings',
    'announcements': 'announcements',
    'survey': 'survey',
    'surveys': 'survey',
    'festival': 'festival',
    'festivals': 'festival',
    'okr': 'okr',
    'growth-analytics': 'growth-analytics',
    'assessments': 'assessments',
    'danielson': 'danielson',
    'quick-feedback': 'quick-feedback',
    'performing-arts': 'performing-arts',
    'life-skills': 'life-skills',
    'pe-obs': 'pe-obs',
    'va-obs': 'va-obs',
    'inst_identity': 'inst_identity',
    'acad_ops': 'acad_ops',
    'peda_learn': 'peda_learn',
    'prof_dev': 'prof_dev',
    'mgmt_support': 'mgmt_support',

    // ── Alias Routes → Unified Module ID ─────────────────────────────────────
    'mooc': 'courses',
    'participation': 'courses',
    'training': 'calendar',
    'analytics': 'insights',
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
    'institutional-identity': 'inst_identity',
    'academic-operations': 'acad_ops',
    'pedagogy-learning': 'peda_learn',
    'professional-development': 'prof_dev',
    'management-support': 'mgmt_support',
    'educator-hub': 'inst_identity',
    'edu-hub': 'inst_identity',
};


// ─── Paths that bypass access control entirely ───────────────────────────────
// These endpoints must be accessible to ALL authenticated (or unauthenticated) users
const BYPASS_PATHS = [
    '/auth',                             // Login, register, token refresh
    '/upload/public',                    // Public file uploads
    '/settings/access_matrix_config',    // Every role needs to read the permission matrix
    '/notifications',                    // Every role needs notifications
    '/templates',                        // All roles read templates (for observations/reflections)
    '/growth/observations',              // Handled by explicit route-level restrictTo middleware
    '/ptil/public/submit',               // Public submission for interaction logs
    '/stats/coordinator',                // Dedicated protected endpoint for coordinators
];

/**
 * Check if a request path should bypass access control.
 */
function shouldBypass(req: Request): boolean {
    const path = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;

    if (BYPASS_PATHS.some(bp => path.startsWith(bp))) {
        return true;
    }
    // Allow everyone (Authenticated) to read settings (needed for UI config and page content)
    if (req.method === 'GET' && (path === '/users' || path.startsWith('/settings'))) {
        return true;
    }
    return false;
}

// ─── Main Middleware ─────────────────────────────────────────────────────────
export const roleModuleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Bypass paths that every role needs
        if (shouldBypass(req)) {
            return next();
        }

        // 2. Extract JWT token
        let token: string | undefined;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // No token → let the route-level `protect` middleware handle it
        if (!token) {
            return next();
        }

        // 3. Decode token to get role (don't crash on invalid tokens)
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        } catch {
            return next(); // Invalid token → let `protect` middleware handle 401
        }

        const roleKey = normalizeRole(decoded.role || '');

        // 4. SuperAdmin bypasses ALL access control
        if (roleKey === 'SUPERADMIN') {
            return next();
        }

        // 4.5. Admin/Tester allowed to modify CMS/Page content settings without full System Settings access
        if (roleKey === 'ADMIN' || roleKey === 'TESTER') {
            if (req.method === 'POST' && req.path === '/settings/upsert') {
                const key = req.body?.key;
                if (key && typeof key === 'string' && (key.startsWith('page_') || key.startsWith('hr_'))) {
                    return next();
                }
            } else if (req.method === 'PUT' && req.path.startsWith('/settings/')) {
                const key = req.path.split('/settings/')[1];
                if (key && (key.startsWith('page_') || key.startsWith('hr_'))) {
                    return next();
                }
            }
        }

        // 5. Determine which module this API path belongs to
        const segments = req.path.split('/').filter(Boolean);
        let moduleId: string | undefined;

        for (const segment of segments) {
            if (API_MODULE_MAP[segment]) {
                moduleId = API_MODULE_MAP[segment];
                break;
            }
        }

        // Path doesn't map to any controlled module → allow through
        if (!moduleId) {
            return next();
        }

        // 6. Load access matrix (with cache)
        if (!cachedMatrix || (Date.now() - lastFetchTime > CACHE_TTL)) {
            try {
                const config = await prisma.systemSettings.findUnique({
                    where: { key: 'access_matrix_config' }
                });
                if (config) {
                    const parsed = JSON.parse(config.value);
                    cachedMatrix = parsed.accessMatrix || [];
                } else {
                    cachedMatrix = [];
                }
                lastFetchTime = Date.now();
            } catch (dbErr) {
                console.error('[ACCESS-MATRIX] DB fetch failed, allowing request:', dbErr);
                return next(); // Don't block users if DB is unreachable
            }
        }

        const matrix = cachedMatrix || [];

        // 7. Look up the module in the matrix
        const moduleEntry = matrix.find((m: any) => m.moduleId === moduleId);

        if (!moduleEntry) {
            // Module exists in code but not in the matrix → allow (new module, not yet configured)
            return next();
        }

        // 8. Check if this role has access
        console.log(`[ACCESS-MATRIX-DEBUG] roleKey="${roleKey}" moduleId="${moduleId}" roles=${JSON.stringify(moduleEntry.roles)} result=${moduleEntry.roles[roleKey]}`);
        if (moduleEntry.roles[roleKey] === true) {
            return next();
        }

        // 9. BLOCKED — role does not have access to this module
        console.warn(
            `[ACCESS-MATRIX] BLOCKED ${roleKey} → module "${moduleId}" (${moduleEntry.moduleName}) | path: ${req.method} ${req.path}`
        );

        return res.status(403).json({
            status: 'error',
            message: `Permission denied. Your role '${roleKey}' does not have access to '${moduleEntry.moduleName}'.`
        });

    } catch (err) {
        console.error('[ACCESS-MATRIX] Middleware error:', err);
        next(); // Don't block users on middleware errors
    }
};
