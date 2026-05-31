"use client";

import { Check, Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { IngredientItem } from "@/entities/ingredient/model/types";

type IngredientPickerCardProps = {
  ingredient: IngredientItem;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  onToggle: (ingredient: IngredientItem) => void;
};

const IngredientPickerCard = ({
  ingredient,
  isSelected,
  isAlreadyAdded,
  onToggle,
}: IngredientPickerCardProps) => {
  const checked = isSelected || isAlreadyAdded;

  const handleToggle = () => {
    if (isAlreadyAdded) return;
    triggerHaptic("Light");
    onToggle(ingredient);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isAlreadyAdded}
      aria-label={`${ingredient.name} ${checked ? "선택 해제" : "선택"}`}
      className={cn(
        "flex w-full flex-col text-left",
        isAlreadyAdded ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        {ingredient.imageUrl && (
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            wrapperClassName="h-full w-full"
            fit="cover"
          />
        )}
        <span
          aria-hidden
          className={cn(
            "absolute right-1.5 bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-colors",
            checked ? "bg-olive-vivid text-white" : "bg-white text-gray-500"
          )}
        >
          {checked ? <Check size={14} /> : <Plus size={14} />}
        </span>
      </div>
      {ingredient.category && (
        <span className="mt-2 block text-xs text-gray-400">
          {ingredient.category}
        </span>
      )}
      <span className="mt-0.5 block text-sm font-medium text-gray-800">
        {ingredient.name}
      </span>
    </button>
  );
};

export default IngredientPickerCard;
