import { useQuery } from "@tanstack/react-query";

import { getRecipeStatus } from "../api";
import { RecipeStatus } from "../types";

export const useRecipeStatusQuery = (id: string) => {
  return useQuery<RecipeStatus>({
    queryKey: ["recipe-status", id],
    queryFn: () => getRecipeStatus(id),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};
