import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@pdi/components/ui/card";
import { ScrollArea } from "@pdi/components/ui/scroll-area";
import { Badge } from "@pdi/components/ui/badge";
import { Clock, ChevronRight, ChevronLeft, Copy, Check } from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { cn } from "@pdi/lib/utils";
import { toast } from "sonner";

interface Note {
    id: string;
    timestamp: string;
    text: string;
}

interface NotesReferencePanelProps {
    notes: Note[];
    className?: string;
}

export const NotesReferencePanel: React.FC<NotesReferencePanelProps> = ({ notes, className }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Note copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (notes.length === 0) return null;

    return (
        <div className={cn(
            "fixed right-4 top-24 z-50 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-12" : "w-80",
            className
        )}>
            <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md overflow-hidden h-[calc(100vh-120px)] flex flex-col">
                <CardHeader className="p-3 border-b bg-primary/5 flex flex-row items-center justify-between shrink-0">
                    {!isCollapsed && (
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Observation Notes
                        </CardTitle>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-8 w-8"
                    >
                        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                </CardHeader>
                
                {!isCollapsed && (
                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {notes.map((note) => (
                                    <div key={note.id} className="group relative bg-muted/30 p-3 rounded-lg border border-transparent hover:border-primary/20 transition-all">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge variant="secondary" className="text-[10px] font-mono">
                                                {note.timestamp}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => copyToClipboard(note.text, note.id)}
                                            >
                                                {copiedId === note.id ? <Check className="w-3 h-3 text-violet-500" /> : <Copy className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-foreground leading-relaxed">
                                            {note.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};
