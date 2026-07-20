import { renderHook } from "@testing-library/react";

import { useUserStore } from "../store";
import { useAuthGate } from "../useAuthGate";

describe("useAuthGate", () => {
  it("프로브 응답 전(isAuthReady=false)에는 게이트가 닫혀 있다 (T-07)", () => {
    useUserStore.setState({ isAuthReady: false, isAuthenticated: false });
    const { result } = renderHook(() => useAuthGate());
    expect(result.current).toBe(false);
  });

  it("비로그인(isAuthReady=true, isAuthenticated=false)에는 게이트가 닫혀 있다 (T-07)", () => {
    useUserStore.setState({ isAuthReady: true, isAuthenticated: false });
    const { result } = renderHook(() => useAuthGate());
    expect(result.current).toBe(false);
  });

  it("로그인(isAuthReady=true, isAuthenticated=true)에는 게이트가 열린다 (T-07)", () => {
    useUserStore.setState({ isAuthReady: true, isAuthenticated: true });
    const { result } = renderHook(() => useAuthGate());
    expect(result.current).toBe(true);
  });
});
