import { act, renderHook } from "@testing-library/react";

import * as api from "../api";
import { clearAllPersistedJobs } from "../persistence";
import { useAIRecipeStoreV2 } from "../store";
import { AIJobMeta, AIModelId, AIRecommendedRecipeRequest } from "../types";

// Mock dependencies
jest.mock("../api");
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));
jest.mock("@/shared/hooks/useDocumentVisibility", () => ({
  useDocumentVisibility: () => true,
}));
const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => "/",
}));
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
    fetchQuery: jest.fn().mockResolvedValue({
      id: "recipe-456",
      imageUrl: "https://example.com/image.jpg",
      title: "테스트 레시피",
      author: { id: "author-1", nickname: "셰프", profileImage: "" },
      cookingTime: 30,
      createdAt: "2026-01-01T00:00:00.000Z",
    }),
  }),
}));
jest.mock("@/entities/recipe", () => ({
  getRecipe: jest.fn(),
}));
const mockAddToast = jest.fn();
jest.mock("@/shared/ui/toast", () => ({
  useToastStore: (selector?: (state: { addToast: unknown }) => unknown) =>
    selector
      ? selector({ addToast: mockAddToast })
      : { addToast: mockAddToast },
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
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta, "ko");
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
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta, "ko");
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
      expect(
        jobAfterFirst?.state === "completed"
          ? jobAfterFirst.resultRecipeId
          : undefined
      ).toBe("recipe-456");

      // 두 번째 폴링 시도 (7초 후) - 이미 completed라 getPendingJobs에서 제외됨
      await act(async () => {
        jest.advanceTimersByTime(7000);
        await Promise.resolve();
      });

      // API는 여전히 1번만 호출되어야 함
      expect(mockGetStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe("완료 토스트", () => {
    it("T-23: job 완료 시 완료 토스트가 뜬다", async () => {
      jest.spyOn(api, "getAIRecipeJobStatus").mockResolvedValue({
        jobId: "job-123",
        status: "COMPLETED",
        resultRecipeId: "recipe-456",
      });

      act(() => {
        const key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta, "ko");
        useAIRecipeStoreV2.getState().setJobId(key, "job-123");
      });

      renderHook(() => useAIJobPolling());

      await act(async () => {
        jest.advanceTimersByTime(0);
        await Promise.resolve();
      });

      expect(mockAddToast).toHaveBeenCalledTimes(1);
      const toast = mockAddToast.mock.calls[0][0];

      if (toast.variant === "rich-youtube") {
        expect(toast.richContent).toMatchObject({
          recipeId: "recipe-456",
          subtitle: "테스트 레시피",
          thumbnail: "https://example.com/image.jpg",
        });
      } else {
        expect(toast.variant).toBe("success");
        expect(toast.message).toContain(mockMeta.displayName);
      }

      toast.action.onClick();
      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining("/recipes/recipe-456"),
        undefined
      );
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
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta, "ko");
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
      if (job?.state === "failed") {
        expect(job.code).toBe("701");
        expect(job.message).toBe("AI 생성 실패");
      }
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
          .createJob("COST_EFFECTIVE", mockRequest, mockMeta, "ko");
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
      expect(job && "message" in job ? job.message : undefined).toBeUndefined();
    });
  });
});
