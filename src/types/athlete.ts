import {
  bestMidThighPullN,
  bestSprintSeconds,
  bestVerticalJumpCm,
} from "@/lib/utils";
import { matchTargetSports } from "@/lib/sportMatch";
import type { TargetSport } from "@/constants/saudi";

export type FollowUpPriority = "High" | "Medium" | "Low" | "None";

export type SportReferral = TargetSport | "None";

export interface ThreeAttempts {
  attempt1: number | null;
  attempt2: number | null;
  attempt3: number | null;
}

export interface ShuttleRun {
  level: number | null;
  shuttlesAchieved: number | null;
}

export interface CoachNotes {
  observations: string;
  strengths: string;
  developmentAreas: string;
  sportReferral: SportReferral;
  followUpPriority: FollowUpPriority;
}

export interface Athlete {
  id: string;
  eventDate: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: "Female" | "Male";
  primarySport: string;
  region: string;
  heightCm: number | null;
  weightKg: number | null;
  sprint30m: ThreeAttempts;
  verticalJump: ThreeAttempts;
  midThighPull: ThreeAttempts;
  shuttleRun: ShuttleRun;
  coach: CoachNotes;
  createdAt: string;
}

export interface AthleteComputed extends Athlete {
  bestSprint30m: number | null;
  bestVerticalJump: number | null;
  bestMidThighPull: number | null;
  fullName: string;
  ageYears: number | null;
  matchedSports: TargetSport[];
}

export type SortKey =
  | "name"
  | "bestSprint30m"
  | "bestVerticalJump"
  | "bestMidThighPull"
  | "shuttleLevel"
  | "followUp"
  | "sex";

export type SortDir = "asc" | "desc";

export function computeAthlete(athlete: Athlete): Omit<AthleteComputed, "matchedSports"> {
  return {
    ...athlete,
    fullName: `${athlete.firstName} ${athlete.lastName}`,
    ageYears: ageFromDob(athlete.dateOfBirth),
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
  };
}

export function enrichAthletes(athletes: Athlete[]): AthleteComputed[] {
  const base = athletes.map(computeAthlete);
  return base.map((a) => ({
    ...a,
    matchedSports: matchTargetSports(a as AthleteComputed, base),
  } as AthleteComputed));
}

function ageFromDob(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function emptyThreeAttempts(): ThreeAttempts {
  return { attempt1: null, attempt2: null, attempt3: null };
}

export function createEmptyAthlete(): Athlete {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    eventDate: new Date().toISOString().slice(0, 10),
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sex: "Male",
    primarySport: "",
    region: "",
    heightCm: null,
    weightKg: null,
    sprint30m: emptyThreeAttempts(),
    verticalJump: emptyThreeAttempts(),
    midThighPull: emptyThreeAttempts(),
    shuttleRun: { level: null, shuttlesAchieved: null },
    coach: {
      observations: "",
      strengths: "",
      developmentAreas: "",
      sportReferral: "None",
      followUpPriority: "None",
    },
    createdAt: now,
  };
}
