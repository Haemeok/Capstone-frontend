"use client";

import { useEffect } from "react";

import type { AppToWebMessage, AppToWebMessageType } from "./types";

type MessageHandler<T extends AppToWebMessageType> = (
  payload: Extract<AppToWebMessage, { type: T }>["payload"]
) => void;

type MessageHandlers = {
  [K in AppToWebMessageType]?: MessageHandler<K>;
};

export const useAppMessageListener = (handlers: MessageHandlers) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        const { type, payload } = data as AppToWebMessage;

        if (type && handlers[type]) {
          handlers[type]?.(payload);
        }
      } catch {
        // 파싱 실패 시 무시 (다른 메시지일 수 있음)
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handlers]);
};
