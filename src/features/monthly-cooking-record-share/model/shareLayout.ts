const MAX_SHARE_ITEM_COUNT = 30;

export type MonthlyShareLayout = {
  columns: 1 | 2 | 3 | 4 | 5;
  density: "hero" | "spacious" | "regular" | "compact" | "dense";
};

export const getMonthlyShareLayout = (
  itemCount: number
): MonthlyShareLayout => {
  if (itemCount <= 1) return { columns: 1, density: "hero" };
  if (itemCount === 2) return { columns: 2, density: "spacious" };
  if (itemCount === 3) return { columns: 3, density: "regular" };
  if (itemCount === 4) return { columns: 2, density: "regular" };
  if (itemCount <= 9) return { columns: 3, density: "regular" };
  if (itemCount <= 20) return { columns: 4, density: "compact" };
  return { columns: 5, density: "dense" };
};

export const selectMonthlyShareItems = <T>(items: T[]): T[] =>
  items.slice(0, MAX_SHARE_ITEM_COUNT);
