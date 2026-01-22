"use client";

import Link from "next/link";

import { AnimatePresence } from "framer-motion";
import { ShoppingBasketIcon } from "lucide-react";

import { IngredientItem } from "@/entities/ingredient";

import { IngredientReportIcon } from "./IngredientReportIcon";

type IngredientListItemProps = {
  ingredient: IngredientItem;
  displayQuantity: string;
  displayUnit: string;
  displayPrice: string;
  isReportMode: boolean;
  onReport: (ingredient: IngredientItem) => void;
};

export const IngredientListItem = ({
  ingredient,
  displayQuantity,
  displayUnit,
  displayPrice,
  isReportMode,
  onReport,
}: IngredientListItemProps) => {
  return (
    <li className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] items-center gap-3">
      <p className="text-left font-bold">{ingredient.name}</p>

      <p className="whitespace-nowrap text-left">
        {displayQuantity}
        {displayQuantity !== "약간" && displayUnit}
      </p>

      <p className="text-right text-sm text-slate-500">{displayPrice}</p>

      <div className="flex items-center justify-center gap-1">
        <AnimatePresence>
          {isReportMode && (
            <IngredientReportIcon ingredient={ingredient} onReport={onReport} />
          )}
        </AnimatePresence>
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
