import { postMessage } from "./client";
import type { NotificationPayload } from "./types";

export const requestNotificationPermission = (): void => {
  postMessage<NotificationPayload>("NOTIFICATION", {
    action: "REQUEST_PERMISSION",
  });
};

export const checkNotificationStatus = (): void => {
  postMessage<NotificationPayload>("NOTIFICATION", {
    action: "CHECK_STATUS",
  });
};
