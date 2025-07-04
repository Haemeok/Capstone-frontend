import { useQuery } from "@tanstack/react-query";

import { getRecipeItems } from "@/entities/recipe";

type UseRecipeItemsQueryParams = {
  key: string; // Unique identifier for the query
  sort?: "desc" | "asc";
  isAiGenerated?: boolean;
  tagNames?: string[];
  q?: string;
  dishType?: string | null;
};

export const useRecipeItemsQuery = ({
  key,
  sort = "desc",
  isAiGenerated,
  tagNames,
  q,
  dishType,
}: UseRecipeItemsQueryParams) => {
  const queryParams = { sort, isAiGenerated, tagNames, q, dishType };
  const queryKey = ["recipeItems", key, queryParams];

  const query = useQuery({
    queryKey,
    queryFn: () => getRecipeItems(queryParams),
    select: (data) => data.content,
  });

  return {
    ...query,
    data: query.data ?? [],
  };
};
