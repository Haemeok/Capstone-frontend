import type { RecipeActionsDict } from "../../types";

export const recipeActions: RecipeActionsDict = {
  deleteModalTitle: "레시피를 삭제하시겠어요?",
  deleteSuccess: "레시피가 삭제되었습니다.",
  deleting: "삭제 중...",
  deleteError: "삭제에 실패했습니다: {message}",
  remixOnboarding: "이제 유튜브 레시피를 편집해서 저장할 수 있어요!",
  onboardingCloseAria: "안내 닫기",
  remixEncourage: "이 레시피를 내 스타일로 편집해보세요!",
  shareTitle: "{title} - 레시피오",
  shareText: "{title} 레시피를 확인해보세요!",
  savedToBook: "{bookName}에 저장되었습니다.",
  savedToDefault: '"저장된 레시피"에 보관되었습니다.',
  changeBookAction: "변경",
};
