import { useQuery } from "@tanstack/react-query";

import { getTrendingYoutubeRecipes } from "../api";
import { TrendingYoutubeRecipe } from "../types";

export const useTrendingYoutubeRecipesQuery = () => {
  return useQuery<TrendingYoutubeRecipe[], Error>({
    queryKey: ["trending-youtube-recipes"],
    queryFn: () => getTrendingYoutubeRecipes(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};
