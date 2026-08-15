"use client";

import { Check } from "lucide-react";

import { format } from "@/shared/i18n/format";
import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { IngredientItem } from "@/entities/ingredient";

type FridgeIngredientCardProps = {
  ingredient: IngredientItem;
  isManageMode: boolean;
  isSelected: boolean;
  onToggle: (ingredient: IngredientItem) => void;
};

const cardClassName =
  "min-h-11 w-full rounded-2xl border border-gray-200 bg-white p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-light focus-visible:ring-offset-2";

export const FridgeIngredientCard = ({
  ingredient,
  isManageMode,
  isSelected,
  onToggle,
}: FridgeIngredientCardProps) => {
  const aria = useIngredientsDict().itemAria;
  const content = (
    <div className="flex min-w-0 items-center gap-2.5">
      <Image
        src={ingredient.imageUrl ?? ""}
        alt={ingredient.name}
        width={52}
        height={52}
        wrapperClassName="shrink-0 rounded-xl bg-gray-50"
      />
      <div className="min-w-0 flex-1">
        <p className="text-ink-muted truncate text-xs font-medium">
          {ingredient.category}
        </p>
        <p className="text-ink mt-0.5 truncate text-sm font-semibold">
          {ingredient.name}
        </p>
      </div>
      {isManageMode ? (
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            isSelected
              ? "border-olive-light bg-olive-light text-white"
              : "border-gray-300 bg-white text-transparent"
          )}
          aria-hidden
        >
          <Check className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );

  if (!isManageMode) {
    return (
      <LocalizedLink
        href={`/ingredients/${ingredient.id}`}
        aria-label={format(aria.detail, { name: ingredient.name })}
        className={cn(cardClassName, "block cursor-pointer active:bg-gray-50")}
      >
        {content}
      </LocalizedLink>
    );
  }

  const handleToggle = () => {
    triggerHaptic("Light");
    onToggle(ingredient);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={format(aria.select, { name: ingredient.name })}
      onClick={handleToggle}
      className={cn(
        cardClassName,
        "cursor-pointer",
        isSelected && "bg-olive-light/10"
      )}
    >
      {content}
    </button>
  );
};
