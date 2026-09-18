"use client";

import { type BaseSyntheticEvent, useEffect, useMemo, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { invalidateCache } from "@/shared/config/cache";
import { format, useLocalizedRouter, useRecipeFormDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import { useRecipeDetailQuery } from "@/entities/recipe";

import {
  buildRecipeFormSchema,
  IngredientPayload,
  RecipeFormValues,
} from "../config";
import { useSubmitRecipe } from "./useSubmitRecipe";

export const useRecipeEditForm = (recipeId: string) => {
  const router = useLocalizedRouter();
  const { addToast } = useToastStore();
  const { submitRecipe, isPending, error } = useSubmitRecipe();
  const { validation, ui } = useRecipeFormDict();

  const schema = useMemo(() => buildRecipeFormSchema(validation), [validation]);

  const { recipeData: recipe, isSuccess: isRecipeLoaded } =
    useRecipeDetailQuery(recipeId);

  const originalIngredientsRef = useRef<IngredientPayload[]>([]);
  const initializedRecipeIdRef = useRef<string | null>(null);

  const defaultFormValues = useMemo<RecipeFormValues>(
    () => ({
      title: recipe.title,
      image: recipe.imageUrl,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ingredientId: ingredient.id ?? "",
        name: ingredient.name ?? "",
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
        ingredients: (step.ingredients || []).map((ing) => ({
          ingredientId: ing.id ?? "",
          name: ing.name ?? "",
          quantity: ing.quantity || "",
          unit: ing.unit ?? "",
        })),
        imageKey: step.stepImageKey,
      })),
      cookingTools: recipe.cookingTools || [],
      tags: recipe.tags || [],
    }),
    [recipe]
  );

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!isRecipeLoaded || initializedRecipeIdRef.current === recipeId) return;

    originalIngredientsRef.current = defaultFormValues.ingredients;
    methods.reset(defaultFormValues);
    initializedRecipeIdRef.current = recipeId;
  }, [isRecipeLoaded, defaultFormValues, methods, recipeId]);

  const checkIngredientsModified = (
    original: IngredientPayload[],
    current: IngredientPayload[]
  ): boolean => {
    if (original.length !== current.length) return true;

    return original.some((orig, index) => {
      const curr = current[index];
      return (
        orig.name !== curr.name ||
        orig.quantity !== curr.quantity ||
        orig.unit !== curr.unit ||
        orig.ingredientId !== curr.ingredientId
      );
    });
  };

  const onSubmit: SubmitHandler<RecipeFormValues> = (formData) => {
    const isIngredientsModified = checkIngredientsModified(
      originalIngredientsRef.current,
      formData.ingredients
    );

    submitRecipe(
      { formData, recipeId, isIngredientsModified },
      {
        onSuccess: async () => {
          triggerHaptic("Success");
          addToast({
            message: ui.editSuccess,
            variant: "success",
            position: "bottom",
          });
          methods.reset();
          await invalidateCache({ type: "RECIPE_MUTATED", recipeId });
          router.push(`/recipes/${recipeId}`);
        },
        onError: (error) => {
          addToast({
            message: format(ui.editError, { message: error.message }),
            variant: "error",
            position: "bottom",
          });
        },
      }
    );
  };

  const handleMainIngredientRemoved = (ingredientName: string) => {
    const currentSteps = methods.getValues("steps");
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

  return {
    methods,
    onSubmit: (event?: BaseSyntheticEvent) =>
      methods.handleSubmit(onSubmit)(event),
    isLoading: isPending,
    error,
    handleMainIngredientRemoved,
  };
};
