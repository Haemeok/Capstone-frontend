"use client";

import RecipeInteractionButtons from "@/widgets/RecipeInteractionButtons";

import { StaticRecipe } from "@/entities/recipe/model/types";

import { useRecipeStatus } from "./RecipeStatusProvider";

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
      initialIsLiked={status?.likedByCurrentUser ?? false}
      initialLikeCount={status?.likeCount ?? 0}
      initialIsFavorite={status?.favoriteByCurrentUser ?? false}
      initialIsPrivate={staticRecipe.private}
      title={staticRecipe.title}
      authorId={staticRecipe.author.id}
    />
  );
}
