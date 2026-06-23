import type { AppContextPayload } from "@/shared/lib/bridge";

export function setAnalyticsUserProperties(ctx: AppContextPayload): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("set", "user_properties", {
    is_native_app: ctx.isNativeApp,
    app_version: ctx.appVersion,
    app_platform: ctx.platform,
    os_version: ctx.osVersion,
    device_model: ctx.deviceModel,
    push_permission: ctx.pushPermission,
    app_locale: ctx.locale,
  });
}
