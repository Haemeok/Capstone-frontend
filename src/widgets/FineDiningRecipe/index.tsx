"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";

import DifficultyTierSelector from "./DifficultyTierSelector";
import FineDiningIngredientManager from "./FineDiningIngredientManager";
import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import { useAIRecipeStoreV2 } from "@/features/recipe-create-ai/model/store";
import { createAIRecipeJobV2 } from "@/features/recipe-create-ai/model/api";
import { calculateFakeProgress } from "@/features/recipe-create-ai/lib/progress";
import type { FineDiningRequest } from "@/features/recipe-create-ai/model/types";
import { aiModels } from "@/shared/config/constants/aiModel";
import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";
import { Container } from "@/shared/ui/Container";
import { ArrowLeftIcon, ChefHatIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";
import { AIIngredientPayload } from "@/entities/ingredient";

const CONCEPT = "FINE_DINING" as const;
const MIN_FINE_DINING_INGREDIENTS = 3;

type FineDiningFormValues = {
  ingredients: Array<{ id: string; name: string }>;
  diningTier: "WHITE" | "BLACK";
};

const FineDiningRecipe = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FineDiningFormValues>({
    defaultValues: {
      ingredients: [],
      diningTier: "BLACK",
    },
  });

  // V2 Store
  const createJob = useAIRecipeStoreV2((state) => state.createJob);
  const setJobId = useAIRecipeStoreV2((state) => state.setJobId);
  const failJob = useAIRecipeStoreV2((state) => state.failJob);
  const removeJob = useAIRecipeStoreV2((state) => state.removeJob);
  const getJobByConcept = useAIRecipeStoreV2((state) => state.getJobByConcept);
  // Get current job for this concept
  const job = getJobByConcept(CONCEPT);

  const ingredients = useWatch({
    control: methods.control,
    name: "ingredients",
  });

  const diningTier = useWatch({
    control: methods.control,
    name: "diningTier",
  });

  const handleAddIngredient = (ingredientPayload: AIIngredientPayload) => {
    const currentIngredients = methods.getValues("ingredients");
    if (!currentIngredients.some((ing) => ing.id === ingredientPayload.id)) {
      methods.setValue("ingredients", [
        ...currentIngredients,
        {
          id: ingredientPayload.id,
          name: ingredientPayload.name,
        },
      ]);
    }
  };

  const handleTierSelect = (tier: "WHITE" | "BLACK") => {
    methods.setValue("diningTier", tier);
  };

  const isPending = job?.state === "creating" || job?.state === "polling";
  const isSuccess = job?.state === "completed";
  const isFailed = job?.state === "failed";

  const handleGenerateRecipe = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = methods.getValues();

    const request: FineDiningRequest = {
      ingredientIds: formData.ingredients.map((ing) => ing.id),
      diningTier: formData.diningTier,
    };

    const meta = {
      concept: CONCEPT,
      displayName: aiModels[CONCEPT].name,
      requestSummary: `${formData.ingredients.length}개 재료 / ${formData.diningTier}`,
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

  const isFormValid =
    (ingredients?.length ?? 0) >= MIN_FINE_DINING_INGREDIENTS &&
    diningTier !== null;

  return (
    <Container padding={false}>
      <FormProvider {...methods}>
        <div className="mx-auto max-w-2xl space-y-8 p-4 pb-24 md:pb-4">
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

          <FineDiningIngredientManager
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />

          <DifficultyTierSelector
            selected={diningTier}
            onSelect={handleTierSelect}
          />

          <UsageLimitSection>
            {({ hasNoQuota }) => (
              <button
                onClick={handleGenerateRecipe}
                disabled={hasNoQuota || !isFormValid || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:shadow-lg"
              >
                <ChefHatIcon className="h-6 w-6" />
                <span>레시피 생성하기</span>
              </button>
            )}
          </UsageLimitSection>

          <IngredientSelector
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            onIngredientSelect={handleAddIngredient}
            addedIngredientNames={
              new Set((ingredients || []).map((ing) => ing.name))
            }
            mapIngredientToPayload={(ingredient) => ({
              id: ingredient.id,
              name: ingredient.name,
            })}
          />
        </div>
      </FormProvider>
    </Container>
  );
};

export default FineDiningRecipe;
