"use client";

import { useInfiniteNotifications } from "@/entities/notification";
import type { Notification } from "@/entities/notification/model/type";

import { useDeleteNotification } from "@/features/notification-delete/model/hooks";
import { useMarkNotificationAsRead } from "@/features/notification-mark-read/model/hooks";

export const useNotificationList = () => {
  const infiniteQuery = useInfiniteNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleNotificationClick = (
    notification: Notification,
    onNotificationClick?: (notification: Notification) => void
  ) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }

    onNotificationClick?.(notification);

    if (notification.relatedUrl) {
      window.location.href = notification.relatedUrl;
    }
  };

  const handleDeleteNotification = (notificationId: number) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return {
    ...infiniteQuery,
    markAsReadMutation,
    deleteNotificationMutation,
    handleNotificationClick,
    handleDeleteNotification,
  };
};
