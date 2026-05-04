import { create } from "zustand";

export type BatchItemStatus =
  | "idle"
  | "generating"
  | "publishing"
  | "done"
  | "error";

export type BatchItemState = {
  status: BatchItemStatus;
  error?: string;
  articleId?: number;
};

type State = {
  items: Record<string, BatchItemState>;
  setStatus: (key: string, status: BatchItemStatus) => void;
  setError: (key: string, error: string) => void;
  setDone: (key: string, articleId: number) => void;
  reset: (key?: string) => void;
};

export const useBatchPublishStore = create<State>((set) => ({
  items: {},
  setStatus: (key, status) =>
    set((s) => ({
      items: { ...s.items, [key]: { ...s.items[key], status } },
    })),
  setError: (key, error) =>
    set((s) => ({
      items: { ...s.items, [key]: { ...s.items[key], status: "error", error } },
    })),
  setDone: (key, articleId) =>
    set((s) => ({
      items: {
        ...s.items,
        [key]: { ...s.items[key], status: "done", articleId },
      },
    })),
  reset: (key) =>
    set((s) => {
      if (!key) return { items: {} };
      const next = { ...s.items };
      delete next[key];
      return { items: next };
    }),
}));
