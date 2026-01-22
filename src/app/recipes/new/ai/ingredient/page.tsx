"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";
import { useCreateAIRecipeMutation } from "@/features/recipe-create-ai";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIRecipeFormValues,
  aiRecipeFormSchema,
} from "@/features/recipe-create-ai/model/schema";
import { buildIngredientFocusRequest } from "@/features/recipe-create-ai/model/adapters";
import { aiModels } from "@/shared/config/constants/aiModel";

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

const IngredientRecipePage = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

    createAIRecipe({
      request,
      concept: "INGREDIENT_FOCUS",
    });
  };

  if (isPending) {
    return (
      <Container padding={false}>
        <AiLoading aiModelId="INGREDIENT_FOCUS" />
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

          <AiCharacterSection selectedAI={aiModels["INGREDIENT_FOCUS"]} />

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
                  isLoading={isPending}
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
