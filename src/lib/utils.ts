import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bestSprintSeconds(attempts: (number | null)[]): number | null {
  const valid = attempts.filter((v): v is number => v != null && !Number.isNaN(v));
  if (valid.length === 0) return null;
  return Math.min(...valid);
}

export function bestVerticalJumpCm(attempts: (number | null)[]): number | null {
  const valid = attempts.filter((v): v is number => v != null && !Number.isNaN(v));
  if (valid.length === 0) return null;
  return Math.max(...valid);
}

export function bestMidThighPullN(attempts: (number | null)[]): number | null {
  const valid = attempts.filter((v): v is number => v != null && !Number.isNaN(v));
  if (valid.length === 0) return null;
  return Math.max(...valid);
}

export function formatSprint(seconds: number | null): string {
  if (seconds == null) return "—";
  return `${seconds.toFixed(2)} s`;
}

export function formatJump(cm: number | null): string {
  if (cm == null) return "—";
  return `${cm.toFixed(1)} cm`;
}

export function formatForce(n: number | null): string {
  if (n == null) return "—";
  return `${Math.round(n)} N`;
}
