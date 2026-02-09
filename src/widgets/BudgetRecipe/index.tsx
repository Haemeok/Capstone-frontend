"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import BudgetHeader from "./BudgetHeader";
import PriceSlider from "./PriceSlider";
import CategorySelector from "./CategorySelector";
import { BUDGET_DEFAULT } from "@/shared/config/constants/budget";
import type { CostEffectiveRequest } from "@/features/recipe-create-ai/model/types";
import { useAIRecipeStoreV2 } from "@/features/recipe-create-ai/model/store";
import { createAIRecipeJobV2 } from "@/features/recipe-create-ai/model/api";
import { useAIJobPolling } from "@/features/recipe-create-ai/model/useAIJobPolling";
import { calculateFakeProgress } from "@/features/recipe-create-ai/lib/progress";
import { aiModels } from "@/shared/config/constants/aiModel";

import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";
import { Container } from "@/shared/ui/Container";
import { ArrowLeftIcon, ChefHatIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";

const CONCEPT = "COST_EFFECTIVE" as const;

const BudgetRecipe = () => {
  const router = useRouter();
  const [budget, setBudget] = useState(BUDGET_DEFAULT);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // V2 Store
  const createJob = useAIRecipeStoreV2((state) => state.createJob);
  const setJobId = useAIRecipeStoreV2((state) => state.setJobId);
  const failJob = useAIRecipeStoreV2((state) => state.failJob);
  const removeJob = useAIRecipeStoreV2((state) => state.removeJob);
  const getJobByConcept = useAIRecipeStoreV2((state) => state.getJobByConcept);
  const hydrateFromStorage = useAIRecipeStoreV2(
    (state) => state.hydrateFromStorage
  );

  // Hydrate on mount
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  // Start polling
  useAIJobPolling();

  // Get current job for this concept
  const job = getJobByConcept(CONCEPT);

  const isPending = job?.state === "creating" || job?.state === "polling";
  const isSuccess = job?.state === "completed";
  const isFailed = job?.state === "failed";

  const handleGenerateRecipe = async () => {
    if (!selectedCategory || isSubmitting) return;
    setIsSubmitting(true);

    const request: CostEffectiveRequest = {
      targetBudget: budget,
      targetCategory: selectedCategory,
    };

    const meta = {
      concept: CONCEPT,
      displayName: aiModels[CONCEPT].name,
      requestSummary: `${budget.toLocaleString()}원 / ${selectedCategory}`,
    };

    const idempotencyKey = createJob(CONCEPT, request, meta);

    try {
      const response = await createAIRecipeJobV2(
        request,
        CONCEPT,
        idempotencyKey
      );
      setJobId(idempotencyKey, response.jobId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "레시피 생성에 실패했습니다.";
      failJob(idempotencyKey, undefined, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (job) {
      removeJob(job.idempotencyKey);
    }
  };

  // Calculate progress
  const fakeProgress = job ? calculateFakeProgress(job.startTime) : 0;
  const realProgress = job?.progress ?? 0;
  const progress = isSuccess ? 100 : Math.max(fakeProgress, realProgress);

  if (isPending && job) {
    return (
      <Container padding={false}>
        <AiLoading
          aiModelId={CONCEPT}
          progress={progress}
          startTime={job.startTime}
        />
      </Container>
    );
  }

  if (isSuccess && job?.resultRecipeId) {
    return (
      <Container className="h-full" padding={false}>
        <AIRecipeComplete generatedRecipe={{ recipeId: job.resultRecipeId }} />
      </Container>
    );
  }

  if (isFailed && job) {
    return (
      <Container padding={false}>
        <AIRecipeError
          error={job.message || "레시피 생성 중 오류가 발생했습니다."}
          onRetry={handleRetry}
        />
      </Container>
    );
  }

  return (
    <Container padding={false}>
      <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 md:pb-4">
        <div className="mb-4 flex items-center gap-2">
          <PrevButton className="text-gray-600 md:hidden" />
          <button
            onClick={() => router.back()}
            className="hidden items-center gap-2 text-gray-600 transition-colors hover:text-gray-800 md:flex"
          >
            <ArrowLeftIcon size={20} />
            <span className="text-sm font-medium">AI 다시 선택하기</span>
          </button>
        </div>
        <BudgetHeader />

        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-lg">
          <PriceSlider value={budget} onChange={setBudget} />
        </div>

        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-lg">
          <CategorySelector
            budget={budget}
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <UsageLimitSection>
          {({ hasNoQuota }) => (
            <button
              onClick={handleGenerateRecipe}
              disabled={hasNoQuota || !selectedCategory || isSubmitting}
              className="bg-olive-light hover:bg-olive-medium flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
            >
              <ChefHatIcon className="h-6 w-6" />
              <span>레시피 생성하기</span>
            </button>
          )}
        </UsageLimitSection>
      </div>
    </Container>
  );
};

export default BudgetRecipe;
