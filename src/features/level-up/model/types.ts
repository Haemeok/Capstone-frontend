import type { PRICE_BRACKETS } from "@/shared/config/constants/recipe";

export type LevelUpPhase = "acquired" | "absorb" | "accumulate";

export type PriceBracket = (typeof PRICE_BRACKETS)[number];

export type LevelUpData = {
  acquired: number;
  previousTotal: number;
  newTotal: number;
  currentBracket: PriceBracket;
  nextBracket?: PriceBracket;
  percentageToNext: number;
  isLevelUp: boolean;
};
