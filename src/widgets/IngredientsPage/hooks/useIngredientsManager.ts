import { useState } from "react";

export const useIngredientsManager = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>(
    []
  );

  return {
    isDeleteMode,
    setIsDeleteMode,
    selectedCategory,
    setSelectedCategory,
    selectedIngredientIds,
    setSelectedIngredientIds,
  };
};