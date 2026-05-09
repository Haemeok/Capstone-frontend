import { act, renderHook } from "@testing-library/react";

import { useKeyboardSource } from "../useKeyboardSource";

const fireMessage = (data: unknown) => {
  window.dispatchEvent(
    new MessageEvent("message", { data: JSON.stringify(data) })
  );
};

const setupViewport = (innerHeight: number, vvHeight: number) => {
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    writable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "visualViewport", {
    configurable: true,
    writable: true,
    value: {
      height: vvHeight,
      offsetTop: 0,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  });
};

describe("useKeyboardSource", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupViewport(800, 800);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("초기 상태는 none, height 0", () => {
    const { result } = renderHook(() => useKeyboardSource());
    expect(result.current.source).toBe("none");
    expect(result.current.height).toBe(0);
  });

  it("bridge did-show 메시지 도착 시 bridge 우선 + height 적용", () => {
    const { result } = renderHook(() => useKeyboardSource());
    act(() => {
      fireMessage({
        type: "KEYBOARD_STATE",
        payload: { v: 1, state: "did-show", height: 320, duration: 250 },
      });
    });
    expect(result.current.source).toBe("bridge");
    expect(result.current.height).toBe(320);
    expect(result.current.isOpen).toBe(true);
  });

  it("bridge will-hide 즉시 height 0으로 reset (iOS offsetTop stale 우회)", () => {
    const { result } = renderHook(() => useKeyboardSource());
    act(() => {
      fireMessage({
        type: "KEYBOARD_STATE",
        payload: { v: 1, state: "did-show", height: 320, duration: 250 },
      });
    });
    act(() => {
      fireMessage({
        type: "KEYBOARD_STATE",
        payload: { v: 1, state: "will-hide", height: 0, duration: 250 },
      });
    });
    expect(result.current.height).toBe(0);
    expect(result.current.isOpen).toBe(false);
  });

  it("미지의 v 버전은 무시하고 viewport 폴백 유지", () => {
    setupViewport(800, 500);
    const { result } = renderHook(() => useKeyboardSource());
    act(() => {
      fireMessage({
        type: "KEYBOARD_STATE",
        payload: { v: 999, state: "did-show", height: 999, duration: 0 },
      });
    });
    expect(result.current.source).not.toBe("bridge");
  });

  it("bridge stale 5초 경과 시 viewport로 자동 폴백", () => {
    setupViewport(800, 500);
    const { result } = renderHook(() => useKeyboardSource());
    act(() => {
      fireMessage({
        type: "KEYBOARD_STATE",
        payload: { v: 1, state: "did-show", height: 320, duration: 0 },
      });
    });
    expect(result.current.source).toBe("bridge");
    act(() => {
      jest.advanceTimersByTime(5001);
    });
    expect(result.current.source).toBe("viewport");
  });
});
