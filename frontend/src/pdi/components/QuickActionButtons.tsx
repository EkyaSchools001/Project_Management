import { CalendarBlank, ChartBar } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Role } from "./RoleBadge";

interface QuickActionButtonsProps {
    role: Role;
}

export function QuickActionButtons({ role }: QuickActionButtonsProps) {
    const navigate = useNavigate();

    const getRoleRoute = (baseRoute: string) => {
        const r = role.toLowerCase();
        if (r === "school_leader" || r === "leader") return `/leader/${baseRoute}`;
        if (r === "admin" || r === "superadmin") return `/admin/${baseRoute}`;
        if (r === "management") return `/management/${baseRoute}`;
        return `/teacher/${baseRoute}`;
    };

    const handleNavigation = (action: string) => {
        switch (action) {
            case "calendar":
                if (role.toLowerCase() === "teacher") {
                    navigate("/teacher/calendar");
                } else if (role.toLowerCase() === "management") {
                    navigate("/meetings");
                } else {
                    navigate(getRoleRoute("calendar"));
                }
                break;
            case "reports":
                if (role.toLowerCase() === "teacher") {
                    navigate("/teacher/observations");
                } else {
                    navigate(getRoleRoute("reports"));
                }
                break;
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Calendar – emerald green */}
            <Button
                className="h-9 px-4 rounded-xl font-medium gap-2 bg-backgroundmerald-500 text-foreground hover:bg-backgroundmerald-600 shadow-md shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                onClick={() => handleNavigation("calendar")}
            >
                <CalendarBlank className="w-4 h-4" weight="fill" />
                Calendar
            </Button>
            {/* Observations/Reports – indigo/blue */}
            <Button
                className="h-9 px-4 rounded-xl font-medium gap-2 bg-indigo-500 text-foreground hover:bg-indigo-600 shadow-md shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                onClick={() => handleNavigation("reports")}
            >
                <ChartBar className="w-4 h-4" weight="fill" />
                {role.toLowerCase() === 'teacher' ? 'Observations' : 'Reports'}
            </Button>
        </div>
    );
}
