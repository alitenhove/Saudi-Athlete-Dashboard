import type { Athlete } from "@/types/athlete";
import { enrichAthletes } from "@/types/athlete";

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function row(cells: (string | number | null | undefined)[]): string {
  return cells
    .map((c) => escapeCsv(c == null || c === "" ? "" : String(c)))
    .join(",");
}

export function exportAthletesToCsv(athletes: Athlete[]): void {
  const computed = enrichAthletes(athletes);
  const headers = [
    "ID",
    "Name",
    "Sex",
    "Region",
    "Current Sport",
    "Pathway Match",
    "Best 30m",
    "Best VJ",
    "Best IMTP",
    "Shuttle Level",
  ];

  const lines = [
    row(headers),
    ...computed.map((a) =>
      row([
        a.id,
        a.fullName,
        a.sex,
        a.region,
        a.primarySport,
        a.matchedSports.join("; "),
        a.bestSprint30m,
        a.bestVerticalJump,
        a.bestMidThighPull,
        a.shuttleRun.level,
      ]),
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sopc-scouting-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
