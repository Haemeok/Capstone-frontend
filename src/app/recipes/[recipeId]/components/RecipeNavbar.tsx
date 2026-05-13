"use client";

import { useRouter } from "next/navigation";

import { useIsApp } from "@/shared/hooks/useIsApp";
import PrevButton from "@/shared/ui/PrevButton";

import { useRecipeStatus } from "@/features/recipe-status";

import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";
import TransformingNavbar from "@/widgets/Header/TransformingNavbar";

const SEARCH_RESULTS_POPULAR_HREF =
  "/search/results?sort=popularityScore%2CDESC";

type RecipeNavbarProps = {
  title: string;
  heroImageId: string;
};

export default function RecipeNavbar({
  title,
  heroImageId,
}: RecipeNavbarProps) {
  const { status, recipeId } = useRecipeStatus();
  const isApp = useIsApp();
  const router = useRouter();

  const handleBack = isApp
    ? undefined
    : () => router.push(SEARCH_RESULTS_POPULAR_HREF);

  return (
    <TransformingNavbar
      title={title}
      heroImageId={heroImageId}
      titleThreshold={0.7}
      textColorThreshold={0.5}
      shadowThreshold={0.8}
      leftComponent={
        <PrevButton showOnDesktop={true} onClick={handleBack} />
      }
      rightComponent={
        <RecipeNavBarButtons
          recipeId={recipeId}
          initialIsFavorite={status?.favoriteByCurrentUser ?? false}
        />
      }
    />
  );
}
