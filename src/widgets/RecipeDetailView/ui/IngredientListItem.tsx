"use client";

import { Refrigerator } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { useT } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import BadgeButton from "@/shared/ui/BadgeButton";

import { IngredientItem } from "@/entities/ingredient";

import {
  INGREDIENT_FONT_CLASS,
  useStepFontSizeStore,
} from "@/features/recipe-step-font-size";

type IngredientListItemProps = {
  ingredient: IngredientItem;
  displayAmount: string;
  displayPrice: string;
  reserveFridgeSpace: boolean;
  locale: Locale;
  cartAction?: React.ReactNode;
};

export const IngredientListItem = ({
  ingredient,
  displayAmount,
  displayPrice,
  reserveFridgeSpace,
  locale,
  cartAction,
}: IngredientListItemProps) => {
  const t = useT();
  const fontLevel = useStepFontSizeStore((state) => state.level);
  const fontClass = INGREDIENT_FONT_CLASS[fontLevel];
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
      <p className={cn(fontClass, "font-semibold")}>{ingredient.name}</p>
    </div>
  );

  const quantityCell = (
    <p className={cn(fontClass, "text-left whitespace-nowrap")}>
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
      <div className="flex w-6 items-center justify-center">{cartAction}</div>
    </li>
  );
};
