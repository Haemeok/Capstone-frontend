import type { IngredientsDict } from "../../types";

export const ingredients: IngredientsDict = {
  title: "내 냉장고",
  ownedCount: "{count}개의 재료를 보관 중이에요",
  ownedCountLoading: "보유 재료 수 불러오는 중",
  ownedCountUnavailable: "보유 재료 수를 불러올 수 없어요",
  addEntry: "재료를 검색해서 추가하세요",
  categoryGroup: "재료 카테고리",
  fabFindRecipes: "이 재료로 레시피 찾기",
  actions: {
    manage: "관리",
    delete: "삭제",
    addIngredient: "재료 추가",
    selectAll: "전체 선택",
    cancel: "취소",
    done: "완료",
  },
  deleteFab: {
    one: "{count}개 선택 · 재료 삭제",
    other: "{count}개 선택 · 재료 삭제",
  },
  error: { prefix: "오류 발생", unknown: "알 수 없는 오류" },
  empty: {
    heading: "아직 등록된 재료가 없어요",
    bodyLine1: "냉장고에 재료를 추가하고",
    bodyLine2: "맞춤 레시피를 추천받아 보세요",
    cta: "재료 추가하기",
  },
  loginCta: {
    title: "내 냉장고",
    body: "로그인하면 보유한 재료를 한곳에서 관리하고 맞춤 레시피를 찾을 수 있어요.",
    loginButton: "로그인하고 시작하기",
  },
  itemAria: { select: "{name} 선택", detail: "{name} 상세 보기" },
};
