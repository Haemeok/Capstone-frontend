import { api } from "@/shared/api/client";
import { BaseQueryParams } from "@/shared/api/types";
import { PAGE_SIZE } from "@/shared/config/constants/api";

import type {
  Notification,
  NotificationResponse,
} from "@/entities/notification/model/type";

export const NOTIFICATION_ENDPOINTS = {
  SOCKJS: "/ws/notifications",
  NOTIFICATIONS: "/notifications",
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: "/notifications/read-all",
  DELETE: (id: string) => `/notifications/${id}`,
  DELETE_ALL: "/notifications",
} as const;

export type NotificationsParams = {
  size?: number;
  pageParam?: number;
};

export const getNotifications = async ({
  size = PAGE_SIZE,
  pageParam = 0,
}: NotificationsParams): Promise<NotificationResponse> => {
  const baseParams: Partial<BaseQueryParams> = {
    page: pageParam,
    size,
  };
  const data = await api.get<NotificationResponse>(
    NOTIFICATION_ENDPOINTS.NOTIFICATIONS,
    { params: baseParams }
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
