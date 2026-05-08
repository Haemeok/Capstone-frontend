export type FeedItem<T> =
  | { __kind: "recipe"; recipe: T }
  | { __kind: "ad"; key: string; adIndex: number };

// adIndex 는 페이지 내 광고 자리 일련번호 (0-based). InFeedAdSlot 이
// AD_SLOT_IDS.searchInFeed 리스트에서 이 인덱스로 unique 슬롯을 고른다.
// 같은 페이지에 동일 data-ad-slot 두 번 박히면 TagError 라서 슬롯 단위가
// 광고 자리 수와 1:1 매핑되어야 한다.
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
