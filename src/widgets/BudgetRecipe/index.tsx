"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import BudgetHeader from "./BudgetHeader";
import PriceSlider from "./PriceSlider";
import CategorySelector from "./CategorySelector";
import { BUDGET_DEFAULT } from "@/shared/config/constants/budget";
import { useCreateAIRecipeMutation } from "@/features/recipe-create-ai";
import type { CostEffectiveRequest } from "@/features/recipe-create-ai/model/types";

import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";
import { Container } from "@/shared/ui/Container";
import { ArrowLeftIcon, ChefHatIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";

const BudgetRecipe = () => {
  const router = useRouter();
  const [budget, setBudget] = useState(BUDGET_DEFAULT);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    generationState,
    generatedRecipeData,
    error: storeError,
  } = useAIRecipeStore();
  const { createAIRecipe, reset } = useCreateAIRecipeMutation();

  const isPending = generationState === "generating";
  const isSuccess = generationState === "completed";
  const recipeData = generatedRecipeData;
  const error = storeError ? { message: storeError } : null;

  const handleGenerateRecipe = () => {
    if (!selectedCategory) return;

    const request: CostEffectiveRequest = {
      targetBudget: budget,
      targetCategory: selectedCategory,
    };

    createAIRecipe({
      request,
      concept: "COST_EFFECTIVE",
    });
  };

  if (isPending) {
    return (
      <Container padding={false}>
        <AiLoading aiModelId="COST_EFFECTIVE" />
      </Container>
    );
  }

  if (isSuccess && recipeData) {
    return (
      <Container className="h-full" padding={false}>
        <AIRecipeComplete generatedRecipe={recipeData} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container padding={false}>
        <AIRecipeError
          error={error.message || "레시피 생성 중 오류가 발생했습니다."}
          onRetry={reset}
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
              disabled={hasNoQuota || !selectedCategory}
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
