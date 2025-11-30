import React from "react";

import { Check } from "lucide-react";

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
  return (
    <div className="flex items-center rounded-lg border bg-white p-3 shadow-sm">
      <div className="mr-3 h-12 w-12 flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-100">
        {ingredient.imageUrl && (
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            className="h-full w-full object-cover"
          />
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
          추가됨
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="border-olive-light text-olive-light hover:bg-olive-light hover:text-white"
          onClick={() => onAddClick(ingredient)}
        >
          추가
        </Button>
      )}
    </div>
  );
};

export default React.memo(IngredientListItem);
