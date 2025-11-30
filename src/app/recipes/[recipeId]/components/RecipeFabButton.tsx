"use client";

import { FabButton } from "@/shared/ui/FabButton";

import { useRecipeContainer } from "./RecipeContainer";

type RecipeFabButtonProps = {
  recipeId: number;
  hasAllStepImages: boolean;
};

export default function RecipeFabButton({
  recipeId,
  hasAllStepImages,
}: RecipeFabButtonProps) {
  const { observerRef } = useRecipeContainer();

  if (!hasAllStepImages) {
    return null;
  }

  return (
    <>
      <div ref={observerRef} className="h-1 w-full" />
      <div className="md:hidden">
        <FabButton
          to={`/recipes/${recipeId}/slide-show`}
          text="요리하기"
          triggerRef={observerRef}
        />
      </div>
    </>
  );
}
