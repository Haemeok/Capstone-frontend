"use client";

import type { Locale } from "@/shared/i18n";
import { getEuroParticle } from "@/shared/lib/korean";

import { useIngredientRecipesQuery } from "@/entities/ingredient";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

type IngredientRecipesSlideProps = {
  ingredientId: string;
  ingredientName: string;
  locale?: Locale;
};

const IngredientRecipesSlide = ({
  ingredientId,
  ingredientName,
}: IngredientRecipesSlideProps) => {
  const { data, isLoading, error } = useIngredientRecipesQuery(ingredientId);
  const recipes = data?.content ?? [];

  return (
    <RecipeSlide
      title={`${ingredientName}${getEuroParticle(ingredientName)} 만든 인기 레시피`}
      recipes={recipes}
      isLoading={isLoading}
      error={error as Error | null}
    />
  );
};

export default IngredientRecipesSlide;
