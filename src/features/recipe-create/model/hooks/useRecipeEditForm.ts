"use client";

import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRecipeDetailQuery } from "@/entities/recipe";

import { useToastStore } from "@/widgets/Toast";

import { recipeFormSchema, RecipeFormValues } from "../config";
import { useSubmitRecipe } from "./useSubmitRecipe";

export const useRecipeEditForm = (recipeId: number) => {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { submitRecipe, isPending, error } = useSubmitRecipe();

  const { recipeData: recipe, isSuccess: isRecipeLoaded } =
    useRecipeDetailQuery(recipeId);

  const defaultFormValues = useMemo<RecipeFormValues>(
    () => ({
      title: recipe.title,
      image: recipe.imageUrl,
      ingredients: recipe.ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity || "",
        unit: ingredient.unit || "",
      })),
      cookingTime: recipe.cookingTime || 1,
      servings: recipe.servings || 1,
      dishType: recipe.dishType,
      imageKey: recipe.imageKey,
      description: recipe.description,
      steps: recipe.steps.map((step, index) => ({
        instruction: step.instruction,
        stepNumber: index,
        image: step.stepImageUrl,
        ingredients: step.ingredients || [],
        imageKey: step.stepImageKey,
      })),
      cookingTools: recipe.cookingTools || [],
      tags: recipe.tags || [],
    }),
    [recipe]
  );

  const methods = useForm({
    resolver: zodResolver(recipeFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isRecipeLoaded && recipe) {
      methods.reset(defaultFormValues);
    }
  }, [isRecipeLoaded, defaultFormValues, methods.reset]);

  const onSubmit: SubmitHandler<RecipeFormValues> = (formData) => {
    submitRecipe(
      { formData, recipeId },
      {
        onSuccess: () => {
          addToast({
            message: "레시피가 성공적으로 수정되었습니다!",
            variant: "success",
            position: "bottom",
          });
          methods.reset();
          router.push("/search");
        },
        onError: (error) => {
          console.error("레시피 수정 실패:", error);
          addToast({
            message: `레시피 등록 중 오류가 발생했습니다: ${error.message}`,
            variant: "error",
            position: "bottom",
          });
        },
      }
    );
  };

  const handleMainIngredientRemoved = (ingredientName: string) => {
    const currentSteps = methods.watch("steps");
    const updatedSteps = currentSteps.map((step) => {
      const newStepIngredients = (step.ingredients || []).filter(
        (ing) => ing.name !== ingredientName
      );
      return {
        ...step,
        ingredients: newStepIngredients,
      };
    });
    methods.setValue("steps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const ingredientIds = useMemo(
    () => recipe?.ingredients.map((ing) => ing.id) || [],
    [recipe]
  );

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
    isLoading: isPending,
    error,

    handleMainIngredientRemoved,
    ingredientIds,
  };
};
