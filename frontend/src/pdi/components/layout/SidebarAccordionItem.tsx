import { CaretDown } from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@pdi/lib/utils";
import { Button } from "../ui/button";

type IconComponent = any;

export interface SubModule {
    title: string;
    path: string;
    icon?: IconComponent;
    badge?: number;
}

export interface SidebarModule {
    title: string;
    icon: IconComponent;
    path?: string;
    subModules?: SubModule[];
}

interface SidebarAccordionItemProps {
    module: SidebarModule;
    isOpen: boolean;
    onToggle: () => void;
    collapsed: boolean;
    role: string;
}

export function SidebarAccordionItem({
    module,
    isOpen,
    onToggle,
    collapsed,
    role: _role,
}: SidebarAccordionItemProps) {
    const location = useLocation();
    const isDirectLink = !!module.path && (!module.subModules || module.subModules.length === 0);

    // Check if any sub-module is active or if the direct link is active
    const isActive = isDirectLink
        ? location.pathname === module.path
        : module.subModules?.some((sub) => {
            const rootPaths = ["/teacher", "/leader", "/admin", "/management"];
            return (
                location.pathname === sub.path ||
                (!rootPaths.includes(sub.path) && location.pathname.startsWith(sub.path))
            );
        });

    if (collapsed) {
        return (
            <div className="flex flex-col items-center py-2 group relative">
                {isDirectLink ? (
                    <NavLink
                        to={module.path!}
                        className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-[#BAFF00] text-black shadow-lg shadow-[#BAFF00]/20"
                                : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        <module.icon className="w-5 h-5 shrink-0" weight={isActive ? "fill" : "duotone"} size={20} />
                    </NavLink>
                ) : (
                    <div
                        className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-[#BAFF00] text-black shadow-lg shadow-[#BAFF00]/20"
                                : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        <module.icon className="w-5 h-5 shrink-0" weight={isActive ? "fill" : "duotone"} size={20} />
                    </div>
                )}

                {/* Hover Tooltip/Menu for Collapsed State */}
                <div className="absolute left-full ml-2 top-0 invisible group-hover:visible z-50 bg-sidebar border border-sidebar-border rounded-lg shadow-xl w-48 p-2">
                    <div className="px-2 py-1.5 text-xs font-bold text-sidebar-foreground border-b border-sidebar-border mb-1">
                        {module.title}
                    </div>
                    {isDirectLink ? (
                        <NavLink
                            to={module.path!}
                            className={cn(
                                "flex items-center justify-between gap-2 px-3 py-1.5 rounded-md text-xs transition-colors",
                                isActive
                                    ? "bg-[#BAFF00] text-black"
                                    : "text-foreground hover:bg-white/10"
                            )}
                        >
                            <span>Open {module.title}</span>
                        </NavLink>
                    ) : (
                        module.subModules?.map((sub) => (
                            <NavLink
                                key={sub.path}
                                to={sub.path}
                                className={cn(
                                    "flex items-center justify-between gap-2 px-3 py-1.5 rounded-md text-xs transition-colors",
                                    location.pathname === sub.path
                                        ? "bg-[#BAFF00] text-black"
                                        : "text-foreground hover:bg-white/10"
                                    )}
                            >
                                <span>{sub.title}</span>
                                {sub.badge ? (
                                    <span className="h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-foreground">
                                        {sub.badge}
                                    </span>
                                ) : null}
                            </NavLink>
                        ))
                    )}
                </div>
            </div>
        );
    }

    if (isDirectLink) {
        return (
            <NavLink
                to={module.path!}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                        ? "bg-[#BAFF00]/10 text-[#BAFF00]"
                        : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                )}
            >
                <div className="flex items-center gap-3">
                    <module.icon
                        className={cn(
                            "w-5 h-5 shrink-0 transition-transform",
                            isActive ? "text-[#BAFF00]" : "group-hover:scale-110 text-foreground/50"
                        )}
                        weight={isActive ? "fill" : "bold"}
                        size={18}
                    />
                    <span className={cn(
                        "text-sm truncate animate-in fade-in duration-300",
                        isActive ? "font-bold" : "font-semibold"
                    )}>
                        {module.title}
                    </span>
                </div>
            </NavLink>
        );
    }

    return (
        <div className="space-y-1">
            <Button
                variant="ghost"
                onClick={onToggle}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    "text-foreground/60 hover:bg-white/5 hover:text-foreground",
                    isActive && !isOpen && "bg-white/5 text-foreground",
                    isOpen && "bg-white/10 text-foreground"
                )}
            >
                <div className="flex items-center gap-3">
                    <module.icon
                        className={cn(
                            "w-5 h-5 shrink-0 transition-transform",
                            isActive ? "text-[#BAFF00]" : "text-foreground/50 group-hover:scale-110"
                        )}
                        weight={isActive ? "fill" : "bold"}
                        size={18}
                    />
                    <span className="text-sm font-semibold truncate animate-in fade-in duration-300">
                        {module.title}
                    </span>
                </div>
                <CaretDown
                    className={cn(
                        "w-4 h-4 transition-transform duration-200 text-sidebar-foreground/50",
                        isOpen && "rotate-180"
                    )}
                    weight="bold"
                />
            </Button>

            {isOpen && (
                <div className="pl-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {module.subModules?.map((sub) => {
                        const rootPaths = ["/teacher", "/leader", "/admin", "/management"];
                        const isSubActive =
                            location.pathname === sub.path ||
                            (!rootPaths.includes(sub.path) && location.pathname.startsWith(sub.path));

                        return (
                            <NavLink
                                key={sub.path}
                                to={sub.path}
                                className={cn(
                                    "flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                                    "text-foreground/40 hover:text-foreground hover:bg-white/5",
                                    isSubActive && "text-[#BAFF00] font-bold bg-[#BAFF00]/5 border-r-2 border-[#BAFF00]"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm regular truncate animate-in fade-in duration-300 mr-3">
                                        {sub.title}
                                    </span>
                                </div>
                                {sub.badge ? (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-foreground ring-2 ring-white">
                                        {sub.badge}
                                    </span>
                                ) : null}
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
