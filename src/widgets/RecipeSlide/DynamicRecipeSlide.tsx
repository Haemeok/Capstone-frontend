"use client";

import { useRecipeItemsQuery } from "./hooks";
import RecipeSlide from "./RecipeSlide";

type DynamicRecipeSlideProps = {
  title: string;
  queryKey: string;
  to?: string;
  isAiGenerated?: boolean;
  tags?: string[];
  maxCost?: number;
  period?: "weekly" | "monthly";
};

const DynamicRecipeSlide = ({
  title,
  queryKey,
  to,
  isAiGenerated,
  tags,
  maxCost,
  period,
}: DynamicRecipeSlideProps) => {
  const { data: recipes, isLoading, error } = useRecipeItemsQuery({
    key: queryKey,
    isAiGenerated,
    tags,
    maxCost,
    period,
  });

  return (
    <RecipeSlide
      title={title}
      to={to}
      recipes={recipes}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default DynamicRecipeSlide;
