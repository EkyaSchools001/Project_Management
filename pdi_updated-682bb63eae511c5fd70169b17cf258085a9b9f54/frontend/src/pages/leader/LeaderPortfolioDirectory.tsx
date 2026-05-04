import { useState, useEffect } from "react";
import { User, Search, MapPin, Eye, BookOpen, Target, LogOut, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/hooks/useAuth";

interface TeacherProfile {
    id: string;
    fullName: string;
    email: string;
    role: string;
    campusId?: string;
    department?: string;
    _count?: {
        observations: number;
        goals: number;
    }
}

export function LeaderPortfolioDirectory() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                // Utilizing the new cross-role global search from integration API
                const resp = await api.get('/integration/search', {
                    params: { type: 'teacher' }
                });
                
                // Assuming it returns standard array or paginated objects mapping to `data.results`
                if (resp.data?.data?.results) {
                    setTeachers(resp.data.data.results as TeacherProfile[]);
                }
            } catch (error) {
                console.error("Failed to load portfolio directory", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter(t => 
        t.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <PageHeader 
                title="Teacher Portfolios" 
                subtitle="Review comprehensive professional development profiles across your campus." 
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-zinc-100">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search by name, email, or department..."
                        className="pl-9 h-11 bg-zinc-50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-8 px-3 rounded-full border-primary/20 text-primary bg-primary/5">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        Privileged Access
                    </Badge>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="animate-pulse bg-zinc-100 h-48 rounded-[1.5rem] border-none shadow-none"></Card>
                    ))}
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-zinc-200">
                    <User className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-zinc-800">No teachers found</h3>
                    <p className="text-sm text-zinc-500">Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map(teacher => (
                        <Card key={teacher.id} className="group overflow-hidden rounded-[1.5rem] border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white relative">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
                            
                            <CardContent className="p-6 relative z-10 flex flex-col h-full">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                                        {teacher.fullName?.charAt(0) || <User className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-900 truncate text-lg group-hover:text-primary transition-colors">
                                            {teacher.fullName}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mt-0.5">
                                            <Mail className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{teacher.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 space-y-2.5 flex-1">
                                    {teacher.department && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-100">
                                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                            <span className="truncate">{teacher.department}</span>
                                        </div>
                                    )}
                                    {teacher.campusId && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-100">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="truncate">{teacher.campusId}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-center group/stat cursor-help">
                                            <div className="text-xs font-black text-zinc-900">{teacher._count?.observations || 0}</div>
                                            <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold group-hover/stat:text-primary transition-colors">Obsv</div>
                                        </div>
                                        <div className="w-px h-6 bg-zinc-100" />
                                        <div className="text-center group/stat cursor-help">
                                            <div className="text-xs font-black text-zinc-900">{teacher._count?.goals || 0}</div>
                                            <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold group-hover/stat:text-primary transition-colors">Goals</div>
                                        </div>
                                    </div>

                                    <Button 
                                        size="sm" 
                                        className="rounded-xl font-bold bg-zinc-900 hover:bg-primary shadow-md hover:shadow-primary/20 transition-all font-white"
                                        onClick={() => navigate(`/leader/portfolio/${teacher.id}`)}
                                    >
                                        View Portfolio
                                        <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
