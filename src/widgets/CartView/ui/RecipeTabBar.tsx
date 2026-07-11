// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { ImageOff } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type { CartRecipeTab } from "@/entities/cart";

type RecipeTabBarProps = {
  recipes: CartRecipeTab[];
  totalItemCount: number;
  selectedRecipeId: string | null;
  onSelect: (recipeId: string | null) => void;
};

const TabThumb = ({ recipe }: { recipe: CartRecipeTab }) =>
  recipe.imageUrl ? (
    <img
      src={recipe.imageUrl}
      alt=""
      className="size-10 rounded-lg object-cover"
      loading="lazy"
    />
  ) : (
    <span
      data-testid="deleted-recipe-placeholder"
      className="flex size-10 items-center justify-center rounded-lg bg-gray-100"
    >
      <ImageOff size={16} className="text-ink-disabled" />
    </span>
  );

export const RecipeTabBar = ({
  recipes,
  totalItemCount,
  selectedRecipeId,
  onSelect,
}: RecipeTabBarProps) => {
  const tabClass = (active: boolean) =>
    cn(
      "flex shrink-0 flex-col items-center gap-1 rounded-xl border px-3 py-2 text-xs",
      active
        ? "border-olive-light bg-olive-light/10 text-olive-dark font-bold"
        : "text-ink-sub border-gray-200 bg-white"
    );

  return (
    <div
      role="tablist"
      aria-label="레시피별 필터"
      className="scrollbar-hide flex gap-2 overflow-x-auto pb-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedRecipeId === null}
        onClick={() => {
          triggerHaptic("Light");
          onSelect(null);
        }}
        className={tabClass(selectedRecipeId === null)}
      >
        <span className="flex size-10 items-center justify-center rounded-lg bg-gray-50 font-bold">
          {totalItemCount}
        </span>
        전체
      </button>
      {recipes.map((recipe) => (
        <button
          key={recipe.recipeId}
          type="button"
          role="tab"
          aria-selected={selectedRecipeId === recipe.recipeId}
          onClick={() => {
            triggerHaptic("Light");
            onSelect(recipe.recipeId);
          }}
          className={tabClass(selectedRecipeId === recipe.recipeId)}
        >
          <TabThumb recipe={recipe} />
          <span className="flex max-w-20 items-center gap-0.5">
            <span className="truncate">{recipe.title}</span>
            <span className="shrink-0">· {recipe.itemCount}</span>
          </span>
        </button>
      ))}
    </div>
  );
};
