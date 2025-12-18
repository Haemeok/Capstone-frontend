import type { AIModel } from "@/features/recipe-create-ai";

import { IMAGE_BASE_URL } from "./recipe";

export const LOADING_BASE_URL = `${IMAGE_BASE_URL}loadings/`;

// AI 모델 ID 타입 재정의
export type AIModelId =
  | "INGREDIENT_FOCUS"
  | "COST_EFFECTIVE"
  | "NUTRITION_BALANCE"
  | "FINE_DINING";

// 로딩 애니메이션은 기존 리소스 활용 (매핑)
export const aiModels: Record<AIModelId, AIModel> = {
  INGREDIENT_FOCUS: {
    id: "INGREDIENT_FOCUS",
    name: "냉장고 파먹기",
    image: `${IMAGE_BASE_URL}robots/classic.webp`,
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
    image: `${IMAGE_BASE_URL}robots/creative.webp`,
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
    image: `${IMAGE_BASE_URL}robots/healthy.webp`,
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
    image: `${IMAGE_BASE_URL}robots/gourmet.webp`,
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
];

