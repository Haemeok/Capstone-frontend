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
      className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Bell size={24} className="text-gray-600 relative" />
      {unreadCount > 0 && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </Link>
  );
};

export default NotificationButton;
