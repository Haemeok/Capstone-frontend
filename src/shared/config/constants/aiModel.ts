import type { AIModel } from "@/features/recipe-create-ai";

import { IMAGE_BASE_URL } from "./recipe";

export const LOADING_BASE_URL = `${IMAGE_BASE_URL}loadings/`;
export const AI_CONCEPTS_BASE_URL = `${IMAGE_BASE_URL}ai-concepts/`;

export type AIModelId =
  | "INGREDIENT_FOCUS"
  | "COST_EFFECTIVE"
  | "NUTRITION_BALANCE"
  | "FINE_DINING";

export const aiModels: Record<AIModelId, AIModel> = {
  INGREDIENT_FOCUS: {
    id: "INGREDIENT_FOCUS",
    name: "냉장고 속 재료",
    image: `${IMAGE_BASE_URL}ai-concepts/ingredient-focus-2x3.webp`,
    description: "집에 있는 재료로 만드는 최고의 요리",
    loadingAnimation: {
      image: `${LOADING_BASE_URL}classic.webp`,
      frames: 12,
      duration: 3,
    },
  },
  COST_EFFECTIVE: {
    id: "COST_EFFECTIVE",
    name: "가성비 요리",
    image: `${IMAGE_BASE_URL}ai-concepts/cost-effective-2x3.webp`,
    description: "만원의 행복! 저렴하지만 근사하게",
    loadingAnimation: {
      image: `${LOADING_BASE_URL}creative.webp`,
      frames: 11,
      duration: 3,
    },
  },
  NUTRITION_BALANCE: {
    id: "NUTRITION_BALANCE",
    name: "영양 밸런스",
    image: `${IMAGE_BASE_URL}ai-concepts/nutrition-balance-2x3.webp`,
    description: "탄단지 비율과 칼로리까지 꼼꼼하게",
    loadingAnimation: {
      image: `${LOADING_BASE_URL}healthy.webp`,
      frames: 13,
      duration: 3,
    },
  },
  FINE_DINING: {
    id: "FINE_DINING",
    name: "파인 다이닝",
    image: `${IMAGE_BASE_URL}ai-concepts/fine-dining-2x3.webp`,
    description: "우리 집 식탁을 고급 레스토랑처럼",
    loadingAnimation: {
      image: `${LOADING_BASE_URL}gourmet.webp`,
      frames: 11,
      duration: 3,
    },
  },
};

export const aiModelSteps = [
  "재료를 분석하고 있어요",
  "맛있는 조합을 찾고 있어요",
  "요리 순서를 정리하고 있어요",
  "마지막 손질을 하고 있어요",
  "레시피를 완성하고 있어요",
];

export type DiningTier = "WHITE" | "BLACK";

type TierOption = {
  value: DiningTier;
  label: string;
  description: string;
  image: string;
  features: string[];
};

export const FINE_DINING_TIERS: TierOption[] = [
  {
    value: "BLACK",
    label: "블랙",
    description: "모던하고 혁신적인 미식",
    image: `${AI_CONCEPTS_BASE_URL}fine-dining-black.webp`,
    features: [
      "대중적인 재료 사용",
      "파인다이닝 조리법",
      "중급자 난이도",
      "일반 조리도구",
    ],
  },
  {
    value: "WHITE",
    label: "화이트",
    description: "정통 파인다이닝의 우아함",
    image: `${AI_CONCEPTS_BASE_URL}fine-dining-white.webp`,
    features: [
      "고급 재료 포함 가능",
      "정교한 조리법",
      "상급자 난이도",
      "전문 조리도구 필요",
    ],
  },
];

