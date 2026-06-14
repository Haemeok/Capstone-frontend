import type { NotificationsDict } from "../../types";

export const notifications: NotificationsDict = {
  title: "알림",
  deleteAll: "모두 삭제",
  empty: "알림이 없습니다.",
  allLoaded: "모든 알림을 불러왔습니다.",
  loadingMore: "Loading more...",
  deleteAria: "알림 삭제",
  profileAlt: "{name} 프로필",
  templates: {
    NEW_COMMENT: "{actor}님이 댓글을 남겼습니다.",
    NEW_REPLY: "{actor}님이 답글을 남겼습니다.",
    AI_RECIPE_DONE: "AI 레시피 생성이 완료되었습니다.",
    NEW_FAVORITE: "{actor}님이 저장했습니다.",
    NEW_RECIPE_LIKE: "{actor}님이 레시피를 좋아합니다.",
    NEW_COMMENT_LIKE: "{actor}님이 댓글을 좋아합니다.",
    NEW_RECIPE_RATING: "{actor}님이 레시피에 평점을 남겼습니다.",
    REFERRAL_REWARD_GRANTED: "추천 보상으로 광고 제거 혜택이 추가됐어요.",
  },
  genericMessage: "새로운 알림이 있습니다.",
};
