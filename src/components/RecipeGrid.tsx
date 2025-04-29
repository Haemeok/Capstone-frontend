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
}: RecipeGridProps) => {
  if (isFetching) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Circle className="text-olive-light h-15 w-15" />
      </div>
    );
  }

  return (
    <div className="p-4">
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
          <p className="text-sm text-gray-400">모든 재료를 불러왔습니다.</p>
        )}
      </div>
      {noResults && (
        <p className="py-10 text-center text-gray-500">{noResultsMessage}</p>
      )}
    </div>
  );
};

export default RecipeGrid;
