"use client";

import { FabButton } from "@/shared/ui/FabButton";

import { useRecipeStatus } from "@/features/recipe-status";

import { useRecipeContainer } from "./RecipeContainer";

type RecipeFabButtonProps = {
  hasAllStepImages: boolean;
};

export default function RecipeFabButton({
  hasAllStepImages,
}: RecipeFabButtonProps) {
  const { observerRef } = useRecipeContainer();
  const { recipeId } = useRecipeStatus();
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
