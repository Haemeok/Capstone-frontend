"use client";

import React, { useRef, useState } from "react";

import { AnimatePresence } from "motion/react";

import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";
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

  const allIngredientIds = ingredients?.map((i) => i.id) ?? [];
  const isAllSelected =
    allIngredientIds.length > 0 &&
    allIngredientIds.every((id) => selectedIngredientIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIngredientIds([]);
    } else {
      setSelectedIngredientIds(allIngredientIds);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (selectedCategory !== category) {
      triggerHaptic("Light");
      setSelectedCategory(category);
    }
  };

  const headerTitle = !!user
    ? `${user?.nickname}님의\n냉장고`
    : "로그인 후 냉장고를\n관리해보세요";

  return (
    <Container padding={false}>
      <div className="flex flex-col">
        <div ref={observerRef} className="w-full" />
        <div className="z-sticky sticky-optimized sticky top-0 bg-white">
          <div className="flex items-center justify-between px-5 py-5">
            <h1 className="whitespace-pre-line text-2xl font-bold text-gray-900">
              {headerTitle}
            </h1>
            {!!user && (
              <IngredientActionButtons
                isDeleteMode={isDeleteMode}
                setIsDeleteMode={setIsDeleteMode}
                onToggleSelectAll={handleToggleSelectAll}
                isAllSelected={isAllSelected}
              />
            )}
          </div>
          <div className="scrollbar-hide flex shrink-0 gap-2 overflow-x-auto border-b border-gray-100 px-5 py-3 sm:flex-wrap sm:overflow-x-visible">
            {INGREDIENT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all",
                  selectedCategory === category
                    ? "bg-olive-light text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
          selectedIngredientIds={selectedIngredientIds}
        />

        {!!user && !isDeleteMode && (
          <FabButton
            to="/recipes/my-fridge"
            text="내 냉장고로 레시피 찾기"
            triggerRef={observerRef}
          />
        )}

        <AnimatePresence>
          {!!user && isDeleteMode && (
            <DeleteModeFabButton
              selectedCount={selectedIngredientIds.length}
              onDelete={handleDeleteIngredientBulk}
            />
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
};

export default IngredientsPageClient;
