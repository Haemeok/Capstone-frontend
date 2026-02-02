import { act, renderHook, waitFor } from "@testing-library/react";

import { clearAllPersistedJobs } from "../persistence";
import { useYoutubeImportStoreV2 } from "../store";
import { YoutubeMeta } from "../types";
import * as api from "../api";

// Mock dependencies
jest.mock("../api");
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));
jest.mock("@/shared/hooks/useDocumentVisibility", () => ({
  useDocumentVisibility: () => true,
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));
jest.mock("@/widgets/Toast", () => ({
  useToastStore: () => jest.fn(),
}));

const mockMeta: YoutubeMeta = {
  url: "https://youtube.com/watch?v=test123",
  title: "Test Recipe Video",
  channelName: "Test Channel",
  thumbnailUrl: "https://img.youtube.com/vi/test123/maxresdefault.jpg",
  videoId: "test123",
};

// Import after mocks
import { useJobPolling } from "../useJobPolling";

describe("useJobPolling - 중복 처리 방지", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    clearAllPersistedJobs();
    act(() => {
      useYoutubeImportStoreV2.setState({ jobs: {} });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("handleJobComplete 중복 호출 방지", () => {
    it("이미 completed 상태인 job은 다시 처리하지 않아야 함", async () => {
      const mockGetStatus = jest
        .spyOn(api, "getYoutubeJobStatus")
        .mockResolvedValue({
          jobId: "job-123",
          status: "COMPLETED",
          resultRecipeId: "recipe-456",
        });

      // Job 생성 및 polling 상태로 설정
      let key: string;
      act(() => {
        key = useYoutubeImportStoreV2.getState().createJob(mockMeta.url, mockMeta);
        useYoutubeImportStoreV2.getState().setJobId(key, "job-123");
      });

      // 첫 번째 폴링 - complete 처리됨
      renderHook(() => useJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      // Job이 completed 상태인지 확인
      expect(useYoutubeImportStoreV2.getState().jobs[key!]?.state).toBe("completed");

      // API는 1번만 호출되어야 함 (두 번째 폴링 시 이미 completed라 스킵)
      expect(mockGetStatus).toHaveBeenCalledTimes(1);
    });

    it("동시에 여러 번 complete 호출되어도 한 번만 처리해야 함", async () => {
      const mockGetStatus = jest
        .spyOn(api, "getYoutubeJobStatus")
        .mockResolvedValue({
          jobId: "job-123",
          status: "COMPLETED",
          resultRecipeId: "recipe-456",
        });

      let key: string;
      act(() => {
        key = useYoutubeImportStoreV2.getState().createJob(mockMeta.url, mockMeta);
        useYoutubeImportStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useJobPolling());

      // 첫 번째 폴링
      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      const jobAfterFirst = useYoutubeImportStoreV2.getState().jobs[key!];
      expect(jobAfterFirst?.state).toBe("completed");
      expect(jobAfterFirst?.resultRecipeId).toBe("recipe-456");

      // 두 번째 폴링 시도 (7초 후) - 이미 completed라 getPendingJobs에서 제외됨
      await act(async () => {
        jest.advanceTimersByTime(7000);
        await Promise.resolve();
      });

      // API는 여전히 1번만 호출되어야 함
      expect(mockGetStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleJobFail 중복 호출 방지", () => {
    it("이미 failed 상태인 job은 다시 처리하지 않아야 함", async () => {
      jest.spyOn(api, "getYoutubeJobStatus").mockResolvedValue({
        jobId: "job-123",
        status: "FAILED",
        errorMessage: "추출 실패",
      });

      let key: string;
      act(() => {
        key = useYoutubeImportStoreV2.getState().createJob(mockMeta.url, mockMeta);
        useYoutubeImportStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      // Job이 failed 상태인지 확인
      const job = useYoutubeImportStoreV2.getState().jobs[key!];
      expect(job?.state).toBe("failed");
      expect(job?.errorMessage).toBe("추출 실패");
    });

    it("이미 completed 상태인 job에 fail 호출해도 무시해야 함", async () => {
      // 먼저 complete 응답 후 fail 응답 시뮬레이션
      const mockGetStatus = jest
        .spyOn(api, "getYoutubeJobStatus")
        .mockResolvedValueOnce({
          jobId: "job-123",
          status: "COMPLETED",
          resultRecipeId: "recipe-456",
        });

      let key: string;
      act(() => {
        key = useYoutubeImportStoreV2.getState().createJob(mockMeta.url, mockMeta);
        useYoutubeImportStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      // Job은 completed 상태 유지
      const job = useYoutubeImportStoreV2.getState().jobs[key!];
      expect(job?.state).toBe("completed");
      expect(job?.errorMessage).toBeUndefined();
    });
  });

  describe("getPendingJobs 필터링", () => {
    it("completed 상태인 job은 pending jobs에 포함되지 않아야 함", () => {
      let key: string;
      act(() => {
        key = useYoutubeImportStoreV2.getState().createJob(mockMeta.url, mockMeta);
        useYoutubeImportStoreV2.getState().setJobId(key, "job-123");
        useYoutubeImportStoreV2.getState().completeJob(key, "recipe-456");
      });

      const pendingJobs = useYoutubeImportStoreV2.getState().getPendingJobs();
      expect(pendingJobs).toHaveLength(0);
    });

    it("failed 상태인 job은 pending jobs에 포함되지 않아야 함", () => {
      let key: string;
      act(() => {
        key = useYoutubeImportStoreV2.getState().createJob(mockMeta.url, mockMeta);
        useYoutubeImportStoreV2.getState().failJob(key, "에러");
      });

      const pendingJobs = useYoutubeImportStoreV2.getState().getPendingJobs();
      expect(pendingJobs).toHaveLength(0);
    });

    it("polling 상태인 job만 pending jobs에 포함되어야 함", () => {
      act(() => {
        const key1 = useYoutubeImportStoreV2.getState().createJob("url1", mockMeta);
        useYoutubeImportStoreV2.getState().setJobId(key1, "job-1"); // polling

        useYoutubeImportStoreV2.getState().createJob("url2", mockMeta); // creating

        const key3 = useYoutubeImportStoreV2.getState().createJob("url3", mockMeta);
        useYoutubeImportStoreV2.getState().setJobId(key3, "job-3");
        useYoutubeImportStoreV2.getState().completeJob(key3, "recipe-3"); // completed

        const key4 = useYoutubeImportStoreV2.getState().createJob("url4", mockMeta);
        useYoutubeImportStoreV2.getState().failJob(key4, "에러"); // failed
      });

      const pendingJobs = useYoutubeImportStoreV2.getState().getPendingJobs();
      // polling (1개) + creating (1개) = 2개
      expect(pendingJobs).toHaveLength(2);
      expect(pendingJobs.map((j) => j.state).sort()).toEqual(["creating", "polling"]);
    });
  });
});
