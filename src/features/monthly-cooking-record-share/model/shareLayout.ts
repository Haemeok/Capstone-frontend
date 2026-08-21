const MAX_SHARE_ITEM_COUNT = 30;

export type MonthlyShareLayout = {
  columns: 1 | 2 | 3 | 4 | 5 | 6;
  itemSize: 50 | 62 | 78 | 84 | 104 | 126 | 142 | 180;
};

export const getMonthlyShareLayout = (
  itemCount: number
): MonthlyShareLayout => {
  if (itemCount <= 1) return { columns: 1, itemSize: 180 };
  if (itemCount === 2) return { columns: 2, itemSize: 142 };
  if (itemCount === 3) return { columns: 3, itemSize: 104 };
  if (itemCount === 4) return { columns: 2, itemSize: 126 };
  if (itemCount <= 6) return { columns: 3, itemSize: 104 };
  if (itemCount <= 9) return { columns: 3, itemSize: 84 };
  if (itemCount <= 12) return { columns: 4, itemSize: 78 };
  if (itemCount <= 16) return { columns: 4, itemSize: 62 };
  if (itemCount <= 20) return { columns: 5, itemSize: 62 };
  if (itemCount <= 25) return { columns: 5, itemSize: 50 };
  return { columns: 6, itemSize: 50 };
};

export const selectMonthlyShareItems = <T>(items: T[]): T[] =>
  items.slice(0, MAX_SHARE_ITEM_COUNT);
