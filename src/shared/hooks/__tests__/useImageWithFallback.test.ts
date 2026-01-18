import { renderHook, act } from "@testing-library/react";
import { useImageWithFallback } from "../useImageWithFallback";

describe("useImageWithFallback", () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Priority bypass (무한 로딩 방지 핵심 테스트)", () => {
    it("priority=true일 때 inView=false여도 즉시 로드", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: true,
          inView: false,
        })
      );

      expect(result.current.src).toBe("test.jpg");
      expect(result.current.status).toBe("loading");
    });

    it("inView 변경 시 effect 재실행 (dependency 추가 검증)", () => {
      const { result, rerender } = renderHook(
        ({ inView }) =>
          useImageWithFallback({
            src: "test.jpg",
            priority: false,
            lazy: true,
            inView,
          }),
        { initialProps: { inView: false } }
      );

      expect(result.current.src).toBeUndefined();
      expect(result.current.status).toBe("idle");

      rerender({ inView: true });

      expect(result.current.src).toBe("test.jpg");
      expect(result.current.status).toBe("loading");
    });
  });

  describe("Retry logic", () => {
    it("에러 시 onRetry 콜백 호출", () => {
      const onRetry = jest.fn();
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
          onRetry,
        })
      );

      act(() => {
        result.current.onError();
      });

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("에러 시 retryCount 증가 (2초 후)", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      const initialRetryCount = result.current.retryCount;

      act(() => {
        result.current.onError();
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.retryCount).toBe(initialRetryCount + 1);
    });

    it("retryCount가 증가하면 Image 컴포넌트가 감지할 수 있도록 export", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      expect(result.current).toHaveProperty("retryCount");
      expect(typeof result.current.retryCount).toBe("number");
    });

    it("retry 2번 초과 시 error 상태", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      // 2번 retry
      for (let i = 0; i < 2; i++) {
        act(() => {
          result.current.onError();
        });
        act(() => {
          jest.advanceTimersByTime(2000);
        });
      }

      // 3번째는 error 상태
      act(() => {
        result.current.onError();
      });
      expect(result.current.status).toBe("error");
    });
  });

  describe("Lazy loading", () => {
    it("lazy=true, inView=false일 때 idle 상태", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: false,
          lazy: true,
          inView: false,
        })
      );

      expect(result.current.src).toBeUndefined();
      expect(result.current.status).toBe("idle");
    });

    it("lazy=false일 때 즉시 로드", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: false,
          lazy: false,
          inView: false,
        })
      );

      expect(result.current.src).toBe("test.jpg");
      expect(result.current.status).toBe("loading");
    });
  });

  describe("handleLoad with decode timeout", () => {
    it("decode()가 pending 상태여도 타임아웃 후 loaded 상태로 전환", async () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      const mockImageElement = {
        decode: () => new Promise(() => {}),
      } as unknown as HTMLImageElement;

      const mockEvent = {
        currentTarget: mockImageElement,
      } as React.SyntheticEvent<HTMLImageElement>;

      await act(async () => {
        result.current.onLoad(mockEvent);
        jest.advanceTimersByTime(100);
      });

      expect(result.current.status).toBe("loaded");
    });

    it("decode()가 정상 resolve되면 loaded 상태로 전환", async () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      const mockImageElement = {
        decode: () => Promise.resolve(),
      } as unknown as HTMLImageElement;

      const mockEvent = {
        currentTarget: mockImageElement,
      } as React.SyntheticEvent<HTMLImageElement>;

      await act(async () => {
        await result.current.onLoad(mockEvent);
      });

      expect(result.current.status).toBe("loaded");
    });

    it("decode()가 없는 경우에도 loaded 상태로 전환", async () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      const mockImageElement = {} as unknown as HTMLImageElement;

      const mockEvent = {
        currentTarget: mockImageElement,
      } as React.SyntheticEvent<HTMLImageElement>;

      await act(async () => {
        await result.current.onLoad(mockEvent);
      });

      expect(result.current.status).toBe("loaded");
    });
  });

  describe("imgRef with complete check", () => {
    it("이미 로드 완료된 이미지(complete=true)면 즉시 loaded 상태로 전환", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      const mockImg = {
        complete: true,
        naturalWidth: 100,
      } as HTMLImageElement;

      act(() => {
        result.current.imgRef(mockImg);
      });

      expect(result.current.status).toBe("loaded");
    });

    it("아직 로드 중인 이미지(complete=false)면 loading 상태 유지", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      const mockImg = {
        complete: false,
        naturalWidth: 0,
      } as HTMLImageElement;

      act(() => {
        result.current.imgRef(mockImg);
      });

      expect(result.current.status).toBe("loading");
    });

    it("null이 전달되면 상태 변경 없음", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      act(() => {
        result.current.imgRef(null);
      });

      expect(result.current.status).toBe("loading");
    });
  });

  describe("State reset on src change", () => {
    it("src 변경 시 retryCount 초기화", () => {
      const { result, rerender } = renderHook(
        ({ src }) =>
          useImageWithFallback({
            src,
            priority: true,
            lazy: false,
            inView: true,
          }),
        { initialProps: { src: "test1.jpg" } }
      );

      act(() => {
        result.current.onError();
      });
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.retryCount).toBe(1);

      rerender({ src: "test2.jpg" });

      expect(result.current.retryCount).toBe(0);
    });

    it("src 변경 시 status 재평가", () => {
      const { result, rerender } = renderHook(
        ({ src }) =>
          useImageWithFallback({
            src,
            priority: true,
            lazy: false,
            inView: true,
          }),
        { initialProps: { src: "test1.jpg" } }
      );

      // 에러 상태로 만듦
      for (let i = 0; i < 3; i++) {
        act(() => result.current.onError());
        act(() => jest.advanceTimersByTime(2000));
      }
      expect(result.current.status).toBe("error");

      // src 변경 시 loading으로 리셋
      rerender({ src: "test2.jpg" });
      expect(result.current.status).toBe("loading");
    });
  });
});
