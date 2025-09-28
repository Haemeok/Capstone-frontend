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
      aria-label="알림 페이지로 이동"
      className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
      <div className="h-fit w-fit relative p-1">
        <Bell size={24} className="text-gray-600 " />

        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>
    </Link>
  );
};

export default NotificationButton;
