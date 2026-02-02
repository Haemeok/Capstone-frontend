import { storage } from "@/shared/lib/storage";

import { JOB_POLLING_CONFIG } from "../../lib/constants";
import {
  addPersistedJob,
  clearAllPersistedJobs,
  generateIdempotencyKey,
  loadPersistedJobs,
  persistJobs,
  removePersistedJob,
  updatePersistedJob,
} from "../persistence";
import { PersistedJob, YoutubeMeta } from "../types";

const mockMeta: YoutubeMeta = {
  url: "https://youtube.com/watch?v=test123",
  title: "Test Recipe Video",
  channelName: "Test Channel",
  thumbnailUrl: "https://img.youtube.com/vi/test123/maxresdefault.jpg",
  videoId: "test123",
};

const createMockPersistedJob = (
  overrides: Partial<PersistedJob> = {}
): PersistedJob => ({
  idempotencyKey: generateIdempotencyKey(),
  url: mockMeta.url,
  meta: mockMeta,
  jobId: null,
  startTime: Date.now(),
  lastPollTime: Date.now(),
  retryCount: 0,
  ...overrides,
});

describe("persistence", () => {
  beforeEach(() => {
    clearAllPersistedJobs();
  });

  describe("generateIdempotencyKey", () => {
    it("유효한 UUID v4 형식을 반환해야 함", () => {
      const key = generateIdempotencyKey();
      expect(key).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("매번 다른 키를 생성해야 함", () => {
      const keys = Array.from({ length: 100 }, generateIdempotencyKey);
      expect(new Set(keys).size).toBe(100);
    });
  });

  describe("loadPersistedJobs", () => {
    it("빈 localStorage에서 빈 배열을 반환해야 함", () => {
      expect(loadPersistedJobs()).toEqual([]);
    });

    it("유효한 job들을 로드해야 함", () => {
      const job = createMockPersistedJob();
      persistJobs([job]);

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].idempotencyKey).toBe(job.idempotencyKey);
    });

    it("TTL 초과한 job은 필터링해야 함", () => {
      const oldJob = createMockPersistedJob({
        startTime: Date.now() - JOB_POLLING_CONFIG.JOB_TTL_MS - 1000,
      });
      const newJob = createMockPersistedJob();

      persistJobs([oldJob, newJob]);

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].idempotencyKey).toBe(newJob.idempotencyKey);
    });

    it("잘못된 JSON은 빈 배열 반환해야 함", () => {
      storage.setItem(JOB_POLLING_CONFIG.STORAGE_KEY, "invalid json{");
      expect(loadPersistedJobs()).toEqual([]);
    });
  });

  describe("persistJobs", () => {
    it("job 배열을 저장해야 함", () => {
      const job = createMockPersistedJob();
      persistJobs([job]);

      const raw = storage.getItem(JOB_POLLING_CONFIG.STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toHaveLength(1);
    });

    it("빈 배열도 저장해야 함", () => {
      persistJobs([]);

      const raw = storage.getItem(JOB_POLLING_CONFIG.STORAGE_KEY);
      expect(JSON.parse(raw!)).toEqual([]);
    });
  });

  describe("addPersistedJob", () => {
    it("새 job을 추가해야 함", () => {
      const job = createMockPersistedJob();
      addPersistedJob(job);

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].idempotencyKey).toBe(job.idempotencyKey);
    });

    it("동일한 idempotencyKey의 job은 업데이트해야 함", () => {
      const job = createMockPersistedJob();
      addPersistedJob(job);

      const updatedJob = { ...job, jobId: "new-job-id" };
      addPersistedJob(updatedJob);

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].jobId).toBe("new-job-id");
    });
  });

  describe("updatePersistedJob", () => {
    it("job을 부분 업데이트해야 함", () => {
      const job = createMockPersistedJob();
      addPersistedJob(job);

      updatePersistedJob(job.idempotencyKey, { jobId: "updated-job-id" });

      const loaded = loadPersistedJobs();
      expect(loaded[0].jobId).toBe("updated-job-id");
      expect(loaded[0].url).toBe(job.url);
    });

    it("존재하지 않는 job은 무시해야 함", () => {
      updatePersistedJob("nonexistent-key", { jobId: "some-id" });

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(0);
    });
  });

  describe("removePersistedJob", () => {
    it("job을 제거해야 함", () => {
      const job1 = createMockPersistedJob();
      const job2 = createMockPersistedJob();
      persistJobs([job1, job2]);

      removePersistedJob(job1.idempotencyKey);

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].idempotencyKey).toBe(job2.idempotencyKey);
    });

    it("존재하지 않는 job 제거는 에러 없이 처리해야 함", () => {
      const job = createMockPersistedJob();
      persistJobs([job]);

      expect(() => removePersistedJob("nonexistent-key")).not.toThrow();

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(1);
    });
  });

  describe("clearAllPersistedJobs", () => {
    it("모든 job을 제거해야 함", () => {
      const job1 = createMockPersistedJob();
      const job2 = createMockPersistedJob();
      persistJobs([job1, job2]);

      clearAllPersistedJobs();

      const loaded = loadPersistedJobs();
      expect(loaded).toHaveLength(0);
    });
  });
});
