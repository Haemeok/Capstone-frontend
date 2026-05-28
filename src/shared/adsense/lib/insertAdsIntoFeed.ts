export type FeedItem<T> =
  | { __kind: "recipe"; recipe: T }
  | { __kind: "ad"; key: string; adIndex: number };

export const insertAdsIntoFeed = <T>(
  items: T[],
  everyN: number
): FeedItem<T>[] => {
  const out: FeedItem<T>[] = [];
  let adIndex = 0;
  items.forEach((item, idx) => {
    out.push({ __kind: "recipe", recipe: item });
    const isNth = (idx + 1) % everyN === 0;
    if (isNth) {
      out.push({ __kind: "ad", key: `ad-${idx}`, adIndex });
      adIndex += 1;
    }
  });
  return out;
};
