"use client";

import { Trash2 } from "lucide-react";

import {
  NotificationItem,
  useInfiniteNotificationsQuery,
} from "@/entities/notification";
import { Button } from "@/shared/ui/shadcn/button";
import PrevButton from "@/shared/ui/PrevButton";

const NotificationsPage = () => {
  const { notifications, error, hasNextPage, isFetchingNextPage, ref } =
    useInfiniteNotificationsQuery();

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between relative">
        <PrevButton />
        <h1 className="text-2xl font-bold absolute left-1/2 -translate-x-1/2">
          알림
        </h1>
        <Button variant="outline" size="sm">
          <Trash2 className="w-4 h-4" />
          모두 읽음 처리
        </Button>
      </div>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
      <div ref={ref} className="h-4" />
      {isFetchingNextPage && <div>Loading more...</div>}
      {!hasNextPage && (
        <div className="text-center text-gray-500 py-4">
          모든 알림을 불러왔습니다.
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
