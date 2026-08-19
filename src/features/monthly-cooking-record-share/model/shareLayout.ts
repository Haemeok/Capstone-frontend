const MAX_SHARE_ITEM_COUNT = 30;

export type MonthlyShareLayout = {
  columns: 1 | 2 | 3 | 4 | 5;
  density:
    | "hero"
    | "spacious"
    | "regular"
    | "roomy"
    | "compact"
    | "dense"
    | "packed"
    | "maximum";
  flow: "grid" | "centered-wrap";
};

export const getMonthlyShareLayout = (
  itemCount: number
): MonthlyShareLayout => {
  if (itemCount <= 1) return { columns: 1, density: "hero", flow: "grid" };
  if (itemCount === 2) return { columns: 2, density: "spacious", flow: "grid" };
  if (itemCount === 3) return { columns: 3, density: "regular", flow: "grid" };
  if (itemCount === 4) return { columns: 2, density: "regular", flow: "grid" };
  if (itemCount <= 9) return { columns: 3, density: "regular", flow: "grid" };
  if (itemCount <= 12)
    return { columns: 4, density: "roomy", flow: "centered-wrap" };
  if (itemCount <= 16)
    return { columns: 4, density: "compact", flow: "centered-wrap" };
  if (itemCount <= 20)
    return { columns: 4, density: "dense", flow: "centered-wrap" };
  if (itemCount <= 25)
    return { columns: 5, density: "packed", flow: "centered-wrap" };
  return { columns: 5, density: "maximum", flow: "centered-wrap" };
};

export const selectMonthlyShareItems = <T>(items: T[]): T[] =>
  items.slice(0, MAX_SHARE_ITEM_COUNT);
