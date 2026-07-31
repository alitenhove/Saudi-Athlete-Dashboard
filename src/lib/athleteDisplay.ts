import type { FollowUpPriority } from "@/types/athlete";

export function formatShuttleCell(
  level: number | null,
  shuttlesAchieved: number | null,
): string {
  if (level == null) return "—";
  if (shuttlesAchieved != null) return `L${level}/${shuttlesAchieved}`;
  return `L${level}`;
}

export function followUpBadgeVariant(
  p: FollowUpPriority,
): "warning" | "secondary" | "outline" | "success" {
  if (p === "High") return "warning";
  if (p === "Medium") return "secondary";
  if (p === "Low") return "outline";
  return "outline";
}
