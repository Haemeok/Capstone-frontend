import type { CurationCategory } from "./categories";

export type CurationCategoryMeta = {
  koLabel: string;
  description: string;
  keywords: readonly string[];
};

export const CATEGORY_META: Record<CurationCategory, CurationCategoryMeta> = {
  "DIET & LIGHT": {
    koLabel: "다이어트 & 가벼운 한 끼",
    description: "칼로리는 가볍게, 포만감은 든든하게",
    keywords: ["다이어트 레시피", "저칼로리", "가벼운 한끼", "샐러드"],
  },
  "COMFORT FOOD": {
    koLabel: "위로의 한 끼",
    description: "마음까지 따뜻해지는 든든한 집밥",
    keywords: ["집밥 레시피", "따뜻한 음식", "국물요리", "한식"],
  },
  "QUICK & EASY": {
    koLabel: "빠르고 간단한",
    description: "15분 안에 끝나는 초간단 메뉴",
    keywords: ["간단요리", "15분 레시피", "초간단 레시피", "자취 요리"],
  },
  "IN SEASON": {
    koLabel: "제철 한 상",
    description: "지금 가장 맛있는 식재료로",
    keywords: ["제철 레시피", "제철 음식", "계절 요리", "제철 식재료"],
  },
  GATHERINGS: {
    koLabel: "모임과 파티",
    description: "손님 초대도 자신 있게",
    keywords: ["홈파티 메뉴", "집들이 음식", "모임 요리", "파티 레시피"],
  },
  WELLNESS: {
    koLabel: "건강한 식탁",
    description: "영양 챙기는 일상 식단",
    keywords: ["건강식", "영양식", "건강한 식단", "웰빙 요리"],
  },
  "SOLO PLATE": {
    koLabel: "1인분의 즐거움",
    description: "혼자도 잘 먹는 정성스런 한 끼",
    keywords: ["1인분 레시피", "혼밥", "혼자 먹는 한끼", "자취 요리"],
  },
  "SWEET HOUR": {
    koLabel: "달콤한 시간",
    description: "디저트와 간식, 달콤한 한 입",
    keywords: ["디저트 레시피", "홈베이킹", "간식 만들기", "베이킹"],
  },
  "FOOD & LIFE": {
    koLabel: "음식 그리고 일상",
    description: "먹는 즐거움이 만드는 라이프스타일",
    keywords: ["푸드 매거진", "음식 이야기", "라이프스타일", "푸드 에세이"],
  },
};
