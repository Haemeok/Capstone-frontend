"use client";

import { useIngredientAddDict } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useMyIngredientIds } from "@/entities/ingredient";
import { useAuthGate } from "@/entities/user";

import { useIngredientAddFlow } from "../hooks/useIngredientAddFlow";
import { IngredientAddCatalog } from "./IngredientAddCatalog";
import { IngredientAddSelectionBar } from "./IngredientAddSelectionBar";
import { IngredientPackSelectionDrawer } from "./IngredientPackSelectionDrawer";

export const IngredientAddView = () => {
  const dict = useIngredientAddDict();
  const authGate = useAuthGate();
  const ownershipQuery = useMyIngredientIds({ enabled: authGate });
  const isOwnershipReady = ownershipQuery.data !== undefined;
  const isOwnershipPending = ownershipQuery.isPending && !isOwnershipReady;
  const hasOwnershipError = ownershipQuery.isError && !isOwnershipReady;
  const flow = useIngredientAddFlow({
    ownedIngredientIds: ownershipQuery.ingredientIdsSet,
    isOwnershipReady,
  });

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
        ownedIngredientIds={ownershipQuery.ingredientIdsSet}
        isPending={flow.isPending}
        isOwnershipReady={isOwnershipReady}
        isOwnershipPending={isOwnershipPending}
        hasOwnershipError={hasOwnershipError}
        isSelected={flow.isDirectSelected}
        onToggle={flow.handleDirectSelectionToggle}
        onViewPack={flow.handlePackOpen}
      />

      <IngredientPackSelectionDrawer
        pack={flow.selectedPack}
        ownedIngredientIds={ownershipQuery.ingredientIdsSet}
        selectedIds={flow.packSelectedIds}
        isPending={flow.isPending}
        onToggle={flow.handlePackToggle}
        onOpenChange={flow.handlePackOpenChange}
        footer={
          <IngredientAddSelectionBar
            items={flow.packSelectedItems}
            isPending={flow.isPending}
            errorMessage={flow.error ? dict.addError : undefined}
            onRemove={flow.handlePackRemove}
            onSubmit={flow.handlePackSubmit}
            placement="drawer"
          />
        }
      />

      {flow.selectedPack === null ? (
        <IngredientAddSelectionBar
          items={flow.directSelectedItems}
          isPending={flow.isPending}
          errorMessage={flow.error ? dict.addError : undefined}
          onRemove={flow.handleDirectSelectionRemove}
          onSubmit={flow.handleDirectSubmit}
        />
      ) : null}
    </Container>
  );
};
