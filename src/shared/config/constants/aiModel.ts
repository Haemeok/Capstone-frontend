import type { AIModel } from "@/features/recipe-create-ai";

import type { BannerSlide } from "@/widgets/HomeBannerCarousel/types";

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

export const aiModelBanners: BannerSlide[] = [
  {
    id: "INGREDIENT_FOCUS",
    title: "냉장고 속 재료가",
    description: "남은 재료로 만드는, 버릴 것 하나 없는 완벽한 한 끼",
    image: aiModels.INGREDIENT_FOCUS.image,
    link: "/recipes/new/ai/ingredient",
    badge: {
      text: "🎯 AI 레시피 추천",
      variant: "default",
    },
    highlight: {
      text: "특별한 요리로 태어납니다",
      color: "#ffffff",
    },
  },
  {
    id: "COST_EFFECTIVE",
    title: "만원으로 시작하는",
    description: "합리적인 가격으로 누리는 프리미엄 홈 다이닝",
    image: aiModels.COST_EFFECTIVE.image,
    link: "/recipes/new/ai/price",
    badge: {
      text: "💰 가성비 최고",
      variant: "default",
    },
    highlight: {
      text: "레스토랑 부럽지 않은 한 끼",
      color: "#ffffff",
    },
  },
  {
    id: "NUTRITION_BALANCE",
    title: "맛있게 먹으면서",
    description: "탄단지 밸런스부터 칼로리까지, 영양을 디자인하다",
    image: aiModels.NUTRITION_BALANCE.image,
    link: "/recipes/new/ai/nutrition",
    badge: {
      text: "💪 건강한 식단",
      variant: "success",
    },
    highlight: {
      text: "건강해지는 가장 쉬운 방법",
      color: "#10b981",
    },
  },
  {
    id: "FINE_DINING",
    title: "미슐랭의 기술을",
    description: "파인 다이닝 셰프의 노하우로 완성하는 특별한 순간",
    image: aiModels.FINE_DINING.image,
    link: "/recipes/new/ai/finedining",
    badge: {
      text: "⭐ 프리미엄 레시피",
      variant: "warning",
    },
    highlight: {
      text: "우리 집 식탁에서",
      color: "#ffffff",
    },
  },
];
