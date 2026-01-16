import { renderHook, act } from "@testing-library/react";
import { useImageWithFallback } from "../useImageWithFallback";
import { NO_IMAGE_URL } from "@/shared/config/constants/user";

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
          inView: false, // viewport 밖이지만
        })
      );

      // priority가 우선하여 즉시 src 설정
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

      // 초기: viewport 밖이므로 src 없음
      expect(result.current.src).toBeUndefined();
      expect(result.current.status).toBe("idle");

      // viewport 진입
      rerender({ inView: true });

      // effect 재실행되어 src 설정
      expect(result.current.src).toBe("test.jpg");
      expect(result.current.status).toBe("loading");
    });
  });

  describe("Retry logic", () => {
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

      // 에러 발생
      act(() => {
        result.current.onError();
      });

      // 2초 대기 (S3 업로드 시간)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // retryCount 증가 확인
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

      // retryCount가 return object에 포함되어야 함
      expect(result.current).toHaveProperty("retryCount");
      expect(typeof result.current.retryCount).toBe("number");
    });

    it("fallback array가 있으면 순차 진행", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: ["test1.jpg", "test2.jpg", "test3.jpg"],
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      // 첫 번째 이미지
      expect(result.current.src).toBe("test1.jpg");

      // 에러 → 두 번째 이미지
      act(() => {
        result.current.onError();
      });
      expect(result.current.src).toBe("test2.jpg");

      // 에러 → 세 번째 이미지
      act(() => {
        result.current.onError();
      });
      expect(result.current.src).toBe("test3.jpg");

      // 마지막 이미지도 실패 → retry 로직으로 전환
      act(() => {
        result.current.onError();
      });
      expect(result.current.status).toBe("loading");

      // 2초 후 retryCount 증가
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.retryCount).toBe(1);
    });

    it("retry 3번 초과 시 error 상태", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: "test.jpg",
          priority: true,
          lazy: false,
          inView: true,
        })
      );

      // 3번 retry
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.onError();
        });
        act(() => {
          jest.advanceTimersByTime(2000);
        });
      }

      // 4번째는 error 상태
      act(() => {
        result.current.onError();
      });
      expect(result.current.status).toBe("error");
    });
  });

  describe("Edge cases", () => {
    it("NO_IMAGE_URL일 때 즉시 loaded 상태", () => {
      const { result } = renderHook(() =>
        useImageWithFallback({
          src: NO_IMAGE_URL,
          priority: false,
          lazy: true,
          inView: false,
        })
      );

      expect(result.current.status).toBe("loaded");
    });

    it("src 변경 시 retryCount와 fallbackIndex 초기화", () => {
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

      // 에러 발생으로 retryCount 증가
      act(() => {
        result.current.onError();
      });
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.retryCount).toBe(1);

      // src 변경
      rerender({ src: "test2.jpg" });

      // retryCount 초기화 확인
      expect(result.current.retryCount).toBe(0);
    });
  });
});
