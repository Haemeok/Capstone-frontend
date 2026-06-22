"use client";

import Link from "next/link";

import { Refrigerator, ShoppingBasketIcon } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";
import BadgeButton from "@/shared/ui/BadgeButton";

import { IngredientItem } from "@/entities/ingredient";

type IngredientListItemProps = {
  ingredient: IngredientItem;
  displayQuantity: string;
  displayUnit: string;
  displayPrice: string;
  reserveFridgeSpace: boolean;
  locale: Locale;
};

export const IngredientListItem = ({
  ingredient,
  displayQuantity,
  displayUnit,
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
      <p className="font-semibold">{ingredient.name}</p>
    </div>
  );

  const quantityCell = (
    <p className="text-left whitespace-nowrap">
      {displayQuantity}
      {displayQuantity !== "약간" && displayUnit}
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

      <div className="flex items-center justify-center gap-1">
        {ingredient.coupangLink ? (
          <Link
            href={ingredient.coupangLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rounded-md border border-gray-400 p-[2px]">
              <ShoppingBasketIcon className="text-gray-400" size={20} />
            </div>
          </Link>
        ) : (
          <div className="w-6" />
        )}
      </div>
    </li>
  );
};
