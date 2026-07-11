// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { ChevronRight } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartRecipeRef } from "@/entities/cart";

type CartRecipeLinkProps = {
  recipe: CartRecipeRef;
  imageUrl?: string | null;
};

const Thumb = ({ imageUrl }: { imageUrl?: string | null }) =>
  imageUrl ? (
    <img
      src={imageUrl}
      alt=""
      loading="lazy"
      className="size-6 shrink-0 rounded object-cover"
    />
  ) : null;

export const CartRecipeLink = ({ recipe, imageUrl }: CartRecipeLinkProps) => {
  if (recipe.deleted) {
    return (
      <span className="text-ink-muted flex min-w-0 items-center gap-1.5 text-base">
        <Thumb imageUrl={imageUrl} />
        <span className="truncate">{recipe.title}</span>
      </span>
    );
  }

  return (
    <LocalizedLink
      href={`/recipes/${recipe.recipeId}`}
      onClick={() => triggerHaptic("Light")}
      aria-label={`${recipe.title} 레시피 보기`}
      className="text-ink-sub flex min-w-0 items-center gap-1.5 text-base underline-offset-2 hover:underline"
    >
      <Thumb imageUrl={imageUrl} />
      <span className="truncate">{recipe.title}</span>
      <ChevronRight size={14} className="text-ink-muted shrink-0" />
    </LocalizedLink>
  );
};
