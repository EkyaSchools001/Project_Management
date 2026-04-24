import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
    const isAssistant = role === 'assistant';

    const formatContent = (text: string) => {
        return text.split('\n').map((line, i) => {
            if (line.trim() === '') return <br key={i} />;

            // Handle bold text (e.g., **text**)
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                    {parts.map((part, index) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <div className={cn(
            "flex w-full gap-3 mb-4 animate-in fade-in slide-in-from-bottom-1 duration-300",
            isAssistant ? "justify-start" : "justify-end"
        )}>
            {isAssistant && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
            )}
            
            <div className={cn(
                "max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm",
                isAssistant 
                    ? "bg-white border border-indigo-100 text-slate-700 rounded-tl-none" 
                    : "bg-indigo-600 text-white rounded-tr-none"
            )}>
                {formatContent(content)}
            </div>

            {!isAssistant && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 shadow-sm border border-slate-300">
                    <User className="w-4 h-4 text-slate-600" />
                </div>
            )}
        </div>
    );
}
