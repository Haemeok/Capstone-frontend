import { WEBSOCKET_CONFIG } from "@/shared/config/constants/websocket";

import type { WebSocketConnectionStatus } from "@/entities/notification/model/type";

/**
 * 쿠키 기반 인증을 사용하는 SockJS WebSocket 매니저
 * 브라우저가 자동으로 쿠키를 전송하므로 별도 토큰 처리가 불필요합니다.
 */
export class SockJSWebSocketManager {
  private socket: any = null;
  private stompClient: any = null;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private subscription: any = null;

  private url: string;
  private onStatusChange: (status: WebSocketConnectionStatus) => void;
  private onMessage: (message: any) => void;
  private onError: (error: any) => void;

  constructor(
    url: string,
    _token: string, // 쿠키 기반에서는 사용하지 않지만 호환성을 위해 유지
    callbacks: {
      onStatusChange: (status: WebSocketConnectionStatus) => void;
      onMessage: (message: any) => void;
      onError: (error: any) => void;
    }
  ) {
    this.url = url;
    // 쿠키 기반에서는 토큰을 저장하지 않음
    this.onStatusChange = callbacks.onStatusChange;
    this.onMessage = callbacks.onMessage;
    this.onError = callbacks.onError;
  }

  async connect(): Promise<void> {
    if (this.stompClient?.connected) {
      return;
    }

    this.onStatusChange("connecting");

    try {
      await this.loadLibraries();

      const SockJS = (window as any).SockJS;
      const Stomp = (window as any).Stomp;

      // 쿠키 기반 인증에서는 토큰을 URL에 전달하지 않음
      // 브라우저가 자동으로 쿠키를 전송함
      this.socket = new SockJS(this.url);
      this.stompClient = Stomp.over(this.socket);

      if (process.env.NODE_ENV === "production") {
        this.stompClient.debug = null;
      }

      this.stompClient.connect(
        {}, // headers - 쿠키 기반에서는 별도 헤더 불필요
        this.onConnected.bind(this),
        this.onConnectionError.bind(this)
      );
    } catch (error) {
      console.error("SockJS 연결 초기화 실패:", error);
      this.handleConnectionError();
    }
  }

  disconnect(): void {
    this.clearReconnectTimer();

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log("STOMP 연결 해제됨");
      });
      this.stompClient = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.onStatusChange("disconnected");
    this.reconnectAttempts = 0;
  }

  send(destination: string, message: any): boolean {
    if (this.stompClient?.connected) {
      try {
        this.stompClient.send(destination, {}, JSON.stringify(message));
        return true;
      } catch (error) {
        console.error("STOMP 메시지 전송 실패:", error);
        return false;
      }
    }
    return false;
  }

  getConnectionStatus(): WebSocketConnectionStatus {
    if (this.stompClient?.connected) return "connected";
    if (this.socket) return "connecting";
    return "disconnected";
  }

  private async loadLibraries(): Promise<void> {
    if ((window as any).SockJS && (window as any).Stomp) {
      return;
    }

    await Promise.all([
      this.loadScript(
        "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js",
        "SockJS"
      ),
      this.loadScript(
        "https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js",
        "Stomp"
      ),
    ]);
  }

  private loadScript(src: string, globalName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any)[globalName]) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${globalName}`));
      document.head.appendChild(script);
    });
  }

  private onConnected(frame: any): void {
    console.log(
      "✅ STOMP 연결 성공:",
      frame.headers["user-name"] || "인증 성공"
    );

    this.onStatusChange("connected");
    this.reconnectAttempts = 0;

    this.subscription = this.stompClient.subscribe(
      "/user/queue/notifications",
      (message: any) => {
        try {
          const notification = JSON.parse(message.body);
          console.log("🔔 알림 수신:", notification);

          // 기존 WebSocket 메시지 포맷으로 변환
          const wsMessage = {
            type: "NOTIFICATION",
            data: notification,
          };

          this.onMessage(wsMessage);
        } catch (error) {
          console.error("알림 파싱 실패:", error);
        }
      }
    );
  }

  private onConnectionError(error: any): void {
    console.error("❌ STOMP 연결 에러:", error);
    this.onError(error);
    this.handleConnectionError();
  }

  private handleConnectionError(): void {
    this.onStatusChange("error");
    this.stompClient = null;
    this.socket = null;

    if (this.reconnectAttempts < WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      this.scheduleReconnect();
    } else {
      console.error("최대 재연결 시도 횟수 초과");
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      console.log(
        `재연결 시도 ${this.reconnectAttempts}/${WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS}`
      );
      this.connect();
    }, WEBSOCKET_CONFIG.RECONNECT_DELAY);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
