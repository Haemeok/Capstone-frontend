"use client";

import { Check, Plus } from "lucide-react";

import { format, useIngredientPickerDict } from "@/shared/i18n";
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
  const t = useIngredientPickerDict();
  const checked = isSelected || isAlreadyAdded;
  const accessibleLabel = isAlreadyAdded
    ? format(t.cardOwned, { name: ingredient.name })
    : format(isSelected ? t.cardDeselect : t.cardSelect, {
        name: ingredient.name,
      });

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
      aria-label={accessibleLabel}
      aria-pressed={isAlreadyAdded ? undefined : isSelected}
      className={cn(
        "flex w-full flex-col text-left",
        isAlreadyAdded ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
    >
      <div className="rounded-card relative aspect-square w-full overflow-hidden bg-gray-100">
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
            "absolute right-1.5 bottom-1.5 flex h-6 w-6 items-center justify-center rounded-md shadow-sm transition-colors",
            checked ? "bg-olive-light text-white" : "text-ink-muted bg-white"
          )}
        >
          {checked ? <Check size={14} /> : <Plus size={14} />}
        </span>
      </div>
      {ingredient.category && (
        <span className="text-ink-muted mt-2 block text-xs">
          {ingredient.category}
        </span>
      )}
      <span className="text-ink mt-0.5 block text-sm font-medium">
        {ingredient.name}
      </span>
      {isAlreadyAdded ? (
        <span className="text-ink-muted mt-0.5 text-xs">{t.owned}</span>
      ) : null}
    </button>
  );
};

export default IngredientPickerCard;
