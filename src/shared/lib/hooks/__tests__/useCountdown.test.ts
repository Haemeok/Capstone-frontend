import { act, renderHook } from "@testing-library/react";

import { useCountdown } from "../useCountdown";

describe("useCountdown (T-503)", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("1초마다 남은 ms가 줄고 0에서 멈춘다", () => {
    const target = new Date(Date.now() + 2000).toISOString();
    const { result } = renderHook(() => useCountdown(target));
    expect(result.current).toBeGreaterThan(0);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(0);
  });
});
