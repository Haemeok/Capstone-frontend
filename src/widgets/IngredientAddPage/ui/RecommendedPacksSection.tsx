"use client";

import {
  INGREDIENT_PACKS,
  type IngredientPack,
} from "@/shared/config/constants/ingredientPacks";
import { useIngredientAddDict } from "@/shared/i18n";

import { IngredientPackCard } from "./IngredientPackCard";

type RecommendedPacksSectionProps = {
  ownedIngredientIds: Set<string>;
  onViewPack: (pack: IngredientPack) => void;
};

export const RecommendedPacksSection = ({
  ownedIngredientIds,
  onViewPack,
}: RecommendedPacksSectionProps) => {
  const dict = useIngredientAddDict();

  return (
    <section
      aria-labelledby="ingredient-packs-heading"
      className="border-t-8 border-gray-50 px-4 py-6 md:px-6"
    >
      <h2
        id="ingredient-packs-heading"
        className="text-ink text-base font-bold"
      >
        {dict.packsHeading}
      </h2>
      <p className="text-ink-muted mt-1 text-sm">{dict.packsSubtitle}</p>
      <div className="mt-3">
        {INGREDIENT_PACKS.map((pack) => (
          <IngredientPackCard
            key={pack.name}
            pack={pack}
            ownedIngredientIds={ownedIngredientIds}
            onViewDetail={onViewPack}
          />
        ))}
      </div>
    </section>
  );
};
