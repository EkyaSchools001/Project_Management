import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { GrowthBackButton } from "./GrowthBackButton";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface GrowthLayoutProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const GrowthLayout: React.FC<GrowthLayoutProps> = ({
    children,
    allowedRoles
}) => {
    const location = useLocation();
    const { user } = useAuth();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 2. Store current route on entry (for the NEXT page's back button)
        const currentPath = location.pathname;
        const currentSearch = location.search;

        // Save current route to session storage when navigating AWAY
        return () => {
            sessionStorage.setItem("growth_previous_route", currentPath);
            sessionStorage.setItem("growth_previous_query", currentSearch);
            sessionStorage.setItem(`growth_scroll_${currentPath}`, window.scrollY.toString());
        };
    }, [location.pathname, location.search]);

    useEffect(() => {
        // 3. Restore scroll position on mount
        const savedScroll = sessionStorage.getItem(`growth_scroll_${location.pathname}`);
        if (savedScroll) {
            const timeoutId = setTimeout(() => {
                window.scrollTo({
                    top: parseInt(savedScroll),
                    behavior: "auto"
                });
            }, 100);
            return () => clearTimeout(timeoutId);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    // 1. Role-based access protection
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/growth" replace />;
    }

    return (
        <div className="flex flex-col w-full min-h-screen">
            <div className="container mx-auto px-4 py-4">
                <GrowthBackButton />
                {children}
            </div>
        </div>
    );
};
