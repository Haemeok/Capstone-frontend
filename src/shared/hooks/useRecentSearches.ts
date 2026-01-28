"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "recent-searches";
const MAX_ITEMS = 10;

let cachedSearches: string[] | null = null;

export const useRecentSearches = () => {
  const [searches, setSearches] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (cachedSearches !== null) {
      setSearches(cachedSearches);
      setIsLoaded(true);
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      cachedSearches = parsed;
      setSearches(parsed);
    } catch {
      cachedSearches = [];
      setSearches([]);
    }
    setIsLoaded(true);
  }, []);

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== trimmed.toLowerCase()
      );
      const newSearches = [trimmed, ...filtered].slice(0, MAX_ITEMS);

      cachedSearches = newSearches;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      } catch {
        // ignore
      }

      return newSearches;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setSearches((prev) => {
      const newSearches = prev.filter((s) => s !== query);

      cachedSearches = newSearches;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      } catch {
        // ignore
      }

      return newSearches;
    });
  }, []);

  const clearAll = useCallback(() => {
    cachedSearches = [];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
    setSearches([]);
  }, []);

  return {
    searches,
    isLoaded,
    addSearch,
    removeSearch,
    clearAll,
  };
};
