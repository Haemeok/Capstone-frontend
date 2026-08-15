"use client";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import { format, localizePack, useIngredientAddDict } from "@/shared/i18n";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

type IngredientPackCardProps = {
  pack: IngredientPack;
  ownedIngredientIds: Set<string>;
  onViewDetail: (pack: IngredientPack) => void;
};

export const IngredientPackCard = ({
  pack,
  ownedIngredientIds,
  onViewDetail,
}: IngredientPackCardProps) => {
  const dict = useIngredientAddDict();
  const locale = useChromeLocale();
  const meta = localizePack(pack, locale);
  const allOwned = pack.ingredients.every((ingredient) =>
    ownedIngredientIds.has(ingredient.id)
  );

  const handleViewDetail = () => {
    triggerHaptic("Light");
    onViewDetail(pack);
  };

  return (
    <button
      type="button"
      onClick={handleViewDetail}
      aria-label={format(dict.cardDetailAria, { name: meta.name })}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 py-3 text-left last:border-b-0"
    >
      <Image
        src={pack.ingredients[0].imageUrl}
        alt=""
        wrapperClassName="h-16 w-16 flex-none rounded-card bg-gray-100"
        fit="cover"
      />
      <span className="min-w-0 flex-1">
        <span className="text-ink block truncate text-sm font-semibold">
          {meta.name}
        </span>
        <span className="text-ink-muted mt-1 line-clamp-1 block text-xs">
          {meta.description}
        </span>
        <span className="text-ink-muted mt-1.5 block text-xs">
          {allOwned
            ? dict.cardOwned
            : format(dict.cardCount, { count: pack.ingredients.length })}
        </span>
      </span>
    </button>
  );
};
