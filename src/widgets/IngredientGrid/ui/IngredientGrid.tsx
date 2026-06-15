"use client";

import React from "react";

import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";

import { IngredientItem as IngredientItemType } from "@/entities/ingredient";

import IngredientsLoginCTA from "@/features/auth/ui/IngredientsLoginCTA";

import IngredientEmptyState from "@/widgets/IngredientGrid/ui/IngredientEmptyState";
import IngredientGridSkeleton from "@/widgets/IngredientGrid/ui/IngredientGridSkeleton";
import IngredientItem from "@/widgets/IngredientGrid/ui/IngredientItem";

type IngredientGridProps = {
  ingredients: IngredientItemType[];
  isDeleteMode: boolean;
  isFetchingNextPage: boolean;
  isPending?: boolean;
  hasNextPage: boolean;
  error: Error | null;
  ref: (node?: Element | null | undefined) => void;
  isLoggedIn: boolean;
  setSelectedIngredientIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIngredientIds: string[];
};

const IngredientGrid = ({
  ingredients,
  isDeleteMode,
  isFetchingNextPage,
  isPending,
  error,
  ref,
  isLoggedIn,
  setSelectedIngredientIds,
  selectedIngredientIds,
}: IngredientGridProps) => {
  const t = useIngredientsDict();
  const showEmptyState =
    !isPending &&
    !isFetchingNextPage &&
    ingredients &&
    ingredients.length === 0;

  return isLoggedIn ? (
    <div className="flex grow flex-col gap-5">
      <div className="grid w-full grid-cols-1 gap-3 p-5 min-[350px]:grid-cols-2">
        {ingredients?.map((ingredient) => (
          <IngredientItem
            key={ingredient.id}
            ingredient={ingredient}
            isDeleteMode={isDeleteMode}
            setSelectedIngredientIds={setSelectedIngredientIds}
            isSelected={selectedIngredientIds.includes(ingredient.id)}
          />
        ))}
        {(isPending || isFetchingNextPage) && (
          <IngredientGridSkeleton count={4} />
        )}
        {showEmptyState && <IngredientEmptyState />}
      </div>
      {error && (
        <p className="text-center text-red-500">
          {t.error.prefix}:{" "}
          {error instanceof Error ? error.message : t.error.unknown}
        </p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  ) : (
    <IngredientsLoginCTA />
  );
};

export default IngredientGrid;
