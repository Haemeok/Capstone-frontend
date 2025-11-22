"use client";

import React, { useRef, useState } from "react";

import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import { FabButton } from "@/shared/ui/FabButton";

import { useUserStore } from "@/entities/user";

import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge";

import DeleteModeFabButton from "@/widgets/IngredientGrid/ui/DeleteModeFabButton";
import IngredientActionButtons from "@/widgets/IngredientGrid/ui/IngredientActionButtons";
import IngredientGrid from "@/widgets/IngredientGrid/ui/IngredientGrid";

import { useInfiniteIngredients } from "./hooks/useInfiniteIngredients";
import { useIngredientsManager } from "./hooks/useIngredientsManager";

const IngredientsPageClient = () => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [sort] = useState<"asc" | "desc">("asc");

  const { user } = useUserStore();

  const {
    isDeleteMode,
    setIsDeleteMode,
    selectedCategory,
    setSelectedCategory,
    selectedIngredientIds,
    setSelectedIngredientIds,
  } = useIngredientsManager();

  const { mutate: deleteIngredientBulk } = useDeleteIngredientBulkMutation({
    onSuccess: () => {
      setIsDeleteMode(false);
    },
  });

  const { error, hasNextPage, isFetchingNextPage, ref, ingredients } =
    useInfiniteIngredients({
      category: selectedCategory,
      sort,
    });

  const handleDeleteIngredientBulk = () => {
    deleteIngredientBulk(selectedIngredientIds);
  };

  const headerTitle = !!user
    ? `${user?.nickname}님의\n냉장고`
    : "로그인 후 냉장고를\n관리해보세요";

  return (
    <Container padding={false}>
      <div className="flex flex-col">
        <div ref={observerRef} className="w-full" />
        <div className="z-sticky sticky-optimized sticky top-0 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h1 className="text-xl font-bold whitespace-pre-line">
              {headerTitle}
            </h1>
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
        </div>
        <IngredientGrid
          ingredients={ingredients ?? []}
          isDeleteMode={isDeleteMode}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          error={error}
          ref={ref}
          isLoggedIn={!!user}
          setSelectedIngredientIds={setSelectedIngredientIds}
        />

        {!!user && !isDeleteMode && (
          <FabButton
            to="/recipes/my-fridge"
            text="내 냉장고로 레시피 찾기"
            triggerRef={observerRef}
          />
        )}

        {!!user && isDeleteMode && (
          <DeleteModeFabButton
            selectedCount={selectedIngredientIds.length}
            onDelete={handleDeleteIngredientBulk}
          />
        )}
      </div>
    </Container>
  );
};

export default IngredientsPageClient;
