"use client";

import { useState } from "react";

import { Bell, Trash2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";

import {
  NotificationBadge,
  useNotificationStore,
} from "@/entities/notification";
import type { Notification } from "@/entities/notification/model/type";
import { useUserStore } from "@/entities/user";

import { useDeleteAllNotifications } from "@/features/notification-delete/model/hooks";
import { useMarkAllNotificationsAsRead } from "@/features/notification-mark-read/model/hooks";

import { NotificationList } from "@/widgets/NotificationList";

type NotificationDropdownProps = {
  className?: string;
};

export const NotificationDropdown = ({
  className = "",
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, notifications } = useNotificationStore();
  const { user } = useUserStore();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteAllNotificationsMutation = useDeleteAllNotifications();

  if (!user) {
    return null;
  }

  const handleNotificationClick = (notification: Notification) => {
    setIsOpen(false);
  };

  const handleDeleteAllNotifications = () => {
    if (notifications.length === 0) return;

    const confirmMessage = `모든 알림 ${notifications.length}개를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`;

    if (window.confirm(confirmMessage)) {
      deleteAllNotificationsMutation.mutate();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
          aria-label="알림"
        >
          <Bell size={24} className="text-gray-600" />

          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1">
              <NotificationBadge count={unreadCount} size="sm" />
            </div>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">알림</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
              >
                {markAllAsReadMutation.isPending ? "처리 중..." : "모두 읽음"}
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAllNotifications}
                disabled={deleteAllNotificationsMutation.isPending}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
                title="모든 알림 삭제"
              >
                <Trash2 size={14} />
                {deleteAllNotificationsMutation.isPending
                  ? "삭제 중..."
                  : "전체 삭제"}
              </button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <NotificationList
            onNotificationClick={handleNotificationClick}
            showActions={false}
            emptyMessage="새로운 알림이 없습니다."
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
