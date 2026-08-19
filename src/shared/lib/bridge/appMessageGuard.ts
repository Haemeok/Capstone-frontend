import type {
  AppContextPayload,
  AppToWebMessage,
  AuthDiagBridgePayload,
  ImageActionResultPayload,
  KeyboardStatePayload,
  NotificationStatus,
} from "./types";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const NOTIFICATION_STATUSES: readonly string[] = [
  "granted",
  "denied",
  "not_determined",
];

const PLATFORMS: readonly string[] = ["ios", "android"];
const IMAGE_ACTIONS: readonly string[] = ["saveImage", "shareImage"];
const IMAGE_ACTION_STATUSES: readonly string[] = [
  "accepted",
  "saved",
  "presented",
  "failed",
];
const IMAGE_ACTION_ERROR_CODES: readonly string[] = [
  "INVALID_PAYLOAD",
  "FILE_WRITE_FAILED",
  "PHOTO_SAVE_FAILED",
  "SHARE_UNAVAILABLE",
  "SHARE_FAILED",
];

const isNotificationStatusPayload = (
  p: unknown
): p is { status: NotificationStatus } =>
  isObject(p) &&
  typeof p.status === "string" &&
  NOTIFICATION_STATUSES.includes(p.status);

const isAuthDiagPayload = (p: unknown): p is AuthDiagBridgePayload =>
  isObject(p) &&
  typeof p.phase === "string" &&
  typeof p.source === "string" &&
  typeof p.diagId === "string";

const isKeyboardStatePayload = (p: unknown): p is KeyboardStatePayload =>
  isObject(p) &&
  p.v === 1 &&
  typeof p.state === "string" &&
  typeof p.height === "number";

const isAppContextPayload = (p: unknown): p is AppContextPayload =>
  isObject(p) &&
  p.v === 1 &&
  p.isNativeApp === true &&
  typeof p.appVersion === "string" &&
  typeof p.platform === "string" &&
  PLATFORMS.includes(p.platform) &&
  typeof p.osVersion === "string" &&
  typeof p.deviceModel === "string" &&
  typeof p.pushPermission === "string" &&
  NOTIFICATION_STATUSES.includes(p.pushPermission) &&
  typeof p.locale === "string";

const isImageActionResultPayload = (
  payload: unknown
): payload is ImageActionResultPayload => {
  if (
    !isObject(payload) ||
    payload.v !== 1 ||
    typeof payload.actionId !== "string" ||
    payload.actionId.length === 0 ||
    typeof payload.action !== "string" ||
    !IMAGE_ACTIONS.includes(payload.action) ||
    typeof payload.status !== "string" ||
    !IMAGE_ACTION_STATUSES.includes(payload.status)
  ) {
    return false;
  }
  if (payload.status === "failed") {
    return (
      typeof payload.errorCode === "string" &&
      IMAGE_ACTION_ERROR_CODES.includes(payload.errorCode)
    );
  }
  if (payload.errorCode !== undefined) return false;
  return (
    payload.status === "accepted" ||
    (payload.action === "saveImage" && payload.status === "saved") ||
    (payload.action === "shareImage" && payload.status === "presented")
  );
};

export const parseAppToWebMessage = (data: unknown): AppToWebMessage | null => {
  if (!isObject(data)) return null;
  const { type, payload } = data;
  switch (type) {
    case "NOTIFICATION_STATUS":
      return isNotificationStatusPayload(payload) ? { type, payload } : null;
    case "AUTH_DIAG":
      return isAuthDiagPayload(payload) ? { type, payload } : null;
    case "KEYBOARD_STATE":
      return isKeyboardStatePayload(payload) ? { type, payload } : null;
    case "APP_CONTEXT":
      return isAppContextPayload(payload) ? { type, payload } : null;
    case "IMAGE_ACTION_RESULT":
      return isImageActionResultPayload(payload) ? { type, payload } : null;
    default:
      return null;
  }
};
