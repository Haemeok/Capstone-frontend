import { create } from "zustand";

const STORAGE_KEY = "curation-test:dead-slugs";

const loadFromStorage = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
};

const saveToStorage = (set: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // localStorage 쿼터/접근 거부 등은 무시 — 다음 세션엔 안 살아남아도 OK
  }
};

type State = {
  slugs: Set<string>;
  add: (slug: string) => void;
};

export const useDeadSlugStore = create<State>((set, get) => ({
  slugs: loadFromStorage(),
  add: (slug) => {
    const current = get().slugs;
    if (current.has(slug)) return;
    const next = new Set(current);
    next.add(slug);
    saveToStorage(next);
    set({ slugs: next });
  },
}));
