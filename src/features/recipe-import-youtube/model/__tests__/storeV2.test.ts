import { act, renderHook } from "@testing-library/react";

import { clearAllPersistedJobs, loadPersistedJobs } from "../persistence";
import { useYoutubeImportStoreV2 } from "../store";
import { YoutubeMeta } from "../types";

const mockMeta: YoutubeMeta = {
  url: "https://youtube.com/watch?v=test123",
  title: "Test Recipe Video",
  channelName: "Test Channel",
  thumbnailUrl: "https://img.youtube.com/vi/test123/maxresdefault.jpg",
  videoId: "test123",
};

describe("useYoutubeImportStoreV2", () => {
  beforeEach(() => {
    clearAllPersistedJobs();
    useYoutubeImportStoreV2.setState({ jobs: {} });
  });

  describe("createJob", () => {
    it("새 job을 creating 상태로 생성해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
      });

      expect(result.current.jobs[key!]).toMatchObject({
        state: "creating",
        url: mockMeta.url,
        meta: mockMeta,
        jobId: null,
        progress: 0,
        retryCount: 0,
      });
    });

    it("localStorage에 job을 저장해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      act(() => {
        result.current.createJob(mockMeta.url, mockMeta);
      });

      const persisted = loadPersistedJobs();
      expect(persisted).toHaveLength(1);
    });

    it("동일 URL로 중복 job 생성 시 기존 key를 반환해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key1: string, key2: string;
      act(() => {
        key1 = result.current.createJob(mockMeta.url, mockMeta);
        key2 = result.current.createJob(mockMeta.url, mockMeta);
      });

      expect(key1!).toBe(key2!);
      expect(Object.keys(result.current.jobs)).toHaveLength(1);
    });
  });

  describe("setJobId", () => {
    it("jobId를 설정하고 state를 polling으로 변경해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
      });

      act(() => {
        result.current.setJobId(key!, "job-123");
      });

      expect(result.current.jobs[key!]).toMatchObject({
        jobId: "job-123",
        state: "polling",
      });
    });

    it("localStorage를 업데이트해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
        result.current.setJobId(key!, "job-123");
      });

      const persisted = loadPersistedJobs();
      expect(persisted[0].jobId).toBe("job-123");
    });
  });

  describe("updateJobProgress", () => {
    it("progress를 업데이트해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
        result.current.setJobId(key!, "job-123");
      });

      act(() => {
        result.current.updateJobProgress(key!, 50);
      });

      expect(result.current.jobs[key!].progress).toBe(50);
    });

    it("IN_PROGRESS 중 resultRecipeId가 있으면 저장해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
        result.current.setJobId(key!, "job-123");
      });

      act(() => {
        result.current.updateJobProgress(key!, 80, "recipe-456");
      });

      expect(result.current.jobs[key!].resultRecipeId).toBe("recipe-456");
    });
  });

  describe("completeJob", () => {
    it("state를 completed로, resultRecipeId를 설정해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
        result.current.setJobId(key!, "job-123");
      });

      act(() => {
        result.current.completeJob(key!, "recipe-789");
      });

      expect(result.current.jobs[key!]).toMatchObject({
        state: "completed",
        resultRecipeId: "recipe-789",
        progress: 100,
      });
    });

    it("localStorage에서 job을 제거해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
        result.current.setJobId(key!, "job-123");
      });

      act(() => {
        result.current.completeJob(key!, "recipe-789");
      });

      const persisted = loadPersistedJobs();
      expect(persisted).toHaveLength(0);
    });
  });

  describe("failJob", () => {
    it("state를 failed로, errorMessage를 설정해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
      });

      act(() => {
        result.current.failJob(key!, "추출 실패");
      });

      expect(result.current.jobs[key!]).toMatchObject({
        state: "failed",
        errorMessage: "추출 실패",
      });
    });

    it("localStorage에서 job을 제거해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
      });

      act(() => {
        result.current.failJob(key!, "에러");
      });

      const persisted = loadPersistedJobs();
      expect(persisted).toHaveLength(0);
    });
  });

  describe("removeJob", () => {
    it("job을 store에서 제거해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
      });

      expect(result.current.jobs[key!]).toBeDefined();

      act(() => {
        result.current.removeJob(key!);
      });

      expect(result.current.jobs[key!]).toBeUndefined();
    });
  });

  describe("hydrateFromStorage", () => {
    it("localStorage에서 pending job들을 복구해야 함", () => {
      const { result: result1 } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result1.current.createJob(mockMeta.url, mockMeta);
        result1.current.setJobId(key!, "job-1");
      });

      act(() => {
        useYoutubeImportStoreV2.setState({ jobs: {} });
      });

      const { result: result2 } = renderHook(() => useYoutubeImportStoreV2());

      act(() => {
        result2.current.hydrateFromStorage();
      });

      expect(Object.keys(result2.current.jobs)).toHaveLength(1);
    });

    it("복구된 job은 polling 상태로 설정해야 함 (jobId 있는 경우)", () => {
      const { result: result1 } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result1.current.createJob(mockMeta.url, mockMeta);
        result1.current.setJobId(key!, "job-1");
      });

      act(() => {
        useYoutubeImportStoreV2.setState({ jobs: {} });
      });

      const { result: result2 } = renderHook(() => useYoutubeImportStoreV2());

      act(() => {
        result2.current.hydrateFromStorage();
      });

      expect(result2.current.jobs[key!].state).toBe("polling");
    });

    it("jobId 없는 job은 creating 상태로 복구해야 함", () => {
      const { result: result1 } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result1.current.createJob(mockMeta.url, mockMeta);
      });

      act(() => {
        useYoutubeImportStoreV2.setState({ jobs: {} });
      });

      const { result: result2 } = renderHook(() => useYoutubeImportStoreV2());

      act(() => {
        result2.current.hydrateFromStorage();
      });

      expect(result2.current.jobs[key!].state).toBe("creating");
    });
  });

  describe("incrementRetryCount", () => {
    it("retryCount를 1 증가시켜야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
      });

      expect(result.current.jobs[key!].retryCount).toBe(0);

      act(() => {
        result.current.incrementRetryCount(key!);
      });

      expect(result.current.jobs[key!].retryCount).toBe(1);
    });
  });

  describe("getJobByUrl", () => {
    it("URL로 job을 찾을 수 있어야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      act(() => {
        result.current.createJob(mockMeta.url, mockMeta);
      });

      const job = result.current.getJobByUrl(mockMeta.url);
      expect(job).toBeDefined();
      expect(job?.url).toBe(mockMeta.url);
    });

    it("없는 URL은 undefined 반환", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      expect(result.current.getJobByUrl("nonexistent")).toBeUndefined();
    });
  });

  describe("getPendingJobs", () => {
    it("creating 또는 polling 상태인 job들을 반환해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      act(() => {
        const key1 = result.current.createJob("url1", mockMeta);
        result.current.setJobId(key1, "job-1");

        result.current.createJob("url2", mockMeta);

        const key3 = result.current.createJob("url3", mockMeta);
        result.current.setJobId(key3, "job-3");
        result.current.completeJob(key3, "recipe-3");
      });

      const pending = result.current.getPendingJobs();
      expect(pending).toHaveLength(2);
    });

    it("completed 상태인 job은 포함하지 않아야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
        result.current.setJobId(key!, "job-1");
        result.current.completeJob(key!, "recipe-1");
      });

      const pending = result.current.getPendingJobs();
      expect(pending).toHaveLength(0);
    });

    it("failed 상태인 job은 포함하지 않아야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      let key: string;
      act(() => {
        key = result.current.createJob(mockMeta.url, mockMeta);
        result.current.failJob(key!, "에러");
      });

      const pending = result.current.getPendingJobs();
      expect(pending).toHaveLength(0);
    });
  });

  describe("getActiveJobCount", () => {
    it("pending job 수를 반환해야 함", () => {
      const { result } = renderHook(() => useYoutubeImportStoreV2());

      act(() => {
        const key1 = result.current.createJob("url1", mockMeta);
        result.current.setJobId(key1, "job-1");

        result.current.createJob("url2", mockMeta);
      });

      expect(result.current.getActiveJobCount()).toBe(2);
    });
  });
});
