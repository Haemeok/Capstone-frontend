import { act } from "@testing-library/react";

import { clearAllPersistedJobs, loadPersistedJobs } from "../persistence";
import { useAIRecipeStoreV2 } from "../store";
import type { AIJobMeta, CostEffectiveRequest } from "../types";

const mockRequest: CostEffectiveRequest = {
  targetBudget: 10000,
  targetCategory: "한식",
};

const mockMeta: AIJobMeta = {
  concept: "COST_EFFECTIVE",
  displayName: "가성비 요리",
  requestSummary: "10,000원 / 한식",
};

const store = () => useAIRecipeStoreV2.getState();

describe("useAIRecipeStoreV2", () => {
  beforeEach(() => {
    clearAllPersistedJobs();
    act(() => {
      useAIRecipeStoreV2.setState({ jobs: {} });
    });
  });

  describe("createJob", () => {
    it("새 job을 creating 상태로 생성한다", () => {
      let key = "";
      act(() => {
        key = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
      });

      expect(store().jobs[key]).toMatchObject({
        concept: "COST_EFFECTIVE",
        state: "creating",
        jobId: null,
        progress: 0,
        retryCount: 0,
      });
    });

    it("생성한 job을 localStorage에 저장한다", () => {
      act(() => {
        store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
      });

      expect(loadPersistedJobs()).toHaveLength(1);
    });

    it("같은 concept의 진행 중 job이 있으면 기존 key를 반환한다", () => {
      let key1 = "";
      let key2 = "";
      act(() => {
        key1 = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        key2 = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
      });

      expect(key1).toBe(key2);
      expect(Object.keys(store().jobs)).toHaveLength(1);
    });

    it("같은 concept이라도 끝난 job(completed)이면 새 job을 만든다", () => {
      let key1 = "";
      let key2 = "";
      act(() => {
        key1 = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().setJobId(key1, "job-1");
        store().completeJob(key1, "recipe-1");
        key2 = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
      });

      expect(key1).not.toBe(key2);
      expect(Object.keys(store().jobs)).toHaveLength(2);
    });
  });

  describe("상태 전이", () => {
    it("setJobId는 jobId를 설정하고 polling으로 전이한다", () => {
      let key = "";
      act(() => {
        key = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().setJobId(key, "job-1");
      });

      expect(store().jobs[key]).toMatchObject({
        jobId: "job-1",
        state: "polling",
      });
    });

    it("completeJob은 completed로 전이하고 progress 100과 resultRecipeId를 설정한다", () => {
      let key = "";
      act(() => {
        key = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().setJobId(key, "job-1");
        store().completeJob(key, "recipe-1");
      });

      expect(store().jobs[key]).toMatchObject({
        state: "completed",
        progress: 100,
        resultRecipeId: "recipe-1",
      });
    });

    it("completeJob 시 localStorage에서 job을 제거한다", () => {
      let key = "";
      act(() => {
        key = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().setJobId(key, "job-1");
        store().completeJob(key, "recipe-1");
      });

      expect(loadPersistedJobs()).toHaveLength(0);
    });

    it("failJob은 failed로 전이하고 code와 message를 설정한다", () => {
      let key = "";
      act(() => {
        key = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().failJob(key, "701", "AI 생성 실패");
      });

      expect(store().jobs[key]).toMatchObject({
        state: "failed",
        code: "701",
        message: "AI 생성 실패",
      });
    });
  });

  describe("getPendingJobs", () => {
    it("creating과 polling 상태만 포함한다", () => {
      act(() => {
        const k1 = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().setJobId(k1, "job-1");

        store().createJob(
          "INGREDIENT_FOCUS",
          { ingredientIds: ["1"], dishType: "한식", cookingTime: 30, servings: 2 },
          { concept: "INGREDIENT_FOCUS", displayName: "냉장고 속 재료", requestSummary: "" }
        );

        const k3 = store().createJob(
          "NUTRITION_BALANCE",
          { targetStyle: "다이어트", targetCalories: "500", targetCarbs: "50", targetProtein: "30", targetFat: "20" },
          { concept: "NUTRITION_BALANCE", displayName: "영양 밸런스", requestSummary: "" }
        );
        store().setJobId(k3, "job-3");
        store().completeJob(k3, "recipe-3");
      });

      const pending = store().getPendingJobs();
      expect(pending.map((j) => j.state).sort()).toEqual(["creating", "polling"]);
    });

    it("completed와 failed 상태는 제외한다", () => {
      act(() => {
        const completed = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().setJobId(completed, "job-1");
        store().completeJob(completed, "recipe-1");

        const failed = store().createJob(
          "FINE_DINING",
          { ingredientIds: ["1"], diningTier: "BLACK" },
          { concept: "FINE_DINING", displayName: "파인 다이닝", requestSummary: "" }
        );
        store().failJob(failed, "700", "에러");
      });

      expect(store().getPendingJobs()).toHaveLength(0);
    });
  });

  describe("getJobByConcept", () => {
    it("concept으로 job을 찾고 다른 concept의 job은 노출하지 않는다", () => {
      act(() => {
        store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
      });

      expect(store().getJobByConcept("COST_EFFECTIVE")?.concept).toBe("COST_EFFECTIVE");
      expect(store().getJobByConcept("FINE_DINING")).toBeUndefined();
    });
  });

  describe("removeJob", () => {
    it("job을 store에서 제거한다", () => {
      let key = "";
      act(() => {
        key = store().createJob("COST_EFFECTIVE", mockRequest, mockMeta);
        store().removeJob(key);
      });

      expect(store().jobs[key]).toBeUndefined();
    });
  });
});
