import { api } from "@/shared/api/client";

import type { Notification } from "@/entities/notification/model/type";

export const NOTIFICATION_ENDPOINTS = {
  SOCKJS: "/ws/notifications",
  NOTIFICATIONS: "/notifications",
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: "/notifications/read-all",
  DELETE: (id: string) => `/notifications/${id}`,
  DELETE_ALL: "/notifications",
} as const;

export type GetNotificationsParams = {
  cursor?: string; // 커서 기반 페이지네이션
  size?: number;
  isRead?: boolean; // 읽음 상태 필터링
};

export type GetNotificationsResponse = {
  notifications: Notification[];
  nextCursor?: string; // 다음 페이지 커서
  hasNext: boolean;
  totalCount: number;
  unreadCount: number;
};

export const getNotifications = async (
  params: GetNotificationsParams = {}
): Promise<GetNotificationsResponse> => {
  const data = await api.get<GetNotificationsResponse>(
    NOTIFICATION_ENDPOINTS.NOTIFICATIONS,
    { params }
  );
  return data;
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  await api.patch(
    NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId.toString())
  );
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
};

export const deleteNotification = async (
  notificationId: number
): Promise<void> => {
  await api.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId.toString()));
};

export const deleteAllNotifications = async (): Promise<void> => {
  await api.delete(NOTIFICATION_ENDPOINTS.DELETE_ALL);
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const data = await api.get<{ count: number }>(
    `${NOTIFICATION_ENDPOINTS.NOTIFICATIONS}/unread-count`
  );
  return data.count;
};
