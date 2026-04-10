import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/navigation/Sidebar';
import { useAuth } from '../../modules/auth/authContext';
import { Menu, Search, Bell, User, ChevronRight, LogOut, MessageCircle } from 'lucide-react';
import AIChatbot, { FloatingChatbotButton } from '../../modules/ai/components/AIChatbot';

export function DashboardLayout() {
    const context = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const location = useLocation();

    if (!context) {
        console.error('AuthProvider not found in component tree');
        return <div className="p-20 text-red-600 font-bold bg-red-50 text-center">Auth System Missing</div>;
    }
    const { user, loading, logout } = context;

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fc] gap-6">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest animate-pulse">Initializing System...</span>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="h-screen w-full flex bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <main className="flex-1 flex flex-col min-w-0 relative bg-background">
                <header className="h-16 sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-6 sm:px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 1024) {
                                    setMobileOpen(!mobileOpen);
                                } else {
                                    setCollapsed(!collapsed);
                                }
                            }}
                            className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <nav className="hidden xs:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
                            <ChevronRight size={14} className="text-border" />
                            <span className="text-foreground/70 truncate max-w-[150px]">{location.pathname.split('/')[1] || 'Core'}</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-4 pr-6 border-r border-border">
                            <div className="text-right mt-1">
                                <p className="text-sm font-bold text-foreground leading-none mb-1">{user.name}</p>
                                <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{user.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center font-black shadow-sm">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all relative group">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-card shadow-sm"></span>
                            </button>

                            <button
                                onClick={logout}
                                className="flex lg:hidden items-center p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative p-4">
                    <div className="w-full py-4">
                        <Outlet />
                    </div>
                </div>

                <FloatingChatbotButton onClick={() => setChatOpen(true)} />
                {chatOpen && <AIChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />}
            </main>
        </div>
    );
}

export default DashboardLayout;
