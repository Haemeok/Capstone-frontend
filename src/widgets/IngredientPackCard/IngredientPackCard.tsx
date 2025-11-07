"use client";

import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";

type IngredientPackCardProps = {
  pack: IngredientPack;
  onViewDetail: (pack: IngredientPack) => void;
  onAddAll: (ingredientIds: number[]) => void;
  isLoading?: boolean;
};

const IngredientPackCard = ({
  pack,
  onViewDetail,
  onAddAll,
  isLoading = false,
}: IngredientPackCardProps) => {
  const previewImages = pack.ingredients.slice(0, 4);
  const ingredientIds = pack.ingredients.map((ingredient) => ingredient.id);

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-800">{pack.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{pack.description}</p>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {previewImages.map((ingredient) => (
          <div
            key={ingredient.id}
            className="aspect-square overflow-hidden rounded-lg bg-gray-100"
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

      <p className="mb-3 text-center text-sm text-gray-600">
        {pack.ingredients.length}개 재료 포함
      </p>

      <div className="mt-auto flex gap-2">
        <Button
          onClick={() => onViewDetail(pack)}
          disabled={isLoading}
          variant="outline"
          className="flex-1 border-olive-light text-olive-light hover:bg-olive-mint/10"
        >
          상세보기
        </Button>
        <Button
          onClick={() => onAddAll(ingredientIds)}
          disabled={isLoading}
          className="flex-1 bg-olive-light text-white hover:bg-olive-dark disabled:bg-gray-300"
        >
          {isLoading ? "추가 중..." : "바로추가"}
        </Button>
      </div>
    </div>
  );
};

export default IngredientPackCard;
