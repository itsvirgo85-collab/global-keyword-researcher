import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { KeywordDifficultyBand } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getKdBand(kd: number): KeywordDifficultyBand {
  if (kd <= 10) return "Very Easy";
  if (kd <= 30) return "Easy";
  if (kd <= 50) return "Medium";
  if (kd <= 70) return "Hard";
  return "Very Hard";
}

export function getKdColor(kd: number): {
  bg: string;
  text: string;
  border: string;
  ring: string;
} {
  if (kd <= 10) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      ring: "ring-emerald-500",
    };
  }
  if (kd <= 30) {
    return {
      bg: "bg-teal-50 dark:bg-teal-950/40",
      text: "text-teal-700 dark:text-teal-400",
      border: "border-teal-200 dark:border-teal-800",
      ring: "ring-teal-500",
    };
  }
  if (kd <= 50) {
    return {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      ring: "ring-amber-500",
    };
  }
  if (kd <= 70) {
    return {
      bg: "bg-orange-50 dark:bg-orange-950/40",
      text: "text-orange-700 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
      ring: "ring-orange-500",
    };
  }
  return {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    ring: "ring-rose-500",
  };
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}
