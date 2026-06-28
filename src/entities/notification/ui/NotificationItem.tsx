"use client";

import { useEffect } from "react";

import { formatDistanceToNow } from "date-fns";
import { enUS, ja as jaDate, ko as koDate } from "date-fns/locale";
import { X } from "lucide-react";

import {
  format as formatMsg,
  useChromeLocale,
  useNotificationsDict,
} from "@/shared/i18n";

import type { Notification } from "@/entities/notification/model/type";

type NotificationItemProps = {
  notification: Notification;
  onRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
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
  const t = useNotificationsDict();
  const locale = useChromeLocale();
  const dateLocale = locale === "ja" ? jaDate : locale === "en" ? enUS : koDate;

  const handleClick = () => {
    onClick?.(notification);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: dateLocale,
  });

  const template =
    // runtime type may be outside union
    t.templates[notification.type as keyof typeof t.templates] ??
    t.genericMessage;

  const messageText =
    notification.type === "AI_RECIPE_DONE" ||
    notification.type === "REFERRAL_REWARD_GRANTED"
      ? (notification.message ?? template)
      : formatMsg(template, { actor: notification.actorNickname });

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
          alt={formatMsg(t.profileAlt, { name: notification.actorNickname })}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p
              className={`line-clamp-2 text-sm ${!notification.read ? "text-ink font-medium" : "text-ink-sub"} `}
            >
              {messageText}
            </p>
            <time className="text-ink-muted mt-1 block text-xs">{timeAgo}</time>
          </div>

          {showActions && (
            <div className="ml-2 flex items-center gap-1">
              <button
                onClick={handleDeleteClick}
                className="hover:text-ink-sub -m-1 rounded-full p-2 text-gray-400 hover:bg-gray-200"
                aria-label={t.deleteAria}
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
