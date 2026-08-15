"use client";

import { useState } from "react";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import { useIngredientAddDict, useLocalizedRouter } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useMyIngredientIds } from "@/entities/ingredient";
import {
  type IngredientSelectionItem,
  useIngredientSelection,
} from "@/entities/ingredient/ui/IngredientPicker";
import { useAuthGate } from "@/entities/user";

import { useAddIngredientBulkMutation } from "@/features/ingredient-add-fridge";

import { IngredientAddCatalog } from "./IngredientAddCatalog";
import { IngredientAddSelectionBar } from "./IngredientAddSelectionBar";
import { IngredientPackSelectionDrawer } from "./IngredientPackSelectionDrawer";

export const IngredientAddView = () => {
  const dict = useIngredientAddDict();
  const router = useLocalizedRouter();
  const authGate = useAuthGate();
  const { ingredientIdsSet } = useMyIngredientIds({ enabled: authGate });
  const selection = useIngredientSelection<IngredientSelectionItem>();
  const addMutation = useAddIngredientBulkMutation();
  const [selectedPack, setSelectedPack] = useState<IngredientPack | null>(null);

  const handleSubmit = () => {
    if (selection.selectedItems.length === 0 || addMutation.isPending) return;
    addMutation.mutate(
      selection.selectedItems.map((item) => item.id),
      { onSuccess: () => router.replace("/ingredients") }
    );
  };

  return (
    <Container padding={false} className="min-h-screen pb-40">
      <header className="z-sticky sticky-optimized sticky top-0 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-gray-100 bg-white px-4 py-3 md:px-6">
        <PrevButton />
        <h1 className="text-ink text-center text-base font-semibold">
          {dict.pageTitle}
        </h1>
        <span className="w-9" aria-hidden="true" />
      </header>

      <IngredientAddCatalog
        ownedIngredientIds={ingredientIdsSet}
        isSelected={selection.isSelected}
        onToggle={selection.toggle}
        onViewPack={setSelectedPack}
      />

      <IngredientPackSelectionDrawer
        pack={selectedPack}
        ownedIngredientIds={ingredientIdsSet}
        selectedIds={selection.selectedIds}
        onToggle={selection.toggle}
        onOpenChange={(open) => {
          if (!open) setSelectedPack(null);
        }}
        footer={
          <IngredientAddSelectionBar
            items={selection.selectedItems}
            isPending={addMutation.isPending}
            onRemove={selection.remove}
            onSubmit={handleSubmit}
            placement="drawer"
          />
        }
      />

      {selectedPack === null ? (
        <IngredientAddSelectionBar
          items={selection.selectedItems}
          isPending={addMutation.isPending}
          onRemove={selection.remove}
          onSubmit={handleSubmit}
        />
      ) : null}
    </Container>
  );
};
