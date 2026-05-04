import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    School,
    Users,
    ShieldCheck,
    BarChart3,
    ListTodo,
    FileText,
    Layout,
    History,
    LogOut,
    Headset,
    ChevronDown,
    MapPin,
    Search as SearchIcon,
    Zap,
    Sparkles,
    Clock,
    Brain,
    GraduationCap,
    Award
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../modules/auth/authContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { PERMISSIONS } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }) => (
    <motion.div
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
    >
        <Link
            to={to}
            className={cn(
                "flex items-center gap-3 px-4 h-12 rounded-lg transition-all duration-200 mx-3 my-1 relative",
                active
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Icon className={cn("w-5 h-5 shrink-0 transition-all duration-200", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
            {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
        </Link>
    </motion.div>
);

export function Sidebar({ collapsed, mobileOpen, setMobileOpen }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { checkPermission } = useRoleAccess();

    useEffect(() => {
        if (setMobileOpen) setMobileOpen(false);
    }, [location.pathname, setMobileOpen]);

    const sections = [
        {
            title: 'Development',
            items: [
                { label: 'Growth Hub', icon: LayoutDashboard, to: '/dashboard', permission: null },
                { label: 'My Learning', icon: GraduationCap, to: '/lms', permission: null },
                { label: 'Observations', icon: Users, to: '/users', permission: PERMISSIONS.USER_MGMT },
                { label: 'Achievements', icon: Award, to: '/gamification', permission: null },
            ]
        },
        {
            title: 'Resources',
            items: [
                { label: 'Lesson Bank', icon: ListTodo, to: '/pms/tasks', permission: PERMISSIONS.TASKS },
                { label: 'Pedagogy Hub', icon: Brain, to: '/departments', permission: PERMISSIONS.DEPARTMENTS },
                { label: 'Faculty Directory', icon: Users, to: '/schools', permission: PERMISSIONS.SCHOOLS },
                { label: 'Case Studies', icon: FileText, to: '/pms/reports', permission: PERMISSIONS.REPORTS },
            ]
        },
        {
            title: 'Administration',
            items: [
                { label: 'Access Matrix', icon: ShieldCheck, to: '/rbac', permission: PERMISSIONS.USER_MGMT },
                { label: 'System Logs', icon: History, to: '/analytics', permission: PERMISSIONS.ANALYTICS },
                { label: 'Settings', icon: Zap, to: '/admin/tenants', permission: PERMISSIONS.USER_MGMT },
            ]
        },
        {
            title: 'Intelligence',
            items: [
                { label: 'AI Advisor', icon: Sparkles, to: '/ai', permission: null },
            ]
        }
    ];

    const filterItems = (items) => {
        return items; // Return all items as requested to keep sidebar constant
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-all duration-300 ease-out lg:translate-x-0 lg:static flex flex-col",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
                collapsed ? "lg:w-20" : "lg:w-72",
                "w-72 shadow-sm"
            )}
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <School size={22} />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground text-lg tracking-tight leading-none">SchoolOS</span>
                            <span className="text-xs font-semibold text-muted-foreground mt-1">{user?.fullName || user?.name || 'Ekya User'}</span>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-tighter mt-0.5">{user?.role?.replace(/_/g, ' ')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                {sections.map((section, idx) => {
                    const items = filterItems(section.items);
                    if (items.length === 0) return null;

                    return (
                        <div key={idx} className="mb-8">
                            {!collapsed && (
                                <p className="px-7 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {section.title}
                                </p>
                            )}
                            {items.map((item) => (
                                <SidebarItem
                                    key={item.to}
                                    {...item}
                                    active={location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to))}
                                    collapsed={collapsed}
                                />
                            ))}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-5 border-t border-border">
                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 h-12 rounded-lg text-muted-foreground font-medium text-sm transition-colors hover:bg-destructive/10 hover:text-destructive",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Log Out</span>}
                </button>
            </div>
        </aside>
    );
}
