import { RecipeGridItem as RecipeGridItemType } from '@/type/recipe';
import ToggleIconButton from './Button/ToggleIconButton';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import HeartButton from './Button/HeartButton';
import SuspenseImage from './Image/SuspenseImage';
import RecipeGridItem from './RecipeGridItem';
import Circle from './Icon/Circle';

type RecipeGridProps = {
  recipes: RecipeGridItemType[];
  isSimple?: boolean;
  height?: number;
  hasNextPage?: boolean;
  isFetching?: boolean;
  ref?: (node: Element | null) => void;
  noResults?: boolean;
  noResultsMessage?: string;
  lastPageMessage?: string;
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
        {recipes.map((recipe) => (
          <RecipeGridItem
            key={recipe.id}
            recipe={recipe}
            isSimple={isSimple}
            height={height}
          />
        ))}
      </div>
      <div ref={ref} className="h-10 text-center">
        {!hasNextPage && recipes.length && (
          <p className="text-sm text-gray-400">{lastPageMessage}</p>
        )}
      </div>
      {noResults && (
        <p className="py-10 text-center text-gray-500">{noResultsMessage}</p>
      )}
    </div>
  );
};

export default RecipeGrid;
