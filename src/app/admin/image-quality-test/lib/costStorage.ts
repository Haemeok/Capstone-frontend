export type ModelCostEntry = { count: number; totalCost: number };
export type CostHistory = {
  byModel: Record<string, ModelCostEntry>;
  totalCount: number;
  totalCost: number;
};

const STORAGE_KEY = "admin-image-test.cost-history";
const EMPTY: CostHistory = { byModel: {}, totalCount: 0, totalCost: 0 };

const safeParse = (raw: string | null): CostHistory => {
  if (!raw) return { ...EMPTY };
  try {
    const parsed = JSON.parse(raw) as CostHistory;
    if (typeof parsed?.totalCount !== "number") return { ...EMPTY };
    return parsed;
  } catch {
    return { ...EMPTY };
  }
};

export const loadCostHistory = (): CostHistory => {
  if (typeof window === "undefined") return { ...EMPTY };
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const addGeneration = (modelId: string, cost: number): CostHistory => {
  const current = loadCostHistory();
  const prev = current.byModel[modelId] ?? { count: 0, totalCost: 0 };
  const next: CostHistory = {
    byModel: {
      ...current.byModel,
      [modelId]: { count: prev.count + 1, totalCost: prev.totalCost + cost },
    },
    totalCount: current.totalCount + 1,
    totalCost: current.totalCost + cost,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const resetCostHistory = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};
