import { useState } from "react";

import type { IngredientItem } from "@/entities/ingredient";

export const useIngredientSelection = () => {
  const [selected, setSelected] = useState<Map<string, IngredientItem>>(
    new Map()
  );

  const toggle = (ingredient: IngredientItem) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(ingredient.id)) {
        next.delete(ingredient.id);
      } else {
        next.set(ingredient.id, ingredient);
      }
      return next;
    });
  };

  const remove = (id: string) => {
    setSelected((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const clear = () => setSelected(new Map());

  return {
    selectedItems: [...selected.values()],
    isSelected: (id: string) => selected.has(id),
    count: selected.size,
    toggle,
    remove,
    clear,
  };
};
