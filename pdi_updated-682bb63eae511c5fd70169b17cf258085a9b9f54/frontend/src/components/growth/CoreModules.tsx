import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CoreModulesProps {
    teacherId?: string;
    teacherName?: string;
    teacherEmail?: string;
}

const CoreModules: React.FC<CoreModulesProps> = ({ teacherId, teacherName, teacherEmail }) => {
    const navigate = useNavigate();

    const getPath = (basePath: string) => {
        const params = new URLSearchParams();
        if (teacherId) params.set("teacherId", teacherId);
        if (teacherName) params.set("teacherName", teacherName);
        if (teacherEmail) params.set("teacherEmail", teacherEmail);
        const queryString = params.toString();
        return queryString ? `${basePath}?${queryString}` : basePath;
    };

    const modules = [
        {
            title: "Unified Observation System",
            description: "Structured cluster-based observations and scheduled reviews.",
            icon: Eye,
            path: getPath("/leader/observations/schedule"),
            color: "bg-blue-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
                <Card key={module.title} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className={`p-3 rounded-xl ${module.color} text-white group-hover:scale-110 transition-transform`}>
                            <module.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{module.title}</CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full justify-between"
                            variant="outline"
                            onClick={() => navigate(module.path)}
                        >
                            Access Module
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CoreModules;
