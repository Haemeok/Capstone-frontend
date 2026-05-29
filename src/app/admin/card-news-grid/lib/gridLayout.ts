// src/app/admin/card-news-grid/lib/gridLayout.ts
export const GRID_COUNT = 9;

const STEPS = ["0%", "50%", "100%"] as const;

export const gridCellPosition = (index: number): string => {
  if (!Number.isInteger(index) || index < 0 || index >= GRID_COUNT) {
    throw new Error(`gridCellPosition: index out of range (${index})`);
  }
  const col = index % 3;
  const row = Math.floor(index / 3);
  return `${STEPS[col]} ${STEPS[row]}`;
};
