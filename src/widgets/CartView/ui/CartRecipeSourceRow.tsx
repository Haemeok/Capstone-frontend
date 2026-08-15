// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { ChevronRight } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n";

import type { CartRecipeRef } from "@/entities/cart";

type CartRecipeSourceRowProps = {
  recipe: CartRecipeRef;
  amount: string;
};

const rowClass =
  "grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_1rem] items-center gap-2 rounded-lg text-sm";

export const CartRecipeSourceRow = ({
  recipe,
  amount,
}: CartRecipeSourceRowProps) => {
  if (recipe.deleted) {
    return (
      <div className={rowClass}>
        <span className="text-ink-muted truncate font-medium">
          {recipe.title}
        </span>
        <span className="text-ink-sub font-semibold whitespace-nowrap">
          {amount}
        </span>
        <span aria-hidden="true" />
      </div>
    );
  }

  return (
    <LocalizedLink
      href={`/recipes/${recipe.recipeId}`}
      aria-label={`${recipe.title} ${amount} 레시피 보기`}
      className={`${rowClass} focus-visible:ring-olive-light cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none`}
    >
      <span className="text-ink-sub truncate font-medium">{recipe.title}</span>
      <span className="text-ink font-semibold whitespace-nowrap">{amount}</span>
      <ChevronRight
        data-testid="recipe-source-chevron"
        size={14}
        className="text-ink-muted"
      />
    </LocalizedLink>
  );
};
