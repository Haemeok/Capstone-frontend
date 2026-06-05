import { renderHook } from "@testing-library/react";

import { useUserStore } from "../store";
import { type User } from "../types";
import { useAdFreeStatus } from "../useAdFreeStatus";

describe("useAdFreeStatus", () => {
  afterEach(() => useUserStore.setState({ user: null }));

  it("광고 노출이 false이고 만료일이 미래면 활성", () => {
    useUserStore.setState({
      // 테스트 픽스처 — 훅은 adStatus만 읽으므로 부분 User로 캐스트
      user: {
        adStatus: {
          showAds: false,
          adFreeUntil: new Date(Date.now() + 90000000).toISOString(),
        },
      } as User,
    });

    const { result } = renderHook(() => useAdFreeStatus());

    expect(result.current.isActive).toBe(true);
    expect(result.current.remaining).toBeGreaterThan(0);
  });

  it("광고 노출이 true면 비활성", () => {
    useUserStore.setState({
      // 테스트 픽스처 — 광고 노출 상태
      user: { adStatus: { showAds: true, adFreeUntil: null } } as User,
    });

    const { result } = renderHook(() => useAdFreeStatus());

    expect(result.current.isActive).toBe(false);
  });

  it("만료일이 과거면 비활성", () => {
    useUserStore.setState({
      // 테스트 픽스처 — 이미 만료된 광고 제거
      user: {
        adStatus: {
          showAds: false,
          adFreeUntil: new Date(Date.now() - 1000).toISOString(),
        },
      } as User,
    });

    const { result } = renderHook(() => useAdFreeStatus());

    expect(result.current.isActive).toBe(false);
  });

  it("adStatus가 없으면 비활성", () => {
    useUserStore.setState({
      // 테스트 픽스처 — adStatus 미설정
      user: {} as User,
    });

    const { result } = renderHook(() => useAdFreeStatus());

    expect(result.current.isActive).toBe(false);
  });
});
