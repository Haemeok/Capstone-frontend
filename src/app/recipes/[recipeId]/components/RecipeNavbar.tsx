"use client";

import TransformingNavbar from "@/widgets/Header/TransformingNavbar";
import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";

import { useRecipeContainer } from "./RecipeContainer";
import { useRecipeStatus } from "./RecipeStatusProvider";

type RecipeNavbarProps = {
  title: string;
  recipeId: number;
};

export default function RecipeNavbar({ title, recipeId }: RecipeNavbarProps) {
  const { imageRef } = useRecipeContainer();
  const { status } = useRecipeStatus();

  return (
    <TransformingNavbar
      title={title}
      targetRef={imageRef}
      titleThreshold={0.7}
      textColorThreshold={0.5}
      shadowThreshold={0.8}
      rightComponent={
        <RecipeNavBarButtons
          recipeId={recipeId}
          initialIsLiked={status?.likedByCurrentUser ?? false}
          initialLikeCount={status?.likeCount ?? 0}
        />
      }
    />
  );
}
