import { useState } from "react";
import { useForm } from "react-hook-form";

import { IngredientPayload } from "@/entities/ingredient";

import type { AIRecommendedRecipeRequest } from "../model/types";

type AIRecipeFormData = Omit<AIRecommendedRecipeRequest, "robotType">;

export const useAIRecipeForm = () => {
  const [addedIngredientIds, setAddedIngredientIds] = useState<Set<number>>(
    new Set()
  );

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<AIRecipeFormData>({
    defaultValues: {
      ingredients: [],
      dishType: "",
      cookingTime: "",
      servings: 2,
    },
    mode: "onChange",
  });

  const formValues = watch();
  const { ingredients, dishType, cookingTime, servings } = formValues;

  const handleAddIngredient = (ingredientPayload: IngredientPayload) => {
    const newIngredients = [...ingredients, ingredientPayload.name];
    setValue("ingredients", newIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setValue("ingredients", newIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveAllIngredients = () => {
    setValue("ingredients", [], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleIncrementServings = () => {
    setValue("servings", servings + 1, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDecrementServings = () => {
    if (servings > 1) {
      setValue("servings", servings - 1, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const radioToggle = <T>(fieldName: keyof AIRecipeFormData, item: T) => {
    setValue(fieldName as any, item, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const toggleCategory = (category: string) =>
    radioToggle("dishType", category);

  const toggleTime = (cookingTime: string) =>
    radioToggle("cookingTime", cookingTime);

  const totalSteps = 4;
  const completedSteps = [
    ingredients.length > 0,
    dishType.length > 0,
    cookingTime.length > 0,
    servings > 0,
  ].filter(Boolean).length;

  const progressPercentage = Math.floor((completedSteps / totalSteps) * 100);
  const isFormReady = completedSteps === totalSteps;

  return {
    formValues,
    ingredients,
    dishType,
    cookingTime,
    servings,
    isDirty,

    progressPercentage,
    isFormReady,

    addedIngredientIds,
    setAddedIngredientIds,
    handleAddIngredient,
    handleRemoveIngredient,
    handleRemoveAllIngredients,
    handleIncrementServings,
    handleDecrementServings,

    toggleCategory,
    toggleTime,
    handleSubmit,
  };
};
