// core
export { AppWebViewDetector } from "./AppWebViewDetector";
export { isAppWebView, postMessage } from "./client";
export { useAppMessageListener } from "./useAppMessage";
export { useAuthDiagBridge } from "./useAuthDiagBridge";

// haptic
export { triggerHaptic } from "./haptic";

// notification
export {
  checkNotificationStatus,
  requestNotificationPermission,
} from "./notification";

// share
export { triggerNativeShare } from "./share";

// review
export { requestAppReview } from "./review";

// types
export type { SharePayload } from "./share";
export type {
  AppToWebMessage,
  AuthDiagBridgePayload,
  BridgeMessage,
  BridgeMessageType,
  HapticStyle,
  NotificationStatus,
} from "./types";
