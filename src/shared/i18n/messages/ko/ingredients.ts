import type { IngredientsDict } from "../../types";

export const ingredients: IngredientsDict = {
  headerLoggedIn: "{nickname}님의 냉장고",
  headerLoggedOut: "로그인 후 냉장고를 관리해보세요",
  fabFindRecipes: "내 냉장고로 레시피 찾기",
  actions: {
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
    aiHeading: "AI가 레시피를 추천해드려요",
    aiBody: "냉장고에 남은 재료로 맞춤 레시피를 AI와 함께 생성할 수 있어요",
    searchHeading: "재료로 레시피 검색 가능",
    searchBody:
      "냉장고 재료를 등록하면 내 재료로 만들 수 있는 레시피를 찾을 수 있어요",
    loginButton: "로그인하고 시작하기",
    signupNote: "회원가입 후 매일 무료 AI 레시피 생성권을 받으세요",
    searchAlt: "레시피 검색",
  },
  itemAria: { select: "{name} 선택", detail: "{name} 상세 보기" },
};
