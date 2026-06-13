"use client";

import React from "react";

import { Check } from "lucide-react";

import { useRecipeFormDict } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import { IngredientItem } from "@/entities/ingredient";

type IngredientListItemProps = {
  ingredient: IngredientItem;
  isAdded: boolean;
  onAddClick: (ingredient: IngredientItem) => void;
};

const IngredientListItem = ({
  ingredient,
  isAdded,
  onAddClick,
}: IngredientListItemProps) => {
  const { ui } = useRecipeFormDict();
  return (
    <div className="flex items-center rounded-lg border bg-white p-3 shadow-sm">
      <div className="rounded-card relative mr-3 h-16 w-16 flex-shrink-0 overflow-hidden bg-gray-100">
        {ingredient.imageUrl && (
          <Image src={ingredient.imageUrl} alt={ingredient.name} />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{ingredient.name}</p>
      </div>
      {isAdded ? (
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-1 text-gray-400"
          disabled
        >
          <Check size={16} />
          {ui.added}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="border-olive-light text-olive-light hover:bg-olive-light cursor-pointer hover:text-white"
          onClick={() => onAddClick(ingredient)}
        >
          {ui.add}
        </Button>
      )}
    </div>
  );
};

export default React.memo(IngredientListItem);
