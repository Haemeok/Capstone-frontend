import type { CategoryDict } from "../../types";

export const category: CategoryDict = {
  navAriaLabel: "카테고리",
  emptyTitle: "아직 {tagName} 레시피가 없어요",
  emptySubtitle: "첫 번째 레시피를 직접 만들어보세요.",
  emptyCta: "레시피 만들기",
  meta: {
    fallbackTitle: "카테고리 - 레시피오",
    titleTemplate: "{emoji} {name} 레시피 모음",
    descriptionTemplate:
      "{name} 카테고리의 인기 레시피를 확인하세요. AI가 추천하는 맞춤형 {name} 요리법으로 집에서 맛있게 해먹어보세요!",
    imageAltTemplate: "{name} 레시피 모음",
  },
};
