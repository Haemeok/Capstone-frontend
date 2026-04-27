"use client";

import { useIngredientRecipesQuery } from "@/entities/ingredient";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

type IngredientRecipesSlideProps = {
  ingredientId: string;
};

const IngredientRecipesSlide = ({
  ingredientId,
}: IngredientRecipesSlideProps) => {
  const { data, isLoading, error } = useIngredientRecipesQuery(ingredientId);
  const recipes = data?.content ?? [];

  return (
    <RecipeSlide
      title="이 재료로 만들 수 있는 레시피"
      recipes={recipes}
      isLoading={isLoading}
      error={error as Error | null}
    />
  );
};

export default IngredientRecipesSlide;
