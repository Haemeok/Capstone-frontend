import { useQuery } from "@tanstack/react-query";

import {
  getRecipeItems,
  getRecipesStatus,
  RecipeItemsQueryParams,
} from "@/entities/recipe";

export const useRecipeItemsQuery = ({
  key,
  sort = "desc",
  isAiGenerated,
  tags,
  q,
  dishType,
  maxCost,
  period,
}: RecipeItemsQueryParams) => {
  const queryKey = ["recipes", key, { sort, isAiGenerated, tags, q, dishType, maxCost, period }];

  const query = useQuery({
    queryKey,
    queryFn: () => getRecipeItems({ sort, isAiGenerated, tags, q, dishType, maxCost, period }),
    select: (data) => data.content,
  });

  return {
    ...query,
    data: query.data ?? [],
  };
};

export const useRecipesStatusQuery = (recipeIds: number[]) => {
  return useQuery({
    queryKey: ["recipes-status", recipeIds],
    queryFn: () => getRecipesStatus(recipeIds),
    enabled: recipeIds.length > 0,
  });
};
