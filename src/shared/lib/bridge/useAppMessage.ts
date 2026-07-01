"use client";

import { useEffect } from "react";

import { parseAppToWebMessage } from "./appMessageGuard";
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
      let data: unknown;
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        // 파싱 실패 시 무시 (다른 메시지일 수 있음)
        return;
      }

      const message = parseAppToWebMessage(data);
      if (!message) return;

      const handler = handlers[message.type];
      if (handler) {
        (handler as (payload: unknown) => void)(message.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handlers]);
};
