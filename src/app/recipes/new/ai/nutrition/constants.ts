import { ICON_BASE_URL } from "@/shared/config/constants/recipe";

export type NutritionMode = "MACRO" | "CALORIE";

export type NutritionFormValues = {
  mode: NutritionMode;
  targetStyle: string;
  targetCalories: string;
  targetCarbs: string;
  targetProtein: string;
  targetFat: string;
};

export const NUTRITION_STYLES = [
  {
    value: "Asian_Style",
    image: `${ICON_BASE_URL}asian_style.webp`,
    label: "아시안 스타일",
    description: "한식, 중식, 일식",
  },
  {
    value: "Western_Style",
    image: `${ICON_BASE_URL}western_style.webp`,
    label: "양식 스타일",
    description: "이탈리안, 프렌치",
  },
  {
    value: "Light_Fresh",
    image: `${ICON_BASE_URL}diet_light.webp`,
    label: "가볍고 신선하게",
    description: "샐러드, 건강식",
  },
] as const;

export const MACRO_MODE_DEFAULTS: NutritionFormValues = {
  mode: "MACRO",
  targetStyle: "Asian_Style",
  targetCalories: "제한 없음",
  targetCarbs: "70",
  targetProtein: "25",
  targetFat: "15",
};

export const CALORIE_MODE_DEFAULTS: NutritionFormValues = {
  mode: "CALORIE",
  targetStyle: "Asian_Style",
  targetCalories: "700",
  targetCarbs: "제한 없음",
  targetProtein: "제한 없음",
  targetFat: "제한 없음",
};

export const MODE_DEFAULTS = {
  MACRO: MACRO_MODE_DEFAULTS,
  CALORIE: CALORIE_MODE_DEFAULTS,
} as const;

export const getGuidanceMessage = (name: string, value: number): string => {
  if (name === "targetCalories") {
    if (value < 500) return "⚡ 다이어트 집중 모드!";
    if (value <= 800) return "🍽️ 딱 좋은 한 끼";
    if (value <= 1200) return "💪 에너지 충전!";
    return "🔥 벌크업 가즈아!";
  }
  if (name === "targetProtein") {
    if (value < 20) return "🥗 가벼운 단백질";
    if (value <= 40) return "💪 균형 잡힌 근육 케어";
    return "🏋️ 득근 가즈아!";
  }
  if (name === "targetCarbs") {
    if (value < 50) return "🔥 저탄고지 모드!";
    if (value <= 100) return "⚖️ 균형 잡힌 에너지";
    return "⚡ 에너지 폭발!";
  }
  if (name === "targetFat") {
    if (value < 15) return "🥗 클린 식단!";
    if (value <= 30) return "👍 적당한 포만감";
    return "🧈 건강한 지방 섭취";
  }
  return "";
};
