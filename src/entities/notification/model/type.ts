import { PageResponse } from "@/shared/api/types";

export type NotificationType =
  | "NEW_COMMENT" // 새 댓글
  | "NEW_REPLY" // 댓글 답글
  | "AI_RECIPE_DONE" // AI 레시피 생성 완료
  | "NEW_FAVORITE" // 즐겨찾기 추가
  | "NEW_RECIPE_LIKE" // 레시피 좋아요
  | "NEW_COMMENT_LIKE" // 댓글 좋아요
  | "NEW_RECIPE_RATING"; // 레시피 평점

export type RelatedType = "RECIPE" | "COMMENT" | "USER";

export type Notification = {
  id: number;
  userId: number;
  actorId: number;
  actorNickname: string;
  imageUrl: string;
  type: NotificationType;
  relatedType: RelatedType;
  relatedId: number;
  relatedUrl: string;
  createdAt: string;
  read: boolean;
};

export type NotificationResponse = PageResponse<Notification>;

export type NotificationData = {
  recipeId?: number;
  commentId?: number;
  userId?: number;
  url?: string;
};

// 웹소켓 관련 타입들
export type WebSocketConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type WebSocketMessage = {
  type: "NOTIFICATION" | "HEARTBEAT" | "ERROR";
  data?: any;
};

// 알림 상태 관리 타입들
export type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
};
