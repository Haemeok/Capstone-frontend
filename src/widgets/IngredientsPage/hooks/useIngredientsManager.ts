import { useState } from "react";

import type { IngredientCategoryName } from "@/shared/config/constants/recipe";

import type { IngredientItem } from "@/entities/ingredient";

type SelectableIngredient = Pick<IngredientItem, "id" | "name">;

type IngredientSelection = {
  ids: Set<string>;
  namesById: Map<string, string>;
};

const emptySelection = (): IngredientSelection => ({
  ids: new Set(),
  namesById: new Map(),
});

export const useIngredientsManager = () => {
  const [mode, setMode] = useState<"view" | "manage">("view");
  const [selectedCategory, setSelectedCategory] =
    useState<IngredientCategoryName>("전체");
  const [selection, setSelection] =
    useState<IngredientSelection>(emptySelection);

  const enterManageMode = () => setMode("manage");

  const exitManageMode = () => {
    setMode("view");
    setSelection(emptySelection());
  };

  const toggleIngredient = ({ id, name }: SelectableIngredient) => {
    setSelection((previous) => {
      const ids = new Set(previous.ids);
      const namesById = new Map(previous.namesById);
      if (ids.has(id)) {
        ids.delete(id);
        namesById.delete(id);
      } else {
        ids.add(id);
        namesById.set(id, name);
      }
      return { ids, namesById };
    });
  };

  const toggleAll = (visibleIngredients: SelectableIngredient[]) => {
    setSelection((previous) => {
      const ids = new Set(previous.ids);
      const namesById = new Map(previous.namesById);
      const areAllVisibleSelected = visibleIngredients.every(({ id }) =>
        ids.has(id)
      );

      visibleIngredients.forEach(({ id, name }) => {
        if (areAllVisibleSelected) {
          ids.delete(id);
          namesById.delete(id);
        } else {
          ids.add(id);
          namesById.set(id, name);
        }
      });
      return { ids, namesById };
    });
  };

  const selectedIngredientNames = Array.from(selection.ids).flatMap((id) => {
    const name = selection.namesById.get(id);
    return name ? [name] : [];
  });

  return {
    mode,
    selectedCategory,
    selectedIngredientIds: selection.ids,
    selectedIngredientNames,
    setSelectedCategory,
    enterManageMode,
    exitManageMode,
    toggleIngredient,
    toggleAll,
  };
};
