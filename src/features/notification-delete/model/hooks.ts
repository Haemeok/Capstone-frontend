"use client";

import { useDeleteNotification } from "@/entities/notification";

export {
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/entities/notification";

export const useConfirmDelete = () => {
  const deleteNotificationMutation = useDeleteNotification();

  const confirmAndDelete = (
    notificationId: number,
    confirmMessage?: string
  ) => {
    const message = confirmMessage || "이 알림을 삭제하시겠습니까?";

    if (window.confirm(message)) {
      deleteNotificationMutation.mutate(notificationId);
    }
  };

  return { confirmAndDelete };
};
