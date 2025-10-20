import { useQuery } from "@tanstack/react-query";

import { getRecipeItems } from "@/entities/recipe";

type UseRecipeItemsQueryParams = {
  key: string;
  sort?: "desc" | "asc";
  isAiGenerated?: boolean;
  tags?: string[];
  q?: string;
  dishType?: string | null;
  maxCost?: number;
  period?: "weekly" | "monthly";
};

export const useRecipeItemsQuery = ({
  key,
  sort = "desc",
  isAiGenerated,
  tags,
  q,
  dishType,
  maxCost,
  period,
}: UseRecipeItemsQueryParams) => {
  const queryParams = { sort, isAiGenerated, tags, q, dishType, maxCost, period };
  const queryKey = ["recipes", key, queryParams];

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
