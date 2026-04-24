import React from "react";
import { User } from "@/services/userService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User as UserIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeacherSelectionProps {
    teachers: User[];
    onSelect: (teacher: User) => void;
}

import { useSearchParams } from "react-router-dom";

const TeacherSelection: React.FC<TeacherSelectionProps> = ({ teachers, onSelect }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = React.useState(searchParams.get("q") || "");
    const [academicFilter, setAcademicFilter] = React.useState(searchParams.get("academics") || "all");

    // Sync state to URL
    React.useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) params.set("q", searchTerm);
        else params.delete("q");

        if (academicFilter !== "all") params.set("academics", academicFilter);
        else params.delete("academics");

        setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, academicFilter]);

    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.department?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAcademic = academicFilter === "all" || t.academics === academicFilter;
        return matchesSearch && matchesAcademic;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10 h-10"
                        placeholder="Search teachers by name or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select value={academicFilter} onValueChange={setAcademicFilter}>
                        <SelectTrigger className="h-10">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="All Teachers" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Teachers</SelectItem>
                            <SelectItem value="CORE">Core Teachers</SelectItem>
                            <SelectItem value="NON_CORE">Non-Core Teachers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeachers.map((teacher) => (
                    <Card
                        key={teacher.id}
                        className="hover:border-primary cursor-pointer transition-colors shadow-sm group"
                        onClick={() => onSelect(teacher)}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                                <UserIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{teacher.fullName}</h4>
                                <p className="text-xs text-muted-foreground truncate">{teacher.department}</p>
                            </div>
                            <Badge variant={teacher.academics === 'CORE' ? 'default' : 'secondary'} className="text-[10px] whitespace-nowrap">
                                {teacher.academics === 'CORE' ? 'Core' : 'Non-Core'}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredTeachers.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">No teachers found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherSelection;
