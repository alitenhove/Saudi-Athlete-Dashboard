import type { TargetSport } from "@/constants/saudi";
import { TARGET_SPORTS } from "@/constants/saudi";
import type { AthleteComputed } from "@/types/athlete";

type PillarScores = {
  speed: number;
  power: number;
  strength: number;
  endurance: number;
};

function percentileRank(value: number, values: number[], lowerIsBetter = false): number {
  if (values.length === 0) return 0.5;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = sorted.findIndex((v) => v === value);
  const rank = idx >= 0 ? idx / Math.max(sorted.length - 1, 1) : 0.5;
  return lowerIsBetter ? 1 - rank : rank;
}

function pillarScores(athlete: AthleteComputed, cohort: AthleteComputed[]): PillarScores {
  const sprints = cohort.map((a) => a.bestSprint30m).filter((v): v is number => v != null);
  const jumps = cohort.map((a) => a.bestVerticalJump).filter((v): v is number => v != null);
  const pulls = cohort.map((a) => a.bestMidThighPull).filter((v): v is number => v != null);
  const shuttles = cohort
    .map((a) => {
      const l = a.shuttleRun.level ?? 0;
      const s = a.shuttleRun.shuttlesAchieved ?? 0;
      return l * 10 + s;
    })
    .filter((v) => v > 0);

  return {
    speed:
      athlete.bestSprint30m != null
        ? percentileRank(athlete.bestSprint30m, sprints, true)
        : 0.35,
    power:
      athlete.bestVerticalJump != null
        ? percentileRank(athlete.bestVerticalJump, jumps)
        : 0.35,
    strength:
      athlete.bestMidThighPull != null
        ? percentileRank(athlete.bestMidThighPull, pulls)
        : 0.35,
    endurance:
      athlete.shuttleRun.level != null
        ? percentileRank(
            athlete.shuttleRun.level * 10 + (athlete.shuttleRun.shuttlesAchieved ?? 0),
            shuttles,
          )
        : 0.35,
  };
}

const SPORT_WEIGHTS: Record<TargetSport, PillarScores> = {
  Athletics: { speed: 0.45, power: 0.25, strength: 0.1, endurance: 0.2 },
  Swimming: { speed: 0.15, power: 0.2, strength: 0.15, endurance: 0.5 },
  Wrestling: { speed: 0.15, power: 0.2, strength: 0.45, endurance: 0.2 },
  Judo: { speed: 0.2, power: 0.25, strength: 0.35, endurance: 0.2 },
  Karate: { speed: 0.3, power: 0.3, strength: 0.2, endurance: 0.2 },
  "Weight lifting": { speed: 0.05, power: 0.25, strength: 0.55, endurance: 0.15 },
};

function scoreSport(pillars: PillarScores, sport: TargetSport): number {
  const w = SPORT_WEIGHTS[sport];
  return (
    pillars.speed * w.speed +
    pillars.power * w.power +
    pillars.strength * w.strength +
    pillars.endurance * w.endurance
  );
}

/** Top 2–3 pathway sports from testing profile (cohort-normalized). */
export function matchTargetSports(
  athlete: AthleteComputed,
  cohort: AthleteComputed[],
  max = 3,
): TargetSport[] {
  const pillars = pillarScores(athlete, cohort);
  const ranked = TARGET_SPORTS.map((sport) => ({
    sport,
    score: scoreSport(pillars, sport),
  })).sort((a, b) => b.score - a.score);

  return ranked.slice(0, max).map((r) => r.sport);
}

export function formatMatchedSports(sports: TargetSport[]): string {
  return sports.join(", ");
}
