"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { api } from "@/shared/api/client";
import { BASE_WEBSOCKET_URL } from "@/shared/config/constants/api";
import { SockJSWebSocketManager } from "@/shared/lib/sockjs-websocket";

import { NOTIFICATION_ENDPOINTS } from "@/entities/notification/model/api";
import type {
  WebSocketConnectionStatus,
  WebSocketMessage,
} from "@/entities/notification/model/type";
import { useUserStore } from "@/entities/user";

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

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [connectionStatus, setConnectionStatus] =
    useState<WebSocketConnectionStatus>("disconnected");
  const wsManagerRef = useRef<SockJSWebSocketManager | null>(null);
  const { user } = useUserStore();

  const sockjsUrl = `${BASE_WEBSOCKET_URL}${NOTIFICATION_ENDPOINTS.SOCKJS}`;

  useEffect(() => {
    if (!user) {
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
        wsManagerRef.current = null;
      }
      setConnectionStatus("disconnected");
      return;
    }

    const connectWithTicket = async () => {
      if (wsManagerRef.current) return;

      try {
        console.log("WebSocket: Requesting ticket...");

        const data = await api.post<{ ticket: string }>("/ws-ticket");
        const ticket = data.ticket;

        if (!ticket) {
          throw new Error("WebSocket 티켓 발급에 실패했습니다.");
        }

        console.log("WebSocket: Ticket received, connecting...");
        const urlWithTicket = `${sockjsUrl}?token=${ticket}`;

        wsManagerRef.current = new SockJSWebSocketManager(urlWithTicket, "", {
          onStatusChange: setConnectionStatus,
          onMessage: handleMessage,
          onError: handleError,
        });
        wsManagerRef.current.resetReconnection();
        wsManagerRef.current.connect();
      } catch (error) {
        console.error("WebSocket 티켓 발급 또는 연결 실패:", error);
      }
    };

    connectWithTicket();

    return () => {
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
        wsManagerRef.current = null;
      }
    };
  }, [user, sockjsUrl]);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "NOTIFICATION":
        window.dispatchEvent(
          new CustomEvent("notification-received", {
            detail: message.data,
          })
        );
        break;
      case "HEARTBEAT":
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
