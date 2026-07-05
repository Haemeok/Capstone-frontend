"use client";

import React, { useRef, useState } from "react";

import { AnimatePresence } from "motion/react";

import {
  INGREDIENT_CATEGORIES,
  type IngredientCategoryName,
} from "@/shared/config/constants/recipe";
import { format } from "@/shared/i18n/format";
import { localizedHref } from "@/shared/i18n/localizedHref";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
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

  const t = useIngredientsDict();
  const locale = useChromeLocale();
  const { localize } = useTaxonomy();

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

  const {
    error,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    ref,
    ingredients,
  } = useInfiniteIngredients({
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

  const handleCategoryChange = (category: IngredientCategoryName) => {
    if (selectedCategory !== category) {
      triggerHaptic("Light");
      setSelectedCategory(category);
    }
  };

  const headerTitle = !!user
    ? format(t.headerLoggedIn, { nickname: user?.nickname ?? "" })
    : t.headerLoggedOut;

  return (
    <Container padding={false}>
      <div className="flex flex-col">
        <div ref={observerRef} className="w-full" />
        <div className="z-sticky sticky-optimized sticky top-0 bg-white">
          <div className="flex items-center justify-between gap-3 px-5 py-5">
            <h1 className="text-ink min-w-0 text-xl leading-snug font-bold break-keep">
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
                  "flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-olive-light text-white"
                    : "text-ink-sub bg-gray-100 active:bg-gray-200"
                )}
              >
                {localize(category, "ingredientCategory")}
              </button>
            ))}
          </div>
        </div>
        <IngredientGrid
          ingredients={ingredients ?? []}
          isDeleteMode={isDeleteMode}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending}
          hasNextPage={hasNextPage}
          error={error}
          ref={ref}
          isLoggedIn={!!user}
          setSelectedIngredientIds={setSelectedIngredientIds}
          selectedIngredientIds={selectedIngredientIds}
        />

        {!!user && !isDeleteMode && (
          <FabButton
            to={localizedHref("/recipes/my-fridge", locale)}
            text={t.fabFindRecipes}
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
