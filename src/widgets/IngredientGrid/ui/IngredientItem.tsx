"use client";

import { useState } from "react";
import { Image } from "@/shared/ui/image/Image";

import { cn } from "@/shared/lib/utils";

import { IngredientItem as IngredientItemType } from "@/entities/ingredient";

type IngredientItemProps = {
  ingredient: IngredientItemType;
  isDeleteMode: boolean;
  setSelectedIngredientIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const IngredientItem = ({
  ingredient,
  isDeleteMode,
  setSelectedIngredientIds,
}: IngredientItemProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);

    setSelectedIngredientIds((prev) => {
      if (newActiveState) {
        return [...prev, ingredient.id];
      } else {
        return prev.filter((id) => id !== ingredient.id);
      }
    });
  };

  return (
    <div
      onClick={isDeleteMode ? handleClick : undefined}
      className={cn(
        "relative flex items-center gap-4 rounded-lg border-[1.5px] border-gray-200 px-1 py-2",
        isDeleteMode && "cursor-pointer",
        isActive && "bg-olive-light/10 border-olive-light"
      )}
    >
      <Image
        src={ingredient.imageUrl ?? ""}
        alt={ingredient.name}
        wrapperClassName="rounded-md"
        imgClassName="flex-shrink-0"
        width={60}
        height={60}
      />
      <div className="flex min-w-0 flex-1 flex-col pr-8">
        <span className="text-xs text-gray-500">{ingredient.category}</span>
        <span className="text-sm font-bold break-words">{ingredient.name}</span>
      </div>
      {isDeleteMode && (
        <div
          className={cn(
            "absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-500",
            isActive && "border-[#5cc570] bg-[#5cc570]"
          )}
          role="checkbox"
          aria-checked={isActive}
          aria-label={`${ingredient.name} 선택`}
        >
          {isActive && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientItem;
