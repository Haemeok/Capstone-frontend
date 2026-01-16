import { renderHook, waitFor, act } from "@testing-library/react";

import api from "@/shared/api/client";

import { invalidateRecipeCache } from "../actions";
import { useRecipeImageCheck, IMAGE_CHECK_CONFIG } from "./useRecipeImageCheck";

// Mock dependencies
jest.mock("@/shared/api/client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("../actions", () => ({
  invalidateRecipeCache: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedInvalidateRecipeCache =
  invalidateRecipeCache as jest.MockedFunction<typeof invalidateRecipeCache>;

describe("useRecipeImageCheck", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("이미지가 이미 있으면 API를 호출하지 않음", async () => {
    const { result } = renderHook(() =>
      useRecipeImageCheck({
        recipeId: "123",
        initialImageUrl: "https://example.com/image.jpg",
      })
    );

    // 타이머 진행
    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS);
    });

    expect(mockedApi.get).not.toHaveBeenCalled();
    expect(result.current.imageUrl).toBe("https://example.com/image.jpg");
    expect(result.current.retryCount).toBe(0);
  });

  it("이미지가 없으면 API를 호출하고 이미지 발견 시 캐시 무효화", async () => {
    mockedApi.get.mockResolvedValueOnce({
      imageUrl: "https://example.com/new-image.jpg",
    });
    mockedInvalidateRecipeCache.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useRecipeImageCheck({
        recipeId: "123",
        initialImageUrl: null,
      })
    );

    expect(result.current.imageUrl).toBeNull();

    // 타이머 진행
    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS);
    });

    await waitFor(() => {
      expect(result.current.imageUrl).toBe(
        "https://example.com/new-image.jpg"
      );
    });

    expect(mockedApi.get).toHaveBeenCalledWith("/v2/recipes/123");
    expect(mockedInvalidateRecipeCache).toHaveBeenCalledWith("123");
    expect(result.current.retryCount).toBe(0);
  });

  it("이미지가 계속 없으면 최대 2번만 재시도", async () => {
    mockedApi.get.mockResolvedValue({ imageUrl: null });

    const { result } = renderHook(() =>
      useRecipeImageCheck({
        recipeId: "123",
        initialImageUrl: null,
      })
    );

    // 첫 번째 시도
    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS);
    });

    await waitFor(() => {
      expect(result.current.retryCount).toBe(1);
    });

    // 두 번째 시도
    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS);
    });

    await waitFor(() => {
      expect(result.current.retryCount).toBe(2);
    });

    // 세 번째 시도는 하지 않음 (MAX_RETRY_COUNT = 2)
    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS * 2);
    });

    // API 호출은 정확히 2번만
    expect(mockedApi.get).toHaveBeenCalledTimes(2);
    expect(result.current.retryCount).toBe(2);
    expect(result.current.imageUrl).toBeNull();
  });

  it("API 에러 발생 시 재시도 카운트 증가", async () => {
    mockedApi.get.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() =>
      useRecipeImageCheck({
        recipeId: "123",
        initialImageUrl: null,
      })
    );

    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS);
    });

    await waitFor(() => {
      expect(result.current.retryCount).toBe(1);
    });

    expect(mockedInvalidateRecipeCache).not.toHaveBeenCalled();
  });

  it("두 번째 시도에서 이미지 발견 시 성공 처리", async () => {
    mockedApi.get
      .mockResolvedValueOnce({ imageUrl: null }) // 첫 번째: 없음
      .mockResolvedValueOnce({ imageUrl: "https://example.com/found.jpg" }); // 두 번째: 있음
    mockedInvalidateRecipeCache.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useRecipeImageCheck({
        recipeId: "123",
        initialImageUrl: null,
      })
    );

    // 첫 번째 시도
    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS);
    });

    await waitFor(() => {
      expect(result.current.retryCount).toBe(1);
    });

    // 두 번째 시도
    await act(async () => {
      jest.advanceTimersByTime(IMAGE_CHECK_CONFIG.DELAY_MS);
    });

    await waitFor(() => {
      expect(result.current.imageUrl).toBe("https://example.com/found.jpg");
    });

    expect(mockedApi.get).toHaveBeenCalledTimes(2);
    expect(mockedInvalidateRecipeCache).toHaveBeenCalledWith("123");
  });
});
