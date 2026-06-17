"use client";

import { Trash2 } from "lucide-react";

import { useLocalizedRouter, useNotificationsDict } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import { Button } from "@/shared/ui/shadcn/button";

import type { Notification } from "@/entities/notification";
import {
  NotificationItem,
  NotificationSkeleton,
  useDeleteAllNotifications,
  useDeleteNotification,
  useInfiniteNotificationsQuery,
  useMarkNotificationAsRead,
} from "@/entities/notification";

const NotificationsPage = () => {
  const router = useLocalizedRouter();
  const t = useNotificationsDict();
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
      <div className="relative flex h-10 items-center justify-between">
        <PrevButton />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          {t.title}
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="absolute right-0 cursor-pointer"
          onClick={() => deleteAllNotifications()}
        >
          <Trash2 className="h-4 w-4" />
          {t.deleteAll}
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
      {isFetchingNextPage && <div>{t.loadingMore}</div>}
      {!hasNextPage && !isFetching && notifications.length === 0 && (
        <div className="text-ink-muted py-4 text-center">{t.empty}</div>
      )}
      {!hasNextPage && notifications.length > 0 && (
        <div className="text-ink-muted py-4 text-center">{t.allLoaded}</div>
      )}
    </Container>
  );
};

export default NotificationsPage;
