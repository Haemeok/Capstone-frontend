// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type { CartRecipeTab } from "@/entities/cart";

type RecipeFilterBarProps = {
  recipes: CartRecipeTab[];
  totalItemCount: number;
  selectedRecipeId: string | null;
  onSelect: (recipeId: string | null) => void;
};

export const RecipeFilterBar = ({
  recipes,
  totalItemCount,
  selectedRecipeId,
  onSelect,
}: RecipeFilterBarProps) => {
  const selectRecipe = (recipeId: string | null) => {
    if (recipeId === selectedRecipeId) return;
    triggerHaptic("Light");
    onSelect(recipeId);
  };

  const filterClass = (isSelected: boolean) =>
    cn(
      "min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-olive-light focus-visible:ring-offset-2 focus-visible:outline-none",
      isSelected ? "bg-ink text-white" : "bg-gray-100 text-ink-sub"
    );

  return (
    <div
      role="group"
      aria-label="레시피 필터"
      className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3"
    >
      <button
        type="button"
        aria-pressed={selectedRecipeId === null}
        onClick={() => selectRecipe(null)}
        className={filterClass(selectedRecipeId === null)}
      >
        전체 {totalItemCount}
      </button>
      {recipes.map((recipe) => (
        <button
          key={recipe.recipeId}
          type="button"
          aria-pressed={selectedRecipeId === recipe.recipeId}
          onClick={() => selectRecipe(recipe.recipeId)}
          className={filterClass(selectedRecipeId === recipe.recipeId)}
        >
          {recipe.title} · {recipe.itemCount}
        </button>
      ))}
    </div>
  );
};
