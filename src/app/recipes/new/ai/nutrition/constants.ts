import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import type { AiRecipeDict } from "@/shared/i18n/types";

export type NutritionMode = "MACRO" | "CALORIE";

export type NutritionFormValues = {
  mode: NutritionMode;
  targetStyle: string;
  targetCalories: string;
  targetCarbs: string;
  targetProtein: string;
  targetFat: string;
};

export const NUTRITION_STYLE_ITEMS = [
  {
    value: "Asian_Style",
    image: `${ICON_BASE_URL}asian_style.webp`,
  },
  {
    value: "Western_Style",
    image: `${ICON_BASE_URL}western_style.webp`,
  },
  {
    value: "Light_Fresh",
    image: `${ICON_BASE_URL}diet_light.webp`,
  },
] as const;

export const UNLIMITED_SENTINEL = "unlimited";

export const MACRO_MODE_DEFAULTS: NutritionFormValues = {
  mode: "MACRO",
  targetStyle: "Asian_Style",
  targetCalories: UNLIMITED_SENTINEL,
  targetCarbs: "70",
  targetProtein: "25",
  targetFat: "15",
};

export const CALORIE_MODE_DEFAULTS: NutritionFormValues = {
  mode: "CALORIE",
  targetStyle: "Asian_Style",
  targetCalories: "700",
  targetCarbs: UNLIMITED_SENTINEL,
  targetProtein: UNLIMITED_SENTINEL,
  targetFat: UNLIMITED_SENTINEL,
};

export const MODE_DEFAULTS = {
  MACRO: MACRO_MODE_DEFAULTS,
  CALORIE: CALORIE_MODE_DEFAULTS,
} as const;

type GuidanceDict = AiRecipeDict["nutrition"]["guidance"];

export const getGuidanceMessage = (
  guidance: GuidanceDict,
  name: string,
  value: number
): string => {
  if (name === "targetCalories") {
    if (value < 500) return guidance.calories.low;
    if (value <= 800) return guidance.calories.mid;
    if (value <= 1200) return guidance.calories.high;
    return guidance.calories.max;
  }
  if (name === "targetProtein") {
    if (value < 20) return guidance.protein.low;
    if (value <= 40) return guidance.protein.mid;
    return guidance.protein.high;
  }
  if (name === "targetCarbs") {
    if (value < 50) return guidance.carbs.low;
    if (value <= 100) return guidance.carbs.mid;
    return guidance.carbs.high;
  }
  if (name === "targetFat") {
    if (value < 15) return guidance.fat.low;
    if (value <= 30) return guidance.fat.mid;
    return guidance.fat.high;
  }
  return "";
};
