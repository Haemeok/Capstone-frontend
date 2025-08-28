import { useState } from "react";
import { useForm } from "react-hook-form";

import { IngredientPayload } from "@/entities/ingredient";

import type { AIRecipeFormValues } from "../model/schema";

export const useAIRecipeForm = () => {
  const methods = useForm<AIRecipeFormValues>({
    defaultValues: {
      ingredients: [],
      dishType: "",
      cookingTime: 10,
      servings: 2,
    },
    mode: "onChange",
  });

  const { setValue, getValues } = methods;

  const [addedIngredientIds, setAddedIngredientIds] = useState<Set<number>>(
    new Set()
  );

  const handleAddIngredient = (ingredientPayload: IngredientPayload) => {
    const currentIngredients = getValues("ingredients");
    const newIngredients = [...currentIngredients, ingredientPayload.name];

    setValue("ingredients", newIngredients, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const currentIngredients = getValues("ingredients");
    const newIngredients = currentIngredients.filter((_, i) => i !== index);

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

  return {
    methods,

    handleAddIngredient,
    handleRemoveIngredient,
    handleRemoveAllIngredients,

    addedIngredientIds,
    setAddedIngredientIds,
  };
};
