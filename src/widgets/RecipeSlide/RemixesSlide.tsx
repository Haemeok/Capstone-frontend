"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import { useT } from "@/shared/i18n";

import {
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  StaticDetailedRecipeGridItem,
} from "@/entities/recipe";

import { useRecipesStatusQuery, useRemixesQuery } from "./hooks";
import RecipeSlide from "./RecipeSlide";

type RemixesSlideProps = {
  recipeId: string;
  locale?: "ko" | "ja";
};

const MIN_VISIBLE = 5;

const RemixesSlide = ({ recipeId, locale }: RemixesSlideProps) => {
  const t = useT();
  const { ref, inView } = useInViewOnce({ rootMargin: "400px" });

  const {
    data: recipes,
    isLoading,
    error,
  } = useRemixesQuery(recipeId, { enabled: inView });

  const items = recipes ?? [];
  const hasEnough = items.length >= MIN_VISIBLE;

  const recipeIds = hasEnough ? items.map((recipe) => recipe.id) : [];
  const { data: statusData } = useRecipesStatusQuery(recipeIds);

  const recipesWithStatus: DetailedRecipeGridItemType[] = items.map(
    (recipe: StaticDetailedRecipeGridItem) => ({
      ...recipe,
      favoriteByCurrentUser:
        statusData?.[recipe.id]?.favoriteByCurrentUser ?? false,
    })
  );

  if (!inView) {
    return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
  }

  if (!isLoading && !error && !hasEnough) {
    return null;
  }

  return (
    <div ref={ref}>
      <RecipeSlide
        title={t.recipeDetail.remixesTitle}
        recipes={recipesWithStatus}
        isLoading={isLoading}
        error={error as Error | null}
        locale={locale}
      />
    </div>
  );
};

export default RemixesSlide;
