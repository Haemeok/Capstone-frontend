"use client";

import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";

import { useAddIngredientBulkMutation } from "@/features/ingredient-add-fridge/model/hooks";
import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge/model/hooks";

type IngredientPackCardProps = {
  pack: IngredientPack;
  onViewDetail: (pack: IngredientPack) => void;
  ownedIngredientIds: Set<number>;
};

const IngredientPackCard = ({
  pack,
  onViewDetail,
  ownedIngredientIds,
}: IngredientPackCardProps) => {
  const { mutate: addIngredientBulk, isPending: isAdding } =
    useAddIngredientBulkMutation();
  const { mutate: deleteIngredientBulk, isPending: isDeleting } =
    useDeleteIngredientBulkMutation();

  const isLoading = isAdding || isDeleting;
  const previewImages = pack.ingredients.slice(0, 4);
  const ingredientIds = pack.ingredients.map((ingredient) => ingredient.id);
  const allOwned = pack.ingredients.every((ingredient) =>
    ownedIngredientIds.has(ingredient.id)
  );

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
          className="flex-1 border-olive-light text-olive-light hover:bg-olive-mint/10 cursor-pointer disabled:cursor-not-allowed"
        >
          상세보기
        </Button>
        {allOwned ? (
          <Button
            onClick={() => deleteIngredientBulk(ingredientIds)}
            disabled={isLoading}
            className="flex-1 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? "삭제 중..." : "전체 삭제"}
          </Button>
        ) : (
          <Button
            onClick={() => addIngredientBulk(ingredientIds)}
            disabled={isLoading}
            className="flex-1 bg-olive-light text-white hover:bg-olive-dark disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? "추가 중..." : "바로추가"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IngredientPackCard;
