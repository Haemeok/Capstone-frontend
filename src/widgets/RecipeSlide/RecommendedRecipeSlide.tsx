"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  StaticDetailedRecipeGridItem,
} from "@/entities/recipe";

import { useRecipesStatusQuery, useRecommendedRecipesQuery } from "./hooks";
import RecipeSlide from "./RecipeSlide";

type RecommendedRecipeSlideProps = {
  recipeId: string;
  tags: string[];
};

const CHEF_TAG = "👨‍🍳 셰프 레시피";

const resolveTitle = (tags: string[]) =>
  tags.includes(CHEF_TAG)
    ? "더 다양한 셰프 레시피를 만나보세요"
    : "이런 레시피는 어떠신가요?";

const RecommendedRecipeSlide = ({
  recipeId,
  tags,
}: RecommendedRecipeSlideProps) => {
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
      likedByCurrentUser: statusData?.[recipe.id]?.likedByCurrentUser ?? false,
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
      <RecipeSlide
        title={resolveTitle(tags)}
        recipes={recipesWithStatus}
        isLoading={isLoading}
        error={error as Error | null}
      />
    </div>
  );
};

export default RecommendedRecipeSlide;
