export const SAUDI_REGIONS = [
  "Riyadh",
  "Makkah",
  "Madinah",
  "Eastern Province",
  "Qassim",
  "Asir",
  "Tabuk",
  "Hail",
  "Northern Borders",
  "Jazan",
  "Najran",
  "Al-Bahah",
  "Al-Jouf",
] as const;

export type SaudiRegion = (typeof SAUDI_REGIONS)[number];

export const TARGET_SPORTS = [
  "Athletics",
  "Swimming",
  "Wrestling",
  "Judo",
  "Karate",
  "Weight lifting",
] as const;

export type TargetSport = (typeof TARGET_SPORTS)[number];

export const CURRENT_SPORTS = [
  "Football",
  "Basketball",
  "Volleyball",
  "Handball",
  "Athletics",
  "Swimming",
  "Karate",
  "Taekwondo",
  "Padel",
  "Cross-training",
  "School sport",
  "None",
] as const;

export type CurrentSport = (typeof CURRENT_SPORTS)[number];

/** Replace with official asset: add `public/sopc-logo.png` and set path in SiteHeader */
export const SOPC_LOGO_PATH = "/sopc-emblem.svg";

export const SOPC_PROGRAM_TITLE = "SOPC National Scouting Program";
