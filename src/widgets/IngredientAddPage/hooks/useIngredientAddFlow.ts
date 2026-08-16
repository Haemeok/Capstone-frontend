"use client";

import { useState } from "react";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import {
  type Locale,
  localizeIngredientName,
  useChromeLocale,
  useLocalizedRouter,
} from "@/shared/i18n";

import {
  type IngredientSelectionItem,
  useIngredientSelection,
} from "@/entities/ingredient/ui/IngredientPicker";

import { useAddIngredientBulkMutation } from "@/features/ingredient-add-fridge";

import { useIngredientPackDraft } from "./useIngredientPackDraft";

type UseIngredientAddFlowOptions = {
  ownedIngredientIds: Set<string>;
};

type PackSelectedItemsOptions = {
  pack: IngredientPack | null;
  selectedIds: Set<string>;
  ownedIngredientIds: Set<string>;
  locale: Locale;
};

const getPackSelectedItems = ({
  pack,
  selectedIds,
  ownedIngredientIds,
  locale,
}: PackSelectedItemsOptions): IngredientSelectionItem[] => {
  if (!pack) return [];
  return pack.ingredients.reduce<IngredientSelectionItem[]>(
    (items, ingredient) => {
      if (
        !selectedIds.has(ingredient.id) ||
        ownedIngredientIds.has(ingredient.id)
      ) {
        return items;
      }
      items.push({
        ...ingredient,
        name: localizeIngredientName(ingredient.id, ingredient.name, locale),
      });
      return items;
    },
    []
  );
};

export const useIngredientAddFlow = ({
  ownedIngredientIds,
}: UseIngredientAddFlowOptions) => {
  const router = useLocalizedRouter();
  const locale = useChromeLocale();
  const directSelection = useIngredientSelection<IngredientSelectionItem>();
  const packDraft = useIngredientPackDraft();
  const addMutation = useAddIngredientBulkMutation();
  const [selectedPack, setSelectedPack] = useState<IngredientPack | null>(null);
  const packSelectedItems = getPackSelectedItems({
    pack: selectedPack,
    selectedIds: packDraft.selectedIds,
    ownedIngredientIds,
    locale,
  });

  const handleDirectSelectionToggle = (ingredient: IngredientSelectionItem) => {
    if (addMutation.isError) addMutation.reset();
    directSelection.toggle(ingredient);
  };

  const handleDirectSelectionRemove = (id: string) => {
    if (!directSelection.isSelected(id)) return;
    if (addMutation.isError) addMutation.reset();
    directSelection.remove(id);
  };

  const handlePackOpen = (pack: IngredientPack) => {
    if (addMutation.isPending) return;
    if (addMutation.isError) addMutation.reset();
    packDraft.initialize(pack);
    setSelectedPack(pack);
  };

  const handlePackToggle = (id: string) => {
    if (addMutation.isPending) return;
    if (addMutation.isError) addMutation.reset();
    packDraft.toggle(id);
  };

  const handlePackRemove = (id: string) => {
    if (!packDraft.isSelected(id) || addMutation.isPending) return;
    if (addMutation.isError) addMutation.reset();
    packDraft.remove(id);
  };

  const handlePackOpenChange = (open: boolean) => {
    if (open || addMutation.isPending) return;
    if (addMutation.isError) addMutation.reset();
    setSelectedPack(null);
    packDraft.clear();
  };

  const submit = (items: IngredientSelectionItem[]) => {
    if (items.length === 0 || addMutation.isPending) return;
    if (addMutation.isError) addMutation.reset();
    addMutation.mutate(
      items.map((item) => item.id),
      { onSuccess: () => router.replace("/ingredients") }
    );
  };

  return {
    selectedPack,
    directSelectedItems: directSelection.selectedItems,
    isDirectSelected: directSelection.isSelected,
    packSelectedItems,
    packSelectedIds: packDraft.selectedIds,
    isPending: addMutation.isPending,
    error: addMutation.error,
    handleDirectSelectionToggle,
    handleDirectSelectionRemove,
    handlePackOpen,
    handlePackToggle,
    handlePackRemove,
    handlePackOpenChange,
    handleDirectSubmit: () => submit(directSelection.selectedItems),
    handlePackSubmit: () => submit(packSelectedItems),
  };
};
