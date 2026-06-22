import type { CommonDict } from "../../types";

export const common: CommonDict = {
  readMore: "더 읽기",
  collapse: "숨기기",
  readMoreAria: "본문 더 읽기",
  collapseAria: "본문 숨기기",
  loginRequired: "로그인이 필요합니다.",
  actions: {
    save: "저장",
    unsave: "저장 해제",
    like: "좋아요",
    unlike: "좋아요 취소",
    share: "공유하기",
    shareLabel: "공유",
    close: "닫기",
    back: "뒤로 가기",
    edit: "수정",
    remix: "편집",
    editRecipeAria: "레시피 수정",
    remixRecipeAria: "레시피 편집",
    recipeOptions: "레시피 옵션",
  },
  modal: {
    delete: {
      description: "삭제 시 복구할 수 없습니다.",
      cancel: "취소",
      confirm: "삭제",
    },
    unsavedChanges: {
      title: "저장하지 않고 나가시겠어요?",
      description: "작성 중인 내용이 저장되지 않습니다.",
      cancel: "취소",
      leave: "나가기",
    },
  },
  sort: { title: "정렬 방식 선택", reset: "초기화", apply: "완료" },
  toast: {
    logout: {
      pending: "로그아웃 중...",
      error: "로그아웃에 실패했습니다: {message}",
    },
    deleteAccount: {
      pending: "계정 삭제 중...",
      success: "계정이 삭제되었습니다.",
      error: "계정 삭제에 실패했습니다: {message}",
    },
  },
  errors: { unknown: "알 수 없는 오류가 발생했습니다." },
};
