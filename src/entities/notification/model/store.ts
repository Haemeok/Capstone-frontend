"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { NOTIFICATION_CONFIG } from "@/shared/config/constants/notification";

import type {
  Notification,
  NotificationState,
} from "@/entities/notification/model/type";

type NotificationActions = {
  addNotification: (notification: Notification) => void;

  setNotifications: (notifications: Notification[]) => void;

  markAsRead: (notificationId: number) => void;

  markAllAsRead: () => void;

  deleteNotification: (notificationId: number) => void;

  clearAllNotifications: () => void;

  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;

  updateUnreadCount: () => void;
};

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      addNotification: (notification) => {
        set((state) => {
          const newNotifications = [notification, ...state.notifications];

          const limitedNotifications = newNotifications.slice(
            0,
            NOTIFICATION_CONFIG.MAX_NOTIFICATIONS
          );

          return {
            notifications: limitedNotifications,
            unreadCount: state.unreadCount + (notification.read ? 0 : 1),
          };
        });
      },

      setNotifications: (notifications) => {
        set(() => {
          const validNotifications = notifications ?? [];
          const unreadCount = validNotifications.filter((n) => !n.read).length;
          return {
            notifications: validNotifications,
            unreadCount,
            isLoading: false,
            error: null,
          };
        });
      },

      markAsRead: (notificationId) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(
            (notification) =>
              notification.id === notificationId && !notification.read
                ? { ...notification, read: true }
                : notification
          );

          const wasUnread = state.notifications.find(
            (n) => n.id === notificationId && !n.read
          );
          const newUnreadCount = wasUnread
            ? state.unreadCount - 1
            : state.unreadCount;

          return {
            notifications: updatedNotifications,
            unreadCount: Math.max(0, newUnreadCount),
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (notificationId) => {
        set((state) => {
          const notificationToDelete = state.notifications.find(
            (n) => n.id === notificationId
          );
          const updatedNotifications = state.notifications.filter(
            (n) => n.id !== notificationId
          );

          const newUnreadCount =
            notificationToDelete && !notificationToDelete.read
              ? state.unreadCount - 1
              : state.unreadCount;

          return {
            notifications: updatedNotifications,
            unreadCount: Math.max(0, newUnreadCount),
          };
        });
      },

      clearAllNotifications: () => {
        set(() => ({
          notifications: [],
          unreadCount: 0,
        }));
      },

      setLoading: (loading) => {
        set(() => ({ isLoading: loading }));
      },

      setError: (error) => {
        set(() => ({ error }));
      },

      updateUnreadCount: () => {
        set((state) => ({
          unreadCount: state.notifications.filter((n) => !n.read).length,
        }));
      },
    }),
    {
      name: "notification-store",
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("notification-received", (event: Event) => {
    const customEvent = event as CustomEvent<Notification>;
    const notification: Notification = customEvent.detail;

    // 백엔드 응답 형식 확인 및 변환
    console.log("수신된 알림:", notification);

    useNotificationStore.getState().addNotification(notification);
  });
}
