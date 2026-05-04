import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_URL } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatRole(role: string) {
  if (!role) return '';
  return role.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function formatCampus(campus: string) {
  if (!campus) return '';
  const mapping: Record<string, string> = {
    'ENICE': 'Ekya Nice',
    'CMRNPS': 'CMR NPS',
    'CMR NPS': 'CMR NPS',
    'EITPL': 'Ekya ITPL',
    'EBTM': 'Ekya BTM Layout',
    'EBYR': 'Ekya Byrathi',
    'ENAVA': 'Ekya Nava',
    'EJPN': 'Ekya JP Nagar',
    'PU NICE': 'PU Nice'
  };
  return mapping[campus] || campus;
}

export function getAssetUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // Ensure the path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  // LOGIC: 
  // 1. If it's an uploaded file, it MUST come from the backend BASE_URL
  if (normalizedPath.startsWith('/uploads/')) {
    return `${BASE_URL}${normalizedPath}`;
  }
  
  // 2. If it's a static asset (like school photos in frontend/public), 
  // it should stay relative so it's loaded from S3.
  return normalizedPath;
}
