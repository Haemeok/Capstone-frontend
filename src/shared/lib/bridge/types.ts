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
  | "IMAGE_ACTION"
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
  | "APP_CONTEXT"
  | "IMAGE_ACTION_RESULT";

export type NativeImageAction = "saveImage" | "shareImage";

export type NativeImageActionErrorCode =
  | "INVALID_PAYLOAD"
  | "FILE_WRITE_FAILED"
  | "PHOTO_SAVE_FAILED"
  | "SHARE_UNAVAILABLE"
  | "SHARE_FAILED";

export type ImageActionPayload = {
  v: 1;
  actionId: string;
  action: NativeImageAction;
  fileName: string;
  mimeType: "image/png";
  base64: string;
};

export type ImageActionResultPayload = {
  v: 1;
  actionId: string;
  action: NativeImageAction;
  status: "accepted" | "saved" | "presented" | "failed";
  errorCode?: NativeImageActionErrorCode;
};

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
  | { type: "APP_CONTEXT"; payload: AppContextPayload }
  | { type: "IMAGE_ACTION_RESULT"; payload: ImageActionResultPayload };

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
