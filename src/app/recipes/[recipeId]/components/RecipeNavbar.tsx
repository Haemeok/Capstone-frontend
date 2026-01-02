"use client";

import PrevButton from "@/shared/ui/PrevButton";

import TransformingNavbar from "@/widgets/Header/TransformingNavbar";
import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";

import { useRecipeStatus } from "@/features/recipe-status";

type RecipeNavbarProps = {
  title: string;
  heroImageId: string;
};

export default function RecipeNavbar({
  title,
  heroImageId,
}: RecipeNavbarProps) {
  const { status, recipeId } = useRecipeStatus();

  return (
    <TransformingNavbar
      title={title}
      heroImageId={heroImageId}
      titleThreshold={0.7}
      textColorThreshold={0.5}
      shadowThreshold={0.8}
      leftComponent={<PrevButton showOnDesktop={true} />}
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
