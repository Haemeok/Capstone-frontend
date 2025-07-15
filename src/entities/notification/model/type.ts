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
  id: number; // 백엔드: number
  userId: number; // 수신자 ID
  actorId: number; // 알림을 발생시킨 사용자 ID
  type: NotificationType;
  content: string; // 백엔드: content (기존 message)
  relatedType: RelatedType; // 관련 엔티티 타입
  relatedId: number; // 관련 엔티티 ID
  relatedUrl: string; // 클릭 시 이동할 URL
  createdAt: string; // ISO 8601 형식
  read: boolean; // 백엔드: read (기존 isRead)
};

// 호환성을 위한 헬퍼 타입 (기존 코드에서 사용)
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
