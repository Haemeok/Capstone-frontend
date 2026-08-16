"use client";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import { format, localizePack, useIngredientAddDict } from "@/shared/i18n";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

type IngredientPackCardProps = {
  pack: IngredientPack;
  ownedIngredientIds: Set<string>;
  isPending: boolean;
  onViewDetail: (pack: IngredientPack) => void;
};

export const IngredientPackCard = ({
  pack,
  ownedIngredientIds,
  isPending,
  onViewDetail,
}: IngredientPackCardProps) => {
  const dict = useIngredientAddDict();
  const locale = useChromeLocale();
  const meta = localizePack(pack, locale);
  const allOwned = pack.ingredients.every((ingredient) =>
    ownedIngredientIds.has(ingredient.id)
  );
  const previewIngredients = pack.ingredients.slice(0, 4);

  const handleViewDetail = () => {
    if (isPending) return;
    triggerHaptic("Light");
    onViewDetail(pack);
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleViewDetail}
      aria-label={format(dict.cardDetailAria, { name: meta.name })}
      className="focus-visible:outline-olive-light min-h-11 w-56 flex-none cursor-pointer rounded-xl bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-gray-50 disabled:active:bg-gray-50"
    >
      <span className="grid grid-cols-4 gap-1" aria-hidden="true">
        {previewIngredients.map((ingredient) => (
          <Image
            key={ingredient.id}
            src={ingredient.imageUrl}
            alt=""
            wrapperClassName="w-full rounded-lg bg-gray-100"
            fit="cover"
          />
        ))}
      </span>
      <span className="text-ink mt-2.5 block truncate text-sm font-semibold">
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
    </button>
  );
};
