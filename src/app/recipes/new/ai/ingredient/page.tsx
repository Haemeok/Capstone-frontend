"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIRecipeFormValues,
  aiRecipeFormSchema,
} from "@/features/recipe-create-ai/model/schema";
import { buildIngredientFocusRequest } from "@/features/recipe-create-ai/model/adapters";
import { aiModels } from "@/shared/config/constants/aiModel";
import { useAIRecipeStoreV2 } from "@/features/recipe-create-ai/model/store";
import { createAIRecipeJobV2 } from "@/features/recipe-create-ai/model/api";
import { calculateFakeProgress } from "@/features/recipe-create-ai/lib/progress";

import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import IngredientManager from "@/widgets/IngredientManager/IngredientManager";
import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import AiCharacterSection from "@/widgets/AIRecipeForm/AiCharacterSection";
import DishTypeSection from "@/widgets/AIRecipeForm/DishTypeSection";
import CookingTimeSection from "@/widgets/AIRecipeForm/CookingTimeSection";
import ServingsCounter from "@/widgets/AIRecipeForm/ServingsCounter";
import AIRecipeProgressButton from "@/widgets/AIRecipeForm/AIRecipeProgressButton";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";
import { AIIngredientPayload } from "@/entities/ingredient";

const CONCEPT = "INGREDIENT_FOCUS" as const;

const IngredientRecipePage = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // V2 Store
  const createJob = useAIRecipeStoreV2((state) => state.createJob);
  const setJobId = useAIRecipeStoreV2((state) => state.setJobId);
  const failJob = useAIRecipeStoreV2((state) => state.failJob);
  const removeJob = useAIRecipeStoreV2((state) => state.removeJob);
  const getJobByConcept = useAIRecipeStoreV2((state) => state.getJobByConcept);

  // Get current job for this concept
  const job = getJobByConcept(CONCEPT);

  const isPending = job?.state === "creating" || job?.state === "polling";
  const isSuccess = job?.state === "completed";
  const isFailed = job?.state === "failed";

  const methods = useForm<AIRecipeFormValues>({
    resolver: zodResolver(aiRecipeFormSchema),
    defaultValues: {
      ingredients: [],
      dishType: "",
      cookingTime: 0,
      servings: 1,
    },
    mode: "all",
  });

  const ingredients = useWatch({
    control: methods.control,
    name: "ingredients",
  });

  const handleAddIngredient = (ingredient: AIIngredientPayload) => {
    const currentIngredients = methods.getValues("ingredients");
    if (!currentIngredients.some((ing) => ing.id === ingredient.id)) {
      methods.setValue(
        "ingredients",
        [...currentIngredients, { id: ingredient.id, name: ingredient.name }],
        { shouldValidate: true, shouldDirty: true }
      );
    }
  };

  const onSubmit = async (data: AIRecipeFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const request = buildIngredientFocusRequest({
      ingredientIds: data.ingredients.map((ing) => ing.id),
      dishType: data.dishType,
      cookingTime: data.cookingTime,
      servings: data.servings,
    });

    const meta = {
      concept: CONCEPT,
      displayName: aiModels[CONCEPT].name,
      requestSummary: `${data.ingredients.length}개 재료 / ${data.dishType}`,
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
      <FormProvider {...methods}>
        <div className="relative mx-auto p-4">
          <div className="mb-4 flex items-center gap-2">
            <PrevButton className="md:hidden" />
            <button
              onClick={() => router.back()}
              className="hidden items-center gap-2 text-gray-600 transition-colors hover:text-gray-800 md:flex"
            >
              <ArrowLeftIcon size={20} />
              <span className="text-sm font-medium">AI 다시 선택하기</span>
            </button>
          </div>

          <AiCharacterSection selectedAI={aiModels[CONCEPT]} />

          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="pb-20 md:pb-0"
          >
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
              <IngredientManager onOpenDrawer={() => setIsDrawerOpen(true)} />

              <div className="space-y-6">
                <DishTypeSection />
                <CookingTimeSection />
                <div className="h-1 w-full" />
                <ServingsCounter />
              </div>
            </div>
            <UsageLimitSection>
              {({ hasNoQuota }) => (
                <AIRecipeProgressButton
                  isLoading={isSubmitting}
                  disabled={hasNoQuota}
                />
              )}
            </UsageLimitSection>
          </form>

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

export default IngredientRecipePage;
