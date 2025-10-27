"use client";

import TransformingNavbar from "@/widgets/Header/TransformingNavbar";
import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";

import { useRecipeStatus } from "./RecipeStatusProvider";

type RecipeNavbarProps = {
  title: string;
  recipeId: number;
  heroImageId: string;
};

export default function RecipeNavbar({
  title,
  recipeId,
  heroImageId,
}: RecipeNavbarProps) {
  const { status } = useRecipeStatus();

  return (
    <TransformingNavbar
      title={title}
      heroImageId={heroImageId}
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
