"use client";

import { useState, useCallback } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

type SelectedIngredient = {
  id: string;
  name: string;
};

export const useIngredientSelection = () => {
  const [selected, setSelected] = useState<SelectedIngredient[]>([]);

  const initFromIds = useCallback((ids: string[]) => {
    setSelected((prev) => {
      const existing = prev.filter((item) => ids.includes(item.id));
      const newIds = ids.filter((id) => !prev.some((item) => item.id === id));
      return [...existing, ...newIds.map((id) => ({ id, name: id }))];
    });
  }, []);

  const toggle = useCallback((id: string, name: string) => {
    triggerHaptic("Light");
    setSelected((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      }
      return [...prev, { id, name }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    triggerHaptic("Light");
    setSelected((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const reset = useCallback(() => {
    triggerHaptic("Light");
    setSelected([]);
  }, []);

  const selectedIds = selected.map((item) => item.id);
  const isSelected = useCallback(
    (id: string) => selected.some((item) => item.id === id),
    [selected]
  );

  return {
    selected,
    selectedIds,
    isSelected,
    toggle,
    remove,
    reset,
    initFromIds,
  };
};
