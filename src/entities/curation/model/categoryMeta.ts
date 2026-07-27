import type { CurationCategory } from "./categories";

export type CurationCategoryMeta = {
  koLabel: string;
  description: string;
};

export const CATEGORY_META: Record<CurationCategory, CurationCategoryMeta> = {
  "DIET & LIGHT": {
    koLabel: "다이어트 & 가벼운 한 끼",
    description: "칼로리는 가볍게, 포만감은 든든하게",
  },
  "COMFORT FOOD": {
    koLabel: "위로의 한 끼",
    description: "마음까지 따뜻해지는 든든한 집밥",
  },
  "QUICK & EASY": {
    koLabel: "빠르고 간단한",
    description: "15분 안에 끝나는 초간단 메뉴",
  },
  "IN SEASON": {
    koLabel: "제철 한 상",
    description: "지금 가장 맛있는 식재료로",
  },
  GATHERINGS: {
    koLabel: "모임과 파티",
    description: "손님 초대도 자신 있게",
  },
  WELLNESS: {
    koLabel: "건강한 식탁",
    description: "영양 챙기는 일상 식단",
  },
  "SOLO PLATE": {
    koLabel: "1인분의 즐거움",
    description: "혼자도 잘 먹는 정성스런 한 끼",
  },
  "SWEET HOUR": {
    koLabel: "달콤한 시간",
    description: "디저트와 간식, 달콤한 한 입",
  },
  "FOOD & LIFE": {
    koLabel: "음식 그리고 일상",
    description: "먹는 즐거움이 만드는 라이프스타일",
  },
};
