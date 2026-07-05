"use client";

import { Refrigerator } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";
import BadgeButton from "@/shared/ui/BadgeButton";

import { IngredientItem } from "@/entities/ingredient";

type IngredientListItemProps = {
  ingredient: IngredientItem;
  displayAmount: string;
  displayPrice: string;
  reserveFridgeSpace: boolean;
  locale: Locale;
};

export const IngredientListItem = ({
  ingredient,
  displayAmount,
  displayPrice,
  reserveFridgeSpace,
  locale,
}: IngredientListItemProps) => {
  const t = getDictionary(locale);
  const nameCell = (
    <div className="flex items-center gap-1.5 text-left">
      {ingredient.inFridge ? (
        <BadgeButton
          badgeText={t.recipeDetail.inFridgeBadge}
          badgeIcon={<Refrigerator size={18} className="text-ink-muted" />}
        />
      ) : reserveFridgeSpace ? (
        <span aria-hidden className="inline-block w-[18px] shrink-0" />
      ) : null}
      <p className="text-sm font-semibold md:text-base">{ingredient.name}</p>
    </div>
  );

  const quantityCell = (
    <p className="text-left text-sm whitespace-nowrap md:text-base">
      {displayAmount}
    </p>
  );

  if (locale !== "ko") {
    return (
      <li className="flex items-center justify-between gap-3">
        {nameCell}
        {quantityCell}
      </li>
    );
  }

  return (
    <li className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] items-center gap-3">
      {nameCell}
      {quantityCell}
      <p className="text-ink-muted text-right text-sm">{displayPrice}</p>
      <div className="w-6" />
    </li>
  );
};
