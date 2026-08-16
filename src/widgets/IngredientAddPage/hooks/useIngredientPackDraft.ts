"use client";

import { useState } from "react";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";

export const useIngredientPackDraft = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const initialize = (pack: IngredientPack) => {
    setSelectedIds(
      new Set(pack.ingredients.map((ingredient) => ingredient.id))
    );
  };

  const toggle = (id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const remove = (id: string) => {
    setSelectedIds((previous) => {
      if (!previous.has(id)) return previous;
      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  };

  const clear = () => setSelectedIds(new Set());

  return {
    selectedIds,
    isSelected: (id: string) => selectedIds.has(id),
    initialize,
    toggle,
    remove,
    clear,
  };
};
