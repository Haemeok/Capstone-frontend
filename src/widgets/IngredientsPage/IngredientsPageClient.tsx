"use client";

import React, { useState } from "react";

import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";

import { useUserStore } from "@/entities/user";

import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge";

import IngredientActionButtons from "@/widgets/IngredientGrid/ui/IngredientActionButtons";
import IngredientGrid from "@/widgets/IngredientGrid/ui/IngredientGrid";

import { useGridAnimation } from "./hooks/useGridAnimation";
import { useInfiniteIngredients } from "./hooks/useInfiniteIngredients";
import { useIngredientsManager } from "./hooks/useIngredientsManager";

const IngredientsPageClient = () => {
  const [sort] = useState<"asc" | "desc">("asc");

  const { user } = useUserStore();
  const { mutate: deleteIngredientBulk } = useDeleteIngredientBulkMutation();

  const {
    isDeleteMode,
    setIsDeleteMode,
    selectedCategory,
    setSelectedCategory,
    selectedIngredientIds,
    setSelectedIngredientIds,
  } = useIngredientsManager();

  const { error, hasNextPage, isFetchingNextPage, ref, ingredients } =
    useInfiniteIngredients({
      category: selectedCategory,
      sort,
    });

  const { gridItemsContainerRef, gridAnimateTargetRef } = useGridAnimation({
    ingredients,
    error,
  });

  const handleDeleteIngredientBulk = () => {
    deleteIngredientBulk(selectedIngredientIds);
  };

  const headerTitle = user?.nickname
    ? `${user?.nickname}님의 냉장고`
    : "로그인 후 냉장고를 관리해보세요";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-[#f7f7f7] p-4">
        <h1 className="text-xl font-bold">{headerTitle}</h1>
        {!!user && (
          <IngredientActionButtons
            isDeleteMode={isDeleteMode}
            setIsDeleteMode={setIsDeleteMode}
            handleDeleteIngredientBulk={handleDeleteIngredientBulk}
          />
        )}
      </div>
      <div className="scrollbar-hide flex shrink-0 overflow-x-auto border-b border-gray-200">
        {INGREDIENT_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "flex-shrink-0 px-4 py-3 text-sm font-medium",
              selectedCategory === category
                ? "text-olive-light"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <IngredientGrid
        ingredients={ingredients ?? []}
        isDeleteMode={isDeleteMode}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        gridItemsContainerRef={gridItemsContainerRef}
        gridAnimateTargetRef={gridAnimateTargetRef}
        ref={ref}
        isLoggedIn={!!user}
        setSelectedIngredientIds={setSelectedIngredientIds}
      />
    </div>
  );
};

export default IngredientsPageClient;