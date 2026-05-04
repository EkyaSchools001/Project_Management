import { CalendarBlank, ChartBar, ShieldCheck, Clipboard } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Role } from "./RoleBadge";
import { useAccessControl } from "@pdi/hooks/useAccessControl";

interface QuickActionButtonsProps {
    role: Role;
}

export function QuickActionButtons({ role }: QuickActionButtonsProps) {
    const { isModuleEnabled } = useAccessControl();
    const navigate = useNavigate();

    const getRoleRoute = (baseRoute: string) => {
        const r = role.toLowerCase();
        if (r === "school_leader" || r === "leader" || r === "coordinator") return `/leader/${baseRoute}`;
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
            case "culture":
                navigate("/departments/pd/edu-hub/culture-environment");
                break;
            case "lac":
                navigate("/departments/pd/edu-hub/lac");
                break;
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Calendar – emerald green */}
            <Button
                className="h-9 px-4 rounded-xl font-medium gap-2 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                onClick={() => handleNavigation("calendar")}
            >
                <CalendarBlank className="w-4 h-4" weight="fill" />
                Calendar
            </Button>
            {/* Observations/Reports – indigo/blue */}
            <Button
                className="h-9 px-4 rounded-xl font-medium gap-2 bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                onClick={() => handleNavigation("reports")}
            >
                <ChartBar className="w-4 h-4" weight="fill" />
                {role.toLowerCase() === 'teacher' ? 'Observations' : 'Reports'}
            </Button>
            {/* Culture – teal/emerald */}
            {isModuleEnabled('/departments/pd/edu-hub/culture-environment', role) && (
                <Button
                    className="h-9 px-4 rounded-xl font-medium gap-2 bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                    onClick={() => handleNavigation("culture")}
                >
                    <ShieldCheck className="w-4 h-4" weight="fill" />
                    Culture
                </Button>
            )}
            {/* LAC – violet/indigo */}
            {isModuleEnabled('/departments/pd/edu-hub/lac', role) && (
                <Button
                    className="h-9 px-4 rounded-xl font-medium gap-2 bg-violet-500 text-white hover:bg-violet-600 shadow-md shadow-violet-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                    onClick={() => handleNavigation("lac")}
                >
                    <ClipboardCheck className="w-4 h-4" weight="fill" />
                    LAC
                </Button>
            )}
        </div>
    );
}

