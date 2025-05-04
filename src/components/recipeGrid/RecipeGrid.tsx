import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
} from '@/type/recipe';

import Circle from '../Icon/Circle';
import SimpleRecipeGridItem from './SimpleRecipeGridItem';
import DetailedRecipeGridItem from './DetailedRecipeGridItem';

type RecipeGridProps = {
  recipes: BaseRecipeGridItem[] | DetailedRecipeGridItemType[];
  isSimple?: boolean;
  height?: number;
  hasNextPage?: boolean;
  isFetching?: boolean;
  ref?: (node: Element | null) => void;
  noResults?: boolean;
  noResultsMessage?: string;
  lastPageMessage?: string;
  error?: Error | null;
};

const RecipeGrid = ({
  recipes,
  isSimple = false,
  height = 64,
  hasNextPage,
  isFetching,
  ref,
  noResults,
  noResultsMessage,
  lastPageMessage,
  error,
}: RecipeGridProps) => {
  if (isFetching) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Circle className="text-olive-light h-15 w-15" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-20">
      <div className="grid grid-cols-2 gap-4 gap-y-6">
        {recipes.map((recipe) =>
          isSimple ? (
            <SimpleRecipeGridItem
              key={recipe.id}
              recipe={recipe as BaseRecipeGridItem}
              height={height}
            />
          ) : (
            <DetailedRecipeGridItem
              key={recipe.id}
              recipe={recipe as DetailedRecipeGridItemType}
              height={height}
            />
          ),
        )}
      </div>
      <div ref={ref} className="h-10 text-center">
        {!hasNextPage &&
          recipes &&
          recipes.length === 0 &&
          !error &&
          !noResults && (
            <p className="text-sm text-gray-400">{lastPageMessage}</p>
          )}
      </div>
      {noResults && (
        <p className="py-10 text-center text-gray-500">{noResultsMessage}</p>
      )}
      {error && (
        <p className="py-10 text-center text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default RecipeGrid;
