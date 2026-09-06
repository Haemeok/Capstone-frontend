import { act, fireEvent, renderHook } from "@testing-library/react";

import { registerAnalyticsClient } from "@/shared/lib/analytics/captureAnalyticsEvent";

import { useScrollDiagnostics } from "../scroll-diagnostics/useScrollDiagnostics";

describe("iOS scroll diagnostics", () => {
  const capture = jest.fn();
  let container: HTMLDivElement;

  beforeEach(() => {
    jest.useFakeTimers();
    capture.mockReset();
    registerAnalyticsClient({ capture });
    jest.spyOn(console, "log").mockImplementation(() => undefined);
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    });
    window.ReactNativeWebView = { postMessage: jest.fn() };
    container = document.createElement("div");
    container.style.overflowY = "auto";
    container.scrollTop = 120;
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    delete window.ReactNativeWebView;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it.each(["browser", "android"])(
    "%s에서는 진단을 시작하지 않습니다",
    (surface) => {
      if (surface === "browser") delete window.ReactNativeWebView;
      else Object.defineProperty(navigator, "userAgent", { value: "Android" });
      renderHook(() => useScrollDiagnostics({ current: container }, "/search"));
      fireEvent.touchStart(container);
      act(() => jest.advanceTimersByTime(15000));
      expect(capture).not.toHaveBeenCalled();
      expect(jest.getTimerCount()).toBe(0);
    }
  );

  it("터치와 위치 보정 기록을 한 번 전송하고 입력 내용과 스크롤은 건드리지 않습니다", () => {
    const input = document.createElement("input");
    input.value = "private recipe notes";
    container.append(input);
    const { result } = renderHook(() =>
      useScrollDiagnostics({ current: container }, "/search")
    );
    act(() => result.current("route_restore"));
    const touch = new TouchEvent("touchmove", {
      bubbles: true,
      cancelable: true,
    });
    fireEvent.touchStart(input);
    input.dispatchEvent(touch);
    act(() => jest.advanceTimersByTime(15000));
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(
      "ios_scroll_diagnostic",
      expect.objectContaining({
        pathname: "/search",
        reason: "timeout",
        touch_moves: 1,
      })
    );
    const report = capture.mock.calls[0][1];
    expect(report.trace).toContain("route_restore");
    expect(report.trace).toContain('"scrollTop":120');
    expect(JSON.stringify(report)).not.toContain(input.value);
    expect(touch.defaultPrevented).toBe(false);
    expect(container.scrollTop).toBe(120);
    expect(container.style.overflowY).toBe("auto");
    expect(jest.getTimerCount()).toBe(0);
  });

  it("페이지 이동으로 정리되면 이전 기록만 전송하고 이후 터치는 수집하지 않습니다", () => {
    const { unmount } = renderHook(() =>
      useScrollDiagnostics({ current: container }, "/search")
    );
    fireEvent.touchStart(container);
    unmount();
    fireEvent.touchMove(container);
    act(() => jest.advanceTimersByTime(15000));
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture.mock.calls[0][1]).toMatchObject({
      reason: "cleanup",
      touch_moves: 0,
    });
    expect(jest.getTimerCount()).toBe(0);
  });

  it("터치가 웹에 전달되지 않아도 진단 시작 여부를 확인할 기록을 전송합니다", () => {
    renderHook(() => useScrollDiagnostics({ current: container }, "/search"));
    act(() => jest.advanceTimersByTime(15000));
    expect(capture).toHaveBeenCalledWith(
      "ios_scroll_diagnostic",
      expect.objectContaining({ touch_moves: 0 })
    );
    expect(jest.getTimerCount()).toBe(0);
  });

  it("수집 서버 오류가 화면으로 전파되지 않습니다", () => {
    capture.mockImplementation(() => {
      throw new Error("unavailable");
    });
    const { unmount } = renderHook(() =>
      useScrollDiagnostics({ current: container }, "/search")
    );
    fireEvent.touchStart(container);
    expect(() => unmount()).not.toThrow();
    expect(jest.getTimerCount()).toBe(0);
  });

  it("터치 후 스크롤 회복과 다른 핸들러의 기본 동작 차단을 구분해 기록합니다", () => {
    const { unmount } = renderHook(() =>
      useScrollDiagnostics({ current: container }, "/search")
    );
    container.addEventListener("touchmove", (event) => event.preventDefault());
    fireEvent.touchStart(container);
    fireEvent.touchMove(container);
    act(() => jest.advanceTimersByTime(500));
    container.scrollTop = 240;
    fireEvent.scroll(container);
    act(() => jest.advanceTimersByTime(500));
    unmount();
    const samples: {
      container?: { scrollTop: number };
      lastMovePrevented?: boolean;
      scrollEvents?: number;
    }[] = JSON.parse(capture.mock.calls[0][1].trace);
    expect(samples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          container: expect.objectContaining({ scrollTop: 120 }),
          lastMovePrevented: true,
          scrollEvents: 0,
        }),
        expect.objectContaining({
          container: expect.objectContaining({ scrollTop: 240 }),
          scrollEvents: 1,
        }),
      ])
    );
  });

  it("백그라운드 전환 시 기록을 끝내고 중복 전송하지 않습니다", () => {
    const { unmount } = renderHook(() =>
      useScrollDiagnostics({ current: container }, "/search")
    );
    jest.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    unmount();
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture.mock.calls[0][1].reason).toBe("hidden");
    expect(jest.getTimerCount()).toBe(0);
  });

  it("스크롤 정지와 별도로 JS 타이머 지연을 기록합니다", () => {
    const clock = jest.spyOn(performance, "now").mockReturnValue(0);
    const { unmount } = renderHook(() =>
      useScrollDiagnostics({ current: container }, "/search")
    );
    clock.mockReturnValue(2500);
    act(() => jest.advanceTimersByTime(500));
    unmount();
    expect(capture.mock.calls[0][1].max_timer_delay_ms).toBe(2000);
  });
});
