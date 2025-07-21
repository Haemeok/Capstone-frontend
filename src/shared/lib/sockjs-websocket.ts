import { WEBSOCKET_CONFIG } from "@/shared/config/constants/websocket";

import type { WebSocketConnectionStatus } from "@/entities/notification/model/type";

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
    _token: string,
    callbacks: {
      onStatusChange: (status: WebSocketConnectionStatus) => void;
      onMessage: (message: any) => void;
      onError: (error: any) => void;
    }
  ) {
    this.url = url;

    this.onStatusChange = callbacks.onStatusChange;
    this.onMessage = callbacks.onMessage;
    this.onError = callbacks.onError;
  }

  async connect(): Promise<void> {
    if (this.stompClient?.connected) {
      return;
    }

    // disconnect가 호출된 경우 (재연결 시도 횟수가 최대값에 도달한 경우) 연결 시도 중단
    if (this.reconnectAttempts >= WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.log(
        "WebSocket 연결이 명시적으로 해제되어 재연결을 시도하지 않습니다."
      );
      return;
    }

    this.onStatusChange("connecting");

    try {
      await this.loadLibraries();

      const SockJS = (window as any).SockJS;
      const Stomp = (window as any).StompJs.Stomp;

      // SockJS 옵션 설정으로 transport 제한 및 타임아웃 설정
      this.socket = new SockJS(this.url, null, {
        transports: ["websocket"],
      });

      this.stompClient = Stomp.over(this.socket);

      // STOMP 연결 헤더에 heartbeat 설정 추가
      this.stompClient.connect(
        {},
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

    // 재연결 시도 횟수를 최대값으로 설정하여 추가 재연결 시도 방지
    this.reconnectAttempts = WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS;

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

  resetReconnection(): void {
    this.reconnectAttempts = 0;
    this.clearReconnectTimer();
  }

  private async loadLibraries(): Promise<void> {
    if ((window as any).SockJS && (window as any).StompJs) {
      return;
    }

    await Promise.all([
      this.loadScript(WEBSOCKET_CONFIG.SOCKJS_CDN_URL, "SockJS"),
      this.loadScript(WEBSOCKET_CONFIG.STOMP_CDN_URL, "StompJs"),
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
    console.log("🔗 연결된 transport:", this.socket._transport?.transport);

    this.onStatusChange("connected");
    this.reconnectAttempts = 0;

    this.subscription = this.stompClient.subscribe(
      "/user/queue/notifications",
      (message: any) => {
        try {
          const notification = JSON.parse(message.body);
          console.log("🔔 알림 수신:", notification);

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

    // 재연결 시도 횟수가 최대값 미만이고, 명시적으로 disconnect가 호출되지 않은 경우에만 재연결 시도
    if (this.reconnectAttempts < WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      this.scheduleReconnect();
    } else {
      console.error("최대 재연결 시도 횟수 초과 또는 연결이 해제됨");
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
