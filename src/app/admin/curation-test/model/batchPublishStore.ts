import { create } from "zustand";

import type { GenerateCurationOutput } from "@/entities/curation";

export type BatchItemStatus =
  | "idle"
  | "generating"
  | "generated"
  | "publishing"
  | "done"
  | "error";

export type BatchItemState = {
  status: BatchItemStatus;
  error?: string;
  articleId?: string;
  result?: GenerateCurationOutput;
};

type State = {
  items: Record<string, BatchItemState>;
  setStatus: (key: string, status: BatchItemStatus) => void;
  setGenerated: (key: string, result: GenerateCurationOutput) => void;
  setError: (key: string, error: string) => void;
  setDone: (key: string, articleId: string) => void;
  reset: (key?: string) => void;
};

export const useBatchPublishStore = create<State>((set) => ({
  items: {},
  setStatus: (key, status) =>
    set((s) => ({
      items: { ...s.items, [key]: { ...s.items[key], status } },
    })),
  setGenerated: (key, result) =>
    set((s) => ({
      items: {
        ...s.items,
        [key]: {
          ...s.items[key],
          status: "generated",
          result,
          error: undefined,
        },
      },
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
