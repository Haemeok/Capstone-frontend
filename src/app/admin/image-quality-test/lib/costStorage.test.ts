import { addGeneration, loadCostHistory, resetCostHistory } from "./costStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("costStorage", () => {
  it("returns empty history when storage is empty", () => {
    const h = loadCostHistory();
    expect(h.totalCount).toBe(0);
    expect(h.totalCost).toBe(0);
    expect(h.byModel).toEqual({});
  });

  it("accumulates cost and count across multiple generations", () => {
    addGeneration("seedream-v4", 0.03);
    addGeneration("seedream-v4", 0.03);
    addGeneration("flux-2-schnell", 0.015);

    const h = loadCostHistory();
    expect(h.totalCount).toBe(3);
    expect(h.totalCost).toBeCloseTo(0.075, 5);
    expect(h.byModel["seedream-v4"]).toEqual({ count: 2, totalCost: 0.06 });
    expect(h.byModel["flux-2-schnell"]).toEqual({ count: 1, totalCost: 0.015 });
  });

  it("resetCostHistory clears all entries", () => {
    addGeneration("gpt-image-1-mini-low", 0.005);
    resetCostHistory();
    const h = loadCostHistory();
    expect(h.totalCount).toBe(0);
  });
});
