import { type ClassValue, clsx } from "clsx";

/**
 * Conditionally join class names. Thin wrapper around clsx.
 * Usage: cn("base-class", isActive && "active", { "conditional": condition })
 */
export function cn(...inputs: ClassValue[]): string {
  // clsx is a tiny utility — if not installed, fall back to manual join
  try {
    return clsx(inputs);
  } catch {
    return inputs
      .flat()
      .filter(Boolean)
      .join(" ");
  }
}

/**
 * Format a Date or ISO string strictly as DD/MM/YYYY (Indian format).
 * e.g. "04/06/2026"
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const formatShortDate = formatDate;

/**
 * Return today's date as a YYYY-MM-DD string (for date input default values).
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Format file size in bytes as a human-readable string.
 * e.g. 1048576 → "1.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Truncate a string to maxLength with an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
