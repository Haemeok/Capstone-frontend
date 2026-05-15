import { SEARCH_AD_EVERY_N_CARDS } from "@/shared/adsense/config";
import {
  type FeedItem,
  insertAdsIntoFeed,
} from "@/shared/adsense/lib/insertAdsIntoFeed";

export const buildFeedItems = <T>(
  recipes: T[],
  showInFeedAds: boolean,
): FeedItem<T>[] => {
  if (showInFeedAds) {
    return insertAdsIntoFeed<T>(recipes, SEARCH_AD_EVERY_N_CARDS);
  }
  return recipes.map((recipe) => ({ __kind: "recipe" as const, recipe }));
};
