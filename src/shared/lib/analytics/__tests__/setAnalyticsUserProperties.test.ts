import type { AppContextPayload } from "@/shared/lib/bridge";

import { setAnalyticsUserProperties } from "../setAnalyticsUserProperties";

const ctx: AppContextPayload = {
  v: 1,
  isNativeApp: true,
  appVersion: "1.2.3",
  platform: "ios",
  osVersion: "17.4",
  deviceModel: "iPhone15,2",
  pushPermission: "granted",
  locale: "ko-KR",
};

describe("setAnalyticsUserProperties", () => {
  afterEach(() => {
    delete (window as { gtag?: unknown }).gtag;
  });

  it("maps AppContextPayload to GA4 user_properties via gtag('set')", () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    setAnalyticsUserProperties(ctx);

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("set", "user_properties", {
      is_native_app: true,
      app_version: "1.2.3",
      app_platform: "ios",
      os_version: "17.4",
      device_model: "iPhone15,2",
      push_permission: "granted",
      app_locale: "ko-KR",
    });
  });

  it("is a no-op when window.gtag is absent", () => {
    expect(() => setAnalyticsUserProperties(ctx)).not.toThrow();
  });
});
