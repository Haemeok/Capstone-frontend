import { useState } from "react";

export const useIngredientsManager = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
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
