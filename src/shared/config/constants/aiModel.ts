import type { AIModel } from "@/features/recipe-create-ai";

import type { BannerSlide } from "@/widgets/HomeBannerCarousel/types";

import { IMAGE_BASE_URL, SAVINGS_BASE_URL, ICON_BASE_URL } from "./recipe";

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

export const aiModelBanners: BannerSlide[] = [
  {
    id: "YOUTUBE_IMPORT",
    title: "링크만 넣으면\n레시피 추출 0원",
    subTitle: "유튜브 영상 멈추기 귀찮을 땐?",
    image: `${SAVINGS_BASE_URL}youtube_premium.webp`,
    link: "/recipes/new/youtube",
    badge: {
      text: "EVENT",
      variant: "event",
    },
    highlight: {
      text: "0원",
      color: "#ff0000",
    },
    backgroundColor: "#FFF8E1", // Soft Yellow
    imagePosition: "right",
  },
  {
    id: "INGREDIENT_AI",
    title: "AI 셰프가 짜주는\n맞춤 식단 무료",
    subTitle: "냉장고 속 재료로 뭐 해먹지?",
    image: `${ICON_BASE_URL}ai_chef.webp`,
    link: "/recipes/new/ai/ingredient",
    badge: {
      text: "기간한정",
      variant: "warning",
    },
    highlight: {
      text: "무료",
      color: "#10b981",
    },
    backgroundColor: "#E8F5E9", // Soft Green
    imagePosition: "right",
  },
  {
    id: "FINE_DINING_AI",
    title: "파인다이닝 셰프의\n고품격 레시피 무료",
    subTitle: "평범한 집밥의 화려한 변신",
    image: `${ICON_BASE_URL}record_camera.webp`,
    link: "/recipes/new/ai/finedining",
    badge: {
      text: "NEW",
      variant: "new",
    },
    highlight: {
      text: "무료",
      color: "#9333ea",
    },
    backgroundColor: "#F3E5F5", // Soft Purple
    imagePosition: "right",
  },
];
