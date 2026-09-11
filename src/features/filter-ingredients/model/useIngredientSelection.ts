"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

type SelectedIngredient = {
  id: string;
  name: string;
};

export const useIngredientSelection = (
  initialSelectedIds: string[] = [],
  ingredientNames: SelectedIngredient[] = []
) => {
  const [selected, setSelected] = useState<SelectedIngredient[]>(() =>
    initialSelectedIds.map((id) => ({ id, name: "" }))
  );

  const namesById = new Map(ingredientNames.map(({ id, name }) => [id, name]));
  const selectedWithNames = selected.map((item) => ({
    ...item,
    name: namesById.get(item.id) ?? item.name,
  }));

  const toggle = (id: string, name: string) => {
    triggerHaptic("Light");
    setSelected((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      }
      return [...prev, { id, name }];
    });
  };

  const remove = (id: string) => {
    triggerHaptic("Light");
    setSelected((prev) => prev.filter((item) => item.id !== id));
  };

  const reset = () => {
    triggerHaptic("Light");
    setSelected([]);
  };

  const selectedIds = selected.map((item) => item.id);
  const isSelected = (id: string) => selected.some((item) => item.id === id);

  return {
    selected: selectedWithNames,
    selectedIds,
    isSelected,
    toggle,
    remove,
    reset,
  };
};
