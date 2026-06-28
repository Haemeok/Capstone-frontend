import { PageResponse } from "@/shared/api/types";

export type NotificationType =
  | "NEW_COMMENT"
  | "NEW_REPLY"
  | "AI_RECIPE_DONE"
  | "NEW_FAVORITE"
  | "NEW_RECIPE_LIKE"
  | "NEW_COMMENT_LIKE"
  | "NEW_RECIPE_RATING"
  | "REFERRAL_REWARD_GRANTED";

export type RelatedType = "RECIPE" | "COMMENT" | "USER" | "REFERRAL_REDEMPTION";

export type Notification = {
  id: string;
  userId: string;
  actorId: string;
  actorNickname: string;
  imageUrl: string;
  type: NotificationType;
  relatedType: RelatedType;
  relatedId: string;
  relatedUrl: string;
  createdAt: string;
  read: boolean;
  message?: string;
};

export type NotificationResponse = PageResponse<Notification>;

export type NotificationData = {
  recipeId?: string;
  commentId?: string;
  userId?: string;
  url?: string;
};

export type WebSocketConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type WebSocketMessage = {
  type: "NOTIFICATION" | "HEARTBEAT" | "ERROR";
  data?: unknown;
};

export type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
};
