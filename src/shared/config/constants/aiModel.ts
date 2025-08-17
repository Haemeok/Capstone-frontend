import type { AIModel } from "@/features/recipe-create-ai";
import { IMAGE_BASE_URL } from "./recipe";

export const LOADING_BASE_URL = `${IMAGE_BASE_URL}loadings/`;
export type AIModelId = "CLASSIC" | "CREATIVE" | "HEALTHY" | "GOURMET";

export const aiModels: Record<AIModelId, AIModel> = {
  CLASSIC: {
    id: "CLASSIC",
    name: "기본에 충실한 셰프",
    image: `${IMAGE_BASE_URL}robots/classic.webp`,
    description: "가장 기본적인 레시피를 추천해 드립니다. 저에게 맡겨주세요!",
    loadingAnimation: {
      image: `${LOADING_BASE_URL}classic.webp`,
      frames: 12,
      duration: 3,
    },
  },
  CREATIVE: {
    id: "CREATIVE",
    name: "창의적인 실험가",
    image: `${IMAGE_BASE_URL}robots/creative.webp`,
    description:
      "새로운 맛의 조합을 원하세요? 상상력을 자극하는 레시피를 만나보세요",
    loadingAnimation: {
      image: `${LOADING_BASE_URL}creative.webp`,
      frames: 11,
      duration: 3,
    },
  },
  HEALTHY: {
    id: "HEALTHY",
    name: "건강 식단 전문",
    image: `${IMAGE_BASE_URL}robots/healthy.webp`,
    description: "맛과 건강, 모두 만족시키는 똑똑한 레시피를 알려드릴게요",
    loadingAnimation: {
      image: `${LOADING_BASE_URL}healthy.webp`,
      frames: 13,
      duration: 3,
    },
  },
  GOURMET: {
    id: "GOURMET",
    name: "든든한 미식가",
    image: `${IMAGE_BASE_URL}robots/gourmet.webp`,
    description:
      "맛집 웨이팅은 이제 그만! 집에서 근사한 미식의 세계를 즐겨보세요",
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
