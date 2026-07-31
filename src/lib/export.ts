import type { Athlete, AthleteComputed } from "@/types/athlete";
import { enrichAthletes } from "@/types/athlete";
import { formatMatchedSports } from "@/lib/sportMatch";
import {
  formatForce,
  formatJump,
  formatSprint,
} from "@/lib/utils";

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function row(cells: (string | number | null | undefined)[]): string {
  return cells
    .map((c) => escapeCsv(c == null || c === "" ? "" : String(c)))
    .join(",");
}

/**
 * Exports all athlete records to a CSV file suitable for NSO / event reporting.
 * Includes raw attempts and computed best scores.
 */
export function exportAthletesToCsv(athletes: Athlete[]): void {
  const computed = enrichAthletes(athletes);
  const headers = [
    "Event Date",
    "First Name",
    "Last Name",
    "Date of Birth",
    "Sex",
    "Current Sport",
    "Region",
    "Pathway Match",
    "Height (cm)",
    "Weight (kg)",
    "30m Sprint A1 (s)",
    "30m Sprint A2 (s)",
    "30m Sprint A3 (s)",
    "Best 30m Sprint (s)",
    "Vertical Jump A1 (cm)",
    "Vertical Jump A2 (cm)",
    "Vertical Jump A3 (cm)",
    "Best Vertical Jump (cm)",
    "IMTP A1 (N)",
    "IMTP A2 (N)",
    "IMTP A3 (N)",
    "Best IMTP (N)",
    "Shuttle Level",
    "Shuttle Achieved",
    "Observations",
    "Strengths",
    "Development Areas",
    "Sport Referral",
    "Follow-up Priority",
  ];

  const lines = [
    row(headers),
    ...computed.map((a) =>
      row([
        a.eventDate,
        a.firstName,
        a.lastName,
        a.dateOfBirth,
        a.sex,
        a.primarySport,
        a.region,
        formatMatchedSports(a.matchedSports),
        a.heightCm,
        a.weightKg,
        a.sprint30m.attempt1,
        a.sprint30m.attempt2,
        a.sprint30m.attempt3,
        a.bestSprint30m,
        a.verticalJump.attempt1,
        a.verticalJump.attempt2,
        a.verticalJump.attempt3,
        a.bestVerticalJump,
        a.midThighPull.attempt1,
        a.midThighPull.attempt2,
        a.midThighPull.attempt3,
        a.bestMidThighPull,
        a.shuttleRun.level,
        a.shuttleRun.shuttlesAchieved,
        a.coach.observations,
        a.coach.strengths,
        a.coach.developmentAreas,
        a.coach.sportReferral,
        a.coach.followUpPriority,
      ]),
    ),
  ];

  downloadBlob(
    new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" }),
    `fitness-testing-export-${new Date().toISOString().slice(0, 10)}.csv`,
  );
}

/**
 * Downloads a blank standardized testing template (headers only) for field staff.
 */
export function exportTestingTemplateCsv(): void {
  const headers = [
    "Event Date",
    "First Name",
    "Last Name",
    "Date of Birth (YYYY-MM-DD)",
    "Sex",
    "Current Sport",
    "Region (KSA)",
    "Height (cm)",
    "Weight (kg)",
    "30m Sprint Attempt 1 (s)",
    "30m Sprint Attempt 2 (s)",
    "30m Sprint Attempt 3 (s)",
    "Vertical Jump Attempt 1 (cm)",
    "Vertical Jump Attempt 2 (cm)",
    "Vertical Jump Attempt 3 (cm)",
    "IMTP Attempt 1 (N)",
    "IMTP Attempt 2 (N)",
    "IMTP Attempt 3 (N)",
    "20m Shuttle Level",
    "20m Shuttle Achieved",
    "Coach Observations",
    "Strengths",
    "Development Areas",
    "Sport Referral",
    "Follow-up Priority",
  ];
  downloadBlob(
    new Blob([row(headers)], { type: "text/csv;charset=utf-8;" }),
    "fitness-testing-template.csv",
  );
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function profileHtml(a: AthleteComputed): string {
  return `
    <article class="profile">
      <header>
        <h1>${a.fullName}</h1>
        <p class="meta">${a.region} · ${a.primarySport} · Event ${a.eventDate}</p>
        <p class="meta">Pathway: ${formatMatchedSports(a.matchedSports)}</p>
      </header>
      <section>
        <h2>Demographics</h2>
        <ul>
          <li>DOB: ${a.dateOfBirth}${a.ageYears != null ? ` (${a.ageYears} yrs)` : ""}</li>
          <li>Sex: ${a.sex}</li>
          <li>Height: ${a.heightCm ?? "—"} cm · Weight: ${a.weightKg ?? "—"} kg</li>
        </ul>
      </section>
      <section>
        <h2>Performance summary</h2>
        <table>
          <tr><th>30m Sprint (Speed)</th><td>${formatSprint(a.bestSprint30m)}</td></tr>
          <tr><th>Vertical Jump (Power)</th><td>${formatJump(a.bestVerticalJump)}</td></tr>
          <tr><th>IMTP (Strength)</th><td>${formatForce(a.bestMidThighPull)}</td></tr>
          <tr><th>20m Shuttle</th><td>Level ${a.shuttleRun.level ?? "—"}, ${a.shuttleRun.shuttlesAchieved ?? "—"} shuttles</td></tr>
        </table>
      </section>
      <section>
        <h2>Coach assessment</h2>
        <p><strong>Observations:</strong> ${a.coach.observations || "—"}</p>
        <p><strong>Strengths:</strong> ${a.coach.strengths || "—"}</p>
        <p><strong>Development:</strong> ${a.coach.developmentAreas || "—"}</p>
        <p><strong>Referral:</strong> ${a.coach.sportReferral} · <strong>Follow-up:</strong> ${a.coach.followUpPriority}</p>
      </section>
    </article>
  `;
}

/**
 * Opens a print-friendly window for a single athlete summary.
 */
export function printAthleteSummary(
  athlete: Athlete,
  matchedSports?: AthleteComputed["matchedSports"],
): void {
  const enriched = enrichAthletes([athlete])[0]!;
  const a = matchedSports ? { ...enriched, matchedSports } : enriched;
  const w = window.open("", "_blank", "noopener,noreferrer,width=800,height=900");
  if (!w) return;
  w.document.write(`<!DOCTYPE html>
<html><head><title>${a.fullName} — Fitness Testing Summary</title>
<style>
  body { font-family: Inter, system-ui, sans-serif; color: #1a1a1a; padding: 2rem; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
  .meta { color: #555; margin: 0 0 1.5rem; font-size: 0.9rem; }
  h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #666; border-bottom: 1px solid #ddd; padding-bottom: 0.35rem; margin-top: 1.25rem; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 0.35rem 0; border-bottom: 1px solid #eee; }
  th { font-weight: 500; width: 45%; }
  p { line-height: 1.5; font-size: 0.95rem; }
  @media print { body { padding: 0.5in; } }
</style></head><body>
${profileHtml(a)}
<script>window.onload = () => { window.print(); }</script>
</body></html>`);
  w.document.close();
}

/**
 * Printable roster of all athletes (stub-friendly: fully implemented for current session data).
 */
export function printAllSummaries(athletes: Athlete[]): void {
  const computed = enrichAthletes(athletes);
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  w.document.write(`<!DOCTYPE html>
<html><head><title>Event Fitness Testing — Roster Summary</title>
<style>
  body { font-family: Inter, system-ui, sans-serif; color: #1a1a1a; padding: 2rem; }
  h1 { font-size: 1.25rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 1rem; }
  th, td { border: 1px solid #ccc; padding: 0.4rem 0.5rem; text-align: left; }
  th { background: #f5f5f5; }
  @media print { body { padding: 0.4in; } }
</style></head><body>
<h1>Talent Identification — Fitness Testing Roster</h1>
<p>Generated ${new Date().toLocaleString()} · ${computed.length} athletes</p>
<table>
  <thead>
    <tr>
      <th>Name</th><th>Sport</th><th>Best 30m</th><th>Best VJ</th><th>Best IMTP</th><th>Shuttle</th><th>Follow-up</th>
    </tr>
  </thead>
  <tbody>
    ${computed
      .map(
        (a) => `<tr>
      <td>${a.fullName}</td>
      <td>${a.primarySport}</td>
      <td>${formatSprint(a.bestSprint30m)}</td>
      <td>${formatJump(a.bestVerticalJump)}</td>
      <td>${formatForce(a.bestMidThighPull)}</td>
      <td>L${a.shuttleRun.level ?? "—"} / ${a.shuttleRun.shuttlesAchieved ?? "—"}</td>
      <td>${a.coach.followUpPriority}</td>
    </tr>`,
      )
      .join("")}
  </tbody>
</table>
<script>window.onload = () => { window.print(); }</script>
</body></html>`);
  w.document.close();
}
