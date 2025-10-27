"use client";

import { FabButton } from "@/shared/ui/FabButton";

import { useRecipeContainer } from "./RecipeContainer";

type RecipeFabButtonProps = {
  recipeId: number;
};

export default function RecipeFabButton({ recipeId }: RecipeFabButtonProps) {
  const { observerRef } = useRecipeContainer();

  return (
    <>
      <div ref={observerRef} className="h-1 w-full" />
      <FabButton
        to={`/recipes/${recipeId}/slide-show`}
        text="요리하기"
        triggerRef={observerRef}
      />
    </>
  );
}
