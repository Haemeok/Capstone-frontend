"use client";

import { useEffect } from "react";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Bell, X } from "lucide-react";

import type { Notification } from "@/entities/notification/model/type";

type NotificationItemProps = {
  notification: Notification;
  onRead?: (notificationId: number) => void;
  onDelete?: (notificationId: number) => void;
  onClick?: (notification: Notification) => void;
  showActions?: boolean;
  className?: string;
};

export const NotificationItem = ({
  notification,
  onRead,
  onDelete,
  onClick,
  showActions = true,
  className = "",
}: NotificationItemProps) => {
  const handleClick = () => {
    onClick?.(notification);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    onDelete?.(notification.id);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  useEffect(() => {
    if (notification.read && onRead) {
      onRead(notification.id);
    }
  }, [notification.read, onRead]);

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 border-b border-gray-100
        hover:bg-gray-50 cursor-pointer transition-colors
        ${!notification.read ? "bg-blue-50" : ""}
        ${className}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={notification.content}
    >
      {!notification.read && (
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p
              className={`
              text-sm line-clamp-2
              ${!notification.read ? "text-gray-900 font-medium" : "text-gray-700"}
            `}
            >
              {notification.content}
            </p>
            <time className="text-xs text-gray-400 mt-2 block">{timeAgo}</time>
          </div>

          {/* 액션 버튼들 */}
          {showActions && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleDeleteClick}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                aria-label="알림 삭제"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
