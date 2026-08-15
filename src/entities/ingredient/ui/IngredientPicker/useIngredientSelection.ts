import { useState } from "react";

import type { IngredientItem } from "@/entities/ingredient/model/types";

export type IngredientSelectionItem = {
  id: string;
  name: string;
  imageUrl?: string;
};

export const useIngredientSelection = <
  T extends IngredientSelectionItem = IngredientItem,
>() => {
  const [selected, setSelected] = useState<Map<string, T>>(new Map());

  const toggle = (ingredient: T) => {
    setSelected((previous) => {
      const next = new Map(previous);
      if (next.has(ingredient.id)) {
        next.delete(ingredient.id);
      } else {
        next.set(ingredient.id, ingredient);
      }
      return next;
    });
  };

  const remove = (id: string) => {
    setSelected((previous) => {
      if (!previous.has(id)) return previous;
      const next = new Map(previous);
      next.delete(id);
      return next;
    });
  };

  const clear = () => setSelected(new Map());

  return {
    selectedItems: Array.from(selected.values()),
    selectedIds: new Set(selected.keys()),
    isSelected: (id: string) => selected.has(id),
    count: selected.size,
    toggle,
    remove,
    clear,
  };
};
