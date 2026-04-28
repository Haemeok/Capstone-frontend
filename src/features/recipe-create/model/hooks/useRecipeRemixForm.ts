"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRecipeDetailQuery } from "@/entities/recipe";

import { IngredientPayload, recipeFormSchema, RecipeFormValues } from "../config";

export const useRecipeRemixForm = (recipeId: string) => {
  const { recipeData: recipe, isSuccess: isRecipeLoaded } =
    useRecipeDetailQuery(recipeId);

  const originalIngredientsRef = useRef<IngredientPayload[]>([]);

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
        ingredients: (step.ingredients || []).map((ing) => ({
          name: ing.name,
          quantity: ing.quantity || "",
          unit: ing.unit,
        })),
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
      const originalIngredients = recipe.ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity || "",
        unit: ingredient.unit || "",
      }));
      originalIngredientsRef.current = originalIngredients;
      methods.reset(defaultFormValues);
    }
  }, [isRecipeLoaded, defaultFormValues, methods.reset, recipe]);

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

  return {
    methods,
    recipe,
    isRecipeLoaded,
    handleMainIngredientRemoved,
  };
};
