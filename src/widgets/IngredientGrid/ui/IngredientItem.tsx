"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
  const handleDeleteModeClick = () => {
    triggerHaptic("Light");
    setSelectedIngredientIds((prev) => {
      if (!prev.includes(ingredient.id)) {
        return [...prev, ingredient.id];
      } else {
        return prev.filter((id) => id !== ingredient.id);
      }
    });
  };

  const handleNavigateClick = () => {
    triggerHaptic("Light");
  };

  const tile = (
    <motion.div
      onClick={isDeleteMode ? handleDeleteModeClick : undefined}
      className={cn(
        "relative flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-2 py-3 transition-colors",
        isDeleteMode && "cursor-pointer",
        isSelected && "bg-olive-light/10 border-olive-light",
        !isDeleteMode && "active:bg-gray-50"
      )}
      whileTap={isDeleteMode ? { scale: 0.98 } : undefined}
    >
      <Image
        src={ingredient.imageUrl ?? ""}
        alt={ingredient.name}
        wrapperClassName="rounded-card"
        imgClassName="flex-shrink-0"
        width={50}
        height={50}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium text-gray-500">
          {ingredient.category}
        </span>
        <span className="text-sm font-bold break-words text-gray-900">
          {ingredient.name}
        </span>
      </div>
      {!isDeleteMode && (
        <ChevronRight
          size={16}
          className="flex-shrink-0 text-gray-400"
          aria-hidden
        />
      )}
      {isDeleteMode && (
        <motion.div
          className={cn(
            "absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
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

  if (isDeleteMode) {
    return tile;
  }

  return (
    <Link
      href={`/ingredients/${ingredient.id}`}
      onClick={handleNavigateClick}
      className="block"
      aria-label={`${ingredient.name} 상세 보기`}
    >
      {tile}
    </Link>
  );
};

export default IngredientItem;
