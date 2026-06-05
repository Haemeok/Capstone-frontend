import { act, renderHook } from "@testing-library/react";

import { useCarouselAutoplay } from "../useCarouselAutoplay";

describe("useCarouselAutoplay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // T-04: 5초 간격으로 onNext 자동 호출
  it("interval마다 onNext를 호출한다", () => {
    const onNext = jest.fn();

    renderHook(() =>
      useCarouselAutoplay({ onNext, interval: 5000, isEnabled: true })
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(onNext).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(onNext).toHaveBeenCalledTimes(2);
  });

  // T-05: pause 중 미호출, reset 후 다시 호출
  it("pause하면 멈추고 reset하면 타이머를 다시 시작한다", () => {
    const onNext = jest.fn();

    const { result } = renderHook(() =>
      useCarouselAutoplay({ onNext, interval: 5000, isEnabled: true })
    );

    act(() => {
      result.current.pause();
    });
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(onNext).not.toHaveBeenCalled();

    act(() => {
      result.current.resume();
      result.current.reset();
    });
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
