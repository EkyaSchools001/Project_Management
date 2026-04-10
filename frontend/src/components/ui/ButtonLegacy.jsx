import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Button({ className, variant = "primary", size = "md", ...props }) {
    const variants = {
        primary: "bg-neutral-800 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20",
        secondary: "bg-[#111c2a] text-brand-600 border border-brand-100 hover:bg-brand-50",
        outline: "bg-transparent text-gray-200 border border-neutral-700 hover:border-brand-500 hover:text-brand-600",
        ghost: "bg-transparent text-gray-300 hover:bg-brand-50",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
    };

    const sizes = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-10 text-base"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center font-semibold rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
