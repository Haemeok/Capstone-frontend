import { PageResponse } from "@/shared/api/types";

export type NotificationType =
  | "NEW_COMMENT"
  | "NEW_REPLY"
  | "AI_RECIPE_DONE"
  | "NEW_FAVORITE"
  | "NEW_RECIPE_LIKE"
  | "NEW_COMMENT_LIKE"
  | "NEW_RECIPE_RATING";

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

export type WebSocketConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type WebSocketMessage = {
  type: "NOTIFICATION" | "HEARTBEAT" | "ERROR";
  data?: any;
};

export type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
};
