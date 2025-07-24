import type { NotificationType } from "./type";

export const NOTIFICATION_MESSAGES: Record<
  NotificationType,
  (actorNickname: string) => string
> = {
  NEW_COMMENT: (actorNickname: string) =>
    `${actorNickname}님이 댓글을 남겼습니다.`,
  NEW_REPLY: (actorNickname: string) =>
    `${actorNickname}님이 답글을 남겼습니다.`,
  AI_RECIPE_DONE: () => `AI 레시피 생성이 완료되었습니다.`,
  NEW_FAVORITE: (actorNickname: string) =>
    `${actorNickname}님이 즐겨찾기에 추가했습니다.`,
  NEW_RECIPE_LIKE: (actorNickname: string) =>
    `${actorNickname}님이 레시피를 좋아합니다.`,
  NEW_COMMENT_LIKE: (actorNickname: string) =>
    `${actorNickname}님이 댓글을 좋아합니다.`,
  NEW_RECIPE_RATING: (actorNickname: string) =>
    `${actorNickname}님이 레시피에 평점을 남겼습니다.`,
};

export const getNotificationMessage = (
  type: NotificationType,
  actorNickname: string
): string => {
  return NOTIFICATION_MESSAGES[type](actorNickname);
};
