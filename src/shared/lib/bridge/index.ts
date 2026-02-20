// core
export { AppWebViewDetector } from "./AppWebViewDetector";
export { isAppWebView, postMessage } from "./client";
export { useAppMessageListener } from "./useAppMessage";

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
  BridgeMessage,
  BridgeMessageType,
  HapticStyle,
  NotificationStatus,
} from "./types";
