"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SockJSWebSocketManager } from "@/shared/lib/sockjs-websocket";
import type {
  WebSocketConnectionStatus,
  WebSocketMessage,
} from "@/entities/notification/model/type";
import { useUserStore } from "@/entities/user";
import { API_CONFIG } from "@/shared/api/config";
import { NOTIFICATION_ENDPOINTS } from "@/entities/notification/model/api";

type WebSocketContextValue = {
  connectionStatus: WebSocketConnectionStatus;
  sendMessage: (message: WebSocketMessage) => boolean;
  connect: () => void;
  disconnect: () => void;
};

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

type WebSocketProviderProps = {
  children: ReactNode;
  url?: string;
};

export const WebSocketProvider = ({
  children,
  url,
}: WebSocketProviderProps) => {
  const [connectionStatus, setConnectionStatus] =
    useState<WebSocketConnectionStatus>("disconnected");
  const wsManagerRef = useRef<SockJSWebSocketManager | null>(null);
  const { user } = useUserStore();

  const sockjsUrl = `${NOTIFICATION_ENDPOINTS.SOCKJS}`;

  useEffect(() => {
    if (!user) {
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
        wsManagerRef.current = null;
      }
      return;
    }

    if (!wsManagerRef.current) {
      wsManagerRef.current = new SockJSWebSocketManager(sockjsUrl, "", {
        onStatusChange: setConnectionStatus,
        onMessage: handleMessage,
        onError: handleError,
      });
    }

    // 연결 시작
    wsManagerRef.current.connect();

    // 클린업
    return () => {
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
      }
    };
  }, [user, sockjsUrl]);

  // 페이지가 포커스되었을 때 재연결 시도
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        user &&
        wsManagerRef.current
      ) {
        if (wsManagerRef.current.getConnectionStatus() === "disconnected") {
          wsManagerRef.current.connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "NOTIFICATION":
        // 알림 메시지 처리는 notification store에서 담당
        // 여기서는 이벤트만 발생시킴
        window.dispatchEvent(
          new CustomEvent("notification-received", {
            detail: message.data,
          })
        );
        break;
      case "HEARTBEAT":
        // 하트비트 응답은 특별한 처리 불필요
        break;
      case "ERROR":
        console.error("WebSocket error:", message.data);
        break;
      default:
        console.warn("Unknown message type:", message.type);
    }
  };

  const handleError = (error: Event) => {
    console.error("WebSocket connection error:", error);
  };

  const sendMessage = (message: WebSocketMessage): boolean => {
    // SockJS에서는 일반적으로 클라이언트에서 메시지를 보내지 않음
    // 필요시 특정 destination으로 전송 가능
    return wsManagerRef.current?.send("/app/message", message) ?? false;
  };

  const connect = () => {
    wsManagerRef.current?.connect();
  };

  const disconnect = () => {
    wsManagerRef.current?.disconnect();
  };

  const contextValue: WebSocketContextValue = {
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
