"use client";

import { useState } from "react";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import { useLocalizedRouter } from "@/shared/i18n";

import {
  type IngredientSelectionItem,
  useIngredientSelection,
} from "@/entities/ingredient/ui/IngredientPicker";

import { useAddIngredientBulkMutation } from "@/features/ingredient-add-fridge";

export const useIngredientAddFlow = () => {
  const router = useLocalizedRouter();
  const selection = useIngredientSelection<IngredientSelectionItem>();
  const addMutation = useAddIngredientBulkMutation();
  const [selectedPack, setSelectedPack] = useState<IngredientPack | null>(null);

  const handleSelectionToggle = (ingredient: IngredientSelectionItem) => {
    if (addMutation.isError) addMutation.reset();
    selection.toggle(ingredient);
  };

  const handleSelectionRemove = (id: string) => {
    if (!selection.isSelected(id)) return;
    if (addMutation.isError) addMutation.reset();
    selection.remove(id);
  };

  const handlePackOpenChange = (open: boolean) => {
    if (open) return;
    if (addMutation.isError) addMutation.reset();
    setSelectedPack(null);
  };

  const handleSubmit = () => {
    if (selection.selectedItems.length === 0 || addMutation.isPending) return;
    addMutation.mutate(
      selection.selectedItems.map((item) => item.id),
      { onSuccess: () => router.replace("/ingredients") }
    );
  };

  return {
    selectedPack,
    setSelectedPack,
    selectedItems: selection.selectedItems,
    selectedIds: selection.selectedIds,
    isSelected: selection.isSelected,
    isPending: addMutation.isPending,
    error: addMutation.error,
    handleSelectionToggle,
    handleSelectionRemove,
    handlePackOpenChange,
    handleSubmit,
  };
};
