import { useQuery } from "@tanstack/react-query";

import { getRecipeItems } from "@/entities/recipe";
import {
  BaseRecipesApiResponse,
  DetailedRecipesApiResponse,
} from "@/entities/recipe/model/types";

type UseRecipeItemsQueryParams = {
  key: string;
  sort?: "desc" | "asc";
  isAiGenerated?: boolean;
  tagNames?: string[];
  q?: string;
  dishType?: string | null;
};

export const useRecipeItemsQuery = (
  {
    key,
    sort = "desc",
    isAiGenerated,
    tagNames,
    q,
    dishType,
  }: UseRecipeItemsQueryParams,
  initialData?: DetailedRecipesApiResponse
) => {
  const queryParams = { sort, isAiGenerated, tagNames, q, dishType };
  const queryKey = ["recipes", key, queryParams];

  const query = useQuery({
    queryKey,
    queryFn: () => getRecipeItems(queryParams),
    select: (data) => data.content,
    initialData,
  });

  return {
    ...query,
    data: query.data ?? [],
  };
};
