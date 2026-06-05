"use client";

import { useEffect } from "react";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { X } from "lucide-react";

import type { Notification } from "@/entities/notification/model/type";

type NotificationItemProps = {
  notification: Notification;
  onRead?: (notificationId: number) => void;
  onDelete?: (notificationId: number) => void;
  onClick?: (notification: Notification) => void;
  showActions?: boolean;
  className?: string;
};

const NOTIFICATION_MESSAGES: Record<Notification["type"], string> = {
  NEW_COMMENT: "님이 댓글을 남겼습니다.",
  NEW_REPLY: "님이 답글을 남겼습니다.",
  AI_RECIPE_DONE: "AI 레시피 생성이 완료되었습니다.",
  NEW_FAVORITE: "님이 저장했습니다.",
  NEW_RECIPE_LIKE: "님이 레시피를 좋아합니다.",
  NEW_COMMENT_LIKE: "님이 댓글을 좋아합니다.",
  NEW_RECIPE_RATING: "님이 레시피에 평점을 남겼습니다.",
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
  }, [notification.read, notification.id, onRead]);

  return (
    <div
      className={`relative flex cursor-pointer items-start gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${className} `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="relative flex-shrink-0">
        <img
          src={notification.imageUrl}
          alt={`${notification.actorNickname} 프로필`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p
              className={`line-clamp-2 text-sm ${!notification.read ? "font-medium text-gray-900" : "text-gray-700"} `}
            >
              {notification.type === "AI_RECIPE_DONE" ? (
                NOTIFICATION_MESSAGES[notification.type]
              ) : (
                <>
                  <span className="font-bold text-black">
                    {notification.actorNickname}
                  </span>
                  {NOTIFICATION_MESSAGES[notification.type]}
                </>
              )}
            </p>
            <time className="mt-1 block text-xs text-gray-400">{timeAgo}</time>
          </div>

          {showActions && (
            <div className="ml-2 flex items-center gap-1">
              <button
                onClick={handleDeleteClick}
                className="-m-1 rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
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
