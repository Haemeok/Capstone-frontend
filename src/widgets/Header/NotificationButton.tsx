"use client";

import Link from "next/link";

import { Bell } from "lucide-react";

import { useInfiniteNotificationsQuery } from "@/entities/notification";
import { useUserStore } from "@/entities/user";

const NotificationButton = () => {
  const { unreadCount } = useInfiniteNotificationsQuery();
  const { user } = useUserStore();

  if (!user) {
    return null;
  }

  return (
    <Link
      href="/notifications"
      aria-label={
        unreadCount > 0
          ? `알림 페이지로 이동 (${unreadCount}개 미읽음)`
          : "알림 페이지로 이동"
      }
      className="relative rounded-full p-1 transition-colors hover:bg-gray-100"
    >
      <div className="relative h-fit w-fit p-1">
        <Bell size={24} className="text-ink-sub" />

        {unreadCount > 0 && (
          <div
            className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"
            role="status"
            aria-label={`${unreadCount}개의 읽지 않은 알림`}
          />
        )}
      </div>
    </Link>
  );
};

export default NotificationButton;
