// src/app/admin/card-news-grid/lib/gridLayout.test.ts
import { GRID_COUNT, gridCellPosition } from "./gridLayout";

describe("gridCellPosition", () => {
  it("GRID_COUNT는 9", () => {
    expect(GRID_COUNT).toBe(9);
  });

  it.each([
    [0, "0% 0%"],
    [1, "50% 0%"],
    [2, "100% 0%"],
    [3, "0% 50%"],
    [4, "50% 50%"],
    [5, "100% 50%"],
    [6, "0% 100%"],
    [7, "50% 100%"],
    [8, "100% 100%"],
  ])("index %i → %s", (index, expected) => {
    expect(gridCellPosition(index)).toBe(expected);
  });

  it("범위 밖 인덱스는 throw", () => {
    expect(() => gridCellPosition(9)).toThrow();
    expect(() => gridCellPosition(-1)).toThrow();
  });
});
