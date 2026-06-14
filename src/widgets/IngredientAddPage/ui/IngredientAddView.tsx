"use client";

import { useState } from "react";

import { Search } from "lucide-react";

import {
  INGREDIENT_PACKS,
  type IngredientPack,
} from "@/shared/config/constants/ingredientPacks";
import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { useIngredientAddDict } from "@/shared/i18n";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useMyIngredientIds } from "@/entities/ingredient";
import { IngredientPicker } from "@/entities/ingredient/ui/IngredientPicker";

import { useAddIngredientBulkMutation } from "@/features/ingredient-add-fridge";
import IngredientPackDetailDrawer from "@/features/ingredient-add-fridge/ui/IngredientPackDetailDrawer";
import IngredientSearchDrawer from "@/features/ingredient-add-fridge/ui/IngredientSearchDrawer";
import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge";

import IngredientPackCard from "@/widgets/IngredientPackCard/IngredientPackCard";

export const IngredientAddView = () => {
  const dict = useIngredientAddDict();
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<IngredientPack | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { ingredientIdsSet } = useMyIngredientIds();
  const { mutate: addIngredientBulk, isPending: isAdding } =
    useAddIngredientBulkMutation();
  const { mutate: deleteIngredientBulk, isPending: isDeleting } =
    useDeleteIngredientBulkMutation();

  const isPending = isAdding || isDeleting;

  const handlePackViewDetail = (pack: IngredientPack) => {
    setSelectedPack(pack);
    setIsDetailDrawerOpen(true);
  };

  const handlePackAddSelected = (ingredientIds: string[]) => {
    addIngredientBulk(ingredientIds);
  };

  const handlePackDeleteSelected = (ingredientIds: string[]) => {
    deleteIngredientBulk(ingredientIds);
  };

  return (
    <Container padding={false}>
      <div className="bg-white pb-10">
        <header className="z-sticky sticky-optimized sticky top-0 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-gray-100 bg-white px-4 py-3 md:px-6">
          <PrevButton />
          <h1 className="text-ink text-center text-base font-semibold">
            {dict.pageTitle}
          </h1>
          <span className="w-9" aria-hidden="true" />
        </header>

        <div className="px-4 pt-4 pb-2 md:px-6">
          <button
            type="button"
            onClick={() => setIsSearchDrawerOpen(true)}
            aria-label={dict.searchEntryAria}
            className="flex w-full items-center gap-3 rounded-full bg-gray-100 px-4 py-3.5 text-left transition-colors active:bg-gray-200"
          >
            <Search size={18} className="text-ink-muted" aria-hidden="true" />
            <span className="text-ink-muted text-sm">{dict.searchEntry}</span>
          </button>
        </div>

        <div className="px-4 pt-6 md:px-6">
          <div className="mb-3">
            <h2 className="text-ink text-base font-bold">
              {dict.packsHeading}
            </h2>
            <p className="text-ink-muted mt-1 text-sm">{dict.packsSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-5 lg:grid-cols-3">
            {INGREDIENT_PACKS.map((pack) => (
              <IngredientPackCard
                key={pack.name + pack.description}
                pack={pack}
                onViewDetail={handlePackViewDetail}
                ownedIngredientIds={ingredientIdsSet}
              />
            ))}
          </div>
        </div>
      </div>

      {isMobile ? (
        <IngredientPicker
          open={isSearchDrawerOpen}
          onOpenChange={setIsSearchDrawerOpen}
          categories={INGREDIENT_CATEGORIES}
          queryConfig={{
            keyBase: "fridgeIngredients",
            getParams: (category) => ({
              category: category === "전체" ? null : category,
              isMine: false,
              isFridge: true,
            }),
          }}
          isAlreadyAdded={(ingredient) => ingredient.inFridge}
          onComplete={(items) => addIngredientBulk(items.map((i) => i.id))}
        />
      ) : (
        <IngredientSearchDrawer
          open={isSearchDrawerOpen}
          onOpenChange={setIsSearchDrawerOpen}
        />
      )}

      <IngredientPackDetailDrawer
        pack={selectedPack}
        open={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
        onAddSelected={handlePackAddSelected}
        onDeleteSelected={handlePackDeleteSelected}
        isLoading={isPending}
        ownedIngredientIds={ingredientIdsSet}
      />
    </Container>
  );
};
