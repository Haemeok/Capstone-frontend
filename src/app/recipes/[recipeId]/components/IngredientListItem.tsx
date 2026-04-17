"use client";

import Link from "next/link";

import { Refrigerator, ShoppingBasketIcon } from "lucide-react";

import BadgeButton from "@/shared/ui/BadgeButton";

import { IngredientItem } from "@/entities/ingredient";

type IngredientListItemProps = {
  ingredient: IngredientItem;
  displayQuantity: string;
  displayUnit: string;
  displayPrice: string;
};

export const IngredientListItem = ({
  ingredient,
  displayQuantity,
  displayUnit,
  displayPrice,
}: IngredientListItemProps) => {
  return (
    <li className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] items-center gap-3">
      <div className="flex items-center gap-1.5 text-left">
        {ingredient.inFridge && (
          <BadgeButton
            badgeText="내 냉장고에 있는 재료예요"
            badgeIcon={
              <Refrigerator size={18} className="text-gray-500" />
            }
          />
        )}
        <p className="font-bold">{ingredient.name}</p>
      </div>

      <p className="whitespace-nowrap text-left">
        {displayQuantity}
        {displayQuantity !== "약간" && displayUnit}
      </p>

      <p className="text-right text-sm text-slate-500">{displayPrice}</p>

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
