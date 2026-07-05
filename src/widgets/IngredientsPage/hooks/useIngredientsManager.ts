import { useState } from "react";

import type { IngredientCategoryName } from "@/shared/config/constants/recipe";

export const useIngredientsManager = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<IngredientCategoryName>("전체");
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>(
    []
  );

  const toggleDeleteMode = (enabled: boolean) => {
    setIsDeleteMode(enabled);
    if (!enabled) {
      setSelectedIngredientIds([]);
    }
  };

  return {
    isDeleteMode,
    setIsDeleteMode: toggleDeleteMode,
    selectedCategory,
    setSelectedCategory,
    selectedIngredientIds,
    setSelectedIngredientIds,
  };
};
