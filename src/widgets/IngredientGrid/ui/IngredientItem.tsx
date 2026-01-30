"use client";

import { AnimatePresence,motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { IngredientItem as IngredientItemType } from "@/entities/ingredient";

type IngredientItemProps = {
  ingredient: IngredientItemType;
  isDeleteMode: boolean;
  setSelectedIngredientIds: React.Dispatch<React.SetStateAction<string[]>>;
  isSelected: boolean;
};

const IngredientItem = ({
  ingredient,
  isDeleteMode,
  setSelectedIngredientIds,
  isSelected,
}: IngredientItemProps) => {
  const handleClick = () => {
    triggerHaptic("Light");
    setSelectedIngredientIds((prev) => {
      if (!prev.includes(ingredient.id)) {
        return [...prev, ingredient.id];
      } else {
        return prev.filter((id) => id !== ingredient.id);
      }
    });
  };

  return (
    <motion.div
      onClick={isDeleteMode ? handleClick : undefined}
      className={cn(
        "relative flex items-center gap-4 rounded-2xl bg-white px-3 py-3 shadow-sm transition-all",
        isDeleteMode && "cursor-pointer",
        isSelected && "ring-2 ring-olive-light bg-olive-light/5",
        !isDeleteMode && "hover:shadow-md hover:scale-[1.02]"
      )}
      whileTap={isDeleteMode ? { scale: 0.98 } : undefined}
    >
      <Image
        src={ingredient.imageUrl ?? ""}
        alt={ingredient.name}
        wrapperClassName="rounded-xl"
        imgClassName="flex-shrink-0"
        width={60}
        height={60}
      />
      <div className="flex min-w-0 flex-1 flex-col pr-8">
        <span className="text-xs font-medium text-gray-400">
          {ingredient.category}
        </span>
        <span className="break-words text-sm font-bold text-gray-900">
          {ingredient.name}
        </span>
      </div>
      {isDeleteMode && (
        <motion.div
          className={cn(
            "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
            isSelected
              ? "border-olive-light bg-olive-light"
              : "border-gray-300 bg-white"
          )}
          initial={false}
          animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`${ingredient.name} 선택`}
        >
          <AnimatePresence>
            {isSelected && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                width="14"
                height="14"
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
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default IngredientItem;
