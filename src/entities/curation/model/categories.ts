export const CURATION_CATEGORIES = [
  "DIET & LIGHT",
  "COMFORT FOOD",
  "QUICK & EASY",
  "IN SEASON",
  "GATHERINGS",
  "WELLNESS",
  "SOLO PLATE",
  "SWEET HOUR",
  "FOOD & LIFE",
] as const;

export type CurationCategory = (typeof CURATION_CATEGORIES)[number];

export const DEFAULT_CURATION_CATEGORY: CurationCategory = "FOOD & LIFE";

export const isCurationCategory = (v: unknown): v is CurationCategory =>
  typeof v === "string" &&
  (CURATION_CATEGORIES as readonly string[]).includes(v);
