"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { useT } from "@/shared/i18n";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  StaticDetailedRecipeGridItem,
} from "@/entities/recipe";

import { useRecipesStatusQuery, useRecommendedRecipesQuery } from "./hooks";
import RecommendedRecipeGrid from "./RecommendedRecipeGrid";

type RecommendedRecipeSlideProps = {
  recipeId: string;
  tags: string[];
  locale?: "ko" | "ja" | "en";
};

const CHEF_TAG = "👨‍🍳 셰프 레시피";

const RecommendedRecipeSlide = ({
  recipeId,
  tags,
  locale,
}: RecommendedRecipeSlideProps) => {
  const t = useT();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const {
    data: recipes,
    isLoading,
    error,
  } = useRecommendedRecipesQuery(recipeId, { enabled: inView });

  const recipeIds = (recipes ?? []).map((recipe) => recipe.id);
  const { data: statusData } = useRecipesStatusQuery(recipeIds);

  const recipesWithStatus: DetailedRecipeGridItemType[] = (recipes ?? []).map(
    (recipe: StaticDetailedRecipeGridItem) => ({
      ...recipe,
      favoriteByCurrentUser:
        statusData?.[recipe.id]?.favoriteByCurrentUser ?? false,
    })
  );

  if (!inView) {
    return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
  }

  if (!isLoading && !error && recipesWithStatus.length === 0) {
    return null;
  }

  return (
    <div ref={ref}>
      <RecommendedRecipeGrid
        title={
          tags.includes(CHEF_TAG)
            ? t.recipeDetail.recommendedChefTitle
            : t.recipeDetail.recommendedTitle
        }
        recipes={recipesWithStatus}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default RecommendedRecipeSlide;
