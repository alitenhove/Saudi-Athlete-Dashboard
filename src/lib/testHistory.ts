import {
  bestMidThighPullN,
  bestSprintSeconds,
  bestVerticalJumpCm,
} from "@/lib/utils";
import type { Athlete, TestHistoryPoint } from "@/types/athlete";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Backfill YoY points when only the latest combine exists (e.g. manual intake). */
export function synthesizeTestHistory(athlete: Athlete): TestHistoryPoint[] {
  const latestYear = athlete.eventDate
    ? Number(athlete.eventDate.slice(0, 4))
    : new Date().getFullYear();

  const latest: TestHistoryPoint = {
    year: latestYear,
    eventDate: athlete.eventDate,
    bestSprint30m: bestSprintSeconds([
      athlete.sprint30m.attempt1,
      athlete.sprint30m.attempt2,
      athlete.sprint30m.attempt3,
    ]),
    bestVerticalJump: bestVerticalJumpCm([
      athlete.verticalJump.attempt1,
      athlete.verticalJump.attempt2,
      athlete.verticalJump.attempt3,
    ]),
    bestMidThighPull: bestMidThighPullN([
      athlete.midThighPull.attempt1,
      athlete.midThighPull.attempt2,
      athlete.midThighPull.attempt3,
    ]),
    shuttleLevel: athlete.shuttleRun.level,
  };

  const years = [latestYear - 3, latestYear - 2, latestYear - 1, latestYear];
  return years.map((year) => {
    if (year === latestYear) return latest;
    const steps = latestYear - year;
    return {
      year,
      eventDate: `${year}-06-15`,
      bestSprint30m:
        latest.bestSprint30m != null
          ? round2(latest.bestSprint30m + steps * 0.05)
          : null,
      bestVerticalJump:
        latest.bestVerticalJump != null
          ? round2(latest.bestVerticalJump - steps * 2.2)
          : null,
      bestMidThighPull:
        latest.bestMidThighPull != null
          ? round2(latest.bestMidThighPull - steps * 85)
          : null,
      shuttleLevel:
        latest.shuttleLevel != null
          ? Math.max(1, latest.shuttleLevel - steps)
          : null,
    };
  });
}

export function resolveTestHistory(athlete: Athlete): TestHistoryPoint[] {
  if (athlete.testHistory && athlete.testHistory.length > 0) {
    return [...athlete.testHistory].sort((a, b) => a.year - b.year);
  }
  return synthesizeTestHistory(athlete);
}
