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
    description: "균형 잡힌 영양을 고려한 레시피를 전문적으로 추천합니다.",
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
    description: "바쁜 현대인을 위한 빠르고 간편한 레시피를 제공합니다.",
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
    description: "특별한 날을 위한 고급스럽고 창의적인 레시피를 제안합니다.",
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
