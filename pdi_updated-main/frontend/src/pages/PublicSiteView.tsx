import { useParams, Link } from "react-router-dom";
import DynamicDashboard from "@/components/DynamicDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe } from "lucide-react";

export default function PublicSiteView() {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Invalid Site ID</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mini-header for public site - can be toggled or styled differently */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Ekya Standalone Site</span>
                </div>
                <Button variant="ghost" size="sm" asChild className="gap-2">
                    <Link to="/login">
                        <ArrowLeft className="w-4 h-4" />
                        Portal Login
                    </Link>
                </Button>
            </header>

            <main className="container mx-auto py-8 px-4 max-w-7xl">
                <DynamicDashboard id={id} />
            </main>

            <footer className="py-12 border-t mt-12 bg-white">
                <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    <p>© 2026 Ekya Schools. All rights reserved.</p>
                    <p className="mt-1">Powered by PDI Platform Website Builder</p>
                </div>
            </footer>
        </div>
    );
}
