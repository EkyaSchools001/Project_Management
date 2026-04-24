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
            const rootPaths = ["/teacher", "/leader", "/admin", "/management", "/hr"];
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
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                                : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                    >
                        <module.icon className="w-5 h-5 shrink-0" weight={isActive ? "fill" : "duotone"} size={20} />
                    </NavLink>
                ) : (
                    <div
                        className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                                : "text-sidebar-foreground hover:bg-sidebar-accent"
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
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent"
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
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                )}
                            >
                                <span>{sub.title}</span>
                                {sub.badge ? (
                                    <span className="h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
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
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90 cursor-default"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <module.icon
                        className={cn(
                            "w-5 h-5 shrink-0 transition-transform",
                            isActive ? "text-sidebar-primary-foreground" : "group-hover:scale-110 text-sidebar-foreground/70"
                        )}
                        weight={isActive ? "fill" : "duotone"}
                        size={20}
                    />
                    <span className={cn(
                        "text-sm truncate min-w-0 animate-in fade-in duration-300",
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
                    "text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && !isOpen && "bg-sidebar-accent/50",
                    isOpen && "bg-sidebar-accent/30"
                )}
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <module.icon
                        className={cn(
                            "w-5 h-5 shrink-0 transition-transform",
                            isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70 group-hover:scale-110"
                        )}
                        weight={isActive ? "fill" : "duotone"}
                        size={20}
                    />
                    <span className="text-sm font-semibold truncate min-w-0 animate-in fade-in duration-300">
                        {module.title}
                    </span>
                </div>
                <CaretDown
                    className={cn(
                        "shrink-0 w-4 h-4 transition-transform duration-200 text-sidebar-foreground/50",
                        isOpen && "rotate-180"
                    )}
                    weight="bold"
                />
            </Button>

            {isOpen && (
                <div className="pl-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {module.subModules?.map((sub) => {
                        const rootPaths = ["/teacher", "/leader", "/admin", "/management", "/hr"];
                        const isSubActive =
                            location.pathname === sub.path ||
                            (!rootPaths.includes(sub.path) && location.pathname.startsWith(sub.path));

                        return (
                            <NavLink
                                key={sub.path}
                                to={sub.path}
                                className={cn(
                                    "flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                                    "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                                    isSubActive && "text-sidebar-primary-foreground font-bold bg-sidebar-primary shadow-sm hover:bg-sidebar-primary/90 cursor-default"
                                )}
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="text-sm regular truncate min-w-0 animate-in fade-in duration-300 mr-3">
                                        {sub.title}
                                    </span>
                                </div>
                                {sub.badge ? (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-white">
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
