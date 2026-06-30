"use client";

import { useEffect } from "react";

import type { AppToWebMessage, AppToWebMessageType } from "./types";

type MessageHandler<T extends AppToWebMessageType> = (
  payload: Extract<AppToWebMessage, { type: T }>["payload"]
) => void;

type MessageHandlers = {
  [K in AppToWebMessageType]?: MessageHandler<K>;
};

const APP_TO_WEB_MESSAGE_TYPES = {
  NOTIFICATION_STATUS: true,
  AUTH_DIAG: true,
  KEYBOARD_STATE: true,
  APP_CONTEXT: true,
} satisfies Record<AppToWebMessageType, true>;

const isAppToWebMessage = (data: unknown): data is AppToWebMessage => {
  if (typeof data !== "object" || data === null) return false;
  const { type } = data as { type?: unknown };
  return (
    typeof type === "string" && Object.hasOwn(APP_TO_WEB_MESSAGE_TYPES, type)
  );
};

export const useAppMessageListener = (handlers: MessageHandlers) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data: unknown;
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        // 파싱 실패 시 무시 (다른 메시지일 수 있음)
        return;
      }

      if (!isAppToWebMessage(data)) return;

      const handler = handlers[data.type];
      if (handler) {
        (handler as (payload: unknown) => void)(data.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handlers]);
};
