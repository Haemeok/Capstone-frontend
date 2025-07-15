import { api } from "@/shared/api/client";

import type { Notification } from "@/entities/notification/model/type";

/**
 * 알림 관련 API 엔드포인트들
 */
export const NOTIFICATION_ENDPOINTS = {
  SOCKJS: "/ws/notifications",
  NOTIFICATIONS: "/notifications",
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: "/notifications/read-all",
  DELETE: (id: string) => `/notifications/${id}`,
  DELETE_ALL: "/notifications",
} as const;

/**
 * 알림 목록 조회 파라미터
 */
export type GetNotificationsParams = {
  cursor?: string; // 커서 기반 페이지네이션
  size?: number;
  isRead?: boolean; // 읽음 상태 필터링
};

/**
 * 알림 목록 응답 타입 (무한스크롤용)
 */
export type GetNotificationsResponse = {
  notifications: Notification[];
  nextCursor?: string; // 다음 페이지 커서
  hasNext: boolean;
  totalCount: number;
  unreadCount: number;
};

/**
 * 알림 목록을 조회합니다
 */
export const getNotifications = async (
  params: GetNotificationsParams = {}
): Promise<GetNotificationsResponse> => {
  const data = await api.get<GetNotificationsResponse>(
    NOTIFICATION_ENDPOINTS.NOTIFICATIONS,
    { params }
  );
  return data;
};

/**
 * 특정 알림을 읽음 처리합니다
 */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  await api.patch(
    NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId.toString())
  );
};

/**
 * 모든 알림을 읽음 처리합니다
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
};

/**
 * 특정 알림을 삭제합니다
 */
export const deleteNotification = async (
  notificationId: number
): Promise<void> => {
  await api.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId.toString()));
};

/**
 * 모든 알림을 삭제합니다
 */
export const deleteAllNotifications = async (): Promise<void> => {
  await api.delete(NOTIFICATION_ENDPOINTS.DELETE_ALL);
};

/**
 * 읽지 않은 알림 개수를 조회합니다
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const data = await api.get<{ count: number }>(
    `${NOTIFICATION_ENDPOINTS.NOTIFICATIONS}/unread-count`
  );
  return data.count;
};
