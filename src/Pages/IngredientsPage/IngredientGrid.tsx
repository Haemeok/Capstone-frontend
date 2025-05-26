import IngredientItem from '@/components/ingredient/IngredientItem';
import { IngredientItem as IngredientItemType } from '@/type/recipe';
import React from 'react';

type IngredientGridProps = {
  ingredients: IngredientItemType[];
  isDeleteMode: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  gridItemsContainerRef: React.RefObject<HTMLDivElement | null>;
  gridAnimateTargetRef: React.RefObject<HTMLDivElement | null>;
  ref: (node?: Element | null | undefined) => void;
  isLoggedIn: boolean;
};

const IngredientGrid = ({
  ingredients,
  isDeleteMode,
  isFetchingNextPage,
  hasNextPage,
  error,
  gridItemsContainerRef,
  gridAnimateTargetRef,
  ref,
  isLoggedIn,
}: IngredientGridProps) => {
  return isLoggedIn ? (
    <div className="flex grow flex-col gap-4" ref={gridItemsContainerRef}>
      <div
        ref={gridAnimateTargetRef}
        className="grid w-full grid-cols-2 gap-4 p-4"
      >
        {ingredients?.map((ingredient) => (
          <IngredientItem
            key={ingredient.id}
            ingredient={ingredient}
            isDeleteMode={isDeleteMode}
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
          오류 발생:{' '}
          {error instanceof Error ? error.message : '알 수 없는 오류'}
        </p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  ) : (
    <div className="flex h-full flex-col items-center justify-center">
      <p className="text-center text-sm text-gray-400">
        로그인 후 냉장고를 관리해보세요.
      </p>
    </div>
  );
};

export default IngredientGrid;
