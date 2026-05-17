"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BUDGET_DEFAULT } from "@/shared/config/constants/budget";
import { Container } from "@/shared/ui/Container";
import { ArrowLeftIcon, ChefHatIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";

import { useConceptJob } from "@/features/recipe-create-ai/model/useConceptJob";
import type { CostEffectiveRequest } from "@/features/recipe-create-ai/model/types";

import AIConceptShell from "@/widgets/AIConceptShell";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";

import BudgetHeader from "./BudgetHeader";
import CategorySelector from "./CategorySelector";
import PriceSlider from "./PriceSlider";

const CONCEPT = "COST_EFFECTIVE" as const;

const BudgetRecipe = () => {
  const router = useRouter();
  const [budget, setBudget] = useState(BUDGET_DEFAULT);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { job, isPending, isFailed, progress, submit, retry } =
    useConceptJob(CONCEPT);

  const handleGenerateRecipe = () => {
    if (!selectedCategory) return;

    const request: CostEffectiveRequest = {
      targetBudget: budget,
      targetCategory: selectedCategory,
    };

    submit(request, `${budget.toLocaleString()}원 / ${selectedCategory}`);
  };

  return (
    <AIConceptShell
      concept={CONCEPT}
      job={job}
      isPending={isPending}
      isFailed={isFailed}
      progress={progress}
      onRetry={retry}
    >
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
                disabled={hasNoQuota || !selectedCategory || isPending}
                className="bg-olive-light hover:bg-olive-medium flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
              >
                <ChefHatIcon className="h-6 w-6" />
                <span>레시피 생성하기</span>
              </button>
            )}
          </UsageLimitSection>
        </div>
      </Container>
    </AIConceptShell>
  );
};

export default BudgetRecipe;
