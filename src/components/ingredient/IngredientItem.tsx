import { IngredientItem as IngredientItemType } from "@/type/recipe";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ToggleIconButton from "../Button/ToggleIconButton";
import { cn } from "@/lib/utils";

type IngredientItemProps = {
  ingredient: IngredientItemType;
  isDeleteMode: boolean;
};

const IngredientItem = ({ ingredient, isDeleteMode }: IngredientItemProps) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-4 relative">
      <img
        src={ingredient.imageUrl}
        alt={ingredient.name}
        className="w-10 h-10 rounded-md"
      />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{ingredient.category}</span>
        <span className="text-sm font-semibold">{ingredient.name}</span>
      </div>
      {isDeleteMode && (
        <button
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "border-2 border-gray-500 rounded-full p-1 w-5 h-5 absolute right-4 top-4",
            isActive ? "bg-[#5cc570]" : ""
          )}
        />
      )}
    </div>
  );
};

export default IngredientItem;
