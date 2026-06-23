declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

// 웹 → 앱 메시지
export type BridgeMessageType =
  | "AUTH_STATE_CHANGED"
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
export type AppToWebMessageType =
  | "NOTIFICATION_STATUS"
  | "AUTH_DIAG"
  | "KEYBOARD_STATE"
  | "APP_CONTEXT";

export type AuthDiagBridgePayload = {
  phase: string;
  source: string;
  diagId: string;
  meta?: Record<string, unknown>;
};

export type KeyboardBridgeState =
  | "will-show"
  | "did-show"
  | "will-hide"
  | "did-hide";

export type KeyboardStatePayload = {
  v: 1;
  state: KeyboardBridgeState;
  height: number;
  duration: number;
};

export type AppContextPayload = {
  v: 1;
  isNativeApp: true;
  appVersion: string;
  platform: "ios" | "android";
  osVersion: string;
  deviceModel: string;
  pushPermission: "granted" | "denied" | "not_determined";
  locale: string;
};

export type AppToWebMessage =
  | { type: "NOTIFICATION_STATUS"; payload: { status: NotificationStatus } }
  | { type: "AUTH_DIAG"; payload: AuthDiagBridgePayload }
  | { type: "KEYBOARD_STATE"; payload: KeyboardStatePayload }
  | { type: "APP_CONTEXT"; payload: AppContextPayload };

// auth state
export type AuthStatePayload = {
  event: "login" | "refresh" | "logout";
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
