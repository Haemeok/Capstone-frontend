// src/app/admin/video-studio/lib/costStorage.ts
//
// Aggregated cost history for the video-studio admin page (image + video stages).
// Persisted in localStorage; SSR-safe via the typeof-window guard.
// Numbers are estimates fed by lib/videoPricing.ts and the catalog
// in @/app/admin/image-quality-test/lib/models.ts — they are not authoritative
// billing.

export type StageCostEntry = { count: number; totalCost: number };

export type CostHistory = {
  image: StageCostEntry;
  video: StageCostEntry;
  // Per-model breakdown across both stages, keyed by an arbitrary model id
  // (e.g. "gpt-image-2-medium" or "dreamina-seedance-2-0-fast-260128").
  byModel: Record<string, StageCostEntry>;
  totalCount: number;
  totalCost: number;
  updatedAt: number;
};

const STORAGE_KEY = "video-studio:cost-history:v1";

const cloneEmpty = (): CostHistory => ({
  image: { count: 0, totalCost: 0 },
  video: { count: 0, totalCost: 0 },
  byModel: {},
  totalCount: 0,
  totalCost: 0,
  updatedAt: 0,
});

const safeParse = (raw: string | null): CostHistory => {
  if (!raw) return cloneEmpty();
  try {
    const parsed = JSON.parse(raw) as Partial<CostHistory>;
    if (
      !parsed ||
      typeof parsed.totalCount !== "number" ||
      typeof parsed.totalCost !== "number" ||
      !parsed.image ||
      !parsed.video ||
      !parsed.byModel
    ) {
      return cloneEmpty();
    }
    return parsed as CostHistory;
  } catch {
    return cloneEmpty();
  }
};

export const loadCostHistory = (): CostHistory => {
  if (typeof window === "undefined") return cloneEmpty();
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

const persist = (next: CostHistory): CostHistory => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
};

const bumpModel = (
  byModel: Record<string, StageCostEntry>,
  modelId: string,
  cost: number
): Record<string, StageCostEntry> => {
  const prev = byModel[modelId] ?? { count: 0, totalCost: 0 };
  return {
    ...byModel,
    [modelId]: { count: prev.count + 1, totalCost: prev.totalCost + cost },
  };
};

export const addImageGen = (modelId: string, cost: number): CostHistory => {
  const current = loadCostHistory();
  const next: CostHistory = {
    ...current,
    image: {
      count: current.image.count + 1,
      totalCost: current.image.totalCost + cost,
    },
    byModel: bumpModel(current.byModel, modelId, cost),
    totalCount: current.totalCount + 1,
    totalCost: current.totalCost + cost,
    updatedAt: Date.now(),
  };
  return persist(next);
};

export const addVideoGen = (modelId: string, cost: number): CostHistory => {
  const current = loadCostHistory();
  const next: CostHistory = {
    ...current,
    video: {
      count: current.video.count + 1,
      totalCost: current.video.totalCost + cost,
    },
    byModel: bumpModel(current.byModel, modelId, cost),
    totalCount: current.totalCount + 1,
    totalCost: current.totalCost + cost,
    updatedAt: Date.now(),
  };
  return persist(next);
};

export const resetCostHistory = (): CostHistory => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return cloneEmpty();
};
