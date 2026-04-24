import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatRole(role: string) {
  if (!role) return '';
  return role.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
