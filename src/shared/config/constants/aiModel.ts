import { IMAGE_BASE_URL } from "./recipe";

export const LOADING_BASE_URL = `${IMAGE_BASE_URL}loadings/`;
export const AI_CONCEPTS_BASE_URL = `${IMAGE_BASE_URL}ai-concepts/`;

export type AIModelId =
  | "INGREDIENT_FOCUS"
  | "COST_EFFECTIVE"
  | "NUTRITION_BALANCE"
  | "FINE_DINING";

export type AIModel = {
  id: AIModelId;
  image: string;
  loadingAnimation: {
    image: string;
    frames: number;
    duration: number;
  };
};

export const aiModels: Record<AIModelId, AIModel> = {
  INGREDIENT_FOCUS: {
    id: "INGREDIENT_FOCUS",
    image: `${IMAGE_BASE_URL}ai-concepts/ingredient-focus-2x3.webp`,
    loadingAnimation: {
      image: `${LOADING_BASE_URL}classic.webp`,
      frames: 12,
      duration: 3,
    },
  },
  COST_EFFECTIVE: {
    id: "COST_EFFECTIVE",
    image: `${IMAGE_BASE_URL}ai-concepts/cost-effective-2x3.webp`,
    loadingAnimation: {
      image: `${LOADING_BASE_URL}creative.webp`,
      frames: 11,
      duration: 3,
    },
  },
  NUTRITION_BALANCE: {
    id: "NUTRITION_BALANCE",
    image: `${IMAGE_BASE_URL}ai-concepts/nutrition-balance-2x3.webp`,
    loadingAnimation: {
      image: `${LOADING_BASE_URL}healthy.webp`,
      frames: 13,
      duration: 3,
    },
  },
  FINE_DINING: {
    id: "FINE_DINING",
    image: `${IMAGE_BASE_URL}ai-concepts/fine-dining-2x3.webp`,
    loadingAnimation: {
      image: `${LOADING_BASE_URL}gourmet.webp`,
      frames: 11,
      duration: 3,
    },
  },
};

export type DiningTier = "WHITE" | "BLACK";

type TierOption = {
  value: DiningTier;
  image: string;
};

export const FINE_DINING_TIERS: TierOption[] = [
  {
    value: "BLACK",
    image: `${AI_CONCEPTS_BASE_URL}fine-dining-black.webp`,
  },
  {
    value: "WHITE",
    image: `${AI_CONCEPTS_BASE_URL}fine-dining-white.webp`,
  },
];
