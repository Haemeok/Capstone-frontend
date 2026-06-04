import { act, renderHook } from "@testing-library/react";

import * as api from "../api";
import { clearAllPersistedJobs } from "../persistence";
import { useAIRecipeStoreV2 } from "../store";
import type { CostEffectiveRequest } from "../types";

jest.mock("../api");

const mockRequest: CostEffectiveRequest = {
  targetBudget: 10000,
  targetCategory: "한식",
};

const mockSummary = "10,000원 / 한식";

import { useConceptJob } from "../useConceptJob";

describe("useConceptJob", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearAllPersistedJobs();
    act(() => {
      useAIRecipeStoreV2.setState({ jobs: {} });
    });
  });

  describe("submit", () => {
    it("성공 시 createJob → API → setJobId 순서로 처리하고 job.state가 polling이 되어야 함", async () => {
      jest
        .spyOn(api, "createAIRecipeJobV2")
        .mockResolvedValue({ jobId: "job-xyz" });

      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      await act(async () => {
        await result.current.submit(mockRequest, mockSummary);
      });

      const job = Object.values(useAIRecipeStoreV2.getState().jobs)[0];
      expect(job).toBeDefined();
      expect(job.concept).toBe("COST_EFFECTIVE");
      expect(job.jobId).toBe("job-xyz");
      expect(job.state).toBe("polling");
      expect(job.meta.displayName).toBe("가성비 요리");
      expect(job.meta.requestSummary).toBe(mockSummary);
    });

    it("API 실패 시 failJob 처리되고 job.state가 failed가 되어야 함", async () => {
      jest
        .spyOn(api, "createAIRecipeJobV2")
        .mockRejectedValue(new Error("서버 다운"));

      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      await act(async () => {
        await result.current.submit(mockRequest, mockSummary);
      });

      const job = Object.values(useAIRecipeStoreV2.getState().jobs)[0];
      expect(job.state).toBe("failed");
      expect(job.message).toBe("서버 다운");
    });

    it("Error 인스턴스 아닌 throw도 기본 메시지로 처리해야 함", async () => {
      jest.spyOn(api, "createAIRecipeJobV2").mockRejectedValue("문자열 에러");

      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      await act(async () => {
        await result.current.submit(mockRequest, mockSummary);
      });

      const job = Object.values(useAIRecipeStoreV2.getState().jobs)[0];
      expect(job.state).toBe("failed");
      expect(job.message).toBe("레시피 생성에 실패했습니다.");
    });

    it("같은 concept 진행 중인 job이 있으면 새 job을 만들지 않아야 함", async () => {
      jest
        .spyOn(api, "createAIRecipeJobV2")
        .mockResolvedValue({ jobId: "job-1" });

      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      await act(async () => {
        await result.current.submit(mockRequest, mockSummary);
      });

      await act(async () => {
        await result.current.submit(mockRequest, mockSummary);
      });

      const jobs = Object.values(useAIRecipeStoreV2.getState().jobs);
      expect(jobs).toHaveLength(1);
    });
  });

  describe("derived state", () => {
    it("job 없을 때 isPending/isSuccess/isFailed 모두 false", () => {
      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      expect(result.current.job).toBeUndefined();
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isFailed).toBe(false);
      expect(result.current.progress).toBe(0);
    });

    it("creating 상태일 때 isPending=true", () => {
      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      act(() => {
        useAIRecipeStoreV2.getState().createJob("COST_EFFECTIVE", mockRequest, {
          concept: "COST_EFFECTIVE",
          displayName: "가성비 요리",
          requestSummary: mockSummary,
        });
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isFailed).toBe(false);
    });

    it("completed 상태일 때 isSuccess=true 그리고 progress=100", () => {
      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      act(() => {
        const key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, {
            concept: "COST_EFFECTIVE",
            displayName: "가성비 요리",
            requestSummary: mockSummary,
          });
        useAIRecipeStoreV2.getState().completeJob(key, "recipe-1");
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.progress).toBe(100);
    });

    it("failed 상태일 때 isFailed=true", () => {
      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      act(() => {
        const key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, {
            concept: "COST_EFFECTIVE",
            displayName: "가성비 요리",
            requestSummary: mockSummary,
          });
        useAIRecipeStoreV2.getState().failJob(key, "700", "에러");
      });

      expect(result.current.isFailed).toBe(true);
      expect(result.current.isPending).toBe(false);
    });
  });

  describe("retry", () => {
    it("retry 호출 시 현재 job 제거", () => {
      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      act(() => {
        const key = useAIRecipeStoreV2
          .getState()
          .createJob("COST_EFFECTIVE", mockRequest, {
            concept: "COST_EFFECTIVE",
            displayName: "가성비 요리",
            requestSummary: mockSummary,
          });
        useAIRecipeStoreV2.getState().failJob(key, "700", "에러");
      });

      expect(result.current.job).toBeDefined();

      act(() => {
        result.current.retry();
      });

      expect(Object.values(useAIRecipeStoreV2.getState().jobs)).toHaveLength(0);
    });

    it("job 없을 때 retry 호출해도 안전 (no-op)", () => {
      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      expect(() => {
        act(() => {
          result.current.retry();
        });
      }).not.toThrow();
    });
  });

  describe("concept 격리", () => {
    it("다른 concept의 job은 본 훅에 노출되지 않아야 함", () => {
      const { result } = renderHook(() => useConceptJob("COST_EFFECTIVE"));

      act(() => {
        useAIRecipeStoreV2.getState().createJob(
          "INGREDIENT_FOCUS",
          {
            ingredientIds: ["1"],
            dishType: "한식",
            cookingTime: 30,
            servings: 2,
          },
          {
            concept: "INGREDIENT_FOCUS",
            displayName: "냉장고 속 재료",
            requestSummary: "",
          }
        );
      });

      expect(result.current.job).toBeUndefined();
      expect(result.current.isPending).toBe(false);
    });
  });
});
