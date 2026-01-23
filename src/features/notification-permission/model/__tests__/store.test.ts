import { act, renderHook } from "@testing-library/react";

import { useNotificationPermissionStore } from "../store";

describe("useNotificationPermissionStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNotificationPermissionStore.setState({
      status: "unknown",
      isDrawerOpen: false,
      hasTriggeredThisSession: false,
    });
  });

  describe("openDrawer", () => {
    it("isDrawerOpen을 true로 설정해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionStore());

      act(() => {
        result.current.openDrawer();
      });

      expect(result.current.isDrawerOpen).toBe(true);
    });
  });

  describe("closeDrawer", () => {
    it("isDrawerOpen을 false로 설정해야 함", () => {
      useNotificationPermissionStore.setState({ isDrawerOpen: true });
      const { result } = renderHook(() => useNotificationPermissionStore());

      act(() => {
        result.current.closeDrawer();
      });

      expect(result.current.isDrawerOpen).toBe(false);
    });
  });

  describe("setStatus", () => {
    it("status를 업데이트해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionStore());

      act(() => {
        result.current.setStatus("granted");
      });

      expect(result.current.status).toBe("granted");
    });
  });

  describe("markAsTriggered", () => {
    it("hasTriggeredThisSession을 true로 설정해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionStore());

      act(() => {
        result.current.markAsTriggered();
      });

      expect(result.current.hasTriggeredThisSession).toBe(true);
    });
  });

  describe("updateStatusFromApp", () => {
    it("앱에서 granted 상태를 받으면 status를 granted로 설정해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionStore());

      act(() => {
        result.current.updateStatusFromApp("granted");
      });

      expect(result.current.status).toBe("granted");
    });

    it("앱에서 denied 상태를 받으면 status를 denied로 설정해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionStore());

      act(() => {
        result.current.updateStatusFromApp("denied");
      });

      expect(result.current.status).toBe("denied");
    });

    it("앱에서 not_determined 상태를 받으면 status를 not_determined로 설정해야 함", () => {
      const { result } = renderHook(() => useNotificationPermissionStore());

      act(() => {
        result.current.updateStatusFromApp("not_determined");
      });

      expect(result.current.status).toBe("not_determined");
    });
  });
});
