import { act, renderHook } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { useYoutubeImportStore } from "../store";
import { triggerYoutubeImport } from "../api";
import { YoutubeMeta } from "../types";

jest.mock("../api", () => ({
  triggerYoutubeImport: jest.fn(),
}));

const mockedTriggerYoutubeImport = triggerYoutubeImport as jest.MockedFunction<
  typeof triggerYoutubeImport
>;

describe("useYoutubeImportStore", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
    jest.useFakeTimers();
    useYoutubeImportStore.setState({ imports: {} });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  const mockMeta: YoutubeMeta = {
    url: "https://youtube.com/watch?v=test123",
    title: "Test Recipe Video",
    channelName: "Test Channel",
    thumbnailUrl: "https://img.youtube.com/vi/test123/maxresdefault.jpg",
    videoId: "test123",
  };

  describe("startImport", () => {
    it("성공 시 myInfo 쿼리를 무효화해야 함", async () => {
      mockedTriggerYoutubeImport.mockResolvedValueOnce({ recipeId: "recipe-1" });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useYoutubeImportStore());

      await act(async () => {
        await result.current.startImport(
          mockMeta.url,
          mockMeta,
          queryClient
        );
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["myInfo"],
      });
    });

    it("성공 시 recipes 쿼리들도 무효화해야 함", async () => {
      mockedTriggerYoutubeImport.mockResolvedValueOnce({ recipeId: "recipe-1" });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useYoutubeImportStore());

      await act(async () => {
        await result.current.startImport(
          mockMeta.url,
          mockMeta,
          queryClient
        );
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["recipes"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["recipes", "favorite"],
      });
    });

    it("성공 시 onSuccess 콜백을 recipeId와 함께 호출해야 함", async () => {
      const recipeId = "recipe-123";
      mockedTriggerYoutubeImport.mockResolvedValueOnce({ recipeId });
      const onSuccess = jest.fn();

      const { result } = renderHook(() => useYoutubeImportStore());

      await act(async () => {
        await result.current.startImport(
          mockMeta.url,
          mockMeta,
          queryClient,
          onSuccess
        );
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(onSuccess).toHaveBeenCalledWith(recipeId);
    });

    it("실패 시 status를 error로 업데이트해야 함", async () => {
      mockedTriggerYoutubeImport.mockResolvedValueOnce({
        code: 500,
        message: "Server error",
      });

      const { result } = renderHook(() => useYoutubeImportStore());

      await act(async () => {
        await result.current.startImport(
          mockMeta.url,
          mockMeta,
          queryClient
        );
      });

      expect(result.current.imports[mockMeta.url].status).toBe("error");
    });

    it("실패 시에도 myInfo는 무효화하지만 recipes는 무효화하지 않아야 함", async () => {
      mockedTriggerYoutubeImport.mockResolvedValueOnce({
        code: 500,
        message: "Server error",
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useYoutubeImportStore());

      await act(async () => {
        await result.current.startImport(
          mockMeta.url,
          mockMeta,
          queryClient
        );
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // myInfo는 시작 시 1500ms 후 무조건 무효화됨
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["myInfo"],
      });
      // 하지만 실패 시 recipes 관련 쿼리는 무효화되지 않아야 함
      expect(invalidateQueriesSpy).not.toHaveBeenCalledWith({
        queryKey: ["recipes"],
      });
      expect(invalidateQueriesSpy).not.toHaveBeenCalledWith({
        queryKey: ["recipes", "favorite"],
      });
    });

    it("동일 URL로 중복 import를 시작하지 않아야 함", async () => {
      mockedTriggerYoutubeImport.mockResolvedValueOnce({ recipeId: "recipe-1" });

      const { result } = renderHook(() => useYoutubeImportStore());

      await act(async () => {
        result.current.startImport(mockMeta.url, mockMeta, queryClient);
      });

      await act(async () => {
        result.current.startImport(mockMeta.url, mockMeta, queryClient);
      });

      expect(mockedTriggerYoutubeImport).toHaveBeenCalledTimes(1);
    });

    it("import 시작 시 pending 상태로 추가되어야 함", async () => {
      mockedTriggerYoutubeImport.mockResolvedValueOnce({ recipeId: "recipe-1" });

      const { result } = renderHook(() => useYoutubeImportStore());

      await act(async () => {
        result.current.startImport(mockMeta.url, mockMeta, queryClient);
      });

      expect(result.current.imports[mockMeta.url]).toBeDefined();
      expect(result.current.imports[mockMeta.url].status).toBe("success");
    });
  });

  describe("addImport", () => {
    it("import를 pending 상태로 추가해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStore());

      act(() => {
        result.current.addImport(mockMeta.url, mockMeta);
      });

      expect(result.current.imports[mockMeta.url]).toBeDefined();
      expect(result.current.imports[mockMeta.url].status).toBe("pending");
      expect(result.current.imports[mockMeta.url].meta).toEqual(mockMeta);
    });
  });

  describe("updateStatus", () => {
    it("import status를 업데이트해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStore());

      act(() => {
        result.current.addImport(mockMeta.url, mockMeta);
      });

      act(() => {
        result.current.updateStatus(mockMeta.url, "success");
      });

      expect(result.current.imports[mockMeta.url].status).toBe("success");
    });

    it("에러와 함께 status를 업데이트해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStore());
      const errorInfo = { message: "Import failed", code: 500 };

      act(() => {
        result.current.addImport(mockMeta.url, mockMeta);
      });

      act(() => {
        result.current.updateStatus(mockMeta.url, "error", errorInfo);
      });

      expect(result.current.imports[mockMeta.url].status).toBe("error");
      expect(result.current.imports[mockMeta.url].error).toEqual(errorInfo);
    });
  });

  describe("removeImport", () => {
    it("import를 state에서 제거해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStore());

      act(() => {
        result.current.addImport(mockMeta.url, mockMeta);
      });

      expect(result.current.imports[mockMeta.url]).toBeDefined();

      act(() => {
        result.current.removeImport(mockMeta.url);
      });

      expect(result.current.imports[mockMeta.url]).toBeUndefined();
    });
  });
});
