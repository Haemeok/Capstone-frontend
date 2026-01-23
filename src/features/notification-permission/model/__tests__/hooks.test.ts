import { act, renderHook } from "@testing-library/react";

import { isAppWebView, requestNotificationPermission } from "@/shared/lib/bridge";
import { storage } from "@/shared/lib/storage";

import { DISMISS_DURATION_MS, NOTIFICATION_STORAGE_KEYS } from "../constants";
import {
  useNotificationPermissionActions,
  useNotificationPermissionTrigger,
} from "../hooks";
import { useNotificationPermissionStore } from "../store";

jest.mock("@/shared/lib/bridge", () => ({
  isAppWebView: jest.fn(),
  requestNotificationPermission: jest.fn(),
}));

jest.mock("@/shared/lib/storage", () => ({
  storage: {
    getItemWithExpiry: jest.fn(),
    setItemWithExpiry: jest.fn(),
  },
}));

const mockedIsAppWebView = isAppWebView as jest.MockedFunction<
  typeof isAppWebView
>;
const mockedRequestNotificationPermission =
  requestNotificationPermission as jest.MockedFunction<
    typeof requestNotificationPermission
  >;
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe("useNotificationPermissionTrigger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNotificationPermissionStore.setState({
      status: "unknown",
      isDrawerOpen: false,
      hasTriggeredThisSession: false,
    });
  });

  describe("checkAndTrigger", () => {
    it("WebView가 아니면 true를 반환해야 함 (Drawer 표시 안 함)", () => {
      mockedIsAppWebView.mockReturnValue(false);

      const { result } = renderHook(() => useNotificationPermissionTrigger());

      let shouldProceed: boolean = false;
      act(() => {
        shouldProceed = result.current.checkAndTrigger("like");
      });

      expect(shouldProceed).toBe(true);
      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(false);
    });

    it("이미 권한이 granted면 true를 반환해야 함", () => {
      mockedIsAppWebView.mockReturnValue(true);
      useNotificationPermissionStore.setState({ status: "granted" });

      const { result } = renderHook(() => useNotificationPermissionTrigger());

      let shouldProceed: boolean = false;
      act(() => {
        shouldProceed = result.current.checkAndTrigger("like");
      });

      expect(shouldProceed).toBe(true);
      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(false);
    });

    it("30일 숨김 기간 내면 true를 반환해야 함", () => {
      mockedIsAppWebView.mockReturnValue(true);
      mockedStorage.getItemWithExpiry.mockReturnValue(true);
      useNotificationPermissionStore.setState({ status: "not_determined" });

      const { result } = renderHook(() => useNotificationPermissionTrigger());

      let shouldProceed: boolean = false;
      act(() => {
        shouldProceed = result.current.checkAndTrigger("like");
      });

      expect(shouldProceed).toBe(true);
      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(false);
    });

    it("세션 내 이미 Drawer를 표시했으면 true를 반환해야 함", () => {
      mockedIsAppWebView.mockReturnValue(true);
      mockedStorage.getItemWithExpiry.mockReturnValue(null);
      useNotificationPermissionStore.setState({
        status: "not_determined",
        hasTriggeredThisSession: true,
      });

      const { result } = renderHook(() => useNotificationPermissionTrigger());

      let shouldProceed: boolean = false;
      act(() => {
        shouldProceed = result.current.checkAndTrigger("like");
      });

      expect(shouldProceed).toBe(true);
      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(false);
    });

    it("status가 unknown이면 true를 반환해야 함 (앱이 먼저 상태 보내야 함)", () => {
      mockedIsAppWebView.mockReturnValue(true);
      mockedStorage.getItemWithExpiry.mockReturnValue(null);
      useNotificationPermissionStore.setState({
        status: "unknown",
        hasTriggeredThisSession: false,
      });

      const { result } = renderHook(() => useNotificationPermissionTrigger());

      let shouldProceed: boolean = false;
      act(() => {
        shouldProceed = result.current.checkAndTrigger("like");
      });

      expect(shouldProceed).toBe(true);
      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(false);
    });

    it("status가 not_determined이고 모든 조건 통과 시 false를 반환하고 Drawer를 열어야 함", () => {
      mockedIsAppWebView.mockReturnValue(true);
      mockedStorage.getItemWithExpiry.mockReturnValue(null);
      useNotificationPermissionStore.setState({
        status: "not_determined",
        hasTriggeredThisSession: false,
      });

      const { result } = renderHook(() => useNotificationPermissionTrigger());

      let shouldProceed: boolean = true;
      act(() => {
        shouldProceed = result.current.checkAndTrigger("like");
      });

      expect(shouldProceed).toBe(false);
      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(true);
      expect(
        useNotificationPermissionStore.getState().hasTriggeredThisSession
      ).toBe(true);
    });

    it("status가 denied이고 30일 숨김 안됐으면 Drawer를 열어야 함", () => {
      mockedIsAppWebView.mockReturnValue(true);
      mockedStorage.getItemWithExpiry.mockReturnValue(null);
      useNotificationPermissionStore.setState({
        status: "denied",
        hasTriggeredThisSession: false,
      });

      const { result } = renderHook(() => useNotificationPermissionTrigger());

      let shouldProceed: boolean = true;
      act(() => {
        shouldProceed = result.current.checkAndTrigger("like");
      });

      expect(shouldProceed).toBe(false);
      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(true);
    });
  });
});

describe("useNotificationPermissionActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNotificationPermissionStore.setState({
      status: "not_determined",
      isDrawerOpen: true,
      hasTriggeredThisSession: false,
    });
  });

  describe("handleAccept", () => {
    it("앱에 알림 권한 요청 메시지를 전송해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionActions());

      act(() => {
        result.current.handleAccept();
      });

      expect(mockedRequestNotificationPermission).toHaveBeenCalled();
    });

    it("Drawer를 닫아야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionActions());

      act(() => {
        result.current.handleAccept();
      });

      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(false);
    });
  });

  describe("handleDecline", () => {
    it("30일 숨김을 localStorage에 저장해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionActions());

      act(() => {
        result.current.handleDecline();
      });

      expect(mockedStorage.setItemWithExpiry).toHaveBeenCalledWith(
        NOTIFICATION_STORAGE_KEYS.DISMISSED,
        true,
        DISMISS_DURATION_MS
      );
    });

    it("status를 denied로 설정해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionActions());

      act(() => {
        result.current.handleDecline();
      });

      expect(useNotificationPermissionStore.getState().status).toBe("denied");
    });

    it("Drawer를 닫아야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionActions());

      act(() => {
        result.current.handleDecline();
      });

      expect(useNotificationPermissionStore.getState().isDrawerOpen).toBe(false);
    });
  });
});
