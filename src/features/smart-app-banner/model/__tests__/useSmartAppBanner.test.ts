import { act, renderHook } from "@testing-library/react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { useIsApp } from "@/shared/hooks/useIsApp";
import { storage } from "@/shared/lib/storage";

import { DISMISS_DURATION_MS, SHOW_DELAY_MS } from "../constants";
import { useSmartAppBanner } from "../useSmartAppBanner";

jest.mock("@/shared/hooks/useIsApp", () => ({
  useIsApp: jest.fn(),
}));

jest.mock("@/shared/lib/storage", () => ({
  storage: {
    getItemWithExpiry: jest.fn(),
    setItemWithExpiry: jest.fn(),
  },
}));

const mockedUseIsApp = useIsApp as jest.MockedFunction<typeof useIsApp>;
const mockedStorage = storage as jest.Mocked<typeof storage>;

const IOS_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
const ANDROID_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0";

const setUserAgent = (ua: string) => {
  Object.defineProperty(navigator, "userAgent", {
    value: ua,
    configurable: true,
  });
};

describe("useSmartAppBanner", () => {
  const originalUserAgent = navigator.userAgent;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockedUseIsApp.mockReturnValue(false);
    mockedStorage.getItemWithExpiry.mockReturnValue(null);
    setUserAgent(IOS_USER_AGENT);
  });

  afterEach(() => {
    jest.useRealTimers();
    setUserAgent(originalUserAgent);
  });

  describe("isVisible", () => {
    it("초기 상태에서는 배너가 보이지 않아야 함", () => {
      const { result } = renderHook(() => useSmartAppBanner());

      expect(result.current.isVisible).toBe(false);
    });

    it("앱 WebView에서는 배너가 표시되지 않아야 함", () => {
      mockedUseIsApp.mockReturnValue(true);

      const { result } = renderHook(() => useSmartAppBanner());

      act(() => {
        jest.advanceTimersByTime(SHOW_DELAY_MS);
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("안드로이드에서는 배너가 표시되지 않아야 함", () => {
      setUserAgent(ANDROID_USER_AGENT);

      const { result } = renderHook(() => useSmartAppBanner());

      act(() => {
        jest.advanceTimersByTime(SHOW_DELAY_MS);
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("이전에 닫기를 눌렀으면 (TTL 내) 배너가 표시되지 않아야 함", () => {
      mockedStorage.getItemWithExpiry.mockReturnValue(true);

      const { result } = renderHook(() => useSmartAppBanner());

      act(() => {
        jest.advanceTimersByTime(SHOW_DELAY_MS);
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("iOS 웹 브라우저에서 딜레이 후 배너가 표시되어야 함", () => {
      const { result } = renderHook(() => useSmartAppBanner());

      expect(result.current.isVisible).toBe(false);

      act(() => {
        jest.advanceTimersByTime(SHOW_DELAY_MS);
      });

      expect(result.current.isVisible).toBe(true);
    });
  });

  describe("dismiss", () => {
    it("dismiss 호출 시 isVisible이 false가 되어야 함", () => {
      const { result } = renderHook(() => useSmartAppBanner());

      act(() => {
        jest.advanceTimersByTime(SHOW_DELAY_MS);
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("dismiss 호출 시 7일 TTL로 localStorage에 저장해야 함", () => {
      const { result } = renderHook(() => useSmartAppBanner());

      act(() => {
        jest.advanceTimersByTime(SHOW_DELAY_MS);
      });

      act(() => {
        result.current.dismiss();
      });

      expect(mockedStorage.setItemWithExpiry).toHaveBeenCalledWith(
        STORAGE_KEYS.SMART_APP_BANNER_DISMISSED,
        true,
        DISMISS_DURATION_MS
      );
    });
  });
});
