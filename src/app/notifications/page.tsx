"use client";

import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import { Button } from "@/shared/ui/shadcn/button";

import {
  NotificationItem,
  NotificationSkeleton,
  useDeleteAllNotifications,
  useDeleteNotification,
  useInfiniteNotificationsQuery,
  useMarkNotificationAsRead,
} from "@/entities/notification";
import type { Notification } from "@/entities/notification";

const NotificationsPage = () => {
  const router = useRouter();
  const { notifications, hasNextPage, isFetching, isFetchingNextPage, ref } =
    useInfiniteNotificationsQuery();

  const { mutate: deleteAllNotifications } = useDeleteAllNotifications();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.relatedUrl) {
      const url = new URL(notification.relatedUrl, window.location.origin);
      url.searchParams.set("notificationId", notification.id.toString());
      router.push(url.pathname + url.search);
    }
  };

  return (
    <Container>
      <div className="flex items-center justify-between relative">
        <PrevButton />
        <h1 className="text-2xl font-bold absolute left-1/2 -translate-x-1/2">
          알림
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => deleteAllNotifications()}
        >
          <Trash2 className="w-4 h-4" />
          모두 삭제
        </Button>
      </div>
      <div className="space-y-2">
        {isFetching && notifications.length === 0 ? (
          <NotificationSkeleton />
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              onDelete={() => deleteNotification(notification.id)}
            />
          ))
        )}
      </div>
      <div ref={ref} className="h-4" />
      {isFetchingNextPage && <div>Loading more...</div>}
      {!hasNextPage && !isFetching && notifications.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          알림이 없습니다.
        </div>
      )}
      {!hasNextPage && notifications.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          모든 알림을 불러왔습니다.
        </div>
      )}
    </Container>
  );
};

export default NotificationsPage;
