"use client";

import { StaticRecipe } from "@/entities/recipe/model/types";

import { useRecipeStatus } from "@/features/recipe-status";

import RecipeInteractionButtons from "@/widgets/RecipeInteractionButtons";

type RecipeInteractionBarProps = {
  staticRecipe: StaticRecipe;
};

export default function RecipeInteractionBar({
  staticRecipe,
}: RecipeInteractionBarProps) {
  const { status } = useRecipeStatus();

  return (
    <RecipeInteractionButtons
      recipeId={staticRecipe.id}
      initialIsFavorite={status?.favoriteByCurrentUser ?? false}
      visibility={staticRecipe.visibility}
      title={staticRecipe.title}
      authorId={staticRecipe.author.id}
      isCloneable={staticRecipe.isCloneable}
    />
  );
}
