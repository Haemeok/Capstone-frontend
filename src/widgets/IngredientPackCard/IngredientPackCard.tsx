"use client";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import { Image } from "@/shared/ui/image/Image";

type IngredientPackCardProps = {
  pack: IngredientPack;
  onViewDetail: (pack: IngredientPack) => void;
  ownedIngredientIds: Set<string>;
};

const IngredientPackCard = ({
  pack,
  onViewDetail,
  ownedIngredientIds,
}: IngredientPackCardProps) => {
  const previewImages = pack.ingredients.slice(0, 4);
  const allOwned = pack.ingredients.every((ingredient) =>
    ownedIngredientIds.has(ingredient.id)
  );

  return (
    <button
      type="button"
      onClick={() => onViewDetail(pack)}
      aria-label={`${pack.name} 상세 보기`}
      className="group flex w-full cursor-pointer flex-col text-left transition-opacity active:opacity-90"
    >
      <div className="grid grid-cols-2 gap-1.5">
        {previewImages.map((ingredient) => (
          <div
            key={ingredient.id}
            className="aspect-square overflow-hidden rounded-lg bg-gray-50"
          >
            <Image
              src={ingredient.imageUrl}
              alt={ingredient.name}
              wrapperClassName="h-full w-full"
              fit="cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-3 px-0.5">
        <div className="flex items-start gap-2">
          <h3 className="text-ink line-clamp-1 flex-1 text-sm leading-snug font-semibold">
            {pack.name}
          </h3>
          {allOwned && (
            <span className="text-ink-sub flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium">
              보유 중
            </span>
          )}
        </div>
        <p className="text-ink-muted mt-1 line-clamp-1 text-xs leading-5">
          {pack.description}
        </p>
        <p className="mt-1.5 text-xs text-gray-400">
          재료 {pack.ingredients.length}개
        </p>
      </div>
    </button>
  );
};

export default IngredientPackCard;
