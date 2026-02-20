declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

// 웹 → 앱 메시지
export type BridgeMessageType =
  | "HAPTIC"
  | "NAVIGATION"
  | "SHARE"
  | "STORAGE"
  | "NOTIFICATION"
  | "REQUEST_REVIEW";

export type BridgeMessage<T = unknown> = {
  type: BridgeMessageType;
  payload?: T;
};

// 앱 → 웹 메시지
export type AppToWebMessageType = "NOTIFICATION_STATUS";

export type AppToWebMessage = {
  type: "NOTIFICATION_STATUS";
  payload: { status: NotificationStatus };
};

// haptic
export type HapticStyle =
  | "Light"
  | "Medium"
  | "Heavy"
  | "Success"
  | "Warning"
  | "Error";

// notification
export type NotificationAction = "REQUEST_PERMISSION" | "CHECK_STATUS";

export type NotificationPayload = {
  action: NotificationAction;
};

export type NotificationStatus = "granted" | "denied" | "not_determined";
