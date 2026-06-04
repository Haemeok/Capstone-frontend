"use client";

import { useAdsGate } from "../AdsGateContext";
import { type FeedItem, insertAdsIntoFeed } from "./insertAdsIntoFeed";

export const useFeedWithAds = <T>(
  items: T[],
  everyN: number,
  surfaceEnabled: boolean
): FeedItem<T>[] => {
  const { enabled } = useAdsGate();
  if (!enabled || !surfaceEnabled) {
    return items.map((item) => ({ __kind: "recipe" as const, recipe: item }));
  }
  return insertAdsIntoFeed(items, everyN);
};
