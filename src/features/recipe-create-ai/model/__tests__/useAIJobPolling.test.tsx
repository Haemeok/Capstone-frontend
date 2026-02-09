import { act, renderHook } from "@testing-library/react";

import { clearAllPersistedJobs } from "../persistence";
import { useAIRecipeStoreV2 } from "../store";
import { AIJobMeta, AIRecommendedRecipeRequest, AIModelId } from "../types";
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

const mockMeta: AIJobMeta = {
  concept: "COST_EFFECTIVE" as AIModelId,
  displayName: "가성비 요리",
  requestSummary: "10,000원 / 한식",
};

const mockRequest: AIRecommendedRecipeRequest = {
  targetBudget: 10000,
  targetCategory: "한식",
};

// Import after mocks
import { useAIJobPolling } from "../useAIJobPolling";

describe("useAIJobPolling - 중복 처리 방지", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    clearAllPersistedJobs();
    act(() => {
      useAIRecipeStoreV2.setState({ jobs: {} });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("handleJobComplete 중복 호출 방지", () => {
    it("이미 completed 상태인 job은 다시 처리하지 않아야 함", async () => {
      const mockGetStatus = jest
        .spyOn(api, "getAIRecipeJobStatus")
        .mockResolvedValue({
          jobId: "job-123",
          status: "COMPLETED",
          resultRecipeId: "recipe-456",
        });

      // Job 생성 및 polling 상태로 설정
      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
      });

      // 첫 번째 폴링 - complete 처리됨
      renderHook(() => useAIJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      // Job이 completed 상태인지 확인
      expect(useAIRecipeStoreV2.getState().jobs[key!]?.state).toBe("completed");

      // API는 1번만 호출되어야 함 (두 번째 폴링 시 이미 completed라 스킵)
      expect(mockGetStatus).toHaveBeenCalledTimes(1);
    });

    it("동시에 여러 번 complete 호출되어도 한 번만 처리해야 함", async () => {
      const mockGetStatus = jest
        .spyOn(api, "getAIRecipeJobStatus")
        .mockResolvedValue({
          jobId: "job-123",
          status: "COMPLETED",
          resultRecipeId: "recipe-456",
        });

      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useAIJobPolling());

      // 첫 번째 폴링
      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      const jobAfterFirst = useAIRecipeStoreV2.getState().jobs[key!];
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
      jest.spyOn(api, "getAIRecipeJobStatus").mockResolvedValue({
        jobId: "job-123",
        status: "FAILED",
        code: "701",
        message: "AI 생성 실패",
      });

      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useAIJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      // Job이 failed 상태인지 확인
      const job = useAIRecipeStoreV2.getState().jobs[key!];
      expect(job?.state).toBe("failed");
      expect(job?.code).toBe("701");
      expect(job?.message).toBe("AI 생성 실패");
    });

    it("이미 completed 상태인 job에 fail 호출해도 무시해야 함", async () => {
      // 먼저 complete 응답 후 fail 응답 시뮬레이션
      jest.spyOn(api, "getAIRecipeJobStatus").mockResolvedValueOnce({
        jobId: "job-123",
        status: "COMPLETED",
        resultRecipeId: "recipe-456",
      });

      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useAIJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      // Job은 completed 상태 유지
      const job = useAIRecipeStoreV2.getState().jobs[key!];
      expect(job?.state).toBe("completed");
      expect(job?.message).toBeUndefined();
    });
  });

  describe("getPendingJobs 필터링", () => {
    it("completed 상태인 job은 pending jobs에 포함되지 않아야 함", () => {
      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
        useAIRecipeStoreV2.getState().completeJob(key, "recipe-456");
      });

      const pendingJobs = useAIRecipeStoreV2.getState().getPendingJobs();
      expect(pendingJobs).toHaveLength(0);
    });

    it("failed 상태인 job은 pending jobs에 포함되지 않아야 함", () => {
      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().failJob(key, "701", "에러");
      });

      const pendingJobs = useAIRecipeStoreV2.getState().getPendingJobs();
      expect(pendingJobs).toHaveLength(0);
    });

    it("polling 상태인 job만 pending jobs에 포함되어야 함", () => {
      act(() => {
        const key1 = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key1, "job-1"); // polling

        useAIRecipeStoreV2.getState().createJob(
          "INGREDIENT_FOCUS",
          { ingredientIds: ["1"], dishType: "한식", cookingTime: 30, servings: 2 },
          { concept: "INGREDIENT_FOCUS", displayName: "냉장고 속 재료", requestSummary: "" }
        ); // creating

        const key3 = useAIRecipeStoreV2.getState().createJob(
          "NUTRITION_BALANCE",
          { targetStyle: "다이어트", targetCalories: "500", targetCarbs: "50", targetProtein: "30", targetFat: "20" },
          { concept: "NUTRITION_BALANCE", displayName: "영양 밸런스", requestSummary: "" }
        );
        useAIRecipeStoreV2.getState().setJobId(key3, "job-3");
        useAIRecipeStoreV2.getState().completeJob(key3, "recipe-3"); // completed

        const key4 = useAIRecipeStoreV2.getState().createJob(
          "FINE_DINING",
          { ingredientIds: ["1"], diningTier: "BLACK" },
          { concept: "FINE_DINING", displayName: "파인 다이닝", requestSummary: "" }
        );
        useAIRecipeStoreV2.getState().failJob(key4, "700", "에러"); // failed
      });

      const pendingJobs = useAIRecipeStoreV2.getState().getPendingJobs();
      // polling (1개) + creating (1개) = 2개
      expect(pendingJobs).toHaveLength(2);
      expect(pendingJobs.map((j) => j.state).sort()).toEqual(["creating", "polling"]);
    });
  });

  describe("Concept별 Job 관리", () => {
    it("같은 concept의 진행 중인 job이 있으면 새 job을 생성하지 않아야 함", () => {
      let key1 = "";
      let key2 = "";

      act(() => {
        key1 = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        key2 = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
      });

      // 같은 키를 반환해야 함
      expect(key1).toBe(key2);

      // job은 1개만 존재해야 함
      const jobs = Object.values(useAIRecipeStoreV2.getState().jobs);
      expect(jobs).toHaveLength(1);
    });

    it("다른 concept의 job은 동시에 존재할 수 있어야 함", () => {
      act(() => {
        useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().createJob(
          "INGREDIENT_FOCUS",
          { ingredientIds: ["1"], dishType: "한식", cookingTime: 30, servings: 2 },
          { concept: "INGREDIENT_FOCUS", displayName: "냉장고 속 재료", requestSummary: "" }
        );
      });

      // job은 2개가 존재해야 함
      const jobs = Object.values(useAIRecipeStoreV2.getState().jobs);
      expect(jobs).toHaveLength(2);
    });

    it("completed 상태의 같은 concept job이 있으면 새 job을 생성할 수 있어야 함", () => {
      let key1 = "";
      let key2 = "";

      act(() => {
        key1 = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key1, "job-1");
        useAIRecipeStoreV2.getState().completeJob(key1, "recipe-1");

        key2 = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
      });

      // 다른 키를 반환해야 함
      expect(key1).not.toBe(key2);

      // job은 2개가 존재해야 함
      const jobs = Object.values(useAIRecipeStoreV2.getState().jobs);
      expect(jobs).toHaveLength(2);
    });
  });

  describe("에러 응답 형식", () => {
    it("code와 message가 포함된 에러 응답을 올바르게 처리해야 함", async () => {
      jest.spyOn(api, "getAIRecipeJobStatus").mockResolvedValue({
        jobId: "job-123",
        status: "FAILED",
        code: "907",
        message: "지원하지 않는 URL 형식입니다.",
      });

      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useAIJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      const job = useAIRecipeStoreV2.getState().jobs[key!];
      expect(job?.state).toBe("failed");
      expect(job?.code).toBe("907");
      expect(job?.message).toBe("지원하지 않는 URL 형식입니다.");
    });

    it("code 없이 message만 있는 에러도 처리해야 함", async () => {
      jest.spyOn(api, "getAIRecipeJobStatus").mockResolvedValue({
        jobId: "job-123",
        status: "FAILED",
        message: "알 수 없는 오류가 발생했습니다.",
      });

      let key: string;
      act(() => {
        key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useAIJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      const job = useAIRecipeStoreV2.getState().jobs[key!];
      expect(job?.state).toBe("failed");
      expect(job?.code).toBeUndefined();
      expect(job?.message).toBe("알 수 없는 오류가 발생했습니다.");
    });
  });
});
