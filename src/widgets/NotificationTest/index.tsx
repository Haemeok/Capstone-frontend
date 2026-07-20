"use client";

import { useState } from "react";

import { BASE_API_URL } from "@/shared/config/constants/api";

import { useInfiniteNotificationsQuery } from "@/entities/notification";
import { getNotificationMessage } from "@/entities/notification";
import { useAuthGate, useUserStore } from "@/entities/user";

import { useWebSocket } from "@/app/providers/WebSocketProvider";

export const NotificationTest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { connectionStatus, connect, disconnect } = useWebSocket();
  const authGate = useAuthGate();
  const { user, isAuthenticated } = useUserStore();
  const { notifications, unreadCount } = useInfiniteNotificationsQuery({
    enabled: authGate,
  });

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "연결됨";
      case "connecting":
        return "연결 중...";
      case "error":
        return "연결 실패";
      default:
        return "연결 안됨";
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 left-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="rounded bg-blue-500 px-3 py-2 text-xs text-white shadow-lg hover:bg-blue-600"
        >
          WS 테스트
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">WebSocket 연결 테스트</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-ink-muted hover:text-ink-sub"
        >
          ✕
        </button>
      </div>

      <div className="mb-3">
        <div className="mb-2 flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        <div className="text-ink-sub text-xs">
          인증 상태: {isAuthenticated ? "✓ 로그인됨" : "✗ 로그인 안됨"}
          {user && (
            <div className="text-ink-muted mt-1 text-xs">
              사용자: {user.nickname}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          onClick={connect}
          disabled={connectionStatus === "connected"}
          className="rounded bg-green-500 px-3 py-1 text-xs text-white disabled:bg-gray-300"
        >
          연결
        </button>
        <button
          onClick={disconnect}
          disabled={connectionStatus === "disconnected"}
          className="rounded bg-red-500 px-3 py-1 text-xs text-white disabled:bg-gray-300"
        >
          해제
        </button>
      </div>

      <div className="mb-3 rounded bg-gray-50 p-2 text-xs">
        <div>읽지 않은 알림: {unreadCount}개</div>
        <div>전체 알림: {notifications.length}개</div>
      </div>

      {notifications.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium">최근 알림:</h4>
          <div className="max-h-32 overflow-y-auto text-xs">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`mb-1 rounded p-2 ${
                  notification.read ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <div className="font-medium">
                  {getNotificationMessage(
                    notification.type,
                    notification.actorNickname
                  )}
                </div>
                <div className="text-ink-muted">
                  {notification.type} •{" "}
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <details className="mt-3">
        <summary className="text-ink-sub cursor-pointer text-xs">
          디버그 정보
        </summary>
        <div className="mt-2 rounded bg-gray-100 p-2 font-mono text-xs">
          <div>URL: {BASE_API_URL}</div>
          <div>Mode: SockJS + STOMP</div>
          <div>환경: {process.env.NODE_ENV}</div>
          <div>인증: Cookie-based</div>
        </div>
      </details>
    </div>
  );
};
