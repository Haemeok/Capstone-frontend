"use client";

import Link from "next/link";

import { Bell } from "lucide-react";

import { format, plural, useChromeDict } from "@/shared/i18n";

import { useInfiniteNotificationsQuery } from "@/entities/notification";
import { useUserStore } from "@/entities/user";

const NotificationButton = () => {
  const { unreadCount } = useInfiniteNotificationsQuery();
  const { user } = useUserStore();
  const t = useChromeDict();

  if (!user) {
    return null;
  }

  return (
    <Link
      href="/notifications"
      aria-label={
        unreadCount > 0
          ? format(plural(unreadCount, t.notificationsUnreadAria), {
              count: unreadCount,
            })
          : t.notificationsAria
      }
      className="relative rounded-full p-1 transition-colors hover:bg-gray-100"
    >
      <div className="relative h-fit w-fit p-1">
        <Bell size={24} className="text-ink-sub" />

        {unreadCount > 0 && (
          <div
            className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"
            role="status"
            aria-label={format(plural(unreadCount, t.unreadBadgeAria), {
              count: unreadCount,
            })}
          />
        )}
      </div>
    </Link>
  );
};

export default NotificationButton;
