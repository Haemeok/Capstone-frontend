"use client";

import { useState } from "react";

import { BASE_API_URL } from "@/shared/config/constants/api";

import { useInfiniteNotificationsQuery } from "@/entities/notification";
import { getNotificationMessage } from "@/entities/notification";
import { useUserStore } from "@/entities/user";

import { useWebSocket } from "@/app/providers/WebSocketProvider";

export const NotificationTest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { connectionStatus, connect, disconnect } = useWebSocket();
  const { user, isAuthenticated } = useUserStore();
  const { notifications, unreadCount } = useInfiniteNotificationsQuery();

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
          className="px-3 py-2 bg-blue-500 text-white text-xs rounded shadow-lg hover:bg-blue-600"
        >
          WS 테스트
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">WebSocket 연결 테스트</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        <div className="text-xs text-gray-600">
          인증 상태: {isAuthenticated ? "✓ 로그인됨" : "✗ 로그인 안됨"}
          {user && (
            <div className="text-xs text-gray-500 mt-1">
              사용자: {user.nickname}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          onClick={connect}
          disabled={connectionStatus === "connected"}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded disabled:bg-gray-300"
        >
          연결
        </button>
        <button
          onClick={disconnect}
          disabled={connectionStatus === "disconnected"}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded disabled:bg-gray-300"
        >
          해제
        </button>
      </div>

      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <div>읽지 않은 알림: {unreadCount}개</div>
        <div>전체 알림: {notifications.length}개</div>
      </div>

      {notifications.length > 0 && (
        <div>
          <h4 className="text-xs font-medium mb-2">최근 알림:</h4>
          <div className="max-h-32 overflow-y-auto text-xs">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`p-2 mb-1 rounded ${
                  notification.read ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <div className="font-medium">
                  {getNotificationMessage(
                    notification.type,
                    notification.actorNickname
                  )}
                </div>
                <div className="text-gray-500">
                  {notification.type} •{" "}
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <details className="mt-3">
        <summary className="text-xs cursor-pointer text-gray-600">
          디버그 정보
        </summary>
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
          <div>URL: {BASE_API_URL}</div>
          <div>Mode: SockJS + STOMP</div>
          <div>환경: {process.env.NODE_ENV}</div>
          <div>인증: Cookie-based</div>
        </div>
      </details>
    </div>
  );
};
