import type { NotificationStatus } from "@/shared/lib/bridge";

// 앱에서 오는 상태 + 초기 상태
export type NotificationPermissionStatus = NotificationStatus | "unknown";

export type TriggerAction = "like" | "save" | "share" | "complete";
