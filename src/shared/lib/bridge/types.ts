declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export type HapticStyle =
  | "Light"
  | "Medium"
  | "Heavy"
  | "Success"
  | "Warning"
  | "Error";

export type BridgeMessageType =
  | "HAPTIC"
  | "NAVIGATION"
  | "SHARE"
  | "STORAGE"
  | "NOTIFICATION";

export type NotificationAction = "REQUEST_PERMISSION" | "CHECK_STATUS";

export type NotificationPayload = {
  action: NotificationAction;
};

export type NotificationStatus = "granted" | "denied" | "not_determined";

export type BridgeMessage<T = unknown> = {
  type: BridgeMessageType;
  payload?: T;
};

// 앱 → 웹 메시지 타입
export type AppToWebMessageType = "NOTIFICATION_STATUS";

export type AppToWebMessage =
  | {
      type: "NOTIFICATION_STATUS";
      payload: { status: NotificationStatus };
    };
