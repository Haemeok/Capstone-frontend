"use client";

import { useEffect } from "react";
import Image from "next/image";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { X } from "lucide-react";

import { getNotificationMessage } from "@/entities/notification/model/constants";
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
    e.stopPropagation();
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
      aria-label={getNotificationMessage(
        notification.type,
        notification.actorNickname
      )}
    >
      <div className="flex-shrink-0 relative">
        <img
          src={notification.imageUrl}
          alt={`${notification.actorNickname} 프로필`}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p
              className={`
              text-sm line-clamp-2
              ${!notification.read ? "text-gray-900 font-medium" : "text-gray-700"}
            `}
            >
              {getNotificationMessage(
                notification.type,
                notification.actorNickname
              )}
            </p>
            <time className="text-xs text-gray-400 mt-1 block">{timeAgo}</time>
          </div>

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
