"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "recent-searches";
const MAX_ITEMS = 10;
const EMPTY: string[] = [];

let cachedSearches: string[] | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

const setSearches = (next: string[]) => {
  cachedSearches = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): string[] => {
  if (cachedSearches === null) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      cachedSearches = stored ? JSON.parse(stored) : [];
    } catch {
      cachedSearches = [];
    }
  }
  return cachedSearches as string[];
};

export const useRecentSearches = () => {
  const searches = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const prev = getSnapshot();
    const filtered = prev.filter(
      (s) => s.toLowerCase() !== trimmed.toLowerCase()
    );
    setSearches([trimmed, ...filtered].slice(0, MAX_ITEMS));
  }, []);

  const removeSearch = useCallback((query: string) => {
    setSearches(getSnapshot().filter((s) => s !== query));
  }, []);

  const clearAll = useCallback(() => {
    setSearches([]);
  }, []);

  return {
    searches,
    addSearch,
    removeSearch,
    clearAll,
  };
};
