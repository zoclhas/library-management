import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIsoDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
export function cellColourDue(dueDate: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return "bg-red-300 dark:bg-red-900";
  } else if (dueDate.getTime() === today.getTime()) {
    return "bg-amber-300 dark:bg-amber-900";
  }

  return "bg-green-300 dark:bg-green-900";
}
