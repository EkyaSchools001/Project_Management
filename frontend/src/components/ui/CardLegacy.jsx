import { cn } from "@/lib/utils";

export const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "dashboard-card",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
