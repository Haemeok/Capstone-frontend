import React from "react";

import { IngredientItem as IngredientItemType } from "@/entities/ingredient";

import IngredientsLoginCTA from "@/features/auth/ui/IngredientsLoginCTA";

import IngredientItem from "@/widgets/IngredientGrid/ui/IngredientItem";

type IngredientGridProps = {
  ingredients: IngredientItemType[];
  isDeleteMode: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  ref: (node?: Element | null | undefined) => void;
  isLoggedIn: boolean;
  setSelectedIngredientIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectedIngredientIds: number[];
};

const IngredientGrid = ({
  ingredients,
  isDeleteMode,
  isFetchingNextPage,
  hasNextPage,
  error,
  ref,
  isLoggedIn,
  setSelectedIngredientIds,
  selectedIngredientIds,
}: IngredientGridProps) => {
  return isLoggedIn ? (
    <div className="flex grow flex-col gap-4">
      <div className="grid w-full grid-cols-2 gap-4 p-4">
        {ingredients?.map((ingredient) => (
          <IngredientItem
            key={ingredient.id}
            ingredient={ingredient}
            isDeleteMode={isDeleteMode}
            setSelectedIngredientIds={setSelectedIngredientIds}
            isSelected={selectedIngredientIds.includes(ingredient.id)}
          />
        ))}
      </div>
      {isFetchingNextPage && (
        <p className="text-center text-gray-500">
          더 많은 재료를 불러오는 중...
        </p>
      )}
      {!hasNextPage && ingredients && ingredients.length === 0 && (
        <p className="text-center text-sm text-gray-400">
          모든 재료를 불러왔습니다.
        </p>
      )}
      {error && (
        <p className="text-center text-red-500">
          오류 발생:{" "}
          {error instanceof Error ? error.message : "알 수 없는 오류"}
        </p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  ) : (
    <IngredientsLoginCTA />
  );
};

export default IngredientGrid;
