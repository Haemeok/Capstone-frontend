import { notifications as en } from "./messages/en/notifications";
import { notifications as ja } from "./messages/ja/notifications";
import { notifications as ko } from "./messages/ko/notifications";
import type { Locale, NotificationsDict } from "./types";

export const notificationsMessages: Record<Locale, NotificationsDict> = {
  ko,
  ja,
  en,
};
