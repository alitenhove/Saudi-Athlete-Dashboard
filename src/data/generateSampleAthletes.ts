import type { Athlete, TestHistoryPoint, ThreeAttempts } from "@/types/athlete";
import {
  bestMidThighPullN,
  bestSprintSeconds,
  bestVerticalJumpCm,
} from "@/lib/utils";
import {
  CURRENT_SPORTS,
  SAUDI_REGIONS,
  type CurrentSport,
  type SaudiRegion,
} from "@/constants/saudi";

const SAMPLE_SIZE = 96;

const MALE_FIRST = [
  "Omar",
  "Khalid",
  "Faisal",
  "Abdullah",
  "Youssef",
  "Hassan",
  "Ibrahim",
  "Saeed",
  "Turki",
  "Bandar",
  "Majed",
  "Rayan",
  "Adnan",
  "Waleed",
  "Sultan",
  "Nasser",
  "Hamad",
  "Zaid",
  "Tariq",
  "Saleh",
];

const FEMALE_FIRST = [
  "Noura",
  "Sara",
  "Lama",
  "Hala",
  "Reem",
  "Maha",
  "Aisha",
  "Dana",
  "Jana",
  "Layan",
  "Raghad",
  "Shahad",
  "Ghada",
  "Amal",
  "Hanan",
  "Rawan",
  "Lina",
  "Farah",
  "Mona",
  "Yasmin",
];

const LAST = [
  "Al-Harbi",
  "Al-Otaibi",
  "Al-Ghamdi",
  "Al-Qahtani",
  "Al-Shammari",
  "Al-Dosari",
  "Al-Zahrani",
  "Al-Mutairi",
  "Al-Subaie",
  "Al-Anazi",
  "Al-Rashid",
  "Al-Faraj",
  "Al-Shehri",
  "Al-Tamimi",
  "Al-Jaber",
  "Al-Saud",
  "Khan",
  "Ahmed",
  "Hassan",
  "Mahmoud",
];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function gaussian(rng: () => number, mean: number, sd: number): number {
  const u = rng() || 1e-6;
  const v = rng();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * sd;
}

function attempts(rng: () => number, mean: number, spread: number): ThreeAttempts {
  const a1 = mean + (rng() - 0.5) * spread;
  const a2 = mean + (rng() - 0.5) * spread;
  const a3 = mean + (rng() - 0.5) * spread;
  const round = (n: number) => Math.round(n * 100) / 100;
  return { attempt1: round(a1), attempt2: round(a2), attempt3: round(a3) };
}

function profileForSport(rng: () => number, sport: CurrentSport, sex: "Male" | "Female") {
  const sexShift = sex === "Male" ? 0 : -0.04;
  switch (sport) {
    case "Athletics":
      return {
        sprint: 4.45 + sexShift + rng() * 0.35,
        vj: 48 + (sex === "Male" ? 8 : 0) + rng() * 8,
        imtp: 2600 + rng() * 400,
        shuttle: 8 + Math.floor(rng() * 2),
      };
    case "Swimming":
      return {
        sprint: 4.65 + sexShift + rng() * 0.3,
        vj: 42 + rng() * 8,
        imtp: 2300 + rng() * 350,
        shuttle: 9 + Math.floor(rng() * 2),
      };
    case "Karate":
    case "Taekwondo":
      return {
        sprint: 4.55 + sexShift + rng() * 0.3,
        vj: 46 + rng() * 10,
        imtp: 2500 + rng() * 450,
        shuttle: 8 + Math.floor(rng() * 2),
      };
    case "Basketball":
    case "Volleyball":
      return {
        sprint: 4.58 + sexShift + rng() * 0.32,
        vj: 52 + (sex === "Male" ? 6 : 2) + rng() * 8,
        imtp: 2450 + rng() * 400,
        shuttle: 7 + Math.floor(rng() * 2),
      };
    default:
      return {
        sprint: 4.62 + sexShift + rng() * 0.38,
        vj: 40 + rng() * 12,
        imtp: 2200 + rng() * 500,
        shuttle: 7 + Math.floor(rng() * 3),
      };
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function buildTestHistory(
  rng: () => number,
  latest: TestHistoryPoint,
): TestHistoryPoint[] {
  const years = [2023, 2024, 2025, 2026];
  return years.map((year) => {
    if (year === latest.year) return { ...latest, year };
    const steps = latest.year - year;
    return {
      year,
      eventDate: `${year}-06-15`,
      bestSprint30m:
        latest.bestSprint30m != null
          ? round2(latest.bestSprint30m + steps * (0.04 + rng() * 0.04))
          : null,
      bestVerticalJump:
        latest.bestVerticalJump != null
          ? round2(latest.bestVerticalJump - steps * (1.8 + rng() * 1.2))
          : null,
      bestMidThighPull:
        latest.bestMidThighPull != null
          ? round2(latest.bestMidThighPull - steps * (70 + rng() * 40))
          : null,
      shuttleLevel:
        latest.shuttleLevel != null
          ? Math.max(1, latest.shuttleLevel - steps)
          : null,
    };
  });
}

function buildAthlete(index: number, rng: () => number): Athlete {
  const sex: "Male" | "Female" = index % 2 === 0 ? "Male" : "Female";
  const firstName = pick(rng, sex === "Male" ? MALE_FIRST : FEMALE_FIRST);
  const lastName = pick(rng, LAST);
  const currentSport = pick(rng, CURRENT_SPORTS) as CurrentSport;
  const region = pick(rng, SAUDI_REGIONS) as SaudiRegion;
  const prof = profileForSport(rng, currentSport, sex);

  const birthYear = 2008 + Math.floor(rng() * 5);
  const birthMonth = 1 + Math.floor(rng() * 12);
  const birthDay = 1 + Math.floor(rng() * 28);

  const heightBase = sex === "Male" ? 176 : 165;
  const weightBase = sex === "Male" ? 72 : 58;

  const priorities = ["High", "Medium", "Low", "None"] as const;
  const priority = pick(rng, priorities);

  const sprint30m = attempts(rng, prof.sprint, 0.12);
  const verticalJump = attempts(rng, prof.vj, 2.5);
  const midThighPull = attempts(rng, prof.imtp, 120);

  const latestHistory: TestHistoryPoint = {
    year: 2026,
    eventDate: "2026-06-12",
    bestSprint30m: bestSprintSeconds([
      sprint30m.attempt1,
      sprint30m.attempt2,
      sprint30m.attempt3,
    ]),
    bestVerticalJump: bestVerticalJumpCm([
      verticalJump.attempt1,
      verticalJump.attempt2,
      verticalJump.attempt3,
    ]),
    bestMidThighPull: bestMidThighPullN([
      midThighPull.attempt1,
      midThighPull.attempt2,
      midThighPull.attempt3,
    ]),
    shuttleLevel: prof.shuttle,
  };

  return {
    id: `sopc-${String(index + 1).padStart(3, "0")}`,
    eventDate: "2026-06-12",
    firstName,
    lastName,
    dateOfBirth: `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`,
    sex,
    primarySport: currentSport,
    region,
    heightCm: Math.round(gaussian(rng, heightBase, 7)),
    weightKg: Math.round(gaussian(rng, weightBase, 9)),
    sprint30m,
    verticalJump,
    midThighPull,
    shuttleRun: {
      level: prof.shuttle,
      shuttlesAchieved: 1 + Math.floor(rng() * 8),
    },
    testHistory: buildTestHistory(rng, latestHistory),
    coach: {
      observations: "National screening combine — standard battery completed.",
      strengths: "See testing summary and pathway matches.",
      developmentAreas: "Individual periodization to follow camp review.",
      sportReferral: "None",
      followUpPriority: priority,
    },
    createdAt: "2026-06-12T08:00:00.000Z",
  };
}

export function generateSampleAthletes(count = SAMPLE_SIZE): Athlete[] {
  const rng = mulberry32(20260612);
  return Array.from({ length: count }, (_, i) => buildAthlete(i, rng));
}

export const SAMPLE_ATHLETES = generateSampleAthletes();
