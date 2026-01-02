"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { ChefHat, ArrowLeft } from "lucide-react";

import DifficultyTierSelector from "./DifficultyTierSelector";
import FineDiningIngredientManager from "./FineDiningIngredientManager";
import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import { useCreateAIRecipeMutation } from "@/features/recipe-create-ai";
import type { FineDiningRequest } from "@/features/recipe-create-ai/model/types";
import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";
import { AIIngredientPayload } from "@/entities/ingredient";

type FineDiningFormValues = {
  ingredients: Array<{ id: string; name: string }>;
  diningTier: "WHITE" | "BLACK";
};

const FineDiningRecipe = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const methods = useForm<FineDiningFormValues>({
    defaultValues: {
      ingredients: [],
      diningTier: "BLACK",
    },
  });

  const {
    generationState,
    generatedRecipeData,
    error: storeError,
  } = useAIRecipeStore();
  const { createAIRecipe, reset } = useCreateAIRecipeMutation();

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

  const isPending = generationState === "generating";
  const isSuccess = generationState === "completed";
  const recipeData = generatedRecipeData;
  const error = storeError ? { message: storeError } : null;

  const handleGenerateRecipe = () => {
    const formData = methods.getValues();

    const request: FineDiningRequest = {
      ingredientIds: formData.ingredients.map((ing) => ing.id),
      diningTier: formData.diningTier,
    };

    createAIRecipe({
      request,
      concept: "FINE_DINING",
    });
  };

  if (isPending) {
    return (
      <Container padding={false}>
        <AiLoading aiModelId="FINE_DINING" />
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

  const isFormValid = (ingredients?.length ?? 0) >= 3 && diningTier !== null;

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
              <ArrowLeft size={20} />
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

          <button
            onClick={handleGenerateRecipe}
            disabled={!isFormValid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:shadow-lg"
          >
            <ChefHat className="h-6 w-6" />
            <span>레시피 생성하기</span>
          </button>

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
