"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AiFormInArticleAdSlot, BottomAnchorAdSlot } from "@/shared/adsense";
import { aiModels } from "@/shared/config/constants/aiModel";
import {
  INGREDIENT_CATEGORIES_NEW_RECIPE,
  RECIPE_CREATE_CATEGORY_ALL,
  RECIPE_CREATE_CATEGORY_MINE,
} from "@/shared/config/constants/recipe";
import { useLocalizedRouter } from "@/shared/i18n";
import { DictionaryProvider, getDictionary, useT } from "@/shared/i18n";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { AIIngredientPayload } from "@/entities/ingredient";
import { IngredientPicker } from "@/entities/ingredient/ui/IngredientPicker";

import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import { buildIngredientFocusRequest } from "@/features/recipe-create-ai/model/adapters";
import {
  aiRecipeFormSchema,
  AIRecipeFormValues,
} from "@/features/recipe-create-ai/model/schema";
import { useConceptJob } from "@/features/recipe-create-ai/model/useConceptJob";

import AIConceptShell from "@/widgets/AIConceptShell";
import AiCharacterSection from "@/widgets/AIRecipeForm/AiCharacterSection";
import AIRecipeProgressButton from "@/widgets/AIRecipeForm/AIRecipeProgressButton";
import CookingTimeSection from "@/widgets/AIRecipeForm/CookingTimeSection";
import DishTypeSection from "@/widgets/AIRecipeForm/DishTypeSection";
import ServingsCounter from "@/widgets/AIRecipeForm/ServingsCounter";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";
import IngredientManager from "@/widgets/IngredientManager/IngredientManager";

const CONCEPT = "INGREDIENT_FOCUS" as const;

const IngredientRecipePage = () => {
  const router = useLocalizedRouter();
  const t = useT();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { job, isPending, isFailed, progress, submit, retry } =
    useConceptJob(CONCEPT);

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

  const onSubmit = (data: AIRecipeFormValues) => {
    const request = buildIngredientFocusRequest({
      ingredientIds: data.ingredients.map((ing) => ing.id),
      dishType: data.dishType,
      cookingTime: data.cookingTime,
      servings: data.servings,
    });

    submit(
      request,
      `${data.ingredients.length}${t.aiRecipe.ingredient.submitToastSuffix} / ${data.dishType}`
    );
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
        <FormProvider {...methods}>
          <div className="relative mx-auto p-4">
            <div className="mb-4 flex items-center gap-2">
              <PrevButton className="md:hidden" />
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

            <AiCharacterSection selectedAI={aiModels[CONCEPT]} />

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="pb-20 md:pb-24"
            >
              <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
                <IngredientManager onOpenDrawer={() => setIsDrawerOpen(true)} />
              </div>

              <AiFormInArticleAdSlot className="mb-8" />

              <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
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
                    isLoading={isPending}
                    disabled={hasNoQuota}
                  />
                )}
              </UsageLimitSection>
            </form>

            {isMobile ? (
              <IngredientPicker
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                categories={INGREDIENT_CATEGORIES_NEW_RECIPE}
                initialCategory={RECIPE_CREATE_CATEGORY_ALL}
                queryConfig={{
                  keyBase: "drawerIngredients",
                  getParams: (category) => ({
                    category:
                      category === RECIPE_CREATE_CATEGORY_MINE ||
                      category === RECIPE_CREATE_CATEGORY_ALL
                        ? null
                        : category,
                    isMine: category === RECIPE_CREATE_CATEGORY_MINE,
                  }),
                }}
                isAlreadyAdded={(ingredient) =>
                  (ingredients || []).some(
                    (ing) => ing.name === ingredient.name
                  )
                }
                onComplete={(items) =>
                  items.forEach((i) =>
                    handleAddIngredient({ id: i.id, name: i.name })
                  )
                }
              />
            ) : (
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
            )}
          </div>
        </FormProvider>
      </Container>
    </AIConceptShell>
  );
};

const koDict = getDictionary("ko");

const IngredientRecipePageWithErrorBoundary = () => (
  <DictionaryProvider dict={koDict}>
    <ErrorBoundary
      fallback={
        <SectionErrorFallback message={koDict.aiRecipe.errorFallback} />
      }
    >
      <IngredientRecipePage />
    </ErrorBoundary>
    <BottomAnchorAdSlot />
  </DictionaryProvider>
);

export default IngredientRecipePageWithErrorBoundary;
