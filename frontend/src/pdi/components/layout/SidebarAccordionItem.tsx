import { CaretDown } from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@pdi/lib/utils";
import { Button } from "../ui/button";
import React from "react";

type IconComponent = React.ComponentType<{ className?: string; size?: string | number; weight?: any }>;

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
    role,
}: SidebarAccordionItemProps) {
    const location = useLocation();
    const isDirectLink = !!module.path && (!module.subModules || module.subModules.length === 0);

    // Check if any sub-module is active or if the direct link is active
    const isActive = isDirectLink
        ? location.pathname === module.path
        : module.subModules?.some((sub) => {
            const rootPaths = [
                "/departments/pd/teacher", 
                "/departments/pd/leader", 
                "/departments/pd/admin", 
                "/departments/pd/management", 
                "/departments/pd/hr",
                "/teacher",
                "/leader",
                "/admin",
                "/management",
                "/hr"
            ];
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
                            "p-3 rounded-2xl transition-all duration-500",
                            isActive
                                ? "bg-primary text-white shadow-xl shadow-primary/30 rotate-3"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        <module.icon className="w-6 h-6 shrink-0" weight={isActive ? "fill" : "duotone"} size={24} />
                    </NavLink>
                ) : (
                    <div
                        className={cn(
                            "p-3 rounded-2xl transition-all duration-500 cursor-pointer",
                            isActive
                                ? "bg-primary text-white shadow-xl shadow-primary/30 rotate-3"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        )}
                        onClick={onToggle}
                    >
                        <module.icon className="w-6 h-6 shrink-0" weight={isActive ? "fill" : "duotone"} size={24} />
                    </div>
                )}

                {/* Hover Tooltip/Menu for Collapsed State */}
                <div className="absolute left-full ml-4 top-0 invisible group-hover:visible z-[100] bg-white border border-primary/5 rounded-[2rem] shadow-2xl w-64 p-4 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-12 translate-x-12" />
                    <div className="px-2 pb-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/5 mb-3 relative z-10">
                        {module.title}
                    </div>
                    <div className="space-y-1 relative z-10">
                        {isDirectLink ? (
                            <NavLink
                                to={module.path!}
                                className={cn(
                                    "flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                    isActive
                                        ? "bg-primary text-white shadow-lg"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <span>Go To {module.title}</span>
                            </NavLink>
                        ) : (
                            module.subModules?.map((sub) => (
                                <NavLink
                                    key={sub.path}
                                    to={sub.path}
                                    className={cn(
                                        "flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                        location.pathname === sub.path
                                            ? "bg-primary text-white shadow-md"
                                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                    )}
                                >
                                    <span>{sub.title}</span>
                                    {sub.badge ? (
                                        <span className="h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[8px] font-black text-white">
                                            {sub.badge}
                                        </span>
                                    ) : null}
                                </NavLink>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isDirectLink) {
        return (
            <NavLink
                to={module.path!}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                    isActive
                        ? "bg-primary text-white shadow-xl shadow-primary/20 cursor-default scale-[1.02]"
                        : "text-muted-foreground hover:bg-primary/[0.03] hover:text-primary"
                )}
            >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <module.icon
                        className={cn(
                            "w-5 h-5 shrink-0 transition-all duration-300",
                            isActive ? "text-white scale-110" : "group-hover:scale-125 text-primary/40 group-hover:text-primary"
                        )}
                        weight={isActive ? "fill" : "duotone"}
                        size={20}
                    />
                    <span className={cn(
                        "text-[11px] uppercase tracking-widest truncate min-w-0 animate-in fade-in duration-500",
                        isActive ? "font-black" : "font-bold"
                    )}>
                        {module.title}
                    </span>
                </div>
            </NavLink>
        );
    }

    return (
        <div className="space-y-2">
            <Button
                variant="ghost"
                onClick={onToggle}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group h-auto",
                    isActive && !isOpen 
                        ? "bg-primary/5 text-primary border border-primary/10 shadow-sm" 
                        : "text-muted-foreground hover:bg-primary/[0.03] hover:text-primary",
                    isOpen && "bg-primary/5 text-primary border border-primary/10 shadow-sm"
                )}
            >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <module.icon
                        className={cn(
                            "w-5 h-5 shrink-0 transition-all duration-300",
                            isActive ? "text-primary scale-110" : "text-primary/40 group-hover:scale-125 group-hover:text-primary"
                        )}
                        weight={isActive ? "fill" : "duotone"}
                        size={20}
                    />
                    <span className="text-[11px] font-black uppercase tracking-widest truncate min-w-0 animate-in fade-in duration-500">
                        {module.title}
                    </span>
                </div>
                <CaretDown
                    className={cn(
                        "shrink-0 w-3.5 h-3.5 transition-transform duration-500 text-primary/30 group-hover:text-primary",
                        isOpen && "rotate-180 text-primary"
                    )}
                    weight="black"
                />
            </Button>

            {isOpen && (
                <div className="pl-6 space-y-1 animate-in slide-in-from-top-2 duration-300 flex flex-col relative before:absolute before:left-[1.65rem] before:top-2 before:bottom-2 before:w-px before:bg-primary/10">
                    {module.subModules?.map((sub) => {
                        const rootPaths = [
                            "/departments/pd/teacher", 
                            "/departments/pd/leader", 
                            "/departments/pd/admin", 
                            "/departments/pd/management", 
                            "/departments/pd/hr",
                            "/teacher",
                            "/leader",
                            "/admin",
                            "/management",
                            "/hr"
                        ];
                        const isSubActive =
                            location.pathname === sub.path ||
                            (!rootPaths.includes(sub.path) && location.pathname.startsWith(sub.path));

                        return (
                            <NavLink
                                key={sub.path}
                                to={sub.path}
                                className={cn(
                                    "flex items-center justify-between gap-4 px-6 py-3 rounded-xl transition-all duration-300 group relative ml-3",
                                    isSubActive 
                                        ? "text-primary font-black bg-primary/10 shadow-inner" 
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/[0.02]"
                                )}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        isSubActive ? "bg-primary scale-125 shadow-[0_0_8px_rgba(234,16,74,0.5)]" : "bg-primary/10 group-hover:bg-primary/30"
                                    )} />
                                    <span className="text-[10px] uppercase tracking-[0.15em] truncate min-w-0 animate-in fade-in duration-500">
                                        {sub.title}
                                    </span>
                                </div>
                                {sub.badge ? (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white shadow-lg shadow-primary/20">
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
