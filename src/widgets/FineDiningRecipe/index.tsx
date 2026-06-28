"use client";

import { useState } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";

import { AiFormInArticleAdSlot } from "@/shared/adsense";
import { useLocalizedRouter } from "@/shared/i18n";
import { useT } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import { ArrowLeftIcon, ChefHatIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";

import { AIIngredientPayload } from "@/entities/ingredient";

import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import type { FineDiningRequest } from "@/features/recipe-create-ai/model/types";
import { useConceptJob } from "@/features/recipe-create-ai/model/useConceptJob";

import AIConceptShell from "@/widgets/AIConceptShell";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";

import DifficultyTierSelector from "./DifficultyTierSelector";
import FineDiningIngredientManager from "./FineDiningIngredientManager";

const CONCEPT = "FINE_DINING" as const;
const MIN_FINE_DINING_INGREDIENTS = 3;

type FineDiningFormValues = {
  ingredients: Array<{ id: string; name: string }>;
  diningTier: "WHITE" | "BLACK";
};

const FineDiningRecipe = () => {
  const router = useLocalizedRouter();
  const t = useT();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const methods = useForm<FineDiningFormValues>({
    defaultValues: {
      ingredients: [],
      diningTier: "BLACK",
    },
  });

  const { job, isPending, isFailed, progress, submit, retry } =
    useConceptJob(CONCEPT);

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

  const handleGenerateRecipe = () => {
    const formData = methods.getValues();

    const request: FineDiningRequest = {
      ingredientIds: formData.ingredients.map((ing) => ing.id),
      diningTier: formData.diningTier,
    };

    submit(
      request,
      // i18n-ignore: requestSummary 페이로드 (ko 전용), 표시 텍스트 아님
      `${formData.ingredients.length}개 재료 / ${formData.diningTier}`
    );
  };

  const isFormValid =
    (ingredients?.length ?? 0) >= MIN_FINE_DINING_INGREDIENTS &&
    diningTier !== null;

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
        <FormProvider {...methods}>
          <div className="mx-auto max-w-2xl space-y-8 p-4 pb-24 md:pb-24">
            <div className="mb-4 flex items-center gap-2">
              <PrevButton className="text-ink-sub md:hidden" />
              <button
                onClick={() => router.back()}
                className="text-ink-sub hover:text-ink hidden items-center gap-2 transition-colors md:flex"
              >
                <ArrowLeftIcon size={20} />
                <span className="text-sm font-medium">
                  {t.aiRecipe.backToModelSelect}
                </span>
              </button>
            </div>

            <FineDiningIngredientManager
              onOpenDrawer={() => setIsDrawerOpen(true)}
            />

            <AiFormInArticleAdSlot />

            <DifficultyTierSelector
              selected={diningTier}
              onSelect={handleTierSelect}
            />

            <UsageLimitSection>
              {({ hasNoQuota }) => (
                <button
                  onClick={handleGenerateRecipe}
                  disabled={hasNoQuota || !isFormValid || isPending}
                  className="disabled:text-ink-muted flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:shadow-lg"
                >
                  <ChefHatIcon className="h-6 w-6" />
                  <span>{t.aiRecipe.generateRecipe}</span>
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
    </AIConceptShell>
  );
};

export default FineDiningRecipe;
