import { renderHook } from "@testing-library/react";

import { useKeyboardHeight } from "../useKeyboardHeight";

type MockVV = {
  height: number;
  offsetTop: number;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
};

const setupViewport = (innerHeight: number, partial: Partial<MockVV>) => {
  const vv: MockVV = {
    height: partial.height ?? innerHeight,
    offsetTop: partial.offsetTop ?? 0,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    writable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "visualViewport", {
    configurable: true,
    writable: true,
    value: vv,
  });
  return vv;
};

describe("useKeyboardHeight", () => {
  it("키보드 닫힘 상태: keyboardHeight=0", () => {
    setupViewport(800, { height: 800, offsetTop: 0 });
    const { result } = renderHook(() => useKeyboardHeight());
    expect(result.current.keyboardHeight).toBe(0);
    expect(result.current.isKeyboardOpen).toBe(false);
  });

  it("키보드 열림, offsetTop=0: 단순 차이", () => {
    setupViewport(800, { height: 500, offsetTop: 0 });
    const { result } = renderHook(() => useKeyboardHeight());
    expect(result.current.keyboardHeight).toBe(300);
    expect(result.current.isKeyboardOpen).toBe(true);
  });

  it("iOS auto-scroll (offsetTop>0): offsetTop을 가산해 가시영역 하단을 정확히 잡는다", () => {
    setupViewport(800, { height: 500, offsetTop: 50 });
    const { result } = renderHook(() => useKeyboardHeight());
    // 정답: 800 - (50 + 500) = 250. 버그 코드는 350을 반환했음.
    expect(result.current.keyboardHeight).toBe(250);
  });

  it("음수 방지: vv.height + offsetTop > innerHeight → 0", () => {
    setupViewport(800, { height: 850, offsetTop: 0 });
    const { result } = renderHook(() => useKeyboardHeight());
    expect(result.current.keyboardHeight).toBe(0);
  });
});
