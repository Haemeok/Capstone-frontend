export const NOTIFICATION_STORAGE_KEYS = {
  // 30일 숨김 여부만 localStorage에 저장 (권한 상태는 앱에서 메모리로 받음)
  DISMISSED: "notification_permission_dismissed",
} as const;

export const DISMISS_DURATION_DAYS = 30;
export const DISMISS_DURATION_MS = DISMISS_DURATION_DAYS * 24 * 60 * 60 * 1000;
